# 在语言识别前跳过机器人自身评论

- 日期：2026-09-16
- 状态：completed
- 关联 Issue/PR：[Easydict Issue #1318](https://github.com/tisfeng/Easydict/issues/1318)
- 执行计划：[`../../exec-plans/completed/2026-09-16-skip-self-comments-before-detection.md`](../../exec-plans/completed/2026-09-16-skip-self-comments-before-detection.md)

## 用户目标

保留独立翻译机器人和现有 workflow 触发方式，优化机器人自身评论的处理顺序，确保它们不会
再次进入语言识别、翻译或 GitHub 写入。

## 设计意图

- 以配置的机器人登录名为身份依据，不依赖正文相似度或排除所有机器人账号。
- 在解析翻译配置和检测语言前完成自身作者判断，消除无意义检测及容易误解的日志。
- 登录名比较不区分大小写；自定义 token 未提供登录名时仍通过 `GET /user` 解析身份。

## 主要变更

- `src/main.ts` 将机器人 token、登录名解析和自身作者判断移动到语言识别之前，并复用已创建的
  Octokit client。
- `__tests__/main.test.ts` 覆盖默认机器人的 issue/review 评论、显式配置登录名的大小写差异、
  自定义 token 身份解析，以及其他机器人继续翻译的既有行为。
- `docs/architecture/overview.md` 明确机器人自身事件在语言识别前跳过。
- 通过 `npm run package` 重新生成 `dist/index.js`。

## 验证

- `npm run format-check` 通过。
- `npm test -- --runInBand` 通过，45 项测试全部通过。
- `npm run build`、`npm run lint`、`npm run package` 与 `git diff --check` 通过。
- 未运行真实 GitHub workflow，未创建评论，未发起真实翻译请求。

## 后续事项

- 无。
