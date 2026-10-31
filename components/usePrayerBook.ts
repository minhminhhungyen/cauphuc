"use client";

import { useCallback, useSyncExternalStore } from "react";
import { BOOK_KEY, addPrayer, parseBook, removePrayer, serializeBook, type PrayerEntry } from "@/lib/prayer-book";

// Sổ lời nguyện dùng chung cho mọi khung trên trang (khung trái, trang Lời nguyện…), đồng bộ giữa các tab.
// Trình duyệt chặn bộ nhớ (chế độ riêng tư, tắt cookie): sổ chỉ sống trong trang, không báo lỗi.

const listeners = new Set<() => void>();
const EMPTY: PrayerEntry[] = [];
let cache: PrayerEntry[] | null = null;

function read(): PrayerEntry[] {
  try {
    return parseBook(window.localStorage.getItem(BOOK_KEY));
  } catch {
    return cache ?? EMPTY;
  }
}

function write(book: PrayerEntry[]) {
  cache = book;
  try {
    if (book.length === 0) window.localStorage.removeItem(BOOK_KEY);
    else window.localStorage.setItem(BOOK_KEY, serializeBook(book));
  } catch {
    // Không lưu được thì vẫn giữ trong trang.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === BOOK_KEY || event.key === null) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): PrayerEntry[] {
  if (cache === null) cache = read();
  return cache;
}

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

export function usePrayerBook() {
  const book = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  const add = useCallback((prayerId: string) => write(addPrayer(getSnapshot(), prayerId, Date.now(), newId())), []);
  const remove = useCallback((id: string) => write(removePrayer(getSnapshot(), id)), []);
  const clear = useCallback(() => write([]), []);
  return { book, add, remove, clear };
}
