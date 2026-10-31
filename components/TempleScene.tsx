import type { CSSProperties, ReactNode } from "react";
import styles from "./TempleScene.module.css";

/*
  Tranh "chính điện" tông vàng theo bố cục ảnh mẫu Sếp gửi (data/ASSET_LICENSE_REGISTER.csv, mã ART-001).
  - Tự vẽ bằng SVG. Không dùng, không đồ lại ảnh mẫu (ảnh mẫu chưa rõ nguồn); chỉ theo bố cục và tông màu.
  - Tượng Phật dựng lại từ bản thử canvas ngày 31/10 (prototypes/chinh-dien-v0.html), phóng to.
  - Các Phật tử là hình trang trí, số lượng cố định, không tên, không phải người đang truy cập
    (tính năng hiện người truy cập đang khóa, xem lib/flags.ts). Riêng Phật tử ở giữa (data-anchor="self")
    là "bạn": chỉ chuyển động khi chính người xem bấm nút.
  - Khi có tranh vẽ/ảnh nền rõ nguồn, thay tệp này; các điểm neo data-anchor giữ nguyên để nút vẫn chạy.
  Khung 1600×1000, tượng Phật ở giữa (x = 800).
*/

const CX = 800;
const r1 = (n: number) => Math.round(n * 10) / 10;

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

function rays(cx: number, cy: number, count: number, r0: number, r: number, halfWidthDeg: number) {
  let d = "";
  for (let i = 0; i < count; i++) {
    const a = (i * 360) / count;
    const p = (deg: number, rad: number) => {
      const t = (deg * Math.PI) / 180;
      return `${r1(cx + rad * Math.cos(t))} ${r1(cy + rad * Math.sin(t))}`;
    };
    d += `M${p(a - halfWidthDeg * 0.3, r0)}L${p(a - halfWidthDeg, r)}L${p(a + halfWidthDeg, r)}L${p(a + halfWidthDeg * 0.3, r0)}Z`;
  }
  return d;
}

/** Mái cong có đầu đao: đáy từ xL tới xR ở y, nóc ở top, đầu đao vểnh lên lift. */
function roof(xL: number, xR: number, y: number, top: number, lift: number, overhang: number) {
  const w = xR - xL;
  const inset = w * 0.18;
  return `M${xL - overhang} ${y - lift}Q${xL - overhang * 0.4} ${y + 4} ${xL + overhang * 0.4} ${y + 6}Q${(xL + xR) / 2} ${y + 14} ${xR - overhang * 0.4} ${y + 6}Q${xR + overhang * 0.4} ${y + 4} ${xR + overhang} ${y - lift}Q${xR + overhang * 0.2} ${y - lift * 0.4} ${xR - inset * 0.2} ${y - (y - top) * 0.35}L${xR - inset} ${top}L${xL + inset} ${top}L${xL + inset * 0.2} ${y - (y - top) * 0.35}Q${xL - overhang * 0.2} ${y - lift * 0.4} ${xL - overhang} ${y - lift}Z`;
}

function roofEdge(xL: number, xR: number, y: number, lift: number, overhang: number) {
  return `M${xL - overhang} ${y - lift}Q${xL - overhang * 0.4} ${y + 4} ${xL + overhang * 0.4} ${y + 6}Q${(xL + xR) / 2} ${y + 14} ${xR - overhang * 0.4} ${y + 6}Q${xR + overhang * 0.4} ${y + 4} ${xR + overhang} ${y - lift}`;
}

/** Tháp nhiều tầng mái vàng. */
function Pagoda({ x, base, tiers, w0, tierH }: { x: number; base: number; tiers: number; w0: number; tierH: number }) {
  const parts: ReactNode[] = [];
  for (let i = 0; i < tiers; i++) {
    const yB = base - i * tierH;
    const yT = yB - tierH;
    const w = w0 * (1 - i * 0.085);
    parts.push(
      <g key={i}>
        <rect x={r1(x - w * 0.34)} y={yT + 10} width={r1(w * 0.68)} height={tierH - 10} fill="#8c3a23" />
        <rect x={x - 4} y={yT + 15} width="8" height={Math.max(6, tierH - 22)} rx="2" fill="#ffd27a" opacity="0.85" />
        <path d={roof(x - w * 0.42, x + w * 0.42, yT + 12, yT, 7, w * 0.12)} fill="url(#gs-roof)" />
      </g>,
    );
  }
  const peak = base - tiers * tierH;
  parts.push(<path key="spire" d={`M${x - 3} ${peak + 2}L${x} ${peak - 34}L${x + 3} ${peak + 2}Z`} fill="#f2c25c" />);
  return <g>{parts}</g>;
}

const CANOPY_BLOBS = [
  [0, 0, 70], [-62, 18, 52], [60, 14, 56], [-30, -40, 50], [34, -44, 48], [-96, 50, 36], [98, 52, 38], [4, 40, 54],
];
const CANOPY_TINTS = ["#f9b8cd", "#f6a2bd", "#fbcadb", "#f48fb1", "#fcd6e3"];

/** Chấm hoa rải trên tán, có hạt giống để lần build nào cũng giống nhau. */
function canopyDots(seed: number) {
  let t = seed;
  const rand = () => {
    t = (t * 9301 + 49297) % 233280;
    return t / 233280;
  };
  return Array.from({ length: 26 }, () => ({ x: (rand() - 0.5) * 220, y: (rand() - 0.6) * 140, r: 3 + rand() * 4 }));
}

/** Tán hoa đào: nhiều vòng tròn hồng chồng lên nhau, rải chấm hoa. */
function BlossomCanopy({ x, y, s, seed }: { x: number; y: number; s: number; seed: number }) {
  const blobs = CANOPY_BLOBS;
  const tints = CANOPY_TINTS;
  const dots = canopyDots(seed);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g fill="#d9668f" opacity="0.85">
        <circle cx="-50" cy="46" r="58" />
        <circle cx="46" cy="44" r="60" />
        <circle cx="0" cy="62" r="56" />
      </g>
      {blobs.map(([bx, by, br], i) => (
        <circle key={`c${i}`} cx={bx} cy={by} r={br} fill={tints[i % tints.length]} />
      ))}
      <g fill="#fff0f5" opacity="0.85">
        {dots.map((d, i) => (
          <circle key={`d${i}`} cx={r1(d.x)} cy={r1(d.y)} r={r1(d.r)} />
        ))}
      </g>
    </g>
  );
}

function HangingLantern({ x, y, len, d }: { x: number; y: number; len: number; d: number }) {
  const cy = y + len + 26;
  return (
    <g className={styles.sway} style={delay(d)}>
      <line x1={x} y1={y} x2={x} y2={y + len} stroke="#7a4a1c" strokeWidth="2" />
      <circle cx={x} cy={cy} r="56" fill="url(#gs-lglow)" className={styles.glow} style={delay(d)} />
      <rect x={x - 11} y={y + len} width="22" height="7" rx="2" fill="#f2c25c" />
      <ellipse cx={x} cy={cy} rx="20" ry="25" fill="url(#gs-lantern)" />
      <ellipse cx={x} cy={cy} rx="8" ry="25" fill="none" stroke="#5a0f08" strokeOpacity="0.35" />
      <ellipse cx={x} cy={cy} rx="14" ry="25" fill="none" stroke="#5a0f08" strokeOpacity="0.3" />
      <rect x={x - 11} y={cy + 22} width="22" height="7" rx="2" fill="#f2c25c" />
      <path d={`M${x} ${cy + 29}v22`} stroke="#e8463a" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function StoneLantern({ x, base, s, d }: { x: number; base: number; s: number; d: number }) {
  return (
    <g transform={`translate(${x} ${base}) scale(${s})`}>
      <circle cx="0" cy="-86" r="62" fill="url(#gs-cglow)" className={styles.glow} style={delay(d)} />
      <path d="M-32 0L-25 -16H25L32 0Z" fill="url(#gs-stone)" />
      <rect x="-9" y="-58" width="18" height="42" fill="url(#gs-stone)" />
      <rect x="-26" y="-68" width="52" height="10" rx="2" fill="url(#gs-stone)" />
      <rect x="-19" y="-104" width="38" height="36" fill="url(#gs-stone)" />
      <rect x="-11" y="-98" width="22" height="24" rx="2" fill="#ffe08a" className={styles.glow} style={delay(d + 1.1)} />
      <path d="M-40 -102Q-20 -110 0 -112Q20 -110 40 -102L30 -116Q0 -133 -30 -116Z" fill="url(#gs-stone-dark)" />
      <circle cx="0" cy="-135" r="6" fill="url(#gs-stone-dark)" />
    </g>
  );
}

/** Tượng Phật ngồi thiền trên đài sen. Toạ độ gốc của bản thử canvas (tâm x = 300, đáy đài sen y = 432). */
function Buddha() {
  const cx = 300;
  return (
    <g>
      {Array.from({ length: 9 }, (_, i) => (
        <path key={`pb${i}`} d={petal(cx + (i - 4) * 31, 426, 34, 30)} fill="url(#gb-petal-back)" stroke="#8a5a14" strokeOpacity="0.35" />
      ))}
      <path d="M172 398C170 360 220 342 300 344C380 342 430 360 428 398C380 410 220 410 172 398Z" fill="url(#gb-lap)" />
      <path
        d="M284 226C260 230 238 236 230 252C216 282 214 322 226 350C260 360 340 360 374 350C386 322 384 282 370 252C362 236 340 230 316 226Z"
        fill="url(#gb-body)"
      />
      <path
        d="M284 226C260 230 238 236 230 252C216 282 214 322 226 350C260 360 340 360 374 350C386 322 384 282 370 252C362 236 340 230 316 226Z"
        fill="url(#gb-sheen)"
      />
      <g fill="none" stroke="#9a6416" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round">
        <path d="M330 232C310 270 270 300 242 338" />
        <path d="M318 246C300 276 272 300 252 326" strokeOpacity="0.25" />
        <path d="M240 372C280 384 320 384 360 372" />
        <path d="M202 390C260 401 340 401 398 390" />
      </g>
      {Array.from({ length: 8 }, (_, i) => (
        <path key={`pf${i}`} d={petal(cx + (i - 3.5) * 33, 432, 36, 32)} fill="url(#gb-petal-front)" stroke="#8a5a14" strokeOpacity="0.35" />
      ))}
      <ellipse cx="300" cy="338" rx="28" ry="9.5" fill="#f0c460" stroke="#8a5a14" strokeOpacity="0.5" strokeWidth="1.5" />
      <path d="M278 337Q300 331 322 337" fill="none" stroke="#fff3c4" strokeOpacity="0.7" strokeWidth="1.4" strokeLinecap="round" />
      <rect x="288" y="210" width="24" height="22" fill="#f0c460" />
      <ellipse cx="265" cy="194" rx="6" ry="18" transform="rotate(-4.6 265 194)" fill="#e9b04a" />
      <ellipse cx="335" cy="194" rx="6" ry="18" transform="rotate(4.6 335 194)" fill="#e9b04a" />
      <ellipse cx="300" cy="190" rx="33" ry="39" fill="url(#gb-face)" />
      <g clipPath="url(#gb-head-clip)">
        <ellipse cx="300" cy="150" rx="42" ry="27" fill="#c48a2c" />
        <rect x="262" y="149" width="76" height="30" fill="url(#gb-curls)" />
      </g>
      <ellipse cx="300" cy="147" rx="14" ry="12" fill="#c48a2c" />
      <g fill="none" stroke="#7a4a10" strokeOpacity="0.65" strokeLinecap="round">
        <path d="M306 192Q312 195 318 192M294 192Q288 195 282 192" strokeWidth="1.6" />
        <path d="M305 183Q312 178 320 182M295 183Q288 178 280 182" strokeWidth="1.2" />
        <path d="M300 188L298 203L302 204" strokeWidth="1.2" />
        <path d="M294 213Q300 216 306 213" strokeWidth="1.2" />
      </g>
      <circle cx="300" cy="178" r="1.8" fill="#c0392b" fillOpacity="0.8" />
    </g>
  );
}

/** Các hình lặp lại (sen, nụ sen, Phật tử): định nghĩa một lần ở gốc toạ độ, vẽ lại bằng <use>. */
function SharedShapes() {
  return (
    <>
      <g id="gs-lotus">
        <ellipse cx="0" cy="-16" rx="44" ry="30" fill="url(#gs-cglow)" opacity="0.45" />
        {[-66, -36, 0, 36, 66].map((a) => (
          <path key={`b${a}`} d="M0 0C-11 -10 -10 -27 0 -37C10 -27 11 -10 0 0Z" transform={`rotate(${a})`} fill="url(#gs-petal-b)" />
        ))}
        {[-40, 0, 40].map((a) => (
          <path key={`f${a}`} d="M0 0C-9 -8 -8 -22 0 -30C8 -22 9 -8 0 0Z" transform={`rotate(${a})`} fill="url(#gs-petal-f)" />
        ))}
        <ellipse cx="0" cy="-6" rx="7" ry="3" fill="#ffd34d" />
      </g>
      <g id="gs-bud">
        <path d="M0 0C-4 -14 6 -20 3 -30" stroke="#3f7d4f" strokeWidth="2.6" fill="none" />
        <path d={petal(3, -28, 16, 28)} fill="url(#gs-petal-b)" />
        <path d={petal(3, -28, 9, 23)} fill="url(#gs-petal-f)" opacity="0.9" />
      </g>
      {/* Phật tử đứng chắp tay, nhìn từ sau lưng; gốc ở giữa bàn chân. */}
      <g id="gs-stand">
        <ellipse cx="0" cy="0" rx="30" ry="6" fill="#5a2e1a" opacity="0.28" />
        <ellipse cx="-21" cy="-44" rx="8" ry="13" fill="url(#gs-robe)" />
        <ellipse cx="21" cy="-44" rx="8" ry="13" fill="url(#gs-robe)" />
        <path d="M-25 -2C-27 -30 -23 -52 -15 -62C-9 -68 9 -68 15 -62C23 -52 27 -30 25 -2Q0 4 -25 -2Z" fill="url(#gs-robe)" />
        <path d="M12 -60C20 -50 24 -30 23 -3Q16 0 10 0C14 -24 14 -44 12 -60Z" fill="#8f86a8" opacity="0.35" />
        <path d="M0 -64V-4" stroke="#a79fbd" strokeWidth="1.5" opacity="0.7" />
        <rect x="-5" y="-73" width="10" height="9" fill="#efc29c" />
        <path d="M-9 -64Q0 -58 9 -64" fill="none" stroke="#a79fbd" strokeWidth="2" />
        <ellipse cx="-23" cy="-90" rx="4.5" ry="6.5" fill="#efc29c" />
        <ellipse cx="23" cy="-90" rx="4.5" ry="6.5" fill="#efc29c" />
        <circle cx="0" cy="-92" r="24" fill="url(#gs-hair)" />
        <path d="M-15 -60C-9 -66 9 -66 15 -60M-17 -108A24 24 0 0 1 17 -108" fill="none" stroke="#ffe08a" strokeOpacity="0.75" strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <g id="gs-stand-bun">
        <use href="#gs-stand" />
        <circle cx="0" cy="-118" r="9" fill="url(#gs-hair)" />
        <g fill="#f7a3c0">
          <circle cx="14" cy="-112" r="4" />
          <circle cx="19" cy="-108" r="4" />
          <circle cx="14" cy="-104" r="4" />
          <circle cx="10" cy="-108" r="4" />
        </g>
        <circle cx="14" cy="-108" r="2.4" fill="#fff3b0" />
      </g>
      <g id="gs-stand-long">
        <use href="#gs-stand" />
        <path d="M-19 -100C-24 -80 -20 -62 -14 -50H14C20 -62 24 -80 19 -100Z" fill="url(#gs-hair)" />
      </g>
      {/* Phật tử quỳ lạy, nhìn từ sau lưng. */}
      <g id="gs-kneel">
        <ellipse cx="0" cy="0" rx="34" ry="6" fill="#5a2e1a" opacity="0.28" />
        <path d="M-31 -2C-33 -18 -27 -38 -16 -46C-10 -51 10 -51 16 -46C27 -38 33 -18 31 -2Q0 4 -31 -2Z" fill="url(#gs-robe)" />
        <path d="M14 -44C26 -36 31 -20 29 -3Q20 0 13 0C17 -16 17 -32 14 -44Z" fill="#8f86a8" opacity="0.35" />
        <ellipse cx="-13" cy="-2" rx="8" ry="4" fill="#efc29c" />
        <ellipse cx="13" cy="-2" rx="8" ry="4" fill="#efc29c" />
        <path d="M0 -48V-6" stroke="#b3abc6" strokeWidth="1.5" opacity="0.7" />
        <rect x="-5" y="-56" width="10" height="8" fill="#efc29c" />
        <ellipse cx="-22" cy="-73" rx="4.5" ry="6.5" fill="#efc29c" />
        <ellipse cx="22" cy="-73" rx="4.5" ry="6.5" fill="#efc29c" />
        <circle cx="0" cy="-75" r="23" fill="url(#gs-hair)" />
        <path d="M-16 -45C-9 -50 9 -50 16 -45M-16 -91A23 23 0 0 1 16 -91" fill="none" stroke="#ffe08a" strokeOpacity="0.75" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    </>
  );
}

type Person = { x: number; y: number; s: number; kind: "gs-stand" | "gs-stand-bun" | "gs-stand-long" | "gs-kneel"; flip: boolean };

// Phật tử trang trí, xếp theo hàng từ xa tới gần, chừa lối đi ở giữa.
const PEOPLE: Person[] = (() => {
  const rows: { y: number; s: number; xs: number[] }[] = [
    { y: 640, s: 0.46, xs: [440, 490, 540, 590, 1010, 1060, 1110, 1160] },
    { y: 690, s: 0.56, xs: [360, 420, 480, 540, 600, 1000, 1060, 1120, 1180, 1240] },
    { y: 752, s: 0.74, xs: [300, 375, 450, 520, 575, 1025, 1080, 1150, 1225, 1300] },
    { y: 840, s: 1.0, xs: [330, 430, 520, 1080, 1170, 1270] },
    { y: 975, s: 1.32, xs: [380, 500, 1100, 1220] },
  ];
  const kinds: Person["kind"][] = ["gs-stand", "gs-stand-bun", "gs-kneel", "gs-stand-long", "gs-kneel", "gs-stand-bun", "gs-stand"];
  const list: Person[] = [];
  let n = 0;
  for (const row of rows) {
    for (const x of row.xs) {
      list.push({ x, y: row.y, s: row.s, kind: kinds[n % kinds.length], flip: n % 3 === 1 });
      n += 1;
    }
  }
  return list;
})();

const POND_LOTUS: [number, number, number][] = [
  [60, 900, 1.5], [190, 960, 1.9], [120, 820, 1.1], [1540, 905, 1.5], [1410, 965, 1.9], [1480, 825, 1.1],
  [520, 985, 1.4], [1080, 985, 1.4], [600, 940, 0.9], [1000, 940, 0.9],
];
const POND_BUDS: [number, number, number][] = [
  [250, 880, 1.2], [20, 980, 1.3], [1350, 880, 1.2], [1580, 980, 1.3], [470, 950, 1.1], [1130, 950, 1.1],
];
const POND_PADS: [number, number, number, number, number][] = [
  [90, 930, 48, 12, 300], [230, 870, 40, 10, 250], [30, 860, 34, 9, 20], [300, 990, 52, 13, 280],
  [1510, 930, 48, 12, 230], [1370, 870, 40, 10, 300], [1570, 860, 34, 9, 200], [1300, 990, 52, 13, 260],
  [560, 975, 44, 11, 300], [1040, 975, 44, 11, 230],
];

export function TempleScene({ className }: { className?: string }) {
  const haloPetals = Array.from({ length: 28 }, (_, i) => (i * 360) / 28);
  return (
    <svg
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Tranh vẽ chính điện: tượng Phật vàng lớn tỏa hào quang, điện vàng, tháp trong sương, cây hoa đào, lư hương nghi ngút khói, đèn đá, hồ sen và các Phật tử chắp tay hướng về tượng Phật."
      className={[styles.scene, className].filter(Boolean).join(" ")}
    >
      <defs>
        <linearGradient id="gs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c2150" />
          <stop offset="0.24" stopColor="#7a4672" />
          <stop offset="0.45" stopColor="#d9805f" />
          <stop offset="0.62" stopColor="#f4b266" />
          <stop offset="1" stopColor="#ffd98c" />
        </linearGradient>
        <radialGradient id="gs-sunglow" gradientUnits="userSpaceOnUse" cx="800" cy="260" r="720">
          <stop offset="0" stopColor="#fff6d2" stopOpacity="0.95" />
          <stop offset="0.28" stopColor="#ffdf8a" stopOpacity="0.7" />
          <stop offset="0.6" stopColor="#f6ad5a" stopOpacity="0.22" />
          <stop offset="1" stopColor="#f6ad5a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gs-mtn-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a6aa3" />
          <stop offset="1" stopColor="#e2a7a0" />
        </linearGradient>
        <linearGradient id="gs-mtn-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b4f86" />
          <stop offset="1" stopColor="#c98f8e" />
        </linearGradient>
        <linearGradient id="gs-fog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe6dc" stopOpacity="0" />
          <stop offset="0.5" stopColor="#ffe6dc" stopOpacity="0.6" />
          <stop offset="1" stopColor="#ffe6dc" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gs-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="0.55" stopColor="#e7a83e" />
          <stop offset="1" stopColor="#9c5e1a" />
        </linearGradient>
        <linearGradient id="gs-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9a3220" />
          <stop offset="1" stopColor="#5e170d" />
        </linearGradient>
        <linearGradient id="gs-pillar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6d150d" />
          <stop offset="0.45" stopColor="#c8402a" />
          <stop offset="1" stopColor="#6d150d" />
        </linearGradient>
        <linearGradient id="gs-lattice" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffcf6e" />
          <stop offset="1" stopColor="#c97b2c" />
        </linearGradient>
        <radialGradient id="gs-halo" gradientUnits="userSpaceOnUse" cx="800" cy="268" r="212">
          <stop offset="0" stopColor="#fffdf0" />
          <stop offset="0.38" stopColor="#fff0b4" />
          <stop offset="0.72" stopColor="#ffd16a" />
          <stop offset="0.92" stopColor="#f2a93e" />
          <stop offset="1" stopColor="#d9862a" />
        </radialGradient>
        <radialGradient id="gs-halo-glow" gradientUnits="userSpaceOnUse" cx="800" cy="268" r="310">
          <stop offset="0.6" stopColor="#ffe9a6" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffe9a6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gs-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff1bf" />
          <stop offset="0.5" stopColor="#f2c25c" />
          <stop offset="1" stopColor="#b77a25" />
        </linearGradient>
        <linearGradient id="gs-bronze" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6b4318" />
          <stop offset="0.45" stopColor="#f3c869" />
          <stop offset="1" stopColor="#6b4318" />
        </linearGradient>
        <linearGradient id="gs-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1dcb8" />
          <stop offset="1" stopColor="#a8865f" />
        </linearGradient>
        <linearGradient id="gs-stone-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9a77c" />
          <stop offset="1" stopColor="#7a5a3c" />
        </linearGradient>
        <linearGradient id="gs-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d8aa76" />
          <stop offset="0.5" stopColor="#b27c4e" />
          <stop offset="1" stopColor="#7a4e33" />
        </linearGradient>
        <linearGradient id="gs-path" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbe1b0" />
          <stop offset="1" stopColor="#d9a46c" />
        </linearGradient>
        <linearGradient id="gs-step" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6dcae" />
          <stop offset="1" stopColor="#c99a66" />
        </linearGradient>
        <linearGradient id="gs-altar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8301e" />
          <stop offset="1" stopColor="#62170d" />
        </linearGradient>
        <linearGradient id="gs-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f7c84" />
          <stop offset="1" stopColor="#1c4650" />
        </linearGradient>
        <linearGradient id="gs-lantern" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8a1a10" />
          <stop offset="0.5" stopColor="#ff5a3a" />
          <stop offset="1" stopColor="#8a1a10" />
        </linearGradient>
        <radialGradient id="gs-lglow">
          <stop offset="0" stopColor="#ff9a4a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ff9a4a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gs-cglow">
          <stop offset="0" stopColor="#fff0b0" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ffd56e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gs-petal-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd3e0" />
          <stop offset="1" stopColor="#e0628b" />
        </linearGradient>
        <linearGradient id="gs-petal-f" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6f8" />
          <stop offset="1" stopColor="#f59bb9" />
        </linearGradient>
        <radialGradient id="gs-pad" cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#5d9b5c" />
          <stop offset="1" stopColor="#2f6440" />
        </radialGradient>
        <linearGradient id="gs-robe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1edf6" />
          <stop offset="0.55" stopColor="#d6d0e2" />
          <stop offset="1" stopColor="#a49cba" />
        </linearGradient>
        <radialGradient id="gs-hair" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#57444f" />
          <stop offset="1" stopColor="#1f161c" />
        </radialGradient>
        <radialGradient id="gs-vignette" gradientUnits="userSpaceOnUse" cx="800" cy="430" r="1020">
          <stop offset="0.58" stopColor="#2a1430" stopOpacity="0" />
          <stop offset="1" stopColor="#2a1430" stopOpacity="0.6" />
        </radialGradient>
        <linearGradient id="gs-smoke-fade" gradientUnits="userSpaceOnUse" x1="0" y1="600" x2="0" y2="250">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="gs-smoke-mask" maskUnits="userSpaceOnUse" x="660" y="240" width="280" height="360">
          <rect x="660" y="240" width="280" height="360" fill="url(#gs-smoke-fade)" />
        </mask>
        <filter id="gs-soft" x="-50%" y="-20%" width="200%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>

        {/* Màu tượng Phật, toạ độ gốc của bản thử canvas */}
        <linearGradient id="gb-body" gradientUnits="userSpaceOnUse" x1="0" y1="226" x2="0" y2="356">
          <stop offset="0" stopColor="#fff0b8" />
          <stop offset="0.45" stopColor="#f0b84e" />
          <stop offset="1" stopColor="#b47a22" />
        </linearGradient>
        <linearGradient id="gb-lap" gradientUnits="userSpaceOnUse" x1="0" y1="330" x2="0" y2="404">
          <stop offset="0" stopColor="#ffe9a6" />
          <stop offset="0.5" stopColor="#efb64c" />
          <stop offset="1" stopColor="#b47a22" />
        </linearGradient>
        <radialGradient id="gb-sheen" gradientUnits="userSpaceOnUse" cx="282" cy="272" r="80">
          <stop offset="0" stopColor="#fffbe8" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fffbe8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gb-face" gradientUnits="userSpaceOnUse" cx="300" cy="190" r="46" fx="292" fy="180">
          <stop offset="0" stopColor="#fff2c8" />
          <stop offset="0.6" stopColor="#f2c264" />
          <stop offset="1" stopColor="#c08a32" />
        </radialGradient>
        <linearGradient id="gb-petal-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#c0832a" />
        </linearGradient>
        <linearGradient id="gb-petal-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff0b8" />
          <stop offset="1" stopColor="#d08f2e" />
        </linearGradient>
        <clipPath id="gb-head-clip">
          <ellipse cx="300" cy="190" rx="34" ry="40" />
        </clipPath>
        <pattern id="gb-curls" patternUnits="userSpaceOnUse" x="264" y="149" width="6" height="12">
          <circle cx="0" cy="3" r="1.5" fill="#7a4f12" fillOpacity="0.55" />
          <circle cx="3" cy="9" r="1.5" fill="#7a4f12" fillOpacity="0.55" />
          <circle cx="6" cy="3" r="1.5" fill="#7a4f12" fillOpacity="0.55" />
        </pattern>
        <SharedShapes />
      </defs>

      {/* Trời chiều vàng */}
      <rect width="1600" height="1000" fill="url(#gs-sky)" />
      <rect width="1600" height="1000" fill="url(#gs-sunglow)" />

      {/* Núi xa, tháp, sương */}
      <path
        d="M0 330C60 250 110 170 180 120C230 160 250 200 300 150C350 90 400 60 440 100C480 140 500 200 540 250L560 420H0Z"
        fill="url(#gs-mtn-far)"
      />
      <path
        d="M1600 330C1540 250 1490 170 1420 120C1370 160 1350 200 1300 150C1250 90 1200 60 1160 100C1120 140 1100 200 1060 250L1040 420H1600Z"
        fill="url(#gs-mtn-far)"
      />
      <Pagoda x={300} base={340} tiers={7} w0={92} tierH={30} />
      <Pagoda x={1300} base={340} tiers={7} w0={92} tierH={30} />
      <Pagoda x={1470} base={300} tiers={4} w0={60} tierH={24} />
      <Pagoda x={130} base={300} tiers={4} w0={60} tierH={24} />
      <path d="M0 360C120 330 260 350 380 340C470 333 520 350 560 360V470H0Z" fill="url(#gs-mtn-near)" />
      <path d="M1600 360C1480 330 1340 350 1220 340C1130 333 1080 350 1040 360V470H1600Z" fill="url(#gs-mtn-near)" />
      <rect y="280" width="1600" height="160" fill="url(#gs-fog)" />

      {/* Điện hai bên */}
      {[
        { x0: 40, x1: 400 },
        { x0: 1200, x1: 1560 },
      ].map(({ x0, x1 }) => (
        <g key={x0}>
          <rect x={x0 + 20} y="300" width={x1 - x0 - 40} height="230" fill="url(#gs-wall)" />
          <g fill="url(#gs-lattice)" opacity="0.9">
            {Array.from({ length: 4 }, (_, i) => (
              <rect key={i} x={x0 + 45 + i * ((x1 - x0 - 90) / 4)} y="340" width={(x1 - x0 - 90) / 4 - 14} height="150" rx="3" />
            ))}
          </g>
          <path d={roof(x0 + 10, x1 - 10, 300, 250, 26, 30)} fill="url(#gs-roof)" />
          <path d={roofEdge(x0 + 10, x1 - 10, 300, 26, 30)} fill="none" stroke="#fff0b8" strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}

      {/* Cây hoa đào hai bên (phía sau) */}
      <path d="M210 600C200 520 230 460 200 400M200 470C170 440 150 430 120 420" stroke="#5a3226" strokeWidth="12" fill="none" strokeLinecap="round" />
      <path d="M1390 600C1400 520 1370 460 1400 400M1400 470C1430 440 1450 430 1480 420" stroke="#5a3226" strokeWidth="12" fill="none" strokeLinecap="round" />
      <BlossomCanopy x={190} y={380} s={1.25} seed={11} />
      <BlossomCanopy x={1410} y={380} s={1.25} seed={23} />
      <BlossomCanopy x={430} y={470} s={0.62} seed={37} />
      <BlossomCanopy x={1170} y={470} s={0.62} seed={41} />

      {/* Chính điện phía sau tượng */}
      <rect x="420" y="190" width="760" height="330" fill="url(#gs-wall)" />
      <g fill="url(#gs-lattice)" opacity="0.95">
        {[440, 500, 1040, 1100].map((x) => (
          <rect key={x} x={x} y="250" width="44" height="230" rx="3" />
        ))}
      </g>
      <g stroke="#7a2a12" strokeOpacity="0.5" strokeWidth="2">
        {[440, 500, 1040, 1100].map((x) => (
          <path key={x} d={`M${x + 11} 250V480M${x + 22} 250V480M${x + 33} 250V480M${x} 300H${x + 44}M${x} 360H${x + 44}M${x} 420H${x + 44}`} />
        ))}
      </g>
      {[428, 556, 1028, 1156].map((x) => (
        <g key={x}>
          <rect x={x} y="200" width="18" height="320" fill="url(#gs-pillar)" />
          <rect x={x - 3} y="200" width="24" height="10" fill="#f2c25c" />
        </g>
      ))}
      <path d={roof(400, 1200, 200, 140, 34, 46)} fill="url(#gs-roof)" />
      <path d={roofEdge(400, 1200, 200, 34, 46)} fill="none" stroke="#fff3c4" strokeWidth="3.5" strokeLinecap="round" />
      <rect x="560" y="96" width="480" height="48" fill="url(#gs-wall)" />
      <path d={roof(560, 1040, 100, 40, 28, 40)} fill="url(#gs-roof)" />
      <path d={roofEdge(560, 1040, 100, 28, 40)} fill="none" stroke="#fff3c4" strokeWidth="3" strokeLinecap="round" />
      <circle cx="800" cy="30" r="12" fill="url(#gs-gold)" />
      <path d="M800 2c7 8 8 15 0 20-8-5-7-12 0-20z" fill="#ffd56e" />
      <HangingLantern x={480} y={210} len={30} d={-1.2} />
      <HangingLantern x={1120} y={210} len={30} d={-3.4} />
      <HangingLantern x={600} y={214} len={14} d={-2.3} />
      <HangingLantern x={1000} y={214} len={14} d={-0.4} />
      <HangingLantern x={150} y={300} len={10} d={-1.7} />
      <HangingLantern x={290} y={300} len={10} d={-3.9} />
      <HangingLantern x={1310} y={300} len={10} d={-2.8} />
      <HangingLantern x={1450} y={300} len={10} d={-0.9} />

      {/* Hào quang tròn sau tượng Phật */}
      <circle cx="800" cy="268" r="310" fill="url(#gs-halo-glow)" className={styles.haloGlow} />
      <circle cx="800" cy="268" r="212" fill="url(#gs-halo)" />
      <path d={rays(800, 268, 72, 64, 206, 1.4)} fill="#fff8de" fillOpacity="0.55" className={styles.rays} />
      <g fill="none" stroke="#fffaf0" strokeOpacity="0.7">
        <circle cx="800" cy="268" r="206" strokeWidth="3" />
        <circle cx="800" cy="268" r="174" strokeWidth="1.5" />
        <circle cx="800" cy="268" r="110" strokeWidth="1.5" strokeOpacity="0.5" />
      </g>
      <g fill="#ffe6a0" stroke="#d99a3a" strokeOpacity="0.5">
        {haloPetals.map((a) => (
          <path key={a} d="M800 40c6 6 7 14 0 20-7-6-6-14 0-20z" transform={`rotate(${r1(a)} 800 268)`} />
        ))}
      </g>

      {/* Tượng Phật và đài sen */}
      <g data-anchor="buddha" className={styles.buddha}>
        <g transform="translate(800 482) scale(1.24) translate(-300 -432)">
          <Buddha />
        </g>
      </g>
      <g>
        {Array.from({ length: 11 }, (_, i) => (
          <path key={`tb${i}`} d={petal(CX + (i - 5) * 44, 520, 50, 44)} fill="url(#gb-petal-back)" stroke="#8a5a14" strokeOpacity="0.3" />
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <path key={`tf${i}`} d={petal(CX + (i - 4.5) * 46, 530, 52, 40)} fill="#ffb8cc" stroke="#c45a7e" strokeOpacity="0.4" />
        ))}
        <rect x="560" y="528" width="480" height="10" rx="3" fill="url(#gs-gold)" />
      </g>

      {/* Bàn thờ, lễ vật, nến; hoa sen người xem dâng hiện ở đây */}
      <rect x="540" y="538" width="520" height="40" fill="url(#gs-altar)" />
      <rect x="540" y="538" width="520" height="4" fill="#ffd56e" />
      <rect x="552" y="548" width="496" height="24" fill="none" stroke="#f2c25c" strokeOpacity="0.7" strokeWidth="1.5" />
      {[600, 1000].map((x) => (
        <g key={`fruit${x}`}>
          <ellipse cx={x} cy="538" rx="34" ry="7" fill="#f2c25c" />
          <circle cx={x - 16} cy="528" r="11" fill="#f39c33" />
          <circle cx={x + 2} cy="527" r="12" fill="#9cc14a" />
          <circle cx={x + 18} cy="529" r="10" fill="#e8c03a" />
          <circle cx={x - 6} cy="512" r="10" fill="#d9472f" />
          <circle cx={x + 10} cy="511" r="10" fill="#f39c33" />
          <circle cx={x + 2} cy="496" r="9" fill="#9cc14a" />
        </g>
      ))}
      {[680, 920].map((x, i) => (
        <g key={`candle${x}`}>
          <circle cx={x} cy="492" r="22" fill="url(#gs-cglow)" className={styles.glow} style={delay(-i * 1.4)} />
          <rect x={x - 5} y="500" width="10" height="38" fill="#fff6e0" />
          <path d={`M${x - 4} 500Q${x - 5} 492 ${x} 484Q${x + 5} 492 ${x + 4} 500Z`} fill="#ffcf5a" className={styles.flicker} style={delay(-i * 0.7)} />
        </g>
      ))}
      <g data-anchor="altar">
        {[740, 860, 800].map((x, i) => (
          <g key={`off${x}`} className={[styles.offering, styles[`offering${i + 1}`]].join(" ")}>
            <use href="#gs-lotus" transform={`translate(${x} 540) scale(0.62)`} />
          </g>
        ))}
      </g>

      {/* Sân, lối đi, bậc */}
      <path d="M0 560H1600V1000H0Z" fill="url(#gs-ground)" />
      <path d="M660 578H940L1120 1000H480Z" fill="url(#gs-path)" />
      <g stroke="#a8784a" strokeOpacity="0.35" strokeWidth="2">
        <path d="M640 640H960M600 720H1000M560 820H1040M520 920H1080" />
      </g>
      {Array.from({ length: 3 }, (_, k) => (
        <rect key={`st${k}`} x={690 - k * 12} y={578 + k * 14} width={220 + k * 24} height="14" fill="url(#gs-step)" stroke="#c48f58" strokeOpacity="0.5" />
      ))}

      <StoneLantern x={620} base={640} s={0.62} d={-0.5} />
      <StoneLantern x={980} base={640} s={0.62} d={-1.9} />
      <StoneLantern x={470} base={720} s={0.82} d={-2.6} />
      <StoneLantern x={1130} base={720} s={0.82} d={-3.3} />
      <StoneLantern x={600} base={880} s={0.95} d={-1.1} />
      <StoneLantern x={1000} base={880} s={0.95} d={-2.9} />

      {/* Lư hương lớn, nhang, khói */}
      <g data-anchor="burner">
        <circle cx="800" cy="560" r="150" fill="url(#gs-cglow)" opacity="0.6" />
        <g stroke="#7a2416" strokeWidth="3" strokeLinecap="round">
          {[-28, -21, -14, -7, 0, 7, 14, 21, 28].map((dx, i) => (
            <path key={`stick${dx}`} d={`M${800 + dx * 0.6} 598L${800 + dx * 1.3} ${470 + (i % 3) * 8}`} stroke="#c8352a" />
          ))}
        </g>
        <g fill="#ffcf6b">
          {[-28, -21, -14, -7, 0, 7, 14, 21, 28].map((dx, i) => (
            <circle key={`tip${dx}`} cx={800 + dx * 1.3} cy={470 + (i % 3) * 8} r="2.6" className={styles.ember} style={delay(-i * 0.4)} />
          ))}
        </g>
        <g className={styles.userIncense}>
          <circle cx="800" cy="452" r="34" fill="url(#gs-cglow)" />
          <g stroke="#e0402e" strokeWidth="3.4" strokeLinecap="round">
            <path d="M792 598L780 446M800 598V440M808 598L820 446" />
          </g>
          <g fill="#fff0a0">
            <circle cx="780" cy="446" r="3.4" />
            <circle cx="800" cy="440" r="3.4" />
            <circle cx="820" cy="446" r="3.4" />
          </g>
        </g>
        <rect x="704" y="690" width="192" height="22" rx="4" fill="url(#gs-stone-dark)" />
        <rect x="704" y="690" width="192" height="4" fill="#f2c25c" />
        <path d="M712 660C706 676 704 686 712 692H730C726 682 728 670 734 662Z" fill="#8a5a22" />
        <path d="M888 660C894 676 896 686 888 692H870C874 682 872 670 866 662Z" fill="#8a5a22" />
        <path d="M790 668L788 692H812L810 668Z" fill="#8a5a22" />
        <path d="M690 600C686 648 728 680 800 680C872 680 914 648 910 600Z" fill="url(#gs-bronze)" />
        <path d="M698 626C740 640 860 640 902 626" fill="none" stroke="#7a4e1c" strokeWidth="3" />
        <g fill="#ffe08a">
          {[-90, -60, -30, 0, 30, 60, 90].map((dx) => (
            <circle key={`stud${dx}`} cx={800 + dx} cy={634 - Math.abs(dx) * 0.06} r="3.4" />
          ))}
        </g>
        <path d="M712 614C718 646 748 664 784 668" fill="none" stroke="#fff3c4" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" />
        <g fill="none" stroke="#e9b04a" strokeWidth="6" strokeLinecap="round">
          <path d="M688 606C664 604 660 574 678 566C690 560 702 570 698 588" />
          <path d="M912 606C936 604 940 574 922 566C910 560 898 570 902 588" />
        </g>
        <ellipse cx="800" cy="600" rx="116" ry="15" fill="#f2c25c" />
        <ellipse cx="800" cy="600" rx="102" ry="10" fill="#5a3a1a" />
      </g>
      <g mask="url(#gs-smoke-mask)" filter="url(#gs-soft)" fill="none" stroke="#fffaf0" strokeLinecap="round">
        <path className={styles.smoke} d="M800 470C786 430 814 400 798 360C782 320 812 292 796 252" strokeOpacity="0.6" strokeWidth="6" />
        <path className={styles.smoke} style={delay(-2.6, 9)} d="M786 478C806 440 772 410 794 372C816 336 786 304 806 268" strokeOpacity="0.45" strokeWidth="5" />
        <path className={styles.smoke} style={delay(-5, 10)} d="M816 478C796 446 822 418 804 384C786 352 812 322 798 290" strokeOpacity="0.4" strokeWidth="5" />
        <path className={[styles.smoke, styles.userSmoke].join(" ")} style={delay(-1.2, 7)} d="M800 444C780 404 822 372 798 330C774 290 818 262 794 222" strokeOpacity="0.7" strokeWidth="7" />
      </g>

      {/* Phật tử (trang trí) */}
      {PEOPLE.map((p, i) => (
        <use key={`p${i}`} href={`#${p.kind}`} transform={`translate(${p.x} ${p.y}) scale(${p.flip ? -p.s : p.s} ${p.s})`} />
      ))}

      {/* Phật tử ở giữa là "bạn": cúi lạy khi người xem bấm "Chắp tay lễ Phật" */}
      <g data-anchor="self" transform="translate(800 780)">
        <ellipse cx="0" cy="0" rx="46" ry="10" fill="none" stroke="#ffe08a" strokeOpacity="0.8" strokeWidth="2.5" className={styles.selfRing} />
        <g className={styles.self}>
          <use href="#gs-kneel" transform="scale(1.18)" />
        </g>
      </g>

      {/* Hồ sen phía trước */}
      <path d="M-20 820C80 800 200 810 300 850C340 880 340 960 320 1010H-20Z" fill="url(#gs-water)" />
      <path d="M1620 820C1520 800 1400 810 1300 850C1260 880 1260 960 1280 1010H1620Z" fill="url(#gs-water)" />
      <g stroke="#ffe3a8" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" className={styles.shimmer}>
        <path d="M40 880h50M110 930h70M30 980h40M1510 880h50M1420 930h70M1530 980h40" />
      </g>
      <g fill="url(#gs-pad)" stroke="#a6d7a0" strokeOpacity="0.3">
        {POND_PADS.map(([x, y, rx, ry, notch]) => (
          <path key={`pad${x}-${y}`} d={lilyPad(x, y, rx, ry, notch)} />
        ))}
      </g>
      {POND_BUDS.map(([x, y, s]) => (
        <use key={`bud${x}-${y}`} href="#gs-bud" transform={`translate(${x} ${y}) scale(${s})`} />
      ))}
      {POND_LOTUS.map(([x, y, s]) => (
        <use key={`lotus${x}-${y}`} href="#gs-lotus" transform={`translate(${x} ${y}) scale(${s})`} />
      ))}

      {/* Cành đào và đèn lồng ở hai góc trên */}
      <path d="M-10 40C80 30 150 70 240 60C300 54 340 30 380 20" stroke="#5a3226" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M1610 40C1520 30 1450 70 1360 60C1300 54 1260 30 1220 20" stroke="#5a3226" strokeWidth="9" fill="none" strokeLinecap="round" />
      <BlossomCanopy x={150} y={60} s={0.7} seed={53} />
      <BlossomCanopy x={1450} y={60} s={0.7} seed={67} />
      <HangingLantern x={60} y={0} len={60} d={-0.8} />
      <HangingLantern x={1540} y={0} len={60} d={-2.2} />

      {/* Cánh hoa rơi, đốm sáng */}
      <g fill="#f9b3c8">
        {[
          [260, 140, -1], [420, 90, -5], [1180, 120, -8], [1340, 160, -11], [600, 60, -14], [1010, 80, -3],
        ].map(([x, y, d]) => (
          <ellipse key={`pt${x}`} cx={x} cy={y} rx="6" ry="3.5" className={styles.petal} style={delay(d)} />
        ))}
      </g>
      <g fill="#fff3b8">
        {[
          [700, 420, 3, 0], [900, 380, 2.6, -1.5], [760, 300, 3.2, -3], [860, 520, 2.6, -4.5], [640, 360, 2.4, -6],
          [960, 330, 3, -7.5], [820, 600, 2.6, -2.2], [580, 470, 2.4, -8.6], [1020, 460, 2.8, -5.3], [740, 560, 2.4, -9.4],
        ].map(([x, y, r, d]) => (
          <circle key={`m${x}-${y}`} cx={x} cy={y} r={r} className={styles.mote} style={delay(d)} />
        ))}
      </g>

      <rect width="1600" height="1000" fill="url(#gs-vignette)" />
    </svg>
  );
}
