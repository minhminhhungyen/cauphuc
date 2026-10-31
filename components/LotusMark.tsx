// Biểu tượng hoa sen tự vẽ cho cauphuc.com (ghi trong data/ASSET_LICENSE_REGISTER.csv, mã ICON-001).
type Props = { className?: string; title?: string };

export function LotusMark({ className, title }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <circle cx="32" cy="32" r="31" fill="#f6f8f7" stroke="#dbe4df" strokeWidth="1.5" />
      <g fill="#b8903a">
        <path d="M32 13c6.6 7.4 8.4 16 0 30.5-8.4-14.5-6.6-23.1 0-30.5z" />
        <path d="M15.5 25.5c9.2 1 14.6 7.4 16.5 18-10.8-1.6-16.3-8.1-16.5-18z" />
        <path d="M48.5 25.5c-9.2 1-14.6 7.4-16.5 18 10.8-1.6 16.3-8.1 16.5-18z" />
      </g>
      <path d="M15 47.5h34" stroke="#006b3f" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
