import type { Metadata } from "next";
import Link from "next/link";
import { NAV } from "@/lib/site";

export const metadata: Metadata = {
  title: "Không tìm thấy trang",
};

export default function NotFound() {
  const sections = NAV.filter((item) => item.href !== "/");
  return (
    <div className="wrap py-14 sm:py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">Lỗi 404</p>
      <h1 className="mt-2 text-[clamp(2rem,6vw,2.75rem)] font-semibold leading-tight text-ink">Không tìm thấy trang</h1>
      <p className="mt-4 max-w-[58ch] text-lg text-ink-muted">
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
            <Link href={item.href} className="inline-flex min-h-11 items-center text-brand underline underline-offset-4">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
