import type { Metadata } from "next";
import { TempleScene } from "@/components/TempleScene";
import { TempleSpace } from "@/components/TempleSpace";
import { pageByHref } from "@/lib/site";

const PAGE = pageByHref("/khong-gian-le-phat/");

export const metadata: Metadata = {
  title: PAGE.label,
  description: PAGE.description,
};

// Không gian lễ Phật toàn cảnh: tranh chiếm cả màn hình, chỉ giữ 4 nút nghi thức và nhạc chuông.
export default function TempleSpacePage() {
  return <TempleSpace variant="immersive" srTitle={PAGE.label} scene={<TempleScene />} />;
}
