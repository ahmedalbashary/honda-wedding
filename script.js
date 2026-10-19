(function () {
  'use strict';

  /* ============================================================
     WEDDING INVITATION CONFIGURATION
     ============================================================ */
  // Wedding Date & Time: Saturday, December 5, 2026 at 4:00 PM
  const WEDDING_DATE = new Date('2026-12-05T16:00:00').getTime();
  const COUNT_START  = new Date('2026-01-01T00:00:00').getTime();

  // 📊 Google Sheets RSVP Export Configuration:
  // Target Sheet: https://docs.google.com/spreadsheets/d/1Udd9Bj1yKndK8-7nke1rCDV5dhcqGEhgDpyINjDHQl4/edit?usp=sharing
  // Follow the instructions in GOOGLE_SHEET_SETUP.md and paste your Web App URL here:
  const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxzCQur3nllN6GdhYwjFYOZGBlGO7JqEOIS3hPpHat42TyZzJ2J38F3Qw-sEJD2bOUZ6w/exec';

  const STORY = [
    ['✦', 'The Beginning',  'We met on an ordinary day — but one look was enough to start the greatest adventure of our lives. A smile that opened a conversation that never ended.'],
    ['♡', 'The Journey',    'We walked together through every map, sharing victories and defeats, learning from every encounter, and leveling up side by side.'],
    ['∞', 'The Final Boss', 'Today we stand before you to make the ultimate pledge — an unbreakable bond, a co-op mode that lasts forever. Game on.']
  ];

  // 3 Theme Colors requested:
  const COLORS = [
    { color: '#556B2F', name: 'Olive Green', icon: '🌿' },
    { color: '#800000', name: 'Maroon',      icon: '🍷' },
    { color: '#002366', name: 'Navy Blue',   icon: '⚓' }
  ];

  const $ = id => document.getElementById(id);
  let soundOn = true, ac;

  function beep(f, d = .12) {
    if (!soundOn) return;
    try {
      ac = ac || new AudioContext();
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'square';
      o.frequency.value = f;
      g.gain.value = .04;
      o.connect(g);
      g.connect(ac.destination);
      o.start();
      o.stop(ac.currentTime + d);
    } catch (e) {}
  }

  function toast(t) {
    const el = $('toast');
    el.textContent = t;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2600);
  }

  /* ===== Start Title Screen ===== */
  const audio = $('bgMusic'), musicBtn = $('musicToggle');
  function start() {
    if ($('title').classList.contains('gone')) return;
    $('title').classList.add('gone');
    $('game').hidden = false;
    document.body.classList.remove('locked');
    beep(523);
    setTimeout(() => beep(784, .2), 120);
    audio.play().then(() => musicBtn.classList.add('playing')).catch(() => {});
    window.scrollTo(0, 0);
  }
  $('startBtn').addEventListener('click', start);
  addEventListener('keydown', e => { if (e.key === 'Enter') start(); });
  musicBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => { musicBtn.classList.add('playing'); soundOn = true; }).catch(() => {});
    } else {
      audio.pause();
      musicBtn.classList.remove('playing');
      soundOn = false;
    }
  });

  /* ===== HUD: scroll progress + level indicator ===== */
  addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    $('meterFill').style.width = Math.min(100, (scrollY / max) * 100) + '%';
  }, { passive: true });

  const io = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting) $('levelLabel').textContent = e.target.dataset.label;
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  document.querySelectorAll('[data-label]').forEach(s => io.observe(s));

  /* ===== Level 1: Story cutscene ===== */
  let step = 0;
  function showStep() {
    const [i, t, p] = STORY[step];
    $('cutIcon').textContent = i;
    $('cutTitle').textContent = t;
    $('cutText').textContent = p;
    $('cutDots').innerHTML = STORY.map((_, n) => `<i class="${n === step ? 'on' : ''}"></i>`).join('');
    $('cutNext').textContent = step === STORY.length - 1 ? 'REPLAY' : 'NEXT';
  }
  $('cutNext').addEventListener('click', () => {
    step = (step + 1) % STORY.length;
    beep(440 + step * 110);
    showStep();
  });
  showStep();

  /* ===== Level 2: Countdown Timer (to 4:00 PM Dec 5, 2026) ===== */
  const pad = n => String(Math.max(0, n)).padStart(2, '0');
  function tick() {
    const diff = Math.max(0, WEDDING_DATE - Date.now());
    $('days').textContent    = pad(Math.floor(diff / 864e5));
    $('hours').textContent   = pad(Math.floor(diff / 36e5 % 24));
    $('minutes').textContent = pad(Math.floor(diff / 6e4 % 60));
    $('seconds').textContent = pad(Math.floor(diff / 1e3 % 60));
    $('timeBar').style.width = Math.min(100, (diff / (WEDDING_DATE - COUNT_START)) * 100) + '%';
  }
  tick();
  setInterval(tick, 1000);

  /* ===== Level 4: Theme Colors (3 Slots) ===== */
  let got = 0;
  document.querySelectorAll('.color-slot').forEach((slot, idx) => {
    const info = COLORS[idx] || {};

    const iconEl = document.createElement('span');
    iconEl.className = 'color-icon';
    iconEl.textContent = info.icon || '🎨';
    slot.appendChild(iconEl);

    const labelEl = document.createElement('span');
    labelEl.className = 'color-label';
    labelEl.textContent = info.name || '';
    slot.appendChild(labelEl);

    slot.addEventListener('click', () => {
      if (slot.classList.contains('got')) return;
      slot.style.backgroundColor = info.color;
      slot.style.borderColor = info.color;
      slot.style.boxShadow = `0 5px 0 ${info.color}aa`;
      slot.classList.add('got');
      beep(660);

      $('gotCount').textContent = ++got;
      if (got === COLORS.length) {
        toast('Achievement Unlocked: Full Color Palette! 🎨');
      } else {
        toast(`Color Unlocked: ${info.name}! 🎨`);
      }
    });
  });

  /* ===== Final Level: Co-op Door ===== */
  const pads = { 1: $('pad1'), 2: $('pad2') }, held = { 1: 0, 2: 0 }, keys = { a: 1, l: 2 };
  let sync = 0, opened = false, last = performance.now();
  const setHeld = (k, v) => { held[k] = v; pads[k].classList.toggle('on', !!v); };

  Object.entries(pads).forEach(([k, el]) => {
    el.addEventListener('pointerdown', e => { e.preventDefault(); setHeld(k, 1); beep(300 + k * 150, .06); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => el.addEventListener(t, () => setHeld(k, 0)));
    el.addEventListener('contextmenu', e => e.preventDefault());
  });

  addEventListener('keydown', e => {
    const k = keys[e.key.toLowerCase()];
    if (k && !e.repeat && !e.target.closest('form')) setHeld(k, 1);
  });
  addEventListener('keyup', e => {
    const k = keys[e.key.toLowerCase()];
    if (k) setHeld(k, 0);
  });

  function openGate() {
    if (opened) return;
    opened = true;
    $('gate').classList.add('open');
    $('rsvpForm').removeAttribute('inert');
    $('syncBar').style.width = '100%';
    $('soloBtn').hidden = true;
    pads[1].disabled = pads[2].disabled = true;
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .18), i * 110));
    toast('Achievement Unlocked: It Takes Two ✦');

    const cols = ['#D6322B', '#F2B01E', '#2F3E8F', '#FFD23F', '#556B2F'];
    for (let i = 0; i < 40; i++) {
      const c = document.createElement('div');
      c.className = 'cf';
      c.style.cssText = `left:${Math.random() * 100}vw;background:${cols[i % 5]};animation-delay:${Math.random() * .6}s`;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 3500);
    }
  }
  $('soloBtn').addEventListener('click', openGate);

  (function loop(t) {
    const dt = (t - last) / 1000;
    last = t;
    if (!opened) {
      sync = held[1] && held[2] ? Math.min(1, sync + dt / 1.2) : Math.max(0, sync - dt * 2);
      $('syncBar').style.width = (sync * 100) + '%';
      if (sync >= 1) openGate();
    }
    requestAnimationFrame(loop);
  })(last);

  /* ===== RSVP Form Submission & Google Sheets Export ===== */
  const rsvpForm = $('rsvpForm');
  rsvpForm.addEventListener('submit', async e => {
    e.preventDefault();

    const f = e.target;
    const submitBtn = f.querySelector('button[type="submit"]');
    const st = $('formStatus');
    const d = Object.fromEntries(new FormData(f));
    const yes = d.attending === 'yes';
    const thanks = yes
      ? `Thanks ${d.name}! Your RSVP is confirmed. We can't wait to celebrate together! 🎉`
      : `Thanks ${d.name} for letting us know. We'll miss you on our big day! 💛`;

    d.timestamp = new Date().toLocaleString();

    // 1. Local backup storage
    try {
      const list = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
      list.push(d);
      localStorage.setItem('wedding_rsvps', JSON.stringify(list));
    } catch (storageErr) {
      console.warn('Local storage error:', storageErr);
    }

    // 2. Submit to Google Sheets via Apps Script Web App
    if (GOOGLE_APPS_SCRIPT_URL && GOOGLE_APPS_SCRIPT_URL.trim() !== '' && !GOOGLE_APPS_SCRIPT_URL.includes('YOUR_APPS_SCRIPT_URL_HERE')) {
      submitBtn.disabled = true;
      st.textContent = 'Submitting your RSVP...';

      try {
        const payload = new URLSearchParams();
        payload.append('timestamp', d.timestamp);
        payload.append('name', d.name || '');
        payload.append('count', d.count || '');
        payload.append('attending', d.attending || '');
        payload.append('message', d.message || '');

        await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: payload.toString()
        });

        st.textContent = thanks;
        f.reset();
        beep(784, .2);
      } catch (netErr) {
        console.error('Submission failed:', netErr);
        // Fallback message
        st.textContent = thanks;
        f.reset();
        beep(784, .2);
      } finally {
        submitBtn.disabled = false;
      }
    } else {
      // Demo / Local Mode (Apps Script URL not yet set)
      console.log('RSVP recorded locally:', d);
      console.info('To sync directly to your Google Sheet (https://docs.google.com/spreadsheets/d/1Udd9Bj1yKndK8-7nke1rCDV5dhcqGEhgDpyINjDHQl4/edit?usp=sharing), deploy the code from GoogleAppsScript.gs as a Web App and paste the URL into GOOGLE_APPS_SCRIPT_URL in script.js.');
      st.textContent = thanks;
      f.reset();
      beep(784, .2);
    }
  });

})();
