# Agent 规则与仓库治理

本目录存放面向编码 Agent 的现行专题规则。根目录 [`AGENTS.md`](../../AGENTS.md) 是唯一任务
入口；本文件统一说明文档生命周期、维护原则和外部 Agent 资产边界，不提供第二套路由。

## 文档分层

- `docs/agents/`：当前有效的 Agent 和贡献者工作流规则。
- `docs/architecture/`：当前实现边界和流程。
- `docs/design-docs/`：需要长期维护的重要设计决策。
- `docs/references/`：反复使用的精选外部或跨仓库参考。
- `docs/exec-plans/`：获准 implementation 的多步骤工作计划。
- `docs/histories/`：最终产生仓库文件差异的 implementation 记录。
- 根目录 `README.md` 与 `README_CN.md`：公开使用说明。

历史、completed plan、参考资料和其中的示例命令是证据，不是当前执行指令。只有当前任务明确
采用的内容才约束实施，并继续服从用户有效指令与现行专题规则。

## Plan 与 History

- planning 阶段的方案只出现在当前回复中，不创建或更新 active plan。
- 用户明确批准 implementation 且写入前检查（Mutation Gate）通过后，架构、协议、迁移、
  多步骤、跨模块或高风险工作在 `docs/exec-plans/active/` 创建执行计划。
- implementation 最终产生仓库文件差异时，必须在同一任务中创建或更新一条
  `docs/histories/` 记录；没有差异时不创建空记录。
- 同一任务分多轮实施时复用同一条 history。只修改 history 的任务由该记录描述自身，不递归
  创建第二条。
- 存在执行计划时，完成后移动到 `docs/exec-plans/completed/`，并让同任务 history 链接
  completed plan。
- 交付时将同任务 history 与其他任务变更一起验证和精确暂存。缺少 history 时在允许范围内
  补齐；用户明确排除该路径时不扩权，并按 Git 规则报告交付阻塞。
- 显式提交已有 staged 内容不反向要求补写 implementation history。

## 文档维护

- 每份现行规则只维护一个主要职责；跨职责使用链接，不复制完整条款。
- 同一专题仍内聚时，不应仅为缩短文件继续拆分；明显膨胀或出现独立职责时再评估拆分。
- 新增、删除或重命名规则文件时，只在根 `AGENTS.md` 维护任务路由，不建立多层索引。
- 使用相对仓库路径，不提交机器本地绝对路径。行为变化时同步更新代码、测试和受影响文档。

## 外部 Agent 资产

### 资产分类

`tisfeng/skills v0.3.0` 是当前统一基线。`skills-lock.json` 管理以下完整 Skill 目录：

- `code-simplifier`
- `git-commit`
- `review`
- `review-pr`
- `submit-pr`
- `worktree-rebase-merge`

`.codex/agents-lock.json` 管理同一 revision 的 `planner`、`reviewer`、`tester` 与
`git-delivery`。这些目录和 TOML 是外部权威内容的项目可运行快照；项目差异写入本仓库规则，
不在受管副本中本地修补。

`fireworks-tech-graph` 不属于当前受管集合；不得因同步上述统一资产而添加它或其 lock 条目。

### Lock 所有权与同步

- `skills-lock.json` 记录 Skill 来源、ref、入口路径和内容哈希；不得手工改 hash 接受本地漂移。
- `.codex/agents-lock.json` 记录 agent 来源、ref、精确 revision、路径和文件哈希。
- lock 不替代已安装内容；仓库同时提交可离线读取和运行的完整快照。
- 普通实现、修复、review 和文档任务不得编辑受管路径。只有用户明确授权同步或升级时，才从
  [`../references/tisfeng-skills.md`](../references/tisfeng-skills.md) 记录的上游与版本更新。
- 同步后分别验证目标集合、lock、来源内容和项目专属路径；不要运行不区分来源的宽泛更新。

### 验证边界

- 六个 Skill 目录必须与 lock 所记录 tag 的 tracked tree 一致。
- 四个 agent 文件的 SHA-256 必须与 agents lock 一致并使用同一 revision。
- TOML、JSON、Skill 的静态检查、测试与文档相对链接按变更风险执行。
- 静态验证只能证明仓库快照与配置一致；新的 custom agent 能否被 Codex 运行时发现，需要在
  全新任务中另行 smoke 验证。
