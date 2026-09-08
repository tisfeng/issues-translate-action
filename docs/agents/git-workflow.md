# Git 工作流

本文规定 Git 状态保护、暂存和本地交付。任务授权与保护状态以
[`request-boundary.md`](request-boundary.md) 为准，plan/history 生命周期以
[`README.md`](README.md) 为准。

## 基本安全

- 保留用户已有的 staged、unstaged、untracked 和提交历史，不重写或丢弃无关内容。
- 未获得对应授权时，不暂存、提交、创建分支、集成或推送；明确禁止优先。
- implementation 默认只允许满足门禁后的本地自动提交，不自行扩大为 fetch、pull、push、
  rebase、merge、reset、stash 或 clean。
- 每个提交聚焦一个连贯变更，并使用 Angular-style 信息。

## 交付顺序

1. implementation 使用首次写入前冻结的 HEAD、索引、工作树、冲突、允许路径和内容归属判断
   交付安全。
2. 完成最终审查和验证后冻结 `agent_owned_paths`，并将本任务每个实际改动路径逐一列入
   `expected_commit_paths`；不得遗漏、混入用户改动或包含允许范围外路径。
3. 所有其他写入结束后，串行使用 [`.codex/agents/git-delivery.toml`](../../.codex/agents/git-delivery.toml)：
   `commit` 与 `auto-local-commit` 使用 [git-commit](../../.agents/skills/git-commit/SKILL.md)，
   只有 `integration` 才使用 [worktree-rebase-merge](../../.agents/skills/worktree-rebase-merge/SKILL.md)。
4. 需要创建提交时，git-delivery 先以 `prepare` 只读重验现场并返回精确提交信息草稿；主 Agent
   展示草稿后，同一 agent 才能进入 `apply`。
5. 完成后主 Agent 独立核验提交哈希、实际提交信息、分支、工作树、统计和未 push 状态。

配置、授权、模型、范围、HEAD、索引、冲突或验证不确定时进入 protected；不得改由其他模型执行
缩减版交付。

## 自动本地提交

以下条件必须同时满足：

- 任务是 implementation，且没有仍有效的禁止提交或暂缓交付要求。
- 初始索引为空，交付前没有出现新的非 Agent staged 内容。
- HEAD 未变化，索引无冲突，用户内容与 Agent 变更可以清晰分离。
- 最终存在仓库差异，并已满足同任务 history 要求。
- `expected_commit_paths` 逐一列出全部 Agent-owned 改动；暂存后只包含这些路径。
- 必要审查和验证覆盖最终快照，没有未解决且经核实的阻塞问题或失败验证。

git-delivery 只精确暂存 expected paths，不使用 `git add .`。条件不满足时保留差异并报告原因，
不得为满足提交条件扩大授权或混入用户内容。

## 显式交付与集成

- 显式提交已有 staged 内容时以 staged raw patch 为唯一事实来源，不反向要求补写 history。
- 只有 integration 授权才允许创建任务分支、临时 worktree、rebase 或 merge。
- push 必须来自用户明确要求，或来自用户明确调用且 skill 必然包含 push 的 PR/发布工作流；
  执行前仍须核对远程目标和提交关系。
- PR review 与 PR 创建分别遵循 `review-pr`、`submit-pr` Skill 的完整流程；它们不互相授权。
