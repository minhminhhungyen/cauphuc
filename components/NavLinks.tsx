"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActive, type NavItem } from "@/lib/site";

type Props = {
  items: readonly NavItem[];
  variant: "bar" | "panel";
};

// Danh sách liên kết menu; mục đang xem có aria-current="page" và gạch chân vàng.
export function NavLinks({ items, variant }: Props) {
  const pathname = usePathname();

  if (variant === "bar") {
    return (
      <ul className="flex flex-wrap items-center gap-x-1 gap-y-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "relative inline-flex min-h-12 items-center rounded-md px-3 text-[0.95rem] font-medium transition-colors",
                  active ? "text-brand" : "text-ink-muted hover:text-brand",
                  "after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:rounded-full",
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
                active ? "bg-canvas text-brand" : "text-ink hover:bg-canvas hover:text-brand",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className={["h-1.5 w-1.5 shrink-0 rounded-full", active ? "bg-gold" : "bg-line"].join(" ")}
              />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
