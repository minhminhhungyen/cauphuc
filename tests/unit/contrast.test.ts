// Kiểm độ tương phản chữ theo WCAG 2.2 (mức AA: chữ thường ≥ 4,5:1).
// Đọc thẳng màu trong app/globals.css để đổi màu ở đó mà quên kiểm thì test báo ngay.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");

function token(name: string): string {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})\\s*;`));
  assert.ok(match, `không thấy --color-${name} trong globals.css`);
  return match[1];
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test("chữ chính và chữ phụ đọc rõ trên mọi nền tối", () => {
  const backgrounds = ["night", "night-2", "night-3"].map(token);
  for (const bg of backgrounds) {
    assert.ok(ratio(token("ivory"), bg) >= 7, `chữ ngà trên ${bg}: ${ratio(token("ivory"), bg).toFixed(2)}`);
    for (const fg of ["mist", "gold", "gold-light"]) {
      const value = ratio(token(fg), bg);
      assert.ok(value >= 4.5, `${fg} trên ${bg}: ${value.toFixed(2)}:1`);
    }
  }
});

test("chữ trên nút vàng đọc rõ ở cả chỗ sáng nhất và tối nhất của nút", () => {
  const block = css.match(/\.btn-primary\s*\{[^}]*\}/);
  assert.ok(block, "không thấy khối .btn-primary");
  const stops = block[0].match(/#[0-9a-fA-F]{6}/g) ?? [];
  assert.ok(stops.length >= 2, "nút vàng phải có dải màu");
  for (const stop of stops) {
    const value = ratio(token("on-gold"), stop);
    assert.ok(value >= 4.5, `chữ nút trên ${stop}: ${value.toFixed(2)}:1`);
  }
});

test("nút tròn vàng giữa thanh lối tắt: chữ nâu trên vàng", () => {
  // Biểu tượng trên nút giữa (BottomNav) và chữ trên nút bỏ qua menu dùng on-gold trên gold.
  assert.ok(ratio(token("on-gold"), token("gold")) >= 4.5);
});
