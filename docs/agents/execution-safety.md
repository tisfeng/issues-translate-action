# 执行安全与变更门禁

本文件规定 Agent 何时可以改变工作树或其他获准 artifact。请求模式见
[`request-boundary.md`](request-boundary.md)，Git 交付见
[`git-workflow.md`](git-workflow.md)。

## 核心规则

- `planning` 只允许读取、搜索、检查、起草和报告。
- `implementation` 必须有明确实施授权，并且只修改任务允许的路径。
- 第一次写入前记录 HEAD、分支、staged、unstaged、untracked 状态与 Agent-owned paths。
- 保留用户已有变更，不覆盖、重置、丢弃或混入无关路径。
- 变更前后执行与风险匹配的验证；未运行的检查必须明确标注。
- 最终产生仓库文件差异的 implementation 在同一任务创建或更新 history；多步骤或高风险
  工作同时维护 active plan。

## 写入前检查

在第一次写入前确认：

1. 用户已授权本次写入类型与目标结果。
2. 允许修改的路径和禁止动作明确。
3. 初始 Git 状态可安全区分 Agent 与用户变更。
4. 必要的 plan、history 和验证方式已经确定。

任一条件不满足时保持只读。

## 保护状态

出现下列情况时进入 `protected`：初始索引非空、存在冲突、Agent 路径与用户变更重叠、
授权或范围不明确、写入前检查未通过，或必要验证失败。保留现场，不继续写入、暂存或
提交，直到用户提供明确方向。
