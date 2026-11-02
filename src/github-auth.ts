import * as core from '@actions/core'

interface BotCredentials {
  token: string
  login: string
}

export function getBotCredentials(): BotCredentials {
  // These inputs carry the workflow token; custom credentials belong in BOT_GITHUB_TOKEN.
  const workflowToken =
    core.getInput('github-token') ||
    core.getInput('GITHUB_TOKEN') ||
    process.env.GITHUB_TOKEN ||
    ''
  const token = core.getInput('BOT_GITHUB_TOKEN') || workflowToken
  if (token === '') {
    throw new Error(
      'A GitHub token is required. Use github-token (defaults to github.token) or set BOT_GITHUB_TOKEN. No built-in bot credential is available.'
    )
  }

  const configuredLogin = core.getInput('BOT_LOGIN_NAME')
  return {
    token,
    // A custom token with the same prefix can belong to another GitHub App.
    login:
      configuredLogin || (token === workflowToken ? 'github-actions[bot]' : '')
  }
}
