/* script.js — theme + shop + contact handlers (DOM-ready) */
(function(){
  /* ---------- SHOP / CART (moved from inline) ---------- */
  const products = [
    { id: 1, name: 'Konsultacja & Audyt', price: 1299.00, desc: 'Audyt sieciowy z raportem, rekomendacjami i estymacją kosztów.' },
    { id: 2, name: 'Narzędzie automatyzujące', price: 2499.00, desc: 'Skrypt / aplikacja wspierająca operacje terenowe.' },
    { id: 3, name: 'Wsparcie projektowe', price: 3499.00, desc: 'Nadzór i zarządzanie projektem FTTH.' },
    { id: 4, name: 'Tworzenie aplikacji / Stron', price: 6999.00, desc: 'Projekt i wdrożenie strony lub aplikacji webowej (frontend+backend).' }
  ];

  const $products = document.getElementById('products');
  const $openShopWindow = document.getElementById('openShopWindow');
  const $cartButton = document.getElementById('cartButton');
  const $cartCount = document.getElementById('cartCount');
  const $cartModal = document.getElementById('cartModal');
  const $cartItems = document.getElementById('cartItems');
  const $cartTotal = document.getElementById('cartTotal');
  const $closeCart = document.getElementById('closeCart');
  const $clearCart = document.getElementById('clearCart');
  const $checkout = document.getElementById('checkout');

  let cart = JSON.parse(localStorage.getItem('vlan_cart') || '{}');

  function formatPLN(v){ return v.toFixed(2).replace('.',',') + ' zł'; }
  function saveCart(){ try{ localStorage.setItem('vlan_cart', JSON.stringify(cart)); }catch(e){} updateCartCount(); }
  function updateCartCount(){ const count = Object.values(cart).reduce((s,i)=>s+i,0); $cartCount.textContent = count; $cartCount.style.display = count? 'inline-block':'none'; }

  function renderProducts(){ if(!$products) return; $products.innerHTML = products.map(p => `
      <article class="product-card" role="article" aria-labelledby="prod-${p.id}">
        <div class="product-visual" aria-hidden="true">${p.name.split(' ')[0]}</div>
        <h3 id="prod-${p.id}">${p.name}</h3>
        <p class="muted">${p.desc}</p>
        <div class="product-bottom">
          <strong>${formatPLN(p.price)}</strong>
          <button class="btn-primary" data-id="${p.id}">Dodaj do koszyka</button>
        </div>
      </article>
    `).join('');

    document.querySelectorAll('.product-card .btn-primary').forEach(btn => {
      btn.addEventListener('click', e => addToCart(Number(e.currentTarget.dataset.id)));
    });
  }

  function enableHorizontalScroll(container){
    if(!container) return;

    container.addEventListener('wheel', (ev) => {
      if(Math.abs(ev.deltaY) > Math.abs(ev.deltaX)) {
        container.scrollLeft += ev.deltaY;
        ev.preventDefault();
      }
    }, { passive: false });

    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;

    container.addEventListener('mousedown', (ev) => {
      isDown = true;
      startX = ev.pageX;
      startScrollLeft = container.scrollLeft;
    });

    window.addEventListener('mouseup', () => { isDown = false; });
    container.addEventListener('mouseleave', () => { isDown = false; });

    container.addEventListener('mousemove', (ev) => {
      if(!isDown) return;
      const moveX = ev.pageX - startX;
      container.scrollLeft = startScrollLeft - moveX;
      ev.preventDefault();
    });
  }

  function openProductsInNewWindow(){
    const newWindow = window.open('', '_blank', 'width=1100,height=780');
    if(!newWindow){
      alert('Przeglądarka zablokowała nowe okno. Zezwól na pop-up dla tej strony.');
      return;
    }

    const isDayTheme = document.documentElement.classList.contains('day-theme');
    const popupTitle = isDayTheme ? 'Wszystkie pozycje sklepu (tryb dzienny)' : 'Wszystkie pozycje sklepu (tryb nocny)';

    const rows = products.map(p => `
      <article class="item">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <strong>${formatPLN(p.price)}</strong>
      </article>
    `).join('');

    const popupHtml = `
      <!doctype html>
      <html lang="pl" class="${isDayTheme ? 'day-theme' : 'night-theme'}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>VLAN — ${popupTitle}</title>
        <style>
          :root{
            --bg:#0b0d0f;
            --surface:#141517;
            --text:#e6e6e6;
            --muted:#9aa0a6;
            --title:#c3c7ce;
            --border:rgba(255,255,255,0.07);
          }
          html.day-theme{
            --bg:#74c98a;
            --surface:#ffffff;
            --text:#111111;
            --muted:#2b2b2b;
            --title:#0a63c7;
            --border:rgba(0,0,0,0.14);
          }
          body{margin:0;font-family:Roboto,Arial,sans-serif;background:var(--bg);color:var(--text);padding:24px}
          h1{margin:0 0 14px;font-size:1.6rem}
          .list{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}
          .item{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px}
          .item h3{margin:0 0 8px;font-size:1.02rem;color:var(--title)}
          .item p{margin:0 0 10px;color:var(--muted);line-height:1.45}
        </style>
      </head>
      <body>
        <h1>${popupTitle}</h1>
        <div class="list">${rows}</div>
      </body>
      </html>
    `;

    try{
      newWindow.document.open();
      newWindow.document.write(popupHtml);
      newWindow.document.close();
    }catch(err){
      newWindow.location.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(popupHtml);
    }
  }

  function initServicesRotation(){
    const serviceCards = Array.from(document.querySelectorAll('#services .services .card'));
    if(!serviceCards.length) return;

    let startIndex = 0;
    let timerId = null;

    const getVisibleCount = () => window.matchMedia('(max-width: 720px)').matches ? 1 : 2;

    const shouldShowCard = (index, start, visibleCount, total) => {
      const end = (start + visibleCount) % total;
      if(visibleCount >= total) return true;
      if(start < end) return index >= start && index < end;
      return index >= start || index < end;
    };

    const renderServices = () => {
      const visibleCount = getVisibleCount();
      serviceCards.forEach((card, index) => {
        const isVisible = shouldShowCard(index, startIndex, visibleCount, serviceCards.length);
        card.classList.toggle('service-hidden', !isVisible);
        card.classList.toggle('service-visible', isVisible);
      });
    };

    const startRotation = () => {
      if(timerId) clearInterval(timerId);
      timerId = setInterval(() => {
        startIndex = (startIndex + 1) % serviceCards.length;
        renderServices();
      }, 4200);
    };

    renderServices();
    startRotation();

    window.addEventListener('resize', renderServices);
  }

  function initServicesPopup(){
    const openBtn = document.getElementById('openServicesPopup');
    const popup = document.getElementById('servicesPopup');
    const closeBtn = document.getElementById('closeServicesPopup');
    const popupGrid = document.getElementById('servicesPopupGrid');
    const cards = Array.from(document.querySelectorAll('#services .services .card'));
    if(!openBtn || !popup || !closeBtn || !popupGrid || !cards.length) return;

    const popupItems = cards.slice(0, 5).map((card) => {
      const title = card.querySelector('h3')?.textContent?.trim() || '';
      const desc = card.querySelector('p')?.textContent?.trim() || '';
      return `
        <article class="services-popup-card">
          <h4>${title}</h4>
          <p>${desc}</p>
        </article>
      `;
    }).join('');

    popupGrid.innerHTML = popupItems;

    const setOpen = (isOpen) => {
      popup.classList.toggle('open', isOpen);
      popup.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    };

    openBtn.addEventListener('click', () => setOpen(true));
    closeBtn.addEventListener('click', () => setOpen(false));
    popup.addEventListener('click', (ev) => {
      if(ev.target === popup) setOpen(false);
    });

    document.addEventListener('keydown', (ev) => {
      if(ev.key === 'Escape') setOpen(false);
    });
  }

  function initHeaderDrawerMenu(){
    const toggleBtn = document.querySelector('.menu-toggle');
    const drawer = document.getElementById('headerDrawerMenu');
    if(!toggleBtn || !drawer) return;

    const setOpen = (open) => {
      drawer.classList.toggle('open', open);
      toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    toggleBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const isOpen = drawer.classList.contains('open');
      setOpen(!isOpen);
    });

    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('click', (ev) => {
      if(!drawer.contains(ev.target) && !toggleBtn.contains(ev.target)){
        setOpen(false);
      }
    });

    document.addEventListener('keydown', (ev) => {
      if(ev.key === 'Escape') setOpen(false);
    });
  }

  function initCookieConsent(){
    const banner = document.getElementById('cookieConsentBanner');
    const acceptOnceBtn = document.getElementById('cookieAcceptOnce');
    const acceptPermanentBtn = document.getElementById('cookieAcceptPermanent');
    if(!banner || !acceptOnceBtn || !acceptPermanentBtn) return;

    const getCookie = (name) => {
      const escaped = name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
      return match ? decodeURIComponent(match[1]) : '';
    };

    const setCookie = (name, value, maxAgeSeconds) => {
      const maxAgePart = typeof maxAgeSeconds === 'number' ? `; max-age=${maxAgeSeconds}` : '';
      document.cookie = `${name}=${encodeURIComponent(value)}; path=/${maxAgePart}; samesite=lax`;
    };

    const openBanner = () => {
      banner.classList.add('open');
      banner.setAttribute('aria-hidden', 'false');
    };

    const closeBanner = () => {
      banner.classList.remove('open');
      banner.setAttribute('aria-hidden', 'true');
    };

    const sessionChoice = sessionStorage.getItem('vlan_cookie_consent') || '';
    const permanentChoice = localStorage.getItem('vlan_cookie_consent') || '';
    const permanentCookie = getCookie('vlan_cookie_consent') || '';

    if(sessionChoice === 'once' || permanentChoice === 'permanent' || permanentCookie === 'permanent'){
      closeBanner();
    } else {
      openBanner();
    }

    acceptOnceBtn.addEventListener('click', () => {
      sessionStorage.setItem('vlan_cookie_consent', 'once');
      setCookie('vlan_cookie_consent', 'once');
      closeBanner();
    });

    acceptPermanentBtn.addEventListener('click', () => {
      localStorage.setItem('vlan_cookie_consent', 'permanent');
      setCookie('vlan_cookie_consent', 'permanent', 60 * 60 * 24 * 365);
      closeBanner();
    });
  }

  async function initDailyNews(){
    const titleEl = document.getElementById('dailyNewsTitle');
    const summaryEl = document.getElementById('dailyNewsSummary');
    const metaEl = document.getElementById('dailyNewsMeta');
    const refreshBtn = document.getElementById('dailyNewsRefresh');
    const sourceInput = document.getElementById('dailyNewsSourceRaw');
    if(!titleEl || !summaryEl || !metaEl) return;

    const setLoadingState = (loading) => {
      if(!refreshBtn) return;
      refreshBtn.disabled = loading;
      refreshBtn.textContent = loading
        ? 'Szukam nowych innowacji...'
        : 'Poszukaj innych innowacji ze świata';
    };

    const loadNews = async (forceRefresh) => {
      setLoadingState(true);

      try{
        const url = forceRefresh ? '/api/news/daily?refresh=1' : '/api/news/daily';
        const res = await fetch(url, { cache: 'no-store' });
        if(!res.ok) throw new Error('news-endpoint-error');
        const payload = await res.json();
        if(!payload || !payload.ok || !payload.item) throw new Error('news-payload-error');

        const item = payload.item;
        titleEl.textContent = item.title || 'Nowinka techniczna';
        titleEl.href = item.link || '#';
        if(sourceInput){
          sourceInput.value = item.link || '';
        }

        summaryEl.textContent = item.summary
          ? item.summary
          : 'Brak dodatkowego opisu dla tej nowinki.';

        const source = item.source ? `Źródło: ${item.source}` : 'Źródło: RSS tech';
        const date = item.publishedAt ? `Data: ${item.publishedAt}` : '';
        metaEl.textContent = [source, date, 'Losowanie: 1x dziennie'].filter(Boolean).join(' • ');
      }catch(err){
        titleEl.textContent = 'Nie udało się pobrać nowinki technicznej.';
        titleEl.href = '#';
        summaryEl.textContent = 'Sprawdź ponownie za chwilę. W tle działa cache dzienny.';
        metaEl.textContent = 'Aktualizacja: raz na dzień';
        if(sourceInput){
          sourceInput.value = '';
        }
      } finally {
        setLoadingState(false);
      }
    };

    if(refreshBtn){
      refreshBtn.addEventListener('click', () => loadNews(true));
    }

    loadNews(false);
  }

  function initCardHighlightSelection(){
    const cardSelector = '.services .card, .services-extra .extra-card, .services-subcards .subcard';
    const cards = Array.from(document.querySelectorAll(cardSelector));
    if(!cards.length) return;

    const interactiveSelector = 'a, button, input, textarea, select, label';

    const setSelected = (clickedCard) => {
      const scope = clickedCard.closest('#services') || document;
      scope.querySelectorAll(`${cardSelector}.is-selected`).forEach((card) => {
        if(card === clickedCard) return;
        card.classList.remove('is-selected');
        card.setAttribute('aria-pressed', 'false');
      });

      const newState = !clickedCard.classList.contains('is-selected');
      clickedCard.classList.toggle('is-selected', newState);
      clickedCard.setAttribute('aria-pressed', newState ? 'true' : 'false');
    };

    cards.forEach((card) => {
      card.classList.add('card-clickable');
      if(!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-pressed', 'false');

      card.addEventListener('click', (ev) => {
        if(ev.target.closest(interactiveSelector)) return;
        setSelected(card);
      });

      card.addEventListener('keydown', (ev) => {
        if(ev.key !== 'Enter' && ev.key !== ' ') return;
        ev.preventDefault();
        setSelected(card);
      });
    });
  }

  function addToCart(id){ cart[id] = (cart[id] || 0) + 1; saveCart(); animateAdd(); }
  function animateAdd(){ if($cartButton){ $cartButton.classList.add('bump'); setTimeout(()=> $cartButton.classList.remove('bump'),400); } }

  function renderCart(){ if(!$cartItems) return; const ids = Object.keys(cart); if(!ids.length){ $cartItems.innerHTML = '<p class="muted">Koszyk jest pusty.</p>'; $cartTotal.textContent = formatPLN(0); return; }
    let total = 0;
    $cartItems.innerHTML = ids.map(id => {
      const p = products.find(x=>x.id===Number(id));
      const qty = cart[id];
      const line = p.price * qty; total += line;
      return `
        <div class="cart-item">
          <div>
            <strong>${p.name}</strong>
            <div class="muted">${formatPLN(p.price)} × ${qty} = ${formatPLN(line)}</div>
          </div>
          <div class="cart-controls">
            <button data-id="${id}" class="qty-minus" aria-label="zmniejsz">−</button>
            <button data-id="${id}" class="qty-plus" aria-label="zwiększ">＋</button>
            <button data-id="${id}" class="qty-remove" aria-label="usuń">Usuń</button>
          </div>
        </div>
      `;
    }).join('');
    $cartTotal.textContent = formatPLN(total);

    $cartItems.querySelectorAll('.qty-plus').forEach(b=> b.addEventListener('click', e=> { const id=e.currentTarget.dataset.id; cart[id]++; saveCart(); renderCart(); }));
    $cartItems.querySelectorAll('.qty-minus').forEach(b=> b.addEventListener('click', e=> { const id=e.currentTarget.dataset.id; cart[id]--; if(cart[id]<=0) delete cart[id]; saveCart(); renderCart(); }));
    $cartItems.querySelectorAll('.qty-remove').forEach(b=> b.addEventListener('click', e=> { const id=e.currentTarget.dataset.id; delete cart[id]; saveCart(); renderCart(); }));
  }

  // prepare order payload for future integrations
  function createOrderPayload(){
    const items = Object.keys(cart).map(id => {
      const p = products.find(x=>x.id===Number(id)); return { id: p.id, name: p.name, price: p.price, qty: cart[id] };
    });
    const total = items.reduce((s,i)=> s + i.price * i.qty, 0);
    return { id: 'order_' + Date.now(), items, total, createdAt: new Date().toISOString() };
  }

  async function submitOrder(order){
    // placeholder for server integration (e.g. /api/orders)
    try{
      const res = await fetch('/api/orders', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(order) });
      if(!res.ok) throw new Error('network');
      return await res.json();
    }catch(err){
      // fallback — save locally so admin can import later
      localStorage.setItem('vlan_last_order', JSON.stringify(order));
      return { ok:false, savedLocal:true };
    }
  }

  // UI handlers
  if($cartButton) $cartButton.addEventListener('click', ()=> { renderCart(); $cartModal.setAttribute('aria-hidden','false'); $cartModal.classList.add('open'); });
  if($closeCart) $closeCart.addEventListener('click', ()=> { $cartModal.setAttribute('aria-hidden','true'); $cartModal.classList.remove('open'); });
  if($clearCart) $clearCart.addEventListener('click', ()=> { cart = {}; saveCart(); renderCart(); });
  if($checkout) $checkout.addEventListener('click', async ()=> {
    const order = createOrderPayload();
    await submitOrder(order);
    alert('Złożono zamówienie (demo). Szczegóły zapisane lokalnie i gotowe do integracji.');
    cart = {}; saveCart(); renderCart(); $cartModal.setAttribute('aria-hidden','true'); $cartModal.classList.remove('open');
  });

  // init products
  renderProducts(); updateCartCount();
  enableHorizontalScroll($products);
  if($openShopWindow) $openShopWindow.addEventListener('click', openProductsInNewWindow);
  initHeaderDrawerMenu();
  initCookieConsent();
  initServicesRotation();
  initServicesPopup();
  initCardHighlightSelection();
  initDailyNews();

  if($cartModal) $cartModal.addEventListener('click', e => { if(e.target === $cartModal) { $cartModal.setAttribute('aria-hidden','true'); $cartModal.classList.remove('open'); } });

  /* ---------- CONTACT FORM (front-end + webhook placeholder) ---------- */
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');

  const profanityPatterns = [
    /\bkurw(a|y|e|o|ie|ami)?\b/i,
    /\b(chuj|huj)(a|e|em|emu|owy|nia)?\b/i,
    /\bjeb(a[ćc]|ie|any|ana|ane|ac|nię)\b/i,
    /\bpierdol(i|ić|ony|ona|one|ić)?\b/i,
    /\bpizd(a|y|e|ą|zie)?\b/i,
    /\bskurw(y|iel|ysyn|iały)?\b/i,
    /\bcip(a|y|ie|ą)?\b/i,
    /\bfuck(ing|ed|er|ers)?\b/i,
    /\bshit(ty|head)?\b/i,
    /\bbitch(es|y)?\b/i,
    /\basshole\b/i,
    /\bdick\b/i,
    /\bcunt\b/i,
    /\bbastard\b/i,
    /\bmotherfucker\b/i
  ];

  const hasProfanity = (text) => {
    const source = (text || '').normalize('NFKC');
    return profanityPatterns.some((pattern) => pattern.test(source));
  };

  if(contactForm){
    contactForm.addEventListener('submit', async (ev)=>{
      ev.preventDefault();
      const isEnglish = (document.documentElement.lang || '').toLowerCase().startsWith('en');
      contactStatus.textContent = isEnglish ? 'Sending...' : 'Wysyłanie...';

      const data = {
        name: contactForm.name.value.trim(),
        email: contactForm.email.value.trim(),
        message: contactForm.message.value.trim(),
        ts: new Date().toISOString()
      };

      if(hasProfanity(`${data.name} ${data.message}`)){
        contactStatus.textContent = isEnglish
          ? 'Kind person, if you use bad words, your food will not taste good, and then not only will you be hungry, but you also will not grow.'
          : 'Uprzejmy człowieku jeśli będziesz używać brzydkich słów to jedzenie ci nie będzie smakować a wtedy nie dość że będziesz głodny to jeszcze nie urośniesz.';
        contactForm.reset();
        return;
      }

      // try POST to /api/contact; if not available, save locally
      try{
        const res = await fetch('/api/contact', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(data) });
        if(!res.ok) throw new Error('no-server');
        contactStatus.textContent = isEnglish ? 'Sent — thank you!' : 'Wysłano — dziękuję!';
        contactForm.reset();
      }catch(err){
        // fallback: save draft locally and inform user
        const drafts = JSON.parse(localStorage.getItem('vlan_contact_drafts')||'[]');
        drafts.push(data); localStorage.setItem('vlan_contact_drafts', JSON.stringify(drafts));
        contactStatus.textContent = isEnglish
          ? 'Message saved locally (demo). Configure /api/contact to receive emails.'
          : 'Wiadomość zapisana lokalnie (demo). Skonfiguruj /api/contact aby odbierać e‑maile.';
        contactForm.reset();
      }
    });
  }

  /* Accessibility: focus outlines for keyboard users */
  document.body.addEventListener('keyup', (e)=>{ if(e.key === 'Tab') document.documentElement.classList.add('show-focus'); });
})();