// checkout.js - strict phone validation and checkout logic
document.addEventListener('DOMContentLoaded', () => {
  let cart = JSON.parse(localStorage.getItem('nn_cart') || '{}');
  const $ = id => document.getElementById(id);

  const phoneInput = $('phone');
  const placeBtn = $('place');
  const phoneError = $('phoneError');
  const form = $('checkoutForm');

  // Validation regexes:
  // - Philippine local: 09 followed by 9 digits => total 11 digits (09XXXXXXXXX)
  // - Philippine international: +63 followed by 10 digits => +63XXXXXXXXXX
  // - Fallback: 10-14 digits (only digits) to allow other valid numbers
  const PH_LOCAL = /^09\d{9}$/;
  const PH_INTL = /^\+63\d{10}$/;
  const GENERIC = /^\d{10,14}$/;

  // Utility: sanitize input (allow leading + then digits)
  function sanitizePhoneRaw(value) {
    if (!value) return '';
    value = value.trim();
    // If starts with +, keep + then strip non-digits
    if (value.startsWith('+')) {
      return '+' + value.slice(1).replace(/\D+/g, '');
    }
    // Otherwise strip non-digits
    return value.replace(/\D+/g, '');
  }

  // Validate phone and return {ok, message}
  function validatePhone(value) {
    if (!value) return { ok: false, message: 'Phone number is required.' };
    if (PH_LOCAL.test(value) || PH_INTL.test(value) || GENERIC.test(value)) {
      return { ok: true, message: '' };
    }
    // Provide helpful messages for common mistakes
    if (value.startsWith('+') && !/^\+\d+$/.test(value)) {
      return { ok: false, message: 'Invalid characters in international number.' };
    }
    if (/^[A-Za-z]+$/.test(value)) {
      return { ok: false, message: 'Letters are not allowed in phone number.' };
    }
    return { ok: false, message: 'Enter a valid phone number (e.g. 09XXXXXXXXX or +639XXXXXXXXX).' };
  }

  // Update UI based on phone validity
  function updatePhoneUI() {
    const raw = phoneInput.value;
    const sanitized = sanitizePhoneRaw(raw);
    if (raw !== sanitized) {
      // keep caret at end for simplicity
      phoneInput.value = sanitized;
    }
    const res = validatePhone(sanitized);
    if (!res.ok) {
      phoneInput.setAttribute('aria-invalid', 'true');
      phoneError.hidden = false;
      phoneError.innerText = res.message;
      placeBtn.disabled = true;
    } else {
      phoneInput.removeAttribute('aria-invalid');
      phoneError.hidden = true;
      phoneError.innerText = '';
      // enable place only if other required fields are filled
      placeBtn.disabled = !areRequiredFieldsFilled();
    }
  }

  // Check other required fields
  function areRequiredFieldsFilled() {
    const name = $('name').value.trim();
    const address = $('address').value.trim();
    const phone = phoneInput.value.trim();
    const validPhone = validatePhone(phone).ok;
    return name.length > 0 && address.length > 0 && validPhone && Object.keys(cart).length > 0;
  }

  // Prevent typing non-digit characters (allow leading +)
  phoneInput.addEventListener('keydown', (e) => {
    const allowed = [
      'Backspace','ArrowLeft','ArrowRight','Delete','Tab','Home','End'
    ];
    if (allowed.includes(e.key)) return;
    // allow Ctrl/Cmd shortcuts
    if (e.ctrlKey || e.metaKey) return;
    // allow one leading + if caret at start and not present
    if (e.key === '+' && phoneInput.selectionStart === 0 && !phoneInput.value.includes('+')) return;
    // allow digits
    if (/^\d$/.test(e.key)) return;
    // otherwise block
    e.preventDefault();
  });

  // Sanitize pasted content
  phoneInput.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text') || '';
    const sanitized = sanitizePhoneRaw(text);
    // insert sanitized at caret position
    const start = phoneInput.selectionStart || 0;
    const end = phoneInput.selectionEnd || 0;
    const newVal = phoneInput.value.slice(0, start) + sanitized + phoneInput.value.slice(end);
    phoneInput.value = newVal;
    updatePhoneUI();
  });

  // On input, sanitize and validate
  phoneInput.addEventListener('input', () => {
    updatePhoneUI();
  });

  // Also validate on blur
  phoneInput.addEventListener('blur', () => {
    updatePhoneUI();
  });

  // Render order list and wire qty changes (same as before)
  function renderOrder() {
    const items = Object.values(cart);
    if (!items.length) {
      $('order').innerHTML = '<div class="empty">Your cart is empty.</div>';
      $('subtotal').innerText = '0.00';
      placeBtn.disabled = true;
      return;
    }
    let sub = 0;
    $('order').innerHTML = items.map(i => {
      sub += i.p * i.qty;
      const props = Object.entries(i.props || {}).slice(0,3).map(([k,v]) => `${k}: ${Array.isArray(v)?v.join(', '):v}`).join(' • ');
      return `<div class="order-item">
        <img src="assets/images/${i.i}" alt="${i.n}">
        <div class="order-meta">
          <div><b>${i.n}</b></div>
          <div style="color:#666;font-size:13px">${props}</div>
          <div style="margin-top:6px">₱${i.p.toFixed(2)} × ${i.qty} = ₱${(i.p*i.qty).toFixed(2)}</div>
        </div>
        <div class="order-controls">
          <button onclick="chg('${i.id}',-1)">-</button>
          <span>${i.qty}</span>
          <button onclick="chg('${i.id}',1)">+</button>
        </div>
      </div>`;
    }).join('');
    $('subtotal').innerText = sub.toFixed(2);
    // update place button state
    placeBtn.disabled = !areRequiredFieldsFilled();
  }

  window.chg = (id, d) => {
    if (!cart[id]) return;
    cart[id].qty += d;
    if (cart[id].qty <= 0) delete cart[id];
    localStorage.setItem('nn_cart', JSON.stringify(cart));
    cart = JSON.parse(localStorage.getItem('nn_cart') || '{}');
    renderOrder();
    updatePhoneUI();
  };

  // Form submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // final validation
    const name = $('name').value.trim();
    const phone = phoneInput.value.trim();
    const address = $('address').value.trim();
    const phoneValid = validatePhone(phone);
    if (!name || !address) {
      $('msg').innerText = 'Please fill all required fields.';
      return;
    }
    if (!phoneValid.ok) {
      phoneInput.setAttribute('aria-invalid', 'true');
      phoneError.hidden = false;
      phoneError.innerText = phoneValid.message;
      return;
    }
    if (!Object.keys(cart).length) {
      $('msg').innerText = 'Your cart is empty.';
      return;
    }

    // Place order (simulate)
    const order = {
      id: 'ORD' + Date.now(),
      items: cart,
      subtotal: $('subtotal').innerText,
      shipping: { name, phone, address },
      payment: $('pay').value,
      created: new Date().toISOString()
    };
    localStorage.setItem('nn_last_order', JSON.stringify(order));
    cart = {}; localStorage.setItem('nn_cart', JSON.stringify(cart));
    renderOrder();
    $('msg').innerHTML = `Order placed — <b>${order.id}</b>. Thank you!`;
    setTimeout(() => { window.location.href = 'NanoNexus.html'; }, 1400);
  });

  // Re-check required fields when name/address change
  $('name').addEventListener('input', () => { placeBtn.disabled = !areRequiredFieldsFilled(); });
  $('address').addEventListener('input', () => { placeBtn.disabled = !areRequiredFieldsFilled(); });

  // Initial render
  renderOrder();
  updatePhoneUI();
});
