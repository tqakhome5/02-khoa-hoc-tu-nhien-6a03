---
name: bai-giang-truc-quan
description: Khung thiết kế bài giảng, bản đồ môn học, mô phỏng thí nghiệm và đề ôn tập trực quan siêu gọn cho Khoa học tự nhiên 6 (Lớp 6A03). Bắt buộc dùng khi tạo mới hoặc chỉnh sửa trang HTML học tập.
---

# Skill: Bài Giảng Trực Quan — Khoa Học Tự Nhiên 6 (Lớp 6A03)

## 1. Tech Stack Chuẩn (Tối ưu Tốc độ & Tiết kiệm Token)
- **HTML5 + Tailwind CSS CDN** (`https://cdn.tailwindcss.com` với `darkMode: 'class'`).
- **Font chữ:** `Be Vietnam Pro` (Google Fonts).
- **Thư viện dùng chung:** `<script src="assets/common.js"></script>` — đã đóng gói sẵn:
  - Dark Mode đồng bộ toàn dự án (`localStorage` key: `khtn6_theme`, tự gắn vào `#themeToggle`, `#themeIcon`, `#themeLabel`).
  - Bộ đọc Tiếng Việt phân đoạn `Chunked Web Speech TTS` (`startTTS(id, title, text)`, `stopTTS()`, `togglePauseTTS()`, `setTTSRate(r)`) kèm thanh nổi `#ttsBar`.
  - Nút chia sẻ link nhanh `copyShareLink(btnId)`.
- **TUYỆT ĐỐI KHÔNG** viết lặp lại code Dark Mode, TTS hay `#ttsBar` trong từng file HTML.

## 2. Quy định Hình ảnh & Tương tác (CẤM Base64)
- **CẤM nhúng ảnh Base64 (`data:image/...`)** vào file HTML mới (gây phình dung lượng, tốn token và chậm tải).
- **Ưu tiên vẽ SVG tương tác gọn nhẹ** (thí nghiệm, kính hiển vi, cấu tạo tế bào, mạch chuyển thể, sơ đồ lực, chuyển hoá năng lượng, Hệ Mặt Trời, biểu đồ, quiz chấm điểm tức thì).
- Mọi trang đều phải có thanh điều hướng quay về `index.html` (`🏠 Trang chủ`) và liên kết tới bản đồ tổng quan môn học (`ban-do-khtn-6.html` hoặc `#ban-do` trên trang chủ).

## 3. Khung Boilerplate Siêu Gọn (~45 dòng)

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>[Tên Bài / Chuyên Đề] — KHTN 6 (Lớp 6A03)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = { darkMode: 'class', theme: { extend: { fontFamily: { sans: ['"Be Vietnam Pro"', 'sans-serif'] } } } };
  </script>
</head>
<body class="bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased">
  <header class="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur">
    <div class="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2 text-sm font-semibold">
        <a href="index.html" class="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition">🏠 Trang chủ</a>
        <a href="index.html#ban-do" class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition">🗺️ Bản đồ KHTN 6</a>
      </div>
      <div class="flex items-center gap-2">
        <button id="shareBtn" type="button" onclick="copyShareLink('shareBtn')" class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition">🔗 Chia sẻ</button>
        <button id="themeToggle" type="button" class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <span id="themeIcon">🌙</span> <span id="themeLabel">Tối</span>
        </button>
      </div>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-4 py-8 space-y-6 pb-24">
    <section class="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="flex items-start justify-between gap-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Khoa học tự nhiên 6 · Lớp 6A03</span>
          <h1 class="text-2xl md:text-3xl font-extrabold mt-1">[Tiêu đề bài giảng]</h1>
        </div>
        <button type="button" onclick="startTTS('intro', '[Tiêu đề bài giảng]', '[Nội dung tóm tắt để đọc]')" class="shrink-0 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition">🔊 Nghe giảng</button>
      </div>
    </section>
    <!-- Nội dung bài giảng, SVG tương tác & Quiz ở đây -->
  </main>

  <script src="assets/common.js"></script>
</body>
</html>
```

## 4. Checklist Hoàn Thiện Trước Khi Xuất Bản
1. Không có chuỗi `data:image/` (Base64) trong file HTML.
2. Đã gắn `<script src="assets/common.js"></script>` và kiểm tra nút Sáng/Tối, nút Nghe giảng (`startTTS`), nút Chia sẻ (`copyShareLink`).
3. Đã cập nhật mục mới vào bảng **DANH MỤC SẢN PHẨM ĐẦU RA** trong `INDEX.md` và gắn thẻ liên kết trên `index.html`.
