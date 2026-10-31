// Công tắc tính năng. Những mục false là tính năng ĐANG KHÓA cho đến khi có văn bản trả lời của luật sư
// (docs/research-pack/03_legal/LEGAL_REVIEW_GATES.md và mục 8 báo cáo Pha A). Không đổi sang true khi chưa có văn bản đó.

export const FEATURES = {
  /** Sếp chốt ngày 31/10/2026: lời nguyện được lưu, nhưng CHỈ trên máy người dùng, không gửi đi, có nút xóa. */
  prayerBookOnDevice: true,
  /** Hiển thị lời nguyện của người này cho người khác (kể cả câu chọn sẵn). */
  publicPrayers: false,
  /** Hiện những người đang truy cập (realtime). */
  presence: false,
  /** Đếm lượt thắp hương, số người đang cầu nguyện. */
  incenseCounter: false,
  /** Chat, bình luận. */
  comments: false,
  /** Đăng nhập, tài khoản, hồ sơ. */
  accounts: false,
  /** Donate, mã QR, thanh toán. */
  donations: false,
  /** Kêu gọi quyên góp từ thiện. */
  charityAppeals: false,
  /** Bảng xếp hạng, điểm thưởng. */
  leaderboards: false,
  /** Đo truy cập (analytics), cookie không thiết yếu. */
  analytics: false,
} as const;

export type FeatureName = keyof typeof FEATURES;

/** Danh sách tính năng phải luôn tắt cho tới khi có ý kiến pháp lý. Kiểm thử đơn vị kiểm danh sách này. */
export const LOCKED_FEATURES: readonly FeatureName[] = [
  "publicPrayers",
  "presence",
  "incenseCounter",
  "comments",
  "accounts",
  "donations",
  "charityAppeals",
  "leaderboards",
  "analytics",
];

export function isEnabled(name: FeatureName): boolean {
  return FEATURES[name];
}
