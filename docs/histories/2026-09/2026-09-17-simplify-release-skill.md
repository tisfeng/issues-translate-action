## 2026-09-17 | 任务：精简发布 Skill

**Links:** None

### Execution Context

- **Agent Name:** `Codex`
- **Model ID:** `Unknown`

### 用户请求

按 OpenAI 官方 Skills 编写原则精简项目发布 Skill，消除相较原发布文档增加的冗余复杂度。

### 变更

- 将 `$release` 收敛为发布前、发布和发布后三段必要规则。
- 删除重复的任务模式、命令清单、仓库治理细节和特例恢复算法，保留原发布文档的授权与核验边界。

### 设计意图

让 Skill 只包含会改变发布决策的项目规则，复用根 `AGENTS.md` 和构建文档中的通用约束。

### 验证

- `quick_validate.py .agents/skills/release`：通过。
- Skill 相对链接和触发边界检查：通过。
- `git diff --check`：通过。
- 未运行 npm build、test、lint 或 package；本任务不修改产品代码或运行时产物。

### 受影响文件

- `.agents/skills/release/SKILL.md`
- `docs/histories/2026-09/2026-09-17-simplify-release-skill.md`

### 后续事项

- None
