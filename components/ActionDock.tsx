import Link from "next/link";
import { Icon } from "@/components/icons";
import { SPACE_ACTIONS } from "@/lib/site";

const TONE_CLASS = {
  amber: "medallion-amber",
  rose: "medallion-rose",
  sapphire: "medallion-sapphire",
  amethyst: "medallion-amethyst",
} as const;

// Bốn nghi thức theo ảnh thiết kế, dẫn tới từng phần của trang Không gian bình an.
// Chỉ là liên kết: không đếm lượt, không lưu gì (xem SPACE_ACTIONS trong lib/site.ts).
export function ActionDock() {
  return (
    <nav aria-label="Nghi thức ở Không gian bình an">
      <ul className="mx-auto grid max-w-2xl grid-cols-4 gap-1 sm:gap-6">
        {SPACE_ACTIONS.map((action) => (
          <li key={action.id} className="min-w-0">
            <Link
              href={`/khong-gian-binh-an/#${action.id}`}
              className="group flex min-h-24 flex-col items-center gap-2 rounded-xl px-1 py-1 text-center"
            >
              <span className={`medallion ${TONE_CLASS[action.tone]}`}>
                <Icon name={action.icon} className="h-7 w-7 sm:h-8 sm:w-8" />
              </span>
              <span className="text-[0.85rem] font-medium leading-snug text-ivory sm:text-[0.95rem]">{action.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
