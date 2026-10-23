/* Scroll-driven bat and ball animation. Exposes CricketHit.calc() and CricketHit.update(). */
(function () {
  const $ = id => document.getElementById(id);
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  let tgt = 0, cur = 0, W = 1, H = 1, geo = {};
    const calc = () => {
      const st = $('hitStage'); if (!st) return;
      W = st.clientWidth; H = st.clientHeight;
      const L = Math.min(H * 0.5, W * 0.7), px = W * 0.3, py = H * 0.84, th = 58 * Math.PI / 180;
      geo = { L, px, py, cx: px + L * 0.92 * Math.sin(th), cy: py - L * 0.92 * Math.cos(th) };
      const b = $('bat'); if (b) { b.style.height = L + 'px'; b.style.left = (px - 22) + 'px'; b.style.top = (py - L) + 'px'; }
    };
    const ease = u => 1 - Math.pow(1 - u, 3);
    const ball = q => {
      const { cx, cy } = geo;
      if (q <= 0) return { x: W + 80, y: cy - H * 0.25, s: 1 };
      if (q < 0.4) { const u = q / 0.4, x0 = W + 80; return { x: x0 + (cx - x0) * u, y: cy - H * 0.22 * (1 - u) - H * 0.14 * Math.abs(Math.sin(u * Math.PI * 2)) * (1 - u), s: 1 }; }
      const u = ease(Math.min(1, (q - 0.4) / 0.6)), a = 1 - u, p1x = cx + W * 0.2, p1y = cy - H * 0.9, p2x = W * 1.05, p2y = -H * 0.25;
      return { x: a * a * cx + 2 * a * u * p1x + u * u * p2x, y: a * a * cy + 2 * a * u * p1y + u * u * p2y, s: 1 - 0.75 * u };
    };
    
  const update = () => {
    cur += (tgt - cur) * (reduce ? 1 : 0.1);
    const sec = $('hit');
      if (sec && geo.L) {
        const r = sec.getBoundingClientRect(), p = Math.max(0, Math.min(1, -r.top / (r.height - innerHeight)));
        tgt = p;
        const q = cur;
        const sw = q < 0.3 ? -78 - q * 40 : q < 0.4 ? -90 + 148 * ease((q - 0.3) / 0.1) : 58 + Math.min(30, (q - 0.4) * 60);
        const bt = $('bat'); if (bt) bt.style.transform = 'rotate(' + sw + 'deg)';
        for (let k = 0; k < 5; k++) { const e = $('b' + k); if (!e) continue; const b = ball(q - k * 0.018); e.style.transform = 'translate(' + b.x + 'px,' + b.y + 'px) scale(' + b.s + ') rotate(' + (q * 1400) + 'deg)'; if (k) e.style.opacity = q > 0.4 ? 0.34 - k * 0.07 : 0; }
        const f = $('flash'); if (f) { const o = Math.max(0, 1 - Math.abs(q - 0.41) / 0.05); f.style.opacity = o; f.style.transform = 'translate(' + geo.cx + 'px,' + geo.cy + 'px) scale(' + (0.4 + (1 - o) * 3) + ')'; }
        const six = $('six'); if (six) { const o = Math.max(0, Math.min(1, (q - 0.46) / 0.1)); six.style.opacity = o; six.style.transform = 'translate(-50%,-50%) scale(' + (0.3 + o * 0.7) + ') rotate(' + (-6 + o * 6) + 'deg)'; }
      }
      
  };
  window.CricketHit = { calc, update };
})();
