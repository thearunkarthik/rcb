/* RCB Tamil Community - UI logic: theme, language, rendering, interactions. */
(function () {
  const D = window.RCB_DATA, $ = id => document.getElementById(id), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const ICONS = {
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.2v5.6l5-2.8z" fill="currentColor"/>',
    whatsapp: '<path d="M3.5 20.5l1.4-4.6A8.5 8.5 0 1 1 8.2 19z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2.2-1-1 .8c-1-.4-1.8-1.2-2.2-2.2l.8-1-1-2.2z"/>',
    contactEmail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7.5l8 6 8-6"/>'
  };
  const SOCIALS = [['instagram', 'Instagram'], ['youtube', 'YouTube'], ['whatsapp', 'WhatsApp'], ['contactEmail', 'Email']];
  const svg = (k, w) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[k] + '</svg>';
  const store = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} };
  const grad = i => D.stripe(D.BGS[i % 7][0], D.BGS[i % 7][1], 135 + i * 25);
  const h = (tag, cls, html, attrs) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
  const st = { lang: store('rcbLang') || 'en', feed: 'all', faq: 0, lb: -1 };
  const tr = () => Object.assign({}, D.T[st.lang], D.X[st.lang]);

  /* theme */
  const applyTheme = th => { root.dataset.theme = th; store('rcbTheme', th); };
  applyTheme(store('rcbTheme') === 'light' ? 'light' : 'dark');
  $$('.js-theme').forEach(b => b.addEventListener('click', () => applyTheme(root.dataset.theme === 'light' ? 'dark' : 'light')));

  /* toast + external links */
  let tt;
  const say = m => { const t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 3400); };
  const open = (url, msg) => url ? window.open(url, '_blank', 'noopener') : say(msg);
  const join = () => { closeMenu(); open(D.CONFIG.inviteUrl, D.MISS[st.lang]); };
  $$('.js-join').forEach(b => b.addEventListener('click', join));
  $('shareBtn').addEventListener('click', () => open(D.CONFIG.contactEmail ? 'mailto:' + D.CONFIG.contactEmail + '?subject=My%20RCB%20fan%20story' : '', D.SHARE[st.lang]));

  /* smooth in-page navigation + mobile menu */
  const closeMenu = () => { $('mmenu').classList.remove('open'); $('burger').textContent = '☰'; $('burger').setAttribute('aria-expanded', 'false'); };
  $('burger').addEventListener('click', () => { const o = $('mmenu').classList.toggle('open'); $('burger').textContent = o ? '✕' : '☰'; $('burger').setAttribute('aria-expanded', o); });
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-go]'); if (!a) return;
    e.preventDefault(); closeMenu();
    const id = a.dataset.go, el = $(id);
    if (el) window.scrollTo({ top: id === 'home' ? 0 : el.getBoundingClientRect().top + scrollY - 60, behavior: 'smooth' });
  });

  /* language */
  const render = () => {
    const t = tr(), L = st.lang;
    root.lang = L;
    $$('[data-i18n]').forEach(e => { e.textContent = t[e.dataset.i18n] || ''; });
    const navHtml = (cls) => D.IDS.map((id, i) => '<a href="#' + id + '" data-go="' + id + '">' + D.NAV[L][i] + '</a>').join('');
    $('navLinks').innerHTML = navHtml(); $('mLinks').innerHTML = navHtml(); $('fLinks').innerHTML = navHtml();
    $('marquee').innerHTML = Array(16).fill('<span>' + t.tag + ' <i>◆</i></span>').join('');
    $('cities').innerHTML = D.CITIES[L].map(c => '<span class="chip">' + c + '</span>').join('');
    $('mdItems').innerHTML = D.MD[L].map(c => '<span class="chip">' + c + '</span>').join('');
    $('journeyList').innerHTML = D.JR[L].map((j, i) => '<div class="tl-i" data-r="1" style="--d:' + i * 0.1 + 's"><span class="dot' + (i >= 4 ? ' win' : '') + '"></span><div class="yr">' + j[0] + '</div><h3>' + j[1] + '</h3><p>' + j[2] + '</p></div>').join('');
    $('squadList').innerHTML = [0, 1, 2, 3, 4, 5].map(i => '<div class="pl ph" data-r="1" style="--d:' + i * 0.08 + 's"><div class="cap"><b>' + (L === 'en' ? 'Player name' : 'வீரர் பெயர்') + '</b><div>' + t.sqRole + '</div></div></div>').join('');
    $('rail').innerHTML = D.STORIES[L].map((s, i) => '<a href="#stories" class="story tile" data-sample style="margin-top:' + (i % 2 ? 50 : 0) + 'px"><div class="layer ti" style="background:' + grad(i) + '"></div><div class="layer shade"></div><span class="num">0' + (i + 1) + '</span><span class="sample">SAMPLE</span><div class="body"><span class="pill">' + s[0] + '</span><b>' + s[1] + '</b><span class="cta">' + t.explore + ' →</span></div></a>').join('');
    $('culList').innerHTML = D.CUL[L].map((c, i) => '<div class="cc" data-r="1" style="--d:' + i * 0.08 + 's"><span>0' + (i + 1) + '</span><h3>' + c[0] + '</h3><p>' + c[1] + '</p></div>').join('');
    $('galList').innerHTML = D.GAL[L].map((l, i) => '<button class="gi tile" data-r="z" data-i="' + i + '" aria-label="' + l + '" style="--d:' + i * 0.07 + 's;grid-column:' + D.GSPAN[i][0] + ';grid-row:' + D.GSPAN[i][1] + '"><div class="layer ti" style="background:' + grad(i + 2) + '"></div><div class="layer shade"></div><span class="lab">' + l + '</span><span class="cta">⤢</span></button>').join('');
    $('filters').innerHTML = [['all', 'chAll'], ['reel', 'chReel'], ['video', 'chVideo'], ['meme', 'chMeme'], ['blog', 'chBlog']].map(c => '<button class="fchip' + (st.feed === c[0] ? ' on' : '') + '" data-k="' + c[0] + '" aria-pressed="' + (st.feed === c[0]) + '">' + t[c[1]] + '</button>').join('');
    $('feed').innerHTML = D.FEEDS.map((f, i) => ({ f, i })).filter(o => st.feed === 'all' || o.f[0] === st.feed).map(o => {
      const k = o.f[0], c = k === 'blog' ? 'cRead' : k === 'meme' ? 'cView' : 'cWatch', play = k === 'reel' || k === 'video';
      return '<a href="#updates" class="post tile" data-sample><div class="m" style="height:' + o.f[1] + '"><div class="layer ti" style="background:' + D.stripe(D.BGS[o.i][0], D.BGS[o.i][1], 120 + o.i * 20) + '"></div><span class="pill">' + t['t' + k[0].toUpperCase() + k.slice(1)] + '</span><span class="sample">SAMPLE</span>' + (play ? '<span class="play">▶</span>' : '') + '</div><div class="b"><b>' + t.fTitles[o.i] + '</b><div class="meta"><span>' + t.upDate + '</span><em>' + t[c] + ' →</em></div></div></a>';
    }).join('');
    $('faqList').innerHTML = D.FAQ[L].map((f, i) => '<div class="fq' + (st.faq === i ? ' open' : '') + '" data-r="1"><button data-i="' + i + '" aria-expanded="' + (st.faq === i) + '"><span>' + f[0] + '</span><i>+</i></button><div class="ans"><p>' + f[1] + '</p></div></div>').join('');
    $('socList').innerHTML = SOCIALS.map(s => '<button class="st" data-u="' + s[0] + '" data-r="z">' + svg(s[0], 1.5) + '<span><b>' + s[1] + '</b><span>' + t.fwNote + ' →</span></span></button>').join('');
    $('fSoc').innerHTML = SOCIALS.map(s => '<button data-u="' + s[0] + '" aria-label="' + s[1] + '" title="' + s[1] + '">' + svg(s[0], 1.8) + '</button>').join('');
    const ev = $('events'), has = D.EVENTS.length > 0;
    ev.hidden = !has; $('noEvents').hidden = has;
    ev.innerHTML = D.EVENTS.map(e => '<div class="ev"><b>' + e.title + '</b><p>' + e.date + ' · ' + e.venue + '</p></div>').join('');
    if (st.lb >= 0) paintLb();
    scan();
  };
  $$('.js-lang').forEach(b => b.addEventListener('click', () => { st.lang = st.lang === 'en' ? 'ta' : 'en'; store('rcbLang', st.lang); render(); }));

  /* delegated clicks for generated content */
  document.addEventListener('click', e => {
    const s = e.target.closest('[data-sample]'); if (s) { e.preventDefault(); say(tr().sampleMsg); return; }
    const f = e.target.closest('.fchip'); if (f) { st.feed = f.dataset.k; render(); return; }
    const q = e.target.closest('.fq button'); if (q) { const i = +q.dataset.i; st.faq = st.faq === i ? -1 : i; $$('.fq').forEach((n, j) => { n.classList.toggle('open', j === st.faq); $('faqList').children[j].querySelector('button').setAttribute('aria-expanded', j === st.faq); }); return; }
    const u = e.target.closest('[data-u]'); if (u) { const k = u.dataset.u, v = D.CONFIG[k]; open(v && k === 'contactEmail' ? 'mailto:' + v : v, st.lang === 'en' ? 'Link not set. Add it in js/data.js (CONFIG).' : 'இணைப்பு அமைக்கப்படவில்லை. js/data.js (CONFIG) இல் சேர்க்கவும்.'); return; }
    const g = e.target.closest('.gi'); if (g) { st.lb = +g.dataset.i; paintLb(); $('lb').classList.add('open'); }
  });
  $$('.rb').forEach(b => b.addEventListener('click', () => $('rail').scrollBy({ left: +b.dataset.d * 420, behavior: 'smooth' })));

  /* lightbox */
  const paintLb = () => { $('lbCard').style.background = grad(st.lb + 2); $('lbLabel').textContent = D.GAL[st.lang][st.lb]; $('lbCount').textContent = (st.lb + 1) + ' / 7'; };
  const lbGo = d => { st.lb = (st.lb + d + 7) % 7; paintLb(); };
  const lbClose = () => { st.lb = -1; $('lb').classList.remove('open'); };
  $('lbNext').addEventListener('click', e => { e.stopPropagation(); lbGo(1); });
  $('lbPrev').addEventListener('click', e => { e.stopPropagation(); lbGo(-1); });
  $('lbClose').addEventListener('click', lbClose);
  $('lb').addEventListener('click', e => { if (e.target === $('lb')) lbClose(); });
  addEventListener('keydown', e => { if (st.lb < 0) return; if (e.key === 'Escape') lbClose(); if (e.key === 'ArrowRight') lbGo(1); if (e.key === 'ArrowLeft') lbGo(-1); });

  /* reveal on scroll */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
  const scan = () => $$('[data-r]:not(.in)').forEach(e => io.observe(e));

  /* main loop: progress bar, parallax, header, hero canvas, cricket hit */
  const loop = () => {
    const sy = window.scrollY, dh = document.documentElement.scrollHeight - innerHeight;
    $('bar').style.transform = 'scaleX(' + (dh > 0 ? sy / dh : 0) + ')';
    $$('[data-px]').forEach(e => { const r = e.parentElement.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) e.style.transform = 'translate(-50%,-50%) translateY(' + (r.top * e.dataset.px) + 'px)'; });
    $('nav').classList.toggle('scrolled', sy > 40);
    window.HeroGlimmer.tick(performance.now());
    window.CricketHit.update();
    requestAnimationFrame(loop);
  };
  addEventListener('resize', () => window.CricketHit.calc());
  render();
  window.CricketHit.calc(); setTimeout(window.CricketHit.calc, 700); setTimeout(scan, 700);
  loop();
})();
