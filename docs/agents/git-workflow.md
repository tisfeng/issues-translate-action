# Git 工作流与本地交付

本文件只规定 Git 状态、暂存和交付边界。写入前检查见
[`execution-safety.md`](execution-safety.md)。

## 状态与范围

- 每次写入前后检查 `git status --short --branch`；需要理解改动时使用原始 diff。
- staged、unstaged 与 untracked 文件默认属于用户，除非本任务已记录其 Agent-owned paths。
- 精确暂存只允许包含已授权、已验证的任务路径；不要用暂存范围掩盖无关改动。
- `git diff --check` 是每次文件变更的最低检查，不能替代功能验证。

## 授权边界

- `git add`、commit、push、pull、fetch、rebase、merge、reset、checkout 覆盖和分支创建都
  需要用户明确授权或用户明确调用的对应 skill。
- implementation 默认保留未暂存变更；它不自动授权本地提交。
- 用户调用提交 skill 时，严格按该 skill 的暂存与提交规则执行；没有该授权时不改变索引。
- push、pull、rebase 或 merge 从不由本地提交自动推断。

## 交付报告

报告实际提交、分支、工作树状态、push 状态和已运行验证。不要把未验证、未暂存或无关
变更描述为已交付。
