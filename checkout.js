// checkout.js - reads cart, allows qty changes, places order
document.addEventListener('DOMContentLoaded', () => {
  let cart = JSON.parse(localStorage.getItem('nn_cart') || '{}');
  const $ = id => document.getElementById(id);

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

  $('place').addEventListener('click', () => {
    const name = $('name').value.trim();
    const phone = $('phone').value.trim();
    const address = $('address').value.trim();
    if (!name || !phone || !address) { $('msg').innerText = 'Please fill shipping details.'; return; }
    const order = {
      id: 'ORD' + Date.now(),
      items: cart,
      subtotal: $('subtotal').innerText,
      shipping: {name, phone, address},
      payment: $('pay').value,
      created: new Date().toISOString()
    };
    localStorage.setItem('nn_last_order', JSON.stringify(order));
    cart = {}; localStorage.setItem('nn_cart', JSON.stringify(cart));
    renderOrder();
    $('msg').innerHTML = `Order placed — <b>${order.id}</b>. Thank you!`;
    setTimeout(() => { window.location.href = 'NanoNexus.html'; }, 1400);
  });

  renderOrder();
});
