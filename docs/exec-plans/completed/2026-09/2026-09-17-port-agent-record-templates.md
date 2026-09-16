# 移植 Agent 记录模板规则

- 状态：completed
- 创建日期：2026-09-17
- 负责人：Codex
- 关联 Issue/PR：none

## 背景

Easydict 已统一 Plan 与 History 的模板使用约束，并将模型记录规则改为从当前对话上下文获取完整
模型 ID、明确的 base model 或 `Unknown`。issues-translate-action 仍保留英文执行上下文标题和
仅接受完整 `Model ID` 的旧规则。

## 目标与范围

- 目标结果：将两项规则语义移植到当前 Action，并整理采用旧字段的相关近期 history。
- 允许修改路径：`docs/agents/README.md`、`docs/histories/template.md`、相关近期 history 及本任务记录。
- 同任务 history：`docs/histories/2026-09/2026-09-17-port-agent-record-templates.md`
- 用户限制：适配当前 Action 的文档结构，不机械复制 Easydict 专属内容。
- 非目标：不修改 Action 源码、测试、打包产物、workflow、Skill 资产、发布状态或外部服务。
- 验收标准：模板与相关记录使用中文标题和通用 `Model` 规则，静态检查通过并创建本地提交。

## 工作计划

1. 更新 Plan 与 History 使用规则和 history 模板。
2. 整理采用旧执行上下文字段的相关近期 history。
3. 完成静态检查，记录结果并归档计划。
4. 按限定路径创建本地提交并核对结果。

## 风险与决策

- 仅修改仓库治理文档，不影响 Action 运行时或发布产物。
- 模型规则只依赖当前对话上下文明确提供的信息，不绑定客户端字段、本地路径或存储格式。
- 不批量改写无关旧记录，也不增加结构校验器或 CI。

## 进度

- [x] 检查仓库状态、任务规则和现有模板。
- [x] 更新规则、模板和相关记录。
- [x] 完成验证并归档计划。
- [x] 核对限定提交路径和最终差异。

## 验证

- `git diff --check`：通过。
- Markdown 相对链接、模板章节和规则语义检查：通过。
- 残留检查：`docs/histories/` 中不再存在 `Execution Context` 或 `Model ID`。
- npm build、test、lint 和 package：未运行；本次不修改 Action 运行时或打包产物。

## 完成条件

- [x] 新记录必须使用当前模板的约束已写入治理规则。
- [x] history 模板及相关记录已使用通用执行上下文格式。
- [x] 静态检查通过，history 已记录结果，计划已归档。
