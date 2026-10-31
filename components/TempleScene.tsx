import type { CSSProperties } from "react";
import styles from "./TempleScene.module.css";

/*
  Tranh "chính điện về đêm" tự vẽ bằng SVG cho trang chủ (data/ASSET_LICENSE_REGISTER.csv, mã ART-001).
  - Không dùng hai ảnh thiết kế Sếp gửi (chưa rõ nguồn), chỉ lấy tinh thần: đêm, vàng kim, hoa sen, chính điện.
  - Tượng Phật dựng lại từ bản thử canvas ngày 31/10 (prototypes/chinh-dien-v0.html).
  - Người đi lễ trong tranh chỉ để trang trí, số lượng cố định, không phải người đang truy cập
    (tính năng hiện người truy cập đang khóa, xem lib/flags.ts).
  Khung 2000×900. Chính điện đặt ở x = 1240 (62% chiều ngang) để chừa chỗ cho chữ bên trái trên màn hình rộng;
  CSS trong app/globals.css (.hero-scene) đưa chính điện vào giữa trên điện thoại.
*/

const W = 2000;
const TX = 1240; // trục giữa chính điện

const r1 = (n: number) => Math.round(n * 10) / 10;

// Số ngẫu nhiên có hạt giống: lần build nào cũng ra cùng một bầu trời.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STARS = (() => {
  const rand = seeded(20261031);
  return Array.from({ length: 96 }, (_, i) => ({
    x: r1(rand() * W),
    y: r1(Math.pow(rand(), 1.5) * 440),
    r: r1(0.6 + rand() * 1.5),
    o: r1(0.35 + rand() * 0.6),
    twinkle: i % 4 === 0,
    delay: r1(-rand() * 6),
  }));
})();

// Sao đứng yên gộp thành 3 đường (theo độ sáng) cho trang nhẹ; sao lấp lánh để riêng từng ngôi.
const dot = (x: number, y: number, r: number) => `M${r1(x - r)} ${y}a${r} ${r} 0 1 0 ${r1(2 * r)} 0a${r} ${r} 0 1 0 ${r1(-2 * r)} 0`;
const STILL_STARS = [0.45, 0.65, 0.85].map((opacity, band) => ({
  opacity,
  d: STARS.filter((s) => !s.twinkle && Math.min(2, Math.floor((s.o - 0.35) / 0.2)) === band)
    .map((s) => dot(s.x, s.y, s.r))
    .join(""),
}));
const TWINKLE_STARS = STARS.filter((s) => s.twinkle);

/** Vẽ lại một hình đã định nghĩa trong <defs> ở chỗ khác, với tỉ lệ s. */
function Reuse({ id, x, y, s = 1 }: { id: string; x: number; y: number; s?: number }) {
  return <use href={`#${id}`} transform={s === 1 ? `translate(${x} ${y})` : `translate(${x} ${y}) scale(${s})`} />;
}

const delay = (seconds: number, duration?: number): CSSProperties => ({
  animationDelay: `${seconds}s`,
  ...(duration ? { animationDuration: `${duration}s` } : {}),
});

/** Cánh sen cong, đáy rộng w, cao h, đáy ở (x, y). Cùng công thức với bản thử canvas. */
function petal(x: number, y: number, w: number, h: number) {
  return `M${r1(x - w / 2)} ${y}C${r1(x - w / 2)} ${r1(y - h * 0.6)} ${r1(x - w * 0.15)} ${y - h} ${x} ${y - h}C${r1(x + w * 0.15)} ${y - h} ${r1(x + w / 2)} ${r1(y - h * 0.6)} ${r1(x + w / 2)} ${y}Z`;
}

/** Lá sen nhìn nghiêng: hình elip có khía. */
function lilyPad(cx: number, cy: number, rx: number, ry: number, notch: number) {
  const a1 = ((notch - 12) * Math.PI) / 180;
  const a2 = ((notch + 12) * Math.PI) / 180;
  const p = (a: number) => `${r1(cx + rx * Math.cos(a))} ${r1(cy + ry * Math.sin(a))}`;
  return `M${cx} ${cy}L${p(a2)}A${rx} ${ry} 0 1 1 ${p(a1)}Z`;
}

/** Các hình lặp lại nhiều lần (sen, nụ sen, hoa đào): định nghĩa một lần ở gốc toạ độ, vẽ lại bằng <use>. */
function SharedShapes() {
  return (
    <>
      {/* Hoa sen nở, đáy ở (0, 0), cao khoảng 34. */}
      <g id="ts-lotus">
        <ellipse cx="0" cy="-14" rx="40" ry="28" fill="url(#ts-cglow)" opacity="0.35" />
        {[-64, -34, 0, 34, 64].map((a) => (
          <path key={`b${a}`} d="M0 0C-10 -9 -9 -25 0 -34C9 -25 10 -9 0 0Z" transform={`rotate(${a})`} fill="url(#ts-petal-b)" />
        ))}
        {[-38, 0, 38].map((a) => (
          <path key={`f${a}`} d="M0 0C-8 -7 -7 -20 0 -27C7 -20 8 -7 0 0Z" transform={`rotate(${a})`} fill="url(#ts-petal-f)" />
        ))}
        <ellipse cx="0" cy="-5" rx="6" ry="2.6" fill="#f7d26b" />
      </g>
      {/* Nụ sen trên cuống, gốc cuống ở (0, 0), cao 28. */}
      <g id="ts-bud">
        <path d="M0 0C-4 -14 6 -19.6 3 -28" stroke="#2f5d43" strokeWidth="2.2" fill="none" />
        <path d={petal(3, -26, 14, 24)} fill="url(#ts-petal-b)" />
        <path d={petal(3, -26, 8, 20)} fill="url(#ts-petal-f)" opacity="0.9" />
      </g>
      {/* Hoa đào năm cánh, tâm ở (0, 0), bán kính 10. */}
      <g id="ts-blossom">
        <g fill="#f6b2c6">
          {[0, 72, 144, 216, 288].map((a) => {
            const rad = ((a - 90) * Math.PI) / 180;
            return <circle key={a} cx={r1(Math.cos(rad) * 5.2)} cy={r1(Math.sin(rad) * 5.2)} r="5" />;
          })}
        </g>
        <circle r="2.6" fill="#b8406a" />
        <circle cx="-3" cy="-3.2" r="1.6" fill="#ffe3ec" opacity="0.8" />
      </g>
    </>
  );
}

function Pilgrim({ x, y, s = 1, bun = false }: { x: number; y: number; s?: number; bun?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="1" rx="22" ry="4" fill="#000" opacity="0.35" />
      <path d="M-18 0C-19.5 -12 -15.5 -24 -9.5 -30.5C-6.5 -33.5 6.5 -33.5 9.5 -30.5C15.5 -24 19.5 -12 18 0Z" fill="#110d1b" />
      <circle cx="0" cy="-39" r="7.5" fill="#110d1b" />
      {bun ? <circle cx="0" cy="-46.5" r="3.4" fill="#110d1b" /> : null}
      {/* viền sáng mảnh trên đầu và vai: ánh đèn chính điện hắt từ phía trước */}
      <path
        d="M-15.5 -24C-13.5 -27.5 -11.5 -29.5 -9.5 -30.5C-6.5 -33.5 6.5 -33.5 9.5 -30.5C11.5 -29.5 13.5 -27.5 15.5 -24M-6.6 -42.5A7.5 7.5 0 0 1 6.6 -42.5"
        fill="none"
        stroke="#f2c57c"
        strokeOpacity="0.8"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </g>
  );
}

function HangingLantern({ x, y, d }: { x: number; y: number; d: number }) {
  return (
    <g className={styles.sway} style={delay(d)}>
      <line x1={x} y1={y} x2={x} y2={y + 24} stroke="#b98a3d" strokeWidth="2" />
      <circle cx={x} cy={y + 52} r="58" fill="url(#ts-lglow)" className={styles.glow} style={delay(d)} />
      <rect x={x - 10} y={y + 24} width="20" height="7" rx="2" fill="#d9a446" />
      <ellipse cx={x} cy={y + 52} rx="18" ry="23" fill="url(#ts-lantern)" />
      <ellipse cx={x} cy={y + 52} rx="7" ry="23" fill="none" stroke="#3c0a05" strokeOpacity="0.35" />
      <ellipse cx={x} cy={y + 52} rx="13" ry="23" fill="none" stroke="#3c0a05" strokeOpacity="0.3" />
      <rect x={x - 10} y={y + 73} width="20" height="7" rx="2" fill="#d9a446" />
      <path d={`M${x} ${y + 80}v24`} stroke="#e0503a" strokeWidth="2.6" strokeLinecap="round" />
    </g>
  );
}

function StoneLantern({ x, base, d }: { x: number; base: number; d: number }) {
  return (
    <g>
      <circle cx={x} cy={base - 85} r="52" fill="url(#ts-cglow)" className={styles.glow} style={delay(d)} />
      <path d={`M${x - 30} ${base}L${x - 24} ${base - 16}H${x + 24}L${x + 30} ${base}Z`} fill="url(#ts-stone)" />
      <rect x={x - 8} y={base - 58} width="16" height="42" fill="url(#ts-stone)" />
      <rect x={x - 24} y={base - 68} width="48" height="10" rx="2" fill="url(#ts-stone)" />
      <rect x={x - 18} y={base - 102} width="36" height="34" fill="url(#ts-stone)" />
      <rect x={x - 10} y={base - 96} width="20" height="22" rx="2" fill="#ffd58a" className={styles.glow} style={delay(d + 1.2)} />
      <path
        d={`M${x - 38} ${base - 100}Q${x - 20} ${base - 108} ${x} ${base - 110}Q${x + 20} ${base - 108} ${x + 38} ${base - 100}L${x + 28} ${base - 114}Q${x} ${base - 130} ${x - 28} ${base - 114}Z`}
        fill="url(#ts-stone)"
      />
      <circle cx={x} cy={base - 132} r="6" fill="url(#ts-stone)" />
    </g>
  );
}

/** Tượng Phật ngồi thiền trên đài sen. Toạ độ gốc của bản thử canvas (tâm x = 300, đáy đài sen y = 432). */
function Buddha() {
  const cx = 300;
  return (
    <g>
      {/* hào quang sau lưng */}
      <circle cx="300" cy="238" r="250" fill="url(#ts-b-halo)" />
      <path d="M300 74C492 150 470 360 452 432L148 432C130 360 108 150 300 74Z" fill="none" stroke="#f0c878" strokeOpacity="0.3" strokeWidth="2.4" />
      <circle cx="300" cy="186" r="66" fill="url(#ts-b-headglow)" />
      <circle cx="300" cy="186" r="56" fill="none" stroke="#f4ce80" strokeOpacity="0.55" strokeWidth="1.6" />
      <circle cx="300" cy="186" r="62" fill="none" stroke="#f4ce80" strokeOpacity="0.4" strokeWidth="1.6" />
      {/* đài sen hàng sau */}
      {Array.from({ length: 9 }, (_, i) => (
        <path key={`pb${i}`} d={petal(cx + (i - 4) * 31, 426, 34, 30)} fill="url(#ts-b-petal-back)" stroke="#5a370f" strokeOpacity="0.35" />
      ))}
      {/* chân xếp bằng */}
      <path d="M172 398C170 360 220 342 300 344C380 342 430 360 428 398C380 410 220 410 172 398Z" fill="url(#ts-b-lap)" />
      {/* thân */}
      <path
        d="M284 226C260 230 238 236 230 252C216 282 214 322 226 350C260 360 340 360 374 350C386 322 384 282 370 252C362 236 340 230 316 226Z"
        fill="url(#ts-b-body)"
      />
      <path
        d="M284 226C260 230 238 236 230 252C216 282 214 322 226 350C260 360 340 360 374 350C386 322 384 282 370 252C362 236 340 230 316 226Z"
        fill="url(#ts-b-sheen)"
      />
      <g fill="none" stroke="#6e4614" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round">
        <path d="M330 232C310 270 270 300 242 338" />
        <path d="M240 372C280 384 320 384 360 372" />
        <path d="M202 390C260 401 340 401 398 390" />
      </g>
      {/* đài sen hàng trước */}
      {Array.from({ length: 8 }, (_, i) => (
        <path key={`pf${i}`} d={petal(cx + (i - 3.5) * 33, 432, 36, 32)} fill="url(#ts-b-petal-front)" stroke="#5a370f" strokeOpacity="0.35" />
      ))}
      {/* tay kết ấn thiền */}
      <ellipse cx="300" cy="338" rx="28" ry="9.5" fill="#dcaa52" stroke="#784e18" strokeOpacity="0.5" strokeWidth="1.5" />
      <path d="M278 337Q300 331 322 337" fill="none" stroke="#f6d690" strokeOpacity="0.6" strokeWidth="1.4" strokeLinecap="round" />
      <rect x="288" y="210" width="24" height="22" fill="#e2b25a" />
      <ellipse cx="265" cy="194" rx="6" ry="18" transform="rotate(-4.6 265 194)" fill="#d9a446" />
      <ellipse cx="335" cy="194" rx="6" ry="18" transform="rotate(4.6 335 194)" fill="#d9a446" />
      <ellipse cx="300" cy="190" rx="33" ry="39" fill="url(#ts-b-face)" />
      <g clipPath="url(#ts-head-clip)">
        <ellipse cx="300" cy="150" rx="42" ry="27" fill="#7a5418" />
        {/* tóc xoắn ốc: hoa văn chấm lặp lại */}
        <rect x="262" y="149" width="76" height="30" fill="url(#ts-curls)" />
      </g>
      <ellipse cx="300" cy="147" rx="14" ry="12" fill="#7a5418" />
      <g fill="none" stroke="#5f3a0e" strokeOpacity="0.6" strokeLinecap="round">
        <path d="M306 192Q312 195 318 192M294 192Q288 195 282 192" strokeWidth="1.6" />
        <path d="M305 183Q312 178 320 182M295 183Q288 178 280 182" strokeWidth="1.2" />
        <path d="M300 188L298 203L302 204" strokeWidth="1.2" />
        <path d="M294 213Q300 216 306 213" strokeWidth="1.2" />
      </g>
      <circle cx="300" cy="178" r="1.7" fill="#5f3a0e" fillOpacity="0.65" />
      {/* bệ */}
      <rect x="176" y="432" width="248" height="22" fill="url(#ts-b-plinth)" />
      <rect x="176" y="432" width="248" height="3" fill="#c99a45" />
      <rect x="176" y="451" width="248" height="2" fill="#c99a45" />
    </g>
  );
}

function rays(cx: number, cy: number, count: number, radius: number, halfWidthDeg: number) {
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i * 360) / count;
    const p = (deg: number) => {
      const rad = (deg * Math.PI) / 180;
      return `${r1(cx + radius * Math.cos(rad))} ${r1(cy + radius * Math.sin(rad))}`;
    };
    parts.push(`M${cx} ${cy}L${p(a - halfWidthDeg)}L${p(a + halfWidthDeg)}Z`);
  }
  return parts.join("");
}

function towerPath(x: number, base: number, tiers: number, w0: number, tierH: number) {
  let d = "";
  for (let i = 0; i < tiers; i++) {
    const top = base - (i + 1) * tierH;
    const w = w0 * (1 - i * 0.09);
    d += `M${r1(x - w * 0.36)} ${base - i * tierH}V${top + 8}H${r1(x + w * 0.36)}V${base - i * tierH}Z`;
    d += `M${r1(x - w / 2)} ${top + 10}Q${x} ${top + 4} ${r1(x + w / 2)} ${top + 10}L${r1(x + w * 0.38)} ${top}Q${x} ${top - 4} ${r1(x - w * 0.38)} ${top}Z`;
  }
  const peak = base - tiers * tierH;
  d += `M${x - 2.5} ${peak}V${peak - 34}H${x + 2.5}V${peak}Z`;
  return d;
}

function towerWindows(x: number, base: number, tiers: number, tierH: number) {
  return Array.from({ length: tiers }, (_, i) => i)
    .filter((i) => i % 2 === 0 && i < tiers - 1)
    .map((i) => ({ x: x - 3, y: base - (i + 1) * tierH + 14 }));
}

// Đường cong viền mái (dùng chung cho mái và đường viền vàng).
const LOWER_EAVE = "M914 352Q930 380 962 386Q1240 402 1518 386Q1550 380 1566 352";
const UPPER_EAVE = "M1010 248Q1024 270 1050 276Q1240 290 1430 276Q1456 270 1470 248";

export function TempleScene({ className }: { className?: string }) {
  const valance = (() => {
    let d = "M1100 398H1380V410";
    for (let k = 0; k < 7; k++) {
      const x0 = 1380 - 40 * k;
      d += `Q${x0 - 20} 426 ${x0 - 40} 410`;
    }
    return `${d}Z`;
  })();

  const lowerTiles = Array.from({ length: 16 }, (_, i) => 1074 + i * 22).map((x) => `M${x} 320L${r1(x + (x - TX) * 0.12)} 392`);
  const upperTiles = Array.from({ length: 12 }, (_, i) => 1130 + i * 20).map((x) => `M${x} 218L${r1(x + (x - TX) * 0.1)} 282`);

  return (
    <svg
      viewBox="0 0 2000 900"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Tranh vẽ chính điện về đêm: tượng Phật tỏa hào quang trong chùa, đèn lồng, lư trầm tỏa khói, hồ sen dưới trăng."
      className={[styles.scene, className].filter(Boolean).join(" ")}
    >
      <defs>
        <linearGradient id="ts-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#03060f" />
          <stop offset="0.38" stopColor="#0a1230" />
          <stop offset="0.72" stopColor="#1a1c46" />
          <stop offset="1" stopColor="#2a2452" />
        </linearGradient>
        <radialGradient id="ts-warm" gradientUnits="userSpaceOnUse" cx="1240" cy="520" r="720">
          <stop offset="0" stopColor="#ffc46e" stopOpacity="0.42" />
          <stop offset="0.35" stopColor="#e89646" stopOpacity="0.16" />
          <stop offset="1" stopColor="#e89646" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ts-moonglow">
          <stop offset="0" stopColor="#ffecbe" stopOpacity="0.34" />
          <stop offset="1" stopColor="#ffecbe" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ts-moon" cx="0.42" cy="0.4" r="0.62">
          <stop offset="0" stopColor="#fffaea" />
          <stop offset="0.7" stopColor="#f5e3b3" />
          <stop offset="1" stopColor="#dcc184" />
        </radialGradient>
        <linearGradient id="ts-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b4aadc" stopOpacity="0" />
          <stop offset="0.5" stopColor="#b4aadc" stopOpacity="0.09" />
          <stop offset="1" stopColor="#b4aadc" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ts-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#352b52" />
          <stop offset="1" stopColor="#171126" />
        </linearGradient>
        <linearGradient id="ts-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4c1813" />
          <stop offset="1" stopColor="#290b09" />
        </linearGradient>
        <linearGradient id="ts-pillar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4a0f0a" />
          <stop offset="0.4" stopColor="#a3301d" />
          <stop offset="0.65" stopColor="#87210f" />
          <stop offset="1" stopColor="#4a0f0a" />
        </linearGradient>
        <radialGradient id="ts-bay" gradientUnits="userSpaceOnUse" cx="1240" cy="480" r="240" fx="1240" fy="450">
          <stop offset="0" stopColor="#fff3cf" />
          <stop offset="0.3" stopColor="#ffd47e" />
          <stop offset="0.62" stopColor="#e0913e" />
          <stop offset="1" stopColor="#6e2c12" />
        </radialGradient>
        <radialGradient id="ts-side" cx="0.5" cy="0.4" r="0.75">
          <stop offset="0" stopColor="#c26a2c" />
          <stop offset="1" stopColor="#3a150c" />
        </radialGradient>
        <radialGradient id="ts-window">
          <stop offset="0" stopColor="#ffe6a6" />
          <stop offset="1" stopColor="#c8742c" />
        </radialGradient>
        <radialGradient id="ts-orb" cx="0.4" cy="0.35" r="0.65">
          <stop offset="0" stopColor="#fff3c8" />
          <stop offset="1" stopColor="#e2992f" />
        </radialGradient>
        <linearGradient id="ts-bronze" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4f3210" />
          <stop offset="0.45" stopColor="#d8a74d" />
          <stop offset="1" stopColor="#4a2f0f" />
        </linearGradient>
        <linearGradient id="ts-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4b4663" />
          <stop offset="1" stopColor="#23203a" />
        </linearGradient>
        <linearGradient id="ts-stone-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c2742" />
          <stop offset="1" stopColor="#16131f" />
        </linearGradient>
        <linearGradient id="ts-terrace" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2a2440" />
          <stop offset="0.5" stopColor="#58465f" />
          <stop offset="1" stopColor="#2a2440" />
        </linearGradient>
        <linearGradient id="ts-step" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#353048" />
          <stop offset="1" stopColor="#1d1a2e" />
        </linearGradient>
        <linearGradient id="ts-court" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d1b34" />
          <stop offset="1" stopColor="#0f0f20" />
        </linearGradient>
        <linearGradient id="ts-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffc878" stopOpacity="0.24" />
          <stop offset="1" stopColor="#ffc878" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ts-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#111b3e" />
          <stop offset="1" stopColor="#070b1d" />
        </linearGradient>
        <linearGradient id="ts-lantern" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6d150d" />
          <stop offset="0.5" stopColor="#e5502f" />
          <stop offset="1" stopColor="#6d150d" />
        </linearGradient>
        <radialGradient id="ts-lglow">
          <stop offset="0" stopColor="#ff8a4a" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ff8a4a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ts-cglow">
          <stop offset="0" stopColor="#ffd68c" stopOpacity="0.6" />
          <stop offset="1" stopColor="#ffd68c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ts-petal-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f9c6d5" />
          <stop offset="1" stopColor="#cf5f84" />
        </linearGradient>
        <linearGradient id="ts-petal-f" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3f6" />
          <stop offset="1" stopColor="#f19ab6" />
        </linearGradient>
        <radialGradient id="ts-pad" cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#2f6a4c" />
          <stop offset="1" stopColor="#14342a" />
        </radialGradient>
        <radialGradient id="ts-vignette" gradientUnits="userSpaceOnUse" cx="1240" cy="470" r="1250">
          <stop offset="0.55" stopColor="#03050e" stopOpacity="0" />
          <stop offset="1" stopColor="#03050e" stopOpacity="0.7" />
        </radialGradient>
        <linearGradient id="ts-smoke-fade" gradientUnits="userSpaceOnUse" x1="0" y1="712" x2="0" y2="470">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="ts-smoke-mask" maskUnits="userSpaceOnUse" x="1100" y="460" width="280" height="260">
          <rect x="1100" y="460" width="280" height="260" fill="url(#ts-smoke-fade)" />
        </mask>
        <filter id="ts-soft" x="-50%" y="-20%" width="200%" height="140%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <clipPath id="ts-bay-clip">
          <rect x="1100" y="398" width="280" height="242" />
        </clipPath>

        {/* Màu tượng Phật, toạ độ gốc của bản thử canvas */}
        <linearGradient id="ts-b-body" gradientUnits="userSpaceOnUse" x1="0" y1="226" x2="0" y2="356">
          <stop offset="0" stopColor="#f6d690" />
          <stop offset="0.45" stopColor="#d9a446" />
          <stop offset="1" stopColor="#8f5f1f" />
        </linearGradient>
        <linearGradient id="ts-b-lap" gradientUnits="userSpaceOnUse" x1="0" y1="330" x2="0" y2="404">
          <stop offset="0" stopColor="#f6d690" />
          <stop offset="0.45" stopColor="#d9a446" />
          <stop offset="1" stopColor="#8f5f1f" />
        </linearGradient>
        <radialGradient id="ts-b-sheen" gradientUnits="userSpaceOnUse" cx="282" cy="272" r="80">
          <stop offset="0" stopColor="#fff0c8" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff0c8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ts-b-face" gradientUnits="userSpaceOnUse" cx="300" cy="190" r="46" fx="292" fy="180">
          <stop offset="0" stopColor="#fbe2a6" />
          <stop offset="0.6" stopColor="#e2b25a" />
          <stop offset="1" stopColor="#b07a2c" />
        </radialGradient>
        <radialGradient id="ts-b-halo" gradientUnits="userSpaceOnUse" cx="300" cy="238" r="250">
          <stop offset="0" stopColor="#ffdc96" stopOpacity="0.6" />
          <stop offset="0.45" stopColor="#e6a546" stopOpacity="0.22" />
          <stop offset="1" stopColor="#e6a546" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ts-b-headglow" gradientUnits="userSpaceOnUse" cx="300" cy="186" r="66">
          <stop offset="0" stopColor="#ffe6aa" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffe6aa" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ts-b-petal-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e7b45a" />
          <stop offset="1" stopColor="#9b6522" />
        </linearGradient>
        <linearGradient id="ts-b-petal-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2c870" />
          <stop offset="1" stopColor="#a8702a" />
        </linearGradient>
        <linearGradient id="ts-b-plinth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7c1d12" />
          <stop offset="1" stopColor="#4d110b" />
        </linearGradient>
        <clipPath id="ts-head-clip">
          <ellipse cx="300" cy="190" rx="34" ry="40" />
        </clipPath>
        <pattern id="ts-curls" patternUnits="userSpaceOnUse" x="264" y="149" width="6" height="12">
          <circle cx="0" cy="3" r="1.3" fill="#281905" fillOpacity="0.35" />
          <circle cx="3" cy="9" r="1.3" fill="#281905" fillOpacity="0.35" />
          <circle cx="6" cy="3" r="1.3" fill="#281905" fillOpacity="0.35" />
        </pattern>
        <SharedShapes />
      </defs>

      {/* Trời đêm */}
      <rect width="2000" height="900" fill="url(#ts-sky)" />
      <g fill="#fff6dd">
        {STILL_STARS.map((band) => (
          <path key={band.opacity} d={band.d} opacity={band.opacity} />
        ))}
        {TWINKLE_STARS.map((s) => (
          <circle key={`${s.x}-${s.y}`} cx={s.x} cy={s.y} r={s.r} opacity={s.o} className={styles.twinkle} style={delay(s.delay)} />
        ))}
      </g>
      <circle cx="1000" cy="125" r="190" fill="url(#ts-moonglow)" />
      <circle cx="1000" cy="125" r="42" fill="url(#ts-moon)" />
      <g className={styles.drift} filter="url(#ts-soft)" fill="none" strokeLinecap="round">
        <path d="M820 150C880 138 960 140 1030 148C1080 154 1140 150 1190 142" stroke="#c4bfe6" strokeOpacity="0.13" strokeWidth="10" />
        <path d="M900 184C980 174 1060 178 1120 186" stroke="#c4bfe6" strokeOpacity="0.09" strokeWidth="8" />
      </g>
      <rect width="2000" height="900" fill="url(#ts-warm)" />

      {/* Núi xa, sương, tháp xa */}
      <path
        d="M0 470C90 440 180 410 300 420C420 430 470 380 590 372C700 366 760 420 880 418C980 416 1040 372 1150 368C1270 364 1330 410 1450 404C1560 398 1610 360 1720 356C1830 352 1900 392 2000 400V720H0Z"
        fill="#131b3e"
      />
      <rect y="470" width="2000" height="150" fill="url(#ts-mist)" />
      <g fill="#161e45">
        <path d={towerPath(520, 600, 7, 74, 34)} />
        <path d={towerPath(1790, 600, 6, 66, 32)} />
      </g>
      <g fill="#f3c06a" opacity="0.5">
        {[...towerWindows(520, 600, 7, 34), ...towerWindows(1790, 600, 6, 32)].map((w) => (
          <rect key={`${w.x}-${w.y}`} x={w.x} y={w.y} width="6" height="9" rx="1" />
        ))}
      </g>
      <path
        d="M0 590C120 560 240 548 380 560C520 572 600 536 740 540C860 544 940 580 1060 578C1180 576 1260 548 1400 552C1540 556 1620 590 1760 584C1880 578 1940 556 2000 552V720H0Z"
        fill="#0e1533"
      />

      {/* Cây sau chùa */}
      <g fill="#0b1230">
        <path d="M760 664C744 624 760 588 792 584C800 548 840 540 858 566C880 560 896 588 884 612C900 630 892 664 870 664Z" />
        <path d="M836 664C820 630 836 600 866 596C872 566 908 556 930 574C944 552 980 556 988 584V664Z" />
        <path d="M1720 664C1736 624 1720 588 1688 584C1680 548 1640 540 1622 566C1600 560 1584 588 1596 612C1580 630 1588 664 1610 664Z" />
        <path d="M1644 664C1660 630 1644 600 1614 596C1608 566 1572 556 1550 574C1536 552 1500 556 1492 584V664Z" />
      </g>

      {/* Tường bao sân chùa */}
      <rect y="664" width="2000" height="26" fill="#17152b" />
      <rect y="660" width="2000" height="6" fill="#26223d" />

      {/* Chính điện: tường, cửa, cột */}
      <rect x="980" y="384" width="520" height="256" fill="url(#ts-wall)" />
      <ellipse cx="1240" cy="520" rx="240" ry="175" fill="url(#ts-cglow)" opacity="0.55" />
      <rect x="980" y="384" width="520" height="12" fill="#5c1d13" />
      <line x1="980" y1="396" x2="1500" y2="396" stroke="#c99a45" strokeOpacity="0.55" strokeWidth="2" />

      <rect x="1100" y="398" width="280" height="242" fill="url(#ts-bay)" />
      <g clipPath="url(#ts-bay-clip)">
        <path d={rays(TX, 445, 20, 300, 2.2)} fill="#ffe0a0" fillOpacity="0.13" className={styles.rays} />
        <g transform="translate(1240 602) scale(0.64) translate(-300 -432)">
          <Buddha />
        </g>
        {/* bàn thờ, nến, bát hương */}
        <rect x="1124" y="618" width="232" height="22" fill="url(#ts-b-plinth)" />
        <rect x="1124" y="618" width="232" height="2.5" fill="#d4a14c" />
        <rect x="1132" y="623" width="216" height="14" fill="none" stroke="#c99a45" strokeOpacity="0.7" strokeWidth="1.2" />
        {[1146, 1334].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy="588" r="16" fill="url(#ts-cglow)" className={styles.glow} style={delay(-i * 1.3)} />
            <rect x={x - 3} y="596" width="6" height="22" fill="#f3ead8" />
            <ellipse cx={x} cy="618" rx="8" ry="2.5" fill="#d9a446" />
            <path
              d={`M${x - 2.6} 596Q${x - 3.4} 590 ${x} 584Q${x + 3.4} 590 ${x + 2.6} 596Z`}
              fill="#ffd27a"
              className={styles.flicker}
              style={delay(-i * 0.7)}
            />
          </g>
        ))}
        <path d="M1218 607C1218 621 1262 621 1262 607Z" fill="url(#ts-bronze)" />
        <ellipse cx="1240" cy="607" rx="24" ry="4.5" fill="#e3b65c" />
        <ellipse cx="1240" cy="607" rx="21" ry="3" fill="#3a2a1c" />
        <g stroke="#7a3f22" strokeWidth="1.6" strokeLinecap="round">
          <path d="M1236 606L1232 584M1240 606V580M1244 606L1248 584" />
        </g>
        <g fill="#ff8a3d">
          <circle cx="1232" cy="584" r="1.7" />
          <circle cx="1240" cy="580" r="1.7" />
          <circle cx="1248" cy="584" r="1.7" />
        </g>
      </g>
      <rect x="1100" y="398" width="280" height="242" fill="none" stroke="#c9973f" strokeWidth="4" />
      <path d={valance} fill="#b9862f" />

      {[1000, 1400].map((x) => (
        <g key={x}>
          <rect x={x} y="444" width="80" height="196" fill="url(#ts-side)" />
          <g stroke="#2b0d0b" strokeOpacity="0.6" strokeWidth="2.5">
            <path d={`M${x + 20} 444V640M${x + 40} 444V640M${x + 60} 444V640M${x} 490H${x + 80}M${x} 540H${x + 80}M${x} 590H${x + 80}`} />
          </g>
          <rect x={x} y="444" width="80" height="196" fill="none" stroke="#a8742a" strokeWidth="3" />
        </g>
      ))}

      {[990, 1090, 1390, 1490].map((c) => (
        <g key={c}>
          <rect x={c - 8} y="384" width="16" height="256" fill="url(#ts-pillar)" />
          <rect x={c - 11} y="384" width="22" height="9" fill="#d9a446" />
          <rect x={c - 11} y="628" width="22" height="12" fill="#8f6a35" />
        </g>
      ))}
      {/* câu đối trên hai cột giữa (nét trang trí, không phải chữ) */}
      {[1090, 1390].map((c) => (
        <g key={`cd${c}`}>
          <rect x={c - 7} y="430" width="14" height="170" fill="#6a1610" stroke="#d6a24c" strokeWidth="1.5" />
          <g fill="#d6a24c" opacity="0.7">
            {Array.from({ length: 8 }, (_, i) => (
              <rect key={i} x={c - 3.5} y={445 + i * 18} width="7" height="6" rx="1" />
            ))}
          </g>
        </g>
      ))}

      {/* Gác trên, hoành phi, cửa sổ tròn */}
      <rect x="1080" y="266" width="320" height="54" fill="url(#ts-wall)" />
      <rect x="1176" y="276" width="128" height="32" rx="3" fill="#4a140d" stroke="#d6a24c" strokeWidth="2.5" />
      <rect x="1182" y="282" width="116" height="20" rx="2" fill="none" stroke="#d6a24c" strokeOpacity="0.5" />
      <g fill="#e8b65c">
        <path d="M1240 283c3 3.5 4 7.5 0 13-4-5.5-3-9.5 0-13z" />
        <path d="M1240 296c-.6-4-3-6.6-7.5-7.2.3 4.2 2.8 6.7 7.5 7.2z" />
        <path d="M1240 296c.6-4 3-6.6 7.5-7.2-.3 4.2-2.8 6.7-7.5 7.2z" />
      </g>
      {[1122, 1358].map((x) => (
        <g key={`w${x}`}>
          <circle cx={x} cy="292" r="13" fill="url(#ts-window)" />
          <path d={`M${x - 13} 292H${x + 13}M${x} 279V305`} stroke="#5a1c12" strokeWidth="2" />
          <circle cx={x} cy="292" r="13" fill="none" stroke="#d6a24c" strokeWidth="2" />
        </g>
      ))}

      {/* Mái dưới */}
      <path
        d="M914 352Q930 380 962 386Q1240 402 1518 386Q1550 380 1566 352Q1554 370 1528 374C1478 368 1440 346 1420 316L1060 316C1040 346 1002 368 952 374Q926 370 914 352Z"
        fill="url(#ts-roof)"
      />
      <path d={lowerTiles.join("")} stroke="#fff" strokeOpacity="0.05" strokeWidth="2" />
      <path d={LOWER_EAVE} fill="none" stroke="#d6a24c" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M914 352c-9-12-6-24 6-30M1566 352c9-12 6-24-6-30" fill="none" stroke="#d6a24c" strokeWidth="3" strokeLinecap="round" />

      {/* Mái trên, bờ nóc, lưỡng long chầu nguyệt cách điệu */}
      <path
        d="M1010 248Q1024 270 1050 276Q1240 290 1430 276Q1456 270 1470 248Q1460 262 1438 266C1400 260 1372 240 1358 216L1122 216C1108 240 1080 260 1042 266Q1020 262 1010 248Z"
        fill="url(#ts-roof)"
      />
      <path d={upperTiles.join("")} stroke="#fff" strokeOpacity="0.05" strokeWidth="2" />
      <path d={UPPER_EAVE} fill="none" stroke="#d6a24c" strokeWidth="3" strokeLinecap="round" />
      <path d="M1010 248c-8-10-6-21 5-27M1470 248c8-10 6-21-5-27" fill="none" stroke="#d6a24c" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M1108 216H1372L1368 205H1112Z" fill="#241c38" />
      <line x1="1112" y1="205" x2="1368" y2="205" stroke="#d6a24c" strokeOpacity="0.8" strokeWidth="2.5" />
      <g fill="#d9a446">
        <path d="M1112 207c-14-2-22-14-16-30 3 9 9 14 18 15z" />
        <path d="M1368 207c14-2 22-14 16-30-3 9-9 14-18 15z" />
      </g>
      <g fill="none" stroke="#d9a446" strokeWidth="3" strokeLinecap="round">
        <path d="M1132 203c14-12 30 2 46-8s24-4 32 2" />
        <path d="M1348 203c-14-12-30 2-46-8s-24-4-32 2" />
      </g>
      <circle cx="1240" cy="190" r="38" fill="url(#ts-cglow)" className={styles.glow} />
      <circle cx="1240" cy="192" r="10" fill="url(#ts-orb)" />
      <path d="M1240 168c6 7 7 13 0 18-7-5-6-11 0-18z" fill="#f7cf72" />

      {/* Đèn lồng treo dưới mái */}
      <HangingLantern x={1040} y={390} d={-1.5} />
      <HangingLantern x={1440} y={390} d={-4} />

      {/* Nền chính điện, bậc tam cấp */}
      <path d="M890 640H1590L1606 652H874Z" fill="url(#ts-terrace)" />
      <rect x="874" y="652" width="732" height="32" fill="url(#ts-stone-face)" />
      <line x1="874" y1="652" x2="1606" y2="652" stroke="#b98a45" strokeOpacity="0.45" strokeWidth="2" />

      {/* Sân chùa */}
      <rect y="684" width="2000" height="126" fill="url(#ts-court)" />
      <path d="M1052 742L1000 810M1428 742L1480 810M960 700L860 810M1520 700L1620 810" stroke="#fff" strokeOpacity="0.035" strokeWidth="2" />

      {Array.from({ length: 5 }, (_, k) => {
        const hw = 112 + k * 10;
        const y = 652 + k * 18;
        return (
          <g key={`st${k}`}>
            <rect x={TX - hw} y={y} width={hw * 2} height="18" fill="url(#ts-step)" />
            <line x1={TX - hw} y1={y} x2={TX + hw} y2={y} stroke="#d2a35a" strokeOpacity={r1(0.34 - k * 0.04)} strokeWidth="1.5" />
          </g>
        );
      })}
      <g fill="#2c2742">
        <path d="M1116 652H1130L1088 742H1062Z" />
        <path d="M1364 652H1350L1392 742H1418Z" />
      </g>
      <path d="M1100 652L1380 652L1560 810L920 810Z" fill="url(#ts-beam)" />

      <StoneLantern x={940} base={800} d={-0.6} />
      <StoneLantern x={1540} base={800} d={-2.1} />

      {/* Lư trầm và khói */}
      <g>
        <path d="M1206 776L1200 800H1210L1214 776Z" fill="#5a3a12" />
        <path d="M1274 776L1280 800H1270L1266 776Z" fill="#5a3a12" />
        <path d="M1235 780L1234 800H1246L1245 780Z" fill="#6b4716" />
        <path d="M1184 748C1182 774 1210 788 1240 788C1270 788 1298 774 1296 748Z" fill="url(#ts-bronze)" />
        <path d="M1196 758C1200 772 1216 780 1232 782" fill="none" stroke="#ffecbe" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
        <path d="M1178 748V732H1190V748M1302 748V732H1290V748" fill="none" stroke="#b8873a" strokeWidth="4" />
        <ellipse cx="1240" cy="748" rx="60" ry="9" fill="#d8a54b" />
        <ellipse cx="1240" cy="748" rx="52" ry="6" fill="#3a2410" />
        <path d="M1198 746C1200 714 1280 714 1282 746Z" fill="url(#ts-bronze)" />
        <ellipse cx="1240" cy="746" rx="44" ry="5" fill="#c59340" />
        <circle cx="1240" cy="712" r="7" fill="#e2b25a" />
        <path d="M1240 698c5 5 5 10 0 14-5-4-5-9 0-14z" fill="#e2b25a" />
      </g>
      <g mask="url(#ts-smoke-mask)" filter="url(#ts-soft)" fill="none" stroke="#f1e8da" strokeLinecap="round">
        <path className={styles.smoke} d="M1240 700C1228 664 1254 634 1240 600C1226 566 1252 534 1238 498" strokeOpacity="0.5" strokeWidth="5" />
        <path className={styles.smoke} style={delay(-2.7, 9)} d="M1238 702C1256 668 1222 640 1246 606C1268 576 1236 546 1256 510" strokeOpacity="0.4" strokeWidth="4" />
        <path className={styles.smoke} style={delay(-5.2, 10)} d="M1242 702C1222 674 1248 650 1228 618C1210 590 1236 560 1222 526" strokeOpacity="0.35" strokeWidth="4" />
      </g>

      {/* Người đi lễ (trang trí, quay lưng, hướng vào chính điện) */}
      <Pilgrim x={1112} y={796} bun />
      <Pilgrim x={1160} y={804} s={0.95} />
      <Pilgrim x={1322} y={804} s={0.95} bun />
      <Pilgrim x={1370} y={796} />

      {/* Hồ sen */}
      <rect y="806" width="2000" height="10" fill="#26233c" />
      <line x1="0" y1="806" x2="2000" y2="806" stroke="#ffdcaa" strokeOpacity="0.16" strokeWidth="2" />
      <rect y="816" width="2000" height="84" fill="url(#ts-water)" />
      <g stroke="#ffc978" strokeWidth="2.6" strokeLinecap="round" className={styles.shimmer}>
        <path d="M1180 826h60M1210 836h90M1160 848h70M1250 854h50M1196 866h56M1230 878h80M1176 890h40" strokeOpacity="0.35" />
      </g>
      <g stroke="#ffc978" strokeWidth="2.6" strokeLinecap="round" className={styles.shimmer} style={delay(-2.5)}>
        <path d="M1150 832h40M1270 842h60M1200 858h44M1290 870h36M1150 880h50M1260 892h44" strokeOpacity="0.25" />
      </g>
      <g stroke="#f5e3b3" strokeWidth="2.4" strokeLinecap="round" strokeOpacity="0.28" className={styles.shimmer} style={delay(-1.2)}>
        <path d="M980 832h40M990 844h24M972 858h30M988 872h18" />
      </g>
      <g stroke="#e0472e" strokeWidth="2.4" strokeLinecap="round" strokeOpacity="0.22">
        <path d="M1030 830h22M1036 842h12M1430 830h22M1436 842h12" />
      </g>
      <g fill="none" stroke="#fff" strokeOpacity="0.06">
        <ellipse cx="1060" cy="864" rx="60" ry="6" />
        <ellipse cx="1560" cy="884" rx="80" ry="7" />
        <ellipse cx="700" cy="874" rx="70" ry="6" />
      </g>

      <g fill="url(#ts-pad)" stroke="#78be8c" strokeOpacity="0.22">
        <path d={lilyPad(120, 846, 30, 8, 300)} />
        <path d={lilyPad(240, 880, 44, 11, 260)} />
        <path d={lilyPad(380, 850, 30, 8, 320)} />
        <path d={lilyPad(520, 882, 44, 11, 250)} />
        <path d={lilyPad(640, 846, 30, 8, 30)} />
        <path d={lilyPad(760, 872, 40, 11, 300)} />
        <path d={lilyPad(880, 840, 34, 9, 300)} />
        <path d={lilyPad(960, 874, 42, 11, 250)} />
        <path d={lilyPad(1080, 828, 26, 7, 20)} />
        <path d={lilyPad(1128, 886, 48, 12, 280)} />
        <path d={lilyPad(1338, 884, 44, 11, 230)} />
        <path d={lilyPad(1400, 832, 30, 8, 320)} />
        <path d={lilyPad(1500, 862, 40, 10, 200)} />
        <path d={lilyPad(1600, 838, 30, 8, 340)} />
        <path d={lilyPad(1680, 886, 46, 12, 260)} />
        <path d={lilyPad(1780, 848, 34, 9, 300)} />
        <path d={lilyPad(1880, 880, 40, 10, 210)} />
      </g>
      {[
        [950, 836, 30], [1110, 830, 26], [1372, 834, 28], [1530, 836, 30], [560, 846, 28], [1820, 846, 26], [300, 852, 28],
      ].map(([x, y, h]) => (
        <Reuse key={`bud${x}`} id="ts-bud" x={x} y={y} s={r1(h / 28)} />
      ))}
      {[
        [1010, 858, 0.9], [1462, 866, 1], [1604, 842, 0.75], [878, 870, 0.8], [1720, 878, 0.95], [640, 870, 0.8], [420, 880, 0.9], [1900, 862, 0.7],
      ].map(([x, y, s]) => (
        <Reuse key={`lotus${x}`} id="ts-lotus" x={x} y={y} s={s} />
      ))}

      {/* Cành đào hai góc trên */}
      <g fill="none" stroke="#2a1519" strokeLinecap="round">
        <path d="M2010 46C1930 40 1870 70 1800 66C1740 62 1700 40 1640 46" strokeWidth="10" />
        <path d="M1640 46C1590 52 1556 74 1520 82C1494 88 1470 86 1452 92" strokeWidth="6" />
        <path
          d="M1800 66C1790 92 1770 110 1744 118M1640 46C1626 26 1608 16 1584 14M1700 52C1696 76 1684 92 1664 102M1900 52C1896 80 1880 100 1856 110M1520 82C1510 104 1494 116 1472 120"
          strokeWidth="3.5"
        />
        <path d="M-10 60C60 50 120 76 190 70C250 64 290 40 350 46" strokeWidth="10" />
        <path d="M350 46C392 50 420 64 446 70" strokeWidth="6" />
        <path d="M190 70C200 96 220 110 246 116M350 46C360 26 380 16 404 12M100 62C104 88 118 104 140 112" strokeWidth="3.5" />
      </g>
      {[
        [1452, 92, 11], [1474, 118, 9], [1496, 80, 10], [1530, 70, 12], [1548, 96, 9], [1584, 16, 10],
        [1606, 34, 11], [1640, 58, 10], [1664, 102, 12], [1690, 40, 9], [1744, 118, 11], [1760, 92, 10],
        [1800, 54, 12], [1830, 82, 9], [1856, 110, 11], [1900, 40, 10], [1940, 66, 12], [1980, 34, 10],
        [446, 70, 11], [424, 52, 9], [404, 12, 10], [380, 30, 11], [350, 58, 10], [300, 44, 12],
        [246, 116, 11], [226, 92, 9], [190, 56, 12], [140, 112, 10], [120, 80, 11], [70, 50, 10], [30, 72, 12],
      ].map(([x, y, r]) => (
        <Reuse key={`bl${x}-${y}`} id="ts-blossom" x={x} y={y} s={r1(r / 10)} />
      ))}
      <g fill="#e98aa8">
        {[
          [1462, 76, 4.5], [1512, 100, 4], [1620, 12, 4.5], [1676, 84, 4], [1772, 128, 4.5], [1876, 120, 4],
          [1960, 84, 4.5], [460, 86, 4.5], [330, 30, 4], [210, 126, 4], [90, 100, 4.5],
        ].map(([x, y, r]) => (
          <circle key={`bd${x}-${y}`} cx={x} cy={y} r={r} />
        ))}
      </g>
      <g fill="#f6b2c6">
        {[
          [1500, 110, -2], [1620, 70, -6.5], [1720, 130, -10.5], [1560, 150, -14],
        ].map(([x, y, d]) => (
          <ellipse key={`pt${x}`} cx={x} cy={y} rx="4.5" ry="2.6" className={styles.petal} style={delay(d)} />
        ))}
      </g>

      {/* Đốm sáng bay lên */}
      <g fill="#ffdc95">
        {[
          [1150, 600, 2.6, 0], [1330, 560, 2.2, -1.5], [1200, 470, 3, -3], [1290, 640, 2.4, -4.5],
          [1100, 520, 2, -6], [1380, 500, 2.8, -7.5], [1240, 690, 2.2, -2.2], [1170, 380, 2, -8.6],
          [1320, 420, 2.6, -5.3], [1060, 600, 2.2, -9.4], [1420, 610, 2.4, -3.8], [1250, 540, 3.2, -6.8],
        ].map(([x, y, r, d]) => (
          <circle key={`m${x}-${y}`} cx={x} cy={y} r={r} className={styles.mote} style={delay(d)} />
        ))}
      </g>

      <rect width="2000" height="900" fill="url(#ts-vignette)" />
    </svg>
  );
}
