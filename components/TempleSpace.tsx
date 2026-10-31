"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/icons";
import { PrayerBookList, PrayerChips } from "@/components/prayers";
import { sound, useSound } from "@/components/sound";
import { useFullscreen } from "@/components/useFullscreen";
import { usePrayerBook } from "@/components/usePrayerBook";
import { SPACE_ACTIONS, type Prayer, type SpaceAction } from "@/lib/site";

/*
  Không gian lễ Phật theo ảnh mẫu: tranh chính điện ở giữa, các khung kính tối đặt lên tranh.
  - variant "home": trang chủ, đủ các khung như ảnh (khung trái: sổ lời nguyện; khung phải: chọn lời nguyện;
    dưới trái: nhạc chuông; giữa: 4 nút nghi thức; dưới phải: giới thiệu, thay khung ủng hộ đang khóa).
  - variant "immersive": trang Không gian lễ Phật, tranh toàn cảnh, chỉ giữ nút nghi thức và nhạc chuông.
  Mọi thao tác chỉ chạy trên máy người xem: không đếm lượt, không gửi gì lên mạng (lib/flags.ts).
  Hình trong tranh đổi theo các thuộc tính data-* trên khung bao (components/TempleScene.module.css).
*/

type Props = {
  scene: ReactNode;
  variant: "home" | "immersive";
  /** Tiêu đề trang cho trình đọc màn hình (trang Không gian lễ Phật). */
  srTitle?: string;
};

type Notice = { text: string; key: number };

const TONE_CLASS: Record<SpaceAction["tone"], string> = {
  amber: "medallion-amber",
  rose: "medallion-rose",
  sapphire: "medallion-sapphire",
  amethyst: "medallion-amethyst",
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isWide = () => typeof window !== "undefined" && window.matchMedia("(min-width: 64rem)").matches;

export function TempleSpace({ scene, variant, srTitle }: Props) {
  const { add } = usePrayerBook();
  const { playing } = useSound();
  const fullscreen = useFullscreen();

  const [lit, setLit] = useState(false);
  const [offered, setOffered] = useState(0);
  const [bowing, setBowing] = useState(false);
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [bubble, setBubble] = useState<Notice | null>(null);
  const [bubblePos, setBubblePos] = useState<{ x: number; y: number } | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [attention, setAttention] = useState(false);

  const spaceRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLSpanElement>(null);
  const chooserRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const say = useCallback((text: string) => setNotice({ text, key: Date.now() }), []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4500);
    return () => clearTimeout(timer);
  }, [notice]);

  // Vị trí bong bóng lời nguyện: ngay trên đầu Phật tử "bạn" trong tranh.
  const placeBubble = useCallback(() => {
    const stage = stageRef.current;
    const self = stage?.querySelector('[data-anchor="self"]');
    if (!stage || !self) return;
    const s = stage.getBoundingClientRect();
    const r = self.getBoundingClientRect();
    setBubblePos({ x: r.left + r.width / 2 - s.left, y: r.top - s.top });
  }, []);
  useEffect(() => {
    if (!bubble) return;
    placeBubble();
    window.addEventListener("resize", placeBubble);
    const timer = setTimeout(() => setBubble(null), 7000);
    return () => {
      window.removeEventListener("resize", placeBubble);
      clearTimeout(timer);
    };
  }, [bubble, placeBubble]);

  const lightIncense = () => {
    if (lit) {
      setLit(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setLit(true)));
    } else {
      setLit(true);
    }
    sound.strikeIfPlaying();
    say("Đã thắp một nén tâm hương");
  };

  const offerLotus = () => {
    const done = () => {
      setOffered((n) => Math.min(3, n + 1));
      say("Đã dâng hoa sen lên bàn thờ");
    };
    const stage = stageRef.current;
    const flyer = floatRef.current;
    const from = stage?.querySelector('[data-anchor="self"]');
    const to = stage?.querySelector('[data-anchor="altar"]');
    if (prefersReducedMotion() || !stage || !flyer || !from || !to || typeof flyer.animate !== "function") {
      done();
      return;
    }
    const s = stage.getBoundingClientRect();
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    const x0 = a.left + a.width / 2 - s.left;
    const y0 = a.top - s.top;
    const x1 = b.left + b.width / 2 - s.left;
    const y1 = b.top + b.height / 2 - s.top;
    flyer
      .animate(
        [
          { transform: `translate(${x0}px, ${y0}px) translate(-50%, -50%) scale(0.6)`, opacity: 0 },
          { transform: `translate(${x0}px, ${y0 - 40}px) translate(-50%, -50%) scale(1)`, opacity: 1, offset: 0.2 },
          { transform: `translate(${x1}px, ${y1}px) translate(-50%, -50%) scale(0.7)`, opacity: 1, offset: 0.9 },
          { transform: `translate(${x1}px, ${y1}px) translate(-50%, -50%) scale(0.5)`, opacity: 0 },
        ],
        { duration: 1700, easing: "ease-in-out" },
      )
      .finished.then(done, done);
  };

  const bow = () => {
    if (bowing) return;
    setBowing(true);
    sound.strikeIfPlaying();
    later(() => sound.strikeIfPlaying(), 1500);
    later(() => sound.strikeIfPlaying(), 3000);
    later(() => setBowing(false), prefersReducedMotion() ? 600 : 4600);
    say("Đã chắp tay lễ Phật");
  };

  const openChooser = () => {
    if (variant === "immersive") {
      dialogRef.current?.showModal();
      return;
    }
    const panel = chooserRef.current;
    if (!panel) return;
    if (!isWide()) panel.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    panel.querySelector<HTMLButtonElement>("button[data-prayer]")?.focus({ preventScroll: isWide() });
    setAttention(true);
    later(() => setAttention(false), 1600);
  };

  const choose = (prayer: Prayer) => {
    add(prayer.id);
    setChosenId(prayer.id);
    placeBubble();
    setBubble({ text: prayer.text, key: Date.now() });
    say(`Đã ghi lời nguyện "${prayer.text}" vào sổ trên máy của bạn`);
    if (dialogRef.current?.open) dialogRef.current.close();
  };

  const run: Record<SpaceAction["id"], () => void> = {
    "thap-huong": lightIncense,
    "dang-hoa": offerLotus,
    "le-phat": bow,
    "loi-nguyen": openChooser,
  };

  const soundButton = (
    <button type="button" className="side-btn" aria-pressed={playing} onClick={() => sound.toggle()} data-testid="side-sound">
      <span className="side-btn-icon">
        <Icon name={playing ? "pause" : "music"} className="h-5 w-5" />
      </span>
      <span className="side-btn-label">Nhạc thiền</span>
    </button>
  );

  return (
    <section
      ref={spaceRef}
      className="space"
      data-variant={variant}
      data-incense={lit ? "lit" : undefined}
      data-offered={offered > 0 ? String(offered) : undefined}
      data-bowing={bowing ? "true" : undefined}
      aria-label="Không gian lễ Phật"
      data-testid="temple-space"
    >
      {srTitle ? <h1 className="sr-only">{srTitle}</h1> : null}

      <div ref={stageRef} className="space-stage" data-testid="hero-scene">
        <div className="space-art">{scene}</div>

        {variant === "home" ? (
          <div className="facts-mobile glass" aria-hidden="true">
            <Facts />
          </div>
        ) : null}

        <div className="side-tools">
          {soundButton}
          {fullscreen.supported ? (
            <button type="button" className="side-btn" aria-pressed={fullscreen.active} onClick={fullscreen.toggle}>
              <span className="side-btn-icon">
                <Icon name={fullscreen.active ? "close" : "fullscreen"} className="h-5 w-5" />
              </span>
              <span className="side-btn-label">{fullscreen.active ? "Thoát" : "Toàn màn hình"}</span>
            </button>
          ) : null}
        </div>

        {bubble && bubblePos ? (
          <div key={`bubble-${bubble.key}`} className="self-bubble" style={{ left: bubblePos.x, top: bubblePos.y }} data-testid="self-bubble">
            <span className="self-bubble-text">{bubble.text}</span>
            <span className="self-bubble-name">Bạn</span>
          </div>
        ) : null}
        <span ref={floatRef} className="float-lotus" aria-hidden="true">
          <Icon name="lotus" className="h-9 w-9" />
        </span>

        {notice ? (
          <p key={`toast-${notice.key}`} className="toast" aria-hidden="true">
            <Icon name="check" className="h-4 w-4 shrink-0" />
            {notice.text}
          </p>
        ) : null}

        <div className="dock-wrap">
          <div className="dock glass">
            <ul className="dock-list">
              {SPACE_ACTIONS.map((action) => (
                <li key={action.id}>
                  <button
                    type="button"
                    className="dock-btn group"
                    data-action={action.id}
                    aria-pressed={action.id === "thap-huong" ? lit : undefined}
                    onClick={run[action.id]}
                  >
                    <span className={`medallion ${TONE_CLASS[action.tone]}`}>
                      <Icon name={action.icon} className="medallion-icon" />
                    </span>
                    <span className={["dock-label", action.id === "thap-huong" ? "text-gold-light" : ""].join(" ")}>
                      {/* Nhãn đầy đủ khi đủ chỗ (640–1023px, từ 1280px); còn lại dùng nhãn ngắn như ảnh mẫu điện thoại. */}
                      <span className="hidden sm:inline lg:hidden xl:inline">{action.label}</span>
                      <span className="sm:hidden lg:inline xl:hidden">{action.short}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <p className="dock-note">Tất cả tính năng đều miễn phí • Cùng nhau giữ tâm an lành</p>
        </div>
      </div>

      {variant === "home" ? (
        <>
          <section
            ref={chooserRef}
            className="space-panel panel-tr glass"
            data-attention={attention ? "true" : undefined}
            aria-labelledby="chon-loi-nguyen"
            data-testid="prayer-chooser"
          >
            <div className="panel-head">
              <h2 id="chon-loi-nguyen" className="panel-title">
                <Icon name="lotus" className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
                Chọn lời nguyện của bạn
              </h2>
              <Link href="/loi-nguyen/" className="panel-more">
                Xem tất cả
                <Icon name="chevron" className="h-4 w-4" />
              </Link>
            </div>
            <PrayerChips onChoose={choose} chosenId={chosenId} />
          </section>

          <section className="space-panel panel-tl glass" aria-labelledby="loi-nguyen-cua-ban" data-testid="book-panel">
            <div className="facts-desktop">
              <Facts />
            </div>
            <h2 id="loi-nguyen-cua-ban" className="panel-title panel-title-sm">
              <Icon name="bubble" className="h-5 w-5 shrink-0" />
              Lời nguyện của bạn
            </h2>
            <PrayerBookList limit={4} moreHref="/loi-nguyen/" emptyHint="Chưa có lời nguyện nào. Chọn một câu ở khung “Chọn lời nguyện của bạn”, lời nguyện sẽ hiện ở đây." />
          </section>

          <MusicPlayer className="space-panel panel-bl glass" />

          <aside className="space-panel panel-br glass" aria-labelledby="ve-cauphuc">
            <h2 id="ve-cauphuc" className="panel-title panel-title-sm">
              <Icon name="heart" className="h-5 w-5 shrink-0 text-lotus" />
              Về cauphuc.com
            </h2>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-ivory/90">
              Không gian cầu bình an trực tuyến, độc lập, không phải chùa. Mọi nghi thức đều miễn phí, không bán lời nguyện, không bán lượt thắp hương.
            </p>
            <Link href="/huong-dan/" className="btn-primary btn-block mt-3">
              Xem hướng dẫn
              <Icon name="chevron" className="h-4 w-4" />
            </Link>
            <p className="mt-2 text-center text-[0.78rem] leading-snug text-mist">Không có ô chat, không đo truy cập, không thu dữ liệu của bạn.</p>
          </aside>
        </>
      ) : (
        <>
          <MusicPlayer className="space-panel panel-bl glass immersive-only" />
          <dialog ref={dialogRef} className="prayer-dialog glass" aria-labelledby="dialog-title" data-testid="prayer-dialog">
            <div className="panel-head">
              <h2 id="dialog-title" className="panel-title">
                <Icon name="lotus" className="h-6 w-6 shrink-0" />
                Chọn lời nguyện
              </h2>
              <button type="button" className="icon-btn" aria-label="Đóng" onClick={() => dialogRef.current?.close()}>
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            <PrayerChips onChoose={choose} chosenId={chosenId} variant="list" />
            <p className="mt-3 text-[0.82rem] text-mist">Lời nguyện chỉ lưu trên máy của bạn, không gửi đi đâu.</p>
          </dialog>
          <section className="wrap mt-8" aria-labelledby="so-cua-ban">
            <h2 id="so-cua-ban" className="panel-title">
              <Icon name="bubble" className="h-5 w-5 shrink-0" />
              Lời nguyện của bạn
            </h2>
            <div className="mt-3 max-w-xl">
              <PrayerBookList limit={5} moreHref="/loi-nguyen/" emptyHint="Chưa có lời nguyện nào. Bấm nút “Chọn lời nguyện” trong không gian lễ Phật." />
            </div>
          </section>
        </>
      )}

      <p className="sr-only" aria-live="polite">
        {notice?.text ?? ""}
      </p>
    </section>
  );
}

function Facts() {
  return (
    <ul className="facts">
      <li className="fact">
        <Icon name="lotus" className="fact-icon text-lotus" />
        <span>
          <span className="fact-big">Miễn phí</span>
          <span className="fact-small">mọi nghi thức</span>
        </span>
      </li>
      <li className="fact">
        <Icon name="shield" className="fact-icon text-gold" />
        <span>
          <span className="fact-big">Riêng tư</span>
          <span className="fact-small">lời nguyện chỉ lưu trên máy bạn</span>
        </span>
      </li>
    </ul>
  );
}

function MusicPlayer({ className }: { className: string }) {
  const { playing, volume, supported } = useSound();
  return (
    <div className={className} data-testid="music-player">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="music-btn"
          aria-pressed={playing}
          aria-label={playing ? "Tắt tiếng chuông" : "Bật tiếng chuông"}
          onClick={() => sound.toggle()}
          disabled={!supported}
        >
          <Icon name={playing ? "pause" : "music"} className="h-6 w-6" />
        </button>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold leading-tight text-ivory">Nhạc thiền</span>
          <span className="block text-[0.8rem] leading-tight text-mist">{supported ? "Tiếng chuông chùa" : "Máy này không phát được âm thanh"}</span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={Math.round(volume * 100)}
            onChange={(event) => sound.setVolume(Number(event.target.value) / 100)}
            className="volume"
            aria-label="Âm lượng tiếng chuông"
          />
        </span>
        <Icon name={volume === 0 ? "mute" : "volume"} className="h-5 w-5 shrink-0 text-ivory/80" />
      </div>
    </div>
  );
}
