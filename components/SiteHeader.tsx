import Link from "next/link";
import { Icon } from "@/components/icons";
import { LotusMark } from "@/components/LotusMark";
import { MobileMenu } from "@/components/MobileMenu";
import { NavLinks } from "@/components/NavLinks";
import { HEADER_CTA, NAV, SITE } from "@/lib/site";

// Thanh đầu trang tông đêm: hàng 1 là tên trang, nút "Thắp sáng tâm an" (từ 640px) và nút Menu (dưới 1024px);
// hàng 2 là menu 7 mục trên màn hình rộng.
export function SiteHeader() {
  return (
    <header className="relative z-30 border-b border-line-soft bg-night/85 backdrop-blur-md">
      <div className="wrap flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3 rounded-lg" aria-label={`${SITE.name}, về trang chủ`}>
          <LotusMark className="h-10 w-10 shrink-0 sm:h-11 sm:w-11" />
          <span className="min-w-0">
            <span className="block font-serif text-[1.4rem] font-semibold leading-tight text-gold-light sm:text-[1.45rem]">{SITE.name}</span>
            {/* Màn hình dưới 400px: ẩn khẩu hiệu để không rớt dòng. */}
            <span className="hidden whitespace-nowrap text-sm leading-snug text-mist min-[400px]:block">{SITE.tagline}</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href={HEADER_CTA.href} className="btn-primary hidden sm:inline-flex" data-testid="header-cta">
            <Icon name="incense" className="h-5 w-5" />
            {HEADER_CTA.label}
          </Link>
          <MobileMenu />
        </div>
      </div>
      <nav aria-label="Chuyên mục" className="hidden border-t border-line-soft lg:block">
        <div className="wrap">
          <NavLinks items={NAV} variant="bar" />
        </div>
      </nav>
    </header>
  );
}
