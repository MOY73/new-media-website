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

  const experienceCopy = {
    ar: {
      food: { eyebrow:'مطعم ومخبز', title:'طازج، كما يجب.', body:'قائمة قصيرة بمكونات واضحة وتجربة طلب بلا تعقيد.', cta:'استكشف القائمة', one:'فطور اليوم', two:'مخبوزات', three:'قهوة مختصة', metric:'جاهز خلال 18 دقيقة' },
      beauty: { eyebrow:'علامة عناية', title:'عناية تشبهك.', body:'منتجات واضحة، روتين بسيط، وتفاصيل ترفع الإحساس بالقيمة.', cta:'اكتشف المجموعة', one:'تنظيف', two:'ترطيب', three:'حماية', metric:'روتينك في 3 خطوات' },
      tech: { eyebrow:'منتج تقني', title:'التقنية حين تصبح أبسط.', body:'واجهة تشرح القيمة سريعًا وتحوّل المزايا إلى نتيجة مفهومة.', cta:'جرّب المنتج', one:'نشط الآن', two:'الأتمتة', three:'التكاملات', metric:'99.9% استقرار' },
      culture: { eyebrow:'منصة ثقافية', title:'أفكار تحرّك المشهد.', body:'قراءة واستماع واكتشاف في تجربة تحريرية لها صوت وشخصية.', cta:'اقرأ العدد', one:'قصة الغلاف', two:'صوت', three:'مدينة', metric:'العدد 08 · جديد' },
      hospitality: { eyebrow:'تجربة ضيافة', title:'إقامتك تبدأ قبل الوصول.', body:'حجز هادئ، تفاصيل المكان، وخدمة تجعل الاختيار أسهل.', cta:'احجز إقامتك', one:'جناح هادئ', two:'إطلالة', three:'إفطار', metric:'التقييم 4.9' },
      realestate: { eyebrow:'مشروع عقاري', title:'مكان يرفع قيمة يومك.', body:'وحدات واضحة، مخططات مفهومة، ومسار مباشر لطلب المعاينة.', cta:'استكشف الوحدات', one:'شقة 3 غرف', two:'مخطط الدور', three:'الموقع', metric:'ابتداءً من 780 ألف' },
      education: { eyebrow:'منصة تعليم', title:'مسار واضح لمهارة حقيقية.', body:'دروس مركزة، تطبيق أسبوعي، وتقدم يمكن للمتعلم رؤيته.', cta:'ابدأ المسار', one:'الدرس 08', two:'المشروع', three:'المجتمع', metric:'78% مكتمل' },
      wellness: { eyebrow:'علامة عافية', title:'يوم أخف. توازن أكثر.', body:'جلسات وبرامج يومية مصممة لتناسب الإيقاع الحقيقي للحياة.', cta:'احجز جلستك', one:'تنفّس', two:'حركة', three:'استشفاء', metric:'جلسة اليوم · 6:30' },
      retail: { eyebrow:'متجر إلكتروني', title:'اختيار أسهل. تجربة أسرع.', body:'منتجات مرتبة، قرار شراء واضح، وسلة لا تعطل العميل.', cta:'تسوّق الآن', one:'الأكثر طلبًا', two:'وصل حديثًا', three:'عروض', metric:'توصيل خلال يومين' },
      finance: { eyebrow:'منتج مالي', title:'أرقامك أوضح. قرارك أسرع.', body:'لوحة بسيطة تجمع الحركة والادخار والأهداف في مكان واحد.', cta:'افتح حسابك', one:'الرصيد', two:'الادخار', three:'المصروفات', metric:'+12.8% هذا الشهر' },
    },
    en: {
      food: { eyebrow:'Restaurant & bakery', title:'Fresh, as it should be.', body:'A focused menu, clear ingredients, and ordering without friction.', cta:'Explore the menu', one:'Breakfast', two:'Bakery', three:'Coffee', metric:'Ready in 18 minutes' },
      beauty: { eyebrow:'Care brand', title:'Care that feels like you.', body:'Clear products, a simple routine, and details that elevate value.', cta:'Explore the collection', one:'Cleanse', two:'Hydrate', three:'Protect', metric:'Your routine in 3 steps' },
      tech: { eyebrow:'Technology product', title:'Technology made simpler.', body:'A product experience that turns features into an obvious result.', cta:'Try the product', one:'Live now', two:'Automation', three:'Integrations', metric:'99.9% uptime' },
      culture: { eyebrow:'Culture platform', title:'Ideas moving the scene.', body:'Reading, listening, and discovery through a distinct editorial voice.', cta:'Read the issue', one:'Cover story', two:'Audio', three:'City', metric:'Issue 08 · New' },
      hospitality: { eyebrow:'Hospitality experience', title:'Your stay starts before arrival.', body:'Calm booking, clear spaces, and service that makes choosing easy.', cta:'Book your stay', one:'Quiet suite', two:'View', three:'Breakfast', metric:'Rated 4.9' },
      realestate: { eyebrow:'Real estate project', title:'A place adding value to every day.', body:'Clear units, readable plans, and a direct viewing request.', cta:'Explore units', one:'3-bedroom unit', two:'Floor plan', three:'Location', metric:'From SAR 780K' },
      education: { eyebrow:'Learning platform', title:'A clear path to a real skill.', body:'Focused lessons, weekly practice, and visible progress.', cta:'Start the path', one:'Lesson 08', two:'Project', three:'Community', metric:'78% complete' },
      wellness: { eyebrow:'Wellness brand', title:'A lighter day. Better balance.', body:'Sessions and daily programs designed around real life.', cta:'Book a session', one:'Breathe', two:'Move', three:'Recover', metric:'Today · 6:30 PM' },
      retail: { eyebrow:'Online store', title:'Easier choice. Faster journey.', body:'Organized products, clear decisions, and a cart that never gets in the way.', cta:'Shop now', one:'Popular', two:'New in', three:'Offers', metric:'Delivery in two days' },
      finance: { eyebrow:'Finance product', title:'Clearer numbers. Faster decisions.', body:'One simple view for transactions, savings, and goals.', cta:'Open an account', one:'Balance', two:'Savings', three:'Spending', metric:'+12.8% this month' },
    },
  };

  const preview = document.getElementById('brandPreview');
  const nameInput = document.getElementById('brandName');
  const wordmark = document.getElementById('brandWordmark');
  const symbol = document.getElementById('brandSymbol');
  const tagline = document.getElementById('brandTagline');
  const paletteName = document.getElementById('brandPaletteName');
  const experience = document.getElementById('brandExperience');

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

  function installWorkRotators() {
    const contentImages = [
      '/assets/work/content-product-02.webp',
      '/assets/work/content-space-02.webp',
      '/assets/work/content-campaign-02.webp',
      '/assets/work/content-ugc-02.webp',
      '/assets/work/content-podcast-02.webp',
    ];

    root.querySelectorAll('.nm-content-case').forEach((card, cardIndex) => {
      const original = card.querySelector(':scope > img');
      if (!original) return;
      const carousel = document.createElement('div');
      carousel.className = 'nm-work-rotator nm-content-carousel';
      carousel.dataset.autoRotator = '';
      const ordered = [contentImages[cardIndex], ...contentImages.filter((_, index) => index !== cardIndex)];
      ordered.forEach((source, frameIndex) => {
        const image = document.createElement('img');
        image.className = `nm-rotator-frame${frameIndex === 0 ? ' is-active' : ''}`;
        image.src = source;
        image.alt = frameIndex === 0 ? original.alt : '';
        image.loading = 'lazy';
        image.decoding = 'async';
        image.setAttribute('aria-hidden', frameIndex === 0 ? 'false' : 'true');
        carousel.appendChild(image);
      });
      original.replaceWith(carousel);
    });

    root.querySelectorAll('.nm-design-case').forEach((card, cardIndex) => {
      const original = card.querySelector(':scope > div');
      if (!original) return;
      const carousel = document.createElement('div');
      carousel.className = 'nm-work-rotator nm-design-rotator';
      carousel.dataset.autoRotator = '';
      for (let frameIndex = 0; frameIndex < 5; frameIndex += 1) {
        const frame = original.cloneNode(true);
        frame.classList.add('nm-rotator-frame', `nm-visual-variant--${frameIndex + 1}`);
        frame.classList.toggle('is-active', frameIndex === 0);
        frame.setAttribute('aria-hidden', frameIndex === 0 ? 'false' : 'true');
        carousel.appendChild(frame);
      }
      original.replaceWith(carousel);
      card.style.setProperty('--card-index', cardIndex);
    });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.querySelectorAll('[data-auto-rotator]').forEach((rotator, rotatorIndex) => {
      const frames = Array.from(rotator.querySelectorAll(':scope > .nm-rotator-frame'));
      if (frames.length < 2) return;
      const dots = document.createElement('div');
      dots.className = 'nm-rotator-dots';
      dots.setAttribute('aria-label', language() === 'ar' ? 'اختيار النموذج' : 'Choose example');
      let current = 0;
      let timer = 0;
      let inView = false;
      let paused = false;

      const show = (next) => {
        current = (next + frames.length) % frames.length;
        frames.forEach((frame, index) => {
          const active = index === current;
          frame.classList.toggle('is-active', active);
          frame.setAttribute('aria-hidden', String(!active));
        });
        Array.from(dots.children).forEach((dot, index) => {
          dot.classList.toggle('is-active', index === current);
          dot.setAttribute('aria-pressed', String(index === current));
        });
      };

      frames.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `${index + 1} / ${frames.length}`);
        dot.addEventListener('click', () => show(index));
        dots.appendChild(dot);
      });
      rotator.appendChild(dots);
      show(0);

      const stop = () => { if (timer) window.clearTimeout(timer); timer = 0; };
      const schedule = () => {
        stop();
        if (reduceMotion || !inView || paused) return;
        timer = window.setTimeout(() => { show(current + 1); schedule(); }, 3800 + ((rotatorIndex % 5) * 420));
      };
      rotator.addEventListener('pointerenter', () => { paused = true; stop(); });
      rotator.addEventListener('pointerleave', () => { paused = false; schedule(); });
      rotator.addEventListener('focusin', () => { paused = true; stop(); });
      rotator.addEventListener('focusout', () => { paused = false; schedule(); });

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          schedule();
        }, { threshold: 0.15 });
        observer.observe(rotator);
      } else {
        inView = true;
        schedule();
      }
    });
  }

  function cleanName(value) {
    return value.trim().replace(/\s+/g, ' ').slice(0, 18) || brandCopy[language()].defaults[ui.type];
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[character]));
  }

  function experienceMarkup(type, lang, name) {
    const c = experienceCopy[lang][type];
    const label = escapeHtml(name);
    const copyBlock = `<div class="nm-lab-copy"><small>${c.eyebrow}</small><h5>${c.title}</h5><p>${c.body}</p><span>${c.cta} ↗</span></div>`;
    const chips = `<div class="nm-lab-chips"><i>${c.one}</i><i>${c.two}</i><i>${c.three}</i></div>`;
    if (type === 'food') return `<section class="nm-lab-scene nm-lab-scene--food">${copyBlock}<div class="nm-lab-food-art"><div class="nm-lab-plate"><i></i><i></i><i></i></div><b>${label}</b><small>${c.metric}</small></div>${chips}</section>`;
    if (type === 'beauty') return `<section class="nm-lab-scene nm-lab-scene--beauty">${copyBlock}<div class="nm-lab-beauty-art"><i></i><i></i><b>${label}</b><small>${c.metric}</small></div>${chips}</section>`;
    if (type === 'tech') return `<section class="nm-lab-scene nm-lab-scene--tech">${copyBlock}<div class="nm-lab-tech-panel"><header><span>${label} / LIVE</span><b>${c.metric}</b></header><div><strong>+48%</strong><span class="nm-lab-chart"><i></i><i></i><i></i><i></i><i></i><i></i></span></div><footer>${chips}</footer></div></section>`;
    if (type === 'culture') return `<section class="nm-lab-scene nm-lab-scene--culture"><header><b>${label}</b><span>${c.metric}</span></header><div>${copyBlock}<aside><strong>ح</strong><span>${c.one}<br>${c.two}<br>${c.three}</span></aside></div></section>`;
    if (type === 'hospitality') return `<section class="nm-lab-scene nm-lab-scene--hospitality">${copyBlock}<div class="nm-lab-stay"><header><b>${label}</b><span>${c.metric}</span></header><div class="nm-lab-arch"><i></i></div><footer>${chips}</footer></div></section>`;
    if (type === 'realestate') return `<section class="nm-lab-scene nm-lab-scene--realestate">${copyBlock}<div class="nm-lab-property"><header><b>${c.one}</b><span>${c.metric}</span></header><div class="nm-lab-buildings"><i></i><i></i><i></i><i></i></div><footer><span>${c.two}</span><span>${c.three}</span><b>${label}</b></footer></div></section>`;
    if (type === 'education') return `<section class="nm-lab-scene nm-lab-scene--education">${copyBlock}<div class="nm-lab-course"><header><b>${label}</b><span>${c.metric}</span></header><div><strong>${c.one}</strong><span><i style="width:78%"></i></span><small>${c.two} · ${c.three}</small></div></div></section>`;
    if (type === 'wellness') return `<section class="nm-lab-scene nm-lab-scene--wellness">${copyBlock}<div class="nm-lab-breathe"><div><i></i><i></i><b>4—7—8</b></div><span>${c.metric}</span>${chips}</div></section>`;
    if (type === 'retail') return `<section class="nm-lab-scene nm-lab-scene--retail"><header><b>${label}</b><span>${c.metric}</span></header>${copyBlock}<div class="nm-lab-products"><i><b>01</b><span>${c.one}</span></i><i><b>02</b><span>${c.two}</span></i><i><b>03</b><span>${c.three}</span></i></div></section>`;
    return `<section class="nm-lab-scene nm-lab-scene--finance">${copyBlock}<div class="nm-lab-finance"><header><span>${c.one}</span><b>${c.metric}</b></header><strong>84,250</strong><small>SAR</small><div class="nm-lab-finance-chart"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><footer><span>${c.two}</span><span>${c.three}</span><b>${label}</b></footer></div></section>`;
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
    tagline.textContent = brandCopy[lang].taglines[ui.type][ui.mood] || brandCopy[lang].moodLines[ui.mood];
    if (experience) experience.innerHTML = experienceMarkup(ui.type, lang, name);
    const palette = paletteData[ui.palette];
    preview.style.setProperty('--lab-bg', palette.colors[0]);
    preview.style.setProperty('--lab-ink', palette.colors[1]);
    preview.style.setProperty('--lab-accent', palette.colors[2]);
    paletteName.textContent = palette[lang];
  }

  function choose(selector, key, value) {
    root.querySelectorAll(selector).forEach((button) => {
      const active = button.dataset[key] === value;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
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

  let renderFrame = 0;
  nameInput.addEventListener('input', () => {
    ui.nameTouched = true;
    cancelAnimationFrame(renderFrame);
    renderFrame = requestAnimationFrame(renderBrand);
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

  installWorkRotators();
  choose('[data-brand-type]', 'brandType', ui.type);
  choose('[data-brand-mood]', 'brandMood', ui.mood);
  choose('[data-brand-palette]', 'brandPalette', ui.palette);
  setLocalizedText();
})();
