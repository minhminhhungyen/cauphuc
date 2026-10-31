import Link from "next/link";
import { ActionDock } from "@/components/ActionDock";
import { Icon } from "@/components/icons";
import { TempleScene } from "@/components/TempleScene";
import { NAV, SITE } from "@/lib/site";

// Trang chủ dạng khung cho module 1 (bố cục, tông màu). Module 2 sẽ hoàn thiện nội dung trang chủ.
// Chữ đầu trang lấy đúng theo docs/research-pack/02_product/INFORMATION_ARCHITECTURE.md.
export default function HomePage() {
  const sections = NAV.filter((item) => item.href !== "/");
  return (
    <>
      <section className="hero" aria-labelledby="tieu-de">
        <div className="hero-scene" data-testid="hero-scene">
          <TempleScene />
        </div>
        <div className="wrap">
          <div className="hero-panel">
            <h1 id="tieu-de" className="gold-text max-w-[16ch] text-[clamp(2.2rem,7vw,3.4rem)] font-semibold leading-[1.14]">
              {SITE.heroTitle}
            </h1>
            <p className="mt-4 max-w-[52ch] text-lg text-ivory/90">{SITE.description}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/goc-phat-phap/" className="btn-primary">
                Khám phá Phật pháp
              </Link>
              <Link href="/nghe-de-tam-an/" className="btn-secondary">
                Nghe để tâm an
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap relative z-10 mt-10 lg:-mt-6">
        <ActionDock />
      </div>

      <section className="wrap mt-14 sm:mt-20" aria-labelledby="chuyen-muc">
        <h2 id="chuyen-muc" className="text-[clamp(1.6rem,4vw,2.1rem)] font-semibold text-gold-light">
          Các chuyên mục
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((item) => (
            <li key={item.href} className="min-w-0">
              <Link href={item.href} className="tablet group flex h-full gap-4 p-5 transition-colors hover:border-gold">
                {item.icon ? (
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-gold transition-colors group-hover:border-gold group-hover:text-gold-light">
                    <Icon name={item.icon} className="h-6 w-6" />
                  </span>
                ) : null}
                <span className="min-w-0">
                  <span className="block font-serif text-xl font-semibold text-gold-light">{item.label}</span>
                  <span className="mt-1.5 block text-mist">{item.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
