# 在语言识别前跳过机器人自身评论

- 状态：completed
- 创建日期：2026-09-16
- 负责人：Codex
- 关联 Issue/PR：[Easydict Issue #1318](https://github.com/tisfeng/Easydict/issues/1318)

## 背景

翻译机器人创建评论后会产生新的 `issue_comment(created)` 事件。原实现会在翻译请求前识别
机器人自身作者并退出，但作者判断位于语言识别之后，因此无效运行仍会执行本地检测并输出容易
被误解为再次翻译的日志。

## 任务摘要

- 意图模式：implementation
- 交付授权：auto-local-commit
- 安全状态：normal
- 同任务 history：[`../../histories/2026-09/2026-09-16-skip-self-comments-before-detection.md`](../../histories/2026-09/2026-09-16-skip-self-comments-before-detection.md)
- 禁止动作：未修改消费仓库 workflow，未引入 `GITHUB_TOKEN`，未触发真实 workflow、评论
  写入或翻译请求，未推送或发布。

## 完成内容

1. `run()` 现在先解析并比较机器人登录名，自身事件在语言识别前退出。
2. 登录名比较不区分大小写；自定义 token 未提供登录名时先通过 `GET /user` 解析身份。
3. 回归测试覆盖默认机器人的 issue/review 评论、显式配置身份、token 身份解析，并保留其他
   机器人继续翻译的既有覆盖。
4. 已同步架构说明，并由 `npm run package` 重新生成 `dist/index.js`。

## 验证

- [x] `npm run format-check`
- [x] `npm test -- --runInBand`（45 项通过）
- [x] `npm run build`
- [x] `npm run lint`
- [x] `npm run package`
- [x] `git diff --check`
- [x] 独立只读审查未发现缺陷

## 完成条件

- [x] 自身评论在语言识别前退出，相关 mock 均未调用。
- [x] 普通用户和其他机器人评论仍按现有语言路由翻译。
- [x] `dist` 与源码同步，执行计划已归档，并写入同任务 history。
