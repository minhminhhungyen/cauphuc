// Các trang chưa có nội dung thật, hiển thị qua app/[section]/page.tsx.
// Khi một module làm trang thật (ví dụ app/goc-phat-phap/page.tsx), xóa mục tương ứng khỏi danh sách này.

import { pageByHref, type NavItem } from "./site.ts";

const PENDING_CONTENT = "Bài viết sẽ được đăng sau khi người duyệt kiểm tra nội dung và nguồn trích dẫn.";
const PENDING_LEGAL = "Bản nháp đang được soạn và sẽ được luật sư xem trước khi công bố.";

const ENTRIES: readonly { slug: string; status: string }[] = [
  { slug: "loi-hay-moi-ngay", status: PENDING_CONTENT },
  { slug: "goc-phat-phap", status: PENDING_CONTENT },
  { slug: "nghe-de-tam-an", status: "Âm thanh chỉ được đăng khi đã có giấy phép sử dụng rõ ràng." },
  { slug: "thien-va-tinh-tam", status: "Các bài thiền đang được soạn và sẽ có người duyệt trước khi đăng." },
  { slug: "song-tot-song-thien", status: PENDING_CONTENT },
  {
    slug: "khong-gian-binh-an",
    status: "Không gian này đang được dựng. Mọi thao tác sẽ chạy ngay trên máy của bạn, không gửi dữ liệu đi đâu.",
  },
  { slug: "gioi-thieu", status: PENDING_LEGAL },
  { slug: "lien-he", status: PENDING_LEGAL },
  { slug: "dieu-khoan", status: PENDING_LEGAL },
  { slug: "quyen-rieng-tu", status: PENDING_LEGAL },
  { slug: "ban-quyen", status: PENDING_LEGAL },
];

export type Placeholder = NavItem & { slug: string; status: string };

export const PLACEHOLDERS: readonly Placeholder[] = ENTRIES.map((entry) => ({
  ...pageByHref(`/${entry.slug}/`),
  slug: entry.slug,
  status: entry.status,
}));

export function placeholderBySlug(slug: string): Placeholder | undefined {
  return PLACEHOLDERS.find((item) => item.slug === slug);
}
