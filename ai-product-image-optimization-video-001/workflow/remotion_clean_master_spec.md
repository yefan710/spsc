# Remotion Clean Master Spec

This spec defines how Remotion should generate the clean master for the AI 商品图优化 promotion workflow.

## Role Of Remotion

Remotion owns:

- Deterministic layout.
- Product image animation.
- Backend screen proof placement.
- Result-wall presentation.
- Clean video master rendering.
- Keyframe extraction support.

Remotion does not own:

- Spoken copy.
- TTS.
- BGM.
- Jianying flower words.
- Social-platform title packaging.
- Final manual export from Jianying.

## Output Contract

Default horizontal master:

- Resolution: `1920x1080`
- Aspect ratio: `16:9`
- Duration: `25s`
- FPS: `30`
- Audio: none
- Codec: h264 MP4

The clean master should leave enough visual calm for Jianying packaging. It should not include Remotion subtitles or hard-coded promotional captions beyond the functional opening labels that are part of the template.

## Composition Contract

Current composition:

```text
ProductImageOptimizationHorizontalCleanShortTask4250
```

Current source snapshot:

```text
automation/remotion_src/
  CleanShortHorizontalVideo.tsx
  Root.tsx
  productData.ts
  package.remotion_generic.json
```

Timeline:

```text
0.0s - 6.0s   Opening transformation board
6.0s - 12.0s  Backend operation proof A
12.0s - 18.0s Backend operation proof B
18.0s - 25.0s Result wall with large generated preview
```

## Opening Scene Contract

The opening must show transformation, not just a static claim.

Required structure:

- 3 product rows.
- Left column label: `原图`.
- Right column label: `生成效果图`.
- Each row:
  - 1 original image on the left.
  - transformation cue in the middle.
  - 5 generated images on the right.
- Right-side title area:
  - occupies roughly one-third of the frame.
  - shows functional claim.
  - does not compress product images.

Animation:

- Product rows enter sequentially.
- Generated images appear oversized first.
- Generated images shrink into their target slots.
- Transformation cue draws from original to generated images.

Reject if:

- Generated results appear as a single collage.
- Less than 5 generated images are visible per product.
- Original image context is missing.
- Text area dominates product evidence.

## Backend Proof Scene Contract

Backend proof scenes must show credible workflow evidence while staying clean.

Required:

- Use page-level Playwright recordings when available.
- Avoid OS desktop, unrelated browser tabs, and system notifications.
- Use subtle pan/zoom only.
- Keep critical UI regions readable.

Current known limitation:

- The uploaded template snapshot still documents a version where operation segments can use generic backend proof footage. The next production pass should replace those segments with a successful Playwright page-level capture for the exact target products.

## Result Wall Contract

The result section must return to product outcomes.

Required:

- 3 rows matching the opening product set.
- Each row shows original image and 5 generated images.
- One large generated preview occupies the right side.
- The active preview changes over time.
- Final frames remain on results, not unrelated backend UI.

Reject if:

- Result section shows old products.
- Result section ends on failed backend state.
- Generated images are too small to inspect.

## Render Command Pattern

Example command from the source workspace:

```bash
npm run render:horizontal-task4250
```

Expected post-render checks:

```bash
npm run typecheck
ffprobe -v error -show_entries format=duration:stream=index,codec_type,codec_name,width,height,r_frame_rate,avg_frame_rate -of json <output.mp4>
```

Rendered MP4 files should not be committed to this repository by default. Keep them in local `07_final/` or a release artifact store.

## Handoff To Jianying

Jianying receives:

- The local rendered clean master path.
- Voiceover script.
- Subtitle segmentation.
- Flower-word emphasis points.
- BGM/TTS plan.
- Optional keyframe screenshots for review.

Jianying should not have to repair:

- Product mismatch.
- Missing images.
- Weak result wall.
- Bad backend recording crop.
- Audio accidentally embedded in the clean master.

