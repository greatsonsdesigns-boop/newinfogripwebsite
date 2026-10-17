
(function() {
  'use strict';

  const CUSTOM_SONG_API_URL = 'https://script.google.com/macros/s/AKfycbxjQviN-PS1ZNX7MEKPC-PGC0rgRr6PuIKks2hg4N17HyBYbFvwI26orqy3dOCUCPu31g/exec';
  const CHECKOUT_URL = '/custom-song/checkout/';
  const ORDER_STORAGE_KEY = 'infogrip_custom_song_order';
  const OFFER_PRICE = 999;

  const SARPANCH_ROLES = ['सरपंच', 'सरपंच प्रत्याशी'];

  const ROLES = [
    'सरपंच','सरपंच प्रत्याशी',
    'पंचायत समिति सदस्य','पंचायत समिति सदस्य प्रत्याशी',
    'जिला परिषद सदस्य','जिला परिषद सदस्य प्रत्याशी',
    'पार्षद','पार्षद प्रत्याशी',
    'विधायक','विधायक प्रत्याशी',
    'सांसद','सांसद प्रत्याशी',
    'पार्टी नेता','पार्टी पदाधिकारी',
    'युवा नेता','छात्र नेता',
    'सामाजिक कार्यकर्ता','जनप्रतिनिधि',
    'चुनाव प्रत्याशी','राजनीतिक कार्यकर्ता',
    'अन्य'
  ];

  const PARTIES = [
    'BJP','Congress','AAP','BSP','SP','RLP',
    'निर्दलीय','अन्य पार्टी','सामाजिक संगठन','अन्य','बताना नहीं चाहते'
  ];

  const PARTY_CONDITIONS = {
    'अन्य पार्टी': { label: 'पार्टी का नाम', placeholder: 'अपनी पार्टी का नाम लिखें' },
    'सामाजिक संगठन': { label: 'संगठन का नाम', placeholder: 'संगठन का नाम लिखें' },
    'अन्य': { label: 'पार्टी / संगठन का नाम', placeholder: 'नाम लिखें' }
  };

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  function track(name, params) {
    try { if (typeof window.gtag === 'function') window.gtag('event', name, Object.assign({}, params || {})); } catch(_) {}
  }

  function getUtmParams() {
    const p = new URLSearchParams(window.location.search);
    return {
      utmSource: p.get('utm_source') || '',
      utmMedium: p.get('utm_medium') || '',
      utmCampaign: p.get('utm_campaign') || '',
      utmContent: p.get('utm_content') || '',
      utmTerm: p.get('utm_term') || ''
    };
  }

  function getAttribution() {
    try {
      const raw = sessionStorage.getItem('ig_attribution');
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    const p = new URLSearchParams(window.location.search);
    return {
      utm_source: p.get('utm_source') || '',
      utm_medium: p.get('utm_medium') || '',
      utm_campaign: p.get('utm_campaign') || '',
      utm_content: p.get('utm_content') || '',
      utm_term: p.get('utm_term') || '',
      fbclid: p.get('fbclid') || '',
      landing_page: '/custom-song/'
    };
  }

  function scrollToTop() {
    const el = $('#ofFormTop');
    if (!el) return;
    const stickyH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--of-sticky-h')) || 64;
    const y = el.getBoundingClientRect().top + window.pageYOffset - stickyH - 12;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }

  function scrollToField(el) {
    if (!el) return;
    const stickyH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--of-sticky-h')) || 64;
    const y = el.getBoundingClientRect().top + window.pageYOffset - stickyH - 20;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }

  function showNetworkAlert(msg) {
    const a = $('#ofNetworkAlert');
    const t = $('#ofNetworkAlertText');
    if (t) t.textContent = msg;
    if (a) a.classList.add('is-visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function hideNetworkAlert() {
    const a = $('#ofNetworkAlert');
    if (a) a.classList.remove('is-visible');
  }

  const STEP_LABELS = ['आपकी जानकारी', 'Song की पसंद', 'Review & Confirm'];
  let currentStep = 1;

  function goToStep(step) {
    step = Math.max(1, Math.min(3, step));
    const prevStep = currentStep;
    currentStep = step;

    $$('.of-step-panel').forEach(p => {
      p.classList.toggle('is-active', Number(p.getAttribute('data-step')) === step);
    });

    $$('.of-step-indicator').forEach(ind => {
      const s = Number(ind.getAttribute('data-step'));
      ind.classList.toggle('is-active', s === step);
      ind.classList.toggle('is-complete', s < step);
    });

    const c = String(step).padStart(2, '0') + ' / 03';
    const l = STEP_LABELS[step - 1];
    const mc = $('#ofMobileStepCount');
    const ml = $('#ofMobileStepLabel');
    const mf = $('#ofMobileStepFill');
    if (mc) mc.textContent = c;
    if (ml) ml.textContent = l;
    if (mf) mf.style.width = ((step / 3) * 100) + '%';

    if (step === 3) buildReview();

    // TRACKING: step transition
    if (step > prevStep) {
      track('form_step_complete', {
        step_number: prevStep,
        step_name: STEP_LABELS[prevStep - 1] || ''
      });
      if (step === 3) track('form_review', { value: OFFER_PRICE, currency: 'INR' });
    }

    scrollToTop();
  }

  function wireStepButtons() {
    $$('[data-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = Number(btn.getAttribute('data-next'));
        if (validateStep(currentStep)) goToStep(next);
      });
    });
    $$('[data-back]').forEach(btn => {
      btn.addEventListener('click', () => goToStep(Number(btn.getAttribute('data-back'))));
    });
    $$('[data-goto]').forEach(btn => {
      btn.addEventListener('click', () => goToStep(Number(btn.getAttribute('data-goto'))));
    });
  }

  function validateStep(step) {
    let ok = true, firstInvalid = null;

    if (step === 1) {
      const name = $('#name').value.trim();
      if (!name || name.length < 2 || /^\d+$/.test(name)) {
        showError('name'); ok = false; if (!firstInvalid) firstInvalid = $('#name');
      } else clearError('name');

      const role = roleDropdown ? roleDropdown.getValue() : $('#role').value;
      if (!role) {
        showDropdownError('role'); ok = false; if (!firstInvalid) firstInvalid = $('#role-trigger');
      } else clearDropdownError('role');

      if (SARPANCH_ROLES.includes(role)) {
        const gp = $('#gramPanchayat').value.trim();
        if (!gp) {
          showError('gramPanchayat'); ok = false; if (!firstInvalid) firstInvalid = $('#gramPanchayat');
        } else clearError('gramPanchayat');
      }

      const m = $('#mobile').value.trim();
      if (!/^[6-9]\d{9}$/.test(m)) {
        showError('mobile'); ok = false; if (!firstInvalid) firstInvalid = $('#mobile');
      } else clearError('mobile');
    }

    if (step === 2) {
      if (!formState.songFocus) {
        showCardError('songFocus'); ok = false; if (!firstInvalid) firstInvalid = $('#songFocus-cards');
      } else clearCardError('songFocus');

      if (!formState.songStyle) {
        showCardError('songStyle'); ok = false; if (!firstInvalid) firstInvalid = $('#songStyle-cards');
      } else clearCardError('songStyle');
    }

    if (firstInvalid) scrollToField(firstInvalid);
    return ok;
  }

  class SearchableDropdown {
    constructor(opts) {
      Object.assign(this, opts);
      this.trigger = document.getElementById(this.triggerId);
      this.triggerText = document.getElementById(this.triggerTextId);
      this.searchInput = document.getElementById(this.searchId);
      this.list = document.getElementById(this.listId);
      this.dropdown = document.getElementById(this.dropdownId);
      this.hiddenInput = document.getElementById(this.hiddenId);
      this.selectedValue = '';
      this.highlightedIndex = -1;
      this.filteredItems = [...this.items];
      this.onChange = opts.onChange || (() => {});
      this.init();
    }
    init() {
      this.renderList();
      this.trigger.addEventListener('click', e => { e.stopPropagation(); this.toggle(); });
      this.searchInput.addEventListener('input', () => this.filter(this.searchInput.value));
      this.searchInput.addEventListener('keydown', e => this.handleKeydown(e));
      document.addEventListener('click', e => { if (!this.dropdown.contains(e.target)) this.close(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && this.dropdown.classList.contains('is-open')) this.close(); });
    }
    renderList() {
      this.list.innerHTML = '';
      if (this.filteredItems.length === 0) {
        const e = document.createElement('li');
        e.className = 'of-dropdown__empty';
        e.textContent = 'कोई परिणाम नहीं मिला';
        this.list.appendChild(e);
        return;
      }
      this.filteredItems.forEach((item, i) => {
        const li = document.createElement('li');
        li.className = 'of-dropdown__option';
        li.setAttribute('role', 'option');
        li.setAttribute('data-value', item);
        if (item === this.selectedValue) {
          li.classList.add('is-selected');
          li.setAttribute('aria-selected', 'true');
        }
        li.innerHTML = `<span>${item}</span><i class="fas fa-check"></i>`;
        li.addEventListener('click', e => { e.stopPropagation(); this.select(item); });
        li.addEventListener('mouseenter', () => { this.highlightedIndex = i; this.updateHighlight(); });
        this.list.appendChild(li);
      });
    }
    filter(q) {
      const s = q.toLowerCase().trim();
      this.filteredItems = this.items.filter(x => x.toLowerCase().includes(s));
      this.renderList();
      this.highlightedIndex = -1;
    }
    handleKeydown(e) {
      const opts = $$('.of-dropdown__option', this.list);
      if (!opts.length) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); this.highlightedIndex = Math.min(this.highlightedIndex + 1, opts.length - 1); this.updateHighlight(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0); this.updateHighlight(); }
      else if (e.key === 'Enter') { e.preventDefault(); if (this.highlightedIndex >= 0) this.select(opts[this.highlightedIndex].getAttribute('data-value')); }
    }
    updateHighlight() {
      $$('.of-dropdown__option', this.list).forEach((o, i) => o.classList.toggle('is-highlighted', i === this.highlightedIndex));
    }
    select(v) {
      this.selectedValue = v;
      this.triggerText.textContent = v;
      this.triggerText.classList.remove('is-placeholder');
      this.hiddenInput.value = v;
      $$('.of-dropdown__option', this.list).forEach(o => {
        const sel = o.getAttribute('data-value') === v;
        o.classList.toggle('is-selected', sel);
        o.setAttribute('aria-selected', sel ? 'true' : 'false');
      });
      this.close(); this.clearError(); this.onChange(v);
    }
    toggle() { this.dropdown.classList.contains('is-open') ? this.close() : this.open(); }
    open() {
      $$('.of-dropdown.is-open').forEach(d => { if (d !== this.dropdown) d.classList.remove('is-open'); });
      this.dropdown.classList.add('is-open');
      this.trigger.setAttribute('aria-expanded', 'true');
      this.searchInput.value = '';
      this.filter('');
      this.highlightedIndex = -1;
      setTimeout(() => this.searchInput.focus(), 50);
    }
    close() {
      this.dropdown.classList.remove('is-open');
      this.trigger.setAttribute('aria-expanded', 'false');
    }
    clearError() {
      this.trigger.classList.remove('is-error');
      const e = document.getElementById(this.hiddenId + '-error');
      if (e) e.classList.remove('is-visible');
    }
    reset() {
      this.selectedValue = '';
      this.triggerText.textContent = this.placeholder;
      this.triggerText.classList.add('is-placeholder');
      this.hiddenInput.value = '';
      this.renderList();
    }
    getValue() { return this.selectedValue; }
  }

  let roleDropdown, partyDropdown;
  const formState = { songFocus: '', songStyle: '' };

  function initDropdowns() {
    roleDropdown = new SearchableDropdown({
      triggerId: 'role-trigger', triggerTextId: 'role-trigger-text',
      searchId: 'role-search', listId: 'role-list',
      dropdownId: 'role-dropdown', hiddenId: 'role',
      items: ROLES, placeholder: 'अपनी भूमिका चुनें',
      onChange: handleRoleChange
    });
    partyDropdown = new SearchableDropdown({
      triggerId: 'party-trigger', triggerTextId: 'party-trigger-text',
      searchId: 'party-search', listId: 'party-list',
      dropdownId: 'party-dropdown', hiddenId: 'party',
      items: PARTIES, placeholder: 'पार्टी / संगठन चुनें',
      onChange: handlePartyChange
    });
  }

  function handleRoleChange(role) {
    const isSarpanch = SARPANCH_ROLES.includes(role);
    const gpF = $('#gram-panchayat-field');
    const pF = $('#party-field');
    const opF = $('#otherParty-field');
    if (isSarpanch) {
      gpF.classList.add('is-visible');
      pF.classList.remove('is-visible');
      opF.classList.remove('is-visible');
      partyDropdown.reset();
      $('#otherParty').value = '';
    } else {
      gpF.classList.remove('is-visible');
      pF.classList.add('is-visible');
      $('#gramPanchayat').value = '';
      $('#gramPanchayat').classList.remove('is-error');
      const ge = $('#gramPanchayat-error');
      if (ge) ge.classList.remove('is-visible');
    }
  }

  function handlePartyChange(party) {
    const opF = $('#otherParty-field');
    const opI = $('#otherParty');
    const opL = $('#otherParty-label');
    if (PARTY_CONDITIONS[party]) {
      opF.classList.add('is-visible');
      opL.textContent = PARTY_CONDITIONS[party].label;
      opI.placeholder = PARTY_CONDITIONS[party].placeholder;
    } else {
      opF.classList.remove('is-visible');
      opI.value = '';
    }
  }

  function initCardSelection(containerId, hiddenId, stateKey) {
    const c = document.getElementById(containerId);
    if (!c) return;
    const cards = $$('.of-card-option', c);
    const h = document.getElementById(hiddenId);
    cards.forEach(card => {
      card.addEventListener('click', () => selectCard(card, cards, h, stateKey));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectCard(card, cards, h, stateKey); }
      });
    });
  }

  function selectCard(card, all, hidden, key) {
    const v = card.getAttribute('data-value');
    all.forEach(c => { c.classList.remove('is-selected', 'is-error'); c.setAttribute('aria-checked', 'false'); });
    card.classList.add('is-selected');
    card.setAttribute('aria-checked', 'true');
    hidden.value = v;
    formState[key] = v;
    const e = document.getElementById(hidden.id + '-error');
    if (e) e.classList.remove('is-visible');
  }

  function initCharCounter() {
    const t = $('#specialMessage');
    const c = $('#charCount');
    if (!t || !c) return;
    t.addEventListener('input', () => { c.textContent = t.value.length; });
  }

  function initMobileInput() {
    const m = $('#mobile');
    if (!m) return;
    m.addEventListener('input', e => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
      if (e.target.value.length > 0) {
        e.target.classList.remove('is-error');
        $('#mobile-error').classList.remove('is-visible');
      }
    });
    m.addEventListener('paste', e => {
      e.preventDefault();
      const p = (e.clipboardData || window.clipboardData).getData('text');
      e.target.value = p.replace(/\D/g, '').slice(0, 10);
    });
  }

  function showError(id) {
    const i = document.getElementById(id);
    const e = document.getElementById(id + '-error');
    if (i) i.classList.add('is-error');
    if (e) e.classList.add('is-visible');
  }
  function clearError(id) {
    const i = document.getElementById(id);
    const e = document.getElementById(id + '-error');
    if (i) i.classList.remove('is-error');
    if (e) e.classList.remove('is-visible');
  }
  function showDropdownError(id) {
    const t = document.getElementById(id + '-trigger');
    const e = document.getElementById(id + '-error');
    if (t) t.classList.add('is-error');
    if (e) e.classList.add('is-visible');
  }
  function clearDropdownError(id) {
    const t = document.getElementById(id + '-trigger');
    const e = document.getElementById(id + '-error');
    if (t) t.classList.remove('is-error');
    if (e) e.classList.remove('is-visible');
  }
  function showCardError(id) {
    document.querySelectorAll('#' + id + '-cards .of-card-option').forEach(c => c.classList.add('is-error'));
    const e = document.getElementById(id + '-error');
    if (e) e.classList.add('is-visible');
  }
  function clearCardError(id) {
    document.querySelectorAll('#' + id + '-cards .of-card-option').forEach(c => c.classList.remove('is-error'));
    const e = document.getElementById(id + '-error');
    if (e) e.classList.remove('is-visible');
  }
  function showConsentError() {
    $('#consent1-label').classList.add('is-error');
    $('#consent2-label').classList.add('is-error');
    $('#consent-error').classList.add('is-visible');
  }
  function clearConsentError() {
    $('#consent1-label').classList.remove('is-error');
    $('#consent2-label').classList.remove('is-error');
    $('#consent-error').classList.remove('is-visible');
  }

  function buildReview() {
    const infoRows = [];
    if ($('#name').value.trim()) infoRows.push(['नाम', $('#name').value.trim()]);
    if (roleDropdown && roleDropdown.getValue()) infoRows.push(['भूमिका', roleDropdown.getValue()]);
    if (SARPANCH_ROLES.includes(roleDropdown ? roleDropdown.getValue() : '')) {
      if ($('#gramPanchayat').value.trim()) infoRows.push(['ग्राम पंचायत', $('#gramPanchayat').value.trim()]);
    } else {
      if (partyDropdown && partyDropdown.getValue()) infoRows.push(['पार्टी / संगठन', partyDropdown.getValue()]);
      if ($('#otherParty').value.trim()) infoRows.push(['विवरण', $('#otherParty').value.trim()]);
    }
    if ($('#mobile').value.trim()) infoRows.push(['मोबाइल', $('#mobile').value.trim()]);
    if ($('#area').value.trim()) infoRows.push(['क्षेत्र', $('#area').value.trim()]);
    renderReviewRows('#reviewInfoRows', infoRows);

    const songRows = [];
    if (formState.songFocus) songRows.push(['Song Focus', formState.songFocus]);
    if (formState.songStyle) songRows.push(['Song Style', formState.songStyle]);
    if ($('#specialMessage').value.trim()) songRows.push(['विशेष संदेश', $('#specialMessage').value.trim()]);
    renderReviewRows('#reviewSongRows', songRows);
  }

  function renderReviewRows(sel, rows) {
    const el = $(sel);
    if (!el) return;
    el.innerHTML = rows.map(([l, v]) => `
      <div class="of-review-row">
        <span class="of-review-row__label">${esc(l)}</span>
        <span class="of-review-row__value">${esc(v)}</span>
      </div>
    `).join('');
  }

  function esc(s) {
    if (s == null) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function buildOrderPayload() {
    const utm = getUtmParams();
    const att = getAttribution();
    const role = roleDropdown.getValue();
    const isS = SARPANCH_ROLES.includes(role);
    return {
      name: $('#name').value.trim(),
      position: role,
      party: isS ? '' : partyDropdown.getValue(),
      otherParty: isS ? '' : $('#otherParty').value.trim(),
      mobile: $('#mobile').value.trim(),
      area: $('#area').value.trim(),
      gramPanchayat: isS ? $('#gramPanchayat').value.trim() : '',
      songFocus: formState.songFocus,
      songStyle: formState.songStyle,
      specialMessage: $('#specialMessage').value.trim(),
      utmSource: att.utm_source || utm.utmSource || '',
      utmMedium: att.utm_medium || utm.utmMedium || '',
      utmCampaign: att.utm_campaign || utm.utmCampaign || '',
      utmContent: att.utm_content || utm.utmContent || '',
      utmTerm: att.utm_term || utm.utmTerm || '',
      fbclid: att.fbclid || ''
    };
  }

  async function submitToBackend(payload) {
    if (!CUSTOM_SONG_API_URL || CUSTOM_SONG_API_URL.indexOf('PASTE_') === 0) {
      throw Object.assign(new Error('Backend URL not configured'), { code: 'NO_API_URL' });
    }
    const res = await fetch(CUSTOM_SONG_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'createOrder', data: payload })
    });
    if (!res.ok) throw Object.assign(new Error('HTTP ' + res.status), { code: 'HTTP_ERROR' });
    let json;
    try { json = await res.json(); } catch(_) { throw Object.assign(new Error('Invalid response'), { code: 'BAD_JSON' }); }
    if (!json.success) {
      const m = (json.error && json.error.message) || 'Order failed';
      const c = (json.error && json.error.code) || 'BACKEND_ERROR';
      throw Object.assign(new Error(m), { code: c, backendMessage: m });
    }
    return json;
  }

  const submitBtn = $('#submitBtn');
  const submitBtnText = $('#submitBtnText');
  const submitBtnIcon = $('#submitBtnIcon');
  const submitBtnSpinner = $('#submitBtnSpinner');
  let isSubmitting = false;

  function setLoading(l) {
    isSubmitting = l;
    if (!submitBtn) return;
    submitBtn.disabled = l;
    if (l) {
      submitBtnText.textContent = 'Order तैयार किया जा रहा है...';
      submitBtnIcon.style.display = 'none';
      submitBtnSpinner.style.display = 'inline-block';
    } else {
      submitBtnText.textContent = '₹999 में अपना Song बनवाएं';
      submitBtnIcon.style.display = 'inline-block';
      submitBtnSpinner.style.display = 'none';
    }
  }

  /* ---------- TRACKING: form start / abandon ---------- */
  var formStartFired = false;
  var formSubmitted = false;

  function initFormTracking() {
    function onFirstInteraction() {
      if (formStartFired) return;
      formStartFired = true;
      track('form_start', { value: OFFER_PRICE, currency: 'INR' });
      document.removeEventListener('input', onFirstInteraction, true);
      document.removeEventListener('change', onFirstInteraction, true);
    }
    document.addEventListener('input', onFirstInteraction, true);
    document.addEventListener('change', onFirstInteraction, true);

    window.addEventListener('beforeunload', function() {
      if (!formStartFired || formSubmitted) return;
      track('form_abandon', { last_step: currentStep });
    });
  }

  function initFormSubmit() {
    const form = $('#orderForm');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (isSubmitting) return;
      hideNetworkAlert();

      const s1 = validateStep(1);
      const s2 = validateStep(2);

      const c1 = $('#consent1').checked;
      const c2 = $('#consent2').checked;
      if (!c1 || !c2) {
        showConsentError();
        scrollToField($('#consent1'));
        return;
      } else clearConsentError();

      if (!s1) { goToStep(1); return; }
      if (!s2) { goToStep(2); return; }

      setLoading(true);
      track('begin_checkout', {
        value: OFFER_PRICE, currency: 'INR',
        items: [{ item_id: 'CUSTOM_SONG_999', item_name: 'Custom Professional Song', price: OFFER_PRICE, quantity: 1 }]
      });

      const payload = buildOrderPayload();
      try {
        const json = await submitToBackend(payload);
        formSubmitted = true;
        try { sessionStorage.setItem('ig_form_submitted', '1'); } catch(_) {}

        // TRACKING: form submit
        track('form_submit', {
          value: OFFER_PRICE, currency: 'INR',
          items: [{ item_id: 'CUSTOM_SONG_999', item_name: 'Custom Professional Song', price: OFFER_PRICE, quantity: 1 }]
        });

        const forStorage = Object.assign({}, payload, {
          orderId: json.orderId, amount: OFFER_PRICE, currency: 'INR', product: 'Custom Professional Song'
        });
        try { sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(forStorage)); } catch(_) {}
        window.location.href = CHECKOUT_URL + '?order=' + encodeURIComponent(json.orderId);
      } catch (err) {
        setLoading(false);
        const map = {
          INVALID_NAME: 'कृपया अपना नाम दर्ज करें।',
          INVALID_POSITION: 'कृपया अपनी भूमिका चुनें।',
          INVALID_MOBILE: 'कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।',
          MISSING_GRAM_PANCHAYAT: 'कृपया ग्राम पंचायत का नाम दर्ज करें।',
          INVALID_SONG_FOCUS: 'कृपया Song का Focus चुनें।',
          INVALID_SONG_STYLE: 'कृपया Song का Style चुनें।'
        };
        let msg = 'कुछ तकनीकी समस्या आ गई है। कृपया कुछ देर बाद दोबारा प्रयास करें।';
        if (err.code === 'NO_API_URL') msg = 'Backend अभी Configure नहीं है।';
        else if (map[err.code]) msg = map[err.code];
        else if (err.code === 'HTTP_ERROR' || err.code === 'BAD_JSON') msg = 'Internet connection में समस्या हो सकती है। कृपया दोबारा प्रयास करें।';
        else if (err.backendMessage) msg = err.backendMessage;
        showNetworkAlert(msg);
      }
    });
  }

  function restoreFromSessionStorage() {
    try {
      const raw = sessionStorage.getItem(ORDER_STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (!s) return;
      if (s.name) $('#name').value = s.name;
      if (s.mobile) $('#mobile').value = s.mobile;
      if (s.area) $('#area').value = s.area;
      if (s.specialMessage) {
        $('#specialMessage').value = s.specialMessage;
        $('#charCount').textContent = s.specialMessage.length;
      }
      if (s.position) {
        roleDropdown.select(s.position);
        const isS = SARPANCH_ROLES.includes(s.position);
        if (isS && s.gramPanchayat) $('#gramPanchayat').value = s.gramPanchayat;
        else if (s.party) {
          partyDropdown.select(s.party);
          if (s.otherParty) $('#otherParty').value = s.otherParty;
        }
      }
      if (s.songFocus) {
        const f = document.querySelector('#songFocus-cards .of-card-option[data-value="' + s.songFocus + '"]');
        if (f) f.click();
      }
      if (s.songStyle) {
        const f = document.querySelector('#songStyle-cards .of-card-option[data-value="' + s.songStyle + '"]');
        if (f) f.click();
      }
    } catch(_) {}
  }

  function initErrorClearers() {
    $('#name').addEventListener('input', () => clearError('name'));
    $('#gramPanchayat').addEventListener('input', () => clearError('gramPanchayat'));
    $('#mobile').addEventListener('input', () => clearError('mobile'));
    $('#consent1').addEventListener('change', () => {
      if ($('#consent1').checked && $('#consent2').checked) clearConsentError();
    });
    $('#consent2').addEventListener('change', () => {
      if ($('#consent1').checked && $('#consent2').checked) clearConsentError();
    });
  }

  function init() {
    track('view_item', {
      value: OFFER_PRICE, currency: 'INR',
      items: [{ item_id: 'CUSTOM_SONG_999', item_name: 'Custom Professional Song', price: OFFER_PRICE, quantity: 1 }]
    });
    track('form_view', { value: OFFER_PRICE, currency: 'INR' });

    initDropdowns();
    initCardSelection('songFocus-cards', 'songFocus', 'songFocus');
    initCardSelection('songStyle-cards', 'songStyle', 'songStyle');
    initCharCounter();
    initMobileInput();
    initErrorClearers();
    initFormSubmit();
    initFormTracking();
    wireStepButtons();
    restoreFromSessionStorage();
    goToStep(1);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();

})();
