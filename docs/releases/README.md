# 发布文档

本目录记录 issues-translate-action 的发布流程、tag、GitHub Release 和发布治理说明。

## 当前文档

- [`release-process.md`](release-process.md)：发布前后检查与远程授权边界。

## 事实源

- Action 的公开配置和运行入口以根目录 [`action.yml`](../../action.yml) 为准。
- 手写运行时行为以 [`src/main.ts`](../../src/main.ts) 为准；被跟踪的 `dist/` 必须由 `ncc`
  从当前源码与运行时依赖生成。
- 已发布版本、tag 和 Release 状态以 GitHub 仓库的远程状态为准。

发布会改变远程分支、tag 或 GitHub Release。普通 implementation 或本地 commit 不隐含
正式发布授权；涉及 GitHub 凭据或外部服务时，必须获得对应授权。
