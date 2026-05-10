/* ─────────────────────────────────────────────────────────
   Mother's Day e-card — tap logic, confetti, reveal
   ───────────────────────────────────────────────────────── */
(function () {
  'use strict';

  const REQUIRED_TAPS = 3;
  const CONFETTI_COLORS = [
    '#ffffff', '#ffd1de', '#f5a3bc', '#d97a98',
    '#fbe7c5', '#f7c873', '#b8e0d2', '#c8b8e0',
    '#ffb3c7', '#ffe066', '#a8d8ea',
  ];
  const STREAMER_COLORS = [
    '#f5a3bc', '#ffd1de', '#ffe066', '#b8e0d2',
    '#c8b8e0', '#ffb3c7', '#ffffff',
  ];
  const CONFETTI_COUNT = 240;
  const STREAMER_COUNT = 14;

  /* ── Content ─────────────────────────────────────────── */
  const content = window.MOTHERSDAY_CONTENT || {};
  const letter = content.letter || {};
  const photos = Array.isArray(content.photos) ? content.photos : [];

  /* ── Passphrase gate ─────────────────────────────────── */
  setupPassphraseGate(content.passphrase);

  function setupPassphraseGate(expected) {
    const overlay = document.getElementById('passphrase-overlay');
    if (!overlay) return;
    if (!expected) { overlay.remove(); return; }
    if (sessionStorage.getItem('mothers-day-unlocked') === '1') {
      overlay.remove();
      return;
    }

    const form  = document.getElementById('passphrase-form');
    const input = document.getElementById('passphrase-input');
    const error = document.getElementById('passphrase-error');
    const normalize = s => (s || '').trim().toLowerCase();

    setTimeout(() => input && input.focus(), 100);

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (normalize(input.value) === normalize(expected)) {
        sessionStorage.setItem('mothers-day-unlocked', '1');
        overlay.classList.add('unlocked');
        setTimeout(() => overlay.remove(), 700);
      } else {
        error.hidden = false;
        input.select();
      }
    });

    input.addEventListener('input', () => { error.hidden = true; });
  }

  /* ── Element refs ────────────────────────────────────── */
  const headingEl     = document.getElementById('heading');
  const giftEl        = document.getElementById('gift');
  const rotateEl      = document.getElementById('rotate-container');
  const hintEl        = document.getElementById('hint');
  const sceneEl       = document.getElementById('scene');
  const revealEl      = document.getElementById('reveal');
  const polaroidsEl   = document.getElementById('polaroids');
  const canvas        = document.getElementById('confetti-canvas');

  /* ── Apply content to the DOM ────────────────────────── */
  if (content.heading)        headingEl.textContent = content.heading;
  if (letter.greeting)        document.getElementById('letter-greeting').textContent = letter.greeting;
  if (letter.body)            document.getElementById('letter-body').textContent     = letter.body;
  if (letter.signoff)         document.getElementById('letter-signoff').textContent  = letter.signoff;
  if (letter.signature)       document.getElementById('letter-signature').textContent = letter.signature;

  renderPolaroids();

  function renderPolaroids() {
    polaroidsEl.innerHTML = '';
    const tilts  = [-7, 4, -3, 6];
    photos.forEach((p, i) => {
      const card = document.createElement('figure');
      card.className = 'polaroid';
      const rot = tilts[i % tilts.length];
      card.style.setProperty('--rot', rot + 'deg');
      card.style.setProperty('--delay', (i * 140) + 'ms');

      const img = document.createElement('img');
      img.className = 'polaroid-img';
      img.alt = p.alt || '';
      img.loading = 'lazy';
      img.src = p.src;
      img.onerror = function () {
        const placeholder = document.createElement('div');
        placeholder.className = 'polaroid-img placeholder';
        placeholder.textContent = 'Photo ' + (i + 1);
        img.replaceWith(placeholder);
      };
      card.appendChild(img);

      if (p.caption) {
        const cap = document.createElement('figcaption');
        cap.className = 'polaroid-caption';
        cap.textContent = p.caption;
        card.appendChild(cap);
      }
      polaroidsEl.appendChild(card);
    });
  }

  /* ── Tap handling ────────────────────────────────────── */
  let tapCount = 0;
  let opening  = false;
  let rotationFrozen = false;

  function onTap(e) {
    if (opening) return;
    if (e && e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
    if (e && e.type === 'keydown') e.preventDefault();

    tapCount++;

    // First tap: smoothly stop the continuous rotation so the box faces forward
    if (!rotationFrozen) {
      freezeRotation();
      rotationFrozen = true;
    }

    if (tapCount < REQUIRED_TAPS) {
      doWiggle(tapCount);
      if (tapCount === REQUIRED_TAPS - 1 && hintEl) hintEl.textContent = 'one more…';
    } else {
      doWiggle(tapCount + 2); // bigger wiggle on the last tap
      setTimeout(openGift, 180);
    }
  }

  giftEl.addEventListener('click', onTap);
  giftEl.addEventListener('keydown', onTap);

  function freezeRotation() {
    if (!rotateEl) return;
    const current = getComputedStyle(rotateEl).transform;
    rotateEl.style.transform = current;
    rotateEl.style.animation = 'none';
    void rotateEl.offsetWidth;
    rotateEl.style.transition = 'transform 0.85s cubic-bezier(.2, 1, .3, 1)';
    rotateEl.style.transform = 'rotateX(-22deg) rotateY(0deg)';
  }

  function doWiggle(intensity) {
    giftEl.style.setProperty('--count', Math.min(12, intensity * 4));
    giftEl.classList.remove('animate');
    void giftEl.offsetWidth;
    giftEl.classList.add('animate');
    setTimeout(() => giftEl.classList.remove('animate'), 360);
  }

  /* ── Open sequence ───────────────────────────────────── */
  function openGift() {
    opening = true;
    giftEl.style.cursor = 'default';
    giftEl.removeAttribute('role');
    giftEl.setAttribute('aria-disabled', 'true');

    if (hintEl) hintEl.classList.add('fade-out');

    giftEl.classList.remove('animate');
    void giftEl.offsetWidth;
    giftEl.classList.add('open');

    // confetti starts as the lid lifts
    setTimeout(burstConfetti, 200);

    // reveal letter + photos as a fixed overlay; box dims behind it
    setTimeout(() => {
      revealEl.setAttribute('aria-hidden', 'false');
      revealEl.classList.add('shown');
      headingEl.classList.add('shown');
      giftEl.classList.add('dimmed');
    }, 1400);
  }

  /* ─────────────────────────────────────────────────────
     Canvas confetti — small standalone particle system
     ───────────────────────────────────────────────────── */
  const ctx = canvas.getContext('2d');
  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let particles = [];
  let rafId = null;

  function sizeCanvas() {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width  = Math.floor(window.innerWidth  * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', sizeCanvas);
  sizeCanvas();

  function burstConfetti() {
    const rect = giftEl.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height * 0.25;

    for (let i = 0; i < CONFETTI_COUNT; i++) particles.push(makeConfetti(cx, cy));
    for (let i = 0; i < STREAMER_COUNT; i++) particles.push(makeStreamer(cx, cy));

    // a second smaller burst a beat later for a fuller feel
    setTimeout(() => {
      for (let i = 0; i < Math.floor(CONFETTI_COUNT * 0.5); i++) {
        particles.push(makeConfetti(cx, cy));
      }
      for (let i = 0; i < Math.floor(STREAMER_COUNT * 0.6); i++) {
        particles.push(makeStreamer(cx, cy));
      }
      if (!rafId) rafId = requestAnimationFrame(tick);
    }, 260);

    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function makeConfetti(x, y) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
    const speed = 7 + Math.random() * 11;
    return {
      type: 'confetti',
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      g:  0.18 + Math.random() * 0.08,
      drag: 0.992,
      size: 4 + Math.random() * 7,
      rot:  Math.random() * Math.PI * 2,
      vr:   (Math.random() - 0.5) * 0.4,
      shape: Math.random() < 0.6 ? 'rect' : 'oval',
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      life: 0,
      ttl:  240 + Math.floor(Math.random() * 140),
    };
  }

  function makeStreamer(x, y) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.95;
    const speed = 5 + Math.random() * 7;
    return {
      type: 'streamer',
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      g:  0.06 + Math.random() * 0.05,
      drag: 0.985,
      width: 4 + Math.random() * 3,
      length: 90 + Math.random() * 90,
      phase: Math.random() * Math.PI * 2,
      swayFreq: 0.06 + Math.random() * 0.04,
      swayAmp: 14 + Math.random() * 14,
      color: STREAMER_COLORS[Math.floor(Math.random() * STREAMER_COLORS.length)],
      life: 0,
      ttl:  340 + Math.floor(Math.random() * 140),
    };
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      const fade = p.life > p.ttl - 50
        ? Math.max(0, (p.ttl - p.life) / 50)
        : 1;

      if (p.type === 'streamer') drawStreamer(p, fade);
      else                       drawConfetti(p, fade);

      if (p.life > p.ttl || p.y - 200 > window.innerHeight) {
        particles.splice(i, 1);
      }
    }
    if (particles.length > 0) {
      rafId = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rafId = null;
    }
  }

  function drawConfetti(p, fade) {
    p.rot += p.vr;
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if (p.shape === 'rect') {
      ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
    } else {
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.55, p.size * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawStreamer(p, fade) {
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = p.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    const segs = 16;
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      // ribbon trails behind the head — head is the leading particle position;
      // tail extends back along the velocity direction
      const trailDx = -p.vx * t * 4;
      const trailDy = -p.vy * t * 4;
      const sway = Math.sin(p.life * p.swayFreq + t * Math.PI * 2.4 + p.phase) * p.swayAmp * t;
      const px = p.x + trailDx + sway;
      const py = p.y + trailDy;
      if (i === 0) ctx.moveTo(px, py);
      else         ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  }
})();
