# AGENTS.md

`issues-translate-action` 是一个 Node 24 TypeScript GitHub Action，用于将新建的
issue、PR conversation 评论和 Files changed review 评论翻译为英文。

本文件是 Agent 的唯一入口和任务路由，不是完整规则手册。长期规则位于
[`docs/agents/`](docs/agents/)，公开使用说明继续以根目录
[`README.md`](README.md) 与 [`README_CN.md`](README_CN.md) 为准。

## 始终阅读

- 每个任务先阅读 [`docs/agents/request-boundary.md`](docs/agents/request-boundary.md)，
  确定用户目标、证据边界与任务模式。
- 再按任务读取下方最小必要规则；不要通过其他索引进行二次路由。

## 按任务路由

- 写入工作树或 artifact：[`execution-safety.md`](docs/agents/execution-safety.md)。
- Git 状态、暂存、提交或远程操作：[`git-workflow.md`](docs/agents/git-workflow.md)。
- TypeScript、测试、依赖、打包或 workflow：
  [`build-and-test.md`](docs/agents/build-and-test.md)。
- GitHub 事件、payload、token、评论/标题写入或 `dist/` 运行时：
  [`github-action.md`](docs/agents/github-action.md)。
- 运行路径、语言识别、翻译与输出行为：
  [`docs/architecture/overview.md`](docs/architecture/overview.md)。
- 文档分层、执行计划、历史和模板：[`README.md`](docs/agents/README.md)。
- 回复语言、验证状态和交付表达：
  [`response-conventions.md`](docs/agents/response-conventions.md)。
- planning 子代理：读取 `request-boundary.md` 的启动契约，并使用
  [`.codex/agents/planner.toml`](.codex/agents/planner.toml)。
- 用户明确点名的 skill：读取目标 `SKILL.md`；skill 不得扩大用户授权。

## 必须遵守的约束

- 保留无关的 staged、unstaged 与 untracked 变更；写入前遵循
  `execution-safety.md`，Git 操作遵循 `git-workflow.md`。
- `src/` 是手写事实源，`dist/` 是被跟踪的 Action 运行时产物。不得手工修改
  `dist/index.js`；修改源码或运行时依赖后，按 `build-and-test.md` 重新打包并核对产物。
- 未经明确授权，不运行真实 GitHub workflow、不发布评论、不回复 review thread、不修改
  issue 标题，也不发送真实翻译请求。
- 行为变化时，同步更新测试、架构说明以及受影响的中英文 README；仓库文档一律使用相对
  路径，不提交机器本地绝对路径。
