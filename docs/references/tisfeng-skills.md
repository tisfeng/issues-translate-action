# `tisfeng/skills` 来源参考

- 核对日期：2026-09-16。
- 来源：`https://github.com/tisfeng/skills`。
- 采用版本：`v0.6.0`。
- annotated tag object：`1e8cbe576a1558c731a520ef8d008a43be73c46b`。
- peeled commit：`b4a4791265ca376f3deb4700791cce6e5a470be7`。
- Tag 签名状态：annotated、unsigned；核验时同时固定 tag 和 peeled commit。
- Skills 安装器：`skills@1.5.25`。

## 采用范围

同步 `code-simplifier`、`git-commit`、`review`、`review-pr`、`submit-pr` 与
`worktree-rebase-merge` 六个完整 Skill 目录；不采用任何项目级 Codex 子代理，
`fireworks-tech-graph` 也不在采用范围内。

上游从 `v0.3.5` 起删除 Codex 子代理资产、安装器代码与 `@tisfeng/codex-agents` 包，只发布
平台无关的 Skills。`v0.4.0` 为六个公开 Skill 增加统一 UI 元数据并将低频细节拆入 references；
`v0.5.0` 更新 `submit-pr` 的固定 PR 模板和 detached checkout 支持；`v0.6.0` 更新
`git-commit` 的本地化正文标记和全局 `References:` 尾段契约。

## 已核验安装形式

`skills@1.5.25` 没有 `--cwd` 选项，必须从目标仓库根目录执行。使用独立的
`npm_config_cache`，避免依赖全局 npm 缓存权限：

```bash
npx -y skills@1.5.25 add \
  https://github.com/tisfeng/skills/tree/v0.6.0 \
  --skill code-simplifier git-commit review review-pr submit-pr worktree-rebase-merge \
  --agent codex --yes --copy --full-depth
```

`skills-lock.json` 记录 tag、入口路径和内容哈希。同步后重算六个目录并与固定 tag 的 tracked
tree 比对，同时运行受影响 Skill 的测试与静态检查。`submit-pr` 需要 Python 3.10 或更高版本；
同一任务的 `plan` 与 `apply` 使用同一个已核验解释器。

## 重新核对条件

- 发布新的统一版本。
- 安装器版本、lock 格式或 Skill 集合发生变化。
- 上游重新引入平台专属资产，或项目规则无法覆盖某项必要差异。
