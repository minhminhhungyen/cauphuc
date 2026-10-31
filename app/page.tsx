import Link from "next/link";
import { NAV, SITE } from "@/lib/site";

// Trang chủ dạng khung cho module 1 (bố cục). Module 2 sẽ hoàn thiện nội dung trang chủ.
export default function HomePage() {
  const sections = NAV.filter((item) => item.href !== "/");
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">{SITE.tagline}</p>
          <h1 className="mt-3 max-w-[18ch] text-[clamp(2.25rem,7vw,3.5rem)] font-semibold leading-[1.12] text-ink">
            {SITE.heroTitle}
          </h1>
          <p className="mt-5 max-w-[58ch] text-lg text-ink-muted sm:text-xl">{SITE.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/goc-phat-phap/" className="btn-primary">
              Khám phá Phật pháp
            </Link>
            <Link href="/nghe-de-tam-an/" className="btn-secondary">
              Nghe để tâm an
            </Link>
          </div>
        </div>
      </section>

      <section className="wrap py-12 sm:py-16" aria-labelledby="chuyen-muc">
        <h2 id="chuyen-muc" className="text-[clamp(1.6rem,4vw,2rem)] font-semibold text-ink">
          Các chuyên mục
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((item) => (
            <li key={item.href} className="min-w-0">
              <Link
                href={item.href}
                className="block h-full rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brand"
              >
                <span className="block font-serif text-xl font-semibold text-ink">{item.label}</span>
                <span className="mt-2 block text-ink-muted">{item.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
