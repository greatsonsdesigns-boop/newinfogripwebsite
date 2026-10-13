
(function() {
  'use strict';

  /* ============================================================
     ⚙️ CONFIGURATION — PASTE YOUR APPS SCRIPT URL BELOW
     ============================================================ */
  const CUSTOM_SONG_API_URL = 'https://script.google.com/macros/s/AKfycbxjQviN-PS1ZNX7MEKPC-PGC0rgRr6PuIKks2hg4N17HyBYbFvwI26orqy3dOCUCPu31g/exec';

  const ORDER_STORAGE_KEY = 'infogrip_custom_song_order';
  const SUCCESS_URL = '/custom-song/success/';
  const OFFER_PRICE = 1;
  const CURRENCY = 'INR';

  /* ============================================================
     UTILITIES
     ============================================================ */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function track(eventName, params) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, Object.assign({}, params || {}));
      }
    } catch (_) {}
  }

  function safe(text) {
    if (text == null) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function maskMobile(mobile) {
    if (!mobile || mobile.length < 10) return mobile || '';
    const m = String(mobile).replace(/\D/g, '');
    if (m.length !== 10) return mobile;
    return m.slice(0, 2) + 'XXXXXX' + m.slice(-2);
  }

  /* ============================================================
     LOAD ORDER
     ============================================================ */
  function loadOrder() {
    // Priority 1: sessionStorage
    try {
      const raw = sessionStorage.getItem(ORDER_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.orderId) return parsed;
      }
    } catch (_) {}

    // Priority 2: URL param — will fetch from backend
    const params = new URLSearchParams(window.location.search);
    const urlOrder = params.get('order');
    if (urlOrder) {
      return { orderId: urlOrder, _needsFetch: true };
    }
    return null;
  }

  function isOrderLocalValid(order) {
    if (!order || !order.orderId) return false;
    if (order._needsFetch) return false;
    return !!(
      order.name &&
      order.position &&
      order.mobile &&
      order.songFocus &&
      order.songStyle
    );
  }

  /* ============================================================
     FETCH ORDER FROM BACKEND (for _needsFetch case)
     ============================================================ */
  async function fetchOrderFromBackend(orderId) {
    if (!CUSTOM_SONG_API_URL || CUSTOM_SONG_API_URL.indexOf('PASTE_') === 0) {
      return null;
    }
    try {
      const res = await fetch(CUSTOM_SONG_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'getOrder', orderId: orderId })
      });
      const json = await res.json();
      if (json.success && json.order) {
        return Object.assign({}, json.order, { _needsFetch: false });
      }
    } catch (_) {}
    return null;
  }

  /* ============================================================
     RENDER ORDER DETAILS
     ============================================================ */
  function renderOrder(order) {
    $('#coOrderId').textContent = order.orderId;

    const rows = [];

    if (order.name) rows.push({ label: 'नाम', value: order.name });
    if (order.position) rows.push({ label: 'भूमिका', value: order.position });

    const isSarpanch = ['सरपंच', 'सरपंच प्रत्याशी'].includes(order.position);
    if (isSarpanch) {
      if (order.gramPanchayat) rows.push({ label: 'ग्राम पंचायत', value: order.gramPanchayat });
    } else {
      let partyDisplay = order.party || '';
      if (order.otherParty && (
          partyDisplay === 'अन्य पार्टी' ||
          partyDisplay === 'सामाजिक संगठन' ||
          partyDisplay === 'अन्य'
      )) {
        partyDisplay = order.otherParty;
      }
      if (partyDisplay) rows.push({ label: 'पार्टी / संगठन', value: partyDisplay });
    }

    if (order.area) rows.push({ label: 'क्षेत्र', value: order.area });
    if (order.mobile) rows.push({ label: 'मोबाइल', value: maskMobile(order.mobile) });
    if (order.songFocus) rows.push({ label: 'Song Focus', value: order.songFocus });
    if (order.songStyle) rows.push({ label: 'Song Style', value: order.songStyle });

    const wrap = $('#coOrderRows');
    wrap.innerHTML = rows.map(r => `
      <div class="co-row">
        <span class="co-row__label">${safe(r.label)}</span>
        <span class="co-row__value">${safe(r.value)}</span>
      </div>
    `).join('');

    if (order.specialMessage && order.specialMessage.trim()) {
      $('#coMessageText').textContent = order.specialMessage.trim();
      $('#coMessageWrap').hidden = false;
    } else {
      $('#coMessageWrap').hidden = true;
    }
  }

  /* ============================================================
     STATE MANAGEMENT
     ============================================================ */
  function showMissingState() {
    $('#coSkeleton').classList.remove('is-visible');
    $('#coGrid').hidden = true;
    $('#coMissingState').classList.add('is-visible');
    hideSticky();
  }

  function showCheckout(order) {
    $('#coSkeleton').classList.remove('is-visible');
    $('#coMissingState').classList.remove('is-visible');
    $('#coGrid').hidden = false;
    renderOrder(order);
    updateStickyPrice();
  }

  /* ============================================================
     STICKY MOBILE
     ============================================================ */
  function updateStickyPrice() {
    const el = $('#coSticky .co-sticky__price');
    if (el) el.textContent = '₹' + OFFER_PRICE;
  }
  function showSticky() {
    const bar = $('#coSticky');
    if (!bar) return;
    bar.classList.add('is-visible');
    bar.setAttribute('aria-hidden', 'false');
  }
  function hideSticky() {
    const bar = $('#coSticky');
    if (!bar) return;
    bar.classList.remove('is-visible');
    bar.setAttribute('aria-hidden', 'true');
  }

  function initStickyBehavior() {
    const mq = window.matchMedia('(max-width: 899px)');
    function update() {
      if (!mq.matches) { hideSticky(); return; }
      if ($('#coGrid').hidden) { hideSticky(); return; }
      const scrollY = window.scrollY;
      const docH = document.documentElement.scrollHeight;
      const winH = window.innerHeight;
      const nearBottom = (scrollY + winH) > (docH - 260);
      if (scrollY > 300 && !nearBottom) showSticky();
      else hideSticky();
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    if (mq.addEventListener) mq.addEventListener('change', update);
    update();
  }

  /* ============================================================
     ALERTS
     ============================================================ */
  function hideAlerts() {
    $$('.co-alert').forEach(el => el.classList.remove('is-visible'));
  }

  function showAlert(type, message) {
    const map = {
      error: '#coAlertError',
      warn: '#coAlertWarn',
      success: '#coAlertSuccess'
    };
    const el = $(map[type]);
    if (!el) return;
    // Hide others
    Object.values(map).forEach(sel => {
      const other = $(sel);
      if (other && other !== el) other.classList.remove('is-visible');
    });
    if (message) {
      const p = el.querySelector('p');
      if (p) p.textContent = message;
    }
    el.classList.add('is-visible');
  }

  /* ============================================================
     PAY BUTTON STATE
     ============================================================ */
  const payBtn = $('#coPayBtn');
  const stickyBtn = $('#coStickyBtn');
  const payStatus = $('#coPayStatus');

  let isProcessing = false;

  function setPayLoading(label) {
    isProcessing = true;
    [payBtn, stickyBtn].forEach(btn => {
      if (!btn) return;
      btn.disabled = true;
      btn.classList.add('is-loading');
    });
    if (label && payStatus) payStatus.textContent = label;
    if (payBtn) payBtn.setAttribute('data-loading-text', label || 'Processing...');
    if (stickyBtn) {
      stickyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Please wait...';
    }
  }

  function setPayReady() {
    isProcessing = false;
    [payBtn, stickyBtn].forEach(btn => {
      if (!btn) return;
      btn.disabled = false;
      btn.classList.remove('is-loading');
      btn.removeAttribute('data-loading-text');
    });
    if (stickyBtn) {
      stickyBtn.innerHTML = '<i class="fas fa-lock" aria-hidden="true"></i> Payment करें';
    }
    if (payStatus) payStatus.textContent = '';
  }

  /* ============================================================
     BACKEND: createRazorpayOrder
     ============================================================ */
  async function createRazorpayOrder(order) {
    if (!CUSTOM_SONG_API_URL || CUSTOM_SONG_API_URL.indexOf('PASTE_') === 0) {
      throw Object.assign(new Error('Backend not configured'), { code: 'NO_API_URL' });
    }

    const res = await fetch(CUSTOM_SONG_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'createRazorpayOrder', orderId: order.orderId })
    });

    if (!res.ok) {
      throw Object.assign(new Error('HTTP ' + res.status), { code: 'HTTP_ERROR' });
    }

    const json = await res.json();
    if (!json.success) {
      const code = (json.error && json.error.code) || 'BACKEND_ERROR';
      const msg = (json.error && json.error.message) || 'Unable to initiate payment.';
      throw Object.assign(new Error(msg), { code: code, backendMessage: msg });
    }
    return json; // { keyId, razorpayOrderId, amount, currency, orderId, customerName, customerMobile }
  }

  /* ============================================================
     BACKEND: verifyPayment
     ============================================================ */
  async function verifyPaymentOnBackend(orderId, rzpResponse) {
    const res = await fetch(CUSTOM_SONG_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'verifyPayment',
        orderId: orderId,
        razorpayOrderId: rzpResponse.razorpay_order_id,
        razorpayPaymentId: rzpResponse.razorpay_payment_id,
        razorpaySignature: rzpResponse.razorpay_signature
      })
    });
    if (!res.ok) {
      throw Object.assign(new Error('HTTP ' + res.status), { code: 'HTTP_ERROR' });
    }
    return await res.json();
  }

  /* ============================================================
     OPEN RAZORPAY
     ============================================================ */
  function openRazorpay(rzpData) {
    return new Promise((resolve, reject) => {
      if (typeof window.Razorpay !== 'function') {
        reject(Object.assign(new Error('Razorpay SDK not loaded'), { code: 'NO_RAZORPAY_SDK' }));
        return;
      }

      const options = {
        key: rzpData.keyId,
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: 'InfoGrip Solution',
        description: 'Custom Professional Song',
        order_id: rzpData.razorpayOrderId,
        prefill: {
          name: rzpData.customerName || '',
          contact: rzpData.customerMobile || ''
        },
        theme: { color: '#0b1f44' },
        handler: function(response) {
          // Response: razorpay_payment_id, razorpay_order_id, razorpay_signature
          resolve(response);
        },
        modal: {
          ondismiss: function() {
            reject(Object.assign(new Error('cancelled'), { code: 'CANCELLED' }));
          }
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function(resp) {
        reject(Object.assign(new Error('payment-failed'), { code: 'FAILED', raw: resp }));
      });

      rzp.open();
    });
  }

  /* ============================================================
     PAY CLICK HANDLER
     ============================================================ */
  async function handlePayClick(order) {
    if (isProcessing) return;
    if (!order || !order.orderId) {
      showMissingState();
      return;
    }

    hideAlerts();
    setPayLoading('Payment तैयार किया जा रहा है...');

    track('begin_checkout', {
      value: OFFER_PRICE,
      currency: CURRENCY,
      items: [{
        item_id: 'custom-song',
        item_name: 'Custom Professional Song',
        price: OFFER_PRICE,
        quantity: 1
      }]
    });

    try {
      // 1. Create Razorpay order via backend
      const rzpData = await createRazorpayOrder(order);

      setPayLoading('Payment Gateway खोल रहे हैं...');

      // 2. Open Razorpay checkout
      const result = await openRazorpay(rzpData);

      // 3. Verify payment on backend
      setPayLoading('Payment verify किया जा रहा है...');
      const verified = await verifyPaymentOnBackend(order.orderId, result);

      if (verified.success && verified.paymentStatus === 'PAID') {
        showAlert('success', 'Payment Successful! Redirecting...');
        // Redirect to success page
        window.location.href = SUCCESS_URL + '?order=' + encodeURIComponent(order.orderId);
        return;
      }

      // Verification failed
      setPayReady();
      showAlert('error', 'Payment verify नहीं हो पाया। कृपया दोबारा प्रयास करें।');
      track('payment_verification_failed', { order_id: order.orderId });

    } catch (err) {
      setPayReady();

      if (err.code === 'NO_API_URL') {
        showAlert('warn', 'Payment Gateway अभी Connect नहीं है। कृपया बाद में प्रयास करें।');
        return;
      }

      if (err.code === 'CANCELLED') {
        showAlert('warn', 'Payment अभी पूरा नहीं हुआ। आपका Order सुरक्षित है। आप चाहें तो Payment दोबारा कर सकते हैं।');
        track('payment_cancelled', { order_id: order.orderId });
        return;
      }

      if (err.code === 'FAILED') {
        showAlert('error', 'Payment पूरा नहीं हुआ। कृपया दोबारा प्रयास करें।');
        track('payment_failed', { order_id: order.orderId });
        return;
      }

      if (err.code === 'ALREADY_PAID') {
        showAlert('success', 'यह Order पहले ही Paid है। Redirecting...');
        window.location.href = SUCCESS_URL + '?order=' + encodeURIComponent(order.orderId);
        return;
      }

      if (err.code === 'NO_RAZORPAY_SDK') {
        showAlert('error', 'Payment SDK load नहीं हो पाया। कृपया Page refresh करें।');
        return;
      }

      // Generic
      console.error('Payment error:', err);
      showAlert('error', err.backendMessage || 'Payment शुरू नहीं हो पाया। कृपया कुछ देर बाद दोबारा प्रयास करें।');
      track('payment_init_failed', { order_id: order.orderId, code: err.code || 'UNKNOWN' });
    }
  }

  /* ============================================================
     INITIATE CHECKOUT (once per session)
     ============================================================ */
  function trackInitiateCheckoutOnce() {
    try {
      const KEY = 'infogrip_cs_initiate_checkout_fired';
      if (sessionStorage.getItem(KEY) === '1') return;
      sessionStorage.setItem(KEY, '1');
    } catch (_) {}
    track('InitiateCheckout', {
      value: OFFER_PRICE,
      currency: CURRENCY,
      content_name: 'Custom Professional Song'
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  async function init() {
    $('#coSkeleton').classList.add('is-visible');

    let order = loadOrder();

    // If we only have an orderId from URL, try to fetch from backend
    if (order && order._needsFetch) {
      const fetched = await fetchOrderFromBackend(order.orderId);
      if (fetched) {
        // Merge: keep orderId, add fetched fields
        order = Object.assign({}, order, fetched, {
          orderId: order.orderId,
          _needsFetch: false
        });
      }
    }

    // Small delay to smooth the transition
    setTimeout(() => {
      if (!order || !order.orderId) {
        showMissingState();
        return;
      }

      // If we have orderId but no other data, still show minimal page
      // (for backend-fetch scenarios where backend returned nothing)
      if (order._needsFetch || !order.name) {
        // Try sessionStorage one more time
        try {
          const raw = sessionStorage.getItem(ORDER_STORAGE_KEY);
          if (raw) {
            const stored = JSON.parse(raw);
            if (stored && stored.orderId === order.orderId) {
              order = stored;
            }
          }
        } catch (_) {}

        // If still no name, show missing state
        if (!order.name) {
          showMissingState();
          return;
        }
      }

      showCheckout(order);
      initStickyBehavior();

      // Wire pay buttons
      payBtn.addEventListener('click', () => handlePayClick(order));
      if (stickyBtn) {
        stickyBtn.addEventListener('click', () => handlePayClick(order));
      }

      // Track InitiateCheckout once
      trackInitiateCheckoutOnce();

      // If order is already paid, redirect to success
      if (order.paymentStatus === 'PAID' || order.paymentStatus === 'paid') {
        window.location.href = SUCCESS_URL + '?order=' + encodeURIComponent(order.orderId);
      }
    }, 120);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
