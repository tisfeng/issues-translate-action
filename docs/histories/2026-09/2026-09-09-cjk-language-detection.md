# 修复技术混排评论的语言识别

- 日期：2026-09-09
- 状态：completed
- 关联 Issue/PR：[Easydict PR #1283](https://github.com/tisfeng/Easydict/pull/1283)
- 执行计划：[`../../exec-plans/completed/2026-09-09-cjk-language-detection.md`](../../exec-plans/completed/2026-09-09-cjk-language-detection.md)

## 用户目标

修复中文技术评论被错误识别为非中文、翻译后仍回写中文的问题；本次不发布版本。

## 设计意图

- 保留 `franc-min`，仅在 Latin 技术噪声可能压过具有充分证据的 CJK 文本时使用 Unicode
  script-aware override。
- 仅对检测副本移除 Markdown 技术噪声，原始 Markdown 不变地用于翻译和回写。
- 将翻译 no-op 判断扩展为 NFC 与换行编码等价，保留 Markdown 有意义的空格和缩进。

## 主要变更

- 新增 `src/language-detection.ts`，集中处理检测文本清理与中日韩 script 判定。
- 为日文和韩文补充 `jpn`、`kor` 检测别名，并保持 Han-only 中日歧义回退 `franc-min`。
- 更新联合翻译路径，使标题和正文分别跳过无实质变化的结果。
- 补充中文技术混排、CJK 边界、Markdown 清理和 no-op 回写的 Jest 回归测试。
- 更新架构文档，并重新打包 Action 运行时产物。

## 验证

- `npm run format-check`：通过。
- `npm test -- --runInBand`：通过，42 tests passed。
- `npm run build`：通过。
- `npm run lint`：通过。
- `npm run package`：通过，更新 `dist/index.js` 与 `dist/index.js.map`。
- `git diff --check`：通过。

## 后续事项

未发布版本。需要用户另行授权后，才可发布 patch 版本并更新消费仓库的 Action 引用。
