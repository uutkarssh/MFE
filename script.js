/* =====================================================
   MODERN FOOD EXPRESS — script.js  v4  (fully audited)
   All getElementById calls are null-safe (?.)
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* PAGE LOADER */
  const ldr = document.getElementById('ldr');
  if (ldr) setTimeout(() => ldr.classList.add('out'), 1650);

  /* NAVBAR SCROLL */
  const navEl = document.getElementById('nav');
  const onScroll = () => navEl?.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ACTIVE NAV LINK */
  const pg = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === pg || (pg === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* HAMBURGER MENU */
  const hbg   = document.getElementById('hbg');
  const mobNv = document.getElementById('mobNav');
  const mobOv = document.getElementById('mobOv');

  function closeMenu() {
    hbg?.classList.remove('open');
    mobNv?.classList.remove('open');
    mobOv?.classList.remove('open');
    hbg?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hbg?.addEventListener('click', () => {
    const opening = !mobNv?.classList.contains('open');
    hbg.classList.toggle('open');
    mobNv?.classList.toggle('open');
    mobOv?.classList.toggle('open');
    hbg.setAttribute('aria-expanded', String(opening));
    document.body.style.overflow = opening ? 'hidden' : '';
  });

  mobOv?.addEventListener('click', closeMenu);
  mobNv?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* IMAGE SLIDER (only runs if slTrack exists — index.html only) */
  const track    = document.getElementById('slTrack');
  const dotsWrap = document.getElementById('slDots');
  const prog     = document.getElementById('slProg');
  const slides   = track ? Array.from(track.querySelectorAll('.slide')) : [];
  let cur = 0, slTimer = null;

  if (slides.length && dotsWrap) {
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'sl-dot' + (i === 0 ? ' on' : '');
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      d.addEventListener('click', () => { goTo(i); resetTimer(); });
      dotsWrap.appendChild(d);
    });
  }

  function goTo(n) {
    cur = ((n % slides.length) + slides.length) % slides.length;
    if (track) track.style.transform = 'translateX(-' + (cur * 100) + '%)';
    dotsWrap?.querySelectorAll('.sl-dot').forEach((d, i) => d.classList.toggle('on', i === cur));
    if (prog) { prog.style.animation = 'none'; void prog.offsetHeight; prog.style.animation = ''; }
  }

  function resetTimer() {
    if (slTimer) clearInterval(slTimer);
    if (slides.length) slTimer = setInterval(() => goTo(cur + 1), 5000);
  }

  if (slides.length) {
    resetTimer();
    document.getElementById('slNext')?.addEventListener('click', () => { goTo(cur + 1); resetTimer(); });
    document.getElementById('slPrev')?.addEventListener('click', () => { goTo(cur - 1); resetTimer(); });

    const sliderWrap = track?.closest('.slider-wrap');
    sliderWrap?.addEventListener('mouseenter', () => { if (slTimer) clearInterval(slTimer); });
    sliderWrap?.addEventListener('mouseleave', resetTimer);

    let touchStartX = 0;
    track?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track?.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 45) { dx < 0 ? goTo(cur + 1) : goTo(cur - 1); resetTimer(); }
    });
  }

  /* SCROLL-FADE ANIMATIONS */
  const fadeEls = document.querySelectorAll('.fade');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
    fadeEls.forEach(el => io.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('vis'));
  }

  /* MENU TABS (menu.html only) */
  document.querySelectorAll('.mf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mf-btn').forEach(b => b.classList.remove('on'));
      document.querySelectorAll('.menu-sec').forEach(s => s.classList.remove('on'));
      btn.classList.add('on');
      const sec = document.getElementById(btn.dataset.tab);
      if (sec) sec.classList.add('on');
    });
  });

  /* GALLERY LIGHTBOX (gallery.html only) */
  const lb    = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  let lbSrcs = [], lbIdx = 0;

  function lbOpen(srcs, idx) {
    lbSrcs = srcs;
    lbIdx  = idx;
    if (lbImg) lbImg.src = srcs[idx];
    lb?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function lbClose() {
    lb?.classList.remove('open');
    document.body.style.overflow = '';
  }
  function lbGo(dir) {
    lbIdx = ((lbIdx + dir) + lbSrcs.length) % lbSrcs.length;
    if (lbImg) lbImg.src = lbSrcs[lbIdx];
  }

  document.getElementById('lbClose')?.addEventListener('click', lbClose);
  document.getElementById('lbPrev')?.addEventListener('click', () => lbGo(-1));
  document.getElementById('lbNext')?.addEventListener('click', () => lbGo(1));
  lb?.addEventListener('click', e => { if (e.target === lb) lbClose(); });

  document.addEventListener('keydown', e => {
    if (!lb?.classList.contains('open')) return;
    if (e.key === 'Escape')     lbClose();
    if (e.key === 'ArrowLeft')  lbGo(-1);
    if (e.key === 'ArrowRight') lbGo(1);
  });

  const galItems = document.querySelectorAll('.gal-item');
  if (galItems.length) {
    const srcs = Array.from(galItems).map(el => el.querySelector('img')?.src).filter(Boolean);
    galItems.forEach((item, i) => item.addEventListener('click', () => lbOpen(srcs, i)));
  }

  /* FORMS (reservation.html and contact.html) */
  ['form-res', 'form-contact'].forEach(id => {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn  = form.querySelector('.btn-submit');
      const orig = btn ? btn.textContent : '';
      if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
      setTimeout(() => {
        if (btn) { btn.textContent = orig; btn.disabled = false; }
        const msg = form.querySelector('.success-msg');
        if (msg) { msg.classList.add('show'); setTimeout(() => msg.classList.remove('show'), 5000); }
        form.reset();
      }, 1400);
    });
  });

  /* ADD TO CART FLASH */
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const origBg = btn.style.background;
      btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
      const svg = btn.querySelector('svg');
      if (svg) svg.style.stroke = '#fff';
      setTimeout(() => {
        btn.style.background = origBg;
        if (svg) svg.style.stroke = '';
      }, 1000);
    });
  });

  /* RATING BARS ANIMATE (reviews.html) */
  const rbarFills = document.querySelectorAll('.rbar-fill');
  if (rbarFills.length && 'IntersectionObserver' in window) {
    const rIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.width = bar.dataset.width || '0%';
          rIO.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });
    rbarFills.forEach(b => rIO.observe(b));
  }

  /* STAT COUNTERS */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = +el.dataset.count;
        const suffix = el.dataset.suffix || '';
        let val = 0;
        const step  = target / 60;
        const delay = target > 999 ? 14 : 30;
        const t = setInterval(() => {
          val += step;
          el.textContent = Math.floor(Math.min(val, target)) + suffix;
          if (val >= target) clearInterval(t);
        }, delay);
        cIO.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(el => cIO.observe(el));
  }

});
