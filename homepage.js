(function () {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const story = document.querySelector('.nm-story');
  const stage = document.querySelector('.nm-story__stage');
  const frames = Array.from(document.querySelectorAll('.nm-story__frame[data-frame]'));
  const sequenceFrames = frames.filter((frame) => frame.dataset.frame !== 'hands');
  const handsFrame = frames.find((frame) => frame.dataset.frame === 'hands');
  const scenes = Object.fromEntries(Array.from(document.querySelectorAll('[data-scene]')).map((scene) => [scene.dataset.scene, scene]));
  const languageButton = document.getElementById('langBtn');
  const themeButton = document.getElementById('themeBtn');
  const pageProgress = document.getElementById('pageProgress');
  const sceneProgress = document.getElementById('sceneProgress');
  const sceneNumber = document.getElementById('sceneNumber');
  const scrollCue = document.querySelector('.nm-scroll-cue');
  const typedQuote = document.getElementById('typedQuote');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  root.classList.add('nm-story-root');

  const quotes = {
    ar: [
      'نحوّل الفكرة إلى تأثيرٍ قابل للقياس.',
      'نصنع حضوراً يلفت، وتجربةً تُقنع، ونتيجةً تنمو.',
      'من إشارة صغيرة إلى علامةٍ لا تُنسى.',
      'نربط الإبداع بالأداء حتى يصبح الأثر رقماً.'
    ],
    en: [
      'We turn ideas into measurable impact.',
      'We build presence that attracts, experience that convinces, and results that grow.',
      'From a small signal to an unforgettable brand.',
      'We connect creativity to performance until impact becomes a number.'
    ]
  };

  let quoteTimer = 0;
  let quoteCycle = -1;

  function storedLanguage() {
    if (window.NMPreferences) return window.NMPreferences.getLanguage();
    try { return localStorage.getItem('nm-lang') === 'en' ? 'en' : 'ar'; } catch { return 'ar'; }
  }

  function storedTheme() {
    if (window.NMPreferences) return window.NMPreferences.getTheme();
    try { return localStorage.getItem('nm-theme') === 'light' ? 'light' : 'dark'; } catch { return 'dark'; }
  }

  function currentQuoteIndex() {
    return Math.floor(Date.now() / (12 * 60 * 60 * 1000)) % quotes.ar.length;
  }

  function typeQuote(language, restart) {
    const nextCycle = currentQuoteIndex();
    if (!restart && nextCycle === quoteCycle) return;
    quoteCycle = nextCycle;
    window.clearTimeout(quoteTimer);
    const text = quotes[language][nextCycle];
    const characters = Array.from(text);

    if (reducedMotion) {
      typedQuote.textContent = text;
      return;
    }

    typedQuote.textContent = '';
    let index = 0;
    function write() {
      typedQuote.textContent = characters.slice(0, index).join('');
      if (index >= characters.length) return;
      const character = characters[index];
      index += 1;
      const pause = /[،,.]/.test(character) ? 125 : 44 + Math.random() * 34;
      quoteTimer = window.setTimeout(write, pause);
    }
    quoteTimer = window.setTimeout(write, 320);
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
    document.title = value === 'ar' ? 'NEW MEDIA — تأثير قابل للقياس' : 'NEW MEDIA — Measurable Impact';
    typeQuote(value, true);
  }

  function applyTheme(theme) {
    const value = theme === 'light' ? 'light' : 'dark';
    if (window.NMPreferences) window.NMPreferences.setTheme(value);
    else {
      root.classList.toggle('light', value === 'light');
      try { localStorage.setItem('nm-theme', value); } catch {}
    }
    const icon = themeButton.querySelector('span');
    if (icon) icon.textContent = value === 'light' ? '☀' : '☾';
    else themeButton.textContent = value === 'light' ? '☀' : '☾';
    themeButton.setAttribute('aria-label', value === 'light' ? 'تفعيل المظهر الداكن' : 'تفعيل المظهر الفاتح');
  }

  applyLanguage(storedLanguage());
  applyTheme(storedTheme());
  languageButton.addEventListener('click', () => applyLanguage(root.lang === 'en' ? 'ar' : 'en'));
  themeButton.addEventListener('click', () => applyTheme(root.classList.contains('light') ? 'dark' : 'light'));
  window.setInterval(() => typeQuote(root.lang === 'en' ? 'en' : 'ar', false), 60 * 1000);

  const serviceCards = Array.from(document.querySelectorAll('.nm-service-card'));
  const orbitCurrent = document.getElementById('orbitCurrent');
  let activeCard = 0;
  let lastManualCardChange = 0;

  function renderOrbit(nextIndex, manual) {
    activeCard = (nextIndex + serviceCards.length) % serviceCards.length;
    serviceCards.forEach((card, index) => {
      let slot = index - activeCard;
      if (slot > 1) slot -= serviceCards.length;
      if (slot < -2) slot += serviceCards.length;
      card.dataset.slot = String(slot);
      card.setAttribute('aria-current', slot === 0 ? 'true' : 'false');
    });
    orbitCurrent.textContent = String(activeCard + 1).padStart(2, '0');
    if (manual) lastManualCardChange = Date.now();
  }

  serviceCards.forEach((card, index) => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('a') && index === activeCard) return;
      event.preventDefault();
      renderOrbit(index, true);
    });
    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      renderOrbit(index, true);
    });
  });
  document.getElementById('orbitPrev').addEventListener('click', () => renderOrbit(activeCard - 1, true));
  document.getElementById('orbitNext').addEventListener('click', () => renderOrbit(activeCard + 1, true));
  renderOrbit(0, false);

  function clamp(value, min = 0, max = 1) { return Math.max(min, Math.min(max, value)); }
  function smooth(start, end, value) {
    const amount = clamp((value - start) / Math.max(0.0001, end - start));
    return amount * amount * (3 - 2 * amount);
  }
  function fadeRange(value, start, fadeInEnd, fadeOutStart, end) {
    return smooth(start, fadeInEnd, value) * (1 - smooth(fadeOutStart, end, value));
  }

  function paintSequence(position, handsOpacity) {
    const bounded = clamp(position, 0, sequenceFrames.length - 1);
    const first = Math.floor(bounded);
    const next = Math.min(sequenceFrames.length - 1, first + 1);
    const blend = reducedMotion ? 0 : bounded - first;
    sequenceFrames.forEach((frame, index) => {
      let opacity = 0;
      if (index === first) opacity = 1 - blend;
      if (index === next) opacity = Math.max(opacity, blend);
      frame.style.opacity = String(opacity * (1 - handsOpacity));
    });
    handsFrame.style.opacity = String(handsOpacity);
  }

  function showScene(scene, opacity) {
    const value = clamp(opacity);
    scene.style.opacity = String(value);
    scene.style.transform = `translateY(${(1 - value) * 28}px) scale(${0.985 + value * 0.015})`;
    scene.classList.toggle('is-active', value > 0.02);
    scene.style.pointerEvents = value > 0.55 ? 'auto' : 'none';
  }

  let scrollFrame = 0;
  function updateStory() {
    const pageMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const pageValue = clamp(window.scrollY / pageMax);
    pageProgress.style.width = `${pageValue * 100}%`;

    const range = Math.max(1, story.offsetHeight - window.innerHeight);
    const progress = clamp((window.scrollY - story.offsetTop) / range);
    sceneProgress.style.width = `${progress * 100}%`;

    let sequencePosition = 0;
    if (progress >= 0.09 && progress < 0.29) sequencePosition = smooth(0.09, 0.29, progress) * 4;
    else if (progress >= 0.29 && progress < 0.46) sequencePosition = (1 - smooth(0.29, 0.46, progress)) * 4;
    const handsOpacity = smooth(0.585, 0.665, progress);
    paintSequence(sequencePosition, handsOpacity);

    showScene(scenes.quote, progress < 0.13 ? 1 - smooth(0.105, 0.15, progress) : 0);
    const statsOpacity = fadeRange(progress, 0.445, 0.48, 0.575, 0.615);
    showScene(scenes.stats, statsOpacity);
    scenes.stats.classList.toggle('is-visible-cards', progress > 0.475 && progress < 0.605);
    showScene(scenes.services, fadeRange(progress, 0.615, 0.66, 0.775, 0.82));
    showScene(scenes.work, fadeRange(progress, 0.795, 0.835, 0.89, 0.925));
    showScene(scenes.cta, smooth(0.905, 0.95, progress));

    if (progress >= 0.64 && progress <= 0.8 && Date.now() - lastManualCardChange > 1000) {
      const local = clamp((progress - 0.65) / 0.135);
      const desiredCard = Math.min(3, Math.floor(local * 4));
      if (desiredCard !== activeCard) renderOrbit(desiredCard, false);
    }

    let scene = 1;
    if (progress >= 0.09) scene = 2;
    if (progress >= 0.29) scene = 3;
    if (progress >= 0.445) scene = 4;
    if (progress >= 0.615) scene = 5;
    if (progress >= 0.795) scene = 6;
    if (progress >= 0.905) scene = 7;
    sceneNumber.textContent = String(scene).padStart(2, '0');
    scrollCue.style.opacity = String(1 - smooth(0.025, 0.08, progress));
    scrollFrame = 0;
  }

  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(updateStory);
  }, { passive: true });
  window.addEventListener('resize', updateStory, { passive: true });

  function jumpToHash() {
    const points = { '#about': 0.5, '#services': 0.68, '#work': 0.84 };
    if (!points[location.hash]) return;
    const range = Math.max(1, story.offsetHeight - window.innerHeight);
    window.scrollTo({ top: story.offsetTop + range * points[location.hash], behavior: reducedMotion ? 'auto' : 'smooth' });
  }
  window.addEventListener('hashchange', jumpToHash);
  window.setTimeout(jumpToHash, 250);

  if (!reducedMotion && window.matchMedia('(pointer:fine)').matches) {
    stage.addEventListener('pointermove', (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 9;
      const y = (event.clientY / window.innerHeight - 0.5) * 5;
      stage.style.setProperty('--nm-pointer-x', `${x}px`);
      stage.style.setProperty('--nm-pointer-y', `${y}px`);
    }, { passive: true });
    stage.addEventListener('pointerleave', () => {
      stage.style.setProperty('--nm-pointer-x', '0px');
      stage.style.setProperty('--nm-pointer-y', '0px');
    });
  }

  const canvas = document.getElementById('rippleCanvas');
  const context = canvas.getContext('2d');
  const ripples = [];
  let lastRipple = 0;

  function resizeCanvas() {
    const scale = Math.min(1.5, window.devicePixelRatio || 1);
    canvas.width = Math.round(window.innerWidth * scale);
    canvas.height = Math.round(window.innerHeight * scale);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(scale, 0, 0, scale, 0, 0);
  }

  function addRipple(x, y) {
    ripples.push({ x, y, radius: 4, alpha: 0.5, hue: ripples.length % 2 ? 290 : 20 });
    if (ripples.length > 16) ripples.shift();
  }

  function drawRipples() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.globalCompositeOperation = 'screen';
    ripples.forEach((ripple) => {
      ripple.radius += 1.8;
      ripple.alpha *= 0.972;
      context.beginPath();
      context.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      context.strokeStyle = `hsla(${ripple.hue}, 92%, 62%, ${ripple.alpha})`;
      context.lineWidth = 1.2;
      context.stroke();
      context.beginPath();
      context.arc(ripple.x, ripple.y, ripple.radius * 0.64, 0, Math.PI * 2);
      context.strokeStyle = `hsla(${ripple.hue + 18}, 92%, 68%, ${ripple.alpha * 0.45})`;
      context.lineWidth = 0.7;
      context.stroke();
    });
    for (let index = ripples.length - 1; index >= 0; index -= 1) {
      if (ripples[index].alpha < 0.018) ripples.splice(index, 1);
    }
    requestAnimationFrame(drawRipples);
  }

  if (!reducedMotion) {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    stage.addEventListener('pointermove', (event) => {
      if (performance.now() - lastRipple < 62) return;
      lastRipple = performance.now();
      addRipple(event.clientX, event.clientY);
    }, { passive: true });
    requestAnimationFrame(drawRipples);
  }

  updateStory();
  body.classList.add('nm-ready');
})();
