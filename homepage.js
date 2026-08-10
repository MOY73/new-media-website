(function () {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  root.classList.add('nm-home-root');
  const hero = document.querySelector('.nm-hero');
  const heroFrames = Array.from(document.querySelectorAll('.nm-hero__figure[data-frame]'));
  const signalStage = document.querySelector('.nm-signal--top b');
  const languageButton = document.getElementById('langBtn');
  const themeButton = document.getElementById('themeBtn');
  const progressBar = document.getElementById('pageProgress');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function storedLanguage() {
    if (window.NMPreferences) return window.NMPreferences.getLanguage();
    try { return localStorage.getItem('nm-lang') === 'en' ? 'en' : 'ar'; } catch { return 'ar'; }
  }

  function storedTheme() {
    if (window.NMPreferences) return window.NMPreferences.getTheme();
    try { return localStorage.getItem('nm-theme') === 'light' ? 'light' : 'dark'; } catch { return 'dark'; }
  }

  function applyLanguage(language) {
    const value = language === 'en' ? 'en' : 'ar';
    const copy = translations[value];

    if (window.NMPreferences) window.NMPreferences.setLanguage(value);
    else {
      root.lang = value;
      root.dir = value === 'ar' ? 'rtl' : 'ltr';
      try { localStorage.setItem('nm-lang', value); } catch {}
    }

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      if (copy[key] !== undefined) element.innerHTML = copy[key];
    });

    languageButton.textContent = value === 'ar' ? 'EN' : 'ع';
    languageButton.setAttribute('aria-label', value === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    document.title = value === 'ar' ? 'NEW MEDIA — نحن نصنع التأثير' : 'NEW MEDIA — We Create Impact';
  }

  function applyTheme(theme) {
    const value = theme === 'light' ? 'light' : 'dark';
    if (window.NMPreferences) window.NMPreferences.setTheme(value);
    else {
      root.classList.toggle('light', value === 'light');
      try { localStorage.setItem('nm-theme', value); } catch {}
    }

    themeButton.querySelector('span').textContent = value === 'light' ? '☀' : '☾';
    themeButton.setAttribute('aria-label', value === 'light' ? 'تفعيل المظهر الداكن' : 'تفعيل المظهر الفاتح');
  }

  applyLanguage(storedLanguage());
  applyTheme(storedTheme());

  languageButton.addEventListener('click', () => {
    applyLanguage(root.lang === 'en' ? 'ar' : 'en');
  });

  themeButton.addEventListener('click', () => {
    applyTheme(root.classList.contains('light') ? 'dark' : 'light');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

  document.querySelectorAll('.nm-reveal').forEach((element, index) => {
    if (element.closest('.nm-hero')) element.style.transitionDelay = `${Math.min(index, 5) * 80}ms`;
    revealObserver.observe(element);
  });

  function animateCounter(element) {
    const target = Number(element.dataset.count || 0);
    const suffix = element.dataset.suffix || '';
    if (reducedMotion) {
      element.textContent = `${target}${suffix}`;
      return;
    }

    const startedAt = performance.now();
    const duration = 1250;
    function frame(now) {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      element.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.55 });

  document.querySelectorAll('[data-count]').forEach((counter) => counterObserver.observe(counter));

  let frameRequested = false;
  function updateScrollState() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, window.scrollY / max);
    progressBar.style.width = `${progress * 100}%`;

    const heroRange = Math.max(1, hero.offsetHeight - window.innerHeight);
    const heroProgress = Math.max(0, Math.min(1, (window.scrollY - hero.offsetTop) / heroRange));
    const framePosition = heroProgress * (heroFrames.length - 1);
    const firstFrame = Math.floor(framePosition);
    const nextFrame = Math.min(heroFrames.length - 1, firstFrame + 1);
    const blend = reducedMotion ? 0 : framePosition - firstFrame;

    heroFrames.forEach((frame, index) => {
      let opacity = 0;
      if (index === firstFrame) opacity = 1 - blend;
      if (index === nextFrame) opacity = Math.max(opacity, blend);
      frame.style.opacity = String(opacity);
    });

    const copyProgress = Math.max(0, Math.min(1, (heroProgress - 0.12) / 0.3));
    hero.style.setProperty('--nm-copy-progress', String(copyProgress));
    hero.style.setProperty('--nm-hero-progress', String(heroProgress));
    if (signalStage) signalStage.textContent = String(Math.min(5, firstFrame + 1)).padStart(2, '0');
    frameRequested = false;
  }

  window.addEventListener('scroll', () => {
    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(updateScrollState);
  }, { passive: true });
  updateScrollState();

  if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 10;
      const y = (event.clientY / window.innerHeight - 0.5) * 6;
      hero.style.setProperty('--nm-pointer-x', `${x}px`);
      hero.style.setProperty('--nm-pointer-y', `${y}px`);
    }, { passive: true });

    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--nm-pointer-x', '0px');
      hero.style.setProperty('--nm-pointer-y', '0px');
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  body.classList.add('nm-ready');
})();
