import type { Metadata } from "next";
import { PrayerPage } from "@/components/PrayerPage";
import { pageByHref } from "@/lib/site";

const PAGE = pageByHref("/loi-nguyen/");

export const metadata: Metadata = {
  title: PAGE.label,
  description: PAGE.description,
};

export default function LoiNguyenPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgb(232_182_92_/_0.16),transparent)]"
      />
      <div className="wrap relative py-12 sm:py-16">
        <h1 className="gold-text text-[clamp(2.1rem,6.5vw,3rem)] font-semibold leading-[1.15]">{PAGE.label}</h1>
        <p className="mt-4 max-w-[62ch] text-lg text-mist">
          Chọn một lời nguyện có sẵn. Lời nguyện chỉ lưu trên máy này, không gửi đi đâu, không ai khác đọc được. Bạn xóa được bất cứ lúc nào.
        </p>
        <div className="mt-8">
          <PrayerPage />
        </div>
      </div>
    </div>
  );
}
