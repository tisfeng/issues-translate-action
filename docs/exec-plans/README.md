# 执行计划

执行计划记录跨越多个 commit、模块或验证阶段的多步骤工作。

- `planning` 阶段只在回复中输出方案，不创建 active 计划文件。
- 获准的 `implementation` 通过写入前检查后，进行中的计划放在 `active/`。
- 已完成的计划移到 `completed/`。
- 新计划从 `templates.md` 开始。
- 带日期的计划文件统一命名为 `YYYY-MM-DD-<slug>.md`，其中 `<slug>` 使用小写 kebab-case。
- 结构性标题统一使用中文；技术名词、代码标识和引用路径保留原文。
- 在计划本身记录进度、风险、决策和验证结果。
- 不要将已完成或已放弃的工作留在 `active/` 中。
