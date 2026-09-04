# 执行计划

执行计划记录跨越多个阶段、模块、验证步骤或风险边界的获准 implementation。

- planning 阶段只在回复中输出方案，不创建 active 计划文件。
- 写入前检查通过后，架构、协议、迁移、多步骤、跨模块、workflow、依赖或高风险任务在
  `active/` 创建计划；新计划从 [`templates.md`](templates.md) 开始。
- 完成后移到 `completed/`，不将已完成或已放弃工作留在 `active/`。
- 带日期的文件使用 `YYYY-MM-DD-<slug>.md`，其中 `<slug>` 为小写 kebab-case。
- 计划记录目标、授权、范围、初始 Git 快照、Agent-owned paths、风险、验证与完成条件；
  不复制完整对话、token、完整 payload 或原始日志。
- 同任务 history 链接已完成的执行计划，是否提交仍取决于 Git 授权。
