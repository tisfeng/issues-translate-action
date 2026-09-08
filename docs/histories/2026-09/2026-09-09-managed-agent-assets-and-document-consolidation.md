# 受管 Agent 资产与文档收敛

- 日期：2026-09-09
- 状态：completed
- 关联 Issue/PR：none
- 执行计划：[`../../exec-plans/completed/2026-09-09-managed-agent-assets-and-document-consolidation.md`](../../exec-plans/completed/2026-09-09-managed-agent-assets-and-document-consolidation.md)

## 用户目标

将 Easydict `f61433859`、`12f05421` 和 `7ade3bcb` 的最终受管 Agent 资产与文档治理语义
移植到当前 Action；明确不添加 `fireworks-tech-graph`。

## 设计意图

- 采用 `tisfeng/skills v0.3.0` 的六个完整 Skill 与四个 Codex agent，并用独立 lock 固定
  来源、revision 和内容哈希。
- 收敛重复规则，同时保留 Node 24、`src`/`dist`、GitHub 事件、敏感输入和真实外部写入边界。
- 以 MIT 第三方通知保留受管快照的版权与许可；不复制 Easydict 专属 Skill、运行时或历史。

## 主要变更

- 新增 `.agents/skills/`、`.codex/agents-lock.json`、`skills-lock.json` 与四个受管 agent，
  将原有 planner 替换为锁定版本。
- 将代码质量和 Action 边界合并到 `docs/agents/development.md`，并将执行安全、测试和回复规则
  分别收敛到最终权威位置。
- 新增外部资产设计、来源参考和第三方通知；排除 `fireworks-tech-graph`。

## 验证

- 六个 Skill 的 23 个文件与 `f61433859` 逐字节一致；lock、四个 agent SHA-256、JSON、TOML、
  Markdown 链接和 `git diff --check` 通过。
- 受管 `git-commit`、`review-pr`、`submit-pr` 测试分别通过 19、27、21 项；受管 Shell 语法检查
  通过。
- 未运行 Action npm 验证、真实外部服务或 custom agent runtime smoke；本任务未修改运行时路径。

## 后续事项

无。
