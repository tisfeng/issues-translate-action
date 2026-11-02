## 2026-11-02 | 任务：移植工作流 token 默认认证并准备 v2.9.3

**Links:** [上游 PR #109](https://github.com/dromara/issues-translate-action/pull/109)、[执行计划](../../exec-plans/active/2026-11-02-workflow-token-auth.md)

### 执行上下文

- **Agent Name:** `Unknown`
- **Model ID:** `Unknown`
- **Environment:** `macOS 27.0.1 / Xcode 27.2 (27B52)`

### 用户请求

移植认证变更，发布新版本，然后更新 Easydict 的 Action 依赖。

### 变更

- 删除内置共享机器人凭据，增加默认工作流 token 与兼容输入；自定义机器人输入保持优先。
- 工作流凭据直接使用 github-actions[bot]，自定义 PAT 保留 GET /user 解析，自定义 App 显式设置登录名。
- 增加输入优先级、缺少凭据、机器人自身事件及默认 token 发布评论的离线测试。
- 更新 Action 输入、示例 workflow 权限、README 与架构说明；发布产物由构建生成。

### 设计意图

移植上游安全修复，保留本 fork 的翻译、事件和运行时功能。不仅凭 token 前缀推断机器人身份；
自定义凭据专用 BOT_GITHUB_TOKEN，默认和兼容输入专用于工作流 token。
不推断旧凭据的撤销者、失效原因或具体时间。

### 验证

- 环境：Node v24.19.0 / npm 11.17.0。
- 默认 npm ci 因既有 ESLint peer dependency 冲突失败，改用锁文件和 --legacy-peer-deps；未修改依赖清单或锁文件。
- `npm ci --ignore-scripts --legacy-peer-deps --no-audit --no-fund`：成功；首次安装的附带 audit 查询耗时较长，终止后按同一锁文件禁用 audit 完成安装。
- `npm run format-check`：通过；`npm test -- --runInBand`：2 suites、58 tests 通过。
- `npm run build`、`npm run lint`、`npm run package`：通过；license 和 sourcemap-register 产物未变化。
- YAML/输入/Node 24 入口/README 示例检查通过；`git diff --check` 通过。
- 实际 bundle 离线 smoke：缺少凭据返回失败，工作流机器人自身评论提前跳过，均通过。
- 对原凭据的编码及解码形式扫描：src 与 dist（含 source map）均未残留；未输出凭据值。
- 使用 review Skill 静态审查认证源码、调用链、输入、测试、生成 bundle、权限和文档，未发现可证实的待修复缺陷。最终复验无无关源码变化。
- 首轮测试中旧默认机器人 fixture 与新行为不匹配，且新测试的真实 SDK 模块解析不兼容旧 Jest；更新 fixture 和 virtual mock 后通过。
- 未调用真实翻译服务、未创建 issue/comment、未重跑真实 workflow；远程发布核验待后续记录。

### 受影响文件

- `src/main.ts`、`src/github-auth.ts`
- `__tests__/main.test.ts`、`__tests__/github-auth.test.ts`
- `action.yml`、`.github/workflows/action-test.yml`
- `README.md`、`README_CN.md`、`docs/design-docs/action-architecture.md`
- `dist/index.js`、`dist/index.js.map`
- 同任务 plan 与 history

### 后续事项

- 完成离线验证和 review 后创建发布提交，发布 v2.9.3，再更新 Easydict；未触发真实事件测试。
