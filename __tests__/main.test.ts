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

jest.mock('@tomsun28/google-translate-api', () => jest.fn(), {virtual: true})
jest.mock('franc-min', () => jest.fn(() => 'cmn'), {virtual: true})

import * as github from '@actions/github'
import {
  buildTranslateBody,
  getTranslationContext,
  shouldHandleEvent
} from '../src/main'

describe('issues translate action helpers', () => {
  test('handles created pull request review comments', () => {
    expect(shouldHandleEvent('pull_request_review_comment', 'created')).toBe(true)
    expect(shouldHandleEvent('pull_request_review_comment', 'edited')).toBe(false)
  })

  test('extracts review comment translation context', () => {
    const context = {
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
    } as unknown as typeof github.context

    expect(getTranslationContext(context)).toEqual({
      issueNumber: 7,
      issueUser: 'contributor',
      originComment: '你好，麻烦看下这里',
      originTitle: null,
      commentTarget: {
        kind: 'pull_request_review_comment',
        pullNumber: 7,
        commentId: 99,
        htmlUrl:
          'https://github.com/owner/repo/pull/7#discussion_r3148663226'
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
})
