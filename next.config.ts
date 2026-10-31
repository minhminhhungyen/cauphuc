import type { NextConfig } from "next";

// Xuất trang tĩnh (thư mục out/) để đặt lên Hostinger Business, không cần máy chủ Node.
const nextConfig: NextConfig = {
  output: "export",
  // Mỗi trang thành thư mục có index.html: làm mới trang con trên Hostinger không bị 404.
  trailingSlash: true,
  // Trang tĩnh không có máy chủ tối ưu ảnh; ảnh phải được nén sẵn (WebP/AVIF) trước khi đưa vào public/.
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
