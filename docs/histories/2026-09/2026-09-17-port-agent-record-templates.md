## 2026-09-17 | 任务：移植 Agent 记录模板规则

**Links:** [执行计划](../../exec-plans/completed/2026-09/2026-09-17-port-agent-record-templates.md)

### 执行上下文

- **Agent Name:** `Codex`
- **Model:** `gpt-5.6-sol`

### 用户请求

将 Easydict 最近两次提交中的 Plan/History 模板约束和模型信息记录规则语义移植到
issues-translate-action。

### 变更

- 明确新建 plan 和 history 必须从当前模板创建，并保留必填字段、章节和顺序。
- 将执行上下文标题改为中文，并以 `Model` 同时容纳完整模型 ID、明确的 base model 和 `Unknown`。
- 整理采用旧标题和 `Model ID` 字段的相关近期 history。
- 保留 Action 源码、测试、打包产物、workflow、Skill 资产和发布状态不变。

### 设计意图

沿用当前 Action 的文档结构，只移植通用的模板使用契约与执行上下文语义。模型信息来自当前对话
上下文，不依赖特定客户端字段、本地路径或存储格式。

### 验证

- `git diff --check`：通过。
- Markdown 相对链接、模板章节和规则语义检查：通过。
- 残留检查：`docs/histories/` 中不再存在 `Execution Context` 或 `Model ID`。
- npm build、test、lint 和 package：未运行；本次不修改 Action 运行时或打包产物。

### 受影响文件

- `docs/agents/README.md`
- `docs/histories/template.md`
- `docs/histories/2026-09/2026-09-16-agent-documentation-modernization.md`
- `docs/histories/2026-09/2026-09-17-port-agent-task-modes.md`
- `docs/histories/2026-09/2026-09-17-release-2.9.2.md`
- `docs/histories/2026-09/2026-09-17-release-skill-migration.md`
- `docs/histories/2026-09/2026-09-17-simplify-release-skill.md`
- `docs/histories/2026-09/2026-09-17-port-agent-record-templates.md`
- `docs/exec-plans/completed/2026-09/2026-09-17-port-agent-record-templates.md`

### 后续事项

- None
