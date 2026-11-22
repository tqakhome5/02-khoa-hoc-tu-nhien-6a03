---
name: bai-giang-truc-quan
description: Khung thiết kế bài giảng 5 phút siêu gọn, dễ hiểu cho học sinh lớp 6 Việt Nam (sinh năm 2015 — 11 tuổi) môn Khoa học tự nhiên 6 (Lớp 6A03). Bắt buộc dùng khi tạo mới hoặc chỉnh sửa trang HTML học tập.
---

# Skill: Bài Giảng 5 Phút Cho Học Sinh Lớp 6 (Lớp 6A03 · Sinh năm 2015)

## 1. Nguyên Tắc Sư Phạm (11 Tuổi — Không Phải Nhà Bác Học)
- **Ít chữ, câu ngắn, gần gũi đời sống Việt Nam:** Mỗi ý chính tối đa 1–2 câu ngắn, in đậm từ khoá, dùng ví dụ cực gần (cốc trà đá, nồi canh sôi, đi xe đạp, cân ngoài chợ, hộp sữa chua, lá cây sân trường...).
- **Tuyệt đối tránh văn phong hàn lâm, dài dòng** hay nhồi nhét quá nhiều bảng biểu/khái niệm trong 1 trang.
- **Mỗi bài học gói gọn trong 5 phút theo đúng 3 bước:**
  1. **💡 Hiểu nhanh trong 2 phút:** 3–4 thẻ ngắn + nút **🔊 Nghe đọc** (`startTTS`).
  2. **🎮 Thử chạm xem sao!:** Đúng **1** mô phỏng hoặc hình SVG tương tác tập trung vào điểm khó nhất của bài.
  3. **⭐ Thử thách 5 câu (Kiếm 5 sao):** 5 câu trắc nghiệm ngắn gắn đời sống, chấm điểm tức thì, giải thích 1 câu dễ nhớ, thưởng sao ⭐.

## 2. Tech Stack Chuẩn & Quy Định Cấm Base64
- **HTML5 + Tailwind CSS CDN** (`darkMode: 'class'`) + Font **`Be Vietnam Pro`** + **`<script src="assets/common.js"></script>`**.
- **TUYỆT ĐỐI KHÔNG** viết lặp lại code Dark Mode (`khtn6_theme`), TTS (`#ttsBar`) hay `copyShareLink` trong file HTML.
- **CẤM nhúng ảnh Base64 (`data:image/...`)**; ưu tiên vẽ **SVG tương tác gọn nhẹ**.
- **Quy ước đặt tên file theo 3 môn:** `ly-bai-XX-...html` (Vật lí), `hoa-bai-XX-...html` (Hoá học), `sinh-bai-XX-...html` (Sinh học).
- Thanh điều hướng luôn có nút quay về đúng môn học trên `index.html` (`index.html#hoa-hoc`, `index.html#vat-li`, `index.html#sinh-hoc`).

## 3. Khung Boilerplate Siêu Gọn (~45 dòng)

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bài [Số]: [Tên bài] — [Vật lí / Hoá học / Sinh học] 6</title>
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
    <div class="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
      <a href="index.html#hoa-hoc" class="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-sm font-bold hover:bg-sky-100 transition">← Quay lại môn Hoá học</a>
      <div class="flex items-center gap-2">
        <button id="shareBtn" type="button" onclick="copyShareLink('shareBtn')" class="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition">🔗 Chia sẻ</button>
        <button id="themeToggle" type="button" class="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <span id="themeIcon">🌙</span> <span id="themeLabel">Tối</span>
        </button>
      </div>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-28">
    <!-- Bước 1: Hiểu nhanh trong 2 phút (+ nút startTTS) -->
    <!-- Bước 2: Thử chạm xem sao! (1 SVG tương tác trọng tâm) -->
    <!-- Bước 3: Thử thách 5 câu kiếm 5 sao -->
  </main>

  <script src="assets/common.js"></script>
</body>
</html>
```

## 4. Checklist Trước Khi Xuất Bản
1. Văn phong dễ hiểu với học sinh 11 tuổi (không nhồi chữ, không thuật ngữ hàn lâm).
2. Không có chuỗi `data:image/` (Base64); đã gắn `<script src="assets/common.js"></script>`.
3. Đã cập nhật bài mới vào bảng Deliverables trong `INDEX.md` và gắn nút **Học ngay ▶** trên `index.html`.
