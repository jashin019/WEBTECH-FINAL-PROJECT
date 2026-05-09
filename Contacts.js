// checkout.js - reads cart, allows qty changes, places order
document.addEventListener('DOMContentLoaded', () => {
  let cart = JSON.parse(localStorage.getItem('nn_cart') || '{}');
  const $ = id => document.getElementById(id);

  // --- Phone helpers -----------------------------------------------------
  // Normalize phone by removing spaces, dashes, parentheses and dots
  function normalizePhone(phone = '') {
    if (!phone) return '';
    const s = String(phone).trim();
    if (s.startsWith('+')) {
      // keep single leading +, remove everything else that's not a digit
      return '+' + s.slice(1).replace(/\D/g, '').slice(0, 15);
    }
    // no +: keep digits only (including leading 0)
    return s.replace(/\D/g, '').slice(0, 15);
  }

  // Validate: optional + then 7-15 digits OR plain digits 7-15 (allow leading 0)
  function isValidPhone(phone = '') {
    const cleaned = normalizePhone(phone);
    return /^\+?[0-9]{7,15}$/.test(cleaned);
  }

  // Attach input sanitizer to phone field so users cannot type letters/symbols
  function attachPhoneSanitizer(inputEl) {
    if (!inputEl) return;
    inputEl.addEventListener('input', () => {
      const raw = inputEl.value || '';
      // Allow only digits and a single leading +
      let cleaned = raw.replace(/[^0-9+]/g, '');
      // If there are multiple + signs, keep only the first and ensure it's leading
      const plusMatches = cleaned.match(/\+/g) || [];
      if (plusMatches.length > 1) {
        cleaned = cleaned.replace(/\+/g, '');
        cleaned = '+' + cleaned;
      } else if (plusMatches.length === 1 && !cleaned.startsWith('+')) {
        cleaned = cleaned.replace(/\+/g, '');
        cleaned = '+' + cleaned;
      }
      // Limit length: up to 16 chars if leading + (1 + 15 digits), else up to 15 digits
      if (cleaned.startsWith('+')) {
        cleaned = '+' + cleaned.slice(1).slice(0, 15);
      } else {
        cleaned = cleaned.slice(0, 15);
      }
      if (cleaned !== raw) inputEl.value = cleaned;
    }, { passive: true });
  }
  // -----------------------------------------------------------------------

  function renderOrder() {
    const items = Object.values(cart);
    if (!items.length) {
      $('order').innerHTML = '<div class="empty">Your cart is empty.</div>';
      $('subtotal').innerText = '0.00';
      $('place').disabled = true;
      return;
    }
    $('place').disabled = false;
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
  }

  window.chg = (id, d) => {
    if (!cart[id]) return;
    cart[id].qty += d;
    if (cart[id].qty <= 0) delete cart[id];
    localStorage.setItem('nn_cart', JSON.stringify(cart));
    cart = JSON.parse(localStorage.getItem('nn_cart') || '{}');
    renderOrder();
  };

  // Attach sanitizer to phone input as soon as DOM is ready
  attachPhoneSanitizer($('phone'));

  $('place').addEventListener('click', () => {
    const name = $('name').value.trim();
    const phoneRaw = $('phone').value.trim();
    const address = $('address').value.trim();
    const msgEl = $('msg');

    // Basic presence check
    if (!name || !phoneRaw || !address) {
      msgEl.innerText = 'Please fill shipping details.';
      return;
    }

    // Validate phone strictly (now accepts numbers like 09366775895)
    if (!isValidPhone(phoneRaw)) {
      msgEl.innerText = 'Please enter a valid phone number (digits only, optional leading +, 7–15 digits).';
      return;
    }

    // Use normalized phone for storage and any tel: links
    const phone = normalizePhone(phoneRaw);

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
    msgEl.innerHTML = `Order placed — <b>${order.id}</b>. Thank you!`;
    setTimeout(() => { window.location.href = 'NanoNexus.html'; }, 1400);
  });

  renderOrder();
});
