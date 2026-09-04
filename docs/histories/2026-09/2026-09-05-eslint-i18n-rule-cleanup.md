# 清理 Action lint 规则误报

- 日期：2026-09-05
- 状态：completed
- 关联 Issue/PR：无
- 执行计划：无

## 用户目标

清除 GitHub Action 源码中 `i18n-text/no-en` 对英文 runner 日志产生的 lint 误报，并采用比逐条
suppression 更适合项目架构的规则配置。

## 设计意图

- Action 没有 runner 日志的国际化机制，保留英文日志与现有运行行为。
- 仅对 `src/**/*.ts` 关闭从 GitHub 网页项目预设继承的规则，保留其他推荐 lint 规则。

## 主要变更

- 在 `.eslintrc.json` 中仅对 `src/**/*.ts` 关闭继承的 `i18n-text/no-en`，保留其他
  `plugin:github/recommended` 规则。
- 删除 `src/main.ts` 中 6 条已失效的同规则局部 suppression，不修改任何日志内容、控制流或
  GitHub API 调用。
- 通过 `npm run package` 重新生成 `dist/index.js` 和 `dist/index.js.map`；
  `dist/licenses.txt` 未变化。

## 验证

- `jq -e . .eslintrc.json`、`npm run format-check`、`npm run build`、`npm run lint`、
  `npm run package` 和 `git diff --check` 通过。
- `npm test -- --runInBand` 通过，29 个测试通过；`ts-jest` 对 TypeScript 4.9.5 给出既有
  兼容性警告，但没有测试失败。
- `npm run lint` 从 6 条 `i18n-text/no-en` 错误变为 0 error。

## 后续事项

- 无。
