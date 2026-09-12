/* ============================================
   Honda & Salma - Wedding Invitation JS
   ============================================ */

(function () {
    'use strict';

    const WEDDING_DATE = new Date('2026-12-05T19:00:00').getTime();
    // Adjust to your local timezone if needed.

/* ---------- Card Open ---------- */

const envelope = document.getElementById('envelope');
const invitation = document.getElementById('invitation');

function openEnvelope() {

    if (!envelope) return;

    // Prevent clicking twice
    if (envelope.classList.contains('opened')) return;

    // Open the physical card
    envelope.classList.add('opened');

    // Allow page scrolling
    document.body.classList.remove('no-scroll');

    // Start music
    startMusic();

   // Go directly to the main invitation
envelope.classList.add('hidden');

if (invitation) {
    invitation.classList.remove('hidden');
}

observeFadeIns();

window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'instant'
});
}


/* Click anywhere on the card */

if (envelope) {

    envelope.addEventListener('click', openEnvelope);

    envelope.addEventListener(
        'touchend',
        openEnvelope,
        { passive: true }
    );

    document.body.classList.add('no-scroll');
}
    /* ---------- Countdown ---------- */
    const dEl = document.getElementById('days');
    const hEl = document.getElementById('hours');
    const mEl = document.getElementById('minutes');
    const sEl = document.getElementById('seconds');

    function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }

    function tick() {
        const diff = WEDDING_DATE - Date.now();
        if (diff <= 0) {
            if (dEl) dEl.textContent = '00';
            if (hEl) hEl.textContent = '00';
            if (mEl) mEl.textContent = '00';
            if (sEl) sEl.textContent = '00';
            return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);
        if (dEl) dEl.textContent = pad(days);
        if (hEl) hEl.textContent = pad(hours);
        if (mEl) mEl.textContent = pad(mins);
        if (sEl) sEl.textContent = pad(secs);
    }

    tick();
    setInterval(tick, 1000);

    /* ---------- Background Music ---------- */
    const musicBtn = document.getElementById('musicToggle');
    const bgAudio = document.getElementById('bgMusic');
    let playing = false;

    function startMusic() {
        if (!bgAudio || playing) return;
        const playPromise = bgAudio.play();
        if (playPromise && playPromise.then) {
            playPromise.then(() => {
                playing = true;
                if (musicBtn) musicBtn.classList.add('playing');
            }).catch(() => {
                // Autoplay blocked — user can toggle manually
                if (musicBtn) musicBtn.classList.remove('playing');
            });
        }
    }

    if (musicBtn && bgAudio) {
        musicBtn.addEventListener('click', () => {
            if (playing) {
                bgAudio.pause();
                playing = false;
                musicBtn.classList.remove('playing');
                musicBtn.querySelector('.music-icon').textContent = '♪';
            } else {
                bgAudio.play().then(() => {
                    playing = true;
                    musicBtn.classList.add('playing');
                    musicBtn.querySelector('.music-icon').textContent = '♫';
                }).catch(() => {
                    alert('تعذّر تشغيل الموسيقى');
                });
            }
        });
    }

    /* ---------- Scroll Fade-in ---------- */
    function observeFadeIns() {
        const targets = document.querySelectorAll(
            '.section-title, .time-box, .story-card, .event-card, .gallery-item, .quote, .rsvp-form, .footer-names'
        );
        targets.forEach(el => el.classList.add('fade-in'));

        if (!('IntersectionObserver' in window)) {
            targets.forEach(el => el.classList.add('visible'));
            return;
        }

        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        targets.forEach(el => obs.observe(el));
    }

    /* ---------- RSVP Form ---------- */
    const rsvpForm = document.getElementById('rsvpForm');
    const formStatus = document.getElementById('formStatus');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = new FormData(rsvpForm);
            const name = data.get('name');
            const attending = data.get('attending');

            const message =
                attending === 'yes'
                    ? `شكراً ${name}، تم تأكيد حضوركم بنجاح. نتطلع لرؤيتكم!`
                    : `شكراً ${name} على ردّكم. نتمنى لو كنا معاً.`;

            if (formStatus) {
                formStatus.textContent = message;
                formStatus.style.color = attending === 'yes' ? '#b8862d' : '#8a6419';
            }
            rsvpForm.reset();
        });
    }

    /* ---------- Smooth-scroll hint after opening ---------- */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !envelope.classList.contains('opened')) {
            openEnvelope();
        }
    });

})();
