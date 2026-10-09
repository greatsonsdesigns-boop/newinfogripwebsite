/* =============================================================
   InfoGrip — Custom Professional Song Landing Page
   Page-scoped JS. All interactions are real.
   ============================================================= */
(function () {
  'use strict';

  /* ============================================================
     CONFIG — SINGLE SOURCE OF TRUTH
     ============================================================ */
  // Replace with a real campaign end date when running the promotion.
  // Format: ISO 8601 with IST offset.
  const PROMOTION_END_DATE = '2026-12-31T23:59:59+05:30';

  const ORDER_URL = '/custom-song/order/';

  const REGULAR_PRICE = 1599;
  const OFFER_PRICE   = 999;

  // ============================================================
// CUSTOM SONG AUDIO SAMPLES
// Files must exist under:
// /custom-song/assets/custom-song/samples/
// ============================================================

const SAMPLES = [
  {
    id: 's1',
    title: 'रमेश यादव — कोटखावदा | कोटखावदा की पहचान',
    cat: 'Rajasthani Folk',
    src: '/custom-song/assets/custom-song/samples/sample-05.mp3'
  },

  {
    id: 's2',
    title: 'सुरेश मीणा — चाकसू | काम की पहचान',
    cat: 'Cinematic Hindi',
    src: '/custom-song/assets/custom-song/samples/sample-02.mp3'
  },

  {
    id: 's3',
    title: 'राजेश शर्मा — चोमू | युवा सपनों की उड़ान',
    cat: 'Rajasthani Folk',
    src: '/custom-song/assets/custom-song/samples/sample-06.mp3'
  },

  {
    id: 's4',
    title: 'अजय चौधरी — जयपुर ग्रामीण | नई सोच, नया अंदाज़',
    cat: 'Modern Hindi',
    src: '/custom-song/assets/custom-song/samples/sample-04.mp3'
  },

  {
    id: 's5',
    title: 'महेंद्र सिंह — बगरू | माटी से जुड़ा नाम',
    cat: 'Modern Rajasthani',
    src: '/custom-song/assets/custom-song/samples/sample-01.mp3'
  },

  {
    id: 's6',
    title: 'गोविंद शर्मा — सांभर | धरती की आवाज़',
    cat: 'Youth Pop-Rock',
    src: '/custom-song/assets/custom-song/samples/sample-03.mp3'
  }
];


// ============================================================
// POPUP STORAGE KEY
// Used to remember when the visitor dismisses the popup.
// ============================================================

const POPUP_KEY = 'infogrip_custom_song_popup_dismissed_v1';
  /* ============================================================
     UTILITIES
     ============================================================ */
  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function track(eventName, params) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, Object.assign({}, params || {}));
      }
    } catch (_) { /* analytics must never break the page */ }
  }

  function fmtTime(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' + s : s);
  }

  function safeNavigate(url) {
    if (!url) return;
    window.location.href = url;
  }

  /* ============================================================
     DISCOUNT % — computed programmatically, injected everywhere
     ============================================================ */
  const discountPct = Math.round(((REGULAR_PRICE - OFFER_PRICE) / REGULAR_PRICE) * 100);
  $$('[data-discount-pct]').forEach(el => { el.textContent = '(' + discountPct + '% off)'; });

  /* ============================================================
     GLOBAL CTA CLICK TRACKING
     ============================================================ */
  document.addEventListener('click', (e) => {
    const cta = e.target.closest('[data-cta]');
    if (!cta) return;
    const where = cta.getAttribute('data-cta');
    track('cta_click', { location: where, value: OFFER_PRICE, currency: 'INR' });
    if (where === 'hero-primary' || where === 'pricing' || where === 'final-primary'
        || where === 'popup-primary' || where === 'sticky' || where === 'personalization'
        || where === 'provide' || where === 'navbar') {
      track('begin_checkout', { value: OFFER_PRICE, currency: 'INR' });
    }
  }, false);

  /* ============================================================
     SMOOTH SCROLL for in-page anchors
     ============================================================ */
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', href);
    });
  });

  /* ============================================================
     AUDIO ENGINE — one sample at a time, real playback
     ============================================================ */
  (function audioEngine() {
    const grid = $('#cs-samples-grid');
    if (!grid) return;

    // Build cards
    const cards = SAMPLES.map(sample => {
      const card = document.createElement('article');
      card.className = 'cs-sample';
      card.dataset.id = sample.id;
      card.innerHTML = [
        '<button class="cs-sample__play" type="button" aria-label="Play sample: ' + sample.title + '">',
          '<i class="fas fa-play" aria-hidden="true"></i>',
        '</button>',
        '<div class="cs-sample__body">',
          '<h3 class="cs-sample__title">' + sample.title + '</h3>',
          '<span class="cs-sample__cat">' + sample.cat + '</span>',
          '<div class="cs-sample__bar" role="slider" aria-label="Seek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0">',
            '<div class="cs-sample__progress"></div>',
          '</div>',
          '<div class="cs-sample__meta">',
            '<span class="cs-sample__cur">0:00</span>',
            '<span class="cs-sample__dur">--:--</span>',
          '</div>',
          '<p class="cs-sample__error">Sample जल्द उपलब्ध होगा।</p>',
        '</div>'
      ].join('');
      grid.appendChild(card);
      return card;
    });

    const players = new Map(); // id -> HTMLAudioElement
    let currentId = null;

    function getAudio(id, src) {
      if (players.has(id)) return players.get(id);
      const audio = new Audio();
      audio.preload = 'none';
      audio.src = src;
      players.set(id, audio);
      return audio;
    }

    function setPlayIcon(card, isPlaying) {
      const icon = card.querySelector('.cs-sample__play i');
      if (!icon) return;
      icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }

    function setProgress(card, pct) {
      const bar = card.querySelector('.cs-sample__bar');
      const fill = card.querySelector('.cs-sample__progress');
      if (fill) fill.style.width = pct + '%';
      if (bar) bar.setAttribute('aria-valuenow', String(Math.round(pct)));
    }

    function pauseAllExcept(id) {
      players.forEach((audio, key) => {
        if (key !== id && !audio.paused) {
          audio.pause();
          const c = grid.querySelector('.cs-sample[data-id="' + key + '"]');
          if (c) { c.classList.remove('is-playing'); setPlayIcon(c, false); }
        }
      });
    }

    function activate(sample, card) {
      const audio = getAudio(sample.id, sample.src);
      const cur = card.querySelector('.cs-sample__cur');
      const dur = card.querySelector('.cs-sample__dur');

      const onTime = () => {
        if (audio.duration && isFinite(audio.duration)) {
          setProgress(card, (audio.currentTime / audio.duration) * 100);
        }
        if (cur) cur.textContent = fmtTime(audio.currentTime);
      };
      const onMeta = () => { if (dur) dur.textContent = fmtTime(audio.duration); };
      const onEnd = () => {
        card.classList.remove('is-playing');
        setPlayIcon(card, false);
        setProgress(card, 0);
        if (cur) cur.textContent = '0:00';
        audio.currentTime = 0;
      };
      const onErr = () => {
        card.classList.add('has-error');
        card.classList.remove('is-playing');
        setPlayIcon(card, false);
        if (dur) dur.textContent = '--:--';
      };

      // attach once
      if (!audio.dataset.wired) {
        audio.dataset.wired = '1';
        audio.addEventListener('timeupdate', onTime);
        audio.addEventListener('loadedmetadata', onMeta);
        audio.addEventListener('ended', onEnd);
        audio.addEventListener('error', onErr);
        audio.addEventListener('stalled', onErr);
      }
      return audio;
    }

    cards.forEach((card, idx) => {
      const sample = SAMPLES[idx];
      const playBtn = card.querySelector('.cs-sample__play');
      const bar = card.querySelector('.cs-sample__bar');
      const audio = activate(sample, card);

      playBtn.addEventListener('click', () => {
        if (audio.paused) {
          pauseAllExcept(sample.id);
          // Attempt play — catch missing file gracefully
          const p = audio.play();
          if (p && typeof p.catch === 'function') {
            p.catch(() => {
              card.classList.add('has-error');
            });
          }
          card.classList.add('is-playing');
          setPlayIcon(card, true);
          currentId = sample.id;
          track('sample_play', { sample_id: sample.id, sample_title: sample.title });
        } else {
          audio.pause();
          card.classList.remove('is-playing');
          setPlayIcon(card, false);
          currentId = null;
        }
      });

      // Seek on progress bar click
      bar.addEventListener('click', (e) => {
        if (!audio.duration || !isFinite(audio.duration)) return;
        const rect = bar.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.currentTime = pct * audio.duration;
      });

      // Keyboard support on seek bar
      bar.addEventListener('keydown', (e) => {
        if (!audio.duration || !isFinite(audio.duration)) return;
        const step = audio.duration * 0.05;
        if (e.key === 'ArrowRight') { audio.currentTime = Math.min(audio.duration, audio.currentTime + step); e.preventDefault(); }
        if (e.key === 'ArrowLeft')  { audio.currentTime = Math.max(0, audio.currentTime - step); e.preventDefault(); }
      });
    });
  })();

  /* ============================================================
     FAQ — only one open at a time, keyboard-friendly
     (uses native <details>; add close-others behavior)
     ============================================================ */
  (function faq() {
    const items = $$('#cs-faq .cs-faq__item');
    if (!items.length) return;
    items.forEach(item => {
      item.addEventListener('toggle', () => {
        if (!item.open) return;
        items.forEach(other => { if (other !== item && other.open) other.open = false; });
      });
    });
  })();

  /* ============================================================
     COUNTDOWN — single source of truth
     ============================================================ */
  (function countdown() {
    const root = document.getElementById('cs-countdown');
    if (!root) return;
    const dEl = root.querySelector('[data-cd="d"]');
    const hEl = root.querySelector('[data-cd="h"]');
    const mEl = root.querySelector('[data-cd="m"]');
    const sEl = root.querySelector('[data-cd="s"]');

    const endTs = Date.parse(PROMOTION_END_DATE);
    if (isNaN(endTs)) {
      // Invalid date → show ended state, do not run fake timer
      root.classList.add('is-ended');
      return;
    }

    function pad(n) { return n < 10 ? '0' + n : String(n); }

    function tick() {
      const now = Date.now();
      let diff = endTs - now;
      if (diff <= 0) {
        root.classList.add('is-ended');
        clearInterval(timerId);
        return;
      }
      const s = Math.floor(diff / 1000);
      const d = Math.floor(s / 86400);
      const h = Math.floor((s % 86400) / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      if (dEl) dEl.textContent = pad(d);
      if (hEl) hEl.textContent = pad(h);
      if (mEl) mEl.textContent = pad(m);
      if (sEl) sEl.textContent = pad(sec);
    }
    tick();
    const timerId = setInterval(tick, 1000);
  })();

  /* ============================================================
     STICKY MOBILE CTA — appears after scroll, hides near order
     ============================================================ */
  (function stickyCTA() {
    const sticky = document.getElementById('cs-sticky');
    if (!sticky) return;

    // Only relevant on mobile viewport
    const mq = window.matchMedia('(max-width: 1023px)');
    let shown = false;

    function update() {
      if (!mq.matches) {
        sticky.classList.remove('is-visible');
        sticky.setAttribute('aria-hidden', 'true');
        return;
      }
      const shouldShow = window.scrollY > 500;
      if (shouldShow && !shown) {
        sticky.classList.add('is-visible');
        sticky.setAttribute('aria-hidden', 'false');
        shown = true;
      } else if (!shouldShow && shown) {
        sticky.classList.remove('is-visible');
        sticky.setAttribute('aria-hidden', 'true');
        shown = false;
      }
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    if (mq.addEventListener) mq.addEventListener('change', update);
    update();
  })();

  /* ============================================================
     POPUP — engagement triggered, once per session
     ============================================================ */
  (function promoPopup() {
    const overlay = document.getElementById('cs-popup');
    const closeBtn = document.getElementById('cs-popup-close');
    const laterBtn = document.getElementById('cs-popup-later');
    if (!overlay) return;

    // Respect dismissal for the browsing session
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(POPUP_KEY) === '1';
    } catch (_) { dismissed = false; }

    let opened = false;
    let focusBefore = null;

    function openPopup() {
      if (opened || dismissed) return;
      opened = true;
      focusBefore = document.activeElement;
      overlay.hidden = false;
      // allow layout pass before transition
      requestAnimationFrame(() => overlay.classList.add('is-visible'));
      // focus first focusable
      const firstFocus = overlay.querySelector('a, button');
      if (firstFocus) firstFocus.focus();
      document.addEventListener('keydown', onKey);
    }

    function closePopup() {
      overlay.classList.remove('is-visible');
      document.removeEventListener('keydown', onKey);
      setTimeout(() => { overlay.hidden = true; }, 280);
      try { sessionStorage.setItem(POPUP_KEY, '1'); } catch (_) {}
      dismissed = true;
      if (focusBefore && focusBefore.focus) focusBefore.focus();
    }

    function onKey(e) {
      if (e.key === 'Escape') closePopup();
    }

    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    if (laterBtn) laterBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closePopup(); });

    if (dismissed) return;

    // Trigger conditions: 45% scroll OR 35s on page — whichever first
    let triggered = false;
    function triggerOnce() {
      if (triggered) return;
      triggered = true;
      openPopup();
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timeTimer);
    }
    function onScroll() {
      const doc = document.documentElement;
      const scrolled = (window.scrollY + window.innerHeight) / doc.scrollHeight;
      if (scrolled >= 0.45 && window.scrollY > 600) triggerOnce();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    const timeTimer = setTimeout(triggerOnce, 35000);
  })();

  /* ============================================================
     SECTION REVEAL — IntersectionObserver
     ============================================================ */
  (function reveal() {
    if (!('IntersectionObserver' in window)) return;
    const targets = $$('.cs-section-head, .cs-feature, .cs-who-card, .cs-compare__col, .cs-trust-block__item, .cs-step, .cs-flow__item, .cs-pricing, .cs-faq__item');
    targets.forEach(el => el.classList.add('cs-reveal'));

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

    targets.forEach(el => io.observe(el));
  })();

  /* ============================================================
     THEME TOGGLE FALLBACK — only if main.js has not already wired it
     (main.js is the primary owner; this is defensive.)
     ============================================================ */
  (function themeFallback() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    // If main.js already attached its handler, it will have set this flag.
    if (btn.dataset.csWired === '1') return;
    // Defer a tick to let main.js run first
    setTimeout(() => {
      if (btn.dataset.csWired === '1') return;
      // Minimal fallback: toggle .dark-theme on <body> and persist
      btn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        document.body.classList.toggle('dark-theme', !isDark);
        const icon = btn.querySelector('i');
        if (icon) {
          icon.classList.toggle('fa-moon', isDark);
          icon.classList.toggle('fa-sun', !isDark);
        }
        try { localStorage.setItem('theme', isDark ? 'light' : 'dark'); } catch (_) {}
      });
    }, 0);
  })();

})();