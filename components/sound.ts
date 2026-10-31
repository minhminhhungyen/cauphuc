"use client";

import { useSyncExternalStore } from "react";

// "Nhạc thiền – Tiếng chuông chùa": tiếng chuông tổng hợp bằng Web Audio ngay trên máy (data/ASSET_LICENSE_REGISTER.csv, mã AUDIO-001).
// Không dùng tệp ghi âm, không tải gì từ mạng. Không tự phát: chỉ kêu sau khi người xem bấm bật.
// Công thức chuông lấy từ bản thử ngày 31/10 (prototypes/chinh-dien-v0.html).

type SoundState = { playing: boolean; volume: number; supported: boolean };

const INTERVAL_MS = 10_000;
const listeners = new Set<() => void>();
let state: SoundState = { playing: false, volume: 0.7, supported: true };
const SERVER_STATE: SoundState = { playing: false, volume: 0.7, supported: true };

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;

function emit(next: Partial<SoundState>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

function ensure(): AudioContext | null {
  if (!ctx) {
    const Ctor: typeof AudioContext | undefined =
      typeof window === "undefined"
        ? undefined
        : window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) {
      emit({ supported: false });
      return null;
    }
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = state.volume * 0.9;
    master.connect(ctx.destination);
    const len = Math.floor(ctx.sampleRate * 0.08);
    noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Một tiếng chuông: các họa âm tắt dần như chuông đồng. */
function strikeNow() {
  const a = ensure();
  if (!a || !master || !noise) return;
  const t = a.currentTime + 0.01;
  const f0 = 294;
  const partials: [number, number, number][] = [
    [1, 1, 7],
    [1.004, 0.5, 6.5],
    [2.71, 0.45, 4],
    [5.15, 0.22, 2.4],
    [8.1, 0.1, 1.3],
  ];
  for (const [ratio, amp, decay] of partials) {
    const osc = a.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f0 * ratio;
    const gain = a.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(amp * 0.32, t + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    osc.connect(gain).connect(master);
    osc.start(t);
    osc.stop(t + decay + 0.1);
  }
  const hit = a.createBufferSource();
  hit.buffer = noise;
  const hp = a.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 2500;
  const hitGain = a.createGain();
  hitGain.gain.setValueAtTime(0.25, t);
  hitGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
  hit.connect(hp).connect(hitGain).connect(master);
  hit.start(t);
  hit.stop(t + 0.08);
}

function loop() {
  strikeNow();
  timer = setTimeout(loop, INTERVAL_MS);
}

export const sound = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => state,
  getServerSnapshot: () => SERVER_STATE,
  /** Bật/tắt chuông. Phải gọi từ thao tác của người xem (trình duyệt chặn âm thanh tự phát). */
  toggle() {
    if (state.playing) {
      if (timer) clearTimeout(timer);
      timer = null;
      emit({ playing: false });
      return;
    }
    if (!ensure()) return;
    emit({ playing: true });
    loop();
  },
  setVolume(volume: number) {
    const v = Math.min(1, Math.max(0, volume));
    if (master) master.gain.value = v * 0.9;
    emit({ volume: v });
  },
  /** Gõ một tiếng chuông kèm nghi thức, chỉ khi người xem đang bật chuông. */
  strikeIfPlaying() {
    if (state.playing) strikeNow();
  },
};

export function useSound(): SoundState {
  return useSyncExternalStore(sound.subscribe, sound.getSnapshot, sound.getServerSnapshot);
}
