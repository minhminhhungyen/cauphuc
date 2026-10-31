import Link from "next/link";
import { LotusMark } from "@/components/LotusMark";
import { MobileMenu } from "@/components/MobileMenu";
import { NavLinks } from "@/components/NavLinks";
import { NAV, SITE } from "@/lib/site";

// Thanh đầu trang: hàng 1 là tên trang (và nút Menu dưới 1024px); hàng 2 là menu 7 mục trên màn hình rộng.
export function SiteHeader() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="wrap flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3 rounded-lg" aria-label={`${SITE.name}, về trang chủ`}>
          <LotusMark className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" />
          <span className="min-w-0">
            <span className="block font-serif text-[1.4rem] font-semibold leading-tight text-brand sm:text-[1.45rem]">{SITE.name}</span>
            {/* Màn hình dưới 400px: ẩn khẩu hiệu để không rớt dòng (khẩu hiệu vẫn có ở đầu trang chủ). */}
            <span className="hidden whitespace-nowrap text-sm leading-snug text-ink-muted min-[400px]:block">{SITE.tagline}</span>
          </span>
        </Link>
        <MobileMenu />
      </div>
      <nav aria-label="Chuyên mục" className="hidden border-t border-line lg:block">
        <div className="wrap">
          <NavLinks items={NAV} variant="bar" />
        </div>
      </nav>
    </header>
  );
}
