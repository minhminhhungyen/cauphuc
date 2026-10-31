"use client";

import { Icon } from "@/components/icons";
import { sound, useSound } from "@/components/sound";
import { useFullscreen } from "@/components/useFullscreen";

// Nút nhạc chuông và toàn màn hình trên thanh đầu (từ 1024px), như ảnh mẫu bản máy tính bảng.
export function HeaderTools() {
  const { playing, supported } = useSound();
  const fullscreen = useFullscreen();
  return (
    <div className="hidden items-center gap-1 lg:flex">
      <button
        type="button"
        className="icon-btn"
        aria-pressed={playing}
        aria-label={playing ? "Tắt tiếng chuông" : "Bật tiếng chuông"}
        title={playing ? "Tắt tiếng chuông" : "Bật tiếng chuông"}
        onClick={() => sound.toggle()}
        disabled={!supported}
        data-testid="header-sound"
      >
        <Icon name={playing ? "pause" : "music"} className="h-5 w-5" />
      </button>
      {fullscreen.supported ? (
        <button
          type="button"
          className="icon-btn"
          aria-pressed={fullscreen.active}
          aria-label={fullscreen.active ? "Thoát toàn màn hình" : "Toàn màn hình"}
          title={fullscreen.active ? "Thoát toàn màn hình" : "Toàn màn hình"}
          onClick={fullscreen.toggle}
        >
          <Icon name={fullscreen.active ? "close" : "fullscreen"} className="h-5 w-5" />
        </button>
      ) : null}
    </div>
  );
}
