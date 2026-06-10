# AI Product Image Optimization Video 001

This package contains the reviewable artifacts for the AI 商品图优化 promotion-video workflow.

## Video Artifact Policy

This repository stores workflow specs, automation references, verification frames, and lightweight evidence. It does not store final rendered videos or raw screen recordings by default.

Local video outputs should stay in local run folders such as `07_final/` or in a separate release artifact store.

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
  - `workflow_index.md` lists all workflow specifications in this package.
  - Capture playbook, skill chain notes, Jianying handoff, and business information flow image.
  - `skill_dependencies.md` lists required/recommended/optional skills and runtime capabilities.
  - `asset_staging_and_evidence_spec.md` defines source image and DOM evidence contracts.
  - `remotion_clean_master_spec.md` defines the Remotion clean-master contract.
  - `playwright_recording_spec.md` is the engineering contract for page-level recording, task modes, artifact naming, DOM asset capture, failure handling, and security rules.
  - `keyframe_acceptance_and_animation_spec.md` defines keyframe review points, pass/fail logic, animation contracts, and scoring before Jianying packaging.
- `automation/playwright/`
  - Playwright backend capture script.
- `automation/remotion_src/`
  - Relevant Remotion source files used for the clean master composition.
