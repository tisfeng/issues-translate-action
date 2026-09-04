# 两阶段目标语言路由

## 目标

为翻译 Action 增加可配置的第一、第二目标语言：非第一语言内容翻译为第一语言；第一语言内容在第二语言非空时翻译为第二语言。默认行为保持非英文翻译为英文、英文跳过。

## 设计与影响

- [`action.yml`](../../../action.yml) 增加 `PRIMARY_LANGUAGE`（`en`）和 `SECONDARY_LANGUAGE`（空）输入。
- [`src/main.ts`](../../../src/main.ts) 在 URL 清理后的 `franc-min` 识别结果上选择目标语言；用 `langs` 归一化 ISO 代码并处理中文别名。标题和正文可以拥有不同目标语言，只有同目标时才合并翻译。
- 默认 `CUSTOM_BOT_NOTE` 变为方向中立的“自动翻译此内容”；用户提供非空值时仍完整覆盖。
- [`__tests__/main.test.ts`](../../../__tests__/main.test.ts) 覆盖双向语言路由、混合标题/正文、批量路径、机器人回环以及无标准 ISO 映射的 Google 语言代码。
- `README.md`、`README_CN.md` 与架构文档说明输入、路由规则和 `IS_MODIFY_TITLE` 的唯一作用。
- 新增运行时依赖 `langs`，并重新生成跟踪的 `dist/` 运行时。

## 验证

- `npm run format-check`、`npm test -- --runInBand`（29 个测试）、`npm run build`、`npm run package`、Action YAML 校验和 `git diff --check` 均通过。
- `npm run lint` 保留 6 条原有 `i18n-text/no-en` 违规；本次没有新增违规。

## 已知后续事项

- 未触发真实翻译、GitHub 事件或评论/标题写入；未修改 Easydict workflow。
- 未创建 Release、暂存、提交或推送。本地改动需要在发布新版本后才能被 `uses: ...@v2.8.3` 的既有引用使用。
- `npm install` 为绕过既有 peer dependency 冲突使用了 `--legacy-peer-deps`；安装后 `npm audit` 报告 56 个既有依赖漏洞，本任务未执行 audit 修复。

## 关联计划

- [两阶段目标语言路由执行计划](../../exec-plans/completed/2026-09-04-two-language-routing.md)
