import Link from "next/link";

type Props = {
  title: string;
  description: string;
  /** Lý do trang chưa có nội dung, hiện trong khung ghi chú. */
  status: string;
};

// Trang giữ chỗ cho các mục chưa làm (module 1). Mọi trang đều noindex cho tới khi LAUNCHED = true.
export function PagePlaceholder({ title, description, status }: Props) {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgb(232_182_92_/_0.16),transparent)]"
      />
      <div className="wrap relative py-14 sm:py-20">
        <h1 className="gold-text max-w-[20ch] text-[clamp(2.1rem,6.5vw,3rem)] font-semibold leading-[1.15]">{title}</h1>
        <p className="mt-4 max-w-[62ch] text-lg text-mist">{description}</p>
        <div className="tablet mt-8 max-w-[62ch] p-6">
          <p className="font-semibold text-gold-light">Mục này đang được biên soạn</p>
          <p className="mt-1 text-mist">{status}</p>
        </div>
        <p className="mt-8">
          <Link href="/" className="btn-secondary">
            Về trang chủ
          </Link>
        </p>
      </div>
    </div>
  );
}
