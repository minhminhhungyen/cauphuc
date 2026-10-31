import Link from "next/link";
import { Icon } from "@/components/icons";
import { TempleScene } from "@/components/TempleScene";
import { TempleSpace } from "@/components/TempleSpace";
import { SECTIONS, SITE } from "@/lib/site";

// Trang chủ theo ảnh mẫu Sếp gửi: màn hình đầu là không gian lễ Phật (tranh chính điện, khung lời nguyện, 4 nút nghi thức).
// Phía dưới giữ lời giới thiệu và các chuyên mục của research pack (02_product/INFORMATION_ARCHITECTURE.md).
export default function HomePage() {
  return (
    <>
      <TempleSpace variant="home" scene={<TempleScene />} />

      <section className="wrap mt-14 sm:mt-20" aria-labelledby="tieu-de">
        <h1 id="tieu-de" className="gold-text max-w-[20ch] text-[clamp(2rem,6vw,3rem)] font-semibold leading-[1.15]">
          {SITE.heroTitle}
        </h1>
        <p className="mt-4 max-w-[58ch] text-lg text-ivory/90">{SITE.description}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/goc-phat-phap/" className="btn-primary">
            Khám phá Phật pháp
          </Link>
          <Link href="/nghe-de-tam-an/" className="btn-secondary">
            Nghe để tâm an
          </Link>
        </div>
      </section>

      <section className="wrap mt-14 mb-4 sm:mt-16" aria-labelledby="chuyen-muc">
        <h2 id="chuyen-muc" className="text-[clamp(1.6rem,4vw,2.1rem)] font-semibold text-gold-light">
          Các chuyên mục
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((item) => (
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
