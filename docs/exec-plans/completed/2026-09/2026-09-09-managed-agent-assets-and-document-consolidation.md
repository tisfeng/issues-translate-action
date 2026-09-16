# 受管 Agent 资产与文档收敛

- 状态：completed
- 创建日期：2026-09-09
- 负责人：tisfeng
- 关联 Issue/PR：none

## 背景

将 Easydict 连续提交 `f61433859`、`12f05421` 与 `7ade3bcb` 的最终受管
Skill、Codex agent 和 Agent 文档治理语义移植到本 Node 24 GitHub Action。用户明确
排除 `fireworks-tech-graph`。

## 任务摘要

- 意图模式：implementation
- 交付授权：auto-local-commit
- 安全状态：normal
- 目标结果：受管六个通用 Skill、四个 agent、双 lock 与收敛后的最终规则结构。
- 允许修改路径：`AGENTS.md`、`.agents/skills/`、`.codex/agents/`、
  `.codex/agents-lock.json`、`skills-lock.json`、`THIRD_PARTY_NOTICES.md`、
  `docs/agents/`、`docs/design-docs/`、`docs/references/`、`docs/exec-plans/`、
  `docs/histories/`。
- 同任务 history：`docs/histories/2026-09/2026-09-09-managed-agent-assets-and-document-consolidation.md`
- 禁止动作：不添加 `fireworks-tech-graph`、不修改 Action 运行时、依赖、workflow、
  README、远程服务或 Git remote。
- 预期交付物：一次本地文档与受管资产提交，不 push。
- 验收标准：受管快照与指定源一致、锁和文档有效、旧规则无活动引用。

## 写入前状态

- 写入前检查：pass
- 自动提交资格：eligible
- 初始 HEAD：`799fc37a2a9ee19d3211b99e5d4d5cff1ad37c80`
- 初始 staged 路径：无
- 初始 unstaged 路径：无
- 初始 untracked 路径：无
- 初始冲突：无
- Agent-owned paths：本计划的允许修改路径中实际产生的全部路径。

## 工作计划

1. 从 `f61433859` 精确导入六个受管 Skill 和四个 Codex agent，排除
   `fireworks-tech-graph` 与 Easydict 专属资产。
2. 创建目标仓库的 lock、许可证通知、参考与设计文档。
3. 以 `7ade3bcb` 的最终语义收敛 Agent 文档，同时保留本 Action 的运行时与外部写入边界。
4. 验证受管快照、JSON/TOML、文档链接、规则引用和受影响脚本。
5. 归档计划、记录 history，并按 Git 门禁进行本地交付。

## 风险与决策

- 当前 `planner.toml` 将替换为 `tisfeng/skills v0.3.0` 受管版本，用户已授权按计划执行。
- `fireworks-tech-graph` 因用户明确排除而不导入，也不写入 lock。
- 上游六个 Skill 采用 MIT；在 `THIRD_PARTY_NOTICES.md` 保留版权与许可文本。

## 验证

- 六个 Skill 的 23 个文件逐字节匹配 `f61433859`；`skills-lock.json` 等于源 lock 去除
  `fireworks-tech-graph` 后的内容。
- 四个 agent 的 SHA-256 与 `.codex/agents-lock.json` 相符；JSON、TOML、Markdown 相对链接、
  已删除规则的活动引用和 `git diff --check` 均通过。
- `git-commit`、`review-pr` 和 `submit-pr` 的 Python 测试分别通过 19、27、21 项；
  `prepare-pr-branch.sh` 的 `bash -n` 通过。
- 未运行 npm build/test/lint/package、真实 GitHub workflow、翻译请求或 custom agent 发现验证，
  因本任务未触及 Action runtime，后两项需要独立环境或明确外部授权。

## 完成条件

- 所有计划内文件与验证完成，计划移动到 `completed/` 并由 history 链接。
