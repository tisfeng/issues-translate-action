# 现代化 Agent 文档与受管 Skills

- 状态：completed
- 创建日期：2026-09-16
- 负责人：Codex
- 关联 Issue/PR：none

## 背景

当前项目沿用 `tisfeng/skills v0.3.0`、四个项目级 Codex 子代理、双 lock 和分散的 Agent
规则结构。Easydict 已将产品架构统一到 `docs/design-docs/`，精简根入口与专题规则，移除项目级
子代理，并将六个受管 Skills 升级到 `v0.6.0`。本任务按当前 GitHub Action 的 Node 24、
`src`/`dist`、Jest 和真实外部副作用边界进行语义移植。

## 任务摘要

- 意图模式：implementation
- 交付授权：auto-local-commit
- 安全状态：normal
- 目标结果：完成 Agent 文档结构收敛、设计文档合并、六个受管 Skills 升级和旧子代理移除。
- 允许修改路径：`AGENTS.md`、`.agents/skills/`、`.codex/agents/`、
  `.codex/agents-lock.json`、`skills-lock.json`、`THIRD_PARTY_NOTICES.md`、`docs/agents/`、
  `docs/architecture/`、`docs/design-docs/`、`docs/references/`、`docs/exec-plans/`、
  `docs/histories/`。
- 同任务 history：`docs/histories/2026-09/2026-09-16-agent-documentation-modernization.md`
- 禁止动作：不修改产品源码、测试、`dist/`、Action 配置、workflow、依赖或远程状态；不引入
  `fireworks-tech-graph`、Easydict 专属 Skill、Swift/Xcode 规则或 Claude 兼容入口。
- 预期交付物：一次原子的本地 Agent 治理提交，不 push。
- 验收标准：受管快照与固定 tag 一致，现行规则无旧路径或子代理依赖，文档链接与静态检查通过。

## 语义与范围

- 用户要求 Agent 执行上一轮已确认的完整迁移方案。
- 授权仓库内 Agent 文档、受管 Skill、lock、设计说明、计划和 history 写入及本地自动提交。
- 不授权外部 GitHub 写入、真实 workflow、评论、标题修改或翻译请求。
- Easydict 文档是迁移参考；项目特有运行时与验证边界以当前 Action 为准。
- 无待澄清歧义。

## 写入前状态

- 写入前检查：pass
- 自动提交资格：eligible
- 初始 HEAD：`7b3e6fa4cefd40c02df5429c982c1f41a27c3a06`
- 初始 staged 路径：无
- 初始 unstaged 路径：无
- 初始 untracked 路径：无
- 初始冲突：无
- Agent-owned paths：允许修改路径中本任务实际产生的全部路径。

## 目标与非目标

### 目标

- 将六个受管 Skills 从 `v0.3.0` 同步至固定 `v0.6.0`，更新来源、lock 和第三方通知。
- 删除上游已停止发布的项目级 Codex 子代理与 agents lock。
- 精简根入口和专题规则，同时保留 Action 特有的构建、测试、打包和外部副作用边界。
- 将运行架构迁入 `docs/design-docs/`，统一 plan/history 生命周期与月份归档。

### 非目标

- 不改变产品行为、发布流程、GitHub workflow、公开 README 或依赖。
- 不重写历史文档中的旧版本事实，不增加新的平台兼容层或第三方 Skill。

## 工作计划

1. 从固定上游 tag 同步六个 Skills，更新 lock、来源和许可证信息，删除旧子代理资产。
2. 收敛 `AGENTS.md`、`docs/agents/` 和外部资产设计，保留本项目专属约束。
3. 将架构文档迁入 `docs/design-docs/`，更新全部现行引用。
4. 按月份整理 completed plans，精简 plan/history 入口与模板并修复真实链接。
5. 验证快照、hash、Skill 测试、Markdown 链接、规则语义、范围和 Git 状态。
6. 归档计划、完成 history，并按初始任务规则创建本地提交。

## 风险与决策

- 删除 `.codex/agents/` 是仓库内部 Agent 工作流的 breaking change，但不影响 Action runtime。
- 迁移任务本身继续遵守初始 HEAD 的规则，不能用新文档反向扩大本次授权。
- Skills 必须通过安装器从固定 tag 同步，不从 Easydict 工作树复制，避免带入忽略文件。
- `development.md` 保留现名，因为它同时承载 GitHub Action 事件和外部副作用规则。
- 保留当前风险驱动的 Jest 测试政策，不照搬 Easydict 的 Swift/Xcode 或显式测试授权约束。

## 进度

- [x] 冻结初始状态和迁移基线。
- [x] 同步 Skills 并移除子代理。
- [x] 精简和迁移文档。
- [x] 完成验证与本地提交准备。

## 验证

- `skills@1.5.25` 从固定 `v0.6.0` 安装六个完整 Skill，逐目录 `diff -qr` 与 peeled commit
  `b4a4791265ca376f3deb4700791cce6e5a470be7` 一致。
- 按安装器 `localeCompare` 顺序重算六个 SHA-256，全部匹配 `skills-lock.json`。
- Python 3.12.3 运行 `git-commit` 19 项、`review` 7 项、`review-pr` 45 项、`submit-pr` 23 项、
  `worktree-rebase-merge` 6 项，共 100 项通过。
- Python 语法、Shell `bash -n`、六个 `agents/openai.yaml`、JSON 和 `git diff --check` 通过。
- 63 个 Markdown 文件中的本地相对链接和锚点检查通过；迁移时发现的两处月份目录反向链接已修复。
- 当前规则旧路径/版本/子代理残留、允许路径、初始 HEAD 和 runtime 路径检查通过。
- 按 `review` Skill 审查最终迁移方案与文档内容，无阻塞 finding。
- 未运行 npm build、test、lint 或 package；本任务未修改 Action runtime、测试、依赖或 workflow。

## 完成条件

- [x] 所有计划内文件和验证完成，计划移动到 `completed/2026-09/` 并由同任务 history 链接。
- [x] 交付范围只包含 Agent-owned paths，不修改 runtime，不 push。
