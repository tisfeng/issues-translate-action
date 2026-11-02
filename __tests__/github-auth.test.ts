jest.mock('@actions/core', () => ({getInput: jest.fn(() => '')}), {
  virtual: true
})

import * as core from '@actions/core'
import {getBotCredentials} from '../src/github-auth'

describe('GitHub authentication inputs', () => {
  const getInput = core.getInput as jest.MockedFunction<typeof core.getInput>
  const originalToken = process.env.GITHUB_TOKEN

  beforeEach(() => {
    getInput.mockReset()
    getInput.mockReturnValue('')
    delete process.env.GITHUB_TOKEN
  })

  afterEach(() => {
    if (originalToken === undefined) {
      delete process.env.GITHUB_TOKEN
    } else {
      process.env.GITHUB_TOKEN = originalToken
    }
  })

  function configure(inputs: Record<string, string>): void {
    getInput.mockImplementation(name => inputs[name] ?? '')
  }

  test('fails without credentials instead of using a public bot token', () => {
    expect(() => getBotCredentials()).toThrow('A GitHub token is required')
  })

  test.each(['github-token', 'GITHUB_TOKEN'])(
    'uses the %s workflow input without assuming a token prefix',
    input => {
      configure({[input]: 'workflow-token'})
      expect(getBotCredentials()).toEqual({
        token: 'workflow-token',
        login: 'github-actions[bot]'
      })
    }
  )

  test('falls back to the workflow environment token', () => {
    process.env.GITHUB_TOKEN = 'environment-token'
    expect(getBotCredentials()).toEqual({
      token: 'environment-token',
      login: 'github-actions[bot]'
    })
  })

  test('prefers the workflow input over legacy input and environment', () => {
    process.env.GITHUB_TOKEN = 'environment-token'
    configure({'github-token': 'workflow-token', GITHUB_TOKEN: 'legacy-token'})
    expect(getBotCredentials().token).toBe('workflow-token')
  })

  test('prefers the legacy input over the environment', () => {
    process.env.GITHUB_TOKEN = 'environment-token'
    configure({GITHUB_TOKEN: 'legacy-token'})
    expect(getBotCredentials().token).toBe('legacy-token')
  })

  test('prefers a custom PAT and leaves its login for the user API', () => {
    configure({
      BOT_GITHUB_TOKEN: 'custom-pat',
      'github-token': 'workflow-token'
    })
    expect(getBotCredentials()).toEqual({token: 'custom-pat', login: ''})
  })

  test('does not infer another GitHub App identity from its token prefix', () => {
    configure({
      BOT_GITHUB_TOKEN: 'ghs_custom-app-fixture',
      'github-token': 'ghs_workflow-fixture'
    })
    expect(getBotCredentials()).toEqual({
      token: 'ghs_custom-app-fixture',
      login: ''
    })
  })

  test('recognizes the workflow token passed through the custom input', () => {
    configure({BOT_GITHUB_TOKEN: 'workflow', 'github-token': 'workflow'})
    expect(getBotCredentials().login).toBe('github-actions[bot]')
  })

  test('preserves an explicit workflow bot login', () => {
    configure({'github-token': 'workflow', BOT_LOGIN_NAME: 'enterprise-bot'})
    expect(getBotCredentials().login).toBe('enterprise-bot')
  })
})
