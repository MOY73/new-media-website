(function () {
  const root = document.getElementById('demoRoot');
  const back = document.getElementById('demoBack');
  const note = document.getElementById('demoNote');
  const rights = document.getElementById('demoRights');
  const markLabel = document.getElementById('demoMarkLabel');
  const languageButton = document.getElementById('langBtn');
  const themeButton = document.getElementById('themeBtn');
  if (!root || !languageButton || !themeButton) return;

  const requested = new URLSearchParams(location.search).get('project') || 'atlas';
  const project = ['atlas', 'sukun', 'mashhad', 'midad', 'nibras'].includes(requested) ? requested : 'atlas';

  const shared = {
    ar: { back: 'العودة للأعمال', note: 'هذا نموذج تصوري من NEW MEDIA — جميع العلامات المعروضة افتراضية.', rights: '© جميع الحقوق محفوظة لدى New Media.', lang: 'EN', title: 'نموذج عمل' },
    en: { back: 'Back to work', note: 'A concept by NEW MEDIA — all featured brands are fictional.', rights: '© All rights reserved by New Media.', lang: 'AR', title: 'Work concept' },
  };

  const copy = {
    atlas: {
      ar: { name:'أطلس للاستشارات', nav:['خبرتنا','قطاعاتنا','منهجنا'], eyebrow:'استراتيجية / تحوّل / نمو', title:'وضوح يصنع', outline:'الزخم.', body:'نساعد القيادات على رؤية الصورة كاملة، واتخاذ القرارات التي تحوّل التعقيد إلى فرصة قابلة للنمو.', cta:'ابدأ حوارًا', ticker:'STRATEGY  •  GROWTH  •  TRANSFORMATION  •  RESEARCH  •  ', services:[['01','استراتيجية النمو','نحوّل الطموح إلى مسار واضح، بأولويات قابلة للتنفيذ والقياس.'],['02','تصميم التحوّل','نبني نموذج العمل والعمليات التي تجعل التغيير حقيقة يومية.'],['03','ذكاء السوق','بحث نوعي وبيانات تكشف أين توجد الفرصة التالية.']], impact:'أثر يُرى في القرار.', metrics:[['+42%','تسارع في التنفيذ'],['18','سوقًا جديدًا'],['3.4×','عائد التحوّل'],['91%','وضوح الأولويات']], close:'المستقبل يحتاج قرارًا واضحًا.' },
      en: { name:'Atlas Consulting', nav:['Expertise','Sectors','Method'], eyebrow:'Strategy / Transformation / Growth', title:'Clarity builds', outline:'momentum.', body:'We help leaders see the whole picture and make decisions that turn complexity into scalable opportunity.', cta:'Start a conversation', ticker:'STRATEGY  •  GROWTH  •  TRANSFORMATION  •  RESEARCH  •  ', services:[['01','Growth strategy','We turn ambition into a clear route with executable, measurable priorities.'],['02','Transformation design','We build the operating models that make change part of every day.'],['03','Market intelligence','Qualitative research and data uncover where the next opportunity lives.']], impact:'Impact you can see in the decision.', metrics:[['+42%','Faster execution'],['18','New markets'],['3.4×','Transformation return'],['91%','Priority clarity']], close:'The future needs a clear decision.' },
    },
    sukun: {
      ar:{ name:'سُكون', links:['الرعاية','المختصون','الزيارة الأولى'], cta:'احجز موعدك', eyebrow:'رعاية نفسية أقرب لك', title:'موعدك، بهدوء.', body:'مساحة آمنة، مختصون موثوقون، وتجربة حجز مصممة لتجعل الخطوة الأولى أسهل.', visual:'جلسات حضورية وعن بُعد · خصوصية كاملة', services:[['✦','جلسات فردية','مساحة خاصة لفهم ما تمر به وبناء أدوات تناسبك.'],['◌','إرشاد أسري','حوار أكثر هدوءًا وتفاهمًا داخل الأسرة.'],['♡','عناية بالعمل','دعم نفسي للفرق وبيئات العمل الصحية.']], booking:'اختر بداية تناسب يومك.', bookingBody:'نموذج مبسط للحجز — اختر اليوم ثم الوقت المتاح.', days:['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'], times:['10:00','12:30','16:00','18:30'], close:'الخطوة الأولى ليست كبيرة. لكنها مهمة.' },
      en:{ name:'Sukun', links:['Care','Specialists','First visit'], cta:'Book a session', eyebrow:'Mental care, closer to you', title:'Your appointment, calmly.', body:'A safe space, trusted specialists, and a booking experience designed to make the first step easier.', visual:'In-person and online · Complete privacy', services:[['✦','Individual care','A private space to understand what you are going through and build tools that fit.'],['◌','Family guidance','Calmer conversations and stronger understanding at home.'],['♡','Workplace care','Mental wellbeing support for teams and healthy workplaces.']], booking:'Choose a start that fits your day.', bookingBody:'A simplified booking demo — choose a day and an available time.', days:['Sunday','Monday','Tuesday','Wednesday','Thursday'], times:['10:00','12:30','16:00','18:30'], close:'The first step is not big. It is important.' },
    },
    mashhad: {
      ar:{ name:'مَشْهَد', issue:'العدد 07 / صيف 2026', city:'جدة، السعودية', eyebrow:'ثقافة · تصميم · مدينة', title:'الثقافة وهي', outline:'تتحرك.', body:'نلتقط الأفكار والأماكن والأصوات التي تغيّر علاقتنا بالمدينة.', feature:'اقرأ القصة الرئيسية', news:[['01 / مكان','المدينة التي تتعلم المشي من جديد','قراءة في المساحات العامة وكيف تصنع يومًا مختلفًا.'],['02 / شخص','صانع يرفض أن تكون الحرفة ذكرى','داخل استوديو يعيد تعريف المادة والوقت.'],['03 / فكرة','لماذا نحتاج البطء؟','مقال بصري عن الإيقاع والإبداع والانتباه.']], quote:'ليس كل ما يحرّك المدينة يُرى. بعضه يبدأ بفكرة.', cta:'استكشف العدد' },
      en:{ name:'MASHHAD', issue:'ISSUE 07 / SUMMER 2026', city:'JEDDAH, SAUDI ARABIA', eyebrow:'Culture · Design · City', title:'Culture in', outline:'motion.', body:'We capture the ideas, places, and voices changing how we relate to the city.', feature:'Read the cover story', news:[['01 / PLACE','The city learning to walk again','A reading of public space and how it can reshape an ordinary day.'],['02 / PERSON','A maker refusing to let craft become memory','Inside a studio redefining material and time.'],['03 / IDEA','Why do we need slowness?','A visual essay on rhythm, creativity, and attention.']], quote:'Not everything moving a city can be seen. Some of it begins as an idea.', cta:'Explore the issue' },
    },
    midad: {
      ar:{ name:'مِداد', links:['المسارات','المجتمع','العضوية'], cta:'ابدأ التعلّم', eyebrow:'منصة عملية لصنّاع المستقبل', title:'تعلّم يصنع', outline:'فرقًا.', body:'مسارات قصيرة، تطبيق حقيقي، ومجتمع يساعدك على تحويل المعرفة إلى مهارة تعيش معك.', orbit:['فكرة','مهارة','تطبيق'], orbitCenter:'تعلّم', section:'اختر مسارك التالي.', courses:[['01 / 6 أسابيع','بناء العلامات','من الفكرة إلى نظام بصري ورسالة واضحة.'],['02 / 4 أسابيع','صناعة المحتوى','قصة، تصوير، تحرير، ونشر بذكاء.'],['03 / 8 أسابيع','إطلاق مشروع رقمي','ابنِ النسخة الأولى واختبرها في السوق.']], path:'كيف تسير الرحلة؟', steps:[['01','شاهد','دروس مركزة بلا حشو'],['02','طبّق','مشروع حقيقي كل أسبوع'],['03','شارك','مراجعة من المجتمع'],['04','تقدّم','ملف أعمال قابل للعرض']] },
      en:{ name:'MIDAD', links:['Paths','Community','Membership'], cta:'Start learning', eyebrow:'A practical platform for future makers', title:'Learning that', outline:'changes things.', body:'Short paths, real application, and a community that helps turn knowledge into a skill you keep.', orbit:['Idea','Skill','Practice'], orbitCenter:'Learn', section:'Choose your next path.', courses:[['01 / 6 WEEKS','Brand building','From an idea to a visual system and a clear message.'],['02 / 4 WEEKS','Content craft','Story, production, editing, and smarter publishing.'],['03 / 8 WEEKS','Launch a digital product','Build your first version and test it in market.']], path:'How does the journey work?', steps:[['01','Watch','Focused lessons without filler'],['02','Practice','A real project every week'],['03','Share','Feedback from the community'],['04','Progress','A portfolio ready to show']] },
    },
    nibras: {
      ar:{ name:'NIBRAS', links:['المنتج','الحلول','الأسعار'], cta:'جرّب نبراس', eyebrow:'GROWTH INTELLIGENCE / LIVE', title:'اعرف ماذا يصنع', outline:'النمو.', body:'منصة تجمع بيانات التسويق والمبيعات في صورة واحدة، وتحوّل الأرقام إلى قرارات واضحة.', chart:'نمو الإيراد', list:['الاكتساب','التحويل','الاحتفاظ'], metrics:[['+38.4%','نمو هذا الربع'],['2.8×','عائد الإنفاق'],['14.2K','عميل نشط'],['6.4h','وقت موفّر أسبوعيًا']], close:'من البيانات إلى القرار، في لحظة.', score:'صحة النمو' },
      en:{ name:'NIBRAS', links:['Product','Solutions','Pricing'], cta:'Try Nibras', eyebrow:'GROWTH INTELLIGENCE / LIVE', title:'Know what drives', outline:'growth.', body:'A platform that brings marketing and sales data into one view, turning numbers into clear decisions.', chart:'Revenue growth', list:['Acquisition','Conversion','Retention'], metrics:[['+38.4%','Growth this quarter'],['2.8×','Return on spend'],['14.2K','Active customers'],['6.4h','Saved every week']], close:'From data to decision, in a moment.', score:'Growth health' },
    },
  };

  const esc = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[character]));
  const pills = (items) => items.map((item) => `<span>${esc(item)}</span>`).join('');

  function atlas(c, dir) {
    const services = c.services.map((item) => `<article><span>${item[0]}</span><h2>${item[1]}</h2><p>${item[2]}</p></article>`).join('');
    const metrics = c.metrics.map((item) => `<article><b>${item[0]}</b><span>${item[1]}</span></article>`).join('');
    return `<article class="nm-demo-site demo-atlas" dir="${dir}"><div class="atlas-shell"><header class="atlas-nav"><b>ATLAS®</b><div>${pills(c.nav)}</div></header><section class="atlas-hero"><div><p class="demo-kicker">${c.eyebrow}</p><h1>${c.title}<em>${c.outline}</em></h1></div><aside><p>${c.body}</p><a class="demo-pill" href="#atlasServices">${c.cta}</a></aside></section></div><div class="atlas-ticker"><span>${c.ticker.repeat(8)}</span></div><div class="atlas-shell"><section class="atlas-services" id="atlasServices">${services}</section><section class="atlas-impact"><h2>${c.impact}</h2><div>${metrics}</div></section><section class="atlas-close"><span>${c.close}</span><a href="#atlasServices">↗</a></section></div></article>`;
  }

  function sukun(c, dir) {
    const services = c.services.map((item) => `<article><i>${item[0]}</i><h2>${item[1]}</h2><p>${item[2]}</p></article>`).join('');
    const days = c.days.map((item, index) => `<button type="button" class="${index === 1 ? 'is-active' : ''}">${item}</button>`).join('');
    return `<article class="nm-demo-site demo-sukun" dir="${dir}"><div class="sukun-shell"><header class="sukun-nav"><b>${c.name}</b><div>${pills(c.links)}<a class="demo-pill" href="#booking">${c.cta}</a></div></header><section class="sukun-hero"><div class="sukun-hero__copy"><p class="demo-kicker">${c.eyebrow}</p><h1>${c.title}</h1><p>${c.body}</p></div><div class="sukun-hero__visual"><span>${c.visual}</span></div></section><section class="sukun-strip">${services}</section><section class="sukun-booking" id="booking"><div><h2>${c.booking}</h2><p>${c.bookingBody}</p></div><div><div class="sukun-days">${days}</div><div class="sukun-times">${pills(c.times)}</div></div></section><section class="sukun-close"><h2>${c.close}</h2><a class="demo-pill" href="#booking">${c.cta}</a></section></div></article>`;
  }

  function mashhad(c, dir) {
    const news = c.news.map((item) => `<article><span>${item[0]}</span><h2>${item[1]}</h2><p>${item[2]}</p></article>`).join('');
    return `<article class="nm-demo-site demo-mashhad" dir="${dir}"><div class="mashhad-shell"><header class="mashhad-nav"><span>${c.issue}</span><b>${c.name}</b><span>${c.city}</span></header><section class="mashhad-lead"><div class="mashhad-lead__copy"><div><p class="demo-kicker">${c.eyebrow}</p><h1>${c.title}<br>${c.outline}</h1></div><div><p>${c.body}</p><a class="demo-pill" href="#stories">${c.feature}</a></div></div><div class="mashhad-lead__art"></div></section><section class="mashhad-news" id="stories">${news}</section><section class="mashhad-quote"><blockquote>${c.quote}</blockquote><a class="demo-pill" href="#stories">${c.cta}</a></section></div></article>`;
  }

  function midad(c, dir) {
    const courses = c.courses.map((item) => `<article><span>${item[0]}</span><h3>${item[1]}</h3><p>${item[2]}</p></article>`).join('');
    const steps = c.steps.map((item) => `<li><span>${item[0]}</span><b>${item[1]}</b><span>${item[2]}</span></li>`).join('');
    return `<article class="nm-demo-site demo-midad" dir="${dir}"><div class="midad-shell"><header class="midad-nav"><b>${c.name}</b><div>${pills(c.links)}<a class="demo-pill" href="#courses">${c.cta}</a></div></header><section class="midad-hero"><div><p class="demo-kicker">${c.eyebrow}</p><h1>${c.title}<br>${c.outline}</h1><p>${c.body}</p></div><div class="midad-orbit"><b>${c.orbitCenter}</b>${pills(c.orbit)}</div></section><section class="midad-courses" id="courses"><h2>${c.section}</h2><div class="midad-course-grid">${courses}</div></section><section class="midad-path"><h2>${c.path}</h2><ol>${steps}</ol></section></div></article>`;
  }

  function nibras(c, dir) {
    const bars = '<i></i>'.repeat(6);
    const list = c.list.map((item, index) => `<span><b>${item}</b><i>${[82,64,91][index]}%</i></span>`).join('');
    const metrics = c.metrics.map((item) => `<article><b>${item[0]}</b><span>${item[1]}</span></article>`).join('');
    return `<article class="nm-demo-site demo-nibras" dir="${dir}"><div class="nibras-shell"><header class="nibras-nav"><b>${c.name}</b><div>${pills(c.links)}<a class="demo-pill" href="#metrics">${c.cta}</a></div></header><section class="nibras-hero"><div><p class="demo-kicker">${c.eyebrow}</p><h1>${c.title}<br><em>${c.outline}</em></h1><p>${c.body}</p><a class="demo-pill" href="#metrics">${c.cta}</a></div><div class="nibras-dashboard"><div class="nibras-dashboard__top"><span>OVERVIEW / LIVE</span><span>•••</span></div><div class="nibras-dashboard__grid"><div class="nibras-chart"><span>${c.chart}</span><b>+38.4%</b><small>↑ 12.8%</small><div class="nibras-bars">${bars}</div></div><div><div class="nibras-score"><span>${c.score}</span><b>86</b></div><div class="nibras-list">${list}</div></div></div></div></section><section class="nibras-metrics" id="metrics">${metrics}</section><section class="nibras-close"><h2>${c.close}</h2><a class="demo-pill" href="#metrics">${c.cta}</a></section></div></article>`;
  }

  const renderers = { atlas, sukun, mashhad, midad, nibras };

  function language() { return document.documentElement.lang === 'en' ? 'en' : 'ar'; }
  function render() {
    const lang = language();
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    const c = copy[project][lang];
    root.innerHTML = renderers[project](c, dir);
    document.body.dataset.project = project;
    document.title = `${c.name} | ${shared[lang].title}`;
    back.textContent = shared[lang].back;
    note.textContent = shared[lang].note;
    rights.textContent = shared[lang].rights;
    if (markLabel) markLabel.textContent = lang === 'ar' ? 'نموذج أعمال' : 'WORK SHOWCASE';
    languageButton.textContent = shared[lang].lang;
    themeButton.setAttribute('aria-label', lang === 'ar' ? 'تبديل المظهر' : 'Toggle theme');
    root.querySelectorAll('.sukun-days button').forEach((button) => button.addEventListener('click', () => {
      root.querySelectorAll('.sukun-days button').forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
    }));
  }

  languageButton.addEventListener('click', () => {
    const next = language() === 'ar' ? 'en' : 'ar';
    if (window.NMPreferences) window.NMPreferences.setLanguage(next);
    else {
      document.documentElement.lang = next;
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    }
    render();
  });

  themeButton.addEventListener('click', () => {
    const next = document.documentElement.classList.contains('light') ? 'dark' : 'light';
    if (window.NMPreferences) window.NMPreferences.setTheme(next);
    else document.documentElement.classList.toggle('light', next === 'light');
  });

  render();
})();
