# V6 执行手册：先定稿，再生成

更新时间：2026-06-04

本手册根据最新约定调整：不再一条龙直接让 AI 做视频。先把脚本、素材、视觉风格、时间轴分别确认，再进入 Remotion 组件开发和剪映精修。

## 总原则

- 先定脚本，再动视频。
- 先固定素材目录，再写组件。
- 先用 HTML 快速确认视觉风格，再进 Remotion。
- 先确认时间轴，再开发 React 组件。
- 每个模块跑通后做阶段归档；当前目录不是 git 仓库，所以暂时不能按模块 commit。

## Step 1：先写脚本

状态：已完成。

当前产物：

- `/Users/admin/Desktop/运营推广材料/服务市场详情页/social_content_cases/ai-product-image-optimization-video-001/03_scripts_storyboards/v6_phase12/v6_hook_options.md`
- `/Users/admin/Desktop/运营推广材料/服务市场详情页/social_content_cases/ai-product-image-optimization-video-001/03_scripts_storyboards/v6_phase12/v6_script.md`
- `/Users/admin/Desktop/运营推广材料/服务市场详情页/social_content_cases/ai-product-image-optimization-video-001/03_scripts_storyboards/v6_phase12/v6_subtitle.md`
- `/Users/admin/Desktop/运营推广材料/服务市场详情页/social_content_cases/ai-product-image-optimization-video-001/03_scripts_storyboards/v6_phase12/v6_claim_check.md`

确认版 Hook：

```text
这张图不是丑，是没有主图感，不像能上架的主图。
```

验收：

- 每一页展示什么、文案是什么已经明确。
- 不承诺销量、点击率、转化率。
- 可以表达“确认后自动更新到当前商品”。

## Step 2：素材备好放进固定目录

状态：已完成。

Remotion 固定目录：

- `/Users/admin/Desktop/运营推广材料/服务市场详情页/social_content_cases/ai-product-image-optimization-video-001/10_v6_template/remotion/public/assets`

HyperFrames/HTML 风格确认固定目录：

- `/Users/admin/Desktop/运营推广材料/服务市场详情页/social_content_cases/ai-product-image-optimization-video-001/04_hyperframes_showcase/v6_html_style_probe/assets`

素材 manifest：

- `/Users/admin/Desktop/运营推广材料/服务市场详情页/social_content_cases/ai-product-image-optimization-video-001/10_v6_template/remotion/public/assets/assets_manifest.json`
- `/Users/admin/Desktop/运营推广材料/服务市场详情页/social_content_cases/ai-product-image-optimization-video-001/04_hyperframes_showcase/v6_html_style_probe/assets/assets_manifest.json`

验收：

- 原图、5 张优化图、录屏候选都已复制到固定目录。
- 文件名稳定，不再依赖原始长路径。
- slot2/slot3 已标注为风格补充，不承担严格一致性证明。

## Step 3：HTML 分镜确认视觉风格

状态：下一步优先执行。

目标：

- 用 HTML/HyperFrames 快速确认背景色、字体层级、强调色、图片占比。
- 不等 Remotion 渲染完再改视觉。
- 重点确认“商品图大图主导，录屏只作证据小窗”的视觉方向。

输入：

- 固定 assets 目录。
- `v6_result_showcase_config.json`
- `v6_timeline.json`

输出建议：

- `04_hyperframes_showcase/v6_html_style_probe/index.html`
- `04_hyperframes_showcase/v6_html_style_probe/style_review.md`
- 首屏截图或预览图。

验收：

- 不像 PPT。
- 不像网页组件轮播。
- 不使用米白大留白、灰底大字幕、顶部步骤标题。
- 商品图占画面主体。

## Step 4：时间轴规划确认

状态：已完成基础版；如果后续接入 OpenClaw，再由 OpenClaw 复核或重出。

当前没有检测到本机 `openclaw` 或 `opencli` 命令入口，所以本轮时间轴由现有文件承担：

- `/Users/admin/Desktop/运营推广材料/服务市场详情页/social_content_cases/ai-product-image-optimization-video-001/03_scripts_storyboards/v6_phase3/v6_timeline.json`
- `/Users/admin/Desktop/运营推广材料/服务市场详情页/social_content_cases/ai-product-image-optimization-video-001/03_scripts_storyboards/v6_phase3/v6_storyboard.md`

验收：

- 每段几秒明确。
- 每段出现什么素材明确。
- 每段字幕/口播明确。
- 人工确认后再写 React 组件。

## Step 5：组件开发 + Git 分步提交

状态：待执行，但当前目录不是 git 仓库。

推荐 Remotion 模块：

- `HookBeforeImage`
- `ResultPreview`
- `ScreenProofWindow`
- `ResultHeroSequence`
- `BatchProof`
- `ConfirmUpdateClose`
- `CaptionLayer`

建议提交节奏：

1. 初始化 Remotion 项目和 assets manifest。
2. 跑通 `HookBeforeImage` 和 `ResultPreview`。
3. 跑通 `ResultHeroSequence`。
4. 接入 `ScreenProofWindow`。
5. 接入 `BatchProof` 和 `ConfirmUpdateClose`。
6. 导出 draft MP4。
7. 进入 Jianying Editor 草稿精修。

当前阻塞：

- `/Users/admin/Desktop/运营推广材料/服务市场详情页` 不是 git 仓库，不能真正 commit。

可选处理：

- 如果要严格分步 commit，先在项目目录初始化 git，或把本 case 移入已有 repo。
- 如果暂不初始化 git，则每个阶段写 manifest 和 review 文件作为阶段归档。

## 当前推荐下一步

先执行 Step 3：HTML 分镜视觉确认。

原因：

- 脚本已定。
- 素材已固定。
- 时间轴已有基础版。
- 直接进 Remotion 容易把视觉问题带进 React 组件，返工成本更高。
