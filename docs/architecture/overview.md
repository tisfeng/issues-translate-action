# 运行架构概览

## 目标与入口

本项目是 Node 24 GitHub Action。[`action.yml`](../../action.yml) 将运行时入口指向
被跟踪的 `dist/index.js`；该产物由 `src/main.ts` 经 TypeScript 与 `ncc` 打包而来。

## 事件到翻译的流程

1. `run()` 仅接受 `issue_comment(created)`、`issues(opened)` 和
   `pull_request_review_comment(created)`。
2. `getTranslationContext()` 从事件 payload 取得 issue/PR 编号、作者、评论、可选标题和
   评论目标。review comment 使用原 thread 回复；其他情况创建 issue 评论。
3. `getTranslationTarget()` 先调用 `getLanguageDetectionText()` 去除 HTTP(S) URL，
   再用 `franc-min` 判断语言。不是 `PRIMARY_LANGUAGE` 的内容翻译为第一语言；第一
   语言内容在配置 `SECONDARY_LANGUAGE` 时翻译为第二语言，否则跳过。无法判断时仍尝试
   翻译为第一语言。
4. `langs` 将 Google Translate 语言代码归一化为 `franc-min` 的检测代码，并为中文等
   宏语言补充别名，避免直接比较 `en` 与 `eng`、`zh-CN` 与 `cmn`。
5. 标题和评论分别选择目标语言；目标相同时使用内部 `@@====` 分隔符合并为一次批量
   翻译，目标不同时分别翻译。所有翻译成功后才执行 GitHub 写入。
6. 翻译结果用于更新标题或生成机器人回复。自定义 token 会查询或比对机器人登录名，
   机器人自身产生的事件在翻译请求前跳过。
7. 生成评论后、写回 GitHub 前会在独立的 `@codex` 的 `@` 后插入零宽空格。页面仍显示
   原有文字，但自动译文不会成为 Codex 指令；该处理覆盖 issue 评论和 review thread 回复。

## 主要边界

- `src/main.ts` 是手写行为事实源；`__tests__/main.test.ts` mock GitHub、翻译和语言检测
  依赖，验证事件、格式、识别与翻译辅助逻辑。
- Markdown 原文用于翻译和回写。语言检测仅剔除 URL，避免图片/链接地址将可见正文
  误判为另一种语言。
- `dist/` 是被跟踪的发布运行时，不是手工维护的源码。变更源码或 runtime dependency 后
  必须重新打包。
- 当前 `.github/workflows/action-test.yml` 会在真实 GitHub 事件中运行本 Action；它不是
  无副作用的常规 CI。
