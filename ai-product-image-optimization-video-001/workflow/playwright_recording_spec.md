# Playwright Recording Spec

This document defines the engineering contract for page-level backend recording and material capture. It is the stable reference for future product-promotion videos.

## Goal

Use Playwright to produce clean, repeatable backend proof material:

- Record only the target browser page viewport.
- Avoid recording the desktop, address bar, system notifications, unrelated tabs, or other apps.
- Keep operation evidence deterministic enough for Remotion editing.
- Capture original and generated product images from DOM/API data, not from hover screenshots.
- Preserve enough page text and screenshots to debug failed generations.

## Script

Uploaded script:

`automation/playwright/playwright_gdsp_page_capture.mjs`

Original local script path:

`tools/social-video-pipeline/scripts/playwright_gdsp_page_capture.mjs`

The uploaded script is a workflow reference snapshot. In the original workspace, it expects the case directory layout used during production. If reused in another repo, update:

- `ROOT`
- `CASE_DIR`
- `OUTPUT_DIR`
- `USER_DATA_DIR`

## Browser Context Rules

Use a Playwright persistent context:

```js
chromium.launchPersistentContext(USER_DATA_DIR, {
  channel: 'chrome',
  headless: false,
  viewport: {width: 1920, height: 1080},
  deviceScaleFactor: 1,
  recordVideo: {
    dir: path.join(runDir, 'raw_video'),
    size: {width: 1920, height: 1080},
  },
  args: ['--window-size=1920,1080'],
});
```

Rules:

- `USER_DATA_DIR` is local runtime state and must not be committed.
- Do not commit cookies, local storage, browser profiles, tokens, or `.playwright/`.
- The recording size must match the viewport unless there is a deliberate crop plan.
- Use Chrome channel when the target backend depends on Chrome behavior or logged-in compatibility.
- Keep `headless: false` for login/debug visibility; page recording still records only the viewport.

## Modes

### Probe Mode

Command shape:

```bash
node automation/playwright/playwright_gdsp_page_capture.mjs
```

Purpose:

- Open the feature page.
- Verify login state.
- If login is missing, write `login_required.png` and `login_required.txt`.
- Do not generate, publish, or mutate data.

Expected output:

```json
{
  "mode": "probe",
  "status": "ok_logged_in",
  "runDir": "..."
}
```

### Full Run Mode

Command shape:

```bash
node automation/playwright/playwright_gdsp_page_capture.mjs --run --product-ids=ID1,ID2,ID3
```

Purpose:

- Configure AI 商品图优化.
- Search product IDs.
- Select products.
- Click `立即生成`.
- Open latest record.
- Wait for generation completion.
- Capture DOM image assets.
- Optionally publish if the implementation enables publish at the end.

Use this only for test stores/test products or explicitly approved products.

### Existing Task Mode

Command shape:

```bash
node automation/playwright/playwright_gdsp_page_capture.mjs --task-id=4250
```

Purpose:

- Open an existing task record:
  `https://gdsp.huanleguang.com/app-pim#/ai/image-tool/records/258596/{taskId}`
- Wait for completion if still running.
- Capture page proof and DOM assets.
- Avoid clicking `立即生成`.

### Existing Task + Publish Mode

Command shape:

```bash
node automation/playwright/playwright_gdsp_page_capture.mjs --task-id=4250 --publish
```

Purpose:

- Use only after confirming this is a test store/test product.
- Open existing task.
- Capture proof and assets.
- Click `确认并发布` or `确认发布`.

## Target URLs

Feature entry:

```text
https://gdsp.huanleguang.com/app-pim#/ai/background-swap?platform_id=6&tab=
```

Record confirmation page:

```text
https://gdsp.huanleguang.com/app-pim#/ai/image-tool/records/258596/{taskId}
```

## Required Backend Configuration

For the current AI 商品图优化 template:

- Group: `测试使用`
- Store: `道理门`
- Platform: 抖音, `platform_id=6`
- `1:1主图`: selected
- `1:1主图` positions: all selected
- `3:4主图`: selected
- `3:4主图` positions: all selected
- `3:4生成方式`: `基于1:1主图生成`
- Size handling: `等比放大后裁切`
- `主图1支持卖点`: `是`
- `AI显示标识`: `不带显式AI标识`
- `SKU图`: not selected unless the specific video brief requires it
- `保留品牌logo`: not selected unless the specific video brief requires it

## Recording Timing Contract

The raw Playwright page video should keep the real sequence. The edited Remotion/Jianying version should apply speed changes:

- Critical configuration actions: normal speed or slight slow-down.
- Search/filter/list load: 2x to 4x.
- Generation waiting: 8x to 20x, or replace with a compact status proof scene.
- Button clicks that prove the loop: normal speed.
- Hover large image preview: normal speed if used visually.

Critical proof points:

- Enter `AI优化商品图`.
- Select group/store.
- Select 1:1 and 3:4 positions.
- Select 3:4 based on 1:1.
- Enable selling point support.
- Select no explicit AI mark.
- Search product IDs.
- Select all target products.
- Click `立即生成`.
- Open `确认生成结果`.
- Observe `执行中 0`.
- Click `确认发布` when publishing is approved.

## Output Directory Contract

Each run writes into a timestamped directory:

```text
08_screen_recordings/playwright_page_capture/run_YYYY-MM-DDTHH-MM-SS-msZ/
  raw_video/
    page@xxxx.webm
  logged_in_probe.png
  logged_in_probe.txt
  existing_task_opened.png
  existing_task_opened.txt
  record_done.png
  record_done.txt
  task_{taskId}_dom_assets_raw.json
  published.png
  published.txt
```

The exact file set depends on mode. Every meaningful page transition should have both:

- A full-page screenshot.
- A body-text dump.

## DOM Asset Capture Contract

Material capture must not depend on screenshots or hover state.

Use DOM extraction:

- Traverse `document.images`.
- Save `currentSrc || src`.
- Save `alt`, `title`, `naturalWidth`, `naturalHeight`.
- Save nearby row/card text so product IDs can be linked to images.
- Save full page URL, title, and capture time.

Raw schema:

```json
{
  "url": "...",
  "title": "...",
  "capturedAt": "...",
  "bodyText": "...",
  "imgs": [
    {
      "n": 0,
      "src": "...",
      "alt": "...",
      "title": "...",
      "w": 1200,
      "h": 1200,
      "text": "nearby row text"
    }
  ]
}
```

Structured material convention for each product:

```text
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

When downloading images from OSS-style thumbnail URLs, strip resize/quality query parameters when possible, for example:

```text
x-oss-process=image/resize,w_120/quality,q_85
```

## Success Criteria

A recording run is usable for the production workflow only if:

- Page video exists and is non-empty.
- The target page is recorded at 1920x1080 or another explicitly chosen fixed viewport.
- Target product IDs are visible in the record page proof.
- Generation terminal state is captured.
- `执行中 0` is captured.
- Success count matches the requested product count, unless the run is intentionally documenting a failure.
- DOM asset JSON exists.
- Downloaded product image folders contain expected original/generated images.
- No cookies, tokens, user-data profiles, or secrets are committed.

## Failure Criteria

Mark the run as failed or partial if any of the following happens:

- Login timeout.
- Product search does not narrow to all target product IDs.
- Shop selection remains `已选0个店铺`.
- Task page reaches `发布失败` or `跳过` for target products.
- `执行中` does not reach 0 before timeout.
- DOM asset extraction cannot associate images with product IDs.
- The page recording captures the wrong product/category.
- The final video mixes unrelated product evidence.

When failed, keep:

- `*_opened.png`
- `*_opened.txt`
- `wait_timeout_body.txt` if present
- raw page video if useful
- a short status markdown file, like `evidence/task_4275_status.md`

## Security And Privacy Rules

Never commit:

- `.playwright/`
- browser user data directories
- cookies
- local storage dumps
- access tokens
- raw backend credentials
- unrelated browser recordings

Before pushing:

```bash
find . -type f -size +100M -not -path './.git/*' -print
git status --short
```

If a raw screen recording exceeds GitHub's normal 100MiB file limit:

- Do not commit it directly without Git LFS.
- Create a compressed review copy.
- Document the omitted original file in README or a status note.

## Current Repository Evidence

Known successful evidence source:

- `taskId`: `4250`
- Products:
  - `3820911041181778069`
  - `3820910710301524046`
  - `3822608850243158094`
- Uploaded viewport recording:
  - `screen_recordings/playwright/task_4250_page_capture.webm`
- Uploaded material set:
  - `evidence/task_4250_computer_use_capture/`

Known failed/invalid evidence source:

- `taskId`: `4275`
- Status:
  - `发布成功 0`
  - `发布失败 2`
  - `跳过 1`
  - `执行中 0`
- Reason:
  - Not suitable as successful proof material.
- Status note:
  - `evidence/task_4275_status.md`

