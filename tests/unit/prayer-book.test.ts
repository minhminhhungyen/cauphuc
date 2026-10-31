import { test } from "node:test";
import assert from "node:assert/strict";
import { BOOK_LIMIT, addPrayer, parseBook, relativeTime, removePrayer, serializeBook } from "../../lib/prayer-book.ts";
import { PRAYERS } from "../../lib/site.ts";

const A = PRAYERS[0].id;
const B = PRAYERS[1].id;
const T0 = Date.UTC(2026, 9, 31, 10, 0, 0);

test("thêm lời nguyện: mới nhất lên đầu, đọc lại đúng như đã lưu", () => {
  let book = addPrayer([], A, T0, "x1");
  book = addPrayer(book, B, T0 + 1000, "x2");
  assert.deepEqual(
    book.map((entry) => entry.prayerId),
    [B, A],
  );
  assert.deepEqual(parseBook(serializeBook(book)), book);
});

test("chỉ nhận lời nguyện có sẵn: mã lạ thì sổ giữ nguyên", () => {
  const book = addPrayer([], A, T0, "x1");
  assert.deepEqual(addPrayer(book, "cau-bat-ky-nguoi-dung-go", T0, "x2"), book);
});

test("xóa từng dòng", () => {
  const book = addPrayer(addPrayer([], A, T0, "x1"), B, T0, "x2");
  assert.deepEqual(
    removePrayer(book, "x1").map((entry) => entry.id),
    ["x2"],
  );
});

test(`sổ giữ tối đa ${BOOK_LIMIT} dòng`, () => {
  let book: ReturnType<typeof addPrayer> = [];
  for (let i = 0; i < BOOK_LIMIT + 10; i++) book = addPrayer(book, A, T0 + i, `x${i}`);
  assert.equal(book.length, BOOK_LIMIT);
  assert.equal(book[0].id, `x${BOOK_LIMIT + 9}`);
});

test("dữ liệu lưu bị hỏng hoặc bị sửa tay: bỏ qua dòng sai, không báo lỗi", () => {
  assert.deepEqual(parseBook(null), []);
  assert.deepEqual(parseBook("không phải JSON"), []);
  assert.deepEqual(parseBook('{"a":1}'), []);
  const mixed = JSON.stringify([
    { id: "ok", prayerId: A, at: T0 },
    { id: "lạ", prayerId: "<script>", at: T0 },
    { id: "thiếu giờ", prayerId: A },
    { id: "ok", prayerId: B, at: T0 + 5 },
    "chuỗi",
    null,
  ]);
  assert.deepEqual(parseBook(mixed), [{ id: "ok", prayerId: A, at: T0 }]);
});

test("thời gian tương đối bằng tiếng Việt", () => {
  assert.equal(relativeTime(T0, T0 + 20_000), "vừa xong");
  assert.equal(relativeTime(T0, T0 + 5 * 60_000), "5 phút trước");
  assert.equal(relativeTime(T0, T0 + 3 * 3600_000), "3 giờ trước");
  assert.equal(relativeTime(T0, T0 + 26 * 3600_000), "hôm qua");
  assert.equal(relativeTime(T0, T0 + 5 * 24 * 3600_000), "31/10/2026");
  assert.equal(relativeTime(T0 + 1000, T0), "vừa xong", "giờ máy lệch về trước vẫn không âm");
});
