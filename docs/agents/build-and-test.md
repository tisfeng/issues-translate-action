# 构建、测试与打包

本文件规定变更本 Action 时的本地验证。GitHub 事件、token 与真实外部副作用见
[`github-action.md`](github-action.md)。

## 基本事实

- `src/main.ts` 是 TypeScript 手写源码，`__tests__/main.test.ts` 是 Jest 行为测试。
- `npm run build` 生成被忽略的 `lib/main.js`；GitHub Action 实际执行的入口是
  [`action.yml`](../../action.yml) 中被跟踪的 `dist/index.js`。
- `npm run package` 使用 `ncc` 从 package main 打包运行时，并更新预期的 `dist/` 产物。
- `npm run all` 会执行写入式 `npm run format`，且不运行 test 或 lint，不能作为最终验证
  入口。

## 验证矩阵

| 变更 | 最低验证 |
| --- | --- |
| 任意仓库文件 | `git diff --check` |
| `src/**/*.ts` | `npm run format-check`、`npm test -- --runInBand`、`npm run build`、`npm run lint`、`npm run package`，并核对预期 `dist/` 差异 |
| `__tests__/**/*.ts` | `npm run format-check`、相关 Jest 测试、`npm run build` |
| runtime dependency、`package.json` 或 `package-lock.json` | format-check、test、build、lint、package，核对锁文件、bundle 与 license 产物 |
| `action.yml` | YAML 语法、输入字段、`runs.using`、`runs.main` 与目标 `dist/index.js` |
| `.github/workflows/**` | YAML 语法、事件、权限与外部副作用审查；不把 workflow 当作本地单元测试 |
| 仅 Agent/docs 文档 | Markdown 链接、TOML、`git diff --check` |

如果 lint 或其他检查已有失败基线，仍要运行并如实报告；不得声称检查通过，也不得新增失败。
未运行的检查必须说明原因。

## 产物同步

- 修改 `src/` 或运行时 dependency 后，必须运行 `npm run package` 并提交预期 `dist/`
  产物；不要手工编辑 `dist/index.js`、source map 或 license 文件。
- 测试必须覆盖行为而不是仅覆盖内部实现细节；变更事件、评论目标、标题更新、语言判断或
  翻译输出时，补充对应回归测试。
- 文档或治理规则改动不需要运行 npm build、test 或 package，除非同一任务还改动了运行时
  路径。
