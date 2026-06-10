# Keyframe Acceptance And Animation Spec

This document defines how to review Remotion masters for the AI 商品图优化 promotion workflow. It covers both still-frame acceptance and motion/animation acceptance.

## Scope

Applies to:

- `final_videos/童装三商品_25s_Remotion横版干净母版.mp4`
- Future 16:9 horizontal clean masters generated from the same template.
- Remotion compositions based on `ProductImageOptimizationHorizontalCleanShortTask4250`.

The goal is not only to verify that the video renders. The goal is to verify that the video looks like a usable social-platform promotion master:

- Product evidence is clear.
- Generated images feel like real shoppable main images.
- Backend screen evidence is credible.
- Animation makes the transformation easy to understand.
- The master stays clean enough for Jianying to add subtitles, flower words, BGM, TTS, and title packaging later.

## Technical Acceptance

Run `ffprobe` before visual review:

```bash
ffprobe -v error \
  -show_entries format=duration:stream=index,codec_type,codec_name,width,height,r_frame_rate,avg_frame_rate \
  -of json final_videos/童装三商品_25s_Remotion横版干净母版.mp4
```

Expected:

- Width: `1920`
- Height: `1080`
- Duration: `25.000000`
- FPS: `30/1`
- Video codec: `h264`
- Audio stream: none

Reject if:

- The video has a visible black/blank first frame beyond a deliberate transition.
- The video contains audio in the clean Remotion master.
- The final duration is materially different from 25s.
- The output is not 16:9 horizontal unless the brief explicitly changes the template.

## Timeline Contract

Current 25s horizontal clean master:

```text
0.0s - 6.0s   Opening transformation board
6.0s - 12.0s  Backend operation proof A
12.0s - 18.0s Backend operation proof B
18.0s - 25.0s Generated result wall and large preview
```

Frame ranges at 30fps:

```text
0   - 179  Opening
180 - 359  Operation A
360 - 539  Operation B
540 - 749  Results
```

## Required Keyframes

Extract these keyframes for every final master:

```bash
out="verify_frames_task4250_horizontal_clean"
mkdir -p "$out"

ffmpeg -y -hide_banner -loglevel error -ss 1.0  -i final_videos/童装三商品_25s_Remotion横版干净母版.mp4 -frames:v 1 "$out/01_opening_1s.jpg"
ffmpeg -y -hide_banner -loglevel error -ss 5.8  -i final_videos/童装三商品_25s_Remotion横版干净母版.mp4 -frames:v 1 "$out/02_opening_final_5_8s.jpg"
ffmpeg -y -hide_banner -loglevel error -ss 8.0  -i final_videos/童装三商品_25s_Remotion横版干净母版.mp4 -frames:v 1 "$out/03_operation_8s.jpg"
ffmpeg -y -hide_banner -loglevel error -ss 14.0 -i final_videos/童装三商品_25s_Remotion横版干净母版.mp4 -frames:v 1 "$out/04_operation_14s.jpg"
ffmpeg -y -hide_banner -loglevel error -ss 21.0 -i final_videos/童装三商品_25s_Remotion横版干净母版.mp4 -frames:v 1 "$out/05_results_21s.jpg"
ffmpeg -y -hide_banner -loglevel error -ss 24.0 -i final_videos/童装三商品_25s_Remotion横版干净母版.mp4 -frames:v 1 "$out/06_results_24s.jpg"
```

Current uploaded keyframes:

```text
verify_frames/
  01_opening_1s.jpg
  02_opening_final_5_8s.jpg
  03_operation_8s.jpg
  04_operation_14s.jpg
  05_results_21s.jpg
  06_results_24s.jpg
```

## Keyframe Acceptance Logic

### 01 Opening 1s

Purpose:

- Confirms the opening is not blank.
- Confirms original products are entering first.
- Confirms the viewer understands that the left column is `原图`.

Pass criteria:

- At least one original product image is visible.
- `原图` label is readable.
- `生成效果图` label is visible or already entering.
- Right title area is present but does not dominate the entire frame.
- No generated image appears before the original-image setup becomes understandable.

Reject if:

- The first visible image is a generated result without original context.
- Product images are too small to identify.
- Text overlaps product images.
- Frame looks like a generic enterprise slide rather than a product transformation board.

### 02 Opening Final 5.8s

Purpose:

- Confirms the opening transformation has completed.
- Confirms each product has one original and five generated images.
- Confirms the right-side function message is stable.

Pass criteria:

- 3 product rows are visible.
- Each row has:
  - 1 original image on the left.
  - 5 generated effects on the right.
- Generated effect images are not presented as one combined collage.
- The first generated image in each row is larger than the support images.
- `AI一键优化商品套图` and `批量生成全套视觉` are readable.
- Product rows are visually aligned and do not collide.

Reject if:

- Any row has fewer than 5 generated images.
- The generated images are hard to distinguish.
- The right title area uses more than roughly one-third of the screen and compresses the product proof.
- Product category evidence is mixed with unrelated old products.

### 03 Operation 8s

Purpose:

- Confirms backend operation proof begins after the hook.
- Confirms the viewer can tell this is real product/backend operation footage.

Pass criteria:

- Real backend UI is visible.
- The screen recording fills the frame enough to read major layout.
- The frame is not blurred beyond recognition.
- No unrelated desktop/app/window is visible.

Reject if:

- Browser address bar or OS chrome dominates.
- The clip is a fullscreen desktop recording with unrelated windows.
- UI is too zoomed out to tell what is happening.

### 04 Operation 14s

Purpose:

- Confirms the middle proof segment still shows useful operation state.
- Confirms no accidental product mismatch becomes dominant.

Pass criteria:

- Backend UI remains visible.
- There is enough page detail to support “real workflow evidence”.
- Motion does not induce heavy blur.

Reject if:

- The clip shows unrelated categories or old product evidence as the main story.
- A modal, loading mask, or accidental overlay hides the workflow.
- Text or UI is unreadable because of over-zoom or over-compression.

### 05 Results 21s

Purpose:

- Confirms the results section replaces old backend-only proof with product outcome proof.
- Confirms the generated result wall is clear and category-consistent.

Pass criteria:

- 3 original-product rows are visible.
- Each row shows 5 generated images.
- A large generated preview occupies the right side.
- The large preview feels like a usable main image, not a weak thumbnail.
- No unrelated product category appears.

Reject if:

- Result wall uses old/incorrect products.
- Images are too small to create product-main-image impact.
- Large preview is cropped so heavily that the product cannot be inspected.

### 06 Results 24s

Purpose:

- Confirms the ending holds long enough for the audience to absorb the outcome.
- Confirms result preview switching works through the end.

Pass criteria:

- Result wall remains on screen.
- Large preview has switched or animated without layout breakage.
- There is no abrupt blank/outro frame before 25s.
- The master ends cleanly for Jianying post-production.

Reject if:

- Final second is black, frozen on a broken asset, or contains unrelated footage.
- Result wall disappears too early.
- Any placeholder/missing image icon is visible.

## Animation Contract

### Opening Product Row

Implementation reference:

- Component: `OpeningProductRow`
- File: `automation/remotion_src/CleanShortHorizontalVideo.tsx`

Motion rules:

- Rows enter with a stagger:
  - Row delay: `index * 18` frames.
  - This prevents all rows from appearing at once.
- Row entrance uses `spring`.
  - Opacity: 0 to 1.
  - Vertical lift: about 22px to 0.
- Original image enters before generated images.
- Generated images enter after the transform cue.
- Opening duration must remain slow enough to inspect:
  - Current opening duration: 180 frames / 6s.
  - Do not compress opening below 5s unless product count changes.

Acceptance:

- The viewer should understand `原图 -> 生成效果图` without subtitles.
- The generated images should feel placed into slots, not randomly scattered.

### Effect Card Pop-In

Implementation reference:

- Component: `EffectCard`

Motion rules:

- Original cards:
  - Use smaller entrance scale.
  - Should feel stable and documentary.
- Generated cards:
  - Start oversized.
  - Shrink into their slot.
  - Use green border/highlight.
- Current generated-card values:
  - Primary generated card uses `fromScale={3.05}`.
  - Supporting generated cards use `fromScale={3.4}`.
  - Scale settles through `1.08` to `1`.
- The oversized entrance is intentional: it creates the “generated image lands into place” feeling.

Acceptance:

- Generated images must visibly pop larger first, then settle.
- The pop should not obscure the row label or right-side title for too long.
- The final settled state should be neat and grid-like.

Reject if:

- Images only fade in with no transformation feeling.
- Pop-in is so large that the viewer cannot understand where the image lands.
- The animation creates unreadable motion blur.

### Transformation Cue

Implementation reference:

- Component: `RowTransformCue`

Motion rules:

- A green line draws from original image toward generated images.
- Small pulse dots move through the transition path.
- Arrowhead appears as the cue completes.

Acceptance:

- The cue should visually connect original and generated areas.
- It should not look like decorative noise.
- The cue should be visible but secondary to product images.

Reject if:

- Cue hides product details.
- Cue is missing on most rows.
- Cue timing fires before original images are visible.

### Right-Side Title Area

Implementation reference:

- Component: `ReferenceStyleOpening`

Motion rules:

- Right panel is dark and occupies roughly one-third of screen width.
- Title enters with a spring after the product board starts.
- Text:
  - `AI一键优化商品套图`
  - `批量生成全套视觉`
- Text must stay crisp and large enough for horizontal-video preview.

Acceptance:

- Title supports the product proof; it must not overpower the image transformation.
- Text is readable in keyframes at 1s and 5.8s.
- The dark panel helps mimic horizontal screen-recording reference style.

Reject if:

- The title area compresses product images.
- Font is too small or fuzzy.
- Text overlaps generated product images.

### Backend Operation Segments

Implementation reference:

- Components: `PureOperationA`, `PureOperationB`, `ScreenVideo`

Motion rules:

- Use real screen video as proof material.
- Apply subtle scale/pan:
  - Scale around `1.005` to `1.04`.
  - X movement around `0` to `-28px`.
- Do not add Remotion text overlays in the clean master.
- Leave text/flower-word work to Jianying.

Acceptance:

- The segment feels like real operation proof.
- Motion is calm, not a dramatic promo animation.
- Key UI regions should remain readable enough for proof.

Reject if:

- Recording shows unrelated browser tabs or desktop.
- Operation segment hides critical controls.
- Motion makes the UI feel fake or overly edited.

### Results Wall

Implementation reference:

- Component: `ViewEffectsAndEnd`

Motion rules:

- Result wall appears in the final 7s.
- Left side shows original-to-generated rows.
- Right side shows one large active generated preview.
- Active preview changes by product/slot over time.
- Large preview uses a subtle pulse:
  - Scale roughly `0.985` to `1.015`.

Acceptance:

- The final section must make the generated output feel shoppable.
- The large image must occupy enough area to inspect the product.
- The result wall must match the opening product set.

Reject if:

- Final section falls back to old backend recordings with unrelated products.
- Result grid is too small to understand.
- Large preview uses the wrong product category.

## Motion QA Checklist

Watch the final MP4 once at normal speed and once at 0.5x.

Pass only if all are true:

- Opening has a clear original-to-generated transformation.
- Generated images enter with visible oversized pop-and-settle motion.
- 3 product rows remain comprehensible.
- The viewer can tell it is a product-image optimization workflow before any Jianying subtitle is added.
- Backend proof segments feel real and not like a marketing slide.
- Results wall returns to product outcomes and does not end on an unrelated backend frame.
- No major text/image overlap.
- No missing assets.
- No frame has a fully blank background unless intentionally transitional.
- No in-Remotion subtitles, BGM, TTS, or flower words are present in the clean master.

## Scoring Rubric

Use this rubric before deciding whether to send the video into Jianying:

```text
Technical spec             20 points
Opening transformation     25 points
Backend proof clarity      15 points
Result wall impact         25 points
Clean-master discipline    15 points
Total                     100 points
```

Minimum bar:

- `85+`: can enter Jianying packaging.
- `70-84`: usable for internal review, revise before promotion.
- `<70`: reject and revise Remotion template or source recording.

Automatic reject conditions:

- Wrong product/category appears in the result section.
- Missing generated images.
- Less than 5 generated images for a product row.
- Final master contains audio.
- Final master includes subtitles/flower words that should be added by Jianying.
- Page recording includes unrelated desktop/app activity.

## Current Template Notes

Current final master:

`final_videos/童装三商品_25s_Remotion横版干净母版.mp4`

Current extracted frames:

`verify_frames/`

Current status:

- Technical spec: pass.
- Opening transformation: pass.
- Result wall category consistency: pass.
- Known limitation: operation segments still use generic backend proof footage from existing screen assets, not a fully successful fresh Playwright operation for the exact final three-product run.

Next improvement:

- Replace operation segments with a successful Playwright page-level capture for the exact target products.
- Keep the same keyframe and animation acceptance logic after replacement.

