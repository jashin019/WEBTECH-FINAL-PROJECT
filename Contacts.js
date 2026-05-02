// contacts.js
// Renders contacts from contacts.json and implements:
// - email links that open Gmail compose in a new tab
// - tel: links for calling
// - form validation: only accepts sender emails that are Gmail addresses
// - form opens Gmail compose with prefilled recipient, subject, and body

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
}
function initials(name = '') {
  return name.split(' ').map(s => s[0] || '').slice(0,2).join('').toUpperCase();
}
function gmailComposeUrl({to, subject = '', body = ''}) {
  // Gmail web compose URL with prefilled fields
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: to,
    su: subject,
    body: body
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

async function loadData() {
  try {
    const res = await fetch('contacts.json');
    if (!res.ok) throw new Error('contacts.json not found');
    return await res.json();
  } catch (err) {
    console.warn('Could not fetch contacts.json, using fallback data.', err);
    // fallback inline data
    return {
      company: {
        name: 'NanoNexus',
        email: 'johnkirbytolenti171@gmail.com',
        phone: '+63-936-677-5895'
      },
      team: []
    };
  }
}

async function renderContacts() {
  const grid = document.getElementById('contact-grid');
  grid.innerHTML = '';
  const data = await loadData();
  const company = data.company;

  // Company card
  const companyCard = document.createElement('div');
  companyCard.className = 'card';
  companyCard.innerHTML = `
    <div class="avatar">NN</div>
    <div>
      <h4>${escapeHtml(company.name)}</h4>
      <p style="color:var(--muted);margin:6px 0">Email: <strong>${escapeHtml(company.email)}</strong> · Phone: <strong>${escapeHtml(company.phone)}</strong></p>
      <div class="contact-actions">
        <a href="${gmailComposeUrl({to: company.email})}" target="_blank" rel="noopener">Email via Gmail</a>
        <a href="tel:${encodeURIComponent(company.phone)}">Call</a>
      </div>
    </div>
  `;
  grid.appendChild(companyCard);

  // Team cards
  (data.team || []).forEach(member => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="avatar">${initials(member.name)}</div>
      <div>
        <h4>${escapeHtml(member.name)}</h4>
        <p>${escapeHtml(member.role)}</p>
        <p class="muted">${escapeHtml(member.bio || '')}</p>
        <p style="color:var(--muted);margin-top:6px">Email: <strong>${escapeHtml(member.email)}</strong> · Phone: <strong>${escapeHtml(member.phone)}</strong></p>
        <div class="contact-actions">
          <a href="${gmailComposeUrl({to: member.email})}" target="_blank" rel="noopener">Email via Gmail</a>
          <a href="tel:${encodeURIComponent(member.phone)}">Call</a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Validate Gmail address (simple)
function isGmailAddress(email) {
  if (!email) return false;
  const m = email.trim().toLowerCase().match(/^([a-z0-9._%+-]+)@gmail\.com$/);
  return !!m;
}

function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const status = document.getElementById('form-status');

  if (!name || !email || !message) {
    status.textContent = 'Please fill in all fields.';
    return;
  }

  if (!isGmailAddress(email)) {
    status.textContent = 'Please use a Gmail address (example@gmail.com).';
    return;
  }

  // Compose email to company using Gmail web compose (opens in new tab)
  loadData().then(data => {
    const to = data.company?.email || 'nanonexus.example@gmail.com';
    const subject = encodeURIComponent(`Message from ${name}`);
    const bodyText = `From: ${name} <${email}>\n\n${message}`;
    const body = encodeURIComponent(bodyText);

    // Use Gmail web compose URL so it opens Gmail compose in a new tab
    const url = gmailComposeUrl({to, subject: decodeURIComponent(subject), body: decodeURIComponent(body)});
    window.open(url, '_blank', 'noopener');

    status.textContent = 'Opening Gmail compose in a new tab...';
    setTimeout(()=> status.textContent = '', 4000);
  }).catch(err => {
    console.error(err);
    status.textContent = 'Unable to prepare email right now.';
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  await renderContacts();

  // Attach form handler
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', handleFormSubmit);
});
