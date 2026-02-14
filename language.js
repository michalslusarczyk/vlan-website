(function(){
  const STORAGE_KEY = 'vlan_lang';

  const PL_TO_EN = {
    'Szukaj': 'Search',
    'Zaloguj': 'Login',
    'Zakres usług': 'Service scope',
    'Projektowanie i wdrożenia FTTH': 'FTTH design and deployment',
    'Koncepcja, dokumentacja, budowa i uruchomienie sieci FTTH — od przyłącza po OLT. Optymalizacja kosztów i nadzór wykonawczy.': 'Concept, documentation, construction, and launch of FTTH networks — from last mile connection to OLT. Cost optimization and implementation supervision.',
    'Audyty i konsultacje': 'Audits and consulting',
    'Audyt sieciowy z rekomendacjami technicznymi i kosztorysami. Raporty gotowe do wdrożenia lub negocjacji z wykonawcami.': 'Network audits with technical recommendations and cost estimates. Reports ready for implementation or contractor negotiations.',
    'Administracja i utrzymanie': 'Administration and maintenance',
    'Monitoring, wsparcie operacyjne, utrzymanie OLT/switchy, zarządzanie SLA, backupy i migracje systemów.': 'Monitoring, operational support, OLT/switch maintenance, SLA management, backups, and system migrations.',
    'Tworzenie aplikacji i stron': 'App and website development',
    'Projektowanie i wdrożenie aplikacji webowych oraz stron firmowych — frontend, backend, wdrożenie i hosting.': 'Design and implementation of web apps and company websites — frontend, backend, deployment, and hosting.',
    'Automatyzacja procesów pracy': 'Workflow automation',
    'Automatyzacja przepływów pracy: skrypty, integracje, aplikacje mobilne i systemy wspierające operacje terenowe.': 'Workflow automation: scripts, integrations, mobile apps, and systems supporting field operations.',
    'Bezpieczeństwo i sieci routowane': 'Security and routed networks',
    'VPN, VLAN, BGP, OSPF, QoS oraz hardening urządzeń sieciowych i konfiguracje zabezpieczające.': 'VPN, VLAN, BGP, OSPF, QoS, plus network hardening and security-focused configurations.',
    'Poszukaj innych innowacji ze świata': 'Find other innovations worldwide',
    'Link do źródła': 'Source link',
    'Ładowanie nowinki technicznej...': 'Loading a tech update...',
    'Pobieram losową wiadomość ze świata technologii.': 'Fetching a random update from the world of technology.',
    'Aktualizacja: raz na dzień': 'Update: once per day',
    'Oferta — przykładowe pakiety': 'Offer — sample packages',
    'Konsultacja & Audyt': 'Consultation & Audit',
    'Projekt & Wdrożenie FTTH': 'FTTH Project & Deployment',
    'Tworzenie aplikacji i stron': 'App and website development',
    'Automatyzacja procesów': 'Process automation',
    ' — raport z rekomendacjami i planem działań.': ' — report with recommendations and an action plan.',
    ' — od koncepcji do uruchomienia.': ' — from concept to launch.',
    ' — projekt frontend/backend, wdrożenie i hosting.': ' — frontend/backend design, deployment, and hosting.',
    ' — monitoring, wsparcie i utrzymanie infrastruktury.': ' — infrastructure monitoring, support, and maintenance.',
    ' — integracje, skrypty i aplikacje usprawniające pracę zespołów.': ' — integrations, scripts, and apps improving team workflows.',
    'Konsultacja & Audyt — raport z rekomendacjami i planem działań.': 'Consultation & Audit — report with recommendations and an action plan.',
    'Projekt & Wdrożenie FTTH — od koncepcji do uruchomienia.': 'FTTH Project & Deployment — from concept to launch.',
    'Tworzenie aplikacji i stron — projekt frontend/backend, wdrożenie i hosting.': 'App and website development — frontend/backend design, deployment, and hosting.',
    'Managed Services — monitoring, wsparcie i utrzymanie infrastruktury.': 'Managed Services — infrastructure monitoring, support, and maintenance.',
    'Automatyzacja procesów — integracje, skrypty i aplikacje usprawniające pracę zespołów.': 'Process automation — integrations, scripts, and apps improving team workflows.',
    'Umiejętności': 'Skills',
    'Tworzenie stron': 'Website development',
    'Front‑end / Full‑stack': 'Front-end / Full-stack',
    'Front-end / Full-stack': 'Front-end / Full-stack',
    'DevOps sieciowy': 'Network DevOps',
    'Sklep': 'Shop',
    'Otwórz wszystkie pozycje w nowym oknie': 'Open all items in a new window',
    'Kontakt': 'Contact',
    'Imię i nazwisko': 'Full name',
    'Twoje imię': 'Your name',
    'Wiadomość': 'Message',
    'Opisz krótko jakie wsparcie potrzebujesz': 'Briefly describe what support you need',
    'Wyślij wiadomość': 'Send message',
    'Wiadomość zostanie przesłana do VLAN Sp. z o.o. — odpowiem wkrótce. Formularz korzysta z lokalnego demo; skonfiguruj serwer / webhook w /api/contact aby odbierać wiadomości.': 'Your message will be sent to VLAN Sp. z o.o. — I will reply soon. This form runs in local demo mode; configure a server / webhook at /api/contact to receive messages.',
    'Messenger — szybki kontakt': 'Messenger — quick contact',
    'Napisz bezpośrednio do mnie, odpowiadam na bieżąco.': 'Write to me directly, I reply quickly.',
    'Cześć! Chcesz wycenę lub konsultację?': 'Hi! Do you want a quote or consultation?',
    'Tak, poproszę o szybki kontakt 🙂': 'Yes, I would like a quick contact 🙂',
    'Napisz teraz na Messenger': 'Write now on Messenger',
    'Jeśli przycisk nie otwiera poprawnie rozmowy, podeślij swój dokładny link m.me, podmienię 1:1.': 'If the button does not open the conversation correctly, send your exact m.me link and I will replace it 1:1.',
    'Namiary bezpośrednie:': 'Direct contacts:',
    'Telefon': 'Phone',
    'Email': 'Email',
    'Twój koszyk': 'Your cart',
    'Razem:': 'Total:',
    'Wyczyść': 'Clear',
    'Przejdź do płatności': 'Proceed to payment',
    'O mnie': 'About me',
    'O firmie': 'About company',
    'Adres: Brzączowice 334, 32-410 Dobczyce': 'Address: Brzączowice 334, 32-410 Dobczyce',
    'Konto: 5610501100100009081366164': 'Account: 5610501100100009081366164',
    'Jestem inżynierem infrastruktury z wieloletnim doświadczeniem w projektowaniu, budowie i utrzymaniu sieci FTTH oraz systemów wspierających operacje sieciowe. Realizuję pełen cykl — od audytu i koncepcji, przez projekt i wdrożenie, do automatyzacji i bieżącego zarządzania. Tworzę narzędzia desktopowe i mobilne (Android), integruję monitoring, konfiguruję systemy serwerowe i sieciowe oraz prowadzę nadzór projektowy — zawsze z naciskiem na niezawodność i efektywność operacyjną.': 'I am an infrastructure engineer with many years of experience in designing, building, and maintaining FTTH networks and systems supporting network operations. I deliver the full cycle — from audit and concept, through design and deployment, to automation and ongoing management. I build desktop and mobile tools (Android), integrate monitoring, configure server and network systems, and provide project supervision — always focused on reliability and operational efficiency.',
    'Główne obszary: projektowanie FTTH, konfiguracja OLT, automatyzacja procesów, monitoring, wsparcie operacyjne, migracje systemów i zarządzanie zespołami technicznymi.': 'Main areas: FTTH design, OLT configuration, process automation, monitoring, operational support, system migrations, and technical team management.',
    'Koszyk jest pusty.': 'Cart is empty.',
    'Dodaj do koszyka': 'Add to cart',
    'Konsultacja & Audyt': 'Consultation & Audit',
    'Narzędzie automatyzujące': 'Automation tool',
    'Wsparcie projektowe': 'Project support',
    'Tworzenie aplikacji / Stron': 'App / Website development',
    'Audyt sieciowy z raportem, rekomendacjami i estymacją kosztów.': 'Network audit with report, recommendations, and cost estimation.',
    'Skrypt / aplikacja wspierająca operacje terenowe.': 'Script / application supporting field operations.',
    'Nadzór i zarządzanie projektem FTTH.': 'FTTH project supervision and management.',
    'Projekt i wdrożenie strony lub aplikacji webowej (frontend+backend).': 'Design and implementation of a website or web app (frontend+backend).',
    'Usuń': 'Remove',
    'zwiększ': 'increase',
    'zmniejsz': 'decrease',
    'usuń': 'remove',
    'Wszystkie pozycje sklepu': 'All shop items',
    'Złożono zamówienie (demo). Szczegóły zapisane lokalnie i gotowe do integracji.': 'Order placed (demo). Details saved locally and ready for integration.',
    'Źródło: RSS tech': 'Source: RSS tech',
    'Źródło:': 'Source:',
    'Data:': 'Date:',
    'Losowanie: 1x dziennie': 'Randomized: once per day',
    'Nie udało się pobrać nowinki technicznej.': 'Failed to load a technical update.',
    'Sprawdź ponownie za chwilę. W tle działa cache dzienny.': 'Please try again in a moment. Daily cache is active in the background.',
    'Wysyłanie...': 'Sending...',
    'Wysłano — dziękuję!': 'Sent — thank you!',
    'Wiadomość zapisana lokalnie (demo). Skonfiguruj /api/contact aby odbierać e‑maile.': 'Message saved locally (demo). Configure /api/contact to receive emails.',
    'Szukam nowych innowacji...': 'Searching for new innovations...',
    'Napisz do mnie': 'Write to me',
    'Szukaj': 'Search',
    'Twoje imię': 'Your name',
    'twoj@adres.pl': 'your@email.com',
    'Opisz krótko jakie wsparcie potrzebujesz': 'Briefly describe what support you need',
    '*Niniejsze ceny mają charakter orientacyjny i nie stanowią oferty handlowej w rozumieniu art. 66 § 1 Kodeksu cywilnego. Ostateczna wycena zależy od zakresu prac. Ceny mogą ulec aktualizacji.': '*The listed prices are indicative and do not constitute a commercial offer within the meaning of Article 66 § 1 of the Polish Civil Code. Final pricing depends on the scope of work. Prices may be updated.'
  };

  const ATTR_PL_TO_EN = {
    'Przełącz na tryb dzienny': 'Switch to day mode',
    'Przełącz na tryb nocny': 'Switch to night mode',
    'Wersja dzienna': 'Day mode',
    'Wersja nocna': 'Night mode',
    'Szukaj': 'Search',
    'Zaloguj': 'Login',
    'Menu': 'Menu',
    'Napisz na Messenger': 'Write on Messenger',
    'Otwórz koszyk': 'Open cart',
    'Zadzwoń': 'Call',
    'Wyślij email': 'Send email',
    'Dane firmy': 'Company details',
    'Komunikator Messenger': 'Messenger contact',
    'Link do źródła': 'Source link',
    'Przełącz język na angielski': 'Switch language to English',
    'Przełącz na angielski': 'Switch to English',
    'Napisz do mnie': 'Write to me',
    'zmniejsz': 'decrease',
    'zwiększ': 'increase',
    'usuń': 'remove'
  };

  const EN_TO_PL = Object.fromEntries(Object.entries(PL_TO_EN).map(([pl, en]) => [en, pl]));
  const ATTR_EN_TO_PL = Object.fromEntries(Object.entries(ATTR_PL_TO_EN).map(([pl, en]) => [en, pl]));

  function normalizeText(value){
    return String(value || '')
      .replace(/[\u00A0\u202F]/g, ' ')
      .replace(/[‑–—]/g, '-')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function buildReplacementEntries(dict){
    return Object.entries(dict)
      .sort((a, b) => b[0].length - a[0].length);
  }

  function buildNormalizedMap(dict){
    const map = {};
    Object.entries(dict).forEach(([key, value]) => {
      map[normalizeText(key)] = value;
    });
    return map;
  }

  const PL_TO_EN_ENTRIES = buildReplacementEntries(PL_TO_EN);
  const EN_TO_PL_ENTRIES = buildReplacementEntries(EN_TO_PL);
  const ATTR_PL_TO_EN_ENTRIES = buildReplacementEntries(ATTR_PL_TO_EN);
  const ATTR_EN_TO_PL_ENTRIES = buildReplacementEntries(ATTR_EN_TO_PL);
  const PL_TO_EN_NORMALIZED = buildNormalizedMap(PL_TO_EN);
  const EN_TO_PL_NORMALIZED = buildNormalizedMap(EN_TO_PL);
  const ATTR_PL_TO_EN_NORMALIZED = buildNormalizedMap(ATTR_PL_TO_EN);
  const ATTR_EN_TO_PL_NORMALIZED = buildNormalizedMap(ATTR_EN_TO_PL);

  const titleByLang = {
    pl: {
      night: 'VLAN Sp. z o.o. | Twój Łącznik w Biznesie',
      day: 'VLAN Sp. z o.o. | Tryb dzienny'
    },
    en: {
      night: 'VLAN Sp. z o.o. | Your Business Link',
      day: 'VLAN Sp. z o.o. | Day mode'
    }
  };

  function replaceByEntries(source, entries){
    let output = source;
    entries.forEach(([from, to]) => {
      if(output.includes(from)){
        output = output.split(from).join(to);
      }
    });
    return output;
  }

  function translateTextNode(node, dict, entries, normalizedMap){
    const original = node.textContent;
    if(!original) return;
    const trimmed = original.trim();
    if(!trimmed) return;

    let updated = replaceByEntries(original, entries);
    if(updated !== original){
      node.textContent = updated;
      return;
    }

    const translatedExact = dict[trimmed];
    if(translatedExact){
      node.textContent = original.replace(trimmed, translatedExact);
      return;
    }

    const normalized = normalizeText(trimmed);
    const translatedNormalized = normalizedMap[normalized];
    if(translatedNormalized){
      node.textContent = original.replace(trimmed, translatedNormalized);
    }
  }

  function translateAttributes(root, dict, entries, normalizedMap){
    const targets = root.querySelectorAll ? root.querySelectorAll('[aria-label],[title],[placeholder],input[value]') : [];
    targets.forEach((el) => {
      ['aria-label','title','placeholder','value'].forEach((attr) => {
        if(!el.hasAttribute(attr)) return;
        const value = el.getAttribute(attr) || '';
        if(!value) return;
        let updated = replaceByEntries(value, entries);
        if(updated !== value){
          el.setAttribute(attr, updated);
          return;
        }
        const trimmed = value.trim();
        const translated = dict[trimmed];
        if(translated){
          el.setAttribute(attr, translated);
          return;
        }
        const normalized = normalizeText(trimmed);
        const normalizedTranslated = normalizedMap[normalized];
        if(normalizedTranslated){
          el.setAttribute(attr, normalizedTranslated);
        }
      });
    });
  }

  function translateSubtree(root, dict, entries, normalizedMap, attrDict, attrEntries, attrNormalizedMap){
    if(!root) return;

    if(root.nodeType === Node.TEXT_NODE){
      translateTextNode(root, dict, entries, normalizedMap);
      return;
    }

    if(root.nodeType === Node.ELEMENT_NODE){
      translateAttributes(root, attrDict, attrEntries, attrNormalizedMap);
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node){
        const parent = node.parentElement;
        if(!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName;
        if(tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let textNode = walker.nextNode();
    while(textNode){
      translateTextNode(textNode, dict, entries, normalizedMap);
      textNode = walker.nextNode();
    }
  }

  function applyLanguage(lang){
    const toEnglish = lang === 'en';
    const dict = toEnglish ? PL_TO_EN : EN_TO_PL;
    const entries = toEnglish ? PL_TO_EN_ENTRIES : EN_TO_PL_ENTRIES;
    const normalizedMap = toEnglish ? PL_TO_EN_NORMALIZED : EN_TO_PL_NORMALIZED;
    const attrDict = toEnglish ? ATTR_PL_TO_EN : ATTR_EN_TO_PL;
    const attrEntries = toEnglish ? ATTR_PL_TO_EN_ENTRIES : ATTR_EN_TO_PL_ENTRIES;
    const attrNormalizedMap = toEnglish ? ATTR_PL_TO_EN_NORMALIZED : ATTR_EN_TO_PL_NORMALIZED;

    document.documentElement.lang = toEnglish ? 'en' : 'pl';

    const isDay = document.documentElement.classList.contains('day-theme');
    document.title = toEnglish
      ? (isDay ? titleByLang.en.day : titleByLang.en.night)
      : (isDay ? titleByLang.pl.day : titleByLang.pl.night);

    translateSubtree(document.body, dict, entries, normalizedMap, attrDict, attrEntries, attrNormalizedMap);

    const langBtn = document.getElementById('langToggleBtn');
    if(langBtn){
      if(toEnglish){
        langBtn.textContent = 'PL';
        langBtn.setAttribute('aria-label', 'Switch language to Polish');
        langBtn.setAttribute('title', 'Switch to Polish');
      } else {
        langBtn.textContent = 'ENG';
        langBtn.setAttribute('aria-label', 'Przełącz język na angielski');
        langBtn.setAttribute('title', 'Przełącz na angielski');
      }
    }

    try{ localStorage.setItem(STORAGE_KEY, toEnglish ? 'en' : 'pl'); }catch(e){}
  }

  const observer = new MutationObserver((mutations) => {
    let activeLang = 'pl';
    try{ activeLang = localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'pl'; }catch(e){}
    if(activeLang !== 'en') return;

    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        translateSubtree(
          node,
          PL_TO_EN,
          PL_TO_EN_ENTRIES,
          PL_TO_EN_NORMALIZED,
          ATTR_PL_TO_EN,
          ATTR_PL_TO_EN_ENTRIES,
          ATTR_PL_TO_EN_NORMALIZED
        );
      });
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    const langBtn = document.getElementById('langToggleBtn');
    if(langBtn){
      langBtn.addEventListener('click', () => {
        const active = localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'pl';
        applyLanguage(active === 'en' ? 'pl' : 'en');
      });
    }

    observer.observe(document.body, { childList: true, subtree: true });

    let savedLang = 'pl';
    try{ savedLang = localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'pl'; }catch(e){}
    if(savedLang === 'en'){
      applyLanguage('en');
    } else {
      applyLanguage('pl');
    }
  });
})();
