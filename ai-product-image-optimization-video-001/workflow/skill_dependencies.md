# Skill Dependencies

This document lists the skills and tool capabilities required or useful for the AI 商品图优化 promotion-video workflow.

The repository should store the dependency contract, not the installed skill packages themselves. Skill source code should stay in the local Codex skill/plugin directories or upstream repositories.

## Dependency Levels

```text
Required     Needed for the workflow to run end to end.
Recommended  Strongly useful for quality or speed, but replaceable.
Optional     Useful for a specific variant or later production pass.
Reference    Mentioned for evaluation or inspiration, not part of the locked workflow.
```

## Required Skills / Capabilities

| Dependency | Level | Workflow Stage | Purpose | Notes |
| --- | --- | --- | --- | --- |
| `chrome:control-chrome` | Required | Login, manual observation, authenticated backend checks | Use the user's real Chrome session when the backend needs existing login state. | Do not export cookies or browser profiles. |
| `computer-use:computer-use` | Required for manual fallback | Manual backend operation, page state inspection | Lets Codex inspect and operate local Chrome/app UI when Playwright automation is blocked. | Fallback only; final recording standard is Playwright page-level recording. |
| Playwright | Required | Page-level recording, backend automation, DOM extraction | Fixed viewport recording, task page replay, image extraction via `page.evaluate`. | Implemented in `automation/playwright/playwright_gdsp_page_capture.mjs`. |
| Remotion | Required | Clean master video generation | Deterministic 16:9 layout, product animation, operation proof placement, result wall. | Spec in `remotion_clean_master_spec.md`. |
| FFmpeg / FFprobe | Required | Media validation, keyframe extraction, compression when needed | `ffprobe` verifies resolution/duration/fps/audio; `ffmpeg` extracts verification frames. | Final videos are not committed to this repo by default. |

## Recommended Skills / Capabilities

| Dependency | Level | Workflow Stage | Purpose | Notes |
| --- | --- | --- | --- | --- |
| `jianying-editor` | Recommended | Post-production packaging | Generate Jianying draft or guide packaging for subtitles, flower words, BGM, TTS, large titles. | No automatic export in the current workflow. Handoff spec in `jianying_editor_postproduction_handoff.md`. |
| HyperFrames | Recommended | HTML storyboard / visual probe | Quickly test layout, color, typography, product image hierarchy before Remotion rendering. | HTML is a draft/probe only, not the final template. |
| `browser-use/video-use` | Recommended | Video/reference analysis and screen-recording pattern exploration | Helps reason about video-use style operations and reference-video decomposition. | Use for analysis/template thinking; production master is Remotion. |
| `imagegen` / image2 | Recommended when adapting visuals | Business flow diagrams, aspect-ratio/image polish when needed | Used for visual planning assets and image adaptation. | Do not use image generation to fake backend evidence. |

## Optional / Variant Skills

| Dependency | Level | Workflow Stage | Purpose | Notes |
| --- | --- | --- | --- | --- |
| `remotion-dev/skills` | Optional | Remotion implementation support | Can provide Remotion-specific implementation guidance. | Useful when building new compositions or debugging rendering. |
| `jacky-opc` / copywriting-style helpers | Optional | Hook/copywriting refinement | Helps improve hooks, script, captions, and platform-native wording. | Not part of the clean Remotion master; belongs before Jianying packaging. |
| OpenCLI / OpenClaw-style social capture | Optional future phase | Reference-video collection and structure analysis | Collect and analyze high-performing social examples. | Not required while validating video-template loop; add later when the sampling flywheel restarts. |
| `douyin-image2-aspect-ratio-adapter` | Optional | Product image aspect adaptation | Ensures 3:4 output is based on approved 1:1 image when required. | Relevant if backend generation or prompt workflow requires explicit 1:1 -> 3:4 adaptation. |
| `douyin-visual-plan-audit` | Optional | Image prompt/compliance QA | Audit sensitive claims and unsupported main-image text before generation. | Useful when product images contain marketing claims. |

## Local Skill Paths Observed In This Workflow

These paths are environment-specific and should not be treated as portable install instructions:

```text
/Users/admin/.codex/skills/jianying-editor-skill
/Users/admin/.gstack/repos/gstack/.agents/skills/gstack-office-hours
/Users/admin/.codex/skills/douyin-image2-aspect-ratio-adapter
/Users/admin/.codex/skills/douyin-visual-plan-audit
```

Jianying related local workspace observed during this run:

```text
/Users/admin/Documents/Codex/2026-06-04/luoluoluo22-jianying-editor-skill-https-github
```

Do not commit these installed skill directories into this repository.

## Stage-To-Skill Map

```text
1. Brief / product constraints
   -> office-hours style discussion
   -> copywriting helpers if needed

2. Backend operation validation
   -> chrome:control-chrome
   -> computer-use fallback

3. Page-level recording and DOM capture
   -> Playwright
   -> FFmpeg/FFprobe for validation

4. Asset staging
   -> Playwright DOM extraction
   -> optional image2/image adapter
   -> optional visual plan audit

5. HTML visual probe
   -> HyperFrames

6. Clean master generation
   -> Remotion
   -> FFprobe
   -> keyframe extraction via FFmpeg

7. Keyframe and motion QA
   -> keyframe_acceptance_and_animation_spec.md
   -> manual visual review

8. Jianying packaging
   -> jianying-editor
   -> manual preview/export

9. Social sampling flywheel, future phase
   -> OpenCLI/OpenClaw-style collection
   -> video-use/reference analysis
```

## What Must Not Be Uploaded

Do not upload:

- Installed skill packages.
- Browser profiles or `.playwright/`.
- Cookies, local storage, tokens, or logged-in session data.
- Final rendered MP4s by default.
- Raw screen recordings by default.
- `node_modules/`.

Upload instead:

- Skill dependency specs.
- Workflow specs.
- Script snapshots.
- Verification frames.
- Lightweight evidence files.

## Minimum Required Runtime For Next Validation

Before running the next product:

- Chrome logged into target backend.
- Playwright installed in the workflow project.
- FFmpeg and FFprobe available.
- Remotion project dependencies installed locally.
- Jianying Editor skill available if packaging phase starts.

Before committing:

```bash
find . -type f \( -name '*.mp4' -o -name '*.webm' -o -name '*.mov' -o -name '*.mkv' \) -not -path './.git/*' -print
find . -type f -size +100M -not -path './.git/*' -print
git status --short
```

