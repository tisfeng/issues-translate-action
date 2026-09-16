---
name: release
description: 规划、执行并核验 issues-translate-action 的 GitHub Action 发布，包括候选 SHA、annotated tag 和 GitHub Release。普通本地提交使用 git-commit；创建 PR 使用 submit-pr。
---

# 发布 issues-translate-action

将经过验证的精确提交发布为不可变的版本 tag 和 GitHub Release。发布会改变远程分支、tag
和 Release；普通实现、本地提交或 PR 授权不隐含正式发布授权。

## 模式与授权

- **plan**：只读检查本地状态、缓存信息与远程公开状态，给出目标版本、候选 SHA、发布范围、
  命令和风险；不 fetch、不修改文件或 Git ref，不 push、创建 tag 或 Release。
- **执行**：仅在用户明确要求发布时进入。版本、候选 SHA、目标 repository、分支或授权范围不明确
  时先停止，不把“准备发布”“验证发布”解释成远程写入授权。

用户对版本、remote、Release notes、assets、draft、prerelease、latest、确认或暂缓的要求持续有效。
没有单独授权时，不修改历史 Release、旧 tag、浮动 major tag、Marketplace 状态或其他仓库。
用户未指定 `latest` 时，在创建 Release 时显式保持 `latest=false`，不让 GitHub 自动选择。

## 事实源与仓库边界

- Action 的公开配置和入口以 [`action.yml`](../../../action.yml) 为准。
- 手写运行时行为以 [`src/main.ts`](../../../src/main.ts) 为准；实际 Action 入口是被跟踪的
  `dist/index.js`，必须由 `ncc` 从当前源码与运行时依赖生成。
- 构建与打包要求见[构建与测试](../../../docs/agents/build-and-test.md)，事件、凭据和外部副作用见
  [开发规则](../../../docs/agents/development.md)。
- 已发布版本、remote branch、tag 和 Release 状态以执行时重新读取的 Git/GitHub 远程状态为准。
  不依据本地 remote-tracking ref 推断当前远程状态。
- `package.json` 是 private package，其历史版本号不自动等同于 GitHub Action release tag；
  不仅为匹配 tag 而修改它。

## 发布流程

### 1. 冻结范围

1. 记录仓库根目录、HEAD、分支、工作树、索引、冲突、remote URL 和默认分支。识别目标 repository
   与发布 remote；存在 fork/upstream 歧义时要求用户明确选择。
2. 确认精确的 `vX.Y.Z`、release SHA 和目标分支。候选必须是已提交对象，且不得包含 task-owned
   发布 plan/history 的未提交内容。
3. 直接读取远程分支、目标 tag 和 GitHub Release；目标已存在或远程分支发生非预期漂移时停止。
   唯一恢复例外是：同一任务已记录 tag 推送成功、Release 创建失败，并重新核验该远程 tag 是指向
   冻结 SHA 的 annotated tag 且同名 Release 仍不存在；此时可跳过分支和 tag 写入，仅补建 Release。
   已发布 tag 不得移动、重指、删除后重建或 force push。
4. 在任何写入前确认 GitHub 身份与所需权限。不得使用 Action 的 bot token 作为发布凭据，
   也不得在文档、plan、history、命令输出摘录或回复中记录 token。

多步骤发布使用[执行计划模板](../../../docs/exec-plans/templates.md)。任务自有 plan/history 可以在工作树
中存在，但在 tag 创建前不得进入候选提交或被顺带推送。

### 2. 验证候选

在冻结的 release SHA 对应内容上运行：

```bash
npm run format-check
npm test -- --runInBand
npm run build
npm run lint
npm run package
git diff --check
```

验证 `action.yml` 使用预期 Node 运行时并指向 `dist/index.js`；比较打包前后的 tracked tree，确认
`dist/`、source map 和 license 产物没有遗漏或意外差异。任何必要检查失败、生成内容与候选不一致，
或验证后 HEAD/工作树发生非预期变化时停止，不跳过检查继续发布。

### 3. 执行远程写入

1. 写入前再次读取目标分支、目标 tag 和 Release，确认与冻结状态一致。
2. 仅以 fast-forward 方式把精确 release SHA 推送到已确认分支；不 rebase、merge 或 force push。
3. 在同一 SHA 创建并推送同名 annotated tag。
4. 使用远程已存在 tag 的校验选项创建标题与 tag 完全一致的 GitHub Release，禁止 GitHub 自动
   创建 tag。除非用户另有要求，发布为非 draft、非 prerelease 的 stable Release，不上传 assets；
   Release notes 必须与已批准范围一致。用户未授权 Latest 时显式设置 `latest=false`，只有明确授权
   后才将本次 Release 标记为 Latest。
5. 只修改本次获准创建的实体，不顺带编辑历史 notes、assets、target、draft、prerelease 或 latest
   状态。任一步骤部分成功后保留现场并停止，不通过删除、重建或移动 tag 自动回滚；记录已成功
   的远程对象，使后续调用只能在上述恢复条件满足时跳过它们。

### 4. 发布后核验

重新读取并记录：

- 远程目标分支 SHA、annotated tag object 和 peeled release SHA；
- Release URL、tag、title、target、draft、prerelease、latest 和 assets；
- tag 源码归档中预期的 `action.yml` 与 `dist/index.js`；
- 实际完成、失败和未执行的远程动作。

使用 [history 模板](../../../docs/histories/template.md)记录真实结果。发布记录在 tag 创建与远程核验后
单独提交，使记录不进入本次发布归档；本地提交使用 `git-commit`。只有远程分支、tag、Release
和归档均已核验时，才声称发布完成。

## 停止条件

遇到版本或 repository 歧义、工作树归属不明、远程漂移、目标 tag/Release 冲突、凭据不足、
验证失败或写后状态不一致时停止。报告精确阶段和已经发生的写入，不扩大授权、猜测目标、触发真实
Action 翻译事件或重复已成功的远程操作。
