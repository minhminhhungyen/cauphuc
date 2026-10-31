import type { ReactNode } from "react";
import type { IconName } from "@/lib/site";

// Bộ biểu tượng nét mảnh tự vẽ cho cauphuc.com (data/ASSET_LICENSE_REGISTER.csv, mã ICON-002).
// Khung 24×24, nét theo màu chữ (currentColor) để đổi màu bằng class.
const PATHS: Record<IconName, ReactNode> = {
  // Mái chùa có đầu đao cong.
  home: (
    <>
      <path d="M2.5 9.6c1.2.4 2.2.3 3-.4L12 4l6.5 5.2c.8.7 1.8.8 3 .4" />
      <path d="M5.5 9.9V20h13V9.9" />
      <path d="M10 20v-5.5h4V20" />
    </>
  ),
  quote: (
    <>
      <path d="M9.6 6.8C6.7 7.6 5 9.9 5 13.4V17h4.2v-4.2H5.3" />
      <path d="M18.8 6.8c-2.9.8-4.6 3.1-4.6 6.6V17h4.2v-4.2h-3.9" />
    </>
  ),
  book: (
    <>
      <path d="M12 6.8C10.2 5.5 7.6 4.8 4 4.8v12.6c3.6 0 6.2.7 8 2 1.8-1.3 4.4-2 8-2V4.8c-3.6 0-6.2.7-8 2z" />
      <path d="M12 6.8v12.6" />
    </>
  ),
  listen: (
    <>
      <path d="M4.5 15v-3a7.5 7.5 0 0 1 15 0v3" />
      <path d="M4.5 14.5H7a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1z" />
      <path d="M19.5 14.5H17a1 1 0 0 0-1 1V19a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1z" />
    </>
  ),
  // Người ngồi thiền.
  meditate: (
    <>
      <circle cx="12" cy="5.6" r="2.1" />
      <path d="M8.6 15.2c0-3.6 1.5-6.4 3.4-6.4s3.4 2.8 3.4 6.4" />
      <path d="M4.5 19.5c2.1-1.7 4.6-2.6 7.5-2.6s5.4.9 7.5 2.6" />
      <path d="M8.8 13.6c1 .9 2 1.3 3.2 1.3s2.2-.4 3.2-1.3" />
    </>
  ),
  heart: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />,
  lotus: (
    <>
      <path d="M12 5c2.1 2.3 2.9 5.2 0 9.8-2.9-4.6-2.1-7.5 0-9.8z" />
      <path d="M12 14.8c-.4-3.7-2.6-6.2-6.8-6.8.2 3.9 2.5 6.3 6.8 6.8z" />
      <path d="M12 14.8c.4-3.7 2.6-6.2 6.8-6.8-.2 3.9-2.5 6.3-6.8 6.8z" />
      <path d="M4.5 18.5h15" />
    </>
  ),
  // Bát hương với ba nén nhang và làn khói.
  incense: (
    <>
      <path d="M5.5 14.5h13l-1.3 3.6a2 2 0 0 1-1.9 1.4H8.7a2 2 0 0 1-1.9-1.4z" />
      <path d="M9.5 14.5V9M12 14.5V8M14.5 14.5V9" />
      <path d="M12 5.6c-1-.8-1-1.8 0-2.6" />
    </>
  ),
  // Hai bàn tay chắp lại.
  hands: (
    <>
      <path d="M11.6 3.8c-.8.2-1.3 1-1.3 1.9v5.6L7.4 15a2 2 0 0 0 .3 2.6l1.8 1.6" />
      <path d="M12.4 3.8c.8.2 1.3 1 1.3 1.9v5.6l2.9 3.7a2 2 0 0 1-.3 2.6l-1.8 1.6" />
      <path d="M12 4.2v12.3" />
      <path d="M9 20.5h6" />
    </>
  ),
  // Đèn hoa đăng: ngọn lửa trên đài sen, dùng cho lời nguyện.
  wish: (
    <>
      <path d="M12 3.5c1.6 1.8 2.2 3.4 1.5 4.8-.4.9-1 1.3-1.5 1.3s-1.1-.4-1.5-1.3c-.7-1.4-.1-3 1.5-4.8z" />
      <path d="M12 19c-3.3-.1-6-1.6-7.5-4.2 2.6-.4 5.2.4 7.5 2.6 2.3-2.2 4.9-3 7.5-2.6C18 17.4 15.3 18.9 12 19z" />
      <path d="M12 17.2c-1.3-1.5-1.7-3.1-.9-4.9h1.8c.8 1.8.4 3.4-.9 4.9z" />
      <path d="M5 21.5h14" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
};

type Props = { name: IconName; className?: string };

export function Icon({ name, className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
