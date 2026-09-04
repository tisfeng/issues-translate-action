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

jest.mock('google-translate-api-x', () => jest.fn(), {virtual: true})
jest.mock('franc-min', () => jest.fn(() => 'cmn'), {virtual: true})

import * as github from '@actions/github'
import franc from 'franc-min'
import {
  buildTranslateBody,
  formatTranslationError,
  getLanguageDetectionText,
  getTranslationContext,
  isInputEnabled,
  isEnglishText,
  shouldHandleEvent,
  translateIssueOrigin
} from '../src/main'

describe('issues translate action helpers', () => {
  const mockedFranc = franc as jest.MockedFunction<typeof franc>
  const mockedTranslate = jest.requireMock(
    'google-translate-api-x'
  ) as jest.Mock

  beforeEach(() => {
    mockedFranc.mockReset()
    mockedFranc.mockReturnValue('cmn')
    mockedTranslate.mockReset()
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
})
