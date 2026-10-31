"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { NavLinks } from "@/components/NavLinks";
import { INFO_LINKS, PRIMARY_NAV, SECTIONS } from "@/lib/site";

// Trang thông tin chưa có trong menu chính (Giới thiệu, Hướng dẫn đã nằm ở trên).
const MORE_INFO = INFO_LINKS.filter((info) => !PRIMARY_NAV.some((item) => item.href === info.href));

// Menu cho điện thoại và máy tính bảng, dựng bằng <details>: chưa tải xong JavaScript vẫn mở được bằng chạm hoặc bàn phím.
// JavaScript chỉ thêm: tự đóng khi chuyển trang, khi bấm Esc, khi bấm ra ngoài.
export function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const details = ref.current;
    if (!details) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && details.open) {
        details.open = false;
        details.querySelector("summary")?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (details.open && event.target instanceof Node && !details.contains(event.target)) details.open = false;
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  return (
    <details ref={ref} className="group relative lg:hidden" data-testid="mobile-menu">
      {/* Như ảnh mẫu: chỉ có biểu tượng ba gạch; chữ "Menu" để trình đọc màn hình đọc. */}
      <summary className="grid h-12 w-12 cursor-pointer list-none place-items-center rounded-full text-ivory hover:bg-night-3 hover:text-gold-light [&::-webkit-details-marker]:hidden">
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path className="group-open:hidden" d="M4 7h16M4 12h16M4 17h16" />
          <path className="hidden group-open:block" d="M6 6l12 12M18 6L6 18" />
        </svg>
        <span className="sr-only">Menu</span>
      </summary>
      <div className="absolute right-0 z-50 mt-2 max-h-[calc(100dvh-10rem)] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-night-2 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
        <nav aria-label="Menu chính">
          <NavLinks items={PRIMARY_NAV} variant="panel" />
        </nav>
        <div className="mx-3 my-2 h-px bg-line-soft" />
        <nav aria-label="Chuyên mục">
          <p className="px-3 pb-1 pt-1 text-[0.82rem] font-semibold text-gold">Chuyên mục</p>
          <NavLinks items={SECTIONS} variant="panel" />
        </nav>
        <div className="mx-3 my-2 h-px bg-line-soft" />
        <nav aria-label="Thông tin">
          <NavLinks items={MORE_INFO} variant="panel" />
        </nav>
      </div>
    </details>
  );
}
