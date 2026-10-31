import type { Metadata } from "next";
import Link from "next/link";
import { NAV } from "@/lib/site";

export const metadata: Metadata = {
  title: "Không tìm thấy trang",
};

export default function NotFound() {
  const sections = NAV.filter((item) => item.href !== "/");
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgb(232_182_92_/_0.14),transparent)]"
      />
      <div className="wrap relative py-14 sm:py-20">
        <p className="font-semibold text-gold">Lỗi 404</p>
        <h1 className="gold-text mt-2 text-[clamp(2.1rem,6.5vw,3rem)] font-semibold leading-tight">Không tìm thấy trang</h1>
        <p className="mt-4 max-w-[58ch] text-lg text-mist">
          Trang bạn tìm có thể đã đổi địa chỉ hoặc chưa có. Bạn có thể về trang chủ hoặc chọn một chuyên mục dưới đây.
        </p>
        <p className="mt-8">
          <Link href="/" className="btn-primary">
            Về trang chủ
          </Link>
        </p>
        <ul className="mt-8 grid max-w-xl gap-1">
          {sections.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="inline-flex min-h-11 items-center text-gold-light underline underline-offset-4 hover:text-gold">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
