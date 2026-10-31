"use client";

import { useState } from "react";
import { PrayerBookList, PrayerChips } from "@/components/prayers";
import { usePrayerBook } from "@/components/usePrayerBook";
import type { Prayer } from "@/lib/site";

// Phần bấm được của trang Lời nguyện: chọn lời nguyện (như khung "Chọn lời nguyện" trong ảnh mẫu) và sổ lời nguyện.
export function PrayerPage() {
  const { add } = usePrayerBook();
  const [chosen, setChosen] = useState<Prayer | null>(null);

  const choose = (prayer: Prayer) => {
    add(prayer.id);
    setChosen(prayer);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="glass p-5" aria-labelledby="chon">
        <h2 id="chon" className="panel-title">
          Chọn lời nguyện
        </h2>
        <div className="mt-4">
          <PrayerChips onChoose={choose} chosenId={chosen?.id} variant="list" />
        </div>
        <p className="mt-4 min-h-12 text-[0.95rem] text-gold-light" aria-live="polite" data-testid="prayer-confirm">
          {chosen ? `Đã ghi lời nguyện "${chosen.text}" vào sổ trên máy của bạn.` : ""}
        </p>
      </section>
      <section className="glass p-5" aria-labelledby="so" id="so">
        <h2 id="so" className="panel-title">
          Sổ lời nguyện trên máy này
        </h2>
        <div className="mt-3">
          <PrayerBookList emptyHint="Sổ đang trống. Chọn một lời nguyện ở khung bên cạnh." />
        </div>
      </section>
    </div>
  );
}
