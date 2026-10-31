# Technical Direction

Ưu tiên tận dụng repository hiện tại. Nếu phù hợp: Next.js, React, TypeScript, Tailwind CSS, static export và Hostinger Business Web Hosting.

Không nâng cấp framework/dependencies nếu không có lý do rõ. Xác minh output folder thực tế; kiểm tra homepage, route con, refresh, assets, 404, sitemap, robots sau deploy.

Chưa cần FastAPI, PostgreSQL, Redis, WebSocket, Docker, auth hoặc payment trong MVP nếu chưa có nhu cầu thực tế.

Hiệu năng: mobile-first, WebP/AVIF, lazy load, audio không autoplay, tối ưu font, hạn chế JS/dependencies.

Bảo mật: không đưa secret vào frontend; thu thập dữ liệu tối thiểu; kiểm tra dependencies/cấu hình; xử lý an toàn input nếu sau này có form.
