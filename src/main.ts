import * as core from '@actions/core'
import * as github from '@actions/github'
import translate from '@tomsun28/google-translate-api'
import franc from 'franc-min'

const ISSUE_COMMENT_EVENT = 'issue_comment'
const ISSUES_EVENT = 'issues'
const REVIEW_COMMENT_EVENT = 'pull_request_review_comment'
const COMMENT_TITLE_SEPARATOR = '@@===='
const DEFAULT_BOT_NOTE =
  "Bot detected the issue body's language is not English, translate it automatically. 👯👭🏻🧑‍🤝‍🧑👫🧑🏿‍🤝‍🧑🏻👩🏾‍🤝‍👨🏿👬🏿"
const DEFAULT_BOT_TOKEN_BASE64 =
  'Y2I4M2EyNjE0NThlMzIwMjA3MGJhODRlY2I5NTM0ZjBmYTEwM2ZlNg=='
const DEFAULT_BOT_LOGIN_NAME = 'Issues-translate-bot'

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

async function run(): Promise<void> {
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
    const isModifyTitle = core.getInput('IS_MODIFY_TITLE') === 'true'
    let translateOrigin = ''
    let needCommitComment = originComment !== null && originComment !== 'null'
    let needCommitTitle = originTitle !== null && originTitle !== 'null'

    if (originComment !== null && detectIsEnglish(originComment)) {
      needCommitComment = false
      core.info('Detect the issue comment body is english already, ignore.')
    }
    if (originTitle !== null && detectIsEnglish(originTitle)) {
      needCommitTitle = false
      core.info('Detect the issue title body is english already, ignore.')
    }
    if (!needCommitTitle && !needCommitComment) {
      core.info('Detect the issue do not need translated, return.')
      return
    }
    if (needCommitComment && needCommitTitle) {
      translateOrigin = `${originComment}${COMMENT_TITLE_SEPARATOR}${originTitle}`
    } else if (needCommitComment) {
      translateOrigin = originComment ?? ''
    } else {
      translateOrigin = `null${COMMENT_TITLE_SEPARATOR}${originTitle}`
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

    core.info(`translate origin body is: ${translateOrigin}`)

    const translateTmp = await translateIssueOrigin(translateOrigin)
    if (
      translateTmp === null ||
      translateTmp === '' ||
      translateTmp === translateOrigin
    ) {
      core.warning('The translateBody is null or same, ignore return.')
      return
    }

    const translateBody = translateTmp.split(COMMENT_TITLE_SEPARATOR)
    let translateComment: string | null = null
    let translateTitle: string | null = null

    core.info(`translate body is: ${translateTmp}`)

    if (translateBody.length === 1) {
      translateComment = translateBody[0].trim()
      if (translateComment === originComment) {
        needCommitComment = false
      }
    } else if (translateBody.length === 2) {
      translateComment = translateBody[0].trim()
      translateTitle = translateBody[1].trim()
      if (translateComment === originComment) {
        needCommitComment = false
      }
      if (translateTitle === originTitle) {
        needCommitTitle = false
      }
    } else {
      core.setFailed(`the translateBody is ${translateTmp}`)
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
    core.setFailed(error instanceof Error ? error.message : String(error))
  }
}

export function detectIsEnglish(body: string | null): boolean {
  if (body === null) {
    return true
  }
  const detectResult = franc(body)
  if (
    detectResult === 'und' ||
    detectResult === undefined ||
    detectResult === null
  ) {
    core.warning(`Can not detect the undetermined comment body: ${body}`)
    return false
  }
  core.info(`Detect comment body language result is: ${detectResult}`)
  return detectResult === 'eng'
}

async function translateIssueOrigin(body: string): Promise<string> {
  let result = ''
  try {
    const response = await translate(body, {to: 'en'})
    if (response.text !== body) {
      result = response.text
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    core.error(errorMessage)
    core.setFailed(errorMessage)
  }
  return result
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

  await octokit.issues.createComment({
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
  await octokit.issues.update({
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
