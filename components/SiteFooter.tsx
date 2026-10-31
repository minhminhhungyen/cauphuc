import Link from "next/link";
import { LotusMark } from "@/components/LotusMark";
import { INDEPENDENCE_NOTE, INFO_LINKS, NAV, OPERATOR, SITE } from "@/lib/site";

const BUILD_YEAR = new Date().getFullYear();

export function SiteFooter() {
  const sections = NAV.filter((item) => item.href !== "/");
  return (
    <footer className="mt-16 bg-brand text-on-brand">
      <div className="h-1 bg-gold" aria-hidden="true" />
      <div className="wrap grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-md">
          <Link href="/" className="inline-flex items-center gap-3 rounded-lg">
            <LotusMark className="h-10 w-10 shrink-0" />
            <span className="font-serif text-xl font-semibold">{SITE.name}</span>
          </Link>
          <p className="mt-4 font-serif text-lg leading-snug">{SITE.slogan}</p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-white/90">{INDEPENDENCE_NOTE}</p>
        </div>
        <nav aria-label="Chuyên mục ở chân trang">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.12em] text-gold-soft">Chuyên mục</h2>
          <ul className="mt-3 grid gap-1">
            {sections.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-10 items-center rounded-md text-white/95 underline-offset-4 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Thông tin">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.12em] text-gold-soft">Thông tin</h2>
          <ul className="mt-3 grid gap-1">
            {INFO_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-10 items-center rounded-md text-white/95 underline-offset-4 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/15">
        <div className="wrap flex flex-col gap-1 py-5 text-sm text-white/85 md:flex-row md:items-center md:justify-between">
          <p>
            Đơn vị vận hành: {OPERATOR.name} · MST {OPERATOR.taxCode}
          </p>
          <p>
            © {BUILD_YEAR} {SITE.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
