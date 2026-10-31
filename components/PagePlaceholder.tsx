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
    <div className="wrap py-12 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand">cauphuc.com</p>
      <h1 className="mt-2 text-[clamp(2rem,6vw,2.75rem)] font-semibold leading-tight text-ink">{title}</h1>
      <p className="mt-4 max-w-[62ch] text-lg text-ink-muted">{description}</p>
      <div className="mt-8 max-w-[62ch] rounded-2xl border border-line bg-surface p-5">
        <p className="font-semibold text-ink">Mục này đang được biên soạn</p>
        <p className="mt-1 text-ink-muted">{status}</p>
      </div>
      <p className="mt-8">
        <Link href="/" className="btn-secondary">
          Về trang chủ
        </Link>
      </p>
    </div>
  );
}
