# AGENTS.md

`issues-translate-action` 是一个 Node 24 TypeScript GitHub Action，用于在第一、第二
目标语言之间翻译新建的 issue、PR conversation 评论和 Files changed review 评论。

`AGENTS.md` 是 Agent 的唯一任务入口；详细规则只在对应专题文档维护。

## 任务模式

### 计划模式

- 用户要求方案、分析、解释或评估时，只读取和检查现状并给出答复，不修改文件、Git 或外部服务。

### 执行模式

用户要求修改、修复、更新、实现或执行时，按以下顺序完成任务：

1. **执行前**：首次写入前读取任务路由要求的专题规则；任何可能产生仓库差异的任务都必须读取
   `docs/agents/README.md`，并按其规则判断 plan 和 history。
2. **实现与验证**：完成范围内的修改并运行风险匹配的验证；失败时修复并重新验证。
3. **Review**：生产代码、复杂逻辑、跨模块或高风险变更在验证通过后使用 `review` Skill 审查；
   修复有效 finding 后重新验证和审查。纯文档及简单低风险变更除外。
4. **交付**：更新 history，完成并归档已有 plan；必要验证和适用的 Review 通过后自动创建本地
   提交，用户明确要求不提交或没有差异时除外。

### 通用规则

- 无法确认修改授权时保持只读；从计划模式转入执行模式后，从“执行前”开始。
- 用户的禁止、范围和顺序要求优先；push、创建 Pull Request、发布、真实 workflow 及其他外部
  写入仅在用户明确要求时执行。
- 回复以及新建或修改的仓库文档使用用户当前请求的语言；代码标识、API 名称、命令、路径、
  品牌名称和固定输出契约保留原文。

## 任务路由

- 只读取当前任务需要的专题规则。
- 构建、测试和 Action 打包验证：`docs/agents/build-and-test.md`。
- TypeScript、JavaScript、Shell 代码质量，以及 GitHub Action 的事件、输入、运行时与外部
  副作用：`docs/agents/development.md`。
- 文档分层、plan、history、参考资料、外部 Skills 和同步边界：`docs/agents/README.md`。
- 产品代码、语言识别、翻译或输出行为：`docs/design-docs/action-architecture.md`。
- 发布、tag、GitHub Release 与发布后核验：`.agents/skills/release/SKILL.md`。
