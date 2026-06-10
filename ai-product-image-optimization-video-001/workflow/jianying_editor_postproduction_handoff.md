# Jianying Editor 后置包装交接

更新时间：2026-06-04

## 定位

Jianying Editor 不替代 Playwright 和 Remotion。

它只接在 Remotion 干净母版之后，负责短视频平台包装层：

- 口播字幕
- 花字
- BGM
- TTS
- 大字标题
- 剪映草稿生成

不做自动导出。最终由用户在剪映里打开草稿、预览、手动导出。

## 已知本机路径

工作区：

`/Users/admin/Documents/Codex/2026-06-04/luoluoluo22-jianying-editor-skill-https-github`

输出目录：

`/Users/admin/Documents/Codex/2026-06-04/luoluoluo22-jianying-editor-skill-https-github/outputs`

临时工作目录：

`/Users/admin/Documents/Codex/2026-06-04/luoluoluo22-jianying-editor-skill-https-github/work`

业务脚本目录：

`/Users/admin/Documents/Codex/2026-06-04/luoluoluo22-jianying-editor-skill-https-github/work/scripts`

已安装 Skill：

`/Users/admin/.codex/skills/jianying-editor-skill`

调研用仓库副本：

`/Users/admin/Documents/Codex/2026-06-04/luoluoluo22-jianying-editor-skill-https-github/work/jianying-editor-skill`

剪映草稿目录：

`/Users/admin/Movies/JianyingPro/User Data/Projects/com.lveditor.draft`

## 版本与能力边界

- Skill 版本：非 git 安装版，`VERSION = 1.5.0`。
- 不默认 `git pull` skill。
- 不做自动导出。
- 不做自动导出时，macOS 剪映 5.9 可支持。
- 5.9 不是唯一硬门槛；如果已有 6+ 模板读取、解密、回写方案，剪辑生成和模板生产功能基本可继续做。
- 当前真正脆弱的是自动导出，所以排除在流程外。
- 主要风险是不同剪映版本的 draft schema 字段是否齐全，尤其：
  - `draft_info.json`
  - `draft_content.json`
  - `materials`
  - `tracks`
  - 字幕字段
  - 花字字段
  - 特效字段

## 脚本与日志规范

业务剪辑脚本不能写进：

`/Users/admin/.codex/skills/jianying-editor-skill`

新脚本应写在当前工作区，例如：

`/Users/admin/Documents/Codex/2026-06-04/luoluoluo22-jianying-editor-skill-https-github/work/scripts/`

Python 长脚本日志目录：

`/Users/admin/Documents/Codex/2026-06-04/luoluoluo22-jianying-editor-skill-https-github/.codex_py_logs/`

日志命名：

`py-run-YYYYMMDD-HHMMSS.log`

成功时聊天里只报关键结果和产物路径；失败时再读取日志定位错误。

## 输入缺口

进入 Jianying Editor 阶段前，需要补齐：

- Remotion 干净母版视频路径。
- 原音频路径，或确认是否需要 TTS 新生成。
- 剪映模板草稿名或模板目录。
- 目标新草稿项目名。
- 是否保留原模板轨道。
- 口播脚本、字幕、花字风格要求。
- 是否已有 6+ 模板解密后的 `draft_content.json` / `draft_info.json` 路径。

## 推荐主流程

1. 接收素材
   - 读取 Remotion 母版、音频、模板。
   - 确认视频时长、分辨率、帧率、音轨情况。
   - 如果音频来自视频内音轨，先抽取音轨。

2. 音频转写
   - 对音频做 ASR 转写。
   - 输出带时间戳的转写结果。
   - 保留原始转写文本、清洗后文本、字幕切分版本。

3. 视频精准读取内容
   - 不只依赖音频。
   - 按镜头或时间段抽关键帧。
   - 对关键帧做画面描述、OCR、屏幕内容识别。
   - 将画面信息和音频转写按时间线对齐。
   - 形成 `时间点 -> 画面内容 -> 说话内容 -> 可剪辑意图`。

4. 撰写剪映包装脚本
   - 产出旁白脚本。
   - 产出字幕文本。
   - 产出花字重点词。
   - 产出每段时间范围。
   - 产出推荐画面使用方式。
   - 产出需要强调或放大的信息点。
   - 脚本不能只复述原文，要形成可剪辑结构。

5. 生成或替换剪映草稿
   - 使用 `/Users/admin/.codex/skills/jianying-editor-skill/scripts/jy_wrapper.py`。
   - 导入视频、音频、字幕、花字、必要贴纸或效果。
   - 如果使用模板，先复制模板生成新草稿，不直接改原模板。
   - 加载已有草稿时不要用 `overwrite=True` 覆盖用户原草稿。
   - 只有新建草稿才可以 `overwrite=True`。

6. 字幕
   - 根据转写文本和时间戳生成字幕。
   - 分句合理，避免单条过长。
   - 样式统一，适合手机竖屏阅读。
   - 位置不能遮挡主体和重要画面信息。

7. 花字
   - 从脚本中抽重点词、转折词、情绪词、结论词。
   - 只在关键节点添加，不能全程乱加。
   - 重点用于开头钩子、核心观点、情绪转折、结论或行动点。
   - 花字字段要同步到 `draft_content.json` 和 `draft_info.json`，确保剪映能识别。

8. 验证
   - 新草稿目录存在。
   - `draft_content.json` 存在。
   - `draft_info.json` 存在。
   - `tracks` 里有视频轨、音频轨、字幕轨。
   - `materials` 里有对应 videos、audios、texts。
   - 字幕数量合理。
   - 字幕时间范围不越界。
   - 不自动导出，只生成剪映草稿。

## 当前 AI 商品图视频链路位置

```text
Playwright 页面级录屏
  -> DOM/API 下载原图和生成图
  -> Remotion 干净母版
  -> Jianying Editor 包装草稿
  -> 用户在剪映手动导出
```

Remotion 输出给 Jianying 的母版应尽量干净：

- 无口播字幕。
- 无花字。
- 无 BGM。
- 无 TTS。
- 可保留必要的画面内功能说明，但避免和剪映包装层冲突。

Jianying Editor 负责补齐投放感：

- 黄金 3 秒大字标题。
- 口播字幕。
- 重点词花字。
- 节奏 BGM。
- 平台感音效。
- 最终草稿验证。

## 禁止项

- 不自动导出。
- 不直接修改用户原模板草稿。
- 不在 skill 安装目录写业务脚本。
- 不把所有字幕都做成花字。
- 不把 schema 不明的 6+ 草稿直接 overwrite。
