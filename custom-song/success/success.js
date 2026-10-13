
(function() {
  'use strict';

  const CUSTOM_SONG_API_URL = 'https://script.google.com/macros/s/AKfycbxjQviN-PS1ZNX7MEKPC-PGC0rgRr6PuIKks2hg4N17HyBYbFvwI26orqy3dOCUCPu31g/exec';

  const $ = (sel) => document.querySelector(sel);

  function show(stateId) {
    ['suLoading', 'suSuccess', 'suSupport', 'suPending', 'suError'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.hidden = id !== stateId;
    });
  }

  function track(eventName, params) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, Object.assign({}, params || {}));
      }
    } catch (_) {}
  }

  async function fetchOrderFromBackend(orderId) {
    if (!CUSTOM_SONG_API_URL || CUSTOM_SONG_API_URL.indexOf('PASTE_') === 0) return null;
    try {
      const res = await fetch(CUSTOM_SONG_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'getOrder', orderId: orderId })
      });
      if (!res.ok) return null;
      const json = await res.json();
      if (json.success && json.order) return json.order;
      return null;
    } catch (_) {
      return null;
    }
  }

  /* ============================================================
     FIRE PURCHASE ONCE — deduplicated with same Order ID
     ============================================================ */
  function firePurchaseOnce(orderId) {
    try {
      var key = 'ig_purchase_fired_' + orderId;
      if (sessionStorage.getItem(key) === '1') return;
      sessionStorage.setItem(key, '1');

      // GA4 purchase
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'purchase', {
          transaction_id: orderId,
          value: 999,
          currency: 'INR',
          items: [{
            item_id: 'CUSTOM_SONG_999',
            item_name: 'Custom Professional Song',
            price: 999,
            quantity: 1
          }]
        });
      }

      // Meta Purchase
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Purchase', {
          value: 999,
          currency: 'INR',
          content_name: 'Custom Professional Song',
          content_ids: ['CUSTOM_SONG_999'],
          content_type: 'product'
        });
      }
    } catch (_) {}
  }

  function updateWhatsAppMessage(orderId) {
    const msg = 'Hi, I just placed a Custom Song order. Order ID: ' + orderId;
    const url = 'https://wa.me/919928140288?text=' + encodeURIComponent(msg);
    const link = document.getElementById('suWhatsAppLink');
    const floatLink = document.getElementById('suFloatWa');
    if (link) link.href = url;
    if (floatLink) floatLink.href = url;
  }

  function renderSuccess(orderId, order) {
    document.getElementById('suOrderId').querySelector('span').textContent = orderId;

    if (order.name) {
      document.getElementById('suName').textContent = order.name;
      document.getElementById('suNameRow').hidden = false;
    }

    if (order.invoiceNumber) {
      document.getElementById('suInvoiceNum').textContent = order.invoiceNumber;
      document.getElementById('suInvoiceRow').hidden = false;
    }

    if (order.invoiceLink) {
      const btn = document.getElementById('suInvoiceBtn');
      btn.href = order.invoiceLink;
      btn.hidden = false;
    }

    updateWhatsAppMessage(orderId);
    show('suSuccess');
    const support = document.getElementById('suSupport');
    if (support) support.hidden = false;
  }

  function renderPending(orderId) {
    const retryBtn = document.getElementById('suRetryBtn');
    if (retryBtn) {
      retryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.reload();
      });
    }
    show('suPending');
    const support = document.getElementById('suSupport');
    if (support) support.hidden = false;
  }

  async function init() {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order');

    if (!orderId) {
      show('suError');
      return;
    }

    const order = await fetchOrderFromBackend(orderId);

    if (order) {
      if (order.paymentStatus === 'PAID') {
        renderSuccess(orderId, order);
        firePurchaseOnce(orderId);
        track('page_view_confirmation', { order_id: orderId });
      } else if (order.paymentStatus === 'PENDING') {
        renderPending(orderId);
      } else {
        show('suError');
      }
      return;
    }

    try {
      const stored = sessionStorage.getItem('infogrip_custom_song_order');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.orderId === orderId && data.paymentStatus === 'PAID') {
          renderSuccess(orderId, data);
          firePurchaseOnce(orderId);
          return;
        }
      }
    } catch (_) {}

    show('suError');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
