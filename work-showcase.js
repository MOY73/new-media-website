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
      defaults: { food: 'نَوَى', beauty: 'لُمى', tech: 'نِبراس', culture: 'مَدى', hospitality: 'رِواق', realestate: 'مَدار', education: 'مِداد', wellness: 'سُكون', retail: 'وَاحة', finance: 'مِيزان' },
      taglines: {
        food: { minimal: 'صُنع ببساطة.', bold: 'نكهة لا تمرّ.', classic: 'أصل الطعم.', playful: 'مزاجك ألذ.' },
        beauty: { minimal: 'العناية، بوضوح.', bold: 'أظهر حضورك.', classic: 'جمال يدوم.', playful: 'لونك أنت.' },
        tech: { minimal: 'أبسط. أسرع.', bold: 'قد المستقبل.', classic: 'تقنية موثوقة.', playful: 'فكرة تشتغل.' },
        culture: { minimal: 'مساحة للفكرة.', bold: 'صوت يستحق.', classic: 'أثر يبقى.', playful: 'احكِها بطريقتك.' },
        hospitality: { minimal: 'هدوء يبدأ من هنا.', bold: 'ضيافة لا تُنسى.', classic: 'كرم له أصل.', playful: 'مكانك الأجمل.' },
        realestate: { minimal: 'مكان بمعنى.', bold: 'نبني قيمة.', classic: 'جذور للمستقبل.', playful: 'هنا تبدأ الحكاية.' },
        education: { minimal: 'نتعلّم لنصنع.', bold: 'المعرفة تحرّك.', classic: 'علم يبقى.', playful: 'اكتشف أكثر.' },
        wellness: { minimal: 'عافية ببساطة.', bold: 'قوتك تبدأ الآن.', classic: 'توازن يدوم.', playful: 'خفّ عليك.' },
        retail: { minimal: 'اختيار أوضح.', bold: 'حضور على الرف.', classic: 'قيمة تُقتنى.', playful: 'شيء تحبه.' },
        finance: { minimal: 'مالك بوضوح.', bold: 'قرارات أقوى.', classic: 'ثقة تتراكم.', playful: 'احسبها صح.' },
      },
      moodLines: { luxury: 'تفاصيل ترفع القيمة.', organic: 'ينمو بطبيعته.', editorial: 'قصة تستحق أن تُروى.' },
      types: { food: 'طعام', beauty: 'جمال', tech: 'تقنية', culture: 'ثقافة', hospitality: 'ضيافة', realestate: 'عقار', education: 'تعليم', wellness: 'عافية', retail: 'تجزئة', finance: 'مال' },
    },
    en: {
      defaults: { food: 'NAVA', beauty: 'LUMA', tech: 'NIBRAS', culture: 'MADA', hospitality: 'RIWAQ', realestate: 'MADAR', education: 'MIDAD', wellness: 'SUKUN', retail: 'WAHA', finance: 'MIZAN' },
      taglines: {
        food: { minimal: 'Made simply.', bold: 'Flavor that stays.', classic: 'Rooted in taste.', playful: 'Make it delicious.' },
        beauty: { minimal: 'Care, clearly.', bold: 'Own your presence.', classic: 'Beauty that lasts.', playful: 'Color it yours.' },
        tech: { minimal: 'Simpler. Faster.', bold: 'Lead what is next.', classic: 'Technology you trust.', playful: 'Ideas that work.' },
        culture: { minimal: 'Space for ideas.', bold: 'A voice worth hearing.', classic: 'Impact that remains.', playful: 'Tell it your way.' },
        hospitality: { minimal: 'Calm starts here.', bold: 'A stay to remember.', classic: 'Hospitality with roots.', playful: 'Your favorite place.' },
        realestate: { minimal: 'Places with meaning.', bold: 'Build more value.', classic: 'Roots for tomorrow.', playful: 'Your story starts here.' },
        education: { minimal: 'Learn to create.', bold: 'Knowledge moves.', classic: 'Learning that lasts.', playful: 'Discover more.' },
        wellness: { minimal: 'Wellness, simply.', bold: 'Your strength starts now.', classic: 'Balance that lasts.', playful: 'Feel lighter.' },
        retail: { minimal: 'A clearer choice.', bold: 'Own the shelf.', classic: 'Value worth choosing.', playful: 'Something to love.' },
        finance: { minimal: 'Money, clearly.', bold: 'Make stronger decisions.', classic: 'Trust that compounds.', playful: 'Make it count.' },
      },
      moodLines: { luxury: 'Details that elevate value.', organic: 'Made to grow naturally.', editorial: 'A story worth telling.' },
      types: { food: 'FOOD', beauty: 'BEAUTY', tech: 'TECH', culture: 'CULTURE', hospitality: 'HOSPITALITY', realestate: 'REAL ESTATE', education: 'EDUCATION', wellness: 'WELLNESS', retail: 'RETAIL', finance: 'FINANCE' },
    },
  };

  const paletteData = {
    sand: { colors: ['#e5d2b8', '#20221d', '#d96a3b'], ar: 'رملي / دافئ / راسخ', en: 'SAND / WARM / GROUNDED' },
    ember: { colors: ['#2a0b12', '#fff0df', '#ff4d28'], ar: 'جمري / حيوي / طاقي', en: 'EMBER / VIVID / ENERGETIC' },
    ocean: { colors: ['#071e34', '#e5fff9', '#25a5c4'], ar: 'محيطي / صافي / موثوق', en: 'OCEAN / CLEAR / TRUSTED' },
    neon: { colors: ['#17101e', '#efffd1', '#b8ff34'], ar: 'نيون / جريء / مستقبلي', en: 'NEON / BOLD / FUTURE' },
    olive: { colors: ['#a9b66d', '#23271b', '#e7dec5'], ar: 'زيتوني / طبيعي / هادئ', en: 'OLIVE / NATURAL / CALM' },
    desert: { colors: ['#f1d6a8', '#3b2417', '#c77b45'], ar: 'صحراوي / أصيل / دافئ', en: 'DESERT / ROOTED / WARM' },
    midnight: { colors: ['#080d1d', '#d7ddff', '#4e6cff'], ar: 'ليلي / تقني / عميق', en: 'MIDNIGHT / TECH / DEEP' },
    coral: { colors: ['#ffd2c9', '#34201f', '#ff7668'], ar: 'مرجاني / ودود / مشرق', en: 'CORAL / FRIENDLY / BRIGHT' },
    lavender: { colors: ['#ebe1ff', '#241c37', '#9c79dc'], ar: 'لافندر / ناعم / راقٍ', en: 'LAVENDER / SOFT / REFINED' },
    mono: { colors: ['#f4f4f0', '#111111', '#777777'], ar: 'أحادي / واضح / خالد', en: 'MONO / CLEAR / TIMELESS' },
    jade: { colors: ['#062a25', '#d8f2de', '#30b98a'], ar: 'يشمي / مزدهر / متزن', en: 'JADE / FRESH / BALANCED' },
    cobalt: { colors: ['#061b5c', '#ffffff', '#ffce35'], ar: 'كوبالت / قوي / مباشر', en: 'COBALT / STRONG / DIRECT' },
    terracotta: { colors: ['#f1c6a8', '#47251c', '#bd5c3e'], ar: 'تيراكوتا / حرفي / دافئ', en: 'TERRACOTTA / CRAFT / WARM' },
    rosewood: { colors: ['#3b101e', '#f1c3ca', '#a83355'], ar: 'خشب وردي / فاخر / عميق', en: 'ROSEWOOD / LUXE / DEEP' },
    ice: { colors: ['#eefbfc', '#12313a', '#9edce6'], ar: 'جليدي / نقي / هادئ', en: 'ICE / PURE / CALM' },
    mustard: { colors: ['#f6e7a4', '#2d2715', '#d5a624'], ar: 'خردلي / مرح / دافئ', en: 'MUSTARD / PLAYFUL / WARM' },
    forest: { colors: ['#10251c', '#c7d9be', '#3f7554'], ar: 'غابة / ثابت / عضوي', en: 'FOREST / GROUNDED / ORGANIC' },
    plum: { colors: ['#2b142b', '#efcae7', '#893d80'], ar: 'برقوقي / إبداعي / غني', en: 'PLUM / CREATIVE / RICH' },
    sky: { colors: ['#e1f3fc', '#143047', '#58a9da'], ar: 'سماوي / مفتوح / مطمئن', en: 'SKY / OPEN / TRUSTED' },
    coffee: { colors: ['#ead8c6', '#261b16', '#9b6848'], ar: 'قهوة / دافئ / مألوف', en: 'COFFEE / WARM / FAMILIAR' },
  };

  const typeImages = {
    food: '/assets/work/campaign-wamda.webp', beauty: '/assets/work/product-perfume.jpg', tech: '/assets/work/ugc-studio.webp', culture: '/assets/work/podcast-studio.webp', hospitality: '/assets/work/architecture.jpg', realestate: '/assets/work/architecture.jpg', education: '/assets/work/ugc-studio.webp', wellness: '/assets/work/product-perfume.jpg', retail: '/assets/work/campaign-wamda.webp', finance: '/assets/work/architecture.jpg',
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
  const patternSymbol = document.getElementById('labPatternSymbol');
  const industryName = document.getElementById('labIndustryName');

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
    if (patternSymbol) patternSymbol.textContent = firstCharacter;
    cardName.textContent = name;
    packName.textContent = name;
    tagline.textContent = brandCopy[lang].taglines[ui.type][ui.mood] || brandCopy[lang].moodLines[ui.mood];
    cardCode.textContent = `${brandCopy[lang].types[ui.type].toUpperCase()} / 01`;
    if (industryName) industryName.textContent = brandCopy[lang].types[ui.type];
    const palette = paletteData[ui.palette];
    preview.style.setProperty('--lab-bg', palette.colors[0]);
    preview.style.setProperty('--lab-ink', palette.colors[1]);
    preview.style.setProperty('--lab-accent', palette.colors[2]);
    preview.style.setProperty('--lab-image', `url("${typeImages[ui.type]}")`);
    paletteName.textContent = palette[lang];
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
