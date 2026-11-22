/**
 * assets/common.js — Thư viện dùng chung cho dự án Khoa học tự nhiên 6 (Lớp 6A03)
 * Bao gồm:
 *  1. Dark Mode đồng bộ toàn dự án (localStorage: khtn6_theme)
 *  2. Bộ đọc giọng nói Tiếng Việt phân đoạn (Chunked Web Speech TTS < 170 ký tự) + thanh #ttsBar nổi
 *  3. Sao chép link chia sẻ copyShareLink(btnId)
 */
(function () {
  'use strict';

  /* =========================================================================
   * 1. DARK MODE ĐỒNG BỘ (localStorage key: khtn6_theme)
   * ========================================================================= */
  var THEME_KEY = 'khtn6_theme';

  function getPreferredTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {}
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function updateThemeUI(theme) {
    var isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);

    var icon = document.getElementById('themeIcon');
    var label = document.getElementById('themeLabel');
    var toggle = document.getElementById('themeToggle');

    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
    if (label) label.textContent = isDark ? 'Sáng' : 'Tối';
    if (toggle) {
      toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      toggle.title = isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối';
    }
  }

  function applyTheme(theme) {
    var normalized = theme === 'dark' ? 'dark' : 'light';
    try {
      localStorage.setItem(THEME_KEY, normalized);
    } catch (e) {}
    updateThemeUI(normalized);
  }

  function toggleTheme() {
    var isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
  }

  function initTheme() {
    updateThemeUI(getPreferredTheme());
    var toggle = document.getElementById('themeToggle');
    if (toggle && !toggle.dataset.khtnThemeBound) {
      toggle.dataset.khtnThemeBound = '1';
      toggle.addEventListener('click', toggleTheme);
    }
  }

  // Áp dụng sớm nhất có thể để tránh nhấp nháy giao diện
  document.documentElement.classList.toggle('dark', getPreferredTheme() === 'dark');

  /* =========================================================================
   * 2. BỘ ĐỌC GIỌNG NÓI TIẾNG VIỆT PHÂN ĐOẠN (CHUNKED WEB SPEECH TTS)
   * ========================================================================= */
  var MAX_CHUNK_LEN = 165; // < 170 ký tự mỗi đoạn để tránh ngắt giọng trên Chrome/Edge
  var ttsState = {
    activeId: null,
    title: '',
    chunks: [],
    index: 0,
    rate: 1.0,
    isPlaying: false,
    isPaused: false,
    sessionToken: 0,
    voice: null
  };

  function selectBestVietnameseVoice() {
    if (!('speechSynthesis' in window)) return null;
    var voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) return null;

    var viVoices = voices.filter(function (v) {
      var lang = (v.lang || '').toLowerCase();
      var name = (v.name || '').toLowerCase();
      return lang.indexOf('vi') === 0 || name.indexOf('vietnam') !== -1 || name.indexOf('tiếng việt') !== -1;
    });

    if (!viVoices.length) return null;

    function scoreVoice(v) {
      var n = (v.name || '').toLowerCase();
      var score = 0;
      if (n.indexOf('hoaimy') !== -1 || n.indexOf('hoai my') !== -1) score += 100;
      if (n.indexOf('namminh') !== -1 || n.indexOf('nam minh') !== -1) score += 90;
      if (n.indexOf('natural') !== -1) score += 50;
      if (n.indexOf('google') !== -1) score += 45;
      if (n.indexOf('online') !== -1) score += 20;
      if ((v.lang || '').toLowerCase() === 'vi-vn') score += 10;
      return score;
    }

    viVoices.sort(function (a, b) {
      return scoreVoice(b) - scoreVoice(a);
    });
    return viVoices[0];
  }

  function splitTextToChunks(rawText) {
    var cleaned = String(rawText || '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!cleaned) return [];

    // Tách theo dấu kết thúc câu
    var roughSentences = cleaned.match(/[^.!?;:]+[.!?;:]*/g) || [cleaned];
    var chunks = [];

    roughSentences.forEach(function (sentence) {
      var s = sentence.trim();
      if (!s) return;

      if (s.length <= MAX_CHUNK_LEN) {
        if (chunks.length && (chunks[chunks.length - 1].length + 1 + s.length) <= MAX_CHUNK_LEN) {
          chunks[chunks.length - 1] += ' ' + s;
        } else {
          chunks.push(s);
        }
        return;
      }

      // Câu quá dài: tách theo dấu phẩy trước
      var subParts = s.split(/,\s*/);
      var current = '';
      subParts.forEach(function (part, idx) {
        var piece = idx < subParts.length - 1 ? part + ',' : part;
        if (piece.length > MAX_CHUNK_LEN) {
          if (current) {
            chunks.push(current.trim());
            current = '';
          }
          // Tách tiếp theo khoảng trắng
          var words = piece.split(' ');
          var buf = '';
          words.forEach(function (w) {
            if ((buf + ' ' + w).trim().length <= MAX_CHUNK_LEN) {
              buf = (buf ? buf + ' ' : '') + w;
            } else {
              if (buf) chunks.push(buf.trim());
              buf = w;
            }
          });
          if (buf) chunks.push(buf.trim());
        } else if ((current + ' ' + piece).trim().length <= MAX_CHUNK_LEN) {
          current = (current ? current + ' ' : '') + piece;
        } else {
          if (current) chunks.push(current.trim());
          current = piece;
        }
      });
      if (current) chunks.push(current.trim());
    });

    return chunks.filter(Boolean);
  }

  function ensureTTSBar() {
    var bar = document.getElementById('ttsBar');
    if (bar) return bar;
    if (!document.body) return null;

    bar = document.createElement('div');
    bar.id = 'ttsBar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Trình đọc giọng nói Tiếng Việt');
    bar.className = [
      'fixed bottom-4 left-1/2 -translate-x-1/2 z-50 hidden',
      'w-[94%] max-w-xl rounded-2xl border border-slate-200 dark:border-slate-700',
      'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl',
      'px-4 py-3 text-slate-800 dark:text-slate-100 transition-all'
    ].join(' ');

    bar.innerHTML =
      '<div class="flex flex-wrap items-center justify-between gap-2">' +
        '<div class="flex items-center gap-2 min-w-0 flex-1">' +
          '<span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-base">🔊</span>' +
          '<div class="min-w-0">' +
            '<div id="ttsTitle" class="text-sm font-semibold truncate">Đang đọc...</div>' +
            '<div id="ttsProgress" class="text-xs text-slate-500 dark:text-slate-400">Đoạn 0/0</div>' +
          '</div>' +
        '</div>' +
        '<div class="flex items-center gap-1.5">' +
          '<button type="button" id="ttsPauseBtn" class="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition">⏸ Tạm dừng</button>' +
          '<button type="button" id="ttsStopBtn" class="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/40 dark:hover:bg-rose-900/70 text-rose-700 dark:text-rose-300 transition">⏹ Dừng</button>' +
        '</div>' +
      '</div>' +
      '<div class="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">' +
        '<span class="text-slate-500 dark:text-slate-400">Tốc độ đọc:</span>' +
        '<div class="flex items-center gap-1">' +
          '<button type="button" data-tts-rate="0.85" class="tts-rate-btn px-2 py-1 rounded-md font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition">0.85x</button>' +
          '<button type="button" data-tts-rate="1" class="tts-rate-btn px-2 py-1 rounded-md font-medium border border-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 transition">1.0x</button>' +
          '<button type="button" data-tts-rate="1.15" class="tts-rate-btn px-2 py-1 rounded-md font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition">1.15x</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(bar);

    document.getElementById('ttsPauseBtn').addEventListener('click', togglePauseTTS);
    document.getElementById('ttsStopBtn').addEventListener('click', stopTTS);
    bar.querySelectorAll('.tts-rate-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTTSRate(parseFloat(btn.getAttribute('data-tts-rate')));
      });
    });

    return bar;
  }

  function updateTTSBarUI() {
    var bar = ensureTTSBar();
    if (!bar) return;

    if (!ttsState.isPlaying && !ttsState.isPaused) {
      bar.classList.add('hidden');
      return;
    }

    bar.classList.remove('hidden');
    var titleEl = document.getElementById('ttsTitle');
    var progEl = document.getElementById('ttsProgress');
    var pauseBtn = document.getElementById('ttsPauseBtn');

    if (titleEl) titleEl.textContent = ttsState.title || 'Đang đọc bài giảng';
    if (progEl) {
      var cur = Math.min(ttsState.index + 1, ttsState.chunks.length);
      progEl.textContent = (ttsState.isPaused ? 'Đã tạm dừng · ' : 'Đang đọc · ') + 'Đoạn ' + cur + '/' + ttsState.chunks.length;
    }
    if (pauseBtn) {
      pauseBtn.textContent = ttsState.isPaused ? '▶ Tiếp tục' : '⏸ Tạm dừng';
    }

    bar.querySelectorAll('.tts-rate-btn').forEach(function (btn) {
      var r = parseFloat(btn.getAttribute('data-tts-rate'));
      var active = Math.abs(r - ttsState.rate) < 0.01;
      btn.className = active
        ? 'tts-rate-btn px-2 py-1 rounded-md font-semibold border border-emerald-500 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 transition'
        : 'tts-rate-btn px-2 py-1 rounded-md font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition';
    });
  }

  function speakCurrentChunk(token) {
    if (token !== ttsState.sessionToken) return;
    if (ttsState.index >= ttsState.chunks.length) {
      stopTTS();
      return;
    }

    var utter = new SpeechSynthesisUtterance(ttsState.chunks[ttsState.index]);
    utter.lang = 'vi-VN';
    utter.rate = ttsState.rate;
    var voice = ttsState.voice || selectBestVietnameseVoice();
    if (voice) {
      ttsState.voice = voice;
      utter.voice = voice;
    }

    utter.onend = function () {
      if (token !== ttsState.sessionToken || ttsState.isPaused) return;
      ttsState.index += 1;
      if (ttsState.index < ttsState.chunks.length) {
        updateTTSBarUI();
        speakCurrentChunk(token);
      } else {
        stopTTS();
      }
    };

    utter.onerror = function (ev) {
      if (token !== ttsState.sessionToken) return;
      if (ev && (ev.error === 'interrupted' || ev.error === 'canceled')) return;
      stopTTS();
    };

    updateTTSBarUI();
    window.speechSynthesis.speak(utter);
  }

  function startTTS(id, title, text) {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt hiện tại không hỗ trợ đọc giọng nói (Web Speech API).');
      return;
    }

    // Nếu bấm lại đúng mục đang đọc -> dừng
    if (ttsState.isPlaying && ttsState.activeId && id && ttsState.activeId === id) {
      stopTTS();
      return;
    }

    var chunks = splitTextToChunks(text);
    if (!chunks.length) return;

    window.speechSynthesis.cancel();
    ttsState.sessionToken += 1;
    ttsState.activeId = id || null;
    ttsState.title = title || 'Đang đọc nội dung';
    ttsState.chunks = chunks;
    ttsState.index = 0;
    ttsState.isPlaying = true;
    ttsState.isPaused = false;
    ttsState.voice = selectBestVietnameseVoice();

    ensureTTSBar();
    speakCurrentChunk(ttsState.sessionToken);
  }

  function stopTTS() {
    ttsState.sessionToken += 1;
    ttsState.activeId = null;
    ttsState.chunks = [];
    ttsState.index = 0;
    ttsState.isPlaying = false;
    ttsState.isPaused = false;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    updateTTSBarUI();
  }

  function togglePauseTTS() {
    if (!('speechSynthesis' in window)) return;
    if (!ttsState.isPlaying && !ttsState.isPaused) return;

    if (!ttsState.isPaused) {
      ttsState.isPaused = true;
      ttsState.isPlaying = false;
      window.speechSynthesis.cancel(); // cancel an toàn hơn pause trên Chromium/Windows
      updateTTSBarUI();
    } else {
      ttsState.isPaused = false;
      ttsState.isPlaying = true;
      ttsState.sessionToken += 1;
      speakCurrentChunk(ttsState.sessionToken);
    }
  }

  function setTTSRate(r) {
    var rate = parseFloat(r);
    if (isNaN(rate) || rate < 0.5 || rate > 2.0) return;
    ttsState.rate = rate;
    updateTTSBarUI();

    if (ttsState.isPlaying && !ttsState.isPaused && ttsState.chunks.length) {
      window.speechSynthesis.cancel();
      ttsState.sessionToken += 1;
      speakCurrentChunk(ttsState.sessionToken);
    }
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = function () {
      ttsState.voice = selectBestVietnameseVoice();
    };
    window.addEventListener('beforeunload', function () {
      window.speechSynthesis.cancel();
    });
  }

  /* =========================================================================
   * 3. SAO CHÉP LINK CHIA SẺ copyShareLink(btnId)
   * ========================================================================= */
  function copyShareLink(btnId) {
    var url = window.location.href;
    var btn = btnId ? document.getElementById(btnId) : null;

    function showCopiedFeedback() {
      if (!btn) return;
      if (!btn.dataset.origHtml) {
        btn.dataset.origHtml = btn.innerHTML;
      }
      btn.innerHTML = '✅ Đã sao chép link!';
      clearTimeout(btn._copyTimer);
      btn._copyTimer = setTimeout(function () {
        if (btn.dataset.origHtml) btn.innerHTML = btn.dataset.origHtml;
      }, 2000);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(showCopiedFeedback).catch(function () {
        fallbackCopy(url, showCopiedFeedback);
      });
    } else {
      fallbackCopy(url, showCopiedFeedback);
    }
  }

  function fallbackCopy(text, onDone) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      if (onDone) onDone();
    } catch (e) {
      window.prompt('Sao chép đường link bên dưới:', text);
    }
  }

  /* =========================================================================
   * KHỞI TẠO & XUẤT HÀM TOÀN CỤC
   * ========================================================================= */
  window.applyTheme = applyTheme;
  window.toggleTheme = toggleTheme;
  window.startTTS = startTTS;
  window.stopTTS = stopTTS;
  window.togglePauseTTS = togglePauseTTS;
  window.setTTSRate = setTTSRate;
  window.copyShareLink = copyShareLink;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initTheme();
      ensureTTSBar();
    });
  } else {
    initTheme();
    ensureTTSBar();
  }
})();
