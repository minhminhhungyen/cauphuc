"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";
import { BOTTOM_NAV, isActive } from "@/lib/site";

// Thanh lối tắt cố định ở đáy màn hình điện thoại và máy tính bảng (dưới 1024px), theo ảnh mẫu.
// Nút giữa nổi tròn màu vàng dẫn tới Không gian lễ Phật. Màn hình rộng đã có menu trên thanh đầu nên ẩn thanh này.
// Điện thoại xoay ngang cũng ẩn (app/globals.css), để thanh này không che tượng Phật.
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Lối tắt"
      data-testid="bottom-nav"
      className="bottom-nav fixed inset-x-0 bottom-0 z-40 border-t border-line bg-night/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto grid h-[4.75rem] max-w-xl grid-cols-5 items-end">
        {BOTTOM_NAV.map((item) => {
          const active = isActive(pathname, item.href);
          if (item.featured) {
            return (
              <li key={item.href} className="flex h-full justify-center">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="group -mt-7 flex flex-col items-center gap-1 rounded-xl px-1"
                >
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#fbe2a6,#e8b65c_55%,#a8742a)] text-on-gold shadow-[0_0_0_4px_var(--color-night),0_0_0_5px_var(--color-line),0_10px_24px_-8px_rgb(232_182_92_/_0.7)]">
                    <Icon name={item.icon} className="h-8 w-8" />
                  </span>
                  <span className={["text-[0.78rem] font-semibold leading-none", active ? "text-gold-light" : "text-gold"].join(" ")}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          }
          return (
            <li key={item.href} className="h-full">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex h-full flex-col items-center justify-center gap-1 rounded-xl pb-1 text-[0.78rem] font-medium leading-none transition-colors",
                  active ? "text-gold-light" : "text-mist hover:text-gold-light",
                ].join(" ")}
              >
                <Icon name={item.icon} className="h-6 w-6" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
