# AI Product Image Optimization Video 001

This package contains the reviewable artifacts for the AI 商品图优化 promotion-video workflow.

## Final Videos

- `final_videos/童装三商品_25s_Remotion横版干净母版.mp4`
  - 1920x1080
  - 25s
  - 30fps
  - No audio track
  - Designed as a clean Remotion master for later Jianying packaging.
- `final_videos/沙拉碗_25s_Remotion横版干净母版.mp4`
  - Earlier horizontal clean master kept for comparison.

## Screen Recordings

- `screen_recordings/playwright/`
  - Playwright viewport recordings and related manual-helper page recordings.
- `screen_recordings/manual_compressed/`
  - Compressed 720p copies of the manual backend screen recordings.
  - Original full-size local files were not committed because one original file exceeds GitHub's normal 100MiB file limit.

## Evidence

- `evidence/task_4250_computer_use_capture/`
  - Original product images and generated 1:1 / 3:4 image sets for the successful task.
- `evidence/task_4250_dom_assets_raw.json`
- `evidence/task_4250_dom_assets_structured.json`
- `evidence/task_4275_status.md`
  - Notes why task `4275` should not be treated as a successful evidence source.

## Verification Frames

- `verify_frames/`
  - Key frames extracted from the final Remotion horizontal master.

## Workflow And Automation

- `workflow/`
  - Capture playbook, skill chain notes, Jianying handoff, and business information flow image.
  - `playwright_recording_spec.md` is the engineering contract for page-level recording, task modes, artifact naming, DOM asset capture, failure handling, and security rules.
- `automation/playwright/`
  - Playwright backend capture script.
- `automation/remotion_src/`
  - Relevant Remotion source files used for the clean master composition.
