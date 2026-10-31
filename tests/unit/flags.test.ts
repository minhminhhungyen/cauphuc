import { test } from "node:test";
import assert from "node:assert/strict";
import { FEATURES, LOCKED_FEATURES, isEnabled } from "../../lib/flags.ts";

test("mọi tính năng trong danh sách khóa đều đang tắt", () => {
  for (const name of LOCKED_FEATURES) assert.equal(FEATURES[name], false, `${name} phải tắt cho tới khi có văn bản luật sư`);
});

test("chỉ Sổ lời nguyện trên máy người dùng được bật (Sếp chốt 31/10/2026)", () => {
  const enabled = Object.entries(FEATURES)
    .filter(([, on]) => on)
    .map(([name]) => name);
  assert.deepEqual(enabled, ["prayerBookOnDevice"]);
});

test("mọi công tắc đều nằm trong danh sách khóa hoặc là tính năng đã được duyệt", () => {
  const approved = new Set(["prayerBookOnDevice"]);
  for (const name of Object.keys(FEATURES)) {
    assert.ok(approved.has(name) || (LOCKED_FEATURES as readonly string[]).includes(name), `${name} chưa được phân loại`);
  }
  assert.equal(isEnabled("donations"), false);
});
