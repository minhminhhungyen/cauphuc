import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ALL_PAGES,
  BOTTOM_NAV,
  HEADER_CTA,
  INFO_LINKS,
  OPERATOR,
  PRAYERS,
  PRIMARY_NAV,
  SECTIONS,
  SPACE_ACTIONS,
  isActive,
  normalizePath,
  pageByHref,
  prayerById,
} from "../../lib/site.ts";
import { PLACEHOLDERS } from "../../lib/placeholders.ts";

// Trang đã có nội dung thật (có thư mục riêng trong app/), không đi qua trang giữ chỗ.
const BUILT_PAGES = ["/", "/khong-gian-le-phat/", "/loi-nguyen/", "/huong-dan/"];

test("menu chính đúng 5 mục, đúng thứ tự và tên trong ảnh mẫu", () => {
  assert.deepEqual(
    PRIMARY_NAV.map((item) => item.label),
    ["Trang chủ", "Không gian lễ Phật", "Lời nguyện", "Về cauphuc.com", "Hướng dẫn"],
  );
  for (const item of PRIMARY_NAV) assert.ok(item.icon, `${item.label} thiếu biểu tượng`);
});

test("5 chuyên mục nội dung của research pack vẫn còn, đúng thứ tự", () => {
  assert.deepEqual(
    SECTIONS.map((item) => item.label),
    ["Lời hay mỗi ngày", "Góc Phật pháp", "Nghe để tâm an", "Thiền và tĩnh tâm", "Sống tốt – Sống thiện"],
  );
  const icons = SECTIONS.map((item) => item.icon);
  assert.ok(icons.every(Boolean));
  assert.equal(new Set(icons).size, icons.length, "không dùng trùng icon");
});

test("mọi đường dẫn có / ở đầu và cuối; danh sách trang không trùng", () => {
  for (const item of [...PRIMARY_NAV, ...SECTIONS, ...INFO_LINKS]) assert.equal(item.href, normalizePath(item.href), `đường dẫn chưa chuẩn: ${item.href}`);
  const hrefs = ALL_PAGES.map((item) => item.href);
  assert.equal(new Set(hrefs).size, hrefs.length);
});

test("chân trang có đủ trang thông tin như ảnh mẫu và trang Bản quyền của pack", () => {
  assert.deepEqual(
    INFO_LINKS.map((item) => item.label),
    ["Giới thiệu", "Điều khoản sử dụng", "Chính sách riêng tư", "Hướng dẫn", "Liên hệ", "Bản quyền"],
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

test("pageByHref báo lỗi khi gõ sai đường dẫn; trang trùng lấy tên ở menu chính", () => {
  assert.equal(pageByHref("/lien-he").label, "Liên hệ");
  assert.equal(pageByHref("/gioi-thieu/").label, "Về cauphuc.com");
  assert.throws(() => pageByHref("/khong-co/"));
});

test("mọi trang trong menu hoặc là trang thật, hoặc có trang giữ chỗ", () => {
  const slugs = PLACEHOLDERS.map((item) => `/${item.slug}/`);
  const expected = ALL_PAGES.map((item) => item.href).filter((href) => !BUILT_PAGES.includes(href));
  assert.deepEqual([...slugs].sort(), [...expected].sort());
});

test("thanh lối tắt đáy màn hình: 5 mục, đều có trang, nút giữa dẫn tới Không gian lễ Phật", () => {
  assert.equal(BOTTOM_NAV.length, 5);
  const known = new Set(ALL_PAGES.map((item) => item.href));
  for (const item of BOTTOM_NAV) assert.ok(known.has(item.href), `${item.href} không có trang`);
  const featured = BOTTOM_NAV.filter((item) => item.featured);
  assert.equal(featured.length, 1);
  assert.equal(BOTTOM_NAV.indexOf(featured[0]), 2, "nút nổi bật phải ở giữa");
  assert.equal(featured[0].href, "/khong-gian-le-phat/");
  assert.ok(!BOTTOM_NAV.some((item) => /ủng hộ/i.test(item.label)), "ô Ủng hộ đang khóa");
  for (const item of BOTTOM_NAV) assert.ok(item.label.length <= 10, `nhãn quá dài: ${item.label}`);
});

test("nút trên thanh đầu dẫn tới Không gian lễ Phật", () => {
  assert.equal(HEADER_CTA.label, "Thắp sáng tâm an");
  assert.equal(HEADER_CTA.href, "/khong-gian-le-phat/");
});

test("4 nút nghi thức theo ảnh mẫu", () => {
  assert.deepEqual(
    SPACE_ACTIONS.map((action) => action.label),
    ["Thắp hương", "Dâng hoa sen", "Chắp tay lễ Phật", "Chọn lời nguyện"],
  );
  assert.deepEqual(
    SPACE_ACTIONS.map((action) => action.short),
    ["Thắp hương", "Dâng hoa sen", "Chắp tay", "Lời nguyện"],
  );
});

test("7 lời nguyện có sẵn đúng câu chữ ảnh mẫu, mã không trùng, không có lời hứa linh ứng", () => {
  assert.equal(PRAYERS.length, 7);
  assert.equal(PRAYERS[0].text, "Nam mô A Di Đà Phật");
  const ids = PRAYERS.map((prayer) => prayer.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const prayer of PRAYERS) {
    assert.match(prayer.id, /^[a-z]+(-[a-z]+)*$/);
    assert.equal(prayerById(prayer.id), prayer);
    assert.doesNotMatch(prayer.text, /linh ứng|chắc chắn|giải hạn|chữa bệnh|đổi vận/i);
  }
});

test("thông tin đơn vị vận hành đủ và đúng định dạng", () => {
  assert.equal(OPERATOR.taxCode, "0901197922");
  assert.match(OPERATOR.email, /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/);
});
