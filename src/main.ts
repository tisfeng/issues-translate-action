import * as core from '@actions/core'
import * as github from '@actions/github'
import translate, {getCode} from 'google-translate-api-x'
import franc from 'franc-min'
import langs from 'langs'

const ISSUE_COMMENT_EVENT = 'issue_comment'
const ISSUES_EVENT = 'issues'
const REVIEW_COMMENT_EVENT = 'pull_request_review_comment'
const COMMENT_TITLE_SEPARATOR = '@@===='
const DUAL_PART_TRANSLATION = 2
const DEFAULT_PRIMARY_LANGUAGE = 'en'
// eslint-disable-next-line i18n-text/no-en
const DEFAULT_BOT_NOTE = 'Bot automatically translated this content.'
const DEFAULT_BOT_TOKEN_BASE64 =
  'Y2I4M2EyNjE0NThlMzIwMjA3MGJhODRlY2I5NTM0ZjBmYTEwM2ZlNg=='
const DEFAULT_BOT_LOGIN_NAME = 'Issues-translate-bot'
const URL_PATTERN = /https?:\/\/[^\s<>()]+(?:\([^\s<>()]*\)[^\s<>()]*)*/giu
const LANGUAGE_DETECTION_ALIASES: Record<string, string[]> = {
  zh: ['cmn', 'zho'],
  'zh-cn': ['cmn', 'zho'],
  'zh-tw': ['cmn', 'zho']
}

type Octokit = ReturnType<typeof github.getOctokit>

interface GithubUser {
  login: string
}

interface GithubIssue {
  number: number
  title?: string | null
  body?: string | null
  user: GithubUser
  html_url?: string
}

interface GithubComment {
  id: number
  body: string | null
  user: GithubUser
  html_url?: string
}

interface GithubPullRequest {
  number: number
  html_url?: string
}

interface IssueCommentTarget {
  kind: 'issue'
  issueNumber: number
  htmlUrl?: string
}

interface ReviewCommentTarget {
  kind: 'pull_request_review_comment'
  pullNumber: number
  commentId: number
  htmlUrl?: string
}

type CommentTarget = IssueCommentTarget | ReviewCommentTarget

interface TranslationContext {
  issueNumber: number
  issueUser: string
  originComment: string | null
  originTitle: string | null
  commentTarget: CommentTarget
}

export interface NormalizedLanguage {
  translateCode: string
  detectionCodes: string[]
}

export interface LanguageConfig {
  primary: NormalizedLanguage
  secondary: NormalizedLanguage | null
}

export function shouldHandleEvent(
  eventName: string,
  action: string | undefined
): boolean {
  return (
    (eventName === ISSUE_COMMENT_EVENT && action === 'created') ||
    (eventName === ISSUES_EVENT && action === 'opened') ||
    (eventName === REVIEW_COMMENT_EVENT && action === 'created')
  )
}

export function getTranslationContext(
  context: typeof github.context
): TranslationContext | null {
  const payload = context.payload as Record<string, unknown>

  if (context.eventName === ISSUE_COMMENT_EVENT) {
    const issue = payload.issue as GithubIssue
    const comment = payload.comment as GithubComment
    return {
      issueNumber: issue.number,
      issueUser: comment.user.login,
      originComment: comment.body,
      originTitle: null,
      commentTarget: {
        kind: 'issue',
        issueNumber: issue.number,
        htmlUrl: comment.html_url ?? issue.html_url
      }
    }
  }

  if (context.eventName === REVIEW_COMMENT_EVENT) {
    const pullRequest = payload.pull_request as GithubPullRequest
    const comment = payload.comment as GithubComment
    return {
      issueNumber: pullRequest.number,
      issueUser: comment.user.login,
      originComment: comment.body,
      originTitle: null,
      commentTarget: {
        kind: 'pull_request_review_comment',
        pullNumber: pullRequest.number,
        commentId: comment.id,
        htmlUrl: comment.html_url ?? pullRequest.html_url
      }
    }
  }

  if (context.eventName === ISSUES_EVENT) {
    const issue = payload.issue as GithubIssue
    return {
      issueNumber: issue.number,
      issueUser: issue.user.login,
      originComment: issue.body ?? null,
      originTitle: issue.title ?? null,
      commentTarget: {
        kind: 'issue',
        issueNumber: issue.number,
        htmlUrl: issue.html_url
      }
    }
  }

  return null
}

export function buildTranslateBody(
  translateComment: string | null,
  translateTitle: string | null,
  needCommitComment: boolean,
  needCommitTitle: boolean,
  isModifyTitle: boolean,
  botNote: string
): string | null {
  if (!needCommitComment) {
    if (!isModifyTitle && needCommitTitle && translateTitle !== null) {
      return ` 
> ${botNote}      
----  
**Title:** ${translateTitle}    
      `
    }

    return null
  }

  if (!isModifyTitle && needCommitTitle && translateTitle !== null) {
    return ` 
> ${botNote}      
----  
**Title:** ${translateTitle}    

${translateComment ?? ''}  
      `
  }

  return ` 
> ${botNote}         
----    
${translateComment ?? ''}  
      `
}

export function isInputEnabled(input: string): boolean {
  const normalizedInput = input.trim().toLowerCase()
  return (
    normalizedInput === 'true' ||
    normalizedInput === '1' ||
    normalizedInput === 'yes'
  )
}

export async function run(): Promise<void> {
  try {
    if (
      !shouldHandleEvent(
        github.context.eventName,
        github.context.payload.action
      )
    ) {
      core.info(
        `The action only supports issue_comment(created), issues(opened), and pull_request_review_comment(created); received ${github.context.eventName}(${github.context.payload.action}), return`
      )
      return
    }

    const translationContext = getTranslationContext(github.context)
    if (translationContext === null) {
      core.warning(
        'Can not resolve the translation context from the event payload.'
      )
      return
    }

    const {
      issueNumber,
      issueUser,
      originComment,
      originTitle,
      commentTarget
    } = translationContext

    let botNote = DEFAULT_BOT_NOTE
    const isModifyTitle = isInputEnabled(core.getInput('IS_MODIFY_TITLE'))
    const languageConfig = getLanguageConfig(
      core.getInput('PRIMARY_LANGUAGE'),
      core.getInput('SECONDARY_LANGUAGE')
    )
    const commentTargetLanguage = getTranslationTarget(
      originComment,
      languageConfig
    )
    const titleTargetLanguage = getTranslationTarget(
      originTitle,
      languageConfig
    )
    let needCommitComment = commentTargetLanguage !== null
    let needCommitTitle = titleTargetLanguage !== null

    if (!needCommitTitle && !needCommitComment) {
      core.info('Detect the issue do not need translated, return.')
      return
    }

    let botToken = core.getInput('BOT_GITHUB_TOKEN')
    let botLoginName = core.getInput('BOT_LOGIN_NAME')
    if (botToken === '') {
      botToken = Buffer.from(DEFAULT_BOT_TOKEN_BASE64, 'base64').toString()
      botLoginName = DEFAULT_BOT_LOGIN_NAME
    }

    const customBotMessage = core.getInput('CUSTOM_BOT_NOTE').trim()
    if (customBotMessage !== '') {
      botNote = customBotMessage
    }

    let octokit: Octokit | null = null
    if (botLoginName === '') {
      octokit = github.getOctokit(botToken)
      const botInfo = await octokit.request('GET /user')
      botLoginName = botInfo.data.login
    }
    if (botLoginName === issueUser) {
      core.info(
        `The comment user is bot ${botLoginName} himself, ignore return.`
      )
      return
    }

    let translateComment: string | null = null
    let translateTitle: string | null = null

    if (
      needCommitComment &&
      needCommitTitle &&
      commentTargetLanguage !== null &&
      commentTargetLanguage === titleTargetLanguage
    ) {
      const translateOrigin = `${originComment}${COMMENT_TITLE_SEPARATOR}${originTitle}`
      const translateTmp = await translateIssueOrigin(
        translateOrigin,
        commentTargetLanguage
      )
      if (translateTmp === '') {
        core.warning(
          // eslint-disable-next-line i18n-text/no-en
          'The translated content is empty or unchanged, ignore return.'
        )
        return
      }
      const translateBody = translateTmp.split(COMMENT_TITLE_SEPARATOR)

      if (translateBody.length !== DUAL_PART_TRANSLATION) {
        core.setFailed(
          // eslint-disable-next-line i18n-text/no-en
          `Translation failed: unexpected number of parts in translated body. Expected 2 parts, got ${translateBody.length}.`
        )
        return
      }

      translateComment = translateBody[0].trim()
      translateTitle = translateBody[1].trim()
    } else {
      if (needCommitComment && commentTargetLanguage !== null) {
        translateComment = await translateIssueOrigin(
          originComment ?? '',
          commentTargetLanguage
        )
      }
      if (needCommitTitle && titleTargetLanguage !== null) {
        translateTitle = await translateIssueOrigin(
          originTitle ?? '',
          titleTargetLanguage
        )
      }
    }

    if (translateComment === '' || translateComment === originComment) {
      needCommitComment = false
      translateComment = null
    }
    if (translateTitle === '' || translateTitle === originTitle) {
      needCommitTitle = false
      translateTitle = null
    }
    if (!needCommitTitle && !needCommitComment) {
      core.warning(
        // eslint-disable-next-line i18n-text/no-en
        'The translated content is empty or unchanged, ignore return.'
      )
      return
    }

    if (
      (needCommitComment && translateComment === null) ||
      (needCommitTitle && translateTitle === null)
    ) {
      core.setFailed(
        // eslint-disable-next-line i18n-text/no-en
        'Translation failed: a translated part is missing after target language selection.'
      )
      return
    }

    if (octokit === null) {
      octokit = github.getOctokit(botToken)
    }

    const translateCommentBody = buildTranslateBody(
      translateComment,
      translateTitle,
      needCommitComment,
      needCommitTitle,
      isModifyTitle,
      botNote
    )

    if (isModifyTitle && translateTitle !== null && needCommitTitle) {
      await modifyTitle(issueNumber, translateTitle, octokit)
    }

    if (translateCommentBody !== null) {
      await createComment(commentTarget, translateCommentBody, octokit)
    }

    core.setOutput('complete time', new Date().toTimeString())
  } catch (error: unknown) {
    core.setFailed(formatTranslationError(error))
  }
}

export function getLanguageDetectionText(body: string): string {
  return body.replace(URL_PATTERN, ' ')
}

export function getLanguageConfig(
  primaryInput: string,
  secondaryInput: string
): LanguageConfig {
  const primary = normalizeLanguage(
    primaryInput.trim() || DEFAULT_PRIMARY_LANGUAGE,
    'PRIMARY_LANGUAGE'
  )
  const secondaryValue = secondaryInput.trim()
  const secondary =
    secondaryValue === ''
      ? null
      : normalizeLanguage(secondaryValue, 'SECONDARY_LANGUAGE')

  if (
    secondary !== null &&
    secondary.translateCode.toLowerCase() ===
      primary.translateCode.toLowerCase()
  ) {
    throw new Error(
      'SECONDARY_LANGUAGE must be different from PRIMARY_LANGUAGE when it is configured.'
    )
  }

  return {primary, secondary}
}

export function getTranslationTarget(
  body: string | null,
  languageConfig: LanguageConfig
): string | null {
  if (body === null || body === 'null') {
    return null
  }

  const detectedLanguage = getDetectedLanguage(body)
  if (detectedLanguage === null) {
    return languageConfig.primary.translateCode
  }

  if (languageConfig.primary.detectionCodes.includes(detectedLanguage)) {
    if (languageConfig.secondary === null) {
      core.info(
        // eslint-disable-next-line i18n-text/no-en
        `Detect the content is already in ${languageConfig.primary.translateCode}, ignore.`
      )
      return null
    }

    return languageConfig.secondary.translateCode
  }

  return languageConfig.primary.translateCode
}

export function isEnglishText(body: string | null): boolean {
  if (body === null) {
    return true
  }

  return getDetectedLanguage(body) === 'eng'
}

export function getDetectedLanguage(body: string): string | null {
  const languageDetectionText = getLanguageDetectionText(body)
  const detectResult = franc(languageDetectionText)
  if (
    detectResult === 'und' ||
    detectResult === undefined ||
    detectResult === null
  ) {
    core.warning(`Can not detect the undetermined comment body: ${body}`)
    return null
  }
  core.info(`Detect comment body language result is: ${detectResult}`)
  return detectResult
}

export function formatTranslationError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)
  const errorName = error instanceof Error ? error.name : undefined
  const cause =
    error instanceof Error
      ? (error as Error & {cause?: unknown}).cause
      : undefined
  const response =
    typeof cause === 'object' && cause !== null
      ? (cause as {response?: {status?: unknown}}).response
      : undefined
  const status = response?.status
  const statusMessage = typeof status === 'number' ? `status=${status}` : ''
  const nameMessage = errorName && errorName !== 'Error' ? `${errorName}: ` : ''

  return [statusMessage, `${nameMessage}${message}`].filter(Boolean).join(': ')
}

export async function translateIssueOrigin(
  body: string,
  targetLanguage = DEFAULT_PRIMARY_LANGUAGE
): Promise<string> {
  const response = await translate(body, {
    to: targetLanguage,
    forceBatch: true,
    rejectOnPartialFail: true
  })

  return response.text === body ? '' : response.text
}

function normalizeLanguage(
  input: string,
  inputName: 'PRIMARY_LANGUAGE' | 'SECONDARY_LANGUAGE'
): NormalizedLanguage {
  if (input.toLowerCase() === 'auto') {
    throw new Error(`${inputName} cannot be auto.`)
  }

  const translateCode = getCode(input)
  if (translateCode === null) {
    throw new Error(
      `${inputName} is not a supported Google Translate language.`
    )
  }

  const languageCode = translateCode.split('-')[0].toLowerCase()
  const language =
    langs.where('1', languageCode) ?? langs.where('3', languageCode)

  const aliases = [
    ...(LANGUAGE_DETECTION_ALIASES[translateCode.toLowerCase()] ?? []),
    ...(LANGUAGE_DETECTION_ALIASES[languageCode] ?? [])
  ]

  return {
    translateCode,
    detectionCodes: Array.from(
      new Set([language?.['3'] ?? languageCode, ...aliases])
    )
  }
}

async function createComment(
  commentTarget: CommentTarget,
  body: string,
  octokit: Octokit
): Promise<void> {
  const {owner, repo} = github.context.repo

  if (commentTarget.kind === 'pull_request_review_comment') {
    await octokit.request(
      'POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies',
      {
        owner,
        repo,
        pull_number: commentTarget.pullNumber,
        comment_id: commentTarget.commentId,
        body
      }
    )
    core.info(
      `complete to push translate review comment: ${body} in ${
        commentTarget.htmlUrl ?? ''
      } `
    )
    return
  }

  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: commentTarget.issueNumber,
    body
  })
  core.info(
    `complete to push translate issue comment: ${body} in ${
      commentTarget.htmlUrl ?? ''
    } `
  )
}

async function modifyTitle(
  issueNumber: number,
  title: string,
  octokit: Octokit
): Promise<void> {
  const {owner, repo} = github.context.repo
  const issueUrl = github.context.payload.issue?.html_url ?? ''
  await octokit.rest.issues.update({
    owner,
    repo,
    issue_number: issueNumber,
    title
  })
  core.info(
    `complete to modify translate issue title: ${title} in ${issueUrl} `
  )
}

if (require.main === module) {
  run()
}
