# GEMINI.md — Quy Tắc Fast-Path Dự Án Khoa Học Tự Nhiên 6 (Lớp 6A03)

Dự án xây dựng học liệu tương tác môn **Khoa học tự nhiên 6 (Kết nối tri thức với cuộc sống)** cho **Lớp 6A03**. Mọi agent làm việc trên workspace này **BẮT BUỘC** tuân thủ 6 quy tắc tối ưu tốc độ & tiết kiệm token sau:

---

## Quy tắc 1: CẤM Quét Thư Mục Mù & CẤM Đọc File PDF Gốc
- **CẤM** chạy `Get-ChildItem -Recurse` (hoặc tương đương) vào thư mục ảnh `pages/` (chứa 198 file ảnh trang SGK).
- **CẤM** mở hoặc đọc trực tiếp file PDF gốc `05-sgk-Khoa-Học-Tự-Nhiên-6.pdf`.

## Quy tắc 2: Định Tuyến Đầu Vào (SGK) Trong 1 Bước Qua `INDEX.md`
- Mọi tra cứu nội dung SGK phải đi từ [INDEX.md](INDEX.md) → mở thẳng file `.md` tương ứng của bài học trong `00-mo-dau/`, `chuong-01/`..`chuong-10/`, hoặc `phu-luc/`.
- Chỉ mở ảnh trang gốc (`pages/page-XXX.jpg`) khi **thật sự cần** quan sát chi tiết hình vẽ/thí nghiệm/sơ đồ để mô phỏng lại bằng SVG.

## Quy tắc 3: Định Tuyến Đầu Ra Qua Sổ Cái Trong `INDEX.md`
- Trước khi sửa hoặc mở rộng sản phẩm HTML/JS, luôn tra bảng **DANH MỤC SẢN PHẨM ĐẦU RA & CODE MAP** ngay đầu [INDEX.md](INDEX.md) để đi thẳng tới file và đúng vùng dòng cần sửa.

## Quy tắc 4: CẤM Đọc Tuần Tự File HTML Lớn (>500 Dòng)
- Với các file `.html` dài hơn 500 dòng, **CẤM** đọc từ đầu đến cuối.
- Bắt buộc tra **Code Map** trong `INDEX.md` hoặc dùng `Select-String` tìm số dòng chính xác rồi gọi `read_file(StartLine, EndLine)`.

## Quy tắc 5: Chuẩn Hoá Sản Phẩm Với Skill & Thư Viện Dùng Chung
- Bắt buộc áp dụng Skill [.agents/skills/bai-giang-truc-quan/SKILL.md](.agents/skills/bai-giang-truc-quan/SKILL.md) và nhúng `<script src="assets/common.js"></script>` cho mọi trang HTML mới.
- **CẤM** viết lặp lại logic Dark Mode, TTS (`#ttsBar`) hay `copyShareLink` trong từng file HTML.
- **CẤM** nhúng ảnh Base64 (`data:image/...`); ưu tiên vẽ **SVG tương tác gọn nhẹ**.
- Sau khi tạo hoặc cập nhật sản phẩm mới, **LUÔN** cập nhật đồng bộ bảng sản phẩm trong `INDEX.md` và gắn liên kết trên `index.html`.

## Quy tắc 6: Quy Trình GitHub Pages & GitHub Issues (Bắt Buộc)
- **Kho GitHub (Public):** `tqakhome5/02-khoa-hoc-tu-nhien-6a03` (`https://github.com/tqakhome5/02-khoa-hoc-tu-nhien-6a03`)
- **Link Web GitHub Pages:** `https://tqakhome5.github.io/02-khoa-hoc-tu-nhien-6a03/`
- **BẢO VỆ BẢN QUYỀN:** Không bao giờ bỏ qua `.gitignore` hay đẩy file `.pdf`, thư mục `pages/`, hoặc các thư mục `.md` trích xuất SGK (`00-mo-dau/`, `chuong-*/`, `phu-luc/`) lên kho Public.
- Khi nhận nhiệm vụ mới (tạo bài giảng, bản đồ môn học, ôn tập, thí nghiệm ảo, sửa lỗi), thực hiện trọn gói 4 bước:
  1. **Tạo Issue:**
     ```powershell
     gh issue create --repo tqakhome5/02-khoa-hoc-tu-nhien-6a03 --title "<Tiêu đề nhiệm vụ>" --body "<Mô tả ngắn mục tiêu & đầu ra>"
     ```
  2. **Thực hiện công việc**, đồng thời cập nhật `index.html` và `INDEX.md`.
  3. **Commit & đẩy lên GitHub:**
     ```powershell
     git add . && git commit -m "<Mô tả thay đổi> (closes #<số_issue>)" && git push
     ```
  4. **Bình luận link web đầu ra** (`https://tqakhome5.github.io/02-khoa-hoc-tu-nhien-6a03/<file>.html`) vào Issue bằng `gh issue comment` và gửi link đó cho người dùng.
