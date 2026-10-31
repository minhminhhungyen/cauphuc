"use client";

import { useSyncExternalStore } from "react";

// Toàn màn hình cho cả trang. iPhone không hỗ trợ (chỉ video được toàn màn hình), khi đó nút tự ẩn.

function subscribe(listener: () => void) {
  document.addEventListener("fullscreenchange", listener);
  return () => document.removeEventListener("fullscreenchange", listener);
}

export function useFullscreen() {
  const supported = useSyncExternalStore(
    () => () => {},
    () => Boolean(document.fullscreenEnabled),
    () => false,
  );
  const active = useSyncExternalStore(
    subscribe,
    () => Boolean(document.fullscreenElement),
    () => false,
  );
  const toggle = () => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    else void document.documentElement.requestFullscreen().catch(() => {});
  };
  return { supported, active, toggle };
}
