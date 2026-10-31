// Thông tin chung của trang: menu, liên kết chân trang, đơn vị vận hành.
// Chỉ dùng cú pháp TypeScript "xóa được" (không enum) để kiểm thử chạy thẳng bằng Node.

/** Tên biểu tượng tự vẽ trong components/icons.tsx. */
export type IconName =
  | "home"
  | "quote"
  | "book"
  | "listen"
  | "meditate"
  | "heart"
  | "lotus"
  | "incense"
  | "hands"
  | "wish"
  | "menu"
  | "close";

export type NavItem = {
  href: string;
  label: string;
  /** Một câu giới thiệu mục, dùng cho trang giữ chỗ và mô tả SEO. */
  description: string;
  icon?: IconName;
};

export const SITE = {
  name: "cauphuc.com",
  tagline: "Cùng nhau cầu bình an",
  slogan: "Cùng nhau cầu bình an – Lan tỏa lòng từ bi.",
  url: "https://cauphuc.com",
  // Dấu cách không ngắt ( ) giữ "bình an" và "tâm hồn" trên cùng một dòng khi tiêu đề xuống dòng.
  heroTitle: "Một chút bình an cho tâm hồn",
  description:
    "Giữa cuộc sống bộn bề, hãy dành một chút thời gian để lắng nghe, suy ngẫm và nuôi dưỡng những điều tốt đẹp trong tâm hồn.",
} as const;

/**
 * false = chưa lên mạng chính thức: mọi trang gắn noindex để máy tìm kiếm không lập chỉ mục trang đang dựng.
 * Chỉ đổi thành true ở module SEO, khi nội dung đã được duyệt.
 */
export const LAUNCHED = false;

/** Menu chính, đúng thứ tự trong docs/research-pack/02_product/INFORMATION_ARCHITECTURE.md. */
export const NAV: readonly NavItem[] = [
  { href: "/", label: "Trang chủ", description: SITE.description, icon: "home" },
  {
    href: "/loi-hay-moi-ngay/",
    label: "Lời hay mỗi ngày",
    description: "Mỗi ngày một câu để suy ngẫm, có ghi rõ nguồn.",
    icon: "quote",
  },
  {
    href: "/goc-phat-phap/",
    label: "Góc Phật pháp",
    description: "Những bài nền tảng về Phật pháp ứng dụng trong đời sống hằng ngày.",
    icon: "book",
  },
  {
    href: "/nghe-de-tam-an/",
    label: "Nghe để tâm an",
    description: "Tiếng chuông, tiếng mõ, âm thanh thiên nhiên và bài đọc để lắng tâm. Chỉ phát khi bạn bấm nghe.",
    icon: "listen",
  },
  {
    href: "/thien-va-tinh-tam/",
    label: "Thiền và tĩnh tâm",
    description: "Bài thiền 5, 10, 15 phút có hướng dẫn thở, chuông báo đầu và cuối.",
    icon: "meditate",
  },
  {
    href: "/song-tot-song-thien/",
    label: "Sống tốt – Sống thiện",
    description: "Câu chuyện về lòng biết ơn, sự nhẫn nhịn và lòng từ bi trong đời thường.",
    icon: "heart",
  },
  {
    href: "/khong-gian-binh-an/",
    label: "Không gian bình an",
    description: "Một chính điện tĩnh lặng để ngồi yên vài phút và thắp nén tâm hương ngay trên máy của bạn.",
    icon: "lotus",
  },
];

/** Nút nổi bật trên thanh đầu (theo ảnh thiết kế), dẫn tới Không gian bình an. */
export const HEADER_CTA = { href: "/khong-gian-binh-an/", label: "Thắp sáng tâm an" } as const;

export type ShortcutItem = {
  href: string;
  /** Nhãn ngắn, vừa thanh đáy màn hình điện thoại. */
  label: string;
  icon: IconName;
  /** Nút tròn vàng ở giữa thanh. */
  featured?: boolean;
};

/** Thanh lối tắt cố định ở đáy màn hình, chỉ hiện dưới 1024px. Mọi đường dẫn phải có trong NAV. */
export const BOTTOM_NAV: readonly ShortcutItem[] = [
  { href: "/", label: "Trang chủ", icon: "home" },
  { href: "/goc-phat-phap/", label: "Phật pháp", icon: "book" },
  { href: "/khong-gian-binh-an/", label: "Lễ Phật", icon: "lotus", featured: true },
  { href: "/nghe-de-tam-an/", label: "Nghe", icon: "listen" },
  { href: "/thien-va-tinh-tam/", label: "Thiền", icon: "meditate" },
];

export type SpaceAction = {
  /** Mã neo trên trang Không gian bình an (module 6 dùng làm id của từng phần). */
  id: string;
  label: string;
  icon: IconName;
  tone: "amber" | "rose" | "sapphire" | "amethyst";
};

/**
 * Bốn nghi thức ở Không gian bình an, theo ảnh thiết kế.
 * Chỉ chạy trên máy người dùng: không đếm lượt, không gửi đi đâu (đếm lượt thắp hương đang khóa, xem lib/flags.ts).
 */
export const SPACE_ACTIONS: readonly SpaceAction[] = [
  { id: "thap-huong", label: "Thắp hương", icon: "incense", tone: "amber" },
  { id: "dang-hoa", label: "Dâng hoa sen", icon: "lotus", tone: "rose" },
  { id: "le-phat", label: "Chắp tay lễ Phật", icon: "hands", tone: "sapphire" },
  { id: "loi-nguyen", label: "Lời nguyện", icon: "wish", tone: "amethyst" },
];

/** Liên kết thông tin ở chân trang và trong menu điện thoại. */
export const INFO_LINKS: readonly NavItem[] = [
  { href: "/gioi-thieu/", label: "Giới thiệu", description: "Mục tiêu, phạm vi và nguyên tắc biên tập của cauphuc.com." },
  { href: "/lien-he/", label: "Liên hệ", description: "Cách liên hệ với đơn vị vận hành cauphuc.com." },
  { href: "/dieu-khoan/", label: "Điều khoản sử dụng", description: "Điều khoản khi sử dụng cauphuc.com." },
  { href: "/quyen-rieng-tu/", label: "Quyền riêng tư", description: "cauphuc.com thu thập và xử lý dữ liệu nào, để làm gì." },
  { href: "/ban-quyen/", label: "Bản quyền", description: "Cấp phép, ghi công và cách báo vi phạm bản quyền." },
];

/** Đơn vị vận hành. Mặc định theo báo cáo Pha A; Sếp có thể đổi. Phải thống nhất ở mọi trang. */
export const OPERATOR = {
  name: "Công ty TNHH Minh Minh Hưng Yên",
  legalName: "CÔNG TY TNHH MINH MINH HƯNG YÊN",
  taxCode: "0901197922",
  address: "Đường Huyện Đội, Thôn Trai Trang, Xã Yên Mỹ, Tỉnh Hưng Yên",
  phone: "0368 386 357",
  email: "minhminhhungyenco.ltd@gmail.com",
} as const;

export const INDEPENDENCE_NOTE =
  "Dự án độc lập, không phải chùa, không phải tổ chức tôn giáo và không đại diện cho tổ chức tôn giáo nào.";

/** Mọi trang có trong menu và chân trang. */
export const ALL_PAGES: readonly NavItem[] = [...NAV, ...INFO_LINKS];

/** Lấy mục theo đường dẫn; báo lỗi ngay lúc build nếu gõ sai đường dẫn. */
export function pageByHref(href: string): NavItem {
  const target = normalizePath(href);
  const found = ALL_PAGES.find((item) => normalizePath(item.href) === target);
  if (!found) throw new Error(`Không có trang ${href} trong lib/site.ts`);
  return found;
}

/** Chuẩn hóa đường dẫn: luôn có "/" ở đầu và cuối (khớp trailingSlash trong next.config.ts). */
export function normalizePath(path: string): string {
  const clean = (path.split(/[?#]/)[0] || "/").trim();
  const withLead = clean.startsWith("/") ? clean : `/${clean}`;
  return withLead.endsWith("/") ? withLead : `${withLead}/`;
}

/** Mục menu có đang được xem không. Trang chủ chỉ khớp đúng "/". */
export function isActive(pathname: string | null | undefined, href: string): boolean {
  if (!pathname) return false;
  const current = normalizePath(pathname);
  const target = normalizePath(href);
  if (target === "/") return current === "/";
  return current === target || current.startsWith(target);
}
