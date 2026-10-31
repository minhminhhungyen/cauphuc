# cauphuc.com

Cùng nhau cầu bình an – Lan tỏa lòng từ bi.

Website nội dung về Phật pháp ứng dụng, thiền, bình an và lối sống thiện lành. Trang xuất tĩnh bằng Next.js và đặt trên Hostinger Business.

- Hướng dẫn cho AI làm việc trong repo: [CLAUDE.md](CLAUDE.md)
- Tài liệu định hướng: [docs/research-pack](docs/research-pack/README.md)
- Sổ giấy phép tài nguyên: [data/ASSET_LICENSE_REGISTER.csv](data/ASSET_LICENSE_REGISTER.csv)

## Tiến độ

| Module | Trạng thái |
| --- | --- |
| 1. Bố cục, menu, responsive | Xong, giao diện theo ảnh mẫu Sếp gửi; chờ Sếp duyệt |
| 2. Trang chủ | Phần lớn đã có theo ảnh mẫu (không gian lễ Phật, chuyên mục); còn nội dung bài viết |
| 3. Trang nội dung | Chưa làm |
| 4. Trình phát audio | Mới có tiếng chuông tổng hợp (không dùng tệp ghi âm); trình phát bài đọc chưa làm |
| 5. Thiền và tĩnh tâm | Chưa làm |
| 6. Không gian bình an dạng tĩnh | Đã có theo ảnh mẫu: trang Không gian lễ Phật, Lời nguyện, Hướng dẫn |
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
components/           thanh đầu, menu, thanh lối tắt, chân trang, tranh chính điện, không gian lễ Phật, sổ lời nguyện, chuông
lib/site.ts           menu, lời nguyện có sẵn, liên kết chân trang, đơn vị vận hành, LAUNCHED
lib/prayer-book.ts    sổ lời nguyện (chỉ lưu trên máy người xem)
lib/flags.ts          công tắc tính năng; các tính năng đang khóa phải luôn tắt
lib/placeholders.ts   danh sách trang giữ chỗ (xóa mục khi làm trang thật)
public/licenses/      giấy phép phông chữ (SIL OFL 1.1)
scripts/serve-out.mjs máy chủ tĩnh để xem và kiểm thử out/
tests/unit/           kiểm thử đơn vị (node --test, chạy thẳng TypeScript), có kiểm độ tương phản màu chữ
tests/e2e/            kiểm thử trình duyệt ở 360, 390, 768, 1024, 1280, 1536 px
prototypes/           bản thử chính điện ngày 31/10, không deploy
docs/research-pack/   tài liệu định hướng gốc
```

## Ghi chú kỹ thuật

- Next.js 16.4.2, React 19.3.1, TypeScript 5.9.3, Tailwind CSS 4.3.3. Phiên bản cố định chính xác, chọn bản đã phát hành ít nhất 2 tuần (tính đến 31/10/2026).
- ESLint 9.39.5 là bản Next.js 16.4.2 dùng trong mẫu chính thức. npm báo ESLint 9 đã hết hỗ trợ, nhưng các plugin react, import, jsx-a11y của Next chưa nhận ESLint 10. Nâng cấp khi Next hỗ trợ.
- Phông Be Vietnam Pro (chữ thường) và Lora (tiêu đề) lưu ngay trên hosting qua gói Fontsource, không tải từ Google Fonts.
- Tranh chính điện là SVG viết tay trong `components/TempleScene.tsx`, không dùng tệp ảnh. Chuyển động (khói trầm, đèn lồng, hào quang, cánh hoa) chạy bằng CSS, tự tắt khi máy bật "giảm chuyển động".
- Các nút nghi thức đổi hình trong tranh qua thuộc tính `data-incense`, `data-offered`, `data-bowing` trên khung bao (`components/TempleSpace.tsx`). Không đếm lượt, không gửi gì lên mạng.
- Sổ lời nguyện lưu trong `localStorage` (khóa `cauphuc:so-loi-nguyen:v1`), chỉ lưu mã lời nguyện có sẵn, tối đa 50 dòng, có nút xóa từng dòng và xóa hết.
- `AGENTS.md` do `next dev` tự tạo khi phát hiện công cụ AI; đầu tệp trỏ về `CLAUDE.md`.
- `output: 'export'` và `trailingSlash: true`: mỗi trang là một thư mục có index.html, đường dẫn lạ ra `out/404.html`. Cấu hình .htaccess cho Hostinger làm ở module 10.
