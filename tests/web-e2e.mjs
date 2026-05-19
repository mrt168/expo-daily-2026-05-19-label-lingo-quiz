import { chromium } from "playwright";
import { writeFile } from "fs/promises";

const BASE = "http://localhost:8099";
const results = [];

async function test(name, fn) {
  try {
    await fn();
    results.push({ name, status: "PASS" });
    console.log(`✓ ${name}`);
  } catch (err) {
    results.push({ name, status: "FAIL", error: err.message });
    console.error(`✗ ${name}: ${err.message}`);
  }
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();

await test("T-01: アプリ起動・ホーム画面表示", async () => {
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.getByText("ラベル英単語").first().waitFor({ timeout: 8000 });
  await page.getByText("クイズ開始 ▶").first().waitFor({ timeout: 5000 });
});

await test("T-02: ライブラリタブへ遷移", async () => {
  await page.getByText("ライブラリ").first().click();
  await page.waitForTimeout(1500);
  await page.getByText("ラベル図鑑").first().waitFor({ timeout: 5000 });
});

await test("T-03: 復習タブへ遷移", async () => {
  await page.getByText("復習").first().click();
  await page.waitForTimeout(1500);
  await page.getByText("復習リスト").first().waitFor({ timeout: 5000 });
});

await test("T-04: 設定画面到達", async () => {
  await page.getByText("設定").first().click();
  await page.waitForTimeout(1500);
  await page.getByText("あなたの記録").first().waitFor({ timeout: 5000 });
  await page.getByText("このアプリについて").first().waitFor({ timeout: 5000 });
});

await test("T-05: ホームへ戻ってクイズ開始", async () => {
  await page.getByText("ホーム").first().click();
  await page.waitForTimeout(1500);
  await page.getByText("クイズ開始 ▶").first().click();
  await page.waitForTimeout(2000);
  // クイズ画面が開いていることを確認
  const stepLabel = await page.getByText(/^1\s*\/\s*5$/).first();
  await stepLabel.waitFor({ timeout: 8000 });
});

await browser.close();

await writeFile("tests/web-e2e-results.json", JSON.stringify(results, null, 2));

const pass = results.filter((r) => r.status === "PASS").length;
const fail = results.filter((r) => r.status === "FAIL").length;
console.log(`\nResult: ${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
