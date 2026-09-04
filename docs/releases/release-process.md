# 发布流程

## 发布前

1. 确认目标分支、HEAD、工作树、远程状态和目标 tag；已发布 tag 不得移动或重指。
2. 确认 `action.yml` 指向被跟踪的 `dist/index.js`，且源码或运行时依赖变更已重新打包。
3. 运行与变更风险匹配的验证；修改 `src/` 或运行时依赖时至少执行 format、test、build、
   lint、package 和 `git diff --check`。
4. 仅在用户明确授权后，推送分支、创建 annotated tag 或创建/编辑 GitHub Release。

## 发布操作

- Release 标题使用与 tag 一致的版本号，例如 `v2.8.3`。
- 只修改用户授权的 Release 字段；不要顺带修改历史 release notes、assets、tag、draft、
  prerelease 或 latest 状态。
- 不使用 Action 的 bot token 作为发布凭据，也不在文档、history 或回复中记录 token。

## 发布后

1. 重新读取远程分支、tag、Release 标题、target、draft、prerelease 与 latest 状态。
2. 确认发布引用的源码归档包含预期 `action.yml` 和 `dist/`。
3. 记录实际发布结果、未执行的外部操作和必要的后续事项。
