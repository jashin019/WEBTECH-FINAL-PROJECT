/* nanonexus.js
   Move the entire NanoNexus page logic here and remove the inline <script> from NanoNexus.html.
*/

const ps = [
  {id:"p1", n:"RGB Keyboard", p:3499, i:"1.png", d:"Tactile switches, full RGB.",
    props: {Color:"Black", Weight:"0.9 kg", Switches:"Tactile (Gateron)", Warranty:"1 year", Features:["Full-size","N-key rollover","USB-C"]}},
  {id:"p2", n:"T-Force RAM 16GB", p:2199, i:"2.png", d:"High-speed DDR4 memory.",
    props: {Speed:"3200 MHz", Capacity:"16 GB", Type:"DDR4", Warranty:"Lifetime", Features:["Heat spreader","Low latency"]}},
  {id:"p3", n:"Gigabyte X870", p:8999, i:"3.png", d:"AM5 socket, WiFi 6E.",
    props: {Socket:"AM5", FormFactor:"ATX", LAN:"2.5GbE", WiFi:"WiFi 6E", Warranty:"3 years"}},
  {id:"p4", n:"RGB Headset", p:2599, i:"4.jpg", d:"Surround sound.",
    props: {Driver:"50mm", Mic:"Detachable", Connectivity:"3.5mm/USB", Warranty:"1 year", Features:["Surround","RGB"]}},
  {id:"p5", n:"Gaming Mouse", p:1299, i:"5.png", d:"High-DPI sensor.",
    props: {DPI:"16000", Sensor:"Optical", Buttons:"6 programmable", Weight:"85 g", Warranty:"1 year"}},
  {id:"p6", n:"JBL Speakers", p:1999, i:"9.jpg", d:"Stereo with rich bass.",
    props: {Power:"20W", Connectivity:"Bluetooth", Size:"2.0", Warranty:"2 years", Features:["Bass boost"]}},
  {id:"p7", n:"Gaming Chair", p:7999, i:"6.png", d:"Adjustable support.",
    props: {Material:"PU Leather", MaxLoad:"150 kg", Recline:"150°", Warranty:"2 years", Features:["Lumbar support"]}},
  {id:"p8", n:"RTX 4060 GPU", p:24999, i:"10.jpg", d:"Ray tracing, DLSS.",
    props: {VRAM:"8 GB", CUDA:"3072 cores", Power:"115W", Warranty:"3 years", Features:["Ray tracing","DLSS"]}},
  {id:"p9", n:"Gaming Laptop", p:59999, i:"8.jpg", d:"Portable workstation.",
    props: {CPU:"Ryzen 7", GPU:"RTX 4060", RAM:"16 GB", Storage:"1 TB SSD", Warranty:"2 years"}},
  {id:"p10", n:"GPU RTX 4060", p:58999, i:"7.png", d:"Pro edition.",
    props: {VRAM:"12 GB", CUDA:"4096 cores", Power:"160W", Warranty:"3 years", Features:["Pro cooling"]}},
  {id:"p11", n:"Corsair PSU", p:3000, i:"11.png", d:"Modular power supply.",
    props: {Wattage:"650W", Efficiency:"80+ Gold", Modular:"Fully", Warranty:"5 years", Features:["Silent fan"]}},
  {id:"p12", n:"Controller", p:3000, i:"13.jpg", d:"PS5 compatible.",
    props: {Compatibility:"PS5/PC", Connectivity:"Bluetooth", Battery:"20 hrs", Warranty:"1 year", Features:["Haptic feedback"]}}
];

let cart = JSON.parse(localStorage.getItem('nn_cart') || '{}');
const $ = id => document.getElementById(id);
const toggle = (m, show) => {
  const el = $(m);
  if (!el) return;
  el.setAttribute('aria-hidden', !show);
};

/* Update cart counter and persist */
const upd = () => {
  const cc = $('cc');
  if (cc) cc.innerText = Object.values(cart).reduce((s, i) => s + i.qty, 0);
  localStorage.setItem('nn_cart', JSON.stringify(cart));
};

/* Render product grid */
const render = (list) => {
  const psEl = $('ps');
  if (!psEl) return;
  psEl.innerHTML = list.map(p => `
    <article class="product-card">
      <img class="product-image" src="assets/images/${p.i}" alt="${p.n}">
      <div class="product-name">${p.n}</div>
      <div class="product-price">₱${p.p.toFixed(2)}</div>
      <div class="card-actions">
        <button onclick="add('${p.id}')" class="add-btn">Add to Cart</button>
        <button onclick="det('${p.id}')" class="view-btn">View</button>
      </div>
    </article>`).join('');
};

/* Add to cart */
window.add = (id) => {
  const p = ps.find(x => x.id === id);
  if (!p) return;
  cart[id] = cart[id] || {...p, qty: 0};
  cart[id].qty++;
  upd();
  const t = document.createElement('div'); t.className='toast'; t.innerText=`${p.n} added`; document.body.append(t);
  setTimeout(() => t.remove(), 1600);
};

/* Build concise listed description for detail modal */
const buildDetailHtml = (p) => {
  const props = Object.entries(p.props || {}).map(([k,v]) => {
    if (Array.isArray(v)) return `<li><b>${k}:</b> ${v.join(', ')}</li>`;
    return `<li><b>${k}:</b> ${v}</li>`;
  }).join('');
  return `
    <div class="detail-top">
      <img src="assets/images/${p.i}" alt="${p.n}">
      <div class="detail-meta">
        <h3>${p.n}</h3>
        <b class="price">₱${p.p.toFixed(2)}</b>
        <p class="short">${p.d}</p>
        <div class="detail-actions">
          <button onclick="add('${p.id}');toggle('dm',0)" class="add-btn">Add to Cart</button>
          <a href="checkout.html" class="checkout-link">Go to Checkout</a>
        </div>
      </div>
    </div>
    <div class="detail-body">
      <h4>Quick Specs</h4>
      <ul class="spec-list">${props}</ul>
      <h4>Summary</h4>
      <p class="summary">${p.d} — ${Object.values(p.props || {}).slice(0,2).join(', ')}.</p>
    </div>`;
};

/* Show detail modal */
window.det = (id) => {
  const p = ps.find(x => x.id === id);
  const dc = $('dc');
  if (!p || !dc) return;
  dc.innerHTML = buildDetailHtml(p);
  toggle('dm', 1);
};

/* Render cart panel with properties and controls */
const renderCart = () => {
  const ci = $('ci');
  const ct = $('ct');
  if (!ci || !ct) return;
  const items = Object.values(cart);
  let tot = 0;
  ci.innerHTML = items.length ? items.map(i => {
    tot += i.p * i.qty;
    const props = Object.entries(i.props || {}).slice(0,3).map(([k,v]) => `${k}: ${Array.isArray(v)?v.join(', '):v}`).join(' • ');
    return `<div class="cart-item">
      <img src="assets/images/${i.i}" alt="${i.n}">
      <div class="meta">
        <b>${i.n}</b>
        <div class="cart-price">₱${i.p.toFixed(2)} × ${i.qty} = ₱${(i.p*i.qty).toFixed(2)}</div>
        <div class="cart-props">${props}</div>
      </div>
      <div class="qty-controls">
        <button onclick="chg('${i.id}',-1)">-</button>
        <span class="qty">${i.qty}</span>
        <button onclick="chg('${i.id}',1)">+</button>
      </div>
    </div>`;
  }).join('') : '<p>Empty.</p>';
  ct.innerText = tot.toFixed(2);
};

/* Change quantity */
window.chg = (id, d) => {
  if (!cart[id]) return;
  cart[id].qty += d;
  if (cart[id].qty <= 0) delete cart[id];
  upd(); renderCart();
};

/* Search filter */
document.addEventListener('DOMContentLoaded', () => {
  const sh = $('sh');
  if (sh) sh.oninput = e => render(ps.filter(p => p.n.toLowerCase().includes(e.target.value.toLowerCase())));

  const cb = $('cb');
  if (cb) cb.onclick = () => { renderCart(); toggle('cm', 1); };

  const clc = $('clc');
  if (clc) clc.onclick = () => toggle('cm', 0);

  const cld = $('cld');
  if (cld) cld.onclick = () => toggle('dm', 0);

  document.querySelectorAll('.cart-backdrop, .detail-backdrop').forEach(b => b.onclick = () => { toggle('cm',0); toggle('dm',0); });

  const chk = $('chk');
  if (chk) chk.onclick = () => {
    if (!Object.keys(cart).length) { alert('Cart is empty.'); return; }
    window.location.href = 'checkout.html';
  };

  render(ps); upd();
});
