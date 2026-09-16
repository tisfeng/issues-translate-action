---
name: release
description: 规划或执行 issues-translate-action 的版本发布，并核验 tag 和 GitHub Release。仅本地提交使用 git-commit。
---

# 发布 issues-translate-action

按用户授权，将已验证提交发布为 annotated tag 和 GitHub Release。Action 配置以
[`action.yml`](../../../action.yml) 为准，手写行为以 [`src/main.ts`](../../../src/main.ts) 为准，
已发布版本以 GitHub 远程状态为准。

## 发布前

1. 确认版本、目标分支、HEAD、工作树、远程状态和目标 tag；已发布 tag 不得移动或重指。
2. 确认 `action.yml` 指向被跟踪的 `dist/index.js`，并按
   [构建与测试](../../../docs/agents/build-and-test.md)完成与变更匹配的验证和打包。
3. 写入前重新读取远程分支、tag 和 Release，确认没有冲突或漂移。
4. 仅在用户明确授权后，推送分支、创建 annotated tag 或创建、编辑 GitHub Release。

## 发布

- 只推送用户授权的提交和分支，不 force push。
- Release 标题与 tag 一致；只修改用户授权的 notes、assets、target、draft、prerelease 和 latest
  状态，并显式设置授权的 Latest 选择，不依赖 GitHub 自动决定。
- 不使用 Action 的 bot token 作为发布凭据，也不记录 token。发生部分失败时停止，重新读取远程
  状态并报告已完成和未执行的操作，不重复已经成功的写入。

## 发布后

1. 重新读取远程分支、tag、Release 标题、target、draft、prerelease、latest 和 assets。
2. 确认发布引用的源码归档包含预期 `action.yml` 和 `dist/index.js`。
3. 记录实际发布结果、未执行的外部操作和必要的后续事项。
