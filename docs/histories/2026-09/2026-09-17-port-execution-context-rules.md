## 2026-09-17 | 任务：移植执行上下文规则

**Links:** [执行计划](../../exec-plans/completed/2026-09/2026-09-17-port-execution-context-rules.md)、[Easydict `9b34d2794`](https://github.com/tisfeng/Easydict/commit/9b34d2794c2ac46a100459164e503389577a2796)

### 执行上下文

- **Agent Name:** `Codex`
- **Model ID:** `Unknown`
- **Environment:** `macOS 27.0 / Xcode 27.0 (27A266a)`

### 用户请求

将 Easydict 提交 `9b34d2794` 的 Agent 文档规则语义移植到 issues-translate-action。

### 变更

- 为 Plan 模板增加“执行上下文”章节。
- 将 History 模板统一为 `Agent Name`、`Model ID`、`Environment`，移除 base model 回退规则。
- 固定使用系统命令取得 macOS、Xcode 和 build version；无法明确取得的上下文值填写 `Unknown`。
- 保留既有 plan/history、Action 运行时、测试、打包产物、workflow 和受管 Skill 不变。

### 设计意图

Plan 与 History 使用同一组执行上下文字段，并只接受当前主执行 Agent 运行上下文明确提供的身份和完整
模型 ID。这样可跨客户端复用规则，同时避免从客户端名称、默认配置或历史记录推测实际执行环境。

### 验证

- 模板结构与字段顺序检查：通过。
- 旧 `Model`、base model 回退和按需环境记录规则扫描：无残留。
- 相对路径检查：通过。
- `git diff --check`：通过。
- npm build、test、lint 和 package：未运行；本任务只修改仓库治理 Markdown。

### 受影响文件

- `docs/exec-plans/templates.md`
- `docs/histories/template.md`
- `docs/exec-plans/completed/2026-09/2026-09-17-port-execution-context-rules.md`
- `docs/histories/2026-09/2026-09-17-port-execution-context-rules.md`

### 后续事项

- None
