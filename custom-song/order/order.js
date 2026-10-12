
(function() {
  'use strict';

  /* ============================================================
     ⚙️ CONFIGURATION — PASTE YOUR APPS SCRIPT WEB APP URL BELOW
     ------------------------------------------------------------
     Get this URL from:
     Apps Script → Deploy → Manage deployments → Web app URL
     It should look like:
     https://script.google.com/macros/s/AKfycb.../exec
     ============================================================ */
  const CUSTOM_SONG_API_URL = 'https://script.google.com/macros/s/AKfycbxjQviN-PS1ZNX7MEKPC-PGC0rgRr6PuIKks2hg4N17HyBYbFvwI26orqy3dOCUCPu31g/exec';

  const CHECKOUT_URL = '/custom-song/checkout/';
  const ORDER_STORAGE_KEY = 'infogrip_custom_song_order';
  const OFFER_PRICE = 999;

  /* ============================================================
     CONSTANTS
     ============================================================ */
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

  function getUtmParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || '',
      utmContent: params.get('utm_content') || '',
      utmTerm: params.get('utm_term') || ''
    };
  }

  function scrollToField(el) {
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function showNetworkAlert(message) {
    const alert = $('#ofNetworkAlert');
    const text = $('#ofNetworkAlertText');
    if (text) text.textContent = message;
    if (alert) alert.classList.add('is-visible');
    // Scroll up to see it
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function hideNetworkAlert() {
    const alert = $('#ofNetworkAlert');
    if (alert) alert.classList.remove('is-visible');
  }

  /* ============================================================
     SEARCHABLE DROPDOWN
     ============================================================ */
  class SearchableDropdown {
    constructor(options) {
      this.triggerId = options.triggerId;
      this.triggerTextId = options.triggerTextId;
      this.searchId = options.searchId;
      this.listId = options.listId;
      this.dropdownId = options.dropdownId;
      this.hiddenId = options.hiddenId;
      this.items = options.items;
      this.placeholder = options.placeholder;
      this.onChange = options.onChange || (() => {});

      this.trigger = document.getElementById(this.triggerId);
      this.triggerText = document.getElementById(this.triggerTextId);
      this.searchInput = document.getElementById(this.searchId);
      this.list = document.getElementById(this.listId);
      this.dropdown = document.getElementById(this.dropdownId);
      this.hiddenInput = document.getElementById(this.hiddenId);

      this.selectedValue = '';
      this.highlightedIndex = -1;
      this.filteredItems = [...this.items];

      this.init();
    }

    init() {
      this.renderList();

      this.trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });

      this.searchInput.addEventListener('input', () => {
        this.filter(this.searchInput.value);
      });

      this.searchInput.addEventListener('keydown', (e) => {
        this.handleKeydown(e);
      });

      document.addEventListener('click', (e) => {
        if (!this.dropdown.contains(e.target)) this.close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.dropdown.classList.contains('is-open')) {
          this.close();
        }
      });
    }

    renderList() {
      this.list.innerHTML = '';
      if (this.filteredItems.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'of-dropdown__empty';
        empty.textContent = 'कोई परिणाम नहीं मिला';
        this.list.appendChild(empty);
        return;
      }
      this.filteredItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'of-dropdown__option';
        li.setAttribute('role', 'option');
        li.setAttribute('data-value', item);
        if (item === this.selectedValue) {
          li.classList.add('is-selected');
          li.setAttribute('aria-selected', 'true');
        }
        li.innerHTML = `<span>${item}</span><i class="fas fa-check"></i>`;
        li.addEventListener('click', (e) => {
          e.stopPropagation();
          this.select(item);
        });
        li.addEventListener('mouseenter', () => {
          this.highlightedIndex = index;
          this.updateHighlight();
        });
        this.list.appendChild(li);
      });
    }

    filter(query) {
      const q = query.toLowerCase().trim();
      this.filteredItems = this.items.filter(item =>
        item.toLowerCase().includes(q)
      );
      this.renderList();
      this.highlightedIndex = -1;
    }

    handleKeydown(e) {
      const options = $$('.of-dropdown__option', this.list);
      if (options.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.highlightedIndex = Math.min(this.highlightedIndex + 1, options.length - 1);
        this.updateHighlight();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
        this.updateHighlight();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (this.highlightedIndex >= 0 && options[this.highlightedIndex]) {
          const value = options[this.highlightedIndex].getAttribute('data-value');
          this.select(value);
        }
      }
    }

    updateHighlight() {
      const options = $$('.of-dropdown__option', this.list);
      options.forEach((opt, i) => {
        opt.classList.toggle('is-highlighted', i === this.highlightedIndex);
      });
    }

    select(value) {
      this.selectedValue = value;
      this.triggerText.textContent = value;
      this.triggerText.classList.remove('is-placeholder');
      this.hiddenInput.value = value;
      $$('.of-dropdown__option', this.list).forEach(opt => {
        const isSelected = opt.getAttribute('data-value') === value;
        opt.classList.toggle('is-selected', isSelected);
        opt.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      });
      this.close();
      this.clearError();
      this.onChange(value);
    }

    toggle() {
      if (this.dropdown.classList.contains('is-open')) this.close();
      else this.open();
    }

    open() {
      $$('.of-dropdown.is-open').forEach(d => {
        if (d !== this.dropdown) d.classList.remove('is-open');
      });
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
      const errorEl = document.getElementById(this.hiddenId + '-error');
      if (errorEl) errorEl.classList.remove('is-visible');
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

  /* ============================================================
     STATE
     ============================================================ */
  let roleDropdown;
  let partyDropdown;

  const formState = {
    songFocus: '',
    songStyle: ''
  };

  /* ============================================================
     INIT DROPDOWNS
     ============================================================ */
  function initDropdowns() {
    roleDropdown = new SearchableDropdown({
      triggerId: 'role-trigger',
      triggerTextId: 'role-trigger-text',
      searchId: 'role-search',
      listId: 'role-list',
      dropdownId: 'role-dropdown',
      hiddenId: 'role',
      items: ROLES,
      placeholder: 'अपनी भूमिका चुनें',
      onChange: handleRoleChange
    });

    partyDropdown = new SearchableDropdown({
      triggerId: 'party-trigger',
      triggerTextId: 'party-trigger-text',
      searchId: 'party-search',
      listId: 'party-list',
      dropdownId: 'party-dropdown',
      hiddenId: 'party',
      items: PARTIES,
      placeholder: 'पार्टी / संगठन चुनें',
      onChange: handlePartyChange
    });
  }

  /* ============================================================
     ROLE CHANGE
     ============================================================ */
  function handleRoleChange(role) {
    const isSarpanch = SARPANCH_ROLES.includes(role);
    const gramPanchayatField = $('#gram-panchayat-field');
    const partyField = $('#party-field');
    const otherPartyField = $('#otherParty-field');

    if (isSarpanch) {
      gramPanchayatField.classList.add('is-visible');
      partyField.classList.remove('is-visible');
      otherPartyField.classList.remove('is-visible');
      partyDropdown.reset();
      $('#otherParty').value = '';
      const partyError = $('#party-error');
      if (partyError) partyError.classList.remove('is-visible');
    } else {
      gramPanchayatField.classList.remove('is-visible');
      partyField.classList.add('is-visible');
      $('#gramPanchayat').value = '';
      $('#gramPanchayat').classList.remove('is-error');
      const gpError = $('#gramPanchayat-error');
      if (gpError) gpError.classList.remove('is-visible');
    }
  }

  /* ============================================================
     PARTY CHANGE
     ============================================================ */
  function handlePartyChange(party) {
    const otherPartyField = $('#otherParty-field');
    const otherPartyInput = $('#otherParty');
    const otherPartyLabel = $('#otherParty-label');

    if (PARTY_CONDITIONS[party]) {
      otherPartyField.classList.add('is-visible');
      otherPartyLabel.textContent = PARTY_CONDITIONS[party].label;
      otherPartyInput.placeholder = PARTY_CONDITIONS[party].placeholder;
    } else {
      otherPartyField.classList.remove('is-visible');
      otherPartyInput.value = '';
    }
  }

  /* ============================================================
     CARD SELECTION
     ============================================================ */
  function initCardSelection(containerId, hiddenInputId, stateKey) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const cards = $$('.of-card-option', container);
    const hiddenInput = document.getElementById(hiddenInputId);

    cards.forEach(card => {
      card.addEventListener('click', () => {
        selectCard(card, cards, hiddenInput, stateKey);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectCard(card, cards, hiddenInput, stateKey);
        }
      });
    });
  }

  function selectCard(card, allCards, hiddenInput, stateKey) {
    const value = card.getAttribute('data-value');
    allCards.forEach(c => {
      c.classList.remove('is-selected');
      c.classList.remove('is-error');
      c.setAttribute('aria-checked', 'false');
    });
    card.classList.add('is-selected');
    card.setAttribute('aria-checked', 'true');
    hiddenInput.value = value;
    formState[stateKey] = value;
    const errorEl = document.getElementById(hiddenInput.id + '-error');
    if (errorEl) errorEl.classList.remove('is-visible');
  }

  /* ============================================================
     CHARACTER COUNTER
     ============================================================ */
  function initCharCounter() {
    const textarea = $('#specialMessage');
    const counter = $('#charCount');
    if (!textarea || !counter) return;
    textarea.addEventListener('input', () => {
      counter.textContent = textarea.value.length;
    });
  }

  /* ============================================================
     MOBILE INPUT
     ============================================================ */
  function initMobileInput() {
    const mobileInput = $('#mobile');
    if (!mobileInput) return;
    mobileInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
      if (e.target.value.length > 0) {
        e.target.classList.remove('is-error');
        $('#mobile-error').classList.remove('is-visible');
      }
    });
    mobileInput.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text');
      const cleaned = pasted.replace(/\D/g, '').slice(0, 10);
      e.target.value = cleaned;
    });
  }

  /* ============================================================
     VALIDATION
     ============================================================ */
  function validateForm() {
    let isValid = true;
    let firstInvalid = null;

    // Name
    const name = $('#name').value.trim();
    if (!name || name.length < 2 || /^\d+$/.test(name)) {
      showError('name');
      if (!firstInvalid) firstInvalid = $('#name');
      isValid = false;
    } else clearError('name');

    // Role
    const role = roleDropdown.getValue();
    if (!role) {
      showDropdownError('role');
      if (!firstInvalid) firstInvalid = $('#role-trigger');
      isValid = false;
    } else clearDropdownError('role');

    // Gram Panchayat
    if (SARPANCH_ROLES.includes(role)) {
      const gp = $('#gramPanchayat').value.trim();
      if (!gp) {
        showError('gramPanchayat');
        if (!firstInvalid) firstInvalid = $('#gramPanchayat');
        isValid = false;
      } else clearError('gramPanchayat');
    }

    // Mobile
    const mobile = $('#mobile').value.trim();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      showError('mobile');
      if (!firstInvalid) firstInvalid = $('#mobile');
      isValid = false;
    } else clearError('mobile');

    // Song Focus
    if (!formState.songFocus) {
      showCardError('songFocus');
      if (!firstInvalid) firstInvalid = $('#songFocus-cards');
      isValid = false;
    } else clearCardError('songFocus');

    // Song Style
    if (!formState.songStyle) {
      showCardError('songStyle');
      if (!firstInvalid) firstInvalid = $('#songStyle-cards');
      isValid = false;
    } else clearCardError('songStyle');

    // Consents
    const consent1 = $('#consent1').checked;
    const consent2 = $('#consent2').checked;
    if (!consent1 || !consent2) {
      showConsentError();
      if (!firstInvalid) firstInvalid = $('#consent1');
      isValid = false;
    } else clearConsentError();

    if (firstInvalid) scrollToField(firstInvalid);
    return isValid;
  }

  function showError(fieldId) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + '-error');
    if (input) input.classList.add('is-error');
    if (error) error.classList.add('is-visible');
  }
  function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + '-error');
    if (input) input.classList.remove('is-error');
    if (error) error.classList.remove('is-visible');
  }
  function showDropdownError(fieldId) {
    const trigger = document.getElementById(fieldId + '-trigger');
    const error = document.getElementById(fieldId + '-error');
    if (trigger) trigger.classList.add('is-error');
    if (error) error.classList.add('is-visible');
  }
  function clearDropdownError(fieldId) {
    const trigger = document.getElementById(fieldId + '-trigger');
    const error = document.getElementById(fieldId + '-error');
    if (trigger) trigger.classList.remove('is-error');
    if (error) error.classList.remove('is-visible');
  }
  function showCardError(fieldId) {
    const cards = document.querySelectorAll('#' + fieldId + '-cards .of-card-option');
    const error = document.getElementById(fieldId + '-error');
    cards.forEach(c => c.classList.add('is-error'));
    if (error) error.classList.add('is-visible');
  }
  function clearCardError(fieldId) {
    const cards = document.querySelectorAll('#' + fieldId + '-cards .of-card-option');
    const error = document.getElementById(fieldId + '-error');
    cards.forEach(c => c.classList.remove('is-error'));
    if (error) error.classList.remove('is-visible');
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

  /* ============================================================
     BUILD ORDER PAYLOAD
     ============================================================ */
  function buildOrderPayload() {
    const utm = getUtmParams();
    const role = roleDropdown.getValue();
    const isSarpanch = SARPANCH_ROLES.includes(role);

    return {
      name: $('#name').value.trim(),
      position: role,
      party: isSarpanch ? '' : partyDropdown.getValue(),
      otherParty: isSarpanch ? '' : $('#otherParty').value.trim(),
      mobile: $('#mobile').value.trim(),
      area: $('#area').value.trim(),
      gramPanchayat: isSarpanch ? $('#gramPanchayat').value.trim() : '',
      songFocus: formState.songFocus,
      songStyle: formState.songStyle,
      specialMessage: $('#specialMessage').value.trim(),
      utmSource: utm.utmSource,
      utmMedium: utm.utmMedium,
      utmCampaign: utm.utmCampaign,
      utmContent: utm.utmContent,
      utmTerm: utm.utmTerm
    };
  }

  /* ============================================================
     SUBMIT TO BACKEND
     ============================================================ */
  async function submitToBackend(payload) {
    if (!CUSTOM_SONG_API_URL || CUSTOM_SONG_API_URL.indexOf('PASTE_') === 0) {
      throw Object.assign(new Error('Backend URL not configured'), { code: 'NO_API_URL' });
    }

    const res = await fetch(CUSTOM_SONG_API_URL, {
      method: 'POST',
      // text/plain avoids CORS preflight — Apps Script cannot answer OPTIONS
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'createOrder', data: payload })
    });

    if (!res.ok) {
      throw Object.assign(new Error('Server error ' + res.status), { code: 'HTTP_ERROR' });
    }

    let json;
    try {
      json = await res.json();
    } catch (_) {
      throw Object.assign(new Error('Invalid server response'), { code: 'BAD_JSON' });
    }

    if (!json.success) {
      const msg = (json.error && json.error.message) || 'Order creation failed';
      const code = (json.error && json.error.code) || 'BACKEND_ERROR';
      throw Object.assign(new Error(msg), { code: code, backendMessage: msg });
    }

    return json; // { success, orderId, order }
  }

  /* ============================================================
     SUBMIT BUTTON STATE
     ============================================================ */
  const submitBtn = $('#submitBtn');
  const submitBtnText = $('#submitBtnText');
  const submitBtnIcon = $('#submitBtnIcon');
  const submitBtnSpinner = $('#submitBtnSpinner');
  let isSubmitting = false;

  function setLoading(loading) {
    isSubmitting = loading;
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    if (loading) {
      submitBtn.classList.add('is-loading');
      submitBtnText.textContent = 'Order तैयार किया जा रहा है...';
      submitBtnIcon.style.display = 'none';
      submitBtnSpinner.style.display = 'inline-block';
    } else {
      submitBtn.classList.remove('is-loading');
      submitBtnText.textContent = '₹999 में अपना Song बनवाएं';
      submitBtnIcon.style.display = 'inline-block';
      submitBtnSpinner.style.display = 'none';
    }
  }

  /* ============================================================
     FORM SUBMIT HANDLER
     ============================================================ */
  function initFormSubmit() {
    const form = $('#orderForm');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (isSubmitting) return;
      hideNetworkAlert();

      if (!validateForm()) return;

      setLoading(true);

      // Fire analytics
      track('begin_checkout', {
        value: OFFER_PRICE,
        currency: 'INR',
        items: [{
          item_id: 'custom-song',
          item_name: 'Custom Professional Song',
          price: OFFER_PRICE,
          quantity: 1
        }]
      });

      const payload = buildOrderPayload();

      try {
        // ---- Try backend ----
        const json = await submitToBackend(payload);

        const orderForStorage = Object.assign({}, payload, {
          orderId: json.orderId,
          amount: OFFER_PRICE,
          currency: 'INR',
          product: 'Custom Professional Song'
        });

        try {
          sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orderForStorage));
        } catch (_) {}

        // Success → redirect to Checkout
        window.location.href = CHECKOUT_URL + '?order=' + encodeURIComponent(json.orderId);

      } catch (err) {
        setLoading(false);

        // Map backend error codes to friendly messages
        const friendlyMap = {
          INVALID_NAME: 'कृपया अपना नाम दर्ज करें।',
          INVALID_POSITION: 'कृपया अपनी भूमिका चुनें।',
          INVALID_MOBILE: 'कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।',
          MISSING_GRAM_PANCHAYAT: 'कृपया ग्राम पंचायत का नाम दर्ज करें।',
          INVALID_SONG_FOCUS: 'कृपया Song का Focus चुनें।',
          INVALID_SONG_STYLE: 'कृपया Song का Style चुनें।'
        };

        let message = 'कुछ तकनीकी समस्या आ गई है। कृपया कुछ देर बाद दोबारा प्रयास करें।';

        if (err.code === 'NO_API_URL') {
          message = 'Backend अभी Configure नहीं है। कृपया Support से संपर्क करें।';
        } else if (friendlyMap[err.code]) {
          message = friendlyMap[err.code];
        } else if (err.code === 'HTTP_ERROR' || err.code === 'BAD_JSON') {
          message = 'Internet connection में समस्या हो सकती है। कृपया दोबारा प्रयास करें।';
        } else if (err.backendMessage) {
          message = err.backendMessage;
        }

        showNetworkAlert(message);
        track('order_create_failed', { error_code: err.code || 'UNKNOWN' });
      }
    });
  }

  /* ============================================================
     RESTORE PREVIOUS DATA (if user came back to edit)
     ============================================================ */
  function restoreFromSessionStorage() {
    try {
      const raw = sessionStorage.getItem(ORDER_STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (!saved) return;

      // Optional: only restore if user came from checkout via "जानकारी बदलें"
      // We restore name, role, mobile, etc. but skip orderId (that will be regenerated)
      if (saved.name) $('#name').value = saved.name;
      if (saved.mobile) $('#mobile').value = saved.mobile;
      if (saved.area) $('#area').value = saved.area;
      if (saved.specialMessage) {
        $('#specialMessage').value = saved.specialMessage;
        $('#charCount').textContent = saved.specialMessage.length;
      }

      if (saved.position) {
        roleDropdown.select(saved.position);
        // Restore conditional field values
        const isSarpanch = SARPANCH_ROLES.includes(saved.position);
        if (isSarpanch && saved.gramPanchayat) {
          $('#gramPanchayat').value = saved.gramPanchayat;
        } else if (saved.party) {
          partyDropdown.select(saved.party);
          if (saved.otherParty) {
            $('#otherParty').value = saved.otherParty;
          }
        }
      }

      // Restore card selections
      if (saved.songFocus) {
        const focusCard = document.querySelector('#songFocus-cards .of-card-option[data-value="' + saved.songFocus + '"]');
        if (focusCard) {
          focusCard.click();
        }
      }
      if (saved.songStyle) {
        const styleCard = document.querySelector('#songStyle-cards .of-card-option[data-value="' + saved.songStyle + '"]');
        if (styleCard) {
          styleCard.click();
        }
      }
    } catch (_) {}
  }

  /* ============================================================
     CLEAR OLD ERRORS ON INPUT
     ============================================================ */
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

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    // Track view_item
    track('view_item', {
      value: OFFER_PRICE,
      currency: 'INR',
      items: [{
        item_id: 'custom-song',
        item_name: 'Custom Professional Song',
        price: OFFER_PRICE,
        quantity: 1
      }]
    });

    initDropdowns();
    initCardSelection('songFocus-cards', 'songFocus', 'songFocus');
    initCardSelection('songStyle-cards', 'songStyle', 'songStyle');
    initCharCounter();
    initMobileInput();
    initErrorClearers();
    initFormSubmit();
    restoreFromSessionStorage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();