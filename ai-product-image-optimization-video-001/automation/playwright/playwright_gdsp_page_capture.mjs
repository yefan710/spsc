#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..', '..');
const CASE_DIR = path.join(ROOT, 'social_content_cases/ai-product-image-optimization-video-001');
const OUTPUT_DIR = path.join(CASE_DIR, '08_screen_recordings/playwright_page_capture');
const USER_DATA_DIR = path.join(ROOT, '.playwright/gdsp-user-data');
const DEFAULT_PRODUCT_IDS = [
  '3820911041181778069',
  '3820910710301524046',
  '3822608850243158094',
];

const now = () => new Date().toISOString().replace(/[:.]/g, '-');
const taskIdArg = process.argv.find((arg) => arg.startsWith('--task-id='));
const existingTaskId = taskIdArg ? taskIdArg.slice('--task-id='.length).trim() : '';
const shouldPublish = process.argv.includes('--publish');
const mode = existingTaskId ? 'task' : (process.argv.includes('--run') ? 'run' : 'probe');
const productIdsArg = process.argv.find((arg) => arg.startsWith('--product-ids='));
const productIds = productIdsArg
  ? productIdsArg.slice('--product-ids='.length).split(',').map((id) => id.trim()).filter(Boolean)
  : DEFAULT_PRODUCT_IDS;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function exists(locator, timeout = 1200) {
  try {
    await locator.first().waitFor({state: 'visible', timeout});
    return true;
  } catch {
    return false;
  }
}

async function clickText(page, text, opts = {}) {
  const timeout = opts.timeout ?? 5000;
  const exact = opts.exact ?? true;
  const locator = page.getByText(text, {exact}).first();
  await locator.waitFor({state: 'visible', timeout});
  await locator.click({timeout});
}

async function clickRole(page, role, name, opts = {}) {
  const timeout = opts.timeout ?? 5000;
  const options = name instanceof RegExp ? {name} : {name, exact: opts.exact ?? true};
  const locator = page.getByRole(role, options).first();
  await locator.waitFor({state: 'visible', timeout});
  await locator.click({timeout});
}

async function dumpPage(page, runDir, label) {
  await page.screenshot({path: path.join(runDir, `${label}.png`), fullPage: true});
  fs.writeFileSync(path.join(runDir, `${label}.txt`), await page.locator('body').innerText().catch(() => ''));
}

async function waitForLoggedIn(page, runDir) {
  await page.goto('https://gdsp.huanleguang.com/app-pim#/ai/background-swap?platform_id=6&tab=', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await sleep(2500);
  if (await exists(page.getByText('请选择管理店铺的平台', {exact: false}), 1500)) {
    await clickText(page, '抖店', {exact: true, timeout: 5000});
    await sleep(3000);
    await page.goto('https://gdsp.huanleguang.com/app-pim#/ai/background-swap?platform_id=6&tab=', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await sleep(2500);
  }
  const loggedIn = await exists(page.getByText('AI优化商品图', {exact: true}), 3500)
    || await exists(page.getByText('换图记录', {exact: true}), 1500);
  if (loggedIn) return true;

  await dumpPage(page, runDir, 'login_required');
  console.log(JSON.stringify({
    status: 'login_required',
    message: '请在打开的 Playwright Chrome 窗口完成登录，脚本会等待进入 gdsp app-pim 页面。',
    runDir,
  }, null, 2));

  const deadline = Date.now() + 10 * 60 * 1000;
  while (Date.now() < deadline) {
    await sleep(2000);
    const ok = page.url().includes('gdsp.huanleguang.com/app-pim')
      && (await exists(page.getByText('AI优化商品图', {exact: true}), 1000)
        || await exists(page.getByText('换图记录', {exact: true}), 1000));
    if (ok) return true;
  }
  return false;
}

async function openTaskRecord(page, taskId) {
  await page.goto(`https://gdsp.huanleguang.com/app-pim#/ai/image-tool/records/258596/${taskId}`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await sleep(3500);
  const body = await page.locator('body').innerText().catch(() => '');
  if (!body.includes('确认生成结果') && !body.includes('执行中') && !body.includes('生成成功')) {
    throw new Error(`Task page did not load as expected: ${taskId}`);
  }
}

async function selectShop(page) {
  const body = await page.locator('body').innerText().catch(() => '');
  if (/已选[1-9]\d*个店铺/.test(body) || body.includes('抖音-道理门')) return;

  await page.getByText(/已选\d+个店铺/).first().click({timeout: 8000});
  await sleep(800);

  const panelSearch = page.locator('.relation-shop-panel input:not([readonly]), .hlg-search__input input:not([readonly])').first();
  if (await exists(panelSearch, 3000)) {
    await panelSearch.fill('道理门');
    await sleep(400);
    await page.locator('.relation-shop-panel .hlg-search__button, .hlg-search__button').first().click({timeout: 3000}).catch(async () => {});
    await sleep(1200);
  }

  const panel = page.locator('.relation-shop-panel').first();
  const targetRow = panel.getByText('道理门', {exact: false}).first();
  if (await exists(targetRow, 1500)) {
    await targetRow.click({timeout: 3000, force: true}).catch(async () => {});
    await sleep(500);
    await page.mouse.click(728, 480).catch(async () => {});
  } else {
    await page.locator('.relation-shop-panel input[type="checkbox"], .relation-shop-panel .hlg-checkbox').first().click({timeout: 3000}).catch(async () => {
      await page.mouse.click(728, 480);
    });
  }
  await sleep(1200);
  await page.keyboard.press('Escape').catch(async () => {});
  await sleep(500);

  const selectedBody = await page.locator('body').innerText().catch(() => '');
  if (!/已选[1-9]\d*个店铺/.test(selectedBody)) {
    throw new Error('Shop selection did not complete: expected 已选1个店铺');
  }
}

async function selectPreviewShop(page) {
  const body = await page.locator('body').innerText().catch(() => '');
  if (body.includes('预览列表') && body.includes('请选择预览店铺')) {
    await page.getByPlaceholder('请选择预览店铺').click({timeout: 4000}).catch(async () => {
      await page.mouse.click(650, 916);
    });
    await sleep(800);
    await clickText(page, '道理门', {exact: false, timeout: 3000}).catch(async () => {
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
    });
    await sleep(1200);
  }
}

async function ensureConfig(page) {
  await clickText(page, 'AI优化商品图', {exact: true, timeout: 8000});
  await sleep(1500);
  await selectShop(page);

  // Text clicks intentionally avoid internal class names. If an item is already selected, clicking
  // it is still visible in the recording and keeps the operation deterministic enough for a test shop.
  const configTexts = [
    '1:1主图',
    '全部',
    '3:4主图',
    '全部',
    '基于1:1主图生成',
    '等比放大后裁切',
    '是',
    '不带显式AI标识',
  ];
  for (const text of configTexts) {
    await clickText(page, text, {exact: false, timeout: 2500}).catch(async () => {});
    await sleep(450);
  }
  await selectPreviewShop(page).catch(async () => {});
}

async function fillProductIdFilter(page, ids) {
  const joined = ids.join(',');
  await page.getByText('商品ID', {exact: true}).first().scrollIntoViewIfNeeded().catch(async () => {});
  await sleep(500);

  // The filter has duplicated hidden inputs. Coordinate clicks are more stable and also
  // match the recorded user flow after 商品ID is scrolled into the same viewport position.
  await page.mouse.click(1100, 568);
  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');
  await page.keyboard.type(joined, {delay: 6});
  await sleep(300);
  await page.mouse.click(1215, 568);
  await sleep(800);
}

async function searchAndGenerate(page, ids, runDir) {
  await fillProductIdFilter(page, ids);
  await clickRole(page, 'button', /查询|搜索/, {timeout: 4000}).catch(async () => {
    await page.getByText('查询', {exact: true}).first().click({timeout: 4000, force: true});
  });
  await sleep(3500);
  const postSearchBody = await page.locator('body').innerText().catch(() => '');
  fs.writeFileSync(path.join(runDir, 'after_search.txt'), postSearchBody);
  await page.screenshot({path: path.join(runDir, 'after_search.png'), fullPage: true});
  const foundIds = ids.filter((id) => postSearchBody.includes(id));
  if (foundIds.length !== ids.length) {
    throw new Error(`Product search did not narrow to target IDs. Found ${foundIds.length}/${ids.length}: ${foundIds.join(',')}`);
  }

  const checkbox = page.locator('thead input[type="checkbox"], .ant-table-thead input[type="checkbox"], input[type="checkbox"]').first();
  await checkbox.click({timeout: 5000}).catch(async () => {});
  await sleep(800);
  await clickText(page, '立即生成', {exact: false, timeout: 8000});
  await sleep(800);
  const primaryDialogButton = page.locator(
    '.hlg-dialog__footer .hlg-button--primary, .hlg-message-box__btns .hlg-button--primary, .hlg-modal-footer .hlg-button--primary',
  ).last();
  if (await exists(primaryDialogButton, 3000)) {
    await primaryDialogButton.click({timeout: 5000});
  } else {
    await clickText(page, '确定', {exact: true, timeout: 3000}).catch(async () => {
      await clickText(page, '确认', {exact: false, timeout: 3000});
    });
  }
}

async function openLatestRecord(page) {
  await sleep(3000);
  await clickText(page, '换图记录', {exact: true, timeout: 8000}).catch(async () => {});
  await sleep(3000);
  await clickText(page, '确认生成结果', {exact: false, timeout: 12000});
  await sleep(2000);
  const taskId = page.url().split('/').pop();
  return taskId;
}

async function waitForDone(page, runDir) {
  const deadline = Date.now() + 25 * 60 * 1000;
  let last = '';
  while (Date.now() < deadline) {
    const body = await page.locator('body').innerText().catch(() => '');
    last = body.slice(0, 3000);
    if (/执行中\s*0/.test(body) && /生成成功\s*[1-9]/.test(body)) {
      await dumpPage(page, runDir, 'record_done');
      return true;
    }
    await sleep(5000);
  }
  fs.writeFileSync(path.join(runDir, 'wait_timeout_body.txt'), last);
  return false;
}

async function captureAssets(page, runDir, taskId) {
  const payload = await page.evaluate(() => {
    const rowText = (el) => {
      const row = el.closest('tr,.ant-table-row,.el-table__row,[role=row]') || el.closest('td,.ant-table-cell,.el-table__cell') || el.parentElement;
      return row ? row.innerText : '';
    };
    const imgs = [...document.images].map((img, n) => ({
      n,
      src: img.currentSrc || img.src || '',
      alt: img.alt || '',
      title: img.title || '',
      w: img.naturalWidth || 0,
      h: img.naturalHeight || 0,
      text: rowText(img).slice(0, 1000),
    }));
    return {
      url: location.href,
      title: document.title,
      capturedAt: new Date().toISOString(),
      bodyText: document.body.innerText,
      imgs,
    };
  });
  const rawPath = path.join(runDir, `task_${taskId}_dom_assets_raw.json`);
  fs.writeFileSync(rawPath, JSON.stringify(payload, null, 2));
  return rawPath;
}

async function publish(page) {
  await clickText(page, '确认并发布', {exact: false, timeout: 4000}).catch(async () => {
    await clickText(page, '确认发布', {exact: false, timeout: 4000});
  });
  await sleep(1200);
  await clickText(page, '确定', {exact: true, timeout: 4000}).catch(async () => {});
  await sleep(3000);
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, {recursive: true});
  fs.mkdirSync(USER_DATA_DIR, {recursive: true});
  const runDir = path.join(OUTPUT_DIR, `run_${now()}`);
  fs.mkdirSync(runDir, {recursive: true});

  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    channel: 'chrome',
    headless: false,
    viewport: {width: 1920, height: 1080},
    deviceScaleFactor: 1,
    recordVideo: {dir: path.join(runDir, 'raw_video'), size: {width: 1920, height: 1080}},
    args: ['--window-size=1920,1080'],
  });
  const page = context.pages()[0] || await context.newPage();
  page.setDefaultTimeout(10000);

  const result = {mode, runDir, productIds};
  if (existingTaskId) result.taskId = existingTaskId;
  if (shouldPublish) result.publishRequested = true;
  try {
    const ok = await waitForLoggedIn(page, runDir);
    if (!ok) {
      result.status = 'blocked_login_timeout';
      await dumpPage(page, runDir, 'login_timeout');
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    await dumpPage(page, runDir, 'logged_in_probe');
    if (mode === 'probe') {
      result.status = 'ok_logged_in';
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    if (mode === 'task') {
      await openTaskRecord(page, existingTaskId);
      await dumpPage(page, runDir, 'existing_task_opened');
      result.done = await waitForDone(page, runDir);
      if (!result.done) {
        result.status = 'blocked_generation_timeout';
        console.log(JSON.stringify(result, null, 2));
        return;
      }
      result.rawAssetsPath = await captureAssets(page, runDir, existingTaskId);
      if (shouldPublish) {
        await publish(page);
        await dumpPage(page, runDir, 'published');
      }
      result.status = 'ok';
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    await ensureConfig(page);
    await dumpPage(page, runDir, 'configured');
    await searchAndGenerate(page, productIds, runDir);
    const taskId = await openLatestRecord(page);
    result.taskId = taskId;
    await dumpPage(page, runDir, 'record_opened');
    result.done = await waitForDone(page, runDir);
    if (!result.done) {
      result.status = 'blocked_generation_timeout';
      console.log(JSON.stringify(result, null, 2));
      return;
    }
    result.rawAssetsPath = await captureAssets(page, runDir, taskId);
    await publish(page);
    await dumpPage(page, runDir, 'published');
    result.status = 'ok';
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await page.close().catch(() => {});
    await context.close().catch(() => {});
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
