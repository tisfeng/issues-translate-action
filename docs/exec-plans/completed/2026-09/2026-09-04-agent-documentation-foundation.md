# Agent 文档基础结构

- 状态：completed
- 创建日期：2026-09-04
- 完成日期：2026-09-04
- 负责人：Codex
- 关联 Issue/PR：none

## 背景

仓库此前没有项目级 Agent 入口、planner 配置或文档治理规则。需要参考 Scoco 的任务
路由与文档生命周期，同时只保留适用于 Node TypeScript GitHub Action 的规则。

## 任务摘要

- 意图模式：implementation
- 交付授权：none
- 安全状态：normal
- 目标结果：建立根入口、项目 planner、规则层、架构说明、计划与历史模板。
- 允许修改路径：`AGENTS.md`、`.codex/agents/planner.toml`、`docs/**`
- 同任务 history：`docs/histories/2026-09/2026-09-04-agent-documentation-foundation.md`
- 禁止动作：修改产品源码、测试、bundle、workflow、README、索引、提交和远程 Git 操作。
- 验收标准：路由和相对链接有效，TOML 可解析，文档只包含本仓库适用规则。

## 写入前状态

- 初始 HEAD：`da1f88eae4452852f5916c663c63202c9f07bcb9`
- 初始 staged 路径：无
- 初始 unstaged 路径：无
- 初始 untracked 路径：无
- 初始冲突：无
- Agent-owned paths：`AGENTS.md`、`.codex/agents/planner.toml`、`docs/**`

## 目标与非目标

### 目标

- 建立单一入口、请求边界、执行与 Git 门禁。
- 记录 Action 的源码、测试、打包与外部副作用边界。
- 建立 planning、execution plan 与 history 生命周期。

### 非目标

- 不移植 Scoco 的 Swift、Xcode、后端、发布、项目 skills 或自动提交规则。
- 不修改运行时行为或公开 README。

## 工作结果

1. 创建了根入口、项目 planner 和按职责拆分的 Agent 规则。
2. 根据当前源码、测试、打包入口和 workflow 写入架构与运行时边界。
3. 创建了执行计划与 history 模板，并完成本计划归档和同任务 history。

## 风险与决策

- 采用完整但小型的规则层，避免复制 Scoco 的产品专属内容。
- `planning` 默认等待只读 planner；implementation 不自动提交。

## 验证

- 相对链接与根路由路径存在。
- `.codex/agents/planner.toml` 已通过 `tomllib` 解析。
- 活动规则中未发现 `Scoco`、`Xcode`、`Swift`、`auto-local-commit` 或机器本地绝对路径。
- `git diff --check` 已执行；新增未跟踪文本另行进行尾随空白检查。
- 本次只修改治理文档和配置，未运行 npm build、test、lint 或 package。

## 完成条件

- [x] 文档规则与当前仓库事实一致。
- [x] 本计划已移至 `completed/`，并创建同任务 history。

## 后续更正（2026-09-05）

本计划将 Scoco 的通用 `auto-local-commit` 语义错误地作为项目专属内容排除，并把
`implementation` 设计为默认不提交。该决定已经由
`2026-09-05-scoco-agent-rules-alignment` 替代；现行规则恢复为：明确“执行”且未禁止提交时，
验证通过后按精确暂存门禁自动创建一次本地提交。此更正不改写本计划当时的实际执行经过。
