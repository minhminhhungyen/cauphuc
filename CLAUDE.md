# CLAUDE.md – cauphuc.com

Hướng dẫn cho AI (Claude Code hoặc công cụ khác) khi làm việc trong repo này. Người chịu trách nhiệm dự án: Sếp (Đỗ Thành Nguyện). Giao tiếp bằng tiếng Việt, gọi người dùng là "Sếp", xưng "em".

## Dự án

CAUPHUC.COM – "Cùng nhau cầu bình an – Lan tỏa lòng từ bi." Website nội dung về Phật pháp ứng dụng, thiền, bình an, lối sống thiện lành. Đây là dự án độc lập, không phải chùa và không đại diện cho tổ chức tôn giáo nào.

Đọc toàn bộ `docs/research-pack/` trước khi làm bất cứ việc gì. Pack là tài liệu định hướng, không phải ý kiến pháp lý.

## Quyết định Sếp đã chốt (31/10/2026)

- **Hướng MVP:** làm theo research pack. Cảnh chính điện (lấy từ ảnh thiết kế) làm trang Không gian bình an, chạy tĩnh.
- **Màu:** theo ảnh thiết kế Sếp gửi, tông đêm – vàng kim cho cả trang: nền xanh đêm #0B1124, chữ ngà #F4EAD6, vàng kim #E8B65C để nhấn, hồng sen dùng rất ít. Sếp đổi chiều 31/10/2026, thay khung xanh lá – trắng của research pack. Bảng màu nằm trong `app/globals.css`; `tests/unit/contrast.test.ts` kiểm độ tương phản chữ.
- **Lời nguyện:** được lưu, nhưng chỉ trên máy người dùng. Không gửi lên mạng, không hiển thị cho người khác.
- **Mã nguồn:** repo này (minhminhhungyen/cauphuc, riêng tư).

Báo cáo Pha A: https://claude.ai/artifact/EMAp4DRM4Xr4nYLViK9nFJ

## Quy trình

- Làm từng module theo thứ tự Pha B trong `docs/research-pack/06_execution/MASTER_PROMPT_FOR_CLAUDE.md`. Chỉ làm module tiếp theo khi Sếp yêu cầu.
- Mỗi module làm trên một nhánh riêng, mở PR. Trước khi báo xong phải chạy `npm run check` (lint, typecheck, test, build, e2e) và báo kết quả thật.
- Báo cáo bàn giao mỗi module phải có:
  - việc đã xong và chưa xong;
  - file thay đổi;
  - kết quả kiểm tra;
  - rủi ro, giả định;
  - tài nguyên chưa xác minh;
  - việc tiếp theo.
- Không viết lại toàn bộ khi còn tận dụng được. Không nâng cấp framework hay thư viện nếu không có lý do rõ.

## Tính năng đang khóa

Danh sách khóa nằm trong `lib/flags.ts`. Không bật khi chưa có văn bản trả lời của luật sư:

- hiển thị lời nguyện cho người khác;
- chat, bình luận;
- tài khoản, hồ sơ;
- donate, QR, thanh toán;
- kêu gọi từ thiện;
- hiện người đang truy cập;
- đếm lượt thắp hương;
- bảng xếp hạng;
- đo truy cập (analytics).

Không thêm backend, cơ sở dữ liệu, realtime hay dịch vụ trả phí. Trang xuất tĩnh (`output: 'export'`) để đặt trên Hostinger Business.

## Nội dung

- Không bịa lời Phật dạy, kinh văn hay nguồn. Không gán lời AI viết cho Đức Phật hay thiền sư.
- Mỗi trích dẫn ghi rõ kinh, phẩm, câu và bản dịch. Phân biệt rõ trích dẫn, diễn giải và nội dung tự biên soạn.
- Không hứa hẹn linh ứng, chữa bệnh, giải hạn, đổi vận. Không kích động sợ hãi để kêu gọi đóng góp.
- AI chỉ soạn bản nháp. Bài chỉ được xuất bản khi người duyệt đã duyệt.

## Tài nguyên (ảnh, audio, phông chữ, icon)

- Trước khi dùng, mỗi tài nguyên phải có một dòng trong `data/ASSET_LICENSE_REGISTER.csv`, kèm bằng chứng giấy phép.
- Không dùng hình nền hay âm thanh của buổi TikTok LIVE tham khảo.
- Hai ảnh thiết kế Sếp gửi chỉ dùng làm mẫu cho đến khi rõ nguồn.

## Thông tin đơn vị vận hành

Tạm ghi theo mặc định trong báo cáo, Sếp có thể đổi trong `lib/site.ts`:

- Tên: CÔNG TY TNHH MINH MINH HƯNG YÊN
- MST: 0901197922
- Địa chỉ: Đường Huyện Đội, Thôn Trai Trang, Xã Yên Mỹ, Tỉnh Hưng Yên
- ĐT: 0368 386 357
- Email: minhminhhungyenco.ltd@gmail.com

Thông tin này phải thống nhất ở mọi trang.

## Bảo mật

- Không đưa mật khẩu, token, API key vào repo hay vào code phía trình duyệt. Biến môi trường để ngoài repo.
- Không thu dữ liệu người xem. Lưu trên máy người dùng chỉ khi tính năng cho phép (Sổ lời nguyện) và phải có nút xóa.
