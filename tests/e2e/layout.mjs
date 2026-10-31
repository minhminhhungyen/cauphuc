// Kiểm thử bố cục trên bản build tĩnh (out/): chạy sau "npm run build".
// Kiểm ở 3 khổ màn hình 360, 768, 1280 px:
// - mọi trang menu mở được, không tràn ngang, không lỗi console;
// - đường dẫn lạ ra 404;
// - menu điện thoại dùng được bằng bàn phím;
// - link "bỏ qua menu" hoạt động;
// - menu ngang hiện đủ 7 mục và đánh dấu trang đang xem.
// Ảnh chụp lưu ở test-results/.
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";
import { startServer } from "../../scripts/serve-out.mjs";
import { INFO_LINKS, NAV } from "../../lib/site.ts";

const VIEWPORTS = [
  { name: "360", width: 360, height: 740 },
  { name: "768", width: 768, height: 1024 },
  { name: "1280", width: 1280, height: 800 },
];
const ROUTES = [...NAV, ...INFO_LINKS].map((item) => item.href);

const failures = [];
const passed = [];
function check(ok, message) {
  (ok ? passed : failures).push(message);
}

mkdirSync("test-results", { recursive: true });
const { server, url } = await startServer({ port: 0 });
const browser = await chromium.launch();

try {
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    const errors = [];
    // Đường dẫn lạ dùng để thử trang 404: trình duyệt luôn báo "404" cho nó, đó là kết quả mong đợi.
    const expected404 = "/trang-khong-ton-tai/";
    page.on("console", (msg) => {
      if (msg.type() !== "error") return;
      const where = msg.location() && msg.location().url;
      if (where && where.includes(expected404)) return;
      errors.push(`${msg.text()}${where ? ` (${where})` : ""}`);
    });
    page.on("response", (res) => {
      if (res.status() >= 400 && !res.url().includes(expected404)) errors.push(`HTTP ${res.status()} ${res.url()}`);
    });
    page.on("pageerror", (err) => errors.push(err.message));

    for (const route of ROUTES) {
      const response = await page.goto(url + route, { waitUntil: "load" });
      const status = response ? response.status() : 0;
      check(status === 200, `[${vp.name}] ${route} trả mã ${status}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check(overflow <= 0, `[${vp.name}] ${route} tràn ngang ${overflow}px`);
      const h1 = await page.locator("h1").count();
      check(h1 === 1, `[${vp.name}] ${route} có ${h1} thẻ h1`);
    }

    const missing = await page.goto(url + "/trang-khong-ton-tai/", { waitUntil: "load" });
    check(missing && missing.status() === 404, `[${vp.name}] đường dẫn lạ trả mã ${missing && missing.status()}`);
    check((await page.locator("h1").innerText()).includes("Không tìm thấy"), `[${vp.name}] trang 404 có tiêu đề đúng`);

    await page.goto(url + "/", { waitUntil: "load" });
    await page.screenshot({ path: `test-results/trang-chu-${vp.name}.png`, fullPage: true });

    // Link "bỏ qua menu": phím Tab đầu tiên phải vào link này, Enter đưa tiêu điểm vào nội dung chính.
    await page.keyboard.press("Tab");
    const firstFocus = await page.evaluate(() => document.activeElement && document.activeElement.textContent);
    check(firstFocus && firstFocus.includes("Bỏ qua menu"), `[${vp.name}] Tab đầu tiên vào link bỏ qua menu (đang ở: ${firstFocus})`);
    await page.keyboard.press("Enter");
    const mainFocused = await page.evaluate(() => document.activeElement && document.activeElement.id);
    check(mainFocused === "noi-dung", `[${vp.name}] Enter ở link bỏ qua đưa tiêu điểm vào nội dung (đang ở: ${mainFocused})`);

    const menu = page.locator('[data-testid="mobile-menu"]');
    const desktopNav = page.locator('header nav[aria-label="Chuyên mục"].lg\\:block');
    if (vp.width < 1024) {
      check(await menu.isVisible(), `[${vp.name}] nút Menu hiện`);
      check(!(await desktopNav.isVisible()), `[${vp.name}] menu ngang ẩn`);
      // Mở menu bằng bàn phím.
      await page.locator('[data-testid="mobile-menu"] summary').focus();
      await page.keyboard.press("Enter");
      check(await menu.evaluate((d) => d.open), `[${vp.name}] Enter mở menu`);
      const links = await page.locator('[data-testid="mobile-menu"] nav[aria-label="Chuyên mục"] a').count();
      check(links === 7, `[${vp.name}] menu có ${links}/7 mục chuyên mục`);
      await page.screenshot({ path: `test-results/menu-mo-${vp.name}.png` });
      const panelOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check(panelOverflow <= 0, `[${vp.name}] menu mở không làm tràn ngang (${panelOverflow}px)`);
      // Esc đóng menu và trả tiêu điểm về nút Menu.
      await page.keyboard.press("Escape");
      check(!(await menu.evaluate((d) => d.open)), `[${vp.name}] Esc đóng menu`);
      const backToSummary = await page.evaluate(() => document.activeElement && document.activeElement.tagName);
      check(backToSummary === "SUMMARY", `[${vp.name}] Esc trả tiêu điểm về nút Menu (đang ở: ${backToSummary})`);
      // Bấm một mục: chuyển trang và menu tự đóng.
      await page.locator('[data-testid="mobile-menu"] summary').click();
      await page.locator('[data-testid="mobile-menu"] a[href="/goc-phat-phap/"]').click();
      await page.waitForURL("**/goc-phat-phap/");
      await page.waitForFunction(() => !document.querySelector('[data-testid="mobile-menu"]').open);
      check(true, `[${vp.name}] chọn mục trong menu thì chuyển trang và menu tự đóng`);
    } else {
      check(!(await menu.isVisible()), `[${vp.name}] nút Menu ẩn trên màn hình rộng`);
      check(await desktopNav.isVisible(), `[${vp.name}] menu ngang hiện`);
      const items = await desktopNav.locator("a").count();
      check(items === 7, `[${vp.name}] menu ngang có ${items}/7 mục`);
      await page.goto(url + "/goc-phat-phap/", { waitUntil: "load" });
      const current = await desktopNav.locator('a[aria-current="page"]').allInnerTexts();
      check(current.length === 1 && current[0] === "Góc Phật pháp", `[${vp.name}] mục đang xem được đánh dấu (${current.join(", ")})`);
      const navRows = await desktopNav.evaluate((nav) => {
        const tops = new Set([...nav.querySelectorAll("li")].map((li) => Math.round(li.getBoundingClientRect().top)));
        return tops.size;
      });
      check(navRows === 1, `[${vp.name}] menu ngang nằm trên ${navRows} hàng`);
    }

    check(errors.length === 0, `[${vp.name}] lỗi console: ${errors.length === 0 ? "không có" : errors.join(" | ")}`);
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}

for (const message of passed) console.log(`  đạt   ${message}`);
for (const message of failures) console.log(`  LỖI   ${message}`);
console.log(`\n${passed.length} đạt, ${failures.length} lỗi`);
process.exit(failures.length ? 1 : 0);
