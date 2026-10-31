import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ALL_PAGES,
  BOTTOM_NAV,
  HEADER_CTA,
  INFO_LINKS,
  NAV,
  OPERATOR,
  SPACE_ACTIONS,
  isActive,
  normalizePath,
  pageByHref,
} from "../../lib/site.ts";
import { PLACEHOLDERS } from "../../lib/placeholders.ts";

test("menu có đúng 7 mục, đúng thứ tự trong research pack", () => {
  assert.deepEqual(
    NAV.map((item) => item.label),
    [
      "Trang chủ",
      "Lời hay mỗi ngày",
      "Góc Phật pháp",
      "Nghe để tâm an",
      "Thiền và tĩnh tâm",
      "Sống tốt – Sống thiện",
      "Không gian bình an",
    ],
  );
});

test("mọi đường dẫn có / ở đầu và cuối, không trùng nhau", () => {
  const hrefs = ALL_PAGES.map((item) => item.href);
  for (const href of hrefs) assert.equal(href, normalizePath(href), `đường dẫn chưa chuẩn: ${href}`);
  assert.equal(new Set(hrefs).size, hrefs.length);
});

test("chân trang có đủ 5 trang thông tin của pack", () => {
  assert.deepEqual(
    INFO_LINKS.map((item) => item.href),
    ["/gioi-thieu/", "/lien-he/", "/dieu-khoan/", "/quyen-rieng-tu/", "/ban-quyen/"],
  );
});

test("normalizePath thêm dấu / và bỏ query", () => {
  assert.equal(normalizePath("goc-phat-phap"), "/goc-phat-phap/");
  assert.equal(normalizePath("/goc-phat-phap?x=1"), "/goc-phat-phap/");
  assert.equal(normalizePath(""), "/");
});

test("isActive: trang chủ chỉ sáng ở /, mục con sáng ở trang con", () => {
  assert.equal(isActive("/", "/"), true);
  assert.equal(isActive("/goc-phat-phap/", "/"), false);
  assert.equal(isActive("/goc-phat-phap", "/goc-phat-phap/"), true);
  assert.equal(isActive("/goc-phat-phap/bai-mot/", "/goc-phat-phap/"), true);
  assert.equal(isActive(null, "/"), false);
});

test("pageByHref báo lỗi khi gõ sai đường dẫn", () => {
  assert.equal(pageByHref("/lien-he").label, "Liên hệ");
  assert.throws(() => pageByHref("/khong-co/"));
});

test("trang giữ chỗ phủ đủ 11 trang chưa làm (trừ trang chủ)", () => {
  const slugs = PLACEHOLDERS.map((item) => `/${item.slug}/`);
  const expected = ALL_PAGES.map((item) => item.href).filter((href) => href !== "/");
  assert.deepEqual([...slugs].sort(), [...expected].sort());
});

test("mỗi mục menu chính có biểu tượng riêng", () => {
  const icons = NAV.map((item) => item.icon);
  assert.ok(icons.every(Boolean), "mục nào cũng phải có icon");
  assert.equal(new Set(icons).size, icons.length, "không dùng trùng icon");
});

test("thanh lối tắt đáy màn hình: 5 mục, đều có trong menu, nút giữa dẫn tới Không gian bình an", () => {
  assert.equal(BOTTOM_NAV.length, 5);
  const navHrefs = new Set(NAV.map((item) => item.href));
  for (const item of BOTTOM_NAV) assert.ok(navHrefs.has(item.href), `${item.href} không có trong NAV`);
  const featured = BOTTOM_NAV.filter((item) => item.featured);
  assert.equal(featured.length, 1);
  assert.equal(BOTTOM_NAV.indexOf(featured[0]), 2, "nút nổi bật phải ở giữa");
  assert.equal(featured[0].href, "/khong-gian-binh-an/");
  // Nhãn ngắn để vừa màn hình 360px.
  for (const item of BOTTOM_NAV) assert.ok(item.label.length <= 10, `nhãn quá dài: ${item.label}`);
});

test("nút trên thanh đầu dẫn tới một trang có trong menu", () => {
  assert.equal(HEADER_CTA.label, "Thắp sáng tâm an");
  assert.ok(NAV.some((item) => item.href === HEADER_CTA.href));
});

test("4 nghi thức theo ảnh thiết kế, mã neo hợp lệ và không trùng", () => {
  assert.deepEqual(
    SPACE_ACTIONS.map((action) => action.label),
    ["Thắp hương", "Dâng hoa sen", "Chắp tay lễ Phật", "Lời nguyện"],
  );
  const ids = SPACE_ACTIONS.map((action) => action.id);
  for (const id of ids) assert.match(id, /^[a-z]+(-[a-z]+)*$/);
  assert.equal(new Set(ids).size, ids.length);
});

test("thông tin đơn vị vận hành đủ và đúng định dạng", () => {
  assert.equal(OPERATOR.taxCode, "0901197922");
  assert.match(OPERATOR.email, /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/);
});
