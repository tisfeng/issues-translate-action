# 修复技术混排评论的语言识别

- 状态：completed
- 创建日期：2026-09-09
- 负责人：Codex
- 关联 Issue/PR：[Easydict PR #1283](https://github.com/tisfeng/Easydict/pull/1283)

## 背景

中文技术评论包含大量 SHA、Markdown 与英文术语时，`franc-min` 可能先选择 Latin
script 并误判为法语，导致 `PRIMARY_LANGUAGE: zh-CN` 的内容被请求翻译回中文。

## 任务摘要

- 意图模式：implementation
- 交付授权：auto-local-commit
- 安全状态：normal
- 同任务 history：[`../../histories/2026-09/2026-09-09-cjk-language-detection.md`](../../histories/2026-09/2026-09-09-cjk-language-detection.md)
- 禁止动作：未发布版本、未移动 tag、未推送、未更新消费仓库、未触发真实 workflow 或翻译请求。

## 完成内容

1. 检测副本现在忽略 URL、代码、Markdown destination 与 commit SHA，保留可见文字。
2. Unicode script-aware override 在 Latin 技术词压过有充分证据的中日韩文本时优先路由；
   Han-only 中日歧义保持回退 `franc-min`。
3. 翻译 no-op 判断识别 NFC 和行尾编码等价，并对联合翻译的标题与正文分别生效。
4. 已添加回归测试、更新架构说明并重新打包 `dist`。

## 验证

- [x] `npm run format-check`
- [x] `npm test -- --runInBand`
- [x] `npm run build`
- [x] `npm run lint`
- [x] `npm run package`
- [x] `git diff --check`

## 完成条件

- [x] 中文技术混排在 `zh-CN` / `en` 配置下选择英文目标语言。
- [x] 日文、韩文、Han-only 歧义与非 CJK 回退路径均有回归覆盖。
- [x] no-op 结果不产生 GitHub 写入，Markdown 实质变化不被抑制。
- [x] `dist` 由打包命令生成，执行计划已归档，并写入同任务 history。
