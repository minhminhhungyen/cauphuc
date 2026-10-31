// Thông tin chung của trang: menu, liên kết chân trang, lời nguyện có sẵn, đơn vị vận hành.
// Chỉ dùng cú pháp TypeScript "xóa được" (không enum) để kiểm thử chạy thẳng bằng Node.

/** Tên biểu tượng tự vẽ trong components/icons.tsx. */
export type IconName =
  | "home"
  | "temple"
  | "bubble"
  | "info"
  | "guide"
  | "quote"
  | "book"
  | "listen"
  | "meditate"
  | "heart"
  | "lotus"
  | "incense"
  | "hands"
  | "shield"
  | "music"
  | "fullscreen"
  | "volume"
  | "mute"
  | "play"
  | "pause"
  | "check"
  | "chevron"
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
  // Dấu cách không ngắt ( ) giữ "bình an" và "tâm hồn" trên cùng một dòng khi tiêu đề xuống dòng.
  heroTitle: "Một chút bình\u00a0an cho tâm\u00a0hồn",
  description:
    "Giữa cuộc sống bộn bề, hãy dành một chút thời gian để lắng nghe, suy ngẫm và nuôi dưỡng những điều tốt đẹp trong tâm hồn.",
} as const;

/**
 * false = chưa lên mạng chính thức: mọi trang gắn noindex để máy tìm kiếm không lập chỉ mục trang đang dựng.
 * Chỉ đổi thành true ở module SEO, khi nội dung đã được duyệt.
 */
export const LAUNCHED = false;

/** Menu chính trên thanh đầu, đúng thứ tự và tên trong ảnh mẫu Sếp gửi (Sếp chốt 31/10/2026). */
export const PRIMARY_NAV: readonly NavItem[] = [
  { href: "/", label: "Trang chủ", description: SITE.description, icon: "home" },
  {
    href: "/khong-gian-le-phat/",
    label: "Không gian lễ Phật",
    description: "Chính điện toàn cảnh để ngồi yên vài phút, thắp hương, dâng hoa sen, chắp tay lễ Phật ngay trên máy của bạn.",
    icon: "temple",
  },
  {
    href: "/loi-nguyen/",
    label: "Lời nguyện",
    description: "Chọn một lời nguyện có sẵn và xem lại sổ lời nguyện. Sổ chỉ lưu trên máy của bạn.",
    icon: "bubble",
  },
  {
    href: "/gioi-thieu/",
    label: "Về cauphuc.com",
    description: "Mục tiêu, phạm vi và nguyên tắc của cauphuc.com.",
    icon: "info",
  },
  {
    href: "/huong-dan/",
    label: "Hướng dẫn",
    description: "Cách dùng không gian lễ Phật trên cauphuc.com trong ba bước.",
    icon: "guide",
  },
];

/** Các chuyên mục nội dung của research pack (02_product/INFORMATION_ARCHITECTURE.md). Nằm ở menu điện thoại, chân trang và cuối trang chủ. */
export const SECTIONS: readonly NavItem[] = [
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
];

/** Liên kết ở chân trang, theo ảnh mẫu, thêm trang Bản quyền của pack. */
export const INFO_LINKS: readonly NavItem[] = [
  { href: "/gioi-thieu/", label: "Giới thiệu", description: "Mục tiêu, phạm vi và nguyên tắc của cauphuc.com." },
  { href: "/dieu-khoan/", label: "Điều khoản sử dụng", description: "Điều khoản khi sử dụng cauphuc.com." },
  { href: "/quyen-rieng-tu/", label: "Chính sách riêng tư", description: "cauphuc.com thu thập và xử lý dữ liệu nào, để làm gì." },
  { href: "/huong-dan/", label: "Hướng dẫn", description: "Cách dùng không gian lễ Phật trên cauphuc.com trong ba bước." },
  { href: "/lien-he/", label: "Liên hệ", description: "Cách liên hệ với đơn vị vận hành cauphuc.com." },
  { href: "/ban-quyen/", label: "Bản quyền", description: "Cấp phép, ghi công và cách báo vi phạm bản quyền." },
];

/** Nút nổi bật trên thanh đầu (theo ảnh mẫu), dẫn tới Không gian lễ Phật. */
export const HEADER_CTA = { href: "/khong-gian-le-phat/", label: "Thắp sáng tâm an" } as const;

export type ShortcutItem = {
  href: string;
  /** Nhãn ngắn, vừa thanh đáy màn hình điện thoại. */
  label: string;
  icon: IconName;
  /** Nút tròn vàng ở giữa thanh. */
  featured?: boolean;
};

/**
 * Thanh lối tắt cố định ở đáy màn hình, chỉ hiện dưới 1024px, theo ảnh mẫu.
 * Ô "Ủng hộ" trong ảnh đổi thành "Phật pháp" vì ủng hộ đang khóa (lib/flags.ts).
 */
export const BOTTOM_NAV: readonly ShortcutItem[] = [
  { href: "/", label: "Trang chủ", icon: "home" },
  { href: "/loi-nguyen/", label: "Lời nguyện", icon: "bubble" },
  { href: "/khong-gian-le-phat/", label: "Lễ Phật", icon: "lotus", featured: true },
  { href: "/goc-phat-phap/", label: "Phật pháp", icon: "book" },
  { href: "/huong-dan/", label: "Hướng dẫn", icon: "guide" },
];

export type SpaceAction = {
  id: "thap-huong" | "dang-hoa" | "le-phat" | "loi-nguyen";
  label: string;
  /** Nhãn ngắn cho điện thoại, theo ảnh mẫu. */
  short: string;
  icon: IconName;
  tone: "amber" | "rose" | "sapphire" | "amethyst";
};

/**
 * Bốn nút nghi thức theo ảnh mẫu. Chỉ chạy trên máy người xem: không đếm lượt, không gửi đi đâu
 * (đếm lượt thắp hương đang khóa, xem lib/flags.ts).
 */
export const SPACE_ACTIONS: readonly SpaceAction[] = [
  { id: "thap-huong", label: "Thắp hương", short: "Thắp hương", icon: "incense", tone: "amber" },
  { id: "dang-hoa", label: "Dâng hoa sen", short: "Dâng hoa sen", icon: "lotus", tone: "rose" },
  { id: "le-phat", label: "Chắp tay lễ Phật", short: "Chắp tay", icon: "hands", tone: "sapphire" },
  { id: "loi-nguyen", label: "Chọn lời nguyện", short: "Lời nguyện", icon: "bubble", tone: "amethyst" },
];

export type Prayer = {
  id: string;
  text: string;
  /** Biểu tượng cảm xúc đi kèm như ảnh mẫu; chỉ để trang trí, trình đọc màn hình bỏ qua. */
  emoji?: string;
};

/**
 * Lời nguyện có sẵn, lấy đúng câu chữ trong ảnh mẫu. Không có ô gõ tự do (không chat, không nội dung người dùng).
 * Đây là lời người xem tự nguyện, không phải lời hứa của trang. Người duyệt nội dung cần xem lại trước khi lên mạng.
 */
export const PRAYERS: readonly Prayer[] = [
  { id: "nam-mo-a-di-da-phat", text: "Nam mô A Di Đà Phật", emoji: "🙏" },
  { id: "binh-an-gia-dinh", text: "Cầu bình an cho gia đình" },
  { id: "cha-me-truong-tho", text: "Cầu mong cha mẹ mạnh khỏe, trường thọ" },
  { id: "cong-viec-hanh-thong", text: "Cầu công việc thuận lợi, hanh thông" },
  { id: "tai-loc-may-man", text: "Cầu tài lộc và may mắn" },
  { id: "gia-dao-hanh-phuc", text: "Cầu gia đạo luôn hạnh phúc" },
  { id: "moi-nguoi-an-lac", text: "Nguyện cho mọi người thân tâm an lạc", emoji: "🌸" },
];

export function prayerById(id: string): Prayer | undefined {
  return PRAYERS.find((prayer) => prayer.id === id);
}

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

/** Mọi trang có trong menu và chân trang, mỗi đường dẫn một lần (lấy tên ở lần xuất hiện đầu). */
export const ALL_PAGES: readonly NavItem[] = [...PRIMARY_NAV, ...SECTIONS, ...INFO_LINKS].filter(
  (item, index, list) => list.findIndex((other) => normalizePath(other.href) === normalizePath(item.href)) === index,
);

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
