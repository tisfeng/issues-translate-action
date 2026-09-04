# 对齐 Scoco Agent 规则

- 日期：2026-09-05
- 状态：completed
- 关联 Issue/PR：none
- 执行计划：[`docs/exec-plans/completed/2026-09-05-scoco-agent-rules-alignment.md`](../../exec-plans/completed/2026-09-05-scoco-agent-rules-alignment.md)

## 用户目标

以 Scoco 的 Agent/docs 规则为语义源，重新适配 issues-translate-action 的治理文档；只保留
Node TypeScript GitHub Action 的真实项目差异，不再遗漏或反转通用执行规则。

## 设计意图

- 将任务意图、交付授权和安全状态拆分，避免把 `protected` 误作用户意图或将“执行”错误降级为不提交。
- 默认自动本地提交仍经过严格 Git 门禁；它不推导 push、发布或任何真实 Action 外部写入。

## 主要变更

- 恢复 Scoco 的请求判定、Mutation Gate、自动本地提交、计划模板和 history 生命周期规则。
- 新增 TypeScript/Jest 的代码质量和测试规则，以及 tag/GitHub Release 的发布文档。
- 更新 Action 运行时文档以覆盖第一、第二语言输入，并保留 Node 24、ncc、Jest、`src`/`dist`
  与 GitHub 外部副作用边界。
- 对 2026-09-04 的记录追加事实更正：此前“默认不提交”设计已被替代，两语言路由实际已提交，
  且该次提交混入 release 记录的事实被保留。

## 验证

- `git diff --check`、Markdown 相对链接、planner TOML、语义扫描、项目适配扫描和 Action 输入
  一致性检查均通过。
- 本任务未修改运行时路径，因此未运行 npm build、test、lint 或 package。
- 一次语义扫描触发的 Git 暂存尝试被环境阻止；随后确认索引为空并安全重跑。

## 后续事项

- 无。正式发布仍须用户单独授权，并遵循 `docs/releases/`。
