# 变更历史

`docs/histories/` 记录最终产生仓库文件差异的 implementation 任务；文件类型、数量、
变更规模以及是否存在 execution plan 都不影响该要求。

## 规则

- 每个产生仓库差异的 implementation 使用一条 history；同一任务多轮实施时继续使用同一条。
- 仅修改 history 的任务由该记录描述自身，不递归创建第二条；没有最终仓库差异时不创建空
  记录。
- 记录用户目标、设计意图、受影响路径、验证结果和已知后续事项，不复制完整对话、token、
  本地绝对路径、完整 payload 或原始日志。
- 存在执行计划时链接对应的 completed plan。
- history 与同任务变更一起验证；用户明确禁止提交或未授权交付时，保留全部未暂存变更。
- 文件放在 `YYYY-MM/` 下，命名为 `YYYY-MM-DD-<slug>.md`；结构标题使用中文，技术名词
  与路径保持原文。

新记录从 [`template.md`](template.md) 开始。
