# 两阶段目标语言路由

- Status: completed
- Date: 2026-09-04
- Owner: Codex

## 请求与范围

为 Action 增加第一、第二目标语言配置。文本不是第一语言时翻译为第一语言；文本是第一语言且第二语言非空时翻译为第二语言；否则跳过。默认第一语言为 `en`，第二语言为空，必须保持既有可见行为。

允许修改：

- `action.yml`、`src/main.ts`、`__tests__/main.test.ts`
- 必要的运行时语言代码映射依赖、锁文件和打包产物
- `README.md`、`README_CN.md`、`docs/architecture/overview.md`
- 本计划与同任务 history

不在本任务中：

- 触发真实 Action、翻译请求、Issue/PR 评论或标题写入。
- 修改 Easydict 的 workflow、创建 Release、暂存、提交或推送。
- 修改既有 bot 凭据机制。

## 初始状态

- HEAD：`fc86486959aad3c51b4903044534e6cdc09468a3`
- Branch：`main`
- Staged、unstaged：无
- 任务前已有 untracked：
  - `docs/exec-plans/completed/2026-09-04-v2-8-3-release.md`
  - `docs/histories/2026-09/2026-09-04-v2-8-3-release.md`
- 本任务 Agent-owned paths：本计划、同任务 history，以及请求范围内的代码、测试、文档、依赖和 `dist/` 产物。

## 实施结果

1. 新增 `PRIMARY_LANGUAGE`（默认 `en`）与 `SECONDARY_LANGUAGE`（默认空）输入。
2. 通过 Google Translate 代码校验、`langs` ISO 映射和中文别名，将 `franc-min` 结果归一化后按两阶段规则选择目标语言；没有标准映射的 Google 代码以自身检测码为回退。
3. 标题和正文独立选择目标；目标相同时维持合并翻译，不同时分别翻译，且全部翻译完成前不执行 GitHub 写入。
4. 默认 bot note 改为方向中立的说明；非空 `CUSTOM_BOT_NOTE` 仍完整覆盖默认值。
5. 新增默认配置、双向路由、中文别名、Google 代码回退、无法识别、非法配置、混合标题正文、同目标合并与机器人回环测试；已重新打包 `dist/`。

## 验证

- `npm run format-check`：通过。
- `npm test -- --runInBand`：通过，29 个测试。
- `npm run build`：通过。
- `npm run lint`：保留 6 条 `i18n-text/no-en` 基线违规；本次新增代码未增加违规。
- `npm run package`：通过，更新 `dist/index.js`、source map 和 licenses。
- Action YAML 解析与两个输入默认值校验：通过。
- `git diff --check`：通过。

## 完成条件

- [x] 默认配置仍为“非英文到英文、英文跳过”。
- [x] 双语言配置可将第一语言文本翻译到第二语言，其他文本翻译到第一语言。
- [x] 无效、相同或 `auto` 目标语言失败明确。
- [x] 不发生真实外部写入，且任务前已有 untracked 文件保持不变。
