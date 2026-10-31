import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { pageByHref } from "@/lib/site";

const PAGE = pageByHref("/huong-dan/");

export const metadata: Metadata = {
  title: PAGE.label,
  description: PAGE.description,
};

// Hướng dẫn sử dụng theo ảnh mẫu, sửa câu chữ cho đúng cách trang đang chạy: lời nguyện chỉ lưu trên máy người xem.
// Ba bước là một trình tự nên đánh số.
const STEPS = [
  {
    title: "Chọn lời nguyện",
    text: "Chọn một câu nguyện có sẵn mà bạn muốn gửi gắm. Lời nguyện được ghi vào sổ trên máy của bạn.",
  },
  {
    title: "Thực hiện nghi thức",
    text: "Thắp hương, dâng hoa sen, chắp tay lễ Phật. Tất cả đều miễn phí và chỉ diễn ra trên máy của bạn.",
  },
  {
    title: "Ngồi yên, giữ tâm an",
    text: "Bật nhạc thiền để nghe tiếng chuông, ngồi yên vài phút. Muốn xóa lời nguyện, vào mục Lời nguyện.",
  },
];

export default function HuongDanPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgb(232_182_92_/_0.16),transparent)]"
      />
      <div className="wrap relative py-12 sm:py-16">
        <h1 className="gold-text text-[clamp(2.1rem,6.5vw,3rem)] font-semibold leading-[1.15]">Hướng dẫn sử dụng</h1>
        <ol className="mt-8 grid max-w-2xl gap-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="glass flex gap-4 p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold font-bold text-on-gold" aria-hidden="true">
                {index + 1}
              </span>
              <span>
                <span className="block text-lg font-semibold text-gold-light">{step.title}</span>
                <span className="mt-1 block text-ivory/90">{step.text}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex max-w-2xl gap-4 rounded-2xl border border-[#8fd19e]/40 bg-[#163a2a]/70 p-5">
          <Icon name="shield" className="h-8 w-8 shrink-0 text-[#8fd19e]" />
          <p>
            <span className="block font-semibold text-[#bfeccb]">Không có ô chat tự do</span>
            <span className="mt-1 block text-ivory/90">
              Để giữ không gian trang nghiêm, cauphuc.com không có chat, bình luận hay tài khoản. Lời nguyện chỉ chọn từ danh sách có sẵn.
            </span>
          </p>
        </div>
        <p className="mt-8 flex flex-wrap gap-3">
          <Link href="/khong-gian-le-phat/" className="btn-primary">
            Vào Không gian lễ Phật
          </Link>
          <Link href="/loi-nguyen/" className="btn-secondary">
            Chọn lời nguyện
          </Link>
        </p>
      </div>
    </div>
  );
}
