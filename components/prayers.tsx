"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { usePrayerBook } from "@/components/usePrayerBook";
import { relativeTime } from "@/lib/prayer-book";
import { PRAYERS, prayerById, type Prayer } from "@/lib/site";

/** Giờ hiện tại, cập nhật mỗi phút để "5 phút trước" tự đổi. Trả 0 khi chưa chạy trên trình duyệt. */
export function useNow(intervalMs = 30_000): number {
  const [now, setNow] = useState(0);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(tick, intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);
  return now;
}

function PrayerText({ prayer }: { prayer: Prayer }) {
  return (
    <>
      {prayer.text}
      {prayer.emoji ? (
        <span aria-hidden="true" className="ml-1">
          {prayer.emoji}
        </span>
      ) : null}
    </>
  );
}

type ChipsProps = {
  onChoose: (prayer: Prayer) => void;
  /** Lời nguyện vừa chọn, hiện viền vàng và dấu tích. */
  chosenId?: string | null;
  /** Hiện bao nhiêu câu (điện thoại hiện 6, có nút "Xem tất cả"). */
  limit?: number;
  variant?: "grid" | "list";
};

/** Các ô lời nguyện có sẵn, theo ảnh mẫu. Bấm là ghi vào sổ trên máy. */
export function PrayerChips({ onChoose, chosenId, limit, variant = "grid" }: ChipsProps) {
  const list = typeof limit === "number" ? PRAYERS.slice(0, limit) : PRAYERS;
  return (
    <ul className={variant === "grid" ? "prayer-grid" : "grid gap-2"}>
      {list.map((prayer, index) => {
        const chosen = prayer.id === chosenId;
        const wide = variant === "grid" && index === list.length - 1 && list.length % 2 === 1;
        return (
          <li key={prayer.id} className={wide ? "col-span-2" : undefined}>
            <button
              type="button"
              className={variant === "grid" ? "chip" : "chip chip-row"}
              data-chosen={chosen ? "true" : undefined}
              data-prayer={prayer.id}
              aria-label={`Ghi lời nguyện: ${prayer.text}`}
              onClick={() => onChoose(prayer)}
            >
              <span className="min-w-0">
                <PrayerText prayer={prayer} />
              </span>
              {variant === "list" ? (
                <span className={["chip-check", chosen ? "is-on" : ""].join(" ")} aria-hidden="true">
                  <Icon name="check" className="h-4 w-4" />
                </span>
              ) : chosen ? (
                <Icon name="check" className="chip-tick h-4 w-4" />
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

type BookProps = {
  /** Hiện tối đa bao nhiêu dòng (khung nhỏ trên trang chủ hiện 4). */
  limit?: number;
  /** Lời nhắc khi sổ trống. */
  emptyHint: string;
  /** Hiện nút "Xem cả sổ" khi bị cắt bớt. */
  moreHref?: string;
};

/** Sổ lời nguyện của người xem, mới nhất ở trên, có nút xóa từng dòng và xóa hết. */
export function PrayerBookList({ limit, emptyHint, moreHref }: BookProps) {
  const { book, remove, clear } = usePrayerBook();
  const now = useNow();
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const timer = setTimeout(() => setConfirming(false), 4000);
    return () => clearTimeout(timer);
  }, [confirming]);

  if (book.length === 0) {
    return (
      <p className="book-empty" data-testid="book-empty">
        {emptyHint}
      </p>
    );
  }

  const shown = typeof limit === "number" ? book.slice(0, limit) : book;
  return (
    <div>
      <ul className="book-list" data-testid="prayer-book">
        {shown.map((entry) => {
          const prayer = prayerById(entry.prayerId);
          if (!prayer) return null;
          return (
            <li key={entry.id} className="book-item">
              <span className="book-avatar" aria-hidden="true">
                <Icon name="lotus" className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium leading-snug text-ivory">
                  <PrayerText prayer={prayer} />
                </span>
                <span className="block text-[0.78rem] text-mist">{now ? relativeTime(entry.at, now) : " "}</span>
              </span>
              <button type="button" className="icon-btn-sm" aria-label={`Xóa lời nguyện: ${prayer.text}`} onClick={() => remove(entry.id)}>
                <Icon name="close" className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[0.85rem]">
        {moreHref && book.length > shown.length ? (
          <Link href={moreHref} className="link-gold">
            Xem cả sổ ({book.length})
          </Link>
        ) : (
          <span className="text-mist">Chỉ lưu trên máy này</span>
        )}
        <button
          type="button"
          className="link-muted"
          data-testid="clear-book"
          onClick={() => {
            if (confirming) {
              clear();
              setConfirming(false);
            } else {
              setConfirming(true);
            }
          }}
        >
          {confirming ? "Bấm lần nữa để xóa hết" : "Xóa hết"}
        </button>
      </div>
    </div>
  );
}
