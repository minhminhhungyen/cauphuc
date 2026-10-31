# cauphuc.com

Cùng nhau cầu bình an – Lan tỏa lòng từ bi.

Website nội dung về Phật pháp ứng dụng, thiền, bình an và lối sống thiện lành. Trang xuất tĩnh bằng Next.js và đặt trên Hostinger Business.

- Hướng dẫn cho AI làm việc trong repo: [CLAUDE.md](CLAUDE.md)
- Tài liệu định hướng: [docs/research-pack](docs/research-pack/README.md)
- Sổ giấy phép tài nguyên: [data/ASSET_LICENSE_REGISTER.csv](data/ASSET_LICENSE_REGISTER.csv)

## Tiến độ

| Module | Trạng thái |
| --- | --- |
| 1. Bố cục, menu, responsive | Xong, đã đổi sang tông đêm – vàng kim theo ảnh thiết kế; chờ Sếp duyệt |
| 2. Trang chủ | Chưa làm. Đã có tranh chính điện, 4 nghi thức và danh sách chuyên mục; phần nội dung còn lại làm ở module này |
| 3. Trang nội dung | Chưa làm |
| 4. Trình phát audio | Chưa làm |
| 5. Thiền và tĩnh tâm | Chưa làm |
| 6. Không gian bình an dạng tĩnh | Chưa làm |
| 7. SEO | Chưa làm |
| 8. Trang chính sách (bản nháp) | Chưa làm |
| 9. Kiểm thử | Chưa làm |
| 10. Hướng dẫn deploy Hostinger | Chưa làm |

Trang đang đặt `noindex` (`LAUNCHED = false` trong `lib/site.ts`) để máy tìm kiếm không lập chỉ mục bản đang dựng.

## Chạy trên máy

Cần Node.js từ 20.9 trở lên (đã thử với Node 22).

```bash
npm install
npm run dev        # xem bản đang làm ở http://localhost:3000
npm run build      # xuất trang tĩnh vào thư mục out/
npm run serve:out  # xem bản build ở http://127.0.0.1:4173, giống cách Hostinger phục vụ
npm run check      # lint, typecheck, test, build, kiểm thử trình duyệt
```

Kiểm thử trình duyệt dùng Playwright 1.63.0. Máy mới cần cài trình duyệt một lần: `npx playwright install chromium`.

## Cấu trúc

```text
app/                  trang (App Router); app/[section]/ là trang giữ chỗ cho các mục chưa làm
components/           thanh đầu, menu điện thoại, thanh lối tắt ở đáy, chân trang, tranh chính điện, biểu tượng
lib/site.ts           menu, liên kết chân trang, đơn vị vận hành, LAUNCHED
lib/flags.ts          công tắc tính năng; các tính năng đang khóa phải luôn tắt
lib/placeholders.ts   danh sách trang giữ chỗ (xóa mục khi làm trang thật)
public/licenses/      giấy phép phông chữ (SIL OFL 1.1)
scripts/serve-out.mjs máy chủ tĩnh để xem và kiểm thử out/
tests/unit/           kiểm thử đơn vị (node --test, chạy thẳng TypeScript), có kiểm độ tương phản màu chữ
tests/e2e/            kiểm thử trình duyệt ở 360, 768, 1024, 1280 px
prototypes/           bản thử chính điện ngày 31/10, không deploy
docs/research-pack/   tài liệu định hướng gốc
```

## Ghi chú kỹ thuật

- Next.js 16.4.2, React 19.3.1, TypeScript 5.9.3, Tailwind CSS 4.3.3. Phiên bản cố định chính xác, chọn bản đã phát hành ít nhất 2 tuần (tính đến 31/10/2026).
- ESLint 9.39.5 là bản Next.js 16.4.2 dùng trong mẫu chính thức. npm báo ESLint 9 đã hết hỗ trợ, nhưng các plugin react, import, jsx-a11y của Next chưa nhận ESLint 10. Nâng cấp khi Next hỗ trợ.
- Phông Be Vietnam Pro (chữ thường) và Lora (tiêu đề) lưu ngay trên hosting qua gói Fontsource, không tải từ Google Fonts.
- Tranh chính điện ở trang chủ là SVG viết tay trong `components/TempleScene.tsx`, không dùng tệp ảnh. Chuyển động (khói trầm, đèn lồng, sao, hào quang) chạy bằng CSS, tự tắt khi máy bật "giảm chuyển động".
- `AGENTS.md` do `next dev` tự tạo khi phát hiện công cụ AI; đầu tệp trỏ về `CLAUDE.md`.
- `output: 'export'` và `trailingSlash: true`: mỗi trang là một thư mục có index.html, đường dẫn lạ ra `out/404.html`. Cấu hình .htaccess cho Hostinger làm ở module 10.
