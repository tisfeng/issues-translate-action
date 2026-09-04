# 运行架构概览

## 目标与入口

本项目是 Node 24 GitHub Action。[`action.yml`](../../action.yml) 将运行时入口指向
被跟踪的 `dist/index.js`；该产物由 `src/main.ts` 经 TypeScript 与 `ncc` 打包而来。

## 事件到翻译的流程

1. `run()` 仅接受 `issue_comment(created)`、`issues(opened)` 和
   `pull_request_review_comment(created)`。
2. `getTranslationContext()` 从事件 payload 取得 issue/PR 编号、作者、评论、可选标题和
   评论目标。review comment 使用原 thread 回复；其他情况创建 issue 评论。
3. `isEnglishText()` 先调用 `getLanguageDetectionText()` 去除 HTTP(S) URL，再用
   `franc-min` 判断语言。结果为 `eng` 时跳过该部分；无法判断时仍尝试翻译。
4. 对需翻译的评论和标题使用内部 `@@====` 分隔符组合，调用 Google 网页批量翻译端点并
   目标语言设为英文。
5. 翻译结果按分隔符还原为评论和标题。标题可直接更新，或与评论一起作为机器人回复。
6. 使用自定义 token 时，Action 会查询或比对机器人登录名，并跳过机器人自己产生的事件。

## 主要边界

- `src/main.ts` 是手写行为事实源；`__tests__/main.test.ts` mock GitHub、翻译和语言检测
  依赖，验证事件、格式、识别与翻译辅助逻辑。
- Markdown 原文用于翻译和回写。语言检测仅剔除 URL，避免图片/链接地址将含中文正文的
  评论误判为英文。
- `dist/` 是被跟踪的发布运行时，不是手工维护的源码。变更源码或 runtime dependency 后
  必须重新打包。
- 当前 `.github/workflows/action-test.yml` 会在真实 GitHub 事件中运行本 Action；它不是
  无副作用的常规 CI。
