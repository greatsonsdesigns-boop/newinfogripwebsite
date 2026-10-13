
(function() {
  'use strict';

  /* ============================================================
     CONFIGURATION
     ============================================================ */
  const CUSTOM_SONG_API_URL = 'https://script.google.com/macros/s/AKfycbxjQviN-PS1ZNX7MEKPC-PGC0rgRr6PuIKks2hg4N17HyBYbFvwI26orqy3dOCUCPu31g/exec';

  const ORDER_STORAGE_KEY = 'infogrip_custom_song_order';
  const SUCCESS_URL = '/custom-song/success/';
  const OFFER_PRICE = 999;
  const CURRENCY = 'INR';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ============================================================
     UTILITIES
     ============================================================ */
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
    try {
      const raw = sessionStorage.getItem(ORDER_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.orderId) return parsed;
      }
    } catch (_) {}

    const params = new URLSearchParams(window.location.search);
    const urlOrder = params.get('order');
    if (urlOrder) return { orderId: urlOrder, _needsFetch: true };
    return null;
  }

  async function fetchOrderFromBackend(orderId) {
    if (!CUSTOM_SONG_API_URL || CUSTOM_SONG_API_URL.indexOf('PASTE_') === 0) return null;
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
     RENDER ORDER
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
     STATE
     ============================================================ */
  function showMissingState() {
    $('#coSkeleton').classList.remove('is-visible');
    $('#coGrid').hidden = true;
    $('#coMissingState').classList.add('is-visible');
    hideMobileBar();
  }

  function showCheckout(order) {
    $('#coSkeleton').classList.remove('is-visible');
    $('#coMissingState').classList.remove('is-visible');
    $('#coGrid').hidden = false;
    renderOrder(order);
    showMobileBar();
  }

  /* ============================================================
     MOBILE STICKY BAR
     ============================================================ */
  function showMobileBar() {
    const bar = $('#coMobilePay');
    if (!bar) return;
    if (window.innerWidth >= 900) return;
    bar.classList.add('is-visible');
    bar.setAttribute('aria-hidden', 'false');
  }

  function hideMobileBar() {
    const bar = $('#coMobilePay');
    if (!bar) return;
    bar.classList.remove('is-visible');
    bar.setAttribute('aria-hidden', 'true');
  }

  function initMobileBarBehavior() {
    const mq = window.matchMedia('(max-width: 899px)');
    function update() {
      if (!mq.matches) { hideMobileBar(); return; }
      if ($('#coGrid').hidden) { hideMobileBar(); return; }
      showMobileBar();
    }
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
  const mobilePayBtn = $('#coMobilePayBtn');
  const payStatus = $('#coPayStatus');
  let isProcessing = false;

  function setPayLoading(label) {
    isProcessing = true;
    [payBtn, mobilePayBtn].forEach(btn => {
      if (!btn) return;
      btn.disabled = true;
      btn.classList.add('is-loading');
    });
    if (label && payStatus) payStatus.textContent = label;
    if (payBtn) payBtn.setAttribute('data-loading-text', label || 'Processing...');
    if (mobilePayBtn) {
      mobilePayBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Please wait...';
    }
  }

  function setPayReady() {
    isProcessing = false;
    [payBtn, mobilePayBtn].forEach(btn => {
      if (!btn) return;
      btn.disabled = false;
      btn.classList.remove('is-loading');
      btn.removeAttribute('data-loading-text');
    });
    if (mobilePayBtn) {
      mobilePayBtn.innerHTML = '<i class="fas fa-lock" aria-hidden="true"></i> Payment करें';
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
    if (!res.ok) throw Object.assign(new Error('HTTP ' + res.status), { code: 'HTTP_ERROR' });
    const json = await res.json();
    if (!json.success) {
      const code = (json.error && json.error.code) || 'BACKEND_ERROR';
      const msg = (json.error && json.error.message) || 'Unable to initiate payment.';
      throw Object.assign(new Error(msg), { code: code, backendMessage: msg });
    }
    return json;
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
    if (!res.ok) throw Object.assign(new Error('HTTP ' + res.status), { code: 'HTTP_ERROR' });
    return await res.json();
  }

  /* ============================================================
     RAZORPAY OPEN
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
        handler: function(response) { resolve(response); },
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
     PAYMENT CLICK
     ============================================================ */
  async function handlePayClick(order) {
    if (isProcessing) return;
    if (!order || !order.orderId) {
      showMissingState();
      return;
    }

    hideAlerts();
    setPayLoading('Payment तैयार किया जा रहा है...');

    // TRACKING: add_payment_info
    track('add_payment_info', {
      value: OFFER_PRICE,
      currency: CURRENCY,
      items: [{
        item_id: 'CUSTOM_SONG_999',
        item_name: 'Custom Professional Song',
        price: OFFER_PRICE,
        quantity: 1
      }]
    });

    track('begin_checkout', {
      value: OFFER_PRICE,
      currency: CURRENCY,
      items: [{
        item_id: 'CUSTOM_SONG_999',
        item_name: 'Custom Professional Song',
        price: OFFER_PRICE,
        quantity: 1
      }]
    });

    try {
      const rzpData = await createRazorpayOrder(order);

      // TRACKING: payment attempt
      track('payment_attempt', {
        value: OFFER_PRICE,
        currency: CURRENCY,
        order_id: order.orderId
      });

      setPayLoading('Payment Gateway खोल रहे हैं...');
      const result = await openRazorpay(rzpData);

      setPayLoading('Payment verify किया जा रहा है...');
      const verified = await verifyPaymentOnBackend(order.orderId, result);

      if (verified.success && verified.paymentStatus === 'PAID') {
        showAlert('success', 'Payment Successful! Redirecting...');
        window.location.href = SUCCESS_URL + '?order=' + encodeURIComponent(order.orderId);
        return;
      }

      setPayReady();
      showAlert('error', 'Payment verify नहीं हो पाया। कृपया दोबारा प्रयास करें।');
    } catch (err) {
      setPayReady();

      // TRACKING: payment failed
      var failReason = 'unknown';
      if (err.code === 'CANCELLED') failReason = 'cancelled';
      else if (err.code === 'FAILED') failReason = 'failed';
      else if (err.code === 'NO_API_URL') failReason = 'not_configured';
      else if (err.code === 'NO_RAZORPAY_SDK') failReason = 'sdk_error';
      else if (err.code === 'HTTP_ERROR') failReason = 'network_error';

      track('payment_failed', {
        reason: failReason,
        order_id: order.orderId,
        value: OFFER_PRICE,
        currency: CURRENCY
      });

      if (err.code === 'NO_API_URL') {
        showAlert('warn', 'Payment Gateway अभी Connect नहीं है। कृपया बाद में प्रयास करें।');
        return;
      }
      if (err.code === 'CANCELLED') {
        showAlert('warn', 'Payment अभी पूरा नहीं हुआ। आपका Order सुरक्षित है। आप चाहें तो Payment दोबारा कर सकते हैं।');
        return;
      }
      if (err.code === 'FAILED') {
        showAlert('error', 'Payment पूरा नहीं हुआ। कृपया दोबारा प्रयास करें।');
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
      showAlert('error', err.backendMessage || 'Payment शुरू नहीं हो पाया। कृपया कुछ देर बाद दोबारा प्रयास करें।');
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
    // Meta: InitiateCheckout
    track('InitiateCheckout', {
      value: OFFER_PRICE,
      currency: CURRENCY,
      content_name: 'Custom Professional Song'
    });
    // GA4: begin_checkout (proper location — checkout page load)
    track('begin_checkout', {
      value: OFFER_PRICE,
      currency: CURRENCY,
      items: [{
        item_id: 'CUSTOM_SONG_999',
        item_name: 'Custom Professional Song',
        price: OFFER_PRICE,
        quantity: 1
      }]
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  async function init() {
    $('#coSkeleton').classList.add('is-visible');

    let order = loadOrder();

    if (order && order._needsFetch) {
      const fetched = await fetchOrderFromBackend(order.orderId);
      if (fetched) {
        order = Object.assign({}, order, fetched, {
          orderId: order.orderId,
          _needsFetch: false
        });
      }
    }

    setTimeout(() => {
      if (!order || !order.orderId) {
        showMissingState();
        return;
      }

      if (order._needsFetch || !order.name) {
        try {
          const raw = sessionStorage.getItem(ORDER_STORAGE_KEY);
          if (raw) {
            const stored = JSON.parse(raw);
            if (stored && stored.orderId === order.orderId) {
              order = stored;
            }
          }
        } catch (_) {}
        if (!order.name) {
          showMissingState();
          return;
        }
      }

      showCheckout(order);
      initMobileBarBehavior();

      if (payBtn) payBtn.addEventListener('click', () => handlePayClick(order));
      if (mobilePayBtn) mobilePayBtn.addEventListener('click', () => handlePayClick(order));

      trackInitiateCheckoutOnce();

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
