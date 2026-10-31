// Biểu tượng hoa sen tự vẽ cho cauphuc.com (data/ASSET_LICENSE_REGISTER.csv, mã ICON-001), bản tông đêm – vàng kim.
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
      <circle cx="32" cy="32" r="30.5" fill="#121a35" stroke="#e8b65c" strokeOpacity="0.6" strokeWidth="1.5" />
      <g fill="#c9913a">
        <path d="M9.5 35.5c6.2-.3 12.2 3 16 8.6-6.8.9-12.6-2.2-16-8.6z" />
        <path d="M54.5 35.5c-6.2-.3-12.2 3-16 8.6 6.8.9 12.6-2.2 16-8.6z" />
      </g>
      <g fill="#e8b65c">
        <path d="M15.5 25.5c9.2 1 14.6 7.4 16.5 18-10.8-1.6-16.3-8.1-16.5-18z" />
        <path d="M48.5 25.5c-9.2 1-14.6 7.4-16.5 18 10.8-1.6 16.3-8.1 16.5-18z" />
      </g>
      <path d="M32 13c6.6 7.4 8.4 16 0 30.5-8.4-14.5-6.6-23.1 0-30.5z" fill="#f6d58e" />
      <path d="M17 48h30" stroke="#e8b65c" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
