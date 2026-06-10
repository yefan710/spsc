# Asset Staging And Evidence Spec

This spec defines how product assets and evidence files are staged for the AI 商品图优化 video workflow.

## Purpose

The asset workflow exists to make video generation repeatable:

- Each product must have an original image.
- Each product must have a complete generated image set.
- DOM evidence should explain where the images came from.
- Failed tasks should be documented instead of silently reused.

## Source Categories

Accepted sources:

- Backend DOM image extraction from a task confirmation page.
- Backend API response replay when available.
- Manually approved local product image exports.
- Generated image sets downloaded from original OSS URLs, not thumbnail-only URLs.

Rejected sources:

- Screenshots cropped from a video.
- Hover-only previews without a corresponding source URL.
- Images from a different product/category used as placeholders.
- Mixed task outputs unless the README explicitly marks the mix.

## Product Folder Contract

Per product:

```text
evidence/task_{taskId}_computer_use_capture/
  manifest.json
  {productId}/
    original.jpg
    generated_1x1_01.jpg
    generated_1x1_02.jpg
    generated_1x1_03.jpg
    generated_1x1_04.jpg
    generated_1x1_05.jpg
    generated_3x4_01.jpg
    generated_3x4_02.jpg
    generated_3x4_03.jpg
    generated_3x4_04.jpg
    generated_3x4_05.jpg
```

Required counts:

- 1 original image.
- 5 generated 1:1 images.
- 5 generated 3:4 images.
- 11 images total per product.

Reject the asset set if:

- Any product has fewer than 5 generated 1:1 images.
- Any image belongs to another product.
- The generated image set is a collage standing in for separate generated results.
- Original and generated images cannot be mapped to a product ID.

## Manifest Contract

`manifest.json` should include:

- `taskId`
- `capturedAt`
- `productIds`
- Per-product image paths.
- Per-product image source URLs if available.
- Any known limitations.

The manifest is the handoff between capture and Remotion. Remotion should not infer missing product mappings from filenames alone when a manifest exists.

## DOM Evidence Contract

Keep both raw and structured evidence:

```text
evidence/task_{taskId}_dom_assets_raw.json
evidence/task_{taskId}_dom_assets_structured.json
```

Raw JSON should preserve:

- Page URL.
- Page title.
- Capture timestamp.
- Body text.
- Each `document.images` entry:
  - index
  - `currentSrc` or `src`
  - `alt`
  - `title`
  - natural width/height
  - nearby row/card text

Structured JSON should map:

- product ID
- original image
- generated 1:1 images
- generated 3:4 images
- status if known

## Task Status Notes

If a task is not cleanly successful, add a markdown note:

```text
evidence/task_{taskId}_status.md
```

Include:

- Task URL.
- Product IDs.
- Success/failure/skip counts.
- Whether it can be used as successful proof.
- Evidence screenshots/text paths if they exist locally.

Example:

`evidence/task_4275_status.md`

## Repository Upload Policy

Allowed:

- Product image evidence when needed for reproducibility.
- DOM JSON.
- Status notes.
- Verification frames.

Not allowed by default:

- Final rendered videos.
- Raw screen recordings.
- Browser session data.
- Large local runtime folders.

If generated image evidence becomes too large, upload only:

- Manifest.
- DOM JSON.
- A small representative subset.
- A note pointing to the local or external asset store.

## QA Before Remotion

Before Remotion starts:

- Confirm all product IDs match the brief.
- Confirm every product has 11 images.
- Open at least one original and one generated image per product.
- Confirm generated images have main-image value, not weak thumbnails.
- Confirm no failed task is marked as successful.

