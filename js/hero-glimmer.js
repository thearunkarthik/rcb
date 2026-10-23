/* Hero background: glimmer particle field on canvas. Exposes HeroGlimmer.tick(now). */
(function () {
  const $ = id => document.getElementById(id);
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const isDark = () => document.documentElement.dataset.theme !== 'light';
  const cv = $('sonar'), cx2 = cv && cv.getContext('2d'), G = ['R','C','B','+','·','◆','·','+'];
    let pings = [], lastPing = 0, T0 = performance.now(), cw = 0, ch = 0;
    const fit = () => { if (!cv) return; const r = cv.parentElement.getBoundingClientRect(), d = Math.min(1.25, devicePixelRatio || 1); cw = r.width; ch = r.height; cv.width = cw * d; cv.height = ch * d; cx2.setTransform(d, 0, 0, d, 0, 0); };
    fit(); addEventListener('resize', fit);
    const GW = { size: 1.6, sizeVariance: 0.6, brightness: 1, spread: 1, hollow: 0.06, perspective: 0.7, cx: 0.5, cy: 0.5, speed: 0.5, glitter: 0.5, glintSize: 1, twinkle: 0.5, focus: 0.62, aperture: 0.45, boost: 7, parallax: 0.5 };
    const P = [], born = performance.now(); let lastT = born, held = false, boostNow = 1, pt = { x: 0, y: 0 }, ptS = { x: 0, y: 0 }, waves = [], sprDark = null;
    const seed = (p, far) => { const th = Math.random() * 6.283, r = GW.hollow + (1 - GW.hollow) * Math.sqrt(Math.random()); p.x = Math.cos(th) * r * GW.spread * 1.6; p.y = Math.sin(th) * r * GW.spread; p.z = far ? 1 : 0.02 + Math.random() * 0.98; p.s = 1 + GW.sizeVariance * (Math.random() * 2 - 1); p.ph = Math.random() * 100; p.c = Math.random() < 0.55 ? 0 : 1; p.fr = 0.6 + Math.random() * 1.8; return p; };
    const sprite = (rgb, soft) => { const c = document.createElement('canvas'); c.width = c.height = 32; const x = c.getContext('2d'), g = x.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(' + rgb + ',1)'); g.addColorStop(soft ? 0.25 : 0.45, 'rgba(' + rgb + ',.85)'); g.addColorStop(1, 'rgba(' + rgb + ',0)'); x.fillStyle = g; x.fillRect(0, 0, 32, 32); return c; };
    const SPR = { d: [sprite('246,222,140'), sprite('255,58,85')], l: [sprite('138,106,14'), sprite('179,14,40')] };
    const hero = document.querySelector('[data-hero]');
    if (hero) {
      hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); pt.x = (e.clientX - r.left) / r.width - 0.5; pt.y = (e.clientY - r.top) / r.height - 0.5; }, { passive: true });
      hero.addEventListener('pointerleave', () => { pt.x = 0; pt.y = 0; held = false; });
      hero.addEventListener('pointerdown', e => { if (e.target.closest('a,button')) return; held = true; const r = hero.getBoundingClientRect(); waves.push({ x: e.clientX - r.left, y: e.clientY - r.top, t0: performance.now() }); if (waves.length > 3) waves.shift(); });
      addEventListener('pointerup', () => { held = false; });
    }
    const sonar = now => {
      if (!cx2 || window.scrollY > innerHeight) return;
      const want = Math.round(Math.max(180, Math.min(850, cw * ch / 1500)));
      while (P.length < want) P.push(seed({}, false)); if (P.length > want) P.length = want;
      const dt = reduce ? 0 : Math.min(0.04, (now - lastT) / 1000); lastT = now;
      const age = (now - born) / 1000, intro = Math.max(0, 1 - age / 1.8), introMul = 1 + 8 * intro * intro, fadeIn = Math.min(1, age / 0.9);
      boostNow += ((held ? GW.boost : 1) - boostNow) * Math.min(1, dt * 4);
      ptS.x += (pt.x - ptS.x) * Math.min(1, dt * 3); ptS.y += (pt.y - ptS.y) * Math.min(1, dt * 3);
      const dk = isDark(), spr = dk ? SPR.d : SPR.l, flashC = dk ? 'rgba(255,248,225,' : 'rgba(143,0,30,';
      const vz = GW.speed * 0.2 * boostNow * introMul, S = Math.min(cw, ch) * 0.16, ox = cw * GW.cx, oy = ch * GW.cy, t = now / 1000, kz = 0.4 + GW.perspective;
      const px = ptS.x * GW.parallax * 120, py = ptS.y * GW.parallax * 80, gth = 1 - GW.glitter * 0.03, gk = 1 / (GW.glitter * 0.03);
      if (waves.length) waves = waves.filter(w => now - w.t0 < 2000);
      cx2.clearRect(0, 0, cw, ch); cx2.globalCompositeOperation = dk ? 'lighter' : 'source-over';
      const fl = [];
      for (let i = 0; i < P.length; i++) {
        const p = P[i]; p.z -= vz * dt;
        const z = p.z, k = 1 / (z * kz + 0.06), near = 1 - z, sx = ox + p.x * k * S - px * near, sy = oy + p.y * k * S - py * near;
        if (z <= 0.01 || sx < -40 || sx > cw + 40 || sy < -40 || sy > ch + 40) { seed(p, true); continue; }
        const blur = Math.abs(z - GW.focus) * GW.aperture * 5;
        const rad = Math.max(0.5, GW.size * p.s * k * 0.18) * (1 + blur);
        let al = Math.min(1, near * 2.5) * fadeIn * GW.brightness * (1 - GW.twinkle * 0.5 * (1 + Math.sin(t * 3 * p.fr + p.ph))) / (1 + blur * 1.6);
        let flash = (Math.sin(t * 0.9 * p.fr + p.ph) - gth) * gk;
        for (let j = 0; j < waves.length; j++) { const w = waves[j], r = (now - w.t0) * 0.9, d = Math.abs(Math.hypot(sx - w.x, sy - w.y) - r); if (d < 50) flash = Math.max(flash, (1 - d / 50) * (1 - (now - w.t0) / 2000)); }
        const d2 = rad * 3;
        cx2.globalAlpha = Math.min(1, al + Math.max(0, flash));
        if (boostNow > 1.6) { const z2 = z + 0.012 * boostNow, k2 = 1 / (z2 * kz + 0.06); cx2.globalAlpha *= 0.6; const tx = ox + p.x * k2 * S - px * (1 - z2), ty = oy + p.y * k2 * S - py * (1 - z2); for (let q = 1; q <= 3; q++) cx2.drawImage(spr[p.c], sx + (tx - sx) * q / 3 - d2 / 2, sy + (ty - sy) * q / 3 - d2 / 2, d2, d2); cx2.globalAlpha /= 0.6; }
        cx2.drawImage(spr[p.c], sx - d2 / 2, sy - d2 / 2, d2, d2);
        if (flash > 0.05) fl.push(sx, sy, Math.min(1, flash), GW.glintSize * (6 + 10 * near) * Math.min(1, flash));
      }
      cx2.globalAlpha = 1;
      if (fl.length) { cx2.lineCap = 'round'; cx2.lineWidth = 1; for (let i = 0; i < fl.length; i += 4) { const x = fl[i], y = fl[i + 1], L = fl[i + 3]; cx2.strokeStyle = flashC + fl[i + 2] + ')'; cx2.beginPath(); cx2.moveTo(x - L, y); cx2.lineTo(x + L, y); cx2.moveTo(x, y - L); cx2.lineTo(x, y + L); cx2.stroke(); } }
      cx2.globalCompositeOperation = 'source-over';
    };
    
  window.HeroGlimmer = { tick: sonar };
})();
