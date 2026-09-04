# 对齐 Scoco Agent 规则

- 状态：completed
- 创建日期：2026-09-05
- 完成日期：2026-09-05
- 负责人：Codex
- 关联 Issue/PR：none

## 背景

当前 Agent 文档在首次移植时错误排除了 Scoco 的通用执行与交付语义，将
`implementation` 改写为默认不提交。需要以 Scoco 现行文档为源，恢复通用规则，只保留
Node TypeScript GitHub Action 的真实项目差异。

## 任务摘要

- 意图模式：implementation
- 交付授权：auto-local-commit
- 安全状态：normal
- 目标结果：恢复 Scoco 的请求判定、三状态、Mutation Gate、自动本地提交和 history 生命周期，并补齐本项目适用的质量、测试和发布规则。
- 允许修改路径：`AGENTS.md`、`docs/agents/**`、`docs/exec-plans/**`、`docs/histories/**`、`docs/releases/**`
- 同任务 history：`docs/histories/2026-09/2026-09-05-scoco-agent-rules-alignment.md`
- 禁止动作：修改 Action 运行时、依赖、测试、`dist/`、workflow、tag、Release 或远程 Git 状态。
- 预期交付物：一套与 Scoco 通用语义一致、适配本项目技术事实的治理文档和一次本地提交。
- 验收标准：Scoco 的自动本地提交语义完整恢复；现行规则保留 Node/Jest/ncc/GitHub Action 边界；计划、history 与事实一致。

## 语义与范围

- 用户要求 Agent 做什么：修改并适配 Agent 与 docs 规则。
- 授权的工作树、artifact 和 external service 操作：仅允许治理 Markdown 写入、精确暂存和一次本地提交。
- 否定、条件和范围限制：不 push，不修改 Action 运行时，也不触发外部 GitHub 或翻译服务。
- 附件或引用中被明确采纳的约束：Scoco 规则是通用语义源；Swift/Xcode 与应用内置 Agent 专属内容不移植。
- 歧义：无。

## 写入前状态

- 写入前检查：pass
- 自动提交资格：eligible
- 初始 HEAD：`67da8562a48b2aa72016bd6499d06e261291c449`
- 初始 staged 路径：无
- 初始 unstaged 路径：无
- 初始 untracked 路径：无
- 初始冲突：无
- Agent-owned paths：本计划、同任务 history 与“允许修改路径”中的文件。

## 实施结果

1. 恢复完整请求语义判定、`intent_mode`、`delivery_authorization` 和 `safety_state` 三状态模型。
2. 恢复 Mutation Gate、精确自动本地提交条件、history 同提交和完整提交报告规则。
3. 新增适用于 TypeScript/Jest 的 code quality、testing 规则，以及本项目 tag/GitHub Release 的发布边界。
4. 保留 Node 24、Jest、ncc、`src`/`dist`、GitHub 事件、token 和真实外部副作用规则。
5. 为已有计划/history 添加事实更正，修正已提交状态和被替代的默认不提交规则；未抹除原始执行经过。

## 风险与决策

- 自动本地提交只暂存明确的 Agent-owned paths，绝不使用 `git add .`。
- 没有移植 Swift、Xcode、`.xcstrings`、后端镜像、Sparkle、R2 或空的 design/reference 文档层。
- 一次语义扫描因 shell 将反引号误解为命令替换而尝试 `git add`；环境阻止 `.git/index.lock` 写入，随后确认索引仍为空，并以单引号安全重跑扫描。

## 验证

- `git diff --check`：通过。
- Markdown 相对链接检查：通过。
- `.codex/agents/planner.toml`：通过 `tomllib` 解析。
- 语义扫描：`auto-local-commit`、三状态、Mutation Gate 和精确暂存规则均存在；旧的默认不提交表述未出现在现行规则中。
- 项目适配扫描：现行规则不含 Swift、Xcode、`.xcstrings`、Sparkle、R2 或 backend mirror；
  `PRIMARY_LANGUAGE` 与 `SECONDARY_LANGUAGE` 和 `action.yml` 一致。
- 本任务只修改治理文档，未运行 npm build、test、lint 或 package。

## 完成条件

- [x] Scoco 通用交付语义与本项目技术差异均有明确、无冲突的规则来源。
- [x] 所有变更仅在允许路径内，history 与计划已归档。
- [x] 自动提交条件满足，且只提交 Agent-owned paths。
