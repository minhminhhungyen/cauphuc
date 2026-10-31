// Kiểm thử trên bản build tĩnh (out/): chạy sau "npm run build".
// Kiểm ở 5 khổ màn hình: điện thoại 360, 390; máy tính bảng 768, 1024; máy tính 1280; và khổ ảnh mẫu 1536.
// - mọi trang mở được, không tràn ngang, đúng 1 thẻ h1, không lỗi console; đường dẫn lạ ra 404;
// - menu điện thoại dùng được bằng bàn phím; link "bỏ qua menu" hoạt động;
// - thanh đầu: 5 mục menu trên một hàng, không đè lên nút bên phải; nút "Thắp sáng tâm an" từ 1280px;
// - trang chủ: tranh chính điện, 4 nút nghi thức nằm trong màn hình đầu; các khung không đè lên nhau;
// - thượng tôn tượng Phật: tượng Phật và hào quang (data-sacred) nằm trọn trong tranh, không bị khung, nút,
//   thông báo, bong bóng lời nguyện, thanh lối tắt che; kiểm thêm ở điện thoại xoay ngang 844×390, 1366, 1536×864,
//   1920, 2560 và trang Không gian lễ Phật;
// - bấm nút: thắp hương, dâng hoa, lễ Phật, chọn lời nguyện, xóa lời nguyện; không gửi gì lên mạng;
// - thanh lối tắt ở đáy (dưới 1024px) đủ 5 mục, không che chân trang;
// - máy bật "giảm chuyển động" thì tranh đứng yên.
// Ảnh chụp lưu ở test-results/.
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";
import { startServer } from "../../scripts/serve-out.mjs";
import { ALL_PAGES, BOTTOM_NAV, HEADER_CTA, PRAYERS, PRIMARY_NAV, SECTIONS, SPACE_ACTIONS } from "../../lib/site.ts";
import { BOOK_KEY } from "../../lib/prayer-book.ts";

const VIEWPORTS = [
  { name: "360", width: 360, height: 740 },
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1536", width: 1536, height: 1024 },
];
const ROUTES = ALL_PAGES.map((item) => item.href);
const BOTTOM_BAR = 77; // chiều cao thanh lối tắt dưới 1024px

const failures = [];
const passed = [];
function check(ok, message) {
  (ok ? passed : failures).push(message);
}

// Đếm phần tử trong tranh đang có chuyển động CSS.
const countAnimated = () =>
  [...document.querySelectorAll(".space-art svg *")].filter((el) => getComputedStyle(el).animationName !== "none").length;

// Các khung đang hiện trên tranh (từ 1024px) không được đè lên nhau, không tràn khỏi tranh.
const panelOverlaps = () => {
  const stage = document.querySelector('[data-testid="hero-scene"]').getBoundingClientRect();
  const boxes = [...document.querySelectorAll(".space-panel, .dock-wrap")]
    .filter((el) => getComputedStyle(el).display !== "none" && getComputedStyle(el).position === "absolute")
    .map((el) => ({ name: el.className.split(" ").find((c) => c.startsWith("panel-") || c === "dock-wrap"), r: el.getBoundingClientRect() }));
  const problems = [];
  for (const b of boxes) {
    if (b.r.top < stage.top - 1 || b.r.bottom > stage.bottom + 1 || b.r.left < stage.left - 1 || b.r.right > stage.right + 1) problems.push(`${b.name} tràn khỏi tranh`);
  }
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i].r;
      const b = boxes[j].r;
      if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) problems.push(`${boxes[i].name} đè lên ${boxes[j].name}`);
    }
  }
  return { count: boxes.length, problems };
};

// Thượng tôn tượng Phật (CLAUDE.md, mục "Hình ảnh nhân vật"): vùng data-sacred (tượng Phật, hào quang) phải nằm trọn
// trong khung tranh, dưới thanh đầu, và không có khung, nút, thông báo, bong bóng nào đè lên.
const sacredProblems = () => {
  const shown = (el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const hidden = cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0 || r.width === 0 || r.height === 0;
    return hidden ? null : r;
  };
  const parts = [...document.querySelectorAll("[data-sacred]")].map(shown).filter(Boolean);
  if (parts.length === 0) return ["không tìm thấy vùng tượng Phật (data-sacred)"];
  const zone = {
    left: Math.min(...parts.map((r) => r.left)),
    top: Math.min(...parts.map((r) => r.top)),
    right: Math.max(...parts.map((r) => r.right)),
    bottom: Math.max(...parts.map((r) => r.bottom)),
  };
  const stage = document.querySelector('[data-testid="hero-scene"]').getBoundingClientRect();
  const header = document.querySelector(".site-header").getBoundingClientRect();
  const problems = [];
  if (zone.top < stage.top - 1 || zone.left < stage.left - 1 || zone.right > stage.right + 1 || zone.bottom > stage.bottom + 1) {
    problems.push("tượng Phật bị cắt khỏi khung tranh");
  }
  if (zone.top < header.bottom - 1) problems.push("tượng Phật lấn dưới thanh đầu");
  // Mọi thứ đặt lên tranh (trừ chính tranh và dải nền mờ của thanh 4 nút), cộng các khung kính.
  const covers = [
    ...document.querySelectorAll('[data-testid="hero-scene"] > :not(.space-art):not(.dock-wrap)'),
    ...document.querySelectorAll('.dock, .dock-note, .space-panel, [data-testid="bottom-nav"]'),
  ];
  for (const el of covers) {
    const r = shown(el);
    if (!r) continue;
    const x = Math.min(r.right, zone.right) - Math.max(r.left, zone.left);
    const y = Math.min(r.bottom, zone.bottom) - Math.max(r.top, zone.top);
    if (x > 1 && y > 1) problems.push(`${el.className.split(" ").find((c) => c.startsWith("panel-")) || el.className.split(" ")[0]} che tượng Phật ${Math.round(x)}×${Math.round(y)}px`);
  }
  return problems;
};

mkdirSync("test-results", { recursive: true });
const { server, url } = await startServer({ port: 0 });
const browser = await chromium.launch();
const origin = new URL(url).origin;

try {
  for (const vp of VIEWPORTS) {
    const wide = vp.width >= 1024;
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

    const missing = await page.goto(url + expected404, { waitUntil: "load" });
    check(missing && missing.status() === 404, `[${vp.name}] đường dẫn lạ trả mã ${missing && missing.status()}`);
    check((await page.locator("h1").innerText()).includes("Không tìm thấy"), `[${vp.name}] trang 404 có tiêu đề đúng`);

    // ---------- Trang chủ ----------
    await page.goto(url + "/", { waitUntil: "load" });
    await page.screenshot({ path: `test-results/trang-chu-${vp.name}.png` });

    const scene = page.locator('.space-art svg[role="img"]');
    check((await scene.count()) === 1, `[${vp.name}] trang chủ có tranh chính điện`);
    check(((await scene.getAttribute("aria-label")) || "").length > 40, `[${vp.name}] tranh có mô tả cho trình đọc màn hình`);
    const dockBox = await page.locator(".dock-wrap").boundingBox();
    const firstScreen = vp.height - (wide ? 0 : BOTTOM_BAR);
    check(dockBox && dockBox.y + dockBox.height <= firstScreen + 1, `[${vp.name}] 4 nút nghi thức nằm trong màn hình đầu (đáy ở ${dockBox && Math.round(dockBox.y + dockBox.height)}px, giới hạn ${firstScreen}px)`);
    const actions = await page.locator(".dock-btn").evaluateAll((buttons) => buttons.map((b) => b.dataset.action));
    check(JSON.stringify(actions) === JSON.stringify(SPACE_ACTIONS.map((a) => a.id)), `[${vp.name}] đủ 4 nút nghi thức đúng thứ tự (${actions.join(", ")})`);
    check((await page.evaluate(countAnimated)) > 0, `[${vp.name}] tranh có chuyển động nhẹ khi máy không hạn chế chuyển động`);
    if (wide) {
      const layout = await page.evaluate(panelOverlaps);
      check(layout.count >= 4 && layout.problems.length === 0, `[${vp.name}] ${layout.count} khung trên tranh không đè nhau (${layout.problems.join("; ") || "ổn"})`);
    }
    const sacredAtRest = await page.evaluate(sacredProblems);
    check(sacredAtRest.length === 0, `[${vp.name}] tượng Phật trọn vẹn, không bị che (${sacredAtRest.join("; ") || "ổn"})`);

    // Thanh đầu.
    const cta = page.locator('[data-testid="header-cta"]');
    check((await cta.getAttribute("href")) === HEADER_CTA.href, `[${vp.name}] nút "${HEADER_CTA.label}" dẫn tới ${HEADER_CTA.href}`);
    check((await cta.isVisible()) === vp.width >= 1280, `[${vp.name}] nút "${HEADER_CTA.label}" ${vp.width >= 1280 ? "hiện" : "ẩn"}`);
    check((await page.locator('[data-testid="header-sound"]').isVisible()) === wide, `[${vp.name}] nút nhạc trên thanh đầu ${wide ? "hiện" : "ẩn"}`);

    // Link "bỏ qua menu": phím Tab đầu tiên phải vào link này, Enter đưa tiêu điểm vào nội dung chính.
    await page.keyboard.press("Tab");
    const firstFocus = await page.evaluate(() => document.activeElement && document.activeElement.textContent);
    check(firstFocus && firstFocus.includes("Bỏ qua menu"), `[${vp.name}] Tab đầu tiên vào link bỏ qua menu (đang ở: ${firstFocus})`);
    await page.keyboard.press("Enter");
    const mainFocused = await page.evaluate(() => document.activeElement && document.activeElement.id);
    check(mainFocused === "noi-dung", `[${vp.name}] Enter ở link bỏ qua đưa tiêu điểm vào nội dung (đang ở: ${mainFocused})`);

    // ---------- Bấm nút: chỉ chạy trên máy, không gửi gì lên mạng ----------
    const sent = [];
    // Được phép: Next.js tải trước trang cùng trang web (GET/HEAD, không mang dữ liệu). Không được: gửi sang trang khác hoặc gửi dữ liệu đi.
    const onRequest = (req) => {
      const reqUrl = new URL(req.url());
      const carriesData = !["GET", "HEAD"].includes(req.method()) || Boolean(req.postData());
      if (reqUrl.origin !== origin || carriesData) sent.push(`${req.method()} ${req.url()}`);
    };
    page.on("request", onRequest);
    const visible = (selector) => page.locator(selector).filter({ visible: true }).first();
    const space = page.locator('[data-testid="temple-space"]');
    await visible('[data-action="thap-huong"]').click();
    check((await space.getAttribute("data-incense")) === "lit", `[${vp.name}] bấm Thắp hương: nén nhang cháy`);
    await visible('[data-action="dang-hoa"]').click();
    await page.waitForFunction(() => document.querySelector('[data-testid="temple-space"]').dataset.offered === "1", null, { timeout: 4000 });
    check(true, `[${vp.name}] bấm Dâng hoa sen: hoa sen lên bàn thờ`);
    await visible('[data-action="le-phat"]').click();
    check((await space.getAttribute("data-bowing")) === "true", `[${vp.name}] bấm Chắp tay lễ Phật: Phật tử "bạn" cúi lạy`);
    await visible('[data-action="loi-nguyen"]').click();
    const focused = await page.evaluate(() => document.activeElement && document.activeElement.dataset.prayer);
    check(focused === PRAYERS[0].id, `[${vp.name}] bấm Chọn lời nguyện: tiêu điểm vào ô lời nguyện đầu (đang ở: ${focused})`);
    await visible(`button[data-prayer="${PRAYERS[1].id}"]`).click();
    const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || "[]"), BOOK_KEY);
    check(stored.length === 1 && stored[0].prayerId === PRAYERS[1].id, `[${vp.name}] chọn lời nguyện: ghi 1 dòng vào sổ trên máy`);
    const bubbleShown = await page
      .locator('[data-testid="self-bubble"]')
      .waitFor({ state: "visible", timeout: 2000 })
      .then(() => true, () => false);
    check(bubbleShown, `[${vp.name}] lời nguyện hiện trên đầu Phật tử "bạn"`);
    // Sau khi bấm: dòng thông báo, bong bóng lời nguyện vẫn không che tượng Phật (cuộn về đầu trang như lúc người xem nhìn tranh).
    await page.evaluate(() => window.scrollTo(0, 0));
    const status = await page.locator('[data-testid="space-status"]').innerText();
    check(status.includes("Đã ghi lời nguyện"), `[${vp.name}] dòng dưới 4 nút báo đã ghi lời nguyện (đang ghi: ${status})`);
    const sacredAfter = await page.evaluate(sacredProblems);
    check(sacredAfter.length === 0, `[${vp.name}] sau khi bấm nút, tượng Phật vẫn không bị che (${sacredAfter.join("; ") || "ổn"})`);
    check((await page.locator('[data-testid="prayer-book"] li').count()) === 1, `[${vp.name}] khung "Lời nguyện của bạn" có 1 dòng`);
    await page.locator('[data-testid="prayer-book"] button[aria-label^="Xóa lời nguyện"]').first().click();
    const afterDelete = await page.evaluate((key) => localStorage.getItem(key), BOOK_KEY);
    check(afterDelete === null && (await page.locator('[data-testid="book-empty"]').isVisible()), `[${vp.name}] xóa lời nguyện: sổ trống, không còn gì trên máy`);
    page.off("request", onRequest);
    check(sent.length === 0, `[${vp.name}] bấm nút không gửi gì ra ngoài (${sent.join(", ") || "không có"})`);
    await page.screenshot({ path: `test-results/sau-khi-bam-${vp.name}.png` });

    // ---------- Menu ----------
    const menu = page.locator('[data-testid="mobile-menu"]');
    const desktopNav = page.locator('[data-testid="desktop-nav"]');
    if (!wide) {
      check(await menu.isVisible(), `[${vp.name}] nút Menu hiện`);
      check(!(await desktopNav.isVisible()), `[${vp.name}] menu trên thanh đầu ẩn`);
      await page.locator('[data-testid="mobile-menu"] summary').focus();
      await page.keyboard.press("Enter");
      check(await menu.evaluate((d) => d.open), `[${vp.name}] Enter mở menu`);
      const mainLinks = await page.locator('[data-testid="mobile-menu"] nav[aria-label="Menu chính"] a').count();
      const sectionLinks = await page.locator('[data-testid="mobile-menu"] nav[aria-label="Chuyên mục"] a').count();
      check(mainLinks === PRIMARY_NAV.length && sectionLinks === SECTIONS.length, `[${vp.name}] menu có ${mainLinks}/5 mục chính và ${sectionLinks}/5 chuyên mục`);
      await page.screenshot({ path: `test-results/menu-mo-${vp.name}.png` });
      const panelOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check(panelOverflow <= 0, `[${vp.name}] menu mở không làm tràn ngang (${panelOverflow}px)`);
      await page.keyboard.press("Escape");
      check(!(await menu.evaluate((d) => d.open)), `[${vp.name}] Esc đóng menu`);
      const backToSummary = await page.evaluate(() => document.activeElement && document.activeElement.tagName);
      check(backToSummary === "SUMMARY", `[${vp.name}] Esc trả tiêu điểm về nút Menu (đang ở: ${backToSummary})`);
      await page.locator('[data-testid="mobile-menu"] summary').click();
      await page.locator('[data-testid="mobile-menu"] a[href="/goc-phat-phap/"]').click();
      await page.waitForURL("**/goc-phat-phap/");
      await page.waitForFunction(() => !document.querySelector('[data-testid="mobile-menu"]').open);
      check(true, `[${vp.name}] chọn mục trong menu thì chuyển trang và menu tự đóng`);

      // Thanh lối tắt ở đáy.
      const bottomNav = page.locator('[data-testid="bottom-nav"]');
      check(await bottomNav.isVisible(), `[${vp.name}] thanh lối tắt hiện`);
      const shortcutHrefs = await bottomNav.locator("a").evaluateAll((links) => links.map((a) => a.getAttribute("href")));
      check(JSON.stringify(shortcutHrefs) === JSON.stringify(BOTTOM_NAV.map((item) => item.href)), `[${vp.name}] thanh lối tắt đủ 5 mục đúng thứ tự`);
      const currentShortcut = await bottomNav.locator('a[aria-current="page"]').allInnerTexts();
      check(currentShortcut.length === 1 && currentShortcut[0].includes("Phật pháp"), `[${vp.name}] thanh lối tắt đánh dấu mục đang xem (${currentShortcut.join(", ")})`);
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(100);
      const gap = await page.evaluate(() => {
        const footerBottom = document.querySelector("footer").getBoundingClientRect().bottom;
        const navTop = document.querySelector('[data-testid="bottom-nav"]').getBoundingClientRect().top;
        return Math.round(navTop - footerBottom);
      });
      check(gap >= 0, `[${vp.name}] thanh lối tắt không che chân trang (khoảng hở ${gap}px)`);
    } else {
      check(!(await menu.isVisible()), `[${vp.name}] nút Menu ẩn trên màn hình rộng`);
      check(!(await page.locator('[data-testid="bottom-nav"]').isVisible()), `[${vp.name}] thanh lối tắt ẩn trên màn hình rộng`);
      check(await desktopNav.isVisible(), `[${vp.name}] menu trên thanh đầu hiện`);
      const items = await desktopNav.locator("a").allInnerTexts();
      check(JSON.stringify(items.map((t) => t.trim())) === JSON.stringify(PRIMARY_NAV.map((i) => i.label)), `[${vp.name}] menu đủ 5 mục như ảnh mẫu`);
      await page.goto(url + "/loi-nguyen/", { waitUntil: "load" });
      const current = await desktopNav.locator('a[aria-current="page"]').allInnerTexts();
      check(current.length === 1 && current[0].trim() === "Lời nguyện", `[${vp.name}] mục đang xem được đánh dấu (${current.join(", ")})`);
      const header = await page.evaluate(() => {
        const nav = document.querySelector('[data-testid="desktop-nav"]');
        const tops = new Set([...nav.querySelectorAll("li")].map((li) => Math.round(li.getBoundingClientRect().top)));
        const navBox = nav.getBoundingClientRect();
        const tools = [...document.querySelectorAll(".site-header .icon-btn, .site-header [data-testid='header-cta']")]
          .filter((el) => getComputedStyle(el).display !== "none")
          .map((el) => el.getBoundingClientRect());
        const hit = tools.some((r) => r.left < navBox.right && navBox.left < r.right);
        return { rows: tops.size, hit };
      });
      check(header.rows === 1 && !header.hit, `[${vp.name}] menu nằm trên ${header.rows} hàng, ${header.hit ? "đè lên" : "không đè"} nút bên phải`);
    }

    check(errors.length === 0, `[${vp.name}] lỗi console: ${errors.length === 0 ? "không có" : errors.join(" | ")}`);
    await context.close();
  }

  // Thượng tôn tượng Phật ở thêm các khổ màn hình máy tính phổ biến, ở cả trang chủ và trang Không gian lễ Phật.
  const SACRED_EXTRA = [
    { width: 844, height: 390 }, // điện thoại xoay ngang
    { width: 1366, height: 768 },
    { width: 1536, height: 864 },
    { width: 1920, height: 1080 },
    { width: 2560, height: 1440 },
  ];
  for (const vp of [...VIEWPORTS, ...SACRED_EXTRA]) {
    const name = `${vp.width}×${vp.height}`;
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    for (const route of ["/", "/khong-gian-le-phat/"]) {
      await page.goto(url + route, { waitUntil: "load" });
      const atRest = await page.evaluate(sacredProblems);
      await page.locator('[data-action="thap-huong"]').filter({ visible: true }).first().click();
      await page.locator('[data-action="le-phat"]').filter({ visible: true }).first().click();
      await page.evaluate(() => window.scrollTo(0, 0));
      const afterActions = await page.evaluate(sacredProblems);
      const problems = [...new Set([...atRest, ...afterActions])];
      check(problems.length === 0, `[${name}] ${route}: tượng Phật trọn vẹn, không bị che (${problems.join("; ") || "ổn"})`);
    }
    if (SACRED_EXTRA.includes(vp)) {
      await page.goto(url + "/", { waitUntil: "load" });
      await page.locator(`.panel-tr button[data-prayer="${PRAYERS[2].id}"]`).click();
      await page.locator('[data-testid="self-bubble"]').waitFor({ state: "visible", timeout: 2000 });
      await page.evaluate(() => window.scrollTo(0, 0));
      const withBubble = await page.evaluate(sacredProblems);
      check(withBubble.length === 0, `[${name}] bong bóng lời nguyện không che tượng Phật (${withBubble.join("; ") || "ổn"})`);
      await page.screenshot({ path: `test-results/tuong-phat-${vp.width}x${vp.height}.png` });
    }
    await context.close();
  }

  // Trang Không gian lễ Phật trên điện thoại: nút "Chọn lời nguyện" mở hộp chọn, chọn xong thì ghi sổ và đóng hộp.
  const phone = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const immersive = await phone.newPage();
  await immersive.goto(url + "/khong-gian-le-phat/", { waitUntil: "load" });
  await immersive.locator('[data-action="loi-nguyen"]').click();
  const dialog = immersive.locator('[data-testid="prayer-dialog"]');
  check(await dialog.evaluate((d) => d.open), "[Không gian lễ Phật] bấm Chọn lời nguyện mở hộp chọn");
  await dialog.locator(`button[data-prayer="${PRAYERS[6].id}"]`).click();
  check(!(await dialog.evaluate((d) => d.open)), "[Không gian lễ Phật] chọn xong thì hộp đóng");
  check((await immersive.locator('[data-testid="prayer-book"] li').count()) === 1, "[Không gian lễ Phật] lời nguyện vào sổ bên dưới");
  // "Xóa hết" phải bấm hai lần mới xóa.
  await immersive.locator('[data-testid="clear-book"]').click();
  check((await immersive.locator('[data-testid="prayer-book"] li').count()) === 1, "[Không gian lễ Phật] bấm Xóa hết lần đầu chưa xóa");
  await immersive.locator('[data-testid="clear-book"]').click();
  check(await immersive.locator('[data-testid="book-empty"]').isVisible(), "[Không gian lễ Phật] bấm lần hai thì xóa hết");
  await immersive.screenshot({ path: "test-results/khong-gian-le-phat-390.png" });
  await phone.close();

  // Máy bật "giảm chuyển động": tranh chính điện đứng yên hoàn toàn.
  const calm = await browser.newContext({ viewport: { width: 360, height: 740 }, reducedMotion: "reduce" });
  const calmPage = await calm.newPage();
  await calmPage.goto(url + "/", { waitUntil: "load" });
  const animatedWhenReduced = await calmPage.evaluate(countAnimated);
  check(animatedWhenReduced === 0, `[giảm chuyển động] tranh đứng yên (${animatedWhenReduced} phần tử còn chuyển động)`);
  await calm.close();
} finally {
  await browser.close();
  server.close();
}

for (const message of passed) console.log(`  đạt   ${message}`);
for (const message of failures) console.log(`  LỖI   ${message}`);
console.log(`\n${passed.length} đạt, ${failures.length} lỗi`);
process.exit(failures.length ? 1 : 0);
