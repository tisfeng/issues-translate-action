## 2026-09-17 | 任务：升级 `tisfeng/skills` 至 v0.6.1

**Links:** [执行计划](../../exec-plans/completed/2026-09/2026-09-17-upgrade-tisfeng-skills-v0.6.1.md)、[上游 Release](https://github.com/tisfeng/skills/releases/tag/v0.6.1)

### 执行上下文

- **Agent Name:** `Codex`
- **Model:** `GPT-5`

### 用户请求

将 Easydict 已完成的上游 Skills 更新继续移植到 issues-translate-action。

### 变更

- 用 `skills@1.5.25` 将六个受管目录和 lock ref 从 `v0.6.0` 升级到 `v0.6.1`。
- 同步 `review-pr` 的本人 PR 同名分支安全复用能力及 `worktree-rebase-merge` 的 UI 展示名称修复。
- 更新来源证据与第三方通知；项目专属 `release` Skill 和 Action runtime 保持不变。

### 设计意图

继续固定正式 annotated tag 并保存完整上游快照，使依赖可离线审查和复现；只更新受管资产及其
治理记录，不改变 Action 的翻译、事件、打包或外部写入行为。

### 验证

- 六个受管目录与 `v0.6.1` tag 逐文件一致；六个目录的独立 SHA-256 重算全部匹配 lock。
- Python 3.12.3 运行 `review-pr` 53 项测试；Shell/Python 语法、两个变更 Skill 的
  `quick_validate.py`、YAML/JSON 解析与 `git diff --check` 通过。
- 本地 `review` 未发现有效 finding；未运行 npm build、test、lint 或 package，因为 Action
  runtime、测试、依赖和 workflow 未修改。

### 受影响文件

- `.agents/skills/review-pr/`
- `.agents/skills/worktree-rebase-merge/agents/openai.yaml`
- `skills-lock.json`
- `THIRD_PARTY_NOTICES.md`
- `docs/references/tisfeng-skills.md`
- `docs/exec-plans/completed/2026-09/2026-09-17-upgrade-tisfeng-skills-v0.6.1.md`
- `docs/histories/2026-09/2026-09-17-upgrade-tisfeng-skills-v0.6.1.md`

### 后续事项

- None
