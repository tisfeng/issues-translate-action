# Agent 文档基础结构

- 日期：2026-09-04
- 状态：completed
- 关联 Issue/PR：none
- 执行计划：[`docs/exec-plans/completed/2026-09-04-agent-documentation-foundation.md`](../../exec-plans/completed/2026-09-04-agent-documentation-foundation.md)

## 用户目标

参考 Scoco 建立完整的 Agent 规则文档方案，并落地到当前 GitHub Action 仓库。规则必须保留
本仓库的运行时与安全边界，不照搬 Scoco 的产品专属内容。

## 设计与变更

- 新增 `AGENTS.md` 作为唯一入口，并建立项目级只读 planner 配置。
- 在 `docs/agents/` 拆分请求边界、执行安全、Git、构建测试、GitHub Action 运行时与回复
  规则；新增当前事件与翻译流程的架构概览。
- 建立 execution plan 与 history 的生命周期、模板和本任务归档记录，同时明确 implementation
  不自动提交。

## 验证

- 相对 Markdown 链接、planner TOML、误移植内容扫描和 `git diff --check` 均通过。
- 本次为文档与配置变更，未运行 npm build、test、lint 或 package，也未调用 GitHub 或翻译
  服务。

## 后续事项

- 无。

## 后续更正（2026-09-05）

本记录中的“implementation 不自动提交”是首次规则移植遗漏 Scoco 通用交付语义所致，
不再代表现行规则。现行 `implementation` 在未明确禁止提交且通过 Git 门禁时使用
`auto-local-commit`；push、发布和其他远程操作仍需要独立授权。
