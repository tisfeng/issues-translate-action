# AGENTS.md

`issues-translate-action` 是一个 Node 24 TypeScript GitHub Action，用于在第一、第二
目标语言之间翻译新建的 issue、PR conversation 评论和 Files changed review 评论。

`AGENTS.md` 是 Agent 的唯一入口和任务路由，而不是完整的仓库规则手册。长期维护的详细
规则位于 `docs/agents/`；公开的英文和中文使用说明位于根目录 `README.md` 与
`README_CN.md`。

## 始终阅读

- 每个任务先阅读 `docs/agents/request-boundary.md`，确定请求语义和任务模式。
- `request-boundary.md` 同时定义 Planning 委派流程，是每个任务的启动契约。
- 再根据当前任务读取下方最小必要的规则，不通过其他索引进行二次路由。

## 按任务路由

- 构建或测试：`docs/agents/build-and-test.md` 和 `docs/agents/testing.md`。
- 工作树写入与变更门禁：`docs/agents/execution-safety.md`。
- Git 安全与本地交付：`docs/agents/git-workflow.md`。
- 文档分层、计划、历史和维护：`docs/agents/README.md`。
- 发布、tag、GitHub Release 与发布后核验：`docs/releases/README.md`。
- 回复语言和交付表达：`docs/agents/response-conventions.md`。
- TypeScript、JavaScript、Shell 或其他手写源码质量：`docs/agents/code-quality.md`。
- GitHub 事件、payload、token、评论/标题写入和 `dist/` 运行时：
  `docs/agents/github-action.md`。
- 修改产品代码、语言识别、翻译或输出行为：`docs/architecture/overview.md`。
- Planning 子代理：遵循 `docs/agents/request-boundary.md` 的启动契约，并使用
  `.codex/agents/planner.toml`。
- 具体 skill：读取用户点名或当前运行时提供的 `SKILL.md`；skill 不得扩大任务模式授予的权限。

## 必须遵守的约束

- 保留工作树中与当前任务无关的 staged、unstaged 和 untracked 变更；工作树写入与变更
  门禁遵循 `docs/agents/execution-safety.md`。
- Git 安全、精确暂存、自动本地提交和 push 边界遵循 `docs/agents/git-workflow.md`；
  `delivery` 使用 `git-commit` skill。
- `src/` 是手写事实源，`dist/` 是被跟踪的 Action 运行时产物。不得手工修改
  `dist/index.js`；修改源码或运行时依赖后，按 `build-and-test.md` 重新打包并核对产物。
- 未经对应的外部写入授权，不运行真实 GitHub workflow、不发布评论、不回复 review thread、
  不修改 issue 标题，也不发送真实翻译请求。
- 行为变化时，同步更新测试、架构说明以及受影响的中英文 README；仓库文档一律使用相对
  路径，不提交机器本地绝对路径。
