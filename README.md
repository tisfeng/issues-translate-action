# Issues Translate Action  

The action for translating issues, PR conversation comments, and PR review comments between configured languages.

[中文文档](README_CN.md)   

## Usage  

默认使用 GitHub 自动提供的工作流 token，以 `github-actions[bot]` 身份发表评论，无需手动创建 token 或添加 Secret。
Action 不再内置公共机器人凭据。`github-token` 默认是 `${{ github.token }}`，可省略。
自定义机器人使用 `BOT_GITHUB_TOKEN`，它优先于默认工作流 token；自定义 PAT 的登录名留空时通过 `GET /user` 解析。
自定义 GitHub App installation token 必须同时设置对应的 `BOT_LOGIN_NAME`。

#### Create a workflow from this action   

> Create file issue-translator.yml in .github/workflows/     

````
name: 'issue-translator'
on: 
  issue_comment: 
    types: [created]
  issues: 
    types: [opened]
  pull_request_review_comment:
    types: [created]

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      issues: write
      pull-requests: write
    steps:
      - uses: tisfeng/issues-translate-action@v2.9.3
        with:
          IS_MODIFY_TITLE: false
          # Optional, default false. If true, update a translated issue title directly.
          # The bot account must have permission to modify issues.
          PRIMARY_LANGUAGE: en
          # Optional, default en. Content not written in this language is translated into it.
          SECONDARY_LANGUAGE: ''
          # Optional, default empty. Primary-language content is translated into it when configured.
          CUSTOM_BOT_NOTE: Bot automatically translated this content.
          # Optional. Customize the translation robot prefix message.
```` 

When the trigger comes from `pull_request_review_comment`, the action replies in the same Files changed review thread with the translated content.

### Language routing

`PRIMARY_LANGUAGE` and `SECONDARY_LANGUAGE` use Google Translate language
codes, such as `en`, `zh-CN`, and `ja`.

- Content not written in `PRIMARY_LANGUAGE` is translated into it.
- Content already written in `PRIMARY_LANGUAGE` is translated into
  `SECONDARY_LANGUAGE` when it is configured.
- Content already written in `PRIMARY_LANGUAGE` is skipped when
  `SECONDARY_LANGUAGE` is empty.

The default `PRIMARY_LANGUAGE: en` and empty `SECONDARY_LANGUAGE` preserve the
original non-English-to-English behavior. For English review comments to be
translated into Simplified Chinese while other languages continue to translate
into English, set:

````yaml
PRIMARY_LANGUAGE: en
SECONDARY_LANGUAGE: zh-CN
CUSTOM_BOT_NOTE: Bot automatically translated this content.
````

`IS_MODIFY_TITLE` only controls whether a translated title from an
`issues(opened)` event replaces the original title. It does not control whether
the title or comment is translated.

### Codex mentions in translated comments

To prevent a translated bot comment from unintentionally invoking Codex, an
independent `@codex` in a generated comment has a zero-width space inserted
after `@`. It looks the same in GitHub, but it is not a Codex command. Enter
the original command manually when you intend to invoke Codex.


## Advanced Custom   

> Use your own bot by add BOT_GITHUB_TOKEN   
> 

1. Create a new github account as your bot  

2. Use the account to generate a new token as BOT_GITHUB_TOKEN  

3. Add the Secrets BOT_GITHUB_TOKEN = ${token} in your project  

4. Create a workflow from this action(Create file issue-translator.yml in .github/workflows/)    

````
name: 'issue-translator'
on: 
  issue_comment: 
    types: [created]
  issues: 
    types: [opened]
  pull_request_review_comment:
    types: [created]

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      issues: write
      pull-requests: write
    steps:
      - uses: tisfeng/issues-translate-action@v2.9.3
        with:
          BOT_GITHUB_TOKEN: ${{ secrets.BOT_GITHUB_TOKEN }} 
          # Required, input your bot github token
          BOT_LOGIN_NAME: your-bot-login
          # Not required, suggest not input, action will get name from BOT_GITHUB_TOKEN
          # If input, BOT name must match github token
          PRIMARY_LANGUAGE: en
          SECONDARY_LANGUAGE: ''
          CUSTOM_BOT_NOTE: Bot automatically translated this content.
````


### 认证与权限

默认 token 只用于当前仓库，工作流必须授予 `issues: write` 和 `pull-requests: write`，分别用于 issue/PR conversation 评论及 review thread 回复。
缺少 token 时 action 会在语言检测、翻译和 GitHub 写入前失败。
兼容已有的 `GITHUB_TOKEN` 输入或环境变量；优先级为 `BOT_GITHUB_TOKEN` → `github-token` → `GITHUB_TOKEN` 输入 → `GITHUB_TOKEN` 环境变量。
由于 `github-token` 有默认值，若需使用兼容项，请显式设置 `github-token: ''`；PAT 或自定义 App 凭据应始终通过 `BOT_GITHUB_TOKEN` 配置。
使用默认工作流 token 发表的评论不会再次触发 `issue_comment` 工作流；需要触发后续自动化时请使用自己的机器人凭据。
凭据必须通过 GitHub 自动 token 或 Secrets 提供，不得提交到源码。

## DEMO  

![action-sample](dist/action-sample.png)   

## Who Use the Action?  

1. [hertzbeat](https://github.com/dromara/hertzbeat) **Create By Us** - A real-time monitoring system with custom-monitor and agentless.
2. [sureness](https://github.com/dromara/sureness) **Create By Us** - A simple and efficient security framework that focus on protection of API.
3. [go-zero](https://github.com/zeromicro/go-zero) - A cloud-native Go microservices framework with cli tool for productivity.
4. [dashy](https://github.com/Lissy93/dashy) - A self-hostable personal dashboard built for you.
5. [wails](https://github.com/wailsapp/wails) - Create beautiful applications using Go
6. [seata-go](https://github.com/seata/seata-go) - Go Implementation For Seata
7. [rainbond](https://github.com/goodrain/rainbond) - Cloud native multi cloud application management platform
8. [adempiere](https://github.com/adempiere/adempiere) - ADempiere Business Suite done the Bazaar way in an open and unabated fashion.
9. [carbon](https://github.com/golang-module/carbon) - A simple, semantic and developer-friendly golang package for datetime
10. [tabby](https://github.com/Eugeny/tabby) - A terminal for a more modern age
11. [gorse](https://github.com/gorse-io/gorse) - An open source recommender system service written in Go

**Have Fun!**  


## Contributors ✨ 

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="http://hertzbeat.com"><img src="https://avatars.githubusercontent.com/u/24788200?v=4?s=100" width="100px;" alt="tomsun28"/><br /><sub><b>tomsun28</b></sub></a><br /><a href="https://github.com/usthe/issues-translate-action/commits?author=tomsun28" title="Code">💻</a> <a href="#content-tomsun28" title="Content">🖋</a></td>
      <td align="center"><a href="https://allcontributors.org"><img src="https://avatars.githubusercontent.com/u/46410174?v=4?s=100" width="100px;" alt="All Contributors"/><br /><sub><b>All Contributors</b></sub></a><br /><a href="https://github.com/usthe/issues-translate-action/commits?author=all-contributors" title="Documentation">📖</a></td>
      <td align="center"><a href="https://dev.to/chenquan"><img src="https://avatars.githubusercontent.com/u/20548053?v=4?s=100" width="100px;" alt="chen quan"/><br /><sub><b>chen quan</b></sub></a><br /><a href="https://github.com/usthe/issues-translate-action/commits?author=chenquan" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
