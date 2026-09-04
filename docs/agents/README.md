# Agent 文档与文档治理

本目录存放面向编码 Agent 的长期仓库规则。根目录
[`AGENTS.md`](../../AGENTS.md) 是唯一入口和任务路由；本文件只说明文档边界与生命周期，
不维护第二份规则索引。

## 文档分层

- `docs/agents/` 存放 Agent 的请求、执行、Git、验证、运行时和回复规则。
- `docs/architecture/` 记录当前实现边界与事件流。
- `docs/exec-plans/` 存放获准 implementation 的多步骤执行计划。
- `docs/histories/` 记录最终产生仓库文件差异的 implementation 任务。
- 根目录 `README.md` 与 `README_CN.md` 是公开使用说明；不要因建立内部规则而移动它们。

## 计划与历史

- planning 阶段的方案只在当前回复中交付，不创建或更新 `exec-plans/active/` 文件。
- 用户明确批准 implementation 且写入前检查通过后，架构、协议、迁移、多步骤、跨模块、
  workflow、依赖或高风险工作在 `exec-plans/active/` 创建执行计划。
- 任何最终产生仓库文件差异的 implementation 任务都必须在同一任务创建或更新一条
  `docs/histories/` 记录；同一任务分多轮实施时复用同一条。
- 仅修改 history 的任务由该记录描述自身，不递归创建第二条；最终没有仓库差异的任务不
  创建空记录。
- 存在执行计划时，完成后将其移到 `exec-plans/completed/`，并由同任务 history 链接。
- history 与其他任务变更一起验证；是否暂存、提交或推送仍由用户授权和
  [`git-workflow.md`](git-workflow.md) 决定。

## 维护原则

- 每份详细规则只维护一个主要职责；需要其他职责时链接，不复制完整条款。
- 新增或删除规则文件时，只更新根 `AGENTS.md` 的路由。
- 文档结构标题使用中文；技术名词、代码标识和路径保留原文。
- 仓库文档使用相对路径，不提交 token、完整敏感 payload、本地绝对路径或原始日志。
- Markdown、计划、历史和 `.codex/` 配置不属于 Action 运行时，不需要加入打包入口。
