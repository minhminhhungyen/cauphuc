// Sổ lời nguyện: chỉ lưu trên máy người xem (localStorage), không gửi đi đâu, có nút xóa.
// Đây là tính năng duy nhất được bật trong lib/flags.ts (prayerBookOnDevice), Sếp chốt 31/10/2026.
// Chỉ lưu mã của lời nguyện có sẵn (PRAYERS), không lưu chữ người dùng gõ: trang không có ô nhập tự do.
// Các hàm ở đây thuần (không đụng trình duyệt) để kiểm thử bằng node --test.

import { prayerById } from "./site.ts";

export type PrayerEntry = {
  /** Mã riêng của lần ghi, dùng để xóa từng dòng. */
  id: string;
  /** Mã lời nguyện trong PRAYERS. */
  prayerId: string;
  /** Thời điểm ghi, mili giây kể từ 1970. */
  at: number;
};

export const BOOK_KEY = "cauphuc:so-loi-nguyen:v1";
export const BOOK_LIMIT = 50;

/** Đọc sổ từ chuỗi đã lưu. Dữ liệu hỏng, lời nguyện không còn trong danh sách, dòng trùng mã: bỏ qua. */
export function parseBook(raw: string | null | undefined): PrayerEntry[] {
  if (!raw) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];
  const seen = new Set<string>();
  const book: PrayerEntry[] = [];
  for (const item of data) {
    if (!item || typeof item !== "object") continue;
    const { id, prayerId, at } = item as Record<string, unknown>;
    if (typeof id !== "string" || id.length === 0 || id.length > 64 || seen.has(id)) continue;
    if (typeof prayerId !== "string" || !prayerById(prayerId)) continue;
    if (typeof at !== "number" || !Number.isFinite(at) || at <= 0) continue;
    seen.add(id);
    book.push({ id, prayerId, at });
  }
  return book.sort((a, b) => b.at - a.at).slice(0, BOOK_LIMIT);
}

export function serializeBook(book: readonly PrayerEntry[]): string {
  return JSON.stringify(book.slice(0, BOOK_LIMIT));
}

/** Thêm một lời nguyện lên đầu sổ. Mã lời nguyện lạ thì giữ nguyên sổ. */
export function addPrayer(book: readonly PrayerEntry[], prayerId: string, now: number, id: string): PrayerEntry[] {
  if (!prayerById(prayerId)) return [...book];
  return [{ id, prayerId, at: now }, ...book.filter((entry) => entry.id !== id)].slice(0, BOOK_LIMIT);
}

export function removePrayer(book: readonly PrayerEntry[], id: string): PrayerEntry[] {
  return book.filter((entry) => entry.id !== id);
}

/** "vừa xong", "5 phút trước", "2 giờ trước", "hôm qua", hoặc ngày dd/mm/yyyy (giờ Việt Nam). */
export function relativeTime(at: number, now: number): string {
  const seconds = Math.max(0, Math.floor((now - at) / 1000));
  if (seconds < 60) return "vừa xong";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const day = (t: number) => new Date(t + 7 * 3600 * 1000).toISOString().slice(0, 10);
  if (day(now - 24 * 3600 * 1000) === day(at)) return "hôm qua";
  const [y, m, d] = day(at).split("-");
  return `${d}/${m}/${y}`;
}
