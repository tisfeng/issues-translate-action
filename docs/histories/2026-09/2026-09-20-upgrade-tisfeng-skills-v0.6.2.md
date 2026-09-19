## 2026-09-20 | 任务：升级 `tisfeng/skills` 至 v0.6.2

**Links:** [执行计划](../../exec-plans/completed/2026-09/2026-09-20-upgrade-tisfeng-skills-v0.6.2.md)、[上游 Release](https://github.com/tisfeng/skills/releases/tag/v0.6.2)

### 执行上下文

- **Agent Name:** `Codex`
- **Model ID:** `Unknown`
- **Environment:** `macOS 27.0 / Xcode 27.0 (27A266a)`

### 用户请求

更新 issues-translate-action 使用的 `tisfeng/skills` 依赖；SelectedTextKit 不在本次范围内。

### 变更

- 用 `skills@1.5.25` 将六个外部受管 Skill 和 `skills-lock.json` 从 v0.6.1 升级到 v0.6.2。
- 更新来源参考和 `THIRD_PARTY_NOTICES.md` 到 v0.6.2。
- 保留项目专属 `release` Skill、Action runtime、测试、依赖和 workflow 不变。

### 设计意图

固定已发布 tag 并保存完整快照，维持 Action 项目的离线审查和来源追踪边界，不改变运行时行为。

### 验证

- 六个受管目录和 lock ref 与 v0.6.2 一致；变更集中于 `review-pr` 及 lock。
- `jq -e . skills-lock.json`、`git diff --check` 通过；项目专属路径未修改，未运行真实 workflow。

### 受影响文件

- `.agents/skills/review-pr/`
- `skills-lock.json`
- `docs/references/tisfeng-skills.md`
- `THIRD_PARTY_NOTICES.md`
- `docs/exec-plans/completed/2026-09/2026-09-20-upgrade-tisfeng-skills-v0.6.2.md`

### 后续事项

- None
