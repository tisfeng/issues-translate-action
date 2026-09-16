## 2026-09-17 | 任务：移植 Agent 任务模式

**Links:** None

### Execution Context

- **Agent Name:** `Codex`
- **Model ID:** `Unknown`

### 用户请求

将 Easydict 最新的任务模式结构语义移植到 issues-translate-action，并保留本项目已有边界。

### 变更

- 将任务模式拆分为“计划模式”“执行模式”和“通用规则”。
- 将执行过程整理为“执行前 → 实现与验证 → Review → 交付”四步，并把独立 Review 规则移入流程。
- 要求产生仓库差异的执行任务在首次写入前读取 Plan 与 History 规则。
- 保留真实 workflow、发布、仓库文档语言和现有任务路由约束。
- 未修改 Action 源码、打包产物、配置或测试。

### 设计意图

根 `AGENTS.md` 继续作为简短任务入口；计划模式只描述只读边界，执行前统一负责文档治理判断，
Review 成为验证后的质量阶段，通用规则集中表达授权和外部写入边界。

### 验证

- `git diff --check`：通过。
- 相对链接检查：任务路由和 Plan 与 History 规则目标存在。
- 手动检查：执行顺序完整，Action 专属真实 workflow 与外部写入边界保持不变。

### 受影响文件

- `AGENTS.md`
- `docs/histories/2026-09/2026-09-17-port-agent-task-modes.md`

### 后续事项

- None
