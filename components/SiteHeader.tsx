import Link from "next/link";
import { HeaderTools } from "@/components/HeaderTools";
import { Icon } from "@/components/icons";
import { LotusMark } from "@/components/LotusMark";
import { MobileMenu } from "@/components/MobileMenu";
import { NavLinks } from "@/components/NavLinks";
import { HEADER_CTA, PRIMARY_NAV, SITE } from "@/lib/site";

// Thanh đầu trang theo ảnh mẫu: tên trang bên trái; 5 mục menu dạng thẻ ở giữa (từ 1024px);
// bên phải nút nhạc chuông, toàn màn hình, nút vàng "Thắp sáng tâm an" (từ 1280px), nút Menu (dưới 1024px).
export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-row">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5 rounded-lg" aria-label={`${SITE.name}, về trang chủ`}>
          <LotusMark className="h-11 w-11 shrink-0 sm:h-12 sm:w-12" />
          <span className="min-w-0">
            <span className="block font-serif text-[1.45rem] font-semibold leading-tight text-ivory sm:text-[1.6rem]">{SITE.name}</span>
            <span className="block whitespace-nowrap text-[0.85rem] leading-snug text-ivory/85 sm:text-[0.95rem]">{SITE.tagline}</span>
          </span>
        </Link>
        <nav aria-label="Menu chính" className="hidden min-w-0 lg:block" data-testid="desktop-nav">
          <NavLinks items={PRIMARY_NAV} variant="bar" />
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <HeaderTools />
          <Link href={HEADER_CTA.href} className="btn-primary hidden xl:inline-flex" data-testid="header-cta">
            <Icon name="lotus" className="h-5 w-5" />
            {HEADER_CTA.label}
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
