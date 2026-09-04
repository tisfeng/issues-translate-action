# Agent 文档与文档治理

本目录存放面向编码 Agent 的长期仓库规则。根目录 [`AGENTS.md`](../../AGENTS.md) 是唯一入口
和任务路由；本文件只说明文档边界与生命周期，不维护第二份规则索引。

## 文档分层

- `docs/agents/` 存放内部 Agent 和贡献者工作流知识。
- `docs/architecture/` 记录当前实现边界和流程。
- `docs/exec-plans/` 存放多步骤工作计划。
- `docs/histories/` 记录每个最终产生仓库文件差异的 `implementation` 任务。
- `docs/releases/` 存放 tag、GitHub Release 与发布治理说明。
- 根目录 `README.md` 与 `README_CN.md` 是公开使用说明；不要因建立内部规则而移动它们。

## 计划与历史

- planning 阶段的多步骤方案只作为当前回复中的规划内容，不创建或更新
  `docs/exec-plans/active/` 下的文件。
- 用户明确批准 implementation 且变更门禁通过后，对于架构、协议、迁移、多步骤、跨模块
  或高风险工作，在 `docs/exec-plans/active/` 下创建执行计划。
- 任何 `implementation` 只要最终产生仓库文件差异，就必须在同一任务中创建或更新一条
  `docs/histories/` 记录；文件类型、数量、变更规模以及是否创建执行计划都不影响该要求。
- 同一任务分多轮实施时复用同一条 history；仅修改 history 的任务由该记录描述自身，不递归
  创建第二条。最终没有仓库文件差异的任务不创建空记录。
- 存在执行计划时，完成后将计划移动到 `docs/exec-plans/completed/`，并由同任务 history
  链接该 completed 计划。
- 交付时必须将同任务 history 与其他任务变更一起验证和精确暂存；允许自动本地提交时，它们
  进入同一个提交。明确禁止提交或进入 `protected` 时保留全部变更，不强行提交。
- 计划记录目标、授权、范围、限制、初始 Git 快照、Agent-owned paths、工作计划、风险、
  验证和完成条件；不要把完整对话复制进历史。
- 使用仓库现有的 GitHub issue 和 pull request 进行讨论；不要在历史文件中重复完整对话内容。

## 维护原则

- 仓库文档使用相对路径，不要提交机器本地绝对路径。行为发生变化时，在同一任务中同步更新
  代码、测试和受影响的文档。
- 每份详细规则只维护一个主要职责；需要引用其他职责时使用链接，不复制完整条款。新增或
  删除规则文件时只更新根 `AGENTS.md` 的路由。
- 文档结构标题使用中文；技术名词、代码标识和引用路径保留原文。
- Markdown、计划、历史和 `.codex/` 配置不属于 Action 运行时，不需要加入打包入口。
