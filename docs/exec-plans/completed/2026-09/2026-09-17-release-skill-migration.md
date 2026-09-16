# 发布文档迁移为项目 Skill

- 状态：completed
- 创建日期：2026-09-17
- 完成日期：2026-09-17
- 负责人：Codex
- 关联 Issue/PR：无

## 背景

原发布治理分散在 `docs/releases/` 的入口和流程文档中，虽然内容实际用于指导 Agent 执行，
却没有 Skill 的发现信息、只读/执行模式和明确停止条件。用户要求将其迁移为发布 Skill，并从
文档目录移除。

## 目标与范围

- 目标结果：建立仓库自有的 `$release` Skill，并由根 `AGENTS.md` 直接路由。
- 允许修改路径：`AGENTS.md`、`.agents/skills/release/**`、`docs/agents/README.md`、
  `docs/releases/**`、本计划及同任务 history。
- 同任务 history：`docs/histories/2026-09/2026-09-17-release-skill-migration.md`
- 用户限制：移除 `docs/releases/`；本任务不 push、不发布、不修改外部服务。
- 非目标：不修改产品代码、构建产物、外部受管 Skill、`skills-lock.json` 或第三方通知。
- 验收标准：Skill 可被发现并通过结构校验，现行规则不再路由到 `docs/releases/`，旧目录删除。

## 工作计划

1. 新建精简的 `$release` Skill 入口与 UI 元数据，收敛发布模式、验证、远程写入和发布后核验。
2. 更新 `AGENTS.md` 与 Agent 文档，区分项目自有 Skill 和六个外部受管快照。
3. 删除 `docs/releases/`，保留 completed plan/history 中对旧路径的历史事实记录。
4. 校验 Skill、YAML、相对链接、受管快照边界和 Git diff，完成 history 并创建本地提交。

## 风险与决策

- `$release` 是项目专属流程，不登记到仅描述外部快照的 `skills-lock.json`。
- 原发布文档内容较短，直接合并进 `SKILL.md`；不保留无必要的 `references/` 层级。
- 发布属于远程高风险操作，Skill 明确区分只读 plan 与获得授权后的执行，并为部分成功设置停止条件。
- 未授权 Latest 时显式使用 `latest=false`，避免 GitHub 自动改变 Latest；tag 已成功而 Release 失败时，
  只有同一任务记录及精确远端身份全部匹配才允许仅补建 Release。
- completed plan/history 不作为现行规则，不为追求旧路径零命中而改写历史记录。

## 进度

- [x] 创建并校验 `$release` Skill。
- [x] 更新现行路由与治理说明。
- [x] 删除旧发布文档。
- [x] 完成验证、history 与本地提交准备。

## 验证

- `quick_validate.py .agents/skills/release`：通过。
- `js-yaml` 解析 `agents/openai.yaml` 并核对 `$release` 默认 prompt：通过。
- Skill 相对链接、旧目录删除、现行路由和外部受管 Skill 边界：通过。
- 独立前向检查及修复后复验：通过；Latest 授权和 tag/Release 部分成功恢复缺陷已关闭。
- `git diff --check`：通过。
- 本任务不修改运行时代码，未运行 npm build、test、lint 或 package。

## 完成条件

- [x] `$release` Skill、现行路由和 UI 元数据一致。
- [x] `docs/releases/` 已删除，现行文档没有指向它的链接。
- [x] 所有静态检查通过，计划归档且 history 完成。
