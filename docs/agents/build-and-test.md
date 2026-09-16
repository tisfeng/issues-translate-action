# 构建与测试

本文件规定本 Action 的验证策略、测试和打包要求。运行时与外部副作用见
[`development.md`](development.md)。

## 验证原则

- 对有实际行为或正确性风险的变更添加或更新测试，优先覆盖生产行为和边界条件。
- 不为简单透传、明显 accessor、已有充分覆盖的行为或纯文档调整机械添加测试。
- 先运行与变更直接对应的检查；只有出现新变更、失败或未解决风险时才扩大或重复验证。
- 验证失败先诊断，在授权范围内修复并复验，不跳过必要检查，也不把环境阻塞写成产品通过。

## 验证矩阵

| 变更 | 最低验证 |
| --- | --- |
| 任意仓库文件 | `git diff --check` |
| `src/**/*.ts` | format-check、Jest、build、lint、package，并核对 `dist/` 差异 |
| `__tests__/**/*.ts` | format-check、相关 Jest 测试、build |
| runtime dependency、`package.json` 或 `package-lock.json` | format-check、test、build、lint、package，核对锁文件、bundle 与 license 产物 |
| `action.yml` | YAML、输入字段、`runs.using`、`runs.main` 与 `dist/index.js` |
| `.github/workflows/**` | YAML、事件、权限与外部副作用审查；不把 workflow 当作本地单元测试 |
| 仅 Agent/docs/受管资产 | Markdown 链接、TOML、JSON、受管快照检查与 `git diff --check` |

## 打包边界

- `npm run build` 生成被忽略的 `lib/main.js`；Action 实际入口是被跟踪的 `dist/index.js`。
- 修改 `src/` 或运行时 dependency 后，必须运行 `npm run package` 并提交预期 `dist/` 产物；
  不手工编辑 bundle、source map 或 license 文件。
- `npm run all` 会执行写入式 format，且不运行 test 或 lint，不能作为最终验证入口。
- 文档或治理规则改动不需要运行 npm build、test、lint 或 package，除非同一任务还改动运行时路径。
