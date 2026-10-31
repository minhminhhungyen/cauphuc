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
  // Ngôi chùa hai tầng mái.
  temple: (
    <>
      <path d="M3.5 9.5c1 .3 1.8.1 2.4-.5L12 4.5 18.1 9c.6.6 1.4.8 2.4.5" />
      <path d="M5 13.5c.9.2 1.6 0 2.1-.5h9.8c.5.5 1.2.7 2.1.5" />
      <path d="M7 10v3M17 10v3M6.5 13v7h11v-7" />
      <path d="M10.3 20v-4h3.4v4M4 20h16" />
    </>
  ),
  // Bong bóng lời nói có ba chấm.
  bubble: (
    <>
      <path d="M12 4.5c4.6 0 8 2.9 8 6.5s-3.4 6.5-8 6.5c-1 0-1.9-.1-2.8-.4L5.5 19.5l1-3.4C5 14.9 4 13.1 4 11c0-3.6 3.4-6.5 8-6.5z" />
      <path d="M8.6 11h.01M12 11h.01M15.4 11h.01" strokeWidth="2.4" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.8h.01" strokeWidth="2" />
    </>
  ),
  // Trang sách có dòng chữ.
  guide: (
    <>
      <path d="M6.5 3.5h8l3 3v14h-11z" />
      <path d="M14.5 3.5v3h3M9 10.5h6M9 13.5h6M9 16.5h4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5l7 2.6v5.4c0 4.3-2.9 7.6-7 9-4.1-1.4-7-4.7-7-9V6.1z" />
      <path d="M9 12l2.2 2.2L15.5 10" />
    </>
  ),
  music: (
    <>
      <path d="M9 17.5V6.2l10-2.2v11.3" />
      <circle cx="6.8" cy="17.5" r="2.3" />
      <circle cx="16.8" cy="15.3" r="2.3" />
    </>
  ),
  fullscreen: <path d="M4 9V4.5h4.5M15.5 4.5H20V9M20 15v4.5h-4.5M8.5 19.5H4V15" />,
  volume: (
    <>
      <path d="M4.5 9.5h3l4.5-4v13l-4.5-4h-3z" />
      <path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" />
    </>
  ),
  mute: (
    <>
      <path d="M4.5 9.5h3l4.5-4v13l-4.5-4h-3z" />
      <path d="M16 9.5l5 5M21 9.5l-5 5" />
    </>
  ),
  play: <path d="M8 5.5v13l10.5-6.5z" />,
  pause: <path d="M8.5 5.5v13M15.5 5.5v13" strokeWidth="2.4" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" strokeWidth="2.2" />,
  chevron: <path d="M9.5 6l6 6-6 6" />,
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
