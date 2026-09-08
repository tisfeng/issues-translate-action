# AGENTS.md

`issues-translate-action` 是一个 Node 24 TypeScript GitHub Action，用于在第一、第二
目标语言之间翻译新建的 issue、PR conversation 评论和 Files changed review 评论。

`AGENTS.md` 维护 Agent 的通用约束和唯一任务路由。现行详细规则位于 `docs/agents/`，每项
规则只维护一个权威来源。

## 始终阅读

- 每个任务先阅读 `docs/agents/request-boundary.md`，确定请求语义、写入授权、任务模式、
  写入前检查（Mutation Gate）和子代理边界。
- 回复以及新建或修改的仓库文档使用用户当前请求的语言；代码标识、API 名称、命令、路径、
  品牌名称和固定输出契约保留原文。
- 再按当前任务读取下方最小必要规则，不通过其他 README 或索引进行二次路由。

## 任务路由

- Git 状态保护、暂存、本地提交、worktree 集成与 PR 交付：
  `docs/agents/git-workflow.md`。
- 构建、测试、独立 review、tester 和 Action 打包验证：
  `docs/agents/build-and-test.md`。
- TypeScript、JavaScript、Shell 代码质量，以及 GitHub Action 的事件、输入、运行时与外部
  副作用：`docs/agents/development.md`。
- 文档分层、plan、history、参考资料、外部 Skills、Codex 子代理、lock 和同步边界：
  `docs/agents/README.md`。
- 产品代码、语言识别、翻译或输出行为：`docs/architecture/overview.md`。
- 发布、tag、GitHub Release 与发布后核验：`docs/releases/README.md`。
- 具体 Skill：执行前读取 `.agents/skills/<skill>/SKILL.md`；skill 不得扩大任务模式授予的权限。

## Review 路由

- 本地任务、工作树、提交/range、文件或模块审查：`.agents/skills/review/SKILL.md`；独立
  只读审查使用 `.codex/agents/reviewer.toml`。
- GitHub PR review：`.agents/skills/review-pr/SKILL.md`；默认不授权产品修复、发布评论、
  approve、关闭 PR、push 或真实 workflow。

## 回复与交付表达

- 先说明真实结果，再给必要证据、修改范围、已执行/未执行验证和外部交付状态；只有需要用户
  决策时才提出问题。
- 因规则暂停或留下未完成工作时，链接实际权威条款，区分明确要求与 Agent 推断，不重复询问
  已有授权。
- 不从材料复制无关要求，不把计划写成完成结果，也不把静态检查写成构建或运行测试。标题、
  提交信息和 PR 描述优先表达实际新增、修复、保留或验证的行为。

## 维护约束

- 保留工作树中与当前任务无关的 staged、unstaged 和 untracked 变更。
- `skills-lock.json` 管理的六个 Skill 与 `.codex/agents-lock.json` 管理的四个子代理都是外部
  受管快照；普通项目任务不得直接修改，例外和同步规则见 `docs/agents/README.md`。
- `src/` 是手写事实源，`dist/` 是被跟踪的 Action 运行时产物。不得手工修改 `dist/index.js`；
  修改源码或运行时依赖后，按 `build-and-test.md` 重新打包并核对产物。
- 未经对应的外部写入授权，不运行真实 GitHub workflow、不发布评论、不回复 review thread、
  不修改 issue 标题，也不发送真实翻译请求。
