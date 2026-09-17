# 移植执行上下文规则

- 状态：completed
- 创建日期：2026-09-17
- 负责人：Codex
- 关联 Issue/PR：[Easydict `9b34d2794`](https://github.com/tisfeng/Easydict/commit/9b34d2794c2ac46a100459164e503389577a2796)

## 执行上下文

- **Agent Name:** `Codex`
- **Model ID:** `Unknown`
- **Environment:** `macOS 27.0 / Xcode 27.0 (27A266a)`

## 背景

Easydict 提交 `9b34d2794` 为 Plan 增加了执行上下文，并收紧了 History 中 Agent、完整模型 ID
和环境信息的证据规则。issues-translate-action 仍只有 History 执行上下文，且允许使用 base model
回退，需要语义移植最终规则。

## 目标与范围

- 目标结果：让 Plan 与 History 使用统一且跨客户端的执行上下文规则。
- 允许修改路径：`docs/exec-plans/templates.md`、`docs/histories/template.md`、本计划及同任务 history。
- 同任务 history：`docs/histories/2026-09/2026-09-17-port-execution-context-rules.md`
- 用户限制：语义移植，不 push，不批量改写既有历史记录。
- 非目标：不修改 Action 代码、测试、打包产物、workflow、受管 Skill 或发布状态。
- 验收标准：两个模板统一使用 `Agent Name`、`Model ID`、`Environment`，静态检查通过并创建本地提交。

## 工作计划

1. 将来源提交的执行上下文语义适配到当前仓库的 Plan 与 History 模板。
2. 检查字段顺序、旧规则残留、相对链接和 Markdown diff。
3. 更新同任务 history，归档本计划并创建本地提交。

## 风险与决策

- 保留当前仓库 History 的标题层级和章节结构，只同步字段与取值规则。
- 不回填 completed Plan 或既有 History，避免改写历史事实。
- 当前运行上下文未明确提供完整模型 ID，因此本任务记录填写 `Unknown`。

## 进度

- [x] 核对来源提交的精确 parent diff 和目标仓库边界。
- [x] 更新 Plan 与 History 模板。
- [x] 完成静态检查和 history；本地提交在计划归档后创建。

## 验证

- 模板结构检查：Plan 与 History 的字段顺序均为 `Agent Name`、`Model ID`、`Environment`。
- 旧规则残留检查：模板不再包含 `Model` 字段、base model 回退或按需记录环境的旧说明。
- 相对路径检查：同任务 plan/history 路径和模板规则入口均存在。
- `git diff --check`：通过。
- npm build、test、lint 和 package：未运行；本任务只修改仓库治理 Markdown。

## 完成条件

- [x] 两个模板的字段、顺序和取值规则与来源语义一致。
- [x] 适用的静态检查通过。
- [x] history 已记录结果，计划可以归档并创建本地提交。
