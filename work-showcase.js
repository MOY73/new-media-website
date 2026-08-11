(function () {
  const root = document.querySelector('.nm-showcase');
  if (!root) return;

  const ui = {
    type: 'food',
    mood: 'minimal',
    palette: 'sand',
    nameTouched: false,
  };

  const brandCopy = {
    ar: {
      defaults: { food: 'نَوَى', beauty: 'لُمى', tech: 'نِبراس', culture: 'مَدى' },
      taglines: {
        food: { minimal: 'صُنع ببساطة.', bold: 'نكهة لا تمرّ.', classic: 'أصل الطعم.', playful: 'مزاجك ألذ.' },
        beauty: { minimal: 'العناية، بوضوح.', bold: 'أظهر حضورك.', classic: 'جمال يدوم.', playful: 'لونك أنت.' },
        tech: { minimal: 'أبسط. أسرع.', bold: 'قد المستقبل.', classic: 'تقنية موثوقة.', playful: 'فكرة تشتغل.' },
        culture: { minimal: 'مساحة للفكرة.', bold: 'صوت يستحق.', classic: 'أثر يبقى.', playful: 'احكِها بطريقتك.' },
      },
      types: { food: 'طعام', beauty: 'جمال', tech: 'تقنية', culture: 'ثقافة' },
    },
    en: {
      defaults: { food: 'NAVA', beauty: 'LUMA', tech: 'NIBRAS', culture: 'MADA' },
      taglines: {
        food: { minimal: 'Made simply.', bold: 'Flavor that stays.', classic: 'Rooted in taste.', playful: 'Make it delicious.' },
        beauty: { minimal: 'Care, clearly.', bold: 'Own your presence.', classic: 'Beauty that lasts.', playful: 'Color it yours.' },
        tech: { minimal: 'Simpler. Faster.', bold: 'Lead what is next.', classic: 'Technology you trust.', playful: 'Ideas that work.' },
        culture: { minimal: 'Space for ideas.', bold: 'A voice worth hearing.', classic: 'Impact that remains.', playful: 'Tell it your way.' },
      },
      types: { food: 'FOOD', beauty: 'BEAUTY', tech: 'TECH', culture: 'CULTURE' },
    },
  };

  const paletteNames = {
    sand: 'SAND / WARM / GROUNDED',
    ember: 'EMBER / VIVID / ENERGETIC',
    ocean: 'OCEAN / CLEAR / TRUSTED',
    neon: 'NEON / BOLD / FUTURE',
  };

  const preview = document.getElementById('brandPreview');
  const nameInput = document.getElementById('brandName');
  const wordmark = document.getElementById('brandWordmark');
  const symbol = document.getElementById('brandSymbol');
  const tagline = document.getElementById('brandTagline');
  const cardName = document.getElementById('labCardName');
  const cardCode = document.getElementById('labCardCode');
  const packName = document.getElementById('labPackName');
  const socialSymbol = document.getElementById('labSocialSymbol');
  const paletteName = document.getElementById('brandPaletteName');

  function language() {
    return document.documentElement.lang === 'en' ? 'en' : 'ar';
  }

  function setLocalizedText() {
    const lang = language();
    root.querySelectorAll('[data-work-ar][data-work-en]').forEach((element) => {
      element.textContent = element.getAttribute(lang === 'en' ? 'data-work-en' : 'data-work-ar');
    });
    if (!ui.nameTouched) nameInput.value = brandCopy[lang].defaults[ui.type];
    renderBrand();
  }

  function cleanName(value) {
    return value.trim().replace(/\s+/g, ' ').slice(0, 18) || brandCopy[language()].defaults[ui.type];
  }

  function renderBrand() {
    if (!preview) return;
    const lang = language();
    const name = cleanName(nameInput.value);
    const firstCharacter = Array.from(name.replace(/\s/g, ''))[0] || 'N';
    preview.dataset.type = ui.type;
    preview.dataset.mood = ui.mood;
    preview.dataset.palette = ui.palette;
    wordmark.textContent = name;
    symbol.textContent = firstCharacter;
    socialSymbol.textContent = firstCharacter;
    cardName.textContent = name;
    packName.textContent = name;
    tagline.textContent = brandCopy[lang].taglines[ui.type][ui.mood];
    cardCode.textContent = `${brandCopy[lang].types[ui.type].toUpperCase()} / 01`;
    paletteName.textContent = paletteNames[ui.palette];
  }

  function choose(selector, key, value) {
    root.querySelectorAll(selector).forEach((button) => button.classList.toggle('is-active', button.dataset[key] === value));
  }

  root.querySelectorAll('[data-brand-type]').forEach((button) => {
    button.addEventListener('click', () => {
      ui.type = button.dataset.brandType;
      choose('[data-brand-type]', 'brandType', ui.type);
      if (!ui.nameTouched) nameInput.value = brandCopy[language()].defaults[ui.type];
      renderBrand();
    });
  });

  root.querySelectorAll('[data-brand-mood]').forEach((button) => {
    button.addEventListener('click', () => {
      ui.mood = button.dataset.brandMood;
      choose('[data-brand-mood]', 'brandMood', ui.mood);
      renderBrand();
    });
  });

  root.querySelectorAll('[data-brand-palette]').forEach((button) => {
    button.addEventListener('click', () => {
      ui.palette = button.dataset.brandPalette;
      choose('[data-brand-palette]', 'brandPalette', ui.palette);
      renderBrand();
    });
  });

  nameInput.addEventListener('input', () => {
    ui.nameTouched = true;
    renderBrand();
  });

  const languageObserver = new MutationObserver((records) => {
    if (records.some((record) => record.attributeName === 'lang' || record.attributeName === 'dir')) setLocalizedText();
  });
  languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });

  const revealTargets = root.querySelectorAll('.nm-archive-heading,.nm-site-case,.nm-content-case,.nm-design-case,.nm-brand-lab');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-work-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealTargets.forEach((element, index) => {
      element.style.setProperty('--work-reveal-delay', `${Math.min(index % 5, 3) * 70}ms`);
      observer.observe(element);
    });
  } else {
    revealTargets.forEach((element) => element.classList.add('is-work-visible'));
  }

  setLocalizedText();
})();
