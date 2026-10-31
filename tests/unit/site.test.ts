import { test } from "node:test";
import assert from "node:assert/strict";
import { ALL_PAGES, INFO_LINKS, NAV, OPERATOR, isActive, normalizePath, pageByHref } from "../../lib/site.ts";
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

test("thông tin đơn vị vận hành đủ và đúng định dạng", () => {
  assert.equal(OPERATOR.taxCode, "0901197922");
  assert.match(OPERATOR.email, /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/);
});
