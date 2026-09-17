# 升级 `tisfeng/skills` 至 v0.6.1

- 状态：completed
- 创建日期：2026-09-17
- 负责人：Codex
- 关联 Issue/PR：https://github.com/tisfeng/skills/releases/tag/v0.6.1

## 背景

issues-translate-action 当前固定使用 `tisfeng/skills v0.6.0` 的六个通用 Skill。上游已经正式
发布 `v0.6.1`，本任务将受管快照升级到该固定版本。

## 目标与范围

- 目标结果：将六个 `tisfeng/skills` 受管 Skill、lock、来源参考和第三方通知统一固定到 v0.6.1。
- 允许修改路径：六个 `tisfeng/skills` 受管目录、`skills-lock.json`、
  `THIRD_PARTY_NOTICES.md`、`docs/references/tisfeng-skills.md` 及本任务 plan/history。
- 同任务 history：`docs/histories/2026-09/2026-09-17-upgrade-tisfeng-skills-v0.6.1.md`
- 用户限制：将 Easydict 已完成的上游 Skills 更新移植到 issues-translate-action；不 push、不创建
  PR、不发布、不运行真实 workflow。
- 非目标：不修改项目专属 `release` Skill、Action 源码、测试、`dist/`、依赖或 workflow。
- 验收标准：六个目录匹配 v0.6.1 tag tree，目录 hash 与 lock 一致，相关测试和静态检查通过。

## 工作计划

1. 冻结初始状态、v0.6.1 发布证据和相对 v0.6.0 的变更范围。
2. 用固定版本安装器从固定 tag 同步六个完整 Skill 目录。
3. 核对上游 tree、lock hash、保护路径并运行变更 Skill 的测试。
4. 更新来源、第三方通知、history 和本计划，审查后创建本地提交。

## 风险与决策

- 固定使用正式发布的 annotated tag，不跟随可移动分支。
- 安装器只覆盖 lock 已声明的六个 Skill，项目专属发布 Skill 与 Action runtime 保持不变。
- 当前 `main` 在任务开始前领先 `origin/main` 3 个提交；本任务保留既有提交，不 push。

## 进度

- [x] 已冻结初始状态和采用范围。
- [x] 已同步并验证受管 Skill。
- [x] 已完成记录、审查和本地提交准备。

## 验证

- 六个受管目录逐文件匹配 tag `v0.6.1`；按安装器顺序独立重算六个目录的 SHA-256，全部匹配 lock。
- Python 3.12.3：`review-pr` 53 项测试及变更 Python/Shell 语法检查通过。
- 两个变更 Skill 的 `quick_validate.py`、YAML/JSON 解析与 `git diff --check` 通过。
- 仓库默认 `python3` 缺少 PyYAML，结构与 YAML 校验改用项目既有的 Python 3.12.3 环境后通过。
- 本地 review 无 P0-P3 finding；固定 tag 的完整复制方案已经足够。

## 完成条件

- [x] 受管目录、lock、来源参考和第三方通知统一固定到 v0.6.1。
- [x] 必要验证通过，项目专属与 runtime 路径未修改。
- [x] 计划与 history 已归档并进入本地提交交付。
