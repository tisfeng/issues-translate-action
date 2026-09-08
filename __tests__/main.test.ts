jest.mock(
  '@actions/core',
  () => ({
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    setFailed: jest.fn(),
    setOutput: jest.fn(),
    getInput: jest.fn(() => '')
  }),
  {virtual: true}
)

jest.mock(
  '@actions/github',
  () => ({
    context: {},
    getOctokit: jest.fn()
  }),
  {virtual: true}
)

jest.mock(
  'google-translate-api-x',
  () => {
    const translate = jest.fn() as jest.Mock & {getCode: jest.Mock}
    translate.getCode = jest.fn((input: string) => {
      const languageCodes: Record<string, string> = {
        en: 'en',
        'zh-CN': 'zh-CN',
        'zh-TW': 'zh-TW',
        ja: 'ja',
        ceb: 'ceb',
        auto: 'auto'
      }
      return languageCodes[input] ?? null
    })
    return translate
  },
  {virtual: true}
)
jest.mock('franc-min', () => jest.fn(() => 'cmn'), {virtual: true})

import * as core from '@actions/core'
import * as github from '@actions/github'
import franc from 'franc-min'
import {
  buildTranslateBody,
  formatTranslationError,
  getLanguageConfig,
  getLanguageDetectionText,
  getTranslationTarget,
  getTranslationContext,
  isInputEnabled,
  isEnglishText,
  neutralizeCodexMentions,
  run,
  shouldHandleEvent,
  translateIssueOrigin
} from '../src/main'

describe('issues translate action helpers', () => {
  const mockedFranc = franc as jest.MockedFunction<typeof franc>
  const mockedTranslate = jest.requireMock(
    'google-translate-api-x'
  ) as jest.Mock & {getCode: jest.Mock}
  const mockedGetCode = mockedTranslate.getCode
  const mockedCore = core as jest.Mocked<typeof core>
  const mockedGithub = github as jest.Mocked<typeof github>

  beforeEach(() => {
    mockedFranc.mockReset()
    mockedFranc.mockReturnValue('cmn')
    mockedTranslate.mockReset()
    mockedGetCode.mockReset()
    mockedGetCode.mockImplementation((input: string) => {
      const languageCodes: Record<string, string> = {
        en: 'en',
        'zh-CN': 'zh-CN',
        'zh-TW': 'zh-TW',
        ja: 'ja',
        ceb: 'ceb',
        auto: 'auto'
      }
      return languageCodes[input] ?? null
    })
    mockedCore.getInput.mockReset()
    mockedCore.getInput.mockReturnValue('')
    mockedCore.info.mockReset()
    mockedCore.warning.mockReset()
    mockedCore.setFailed.mockReset()
    mockedCore.setOutput.mockReset()
    mockedGithub.getOctokit.mockReset()
    Object.assign(mockedGithub.context, {eventName: '', payload: {}, repo: {}})
  })

  test('handles created pull request review comments', () => {
    expect(shouldHandleEvent('issue_comment', 'created')).toBe(true)
    expect(shouldHandleEvent('issues', 'opened')).toBe(true)
    expect(shouldHandleEvent('pull_request_review_comment', 'created')).toBe(
      true
    )
    expect(shouldHandleEvent('issue_comment', 'edited')).toBe(false)
    expect(shouldHandleEvent('pull_request_review_comment', 'edited')).toBe(
      false
    )
    expect(shouldHandleEvent('pull_request', 'opened')).toBe(false)
  })

  test('extracts review comment translation context', () => {
    const context = ({
      eventName: 'pull_request_review_comment',
      payload: {
        action: 'created',
        pull_request: {
          number: 7,
          html_url: 'https://github.com/owner/repo/pull/7'
        },
        comment: {
          id: 99,
          body: '你好，麻烦看下这里',
          html_url:
            'https://github.com/owner/repo/pull/7#discussion_r3148663226',
          user: {
            login: 'contributor'
          }
        }
      }
    } as unknown) as typeof github.context

    expect(getTranslationContext(context)).toEqual({
      issueNumber: 7,
      issueUser: 'contributor',
      originComment: '你好，麻烦看下这里',
      originTitle: null,
      commentTarget: {
        kind: 'pull_request_review_comment',
        pullNumber: 7,
        commentId: 99,
        htmlUrl: 'https://github.com/owner/repo/pull/7#discussion_r3148663226'
      }
    })
  })

  test('extracts issue comment translation context', () => {
    const context = ({
      eventName: 'issue_comment',
      payload: {
        action: 'created',
        issue: {
          number: 8,
          html_url: 'https://github.com/owner/repo/issues/8'
        },
        comment: {
          id: 100,
          body: '麻烦补充一下日志',
          html_url: 'https://github.com/owner/repo/issues/8#issuecomment-1',
          user: {
            login: 'reviewer'
          }
        }
      }
    } as unknown) as typeof github.context

    expect(getTranslationContext(context)).toEqual({
      issueNumber: 8,
      issueUser: 'reviewer',
      originComment: '麻烦补充一下日志',
      originTitle: null,
      commentTarget: {
        kind: 'issue',
        issueNumber: 8,
        htmlUrl: 'https://github.com/owner/repo/issues/8#issuecomment-1'
      }
    })
  })

  test('extracts issue creation translation context', () => {
    const context = ({
      eventName: 'issues',
      payload: {
        action: 'opened',
        issue: {
          number: 9,
          title: '修复构建问题',
          body: '请帮忙排查一下',
          html_url: 'https://github.com/owner/repo/issues/9',
          user: {
            login: 'author'
          }
        }
      }
    } as unknown) as typeof github.context

    expect(getTranslationContext(context)).toEqual({
      issueNumber: 9,
      issueUser: 'author',
      originComment: '请帮忙排查一下',
      originTitle: '修复构建问题',
      commentTarget: {
        kind: 'issue',
        issueNumber: 9,
        htmlUrl: 'https://github.com/owner/repo/issues/9'
      }
    })
  })

  test('builds a translated issue comment with title when title is not modified', () => {
    const comment = buildTranslateBody(
      'Please check this change.',
      'Fix build failure',
      true,
      true,
      false,
      'Bot note'
    )

    expect(comment).toContain('**Title:** Fix build failure')
    expect(comment).toContain('Please check this change.')
  })

  test('builds a title-only translation comment when there is no body', () => {
    const comment = buildTranslateBody(
      null,
      'Fix build failure',
      false,
      true,
      false,
      'Bot note'
    )

    expect(comment).toContain('**Title:** Fix build failure')
    expect(comment).not.toContain('null')
  })

  test('builds a comment-only translation when title handling is not needed', () => {
    const comment = buildTranslateBody(
      'Please add a test.',
      null,
      true,
      false,
      false,
      'Bot note'
    )

    expect(comment).toContain('Please add a test.')
    expect(comment).not.toContain('**Title:**')
  })

  test('omits title from comment body when title is modified directly', () => {
    const comment = buildTranslateBody(
      'Please check this change.',
      'Fix build failure',
      true,
      true,
      true,
      'Bot note'
    )

    expect(comment).toContain('Please check this change.')
    expect(comment).not.toContain('**Title:**')
  })

  test('returns null when nothing should be posted', () => {
    expect(
      buildTranslateBody(null, null, false, false, false, 'Bot note')
    ).toBeNull()
  })

  test('neutralizes standalone Codex mentions without changing their visible text', () => {
    expect(
      neutralizeCodexMentions(
        '请运行 @codex review，然后执行 @CODEX security review。'
      )
    ).toBe(
      '请运行 @\u200Bcodex review，然后执行 @\u200BCODEX security review。'
    )
  })

  test('preserves email addresses, longer logins, and other mentions', () => {
    const body =
      'Contact maintainer@codex.example, @codex-helper, @codex123, @codex_dev, and @reviewer.'

    expect(neutralizeCodexMentions(body)).toBe(body)
  })

  test('does not add another zero-width space to an already neutralized Codex mention', () => {
    const body = '@\u200Bcodex review'

    expect(neutralizeCodexMentions(neutralizeCodexMentions(body))).toBe(body)
  })

  test('parses boolean-like inputs', () => {
    expect(isInputEnabled('true')).toBe(true)
    expect(isInputEnabled('TRUE')).toBe(true)
    expect(isInputEnabled('1')).toBe(true)
    expect(isInputEnabled('yes')).toBe(true)
    expect(isInputEnabled(' no ')).toBe(false)
    expect(isInputEnabled('')).toBe(false)
  })

  test('detects english text', () => {
    mockedFranc.mockReturnValue('eng')

    expect(isEnglishText('Please review this change.')).toBe(true)
  })

  test('detects non-english text', () => {
    mockedFranc.mockReturnValue('cmn')

    expect(isEnglishText('请帮忙看一下这里')).toBe(false)
  })

  test('removes URLs before detecting the language of markdown content', () => {
    const body =
      '![中文截图](https://github.com/owner/repo/assets/12345678/abcdef)\n这是一条中文评论。'

    expect(getLanguageDetectionText(body)).toBe(
      '![中文截图]( )\n这是一条中文评论。'
    )

    mockedFranc.mockReturnValue('cmn')
    expect(isEnglishText(body)).toBe(false)
    expect(mockedFranc).toHaveBeenCalledWith(
      '![中文截图]( )\n这是一条中文评论。'
    )
  })

  test('keeps visible English markdown text when removing its URL', () => {
    const body =
      '![screenshot](https://github.com/owner/repo/assets/12345678/abcdef)\nPlease review this change.'

    expect(getLanguageDetectionText(body)).toBe(
      '![screenshot]( )\nPlease review this change.'
    )

    mockedFranc.mockReturnValue('eng')
    expect(isEnglishText(body)).toBe(true)
  })

  test('treats null text as already handled', () => {
    expect(isEnglishText(null)).toBe(true)
  })

  test('uses English as the default primary language and disables secondary translation by default', () => {
    expect(getLanguageConfig('', '   ')).toEqual({
      primary: {translateCode: 'en', detectionCodes: ['eng']},
      secondary: null
    })
  })

  test('routes English to the configured secondary language and other languages to the primary language', () => {
    const languageConfig = getLanguageConfig('en', 'zh-CN')

    mockedFranc.mockReturnValue('eng')
    expect(
      getTranslationTarget('Please review this change.', languageConfig)
    ).toBe('zh-CN')

    mockedFranc.mockReturnValue('cmn')
    expect(getTranslationTarget('请检查这个改动。', languageConfig)).toBe('en')
  })

  test('recognizes Chinese primary-language variants and translates English to the secondary language', () => {
    const languageConfig = getLanguageConfig('zh-CN', 'en')

    mockedFranc.mockReturnValue('cmn')
    expect(getTranslationTarget('这是一条中文评论。', languageConfig)).toBe(
      'en'
    )

    mockedFranc.mockReturnValue('eng')
    expect(
      getTranslationTarget('Please review this change.', languageConfig)
    ).toBe('zh-CN')
  })

  test('accepts Google language codes without a standard ISO mapping', () => {
    const languageConfig = getLanguageConfig('ceb', '')

    mockedFranc.mockReturnValue('ceb')
    expect(getTranslationTarget('Cebuano content.', languageConfig)).toBeNull()
  })

  test('falls back to the primary language when detection is undetermined', () => {
    mockedFranc.mockReturnValue('und')

    expect(
      getTranslationTarget('short', getLanguageConfig('en', 'zh-CN'))
    ).toBe('en')
  })

  test('rejects invalid, automatic, and identical configured target languages', () => {
    expect(() => getLanguageConfig('invalid', '')).toThrow(
      'PRIMARY_LANGUAGE is not a supported Google Translate language.'
    )
    expect(() => getLanguageConfig('auto', '')).toThrow(
      'PRIMARY_LANGUAGE cannot be auto.'
    )
    expect(() => getLanguageConfig('en', 'en')).toThrow(
      'SECONDARY_LANGUAGE must be different from PRIMARY_LANGUAGE when it is configured.'
    )
  })

  test('translates with the batch endpoint options and returns response text', async () => {
    mockedTranslate.mockResolvedValue({text: 'Please review this change.'})

    await expect(translateIssueOrigin('请检查这个改动。')).resolves.toBe(
      'Please review this change.'
    )
    expect(mockedTranslate).toHaveBeenCalledWith('请检查这个改动。', {
      to: 'en',
      forceBatch: true,
      rejectOnPartialFail: true
    })
  })

  test('translates to an explicitly selected target language', async () => {
    mockedTranslate.mockResolvedValue({text: '请检查这个改动。'})

    await expect(
      translateIssueOrigin('Please review this change.', 'zh-CN')
    ).resolves.toBe('请检查这个改动。')
    expect(mockedTranslate).toHaveBeenCalledWith('Please review this change.', {
      to: 'zh-CN',
      forceBatch: true,
      rejectOnPartialFail: true
    })
  })

  test('returns an empty string when translation equals the original text', async () => {
    mockedTranslate.mockResolvedValue({text: 'Already English.'})

    await expect(translateIssueOrigin('Already English.')).resolves.toBe('')
  })

  test('propagates a rejected batch translation request', async () => {
    const error = new Error('Too Many Requests')
    mockedTranslate.mockRejectedValue(error)

    await expect(translateIssueOrigin('请检查这个改动。')).rejects.toBe(error)
  })

  test('includes the nested HTTP status in a translation error', () => {
    const error = Object.assign(new Error('Too Many Requests'), {
      cause: {response: {status: 429}}
    })

    expect(formatTranslationError(error)).toBe('status=429: Too Many Requests')
  })

  test('translates a mixed-language issue title and body separately', async () => {
    const createComment = jest.fn()
    const update = jest.fn()
    const octokit = {
      rest: {issues: {createComment, update}}
    }
    mockedCore.getInput.mockImplementation((name: string) => {
      const inputs: Record<string, string> = {
        BOT_GITHUB_TOKEN: 'token',
        BOT_LOGIN_NAME: 'translator-bot',
        PRIMARY_LANGUAGE: 'en',
        SECONDARY_LANGUAGE: 'zh-CN',
        CUSTOM_BOT_NOTE: 'Custom translation note.'
      }
      return inputs[name] ?? ''
    })
    Object.assign(mockedGithub.context, {
      eventName: 'issues',
      repo: {owner: 'owner', repo: 'repo'},
      payload: {
        action: 'opened',
        issue: {
          number: 9,
          title: 'Fix build failure',
          body: '请检查这个改动。',
          user: {login: 'contributor'}
        }
      }
    })
    mockedGithub.getOctokit.mockReturnValue(
      (octokit as unknown) as ReturnType<typeof github.getOctokit>
    )
    mockedFranc.mockReturnValueOnce('cmn').mockReturnValueOnce('eng')
    mockedTranslate
      .mockResolvedValueOnce({text: 'Please check this change.'})
      .mockResolvedValueOnce({text: '修复构建失败'})

    await run()

    expect(mockedTranslate).toHaveBeenNthCalledWith(1, '请检查这个改动。', {
      to: 'en',
      forceBatch: true,
      rejectOnPartialFail: true
    })
    expect(mockedTranslate).toHaveBeenNthCalledWith(2, 'Fix build failure', {
      to: 'zh-CN',
      forceBatch: true,
      rejectOnPartialFail: true
    })
    expect(createComment).toHaveBeenCalledWith(
      expect.objectContaining({
        owner: 'owner',
        repo: 'repo',
        issue_number: 9,
        body: expect.stringContaining('Custom translation note.')
      })
    )
    expect(createComment.mock.calls[0][0].body).toContain(
      '**Title:** 修复构建失败'
    )
    expect(update).not.toHaveBeenCalled()
  })

  test('keeps one combined translation request when title and body share a target', async () => {
    const createComment = jest.fn()
    const octokit = {rest: {issues: {createComment}}}
    mockedCore.getInput.mockImplementation((name: string) => {
      const inputs: Record<string, string> = {
        BOT_GITHUB_TOKEN: 'token',
        BOT_LOGIN_NAME: 'translator-bot',
        PRIMARY_LANGUAGE: 'en'
      }
      return inputs[name] ?? ''
    })
    Object.assign(mockedGithub.context, {
      eventName: 'issues',
      repo: {owner: 'owner', repo: 'repo'},
      payload: {
        action: 'opened',
        issue: {
          number: 9,
          title: '修复构建问题',
          body: '请检查这个改动。',
          user: {login: 'contributor'}
        }
      }
    })
    mockedGithub.getOctokit.mockReturnValue(
      (octokit as unknown) as ReturnType<typeof github.getOctokit>
    )
    mockedFranc.mockReturnValue('cmn')
    mockedTranslate.mockResolvedValue({
      text: 'Please check this change.@@====Fix build failure'
    })

    await run()

    expect(mockedTranslate).toHaveBeenCalledTimes(1)
    expect(mockedTranslate).toHaveBeenCalledWith(
      '请检查这个改动。@@====修复构建问题',
      {
        to: 'en',
        forceBatch: true,
        rejectOnPartialFail: true
      }
    )
    expect(createComment).toHaveBeenCalledTimes(1)
  })

  test('does not translate an English comment created by the configured bot', async () => {
    mockedCore.getInput.mockImplementation((name: string) => {
      if (name === 'SECONDARY_LANGUAGE') {
        return 'zh-CN'
      }
      return ''
    })
    Object.assign(mockedGithub.context, {
      eventName: 'pull_request_review_comment',
      repo: {owner: 'owner', repo: 'repo'},
      payload: {
        action: 'created',
        pull_request: {number: 7},
        comment: {
          id: 99,
          body: 'Please review this change.',
          user: {login: 'Issues-translate-bot'}
        }
      }
    })
    mockedFranc.mockReturnValue('eng')

    await run()

    expect(mockedTranslate).not.toHaveBeenCalled()
    expect(mockedCore.setFailed).not.toHaveBeenCalled()
  })

  test('translates Codex issue comments but safely neutralizes their final reply body', async () => {
    const createComment = jest.fn()
    const octokit = {rest: {issues: {createComment}}}
    mockedCore.getInput.mockImplementation((name: string) => {
      const inputs: Record<string, string> = {
        BOT_GITHUB_TOKEN: 'token',
        BOT_LOGIN_NAME: 'Issues-translate-bot',
        PRIMARY_LANGUAGE: 'en',
        CUSTOM_BOT_NOTE: 'Translation of @codex content.'
      }
      return inputs[name] ?? ''
    })
    Object.assign(mockedGithub.context, {
      eventName: 'issue_comment',
      repo: {owner: 'owner', repo: 'repo'},
      payload: {
        action: 'created',
        issue: {number: 1283},
        comment: {
          id: 321,
          body: '请审查这个改动。',
          user: {login: 'chatgpt-codex-connector[bot]'}
        }
      }
    })
    mockedGithub.getOctokit.mockReturnValue(
      (octokit as unknown) as ReturnType<typeof github.getOctokit>
    )
    mockedFranc.mockReturnValue('cmn')
    mockedTranslate.mockResolvedValue({text: '@codex review this change.'})

    await run()

    expect(mockedTranslate).toHaveBeenCalledWith('请审查这个改动。', {
      to: 'en',
      forceBatch: true,
      rejectOnPartialFail: true
    })
    expect(createComment).toHaveBeenCalledTimes(1)
    const body = createComment.mock.calls[0][0].body as string
    expect(body).toContain('@\u200Bcodex review this change.')
    expect(body).toContain('Translation of @\u200Bcodex content.')
    expect(body).not.toContain('@codex review')
    expect(body).not.toContain('Translation of @codex content.')
    expect(mockedCore.setFailed).not.toHaveBeenCalled()
  })
})
