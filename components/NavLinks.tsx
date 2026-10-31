"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icons";
import { isActive, type NavItem } from "@/lib/site";

type Props = {
  items: readonly NavItem[];
  variant: "bar" | "panel";
};

// Danh sách liên kết menu; mục đang xem có aria-current="page", chữ vàng sáng và gạch chân vàng.
export function NavLinks({ items, variant }: Props) {
  const pathname = usePathname();

  if (variant === "bar") {
    return (
      <ul className="flex flex-wrap items-center justify-center gap-x-0.5 gap-y-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  // 1024–1279px: chữ và lề nhỏ hơn một chút để 7 mục nằm trên một hàng.
                  "relative inline-flex min-h-12 items-center rounded-md px-2 text-[0.9rem] font-medium whitespace-nowrap transition-colors xl:px-3 xl:text-[0.95rem]",
                  active ? "text-gold-light" : "text-mist hover:text-gold-light",
                  "after:absolute after:inset-x-2 after:bottom-1.5 after:h-0.5 after:rounded-full xl:after:inset-x-3",
                  active ? "after:bg-gold" : "after:bg-transparent",
                ].join(" ")}
              >
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
