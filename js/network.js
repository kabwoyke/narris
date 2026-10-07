/**
 * Faint canvas of drifting, connected points that reacts gently to the cursor.
 * Guard rails (CLAUDE.md section 8): capped point count; paused when the tab is hidden or the
 * hero is off-screen; disabled for reduced motion, data-saver and low-power devices; switched off
 * if frames drop; hidden on the alignment-motif slide so the two never compete.
 */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export function initNetwork({ canvas, hero, hiddenOnSlide = 0 }) {
  const lowPower =
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
    (navigator.connection && navigator.connection.saveData);
  if (reduceMotion.matches || lowPower) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const isMobile = window.matchMedia('(max-width: 767px)');
  const MAX_POINTS = isMobile.matches ? 26 : 64;
  const LINK = isMobile.matches ? 110 : 150; // px distance for a connecting line
  const pointer = { x: -9999, y: -9999, on: false };
  let w = 0, h = 0, dpr = 1, pts = [];
  let raf = 0, visible = true, onMotifSlide = false, dead = false;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth;
    h = hero.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(MAX_POINTS, Math.round((w * h) / 22000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
    }));
  }

  // Frame-time monitor: if the first ~90 frames average above ~30ms the device is struggling.
  let frames = 0, acc = 0, prev = 0;

  function frame(t) {
    raf = requestAnimationFrame(frame);
    if (prev) {
      const dt = t - prev;
      if (frames < 90) {
        acc += dt; frames++;
        if (frames === 90 && acc / frames > 30) { shutdown(); return; }
      }
    }
    prev = t;

    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      // Gentle drift, plus a soft push away from the cursor.
      if (pointer.on) {
        const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140 && d2 > 1) { const f = (1 - Math.sqrt(d2) / 140) * 0.05; p.vx += (dx / Math.sqrt(d2)) * f; p.vy += (dy / Math.sqrt(d2)) * f; }
      }
      p.vx *= 0.995; p.vy *= 0.995;
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
    }
    ctx.lineWidth = 1;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j];
        const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < LINK * LINK) {
          ctx.strokeStyle = `rgba(235,230,228,${(1 - Math.sqrt(d2) / LINK) * 0.22})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      if (pointer.on) {
        const dx = a.x - pointer.x, dy = a.y - pointer.y, d2 = dx * dx + dy * dy;
        if (d2 < 170 * 170) {
          ctx.strokeStyle = `rgba(235,230,228,${(1 - Math.sqrt(d2) / 170) * 0.5})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(235,230,228,0.55)';
      ctx.beginPath(); ctx.arc(a.x, a.y, 1.5, 0, Math.PI * 2); ctx.fill();
    }
  }

  const shouldRun = () => !dead && visible && !document.hidden && !onMotifSlide;
  function sync() {
    canvas.classList.toggle('is-on', shouldRun());
    if (shouldRun() && !raf) { prev = 0; raf = requestAnimationFrame(frame); }
    else if (!shouldRun() && raf) { cancelAnimationFrame(raf); raf = 0; }
  }
  function shutdown() {
    dead = true;
    cancelAnimationFrame(raf); raf = 0;
    canvas.classList.remove('is-on');
    canvas.remove();
  }

  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.on = true;
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointer.on = false; });
  hero.addEventListener('hero:change', (e) => { onMotifSlide = e.detail.index === hiddenOnSlide; sync(); });
  document.addEventListener('visibilitychange', sync);
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; sync(); }).observe(hero);
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 200); });
  reduceMotion.addEventListener('change', (m) => { if (m.matches) shutdown(); });

  resize();
  sync();
}
