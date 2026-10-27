(() => {
  'use strict';
  const products = window.CRAFTS_PRODUCTS || [];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const price = p => (p.variablePrice ? 'From ' : '') + '$' + p.price.toFixed(p.price % 1 ? 2 : 0);
  let category = 'all', search = '', sort = 'featured', toastTimer;
  let picks = [];
  try { const saved = JSON.parse(localStorage.getItem('crafts-corner-picks-v1') || '[]'); if (Array.isArray(saved)) picks = saved.filter(r => products.some(p => p.id === r.id) && Number.isInteger(r.quantity) && r.quantity > 0 && r.quantity <= 99 && typeof r.variant === 'string' && r.variant.length <= 200); } catch {}
  const notify = message => { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3200); };
  function persist() { try { localStorage.setItem('crafts-corner-picks-v1', JSON.stringify(picks)); } catch {} updateCounts(); }
  function updateCounts() { const count = picks.reduce((sum, p) => sum + p.quantity, 0); $$('.picks-count').forEach(e => e.textContent = count); $('#drawer-count').textContent = count; }
  function renderProducts() {
    let shown = products.filter(p => (category === 'all' || p.category === category) && (!search || `${p.name} ${p.description} ${p.label}`.toLowerCase().includes(search)));
    if (sort === 'low') shown.sort((a,b) => a.price - b.price);
    if (sort === 'high') shown.sort((a,b) => b.price - a.price);
    if (sort === 'name') shown.sort((a,b) => a.name.localeCompare(b.name));
    $('#product-grid').innerHTML = shown.map(p => `<article class="product-card"><button class="product-image-button" data-product="${p.id}" aria-label="View ${escape(p.name)}"><img src="assets/product-${p.id}.webp" width="850" height="850" loading="lazy" alt="${escape(p.name)}">${p.tag ? `<span class="product-tag">${escape(p.tag)}</span>` : ''}<span class="product-open" aria-hidden="true">+</span></button><p class="product-category">${escape(p.label)}</p><h3 class="product-title"><button data-product="${p.id}">${escape(p.name)}</button></h3><div class="product-bottom"><span class="product-price">${price(p)}</span><span class="product-designs">${p.options.length ? `${p.options.length} ${p.optionLabel === 'Size' ? 'sizes' : p.optionLabel === 'Colour palette' ? 'palettes' : 'designs'} to explore` : 'For your next project'}</span></div></article>`).join('');
    $('#empty-results').hidden = shown.length > 0;
    $('.result-count').textContent = `${shown.length} products shown`;
    $$('.filter').forEach(b => { const active = b.dataset.filter === category; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
  }
  function setCategory(value) { category = value; renderProducts(); }
  $$('.filter').forEach(b => b.addEventListener('click', () => setCategory(b.dataset.filter)));
  $$('[data-filter-link]').forEach(a => a.addEventListener('click', () => { search = ''; $('#product-search').value = ''; setCategory(a.dataset.filterLink); }));
  $('#sort').addEventListener('change', e => { sort = e.target.value; renderProducts(); });
  $('.search-trigger').addEventListener('click', () => { $('#search-panel').hidden = false; $('#shop').scrollIntoView({behavior:'smooth'}); $('#product-search').focus({preventScroll:true}); });
  $('#product-search').addEventListener('input', e => { search = e.target.value.trim().toLowerCase(); renderProducts(); });
  $('#clear-search').addEventListener('click', () => { search = ''; $('#product-search').value = ''; renderProducts(); $('#product-search').focus(); });
  $('#reset-products').addEventListener('click', () => { search = ''; $('#product-search').value = ''; setCategory('all'); });
  const menuButton = $('.menu-toggle');
  menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); $('#mobile-nav').hidden = !open; });
  $$('#mobile-nav a').forEach(a => a.addEventListener('click', () => { $('#mobile-nav').hidden = true; menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Open navigation'); }));
  function openProduct(id) {
    const p = products.find(p => p.id === id); if (!p) return;
    $('#product-detail').innerHTML = `<div class="detail-layout"><div class="detail-image"><img src="assets/product-${p.id}.webp" alt="${escape(p.name)}"></div><div class="detail-copy"><p class="eyebrow">${escape(p.label)}</p><h2 id="product-title">${escape(p.name)}</h2><p class="detail-description">${escape(p.description)}</p><div class="detail-price">${price(p)}</div><p class="detail-note">${p.variablePrice ? 'Price varies with your selection. ' : ''}Availability and final price are confirmed on WhatsApp.</p><form id="pick-form">${p.options.length ? `<label class="variant-label" for="product-variant">${escape(p.optionLabel)} <span aria-hidden="true">*</span></label><select class="variant-select" id="product-variant" required><option value="">Choose ${p.optionLabel.toLowerCase() === 'size' ? 'a size' : p.optionLabel.toLowerCase() === 'colour palette' ? 'a palette' : 'a design'}</option>${p.options.map(o => `<option value="${escape(o)}">${escape(o)}</option>`).join('')}</select>` : ''}<button class="button primary" type="submit">Add to my picks <span aria-hidden="true">+</span></button></form><a class="product-source-link" href="${escape(p.url)}" target="_blank" rel="noopener">Full product details on the online store ↗</a></div></div>`;
    $('#pick-form').addEventListener('submit', e => { e.preventDefault(); const variant = $('#product-variant')?.value || ''; if (p.options.length && !p.options.includes(variant)) return; const existing = picks.find(item => item.id === id && item.variant === variant); if (existing) existing.quantity = Math.min(99, existing.quantity + 1); else picks.push({id,variant,quantity:1}); persist(); $('#product-dialog').close(); notify('A little possibility added to My picks.'); });
    $('#product-dialog').showModal();
  }
  $('#product-grid').addEventListener('click', e => { const b = e.target.closest('[data-product]'); if (b) openProduct(Number(b.dataset.product)); });
  $('[data-close-product]').addEventListener('click', () => $('#product-dialog').close());
  function messageText() { return 'Hi Crafts Corner! I’m interested in these items:\n\n' + picks.map(item => { const p=products.find(p=>p.id===item.id); return `${item.quantity} × ${p.name}${item.variant ? ' — '+item.variant : ''}\n${p.url}`; }).join('\n\n') + '\n\nPlease confirm availability, the final price, and delivery. Thank you!'; }
  function renderPicks() {
    const empty = picks.length === 0;
    $('#picks-checkout').hidden = empty;
    $('#picks-items').innerHTML = empty ? '<div class="empty-picks"><h3>A little room for possibility.</h3><p>Your picks will appear here.<br>Find a project that feels like you.</p><button class="button primary" data-continue-shopping>Explore the collection ↗</button></div>' : picks.map((item, index) => { const p = products.find(p => p.id === item.id); return `<article class="pick-item"><img src="assets/product-${p.id}.webp" alt="${escape(p.name)}"><div><h3>${escape(p.name)}</h3>${item.variant ? `<p>${escape(p.optionLabel)}: ${escape(item.variant)}</p>` : ''}<p>${price(p)} each · confirmed with your selection</p><div class="pick-controls"><div class="quantity-control"><button data-quantity="${index}" data-change="-1" aria-label="Decrease quantity of ${escape(p.name)}" ${item.quantity<=1?'disabled':''}>−</button><span>${item.quantity}</span><button data-quantity="${index}" data-change="1" aria-label="Increase quantity of ${escape(p.name)}" ${item.quantity>=99?'disabled':''}>+</button></div><button class="remove-pick" data-remove="${index}" aria-label="Remove ${escape(p.name)}">Remove</button></div></div></article>`; }).join('');
    $('#whatsapp-picks').href = 'https://wa.me/96181254495?text=' + encodeURIComponent(messageText());
    updateCounts();
  }
  $('.picks-trigger').addEventListener('click', () => { renderPicks(); $('#picks-dialog').showModal(); });
  $('[data-close-picks]').addEventListener('click', () => $('#picks-dialog').close());
  $('#picks-items').addEventListener('click', e => {
    const remove = e.target.closest('[data-remove]'), quantity = e.target.closest('[data-quantity]');
    if (remove) { picks.splice(Number(remove.dataset.remove),1); persist(); renderPicks(); }
    if (quantity) { const item = picks[Number(quantity.dataset.quantity)]; if(item) { item.quantity = Math.max(1,Math.min(99,item.quantity+Number(quantity.dataset.change))); persist(); renderPicks(); } }
    if(e.target.closest('[data-continue-shopping]')) { $('#picks-dialog').close(); $('#shop').scrollIntoView({behavior:'smooth'}); }
  });
  $('.copy-picks').addEventListener('click', async () => { try { await navigator.clipboard.writeText(messageText()); notify('Your list is copied. Paste it into a message.'); } catch { notify('Please use “Send my picks on WhatsApp” to open your list.'); } });
  $$('dialog').forEach(dialog => dialog.addEventListener('click', e => { if(e.target===dialog) { const r=dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close(); } }));
  document.addEventListener('keydown', e => { if(e.key==='Escape') { $('#mobile-nav').hidden=true; menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Open navigation'); } });
  $('#year').textContent = new Date().getFullYear();
  renderProducts(); updateCounts();
})();
