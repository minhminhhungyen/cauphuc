import Link from "next/link";
import { LotusMark } from "@/components/LotusMark";
import { INDEPENDENCE_NOTE, INFO_LINKS, OPERATOR, SECTIONS, SITE } from "@/lib/site";

const BUILD_YEAR = new Date().getFullYear();

// Chân trang sáng như ảnh mẫu. Không đặt biểu tượng YouTube, Facebook, TikTok vì chưa có tài khoản thật.
// Thông tin đơn vị vận hành phải có ở mọi trang (CLAUDE.md).
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap-wide flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="inline-flex shrink-0 items-center gap-2.5 rounded-lg">
          <LotusMark className="h-11 w-11 shrink-0" />
          <span>
            <span className="block font-serif text-[1.3rem] font-semibold leading-tight text-ink">{SITE.name}</span>
            <span className="block text-[0.85rem] leading-snug text-ink-muted">{SITE.tagline}</span>
          </span>
        </Link>
        <nav aria-label="Thông tin">
          <ul className="footer-links">
            {INFO_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="footer-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="shrink-0 font-serif text-[1.05rem] font-medium text-ink">
          Nam mô A Di Đà Phật <span aria-hidden="true">🙏</span>
        </p>
      </div>
      <div className="border-t border-ink/10">
        <div className="wrap-wide grid gap-1.5 py-4 text-[0.82rem] leading-relaxed text-ink-muted">
          <nav aria-label="Chuyên mục ở chân trang">
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {SECTIONS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p>
            {INDEPENDENCE_NOTE} Đơn vị vận hành: {OPERATOR.name}, mã số thuế {OPERATOR.taxCode}. © {BUILD_YEAR} {SITE.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
