import { chromium } from "playwright";
import { mkdir } from "fs/promises";

const BASE = "http://localhost:8099";
const OUT = "screenshots";
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();

async function shot(name) {
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/${name}`, fullPage: false });
  console.log(`saved ${name}`);
}

await page.goto(BASE, { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(3000);
await shot("web-01-home.png");

await page.getByText("ライブラリ").first().click();
await shot("web-02-library.png");

await page.getByText("復習").first().click();
await shot("web-03-review.png");

await page.getByText("設定").first().click();
await page.waitForTimeout(2000);
await shot("web-04-settings.png");

// クイズ画面
await page.goto(BASE);
await page.waitForTimeout(2500);
await page.getByText("クイズ開始 ▶").first().click();
await shot("web-05-quiz.png");

await browser.close();
console.log("done");
