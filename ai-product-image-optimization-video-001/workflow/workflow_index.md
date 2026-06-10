# Workflow Specification Index

This directory is the workflow contract set for the AI 商品图优化 promotion-video pipeline.

The repository is for workflow specifications, scripts, verification frames, and lightweight evidence. It is not a video-delivery bucket. Final rendered videos and raw recordings should stay in local output folders unless a specific release process asks for them.

## Workflow Specs

| Workflow | Spec | Purpose |
| --- | --- | --- |
| Business information flow | `v5_skill_chain_and_business_flow.md` | Explains how input assets, backend capture, Remotion, Jianying, and QA connect. |
| Backend capture | `computer_use_backend_capture_playbook.md` | Defines the business operations for the AI 商品图优化 backend capture flow. |
| Skill dependencies | `skill_dependencies.md` | Lists required/recommended/optional skills and runtime capabilities for each workflow stage. |
| Playwright page recording | `playwright_recording_spec.md` | Defines browser context, modes, artifact naming, DOM capture, failure rules, and security. |
| Asset staging and evidence | `asset_staging_and_evidence_spec.md` | Defines product image folders, DOM JSON, task status notes, and what is safe to commit. |
| Remotion clean master | `remotion_clean_master_spec.md` | Defines composition structure, timing, image layout, animation ownership, and render checks. |
| Keyframe and animation QA | `keyframe_acceptance_and_animation_spec.md` | Defines frame extraction, pass/fail logic, animation review, and scoring. |
| Jianying post-production | `jianying_editor_postproduction_handoff.md` | Defines the handoff into Jianying for subtitles, flower words, BGM, TTS, and manual export. |
| Execution playbook | `v6_execution_playbook.md` | Captures the current operating playbook for the validated template route. |

## Current Repository Policy

Commit:

- Workflow specs.
- Automation scripts.
- Remotion source snapshots needed to reproduce the template logic.
- Verification frames.
- Lightweight image evidence and DOM JSON.

Do not commit by default:

- Final MP4 render outputs.
- Raw Playwright `.webm` recordings.
- Manual screen recordings.
- Browser profiles, cookies, local storage, tokens, or `.playwright/`.
- `node_modules/`.

If a future review needs video files, put them in a separate release artifact or a storage location designed for binary deliverables. Keep this repository as the reproducible workflow reference.
