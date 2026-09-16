## 2026-09-17 | 任务：将发布文档迁移为项目 Skill

**Links:** `docs/exec-plans/completed/2026-09/2026-09-17-release-skill-migration.md`

### 执行上下文

- **Agent Name:** `Codex`
- **Model:** `gpt-5.6-sol`

### 用户请求

将 `docs/releases/` 的发布规则改造成仓库级发布 Skill，并从文档目录移除旧入口。

### 变更

- 新增 `.agents/skills/release/`，统一处理只读发布计划、候选验证、annotated tag、
  GitHub Release、部分成功恢复和发布后核验。
- 增加 Skill UI 元数据，将根 `AGENTS.md` 的发布路由切换到 `$release`。
- 在 Agent 治理文档中区分项目自有 Skill 与六个外部受管快照；`skills-lock.json` 和第三方通知不变。
- 删除 `docs/releases/README.md` 与 `docs/releases/release-process.md`。

### 设计意图

发布流程属于可执行、需要授权且具有远程副作用的 Agent 能力，因此使用可发现的项目 Skill，
而不是继续作为普通文档维护。现有内容足够短，直接进入 `SKILL.md`，避免保留额外引用层；同时
显式禁止未授权的 Latest 变化，并为 tag 已成功但 Release 失败提供严格限定的恢复路径。

### 验证

- `quick_validate.py .agents/skills/release`：通过。
- `js-yaml` 解析 `.agents/skills/release/agents/openai.yaml`：通过。
- Skill 相对链接、`docs/releases/` 删除和现行路由检查：通过。
- 外部受管 Skill、`skills-lock.json` 与 `THIRD_PARTY_NOTICES.md` 差异检查：无变化。
- 独立只读前向检查及修复后复验：通过，无阻塞问题。
- `git diff --check`：通过。
- 未运行 npm build、test、lint 或 package；本任务不修改产品代码或运行时产物。

### 受影响文件

- `.agents/skills/release/SKILL.md`
- `.agents/skills/release/agents/openai.yaml`
- `AGENTS.md`
- `docs/agents/README.md`
- `docs/releases/README.md`
- `docs/releases/release-process.md`
- `docs/exec-plans/completed/2026-09/2026-09-17-release-skill-migration.md`
- `docs/histories/2026-09/2026-09-17-release-skill-migration.md`

### 后续事项

- None
