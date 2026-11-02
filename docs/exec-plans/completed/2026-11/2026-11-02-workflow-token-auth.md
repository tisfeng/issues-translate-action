# 移植工作流 token 认证并发布 v2.9.3

- 状态：completed
- 创建日期：2026-11-02
- 负责人：Unknown
- 关联 Issue/PR：https://github.com/dromara/issues-translate-action/pull/109

## 执行上下文

- **Agent Name:** `Unknown`
- **Model ID:** `Unknown`
- **Environment:** `macOS 27.0.1 / Xcode 27.2 (27B52)`

## 背景

Easydict 固定调用 v2.9.2，旧内置机器人凭据在 GitHub 评论写入时认证失败。
上游 #109 已删除该共享凭据；失效的具体原因和撤销时间没有得到确认。

## 目标与范围

- 目标结果：默认使用工作流 token，发布 v2.9.3，再更新 Easydict 的依赖。
- 允许修改路径：src、__tests__、action.yml、dist、README.md、README_CN.md、.github/workflows/action-test.yml、docs。
- 同任务 history：`docs/histories/2026-11/2026-11-02-workflow-token-auth.md`
- 用户限制：按移植、发布、更新 Easydict 的顺序执行；保留现有翻译功能。
- 非目标：更改翻译服务、语言识别、事件路由或运行时版本；移动已发布 tag。
- 验收标准：静态检查、离线测试、构建、打包和 review 通过；远程新 tag/Release 与发布源码和 dist 一致。

## 工作计划

1. 移植认证逻辑并补充离线认证测试。
2. 更新输入、权限、双语 README 和架构说明，重新打包并核对旧凭据清除。
3. 验证、review、归档计划、记录 history 并创建本地提交。
4. 复验远端后发布 annotated tag v2.9.3 和 Latest GitHub Release。
5. 核验发布产物后更新 Easydict workflow，静态验证并提交。

## 风险与决策

- token 以显式自定义输入优先，其次 github-token、兼容 GITHUB_TOKEN 输入和环境变量；缺少凭据立即失败。
- 默认 workflow token 使用 github-actions[bot]；自定义 token 保留用户 API 身份解析，不仅凭 token 前缀推断身份。
- github-token 和 GITHUB_TOKEN 专用于工作流凭据；自定义凭据通过 BOT_GITHUB_TOKEN 配置，GitHub App 还需显式 BOT_LOGIN_NAME。
- 默认评论身份改变；GitHub 自动 token 评论不会触发后续 issue_comment workflow。
- 不新建真实 issue/comment，不重跑真实 workflow；发布本身可能触发现有 push CI。

## 进度

- [x] 实现、测试、文档和打包。
- [x] 离线验证和 review。
- [x] 本地提交前的范围检查及发布准备。
- [x] v2.9.3 正式发布及归档核验完成；Easydict dev 依赖更新已本地提交。

## 验证

- 初始 Action main：fd3457e0824b7c729984022959323b8387dcbb39，工作树干净，与远端一致。
- 初始 Easydict dev：df86c3468feb8d5c83cd2bf7d7b817099f52898e，工作树干净，与远端一致。
- Node v24.19.0 / npm 11.17.0；远端最新版本为 v2.9.2，未发现 v2.9.3。

- `format-check`、58 个 Jest 测试、build、lint、package、YAML/README 检查和 diff-check 通过。
- Node 24 bundle 的缺凭据/自身评论离线 smoke 与源码和产物的旧凭据扫描通过。
- review 未发现可证实缺陷；仅对仓库锁文件使用 legacy-peer-deps 安装依赖。

## 完成条件

- 移植、验证和 review 已完成，发布提交 c23b39d03d0829323dc719ba0cf34a791675d21a 已推送。
- v2.9.3 annotated tag、正式 Latest Release 和源码归档均已核验，无附加 assets。
- Easydict dev 更新已创建本地提交 a4d2681132b8687702f561f389dfd8cdfc119020，静态验证通过。
- Easydict push 尚未获单独明确授权；线上生效与真实事件验收不计为已完成。

