# Agent 文档与仓库治理

根目录 [`AGENTS.md`](../../AGENTS.md) 是唯一任务入口，`docs/agents/` 存放现行专题规则。
design doc 记录当前产品技术设计与长期决策，plan 记录执行过程，history 记录落地结果，
reference 保存外部证据；这些历史材料只有被当前任务明确采用时才构成约束。

## Plan 与 History

- 多步骤、跨模块或高风险的执行任务在 `docs/exec-plans/active/` 使用
  [`templates.md`](../exec-plans/templates.md)；完成后按文件名月份移动到
  `docs/exec-plans/completed/YYYY-MM/`。
- 执行任务产生仓库差异时，在 `docs/histories/YYYY-MM/` 使用
  [`template.md`](../histories/template.md) 记录结果；没有差异时不创建空记录。
- plan 与 history 使用 `YYYY-MM-DD-<slug>.md`，同一任务共享 slug 并跨轮复用；存在 plan 时，
  history 链接归档后的 plan。
- `<slug>` 使用小写 kebab-case；其中完整的标准标识可保留点号，如 `release-2.9.1` 或
  `upgrade-skills-v0.6.0`。不使用空格、下划线、大写字母、斜杠、反斜杠或冒号。
- plan 记录目标、范围、步骤、风险和验证；history 记录已落地结果与关键决策，不复制完整对话。

## 文档维护

- 每份现行规则只维护一个主要职责；跨职责使用链接，不复制完整条款。
- 新增、删除或重命名规则文件时，只在根 `AGENTS.md` 维护任务路由。
- 使用相对仓库路径，不提交机器本地绝对路径。行为变化时同步更新代码、测试和受影响文档。

## 外部 Skill 资产

`skills-lock.json` 中登记的六个目录是外部权威内容的完整项目快照。lock 记录来源、ref、入口
路径和内容哈希，但不替代仓库内可离线读取的实际文件。项目特有的 Action 事件、外部写入、
测试和打包政策写入宿主规则，通用 Git、Review 和交付算法由受管 Skill 维护并从上游同步。

- 普通任务不得修改受管快照或手工调整 hash；只有用户明确要求升级时才使用安装器同步。
- 上游版本、安装命令和核验证据记录在
  [`tisfeng-skills.md`](../references/tisfeng-skills.md)；同步后核对来源 tree、目录 hash、lock、
  Skill 测试和项目专属路径。
- 本项目从该上游只采用 `code-simplifier`、`git-commit`、`review`、`review-pr`、`submit-pr`
  与 `worktree-rebase-merge`；不采用项目级 Codex 子代理或 `fireworks-tech-graph`。

## 项目自有 Skill

`.agents/skills/release/` 是本仓库维护的项目专属发布 Skill，不属于 `tisfeng/skills` 外部快照，
因此不登记到 `skills-lock.json`，也不纳入第三方通知。发布任务由根 `AGENTS.md` 直接路由到其
`SKILL.md`；修改时按本仓库规则验证，不使用外部 Skill 安装器覆盖。
