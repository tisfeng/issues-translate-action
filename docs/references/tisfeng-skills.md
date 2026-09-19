# `tisfeng/skills` 来源参考

- 核对日期：2026-09-20。
- 来源：`https://github.com/tisfeng/skills`。
- 采用版本：`v0.6.2`。
- annotated tag object：`b30ebbc0599fbf29bb563052b119de5967bd10a8`。
- peeled commit：`ee30f149f523a76b14df55884fe149a549798d2f`。
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

`v0.6.1` 让 `review-pr` 在当前 GitHub 用户是 PR 作者、同名本地分支可以安全 fast-forward 且
upstream 仓库与分支等价时复用该分支；`v0.6.2` 延续该分支交接修复并保留其测试覆盖；其他不安全
或身份不明场景仍走 collision fallback。`worktree-rebase-merge` 同时移除 UI 展示名称中的斜杠；
其余四个受管 Skill 内容不变。

## 已核验安装形式

`skills@1.5.25` 没有 `--cwd` 选项，必须从目标仓库根目录执行。使用独立的
`npm_config_cache`，避免依赖全局 npm 缓存权限：

```bash
npx -y skills@1.5.25 add \
  https://github.com/tisfeng/skills/tree/v0.6.2 \
  --skill code-simplifier git-commit review review-pr submit-pr worktree-rebase-merge \
  --agent codex --yes --copy --full-depth
```

`skills-lock.json` 记录 tag、入口路径和内容哈希。同步后重算六个目录并与固定 tag 的 tracked
tree 比对，同时运行受影响 Skill 的测试与静态检查。`submit-pr` 需要 Python 3.10 或更高版本；
同一任务的 `plan` 与 `apply` 使用同一个已核验解释器。

2026-09-17 使用 Python 3.12.3 运行内容发生变化的 `review-pr` 53 项测试，并完成 Shell/Python
语法及两个变更 Skill 的结构校验，全部通过。

## 重新核对条件

- 发布新的统一版本。
- 安装器版本、lock 格式或 Skill 集合发生变化。
- 上游重新引入平台专属资产，或项目规则无法覆盖某项必要差异。
