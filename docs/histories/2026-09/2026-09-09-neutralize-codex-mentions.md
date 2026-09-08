# 中和自动译文中的 Codex mention

- 日期：2026-09-09
- 状态：completed
- 关联 Issue/PR：无
- 执行计划：无

## 用户目标

保留 Codex 审查摘要的自动翻译，同时防止翻译机器人写回的 `@codex` 意外触发新的
Codex 指令。

## 设计意图

- 在最终评论写回前处理 mention，避免翻译服务删除或改变中和字符。
- 仅中和独立的 `@codex`，不跳过 Codex 评论，也不改变其他 GitHub mention。

## 主要变更

- `src/main.ts` 在生成最终评论后，在独立的 `@codex` 的 `@` 后插入零宽空格，覆盖
  issue 评论和 Files changed review thread 回复。
- 测试覆盖中和规则、边界和由 Codex 机器人触发的评论回写；架构说明与中英文 README
  说明自动译文不能作为直接调用 Codex 的命令。
- 重新打包生成 Action 运行时产物，不手工修改 `dist/`。

## 验证

- `npm run format-check`、`npm test -- --runInBand`（33 项通过）、`npm run build`、
  `npm run lint`、`npm run package` 与 `git diff --check` 通过。
- 未进行真实 GitHub workflow、评论写入或翻译请求。

## 后续事项

- 无。
