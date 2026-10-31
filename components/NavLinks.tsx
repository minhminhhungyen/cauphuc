"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";
import { isActive, type NavItem } from "@/lib/site";

type Props = {
  items: readonly NavItem[];
  variant: "bar" | "panel";
};

// Danh sách liên kết menu; mục đang xem có aria-current="page".
// "bar": thẻ tròn trên thanh đầu như ảnh mẫu (mục đang xem có viền vàng). "panel": danh sách trong menu điện thoại.
export function NavLinks({ items, variant }: Props) {
  const pathname = usePathname();

  if (variant === "bar") {
    return (
      <ul className="flex items-center gap-1 xl:gap-1.5">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link href={item.href} aria-current={active ? "page" : undefined} className="tab">
                {item.icon ? <Icon name={item.icon} className="tab-icon" /> : null}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="grid gap-0.5">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={[
                "flex min-h-12 items-center gap-3 rounded-xl px-3 font-medium transition-colors",
                active ? "bg-night-3 text-gold-light" : "text-ivory hover:bg-night-3 hover:text-gold-light",
              ].join(" ")}
            >
              {item.icon ? (
                <Icon name={item.icon} className={["h-5 w-5 shrink-0", active ? "text-gold-light" : "text-gold"].join(" ")} />
              ) : (
                <span aria-hidden="true" className={["mx-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full", active ? "bg-gold" : "bg-line"].join(" ")} />
              )}
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
