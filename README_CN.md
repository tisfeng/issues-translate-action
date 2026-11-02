# Issues Translate Action  

按配置语言实时翻译 issue、PR Conversation 评论以及 PR Files changed 代码评论的 action。


## 快速使用    

默认使用 GitHub 自动提供的工作流 token，以 `github-actions[bot]` 身份发表评论，无需手动创建 token 或添加 Secret。
Action 不再内置公共机器人凭据。`github-token` 默认是 `${{ github.token }}`，可省略。
自定义机器人使用 `BOT_GITHUB_TOKEN`，它优先于默认工作流 token；自定义 PAT 的登录名留空时通过 `GET /user` 解析。
自定义 GitHub App installation token 必须同时设置对应的 `BOT_LOGIN_NAME`。

#### 创建一个github action     
> 在仓库的 .github/workflows/ 下创建 issue-translator.yml 如下:   

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
          # 非必须，默认 false。设为 true 时直接修改翻译后的 issue 标题。
          # 机器人账户必须拥有修改 issue 的权限。
          PRIMARY_LANGUAGE: en
          # 非必须，默认 en。非该语言的内容会翻译为此语言。
          SECONDARY_LANGUAGE: ''
          # 非必须，默认空。配置后，第一语言内容会翻译为该语言。
          CUSTOM_BOT_NOTE: Bot automatically translated this content.
          # 非必须，自定义机器人翻译评论的前缀。
````

当触发事件是 `pull_request_review_comment` 时，action 会直接在对应的 Files changed review thread 里回复翻译内容。

### 语言路由

`PRIMARY_LANGUAGE` 和 `SECONDARY_LANGUAGE` 使用 Google Translate 语言代码，
例如 `en`、`zh-CN`、`ja`。

- 不是 `PRIMARY_LANGUAGE` 的内容会翻译为第一语言。
- 已是 `PRIMARY_LANGUAGE` 的内容，在配置 `SECONDARY_LANGUAGE` 时会翻译为第二语言。
- 第二语言为空时，第一语言内容会被跳过。

默认的 `PRIMARY_LANGUAGE: en` 与空的 `SECONDARY_LANGUAGE` 保持原有的
“非英文翻译为英文、英文跳过”行为。若希望英文 review comment 翻译为简体中文，
同时其他语言仍翻译为英文，请配置：

````yaml
PRIMARY_LANGUAGE: en
SECONDARY_LANGUAGE: zh-CN
CUSTOM_BOT_NOTE: Bot automatically translated this content.
````

`IS_MODIFY_TITLE` 只决定 `issues(opened)` 事件中翻译后的标题是否直接覆盖原标题；
它不决定标题或评论是否需要翻译。

### 译文中的 Codex mention

为防止翻译机器人评论意外调用 Codex，生成评论中的独立 `@codex` 会在 `@` 后插入
零宽空格。它在 GitHub 页面上的显示不变，但不会成为 Codex 指令；需要调用 Codex
时，请手动输入原始命令。


## 高级自定义       

> 通过配置BOT_GITHUB_TOKEN使用自定义的机器人账户   
> 

1. 创建一个github账户作为您的机器人账户   

2. 使用此账户生成对应的token作为BOT_GITHUB_TOKEN      

3. 将BOT_GITHUB_TOKEN = ${token} 作为Secrets BOT_GITHUB_TOKEN = ${token} 配置到您的仓库中

4. 创建一个下面的github action(在仓库的 .github/workflows/ 下创建 issue-translator.yml 如下)         

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
          # 非必须，填写您的机器人github账户token
          BOT_LOGIN_NAME: your-bot-login
          # 非必须，建议不填写，机器人名称会根据token获取到，若填写，请一定与token对应的github账户名相同
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

