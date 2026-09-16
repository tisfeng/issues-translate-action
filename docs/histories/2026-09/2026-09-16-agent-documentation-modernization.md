## 2026-09-16 | 任务：现代化 Agent 文档与受管 Skills

**Links:** [执行计划](../../exec-plans/completed/2026-09/2026-09-16-agent-documentation-modernization.md)

### 执行上下文

- **Agent Name:** `Codex`
- **Model:** `gpt-5.6-sol`

### 用户请求

参考 Easydict 最新 Agent 文档，将精简后的入口、统一设计文档目录、受管 Skills 和文档生命周期
语义移植到当前 GitHub Action，并在方案确认后执行。

### 变更

- 将六个受管 Skills 从 `tisfeng/skills v0.3.0` 升级至固定 `v0.6.0`，更新 lock、来源参考和
  第三方通知；删除上游已经停止发布的四个项目级 Codex 子代理及 agents lock。
- 将根 `AGENTS.md` 收敛为任务模式、Review 和最小任务路由，删除重复的请求状态机与 Git 工作流
  文档；保留 Node 24、Jest、`src`/`dist`、GitHub 事件和真实外部副作用边界。
- 将 `docs/architecture/overview.md` 迁移为 `docs/design-docs/action-architecture.md`，统一产品
  技术设计与长期治理设计入口。
- 将 completed plans 按月份归档，修复双向链接，并精简 plan/history README 与模板。

### 设计意图

项目只维护自身无法由系统或通用 Skill 推导的规则。通用 Git、Review 和交付算法跟随固定上游
快照，Action 的运行时、测试、打包和外部写入约束继续由宿主文档定义，从而减少重复规则和版本
漂移，同时保持仓库内离线可审查与可复现。

### 验证

- 六个 Skill 目录逐文件匹配 `v0.6.0` peeled commit
  `b4a4791265ca376f3deb4700791cce6e5a470be7`；独立重算的六个 hash 全部匹配 lock。
- Python 3.12.3 运行受管 Skill 测试共 100 项通过：`git-commit` 19、`review` 7、`review-pr`
  45、`submit-pr` 23、`worktree-rebase-merge` 6。
- Python 语法、Shell `bash -n`、YAML、JSON、Markdown 相对链接与锚点、规则残留、允许路径、
  `git diff --check` 和最终只读 review 通过。
- 未运行 npm build、test、lint 或 package；本任务未修改 Action runtime、测试、依赖或 workflow。
- 未运行真实 GitHub workflow，未创建评论、修改标题、发送翻译请求、push 或发布。

### 受影响文件

- `AGENTS.md`、`docs/agents/`、`docs/design-docs/`
- `.agents/skills/`、`skills-lock.json`、原 `.codex/agents/` 与 `.codex/agents-lock.json`
- `docs/references/`、`THIRD_PARTY_NOTICES.md`
- `docs/exec-plans/`、`docs/histories/`

### 后续事项

- None
