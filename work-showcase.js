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

  function designFrameMarkup(cardIndex, frameIndex) {
    const identity = [
      ['نَبْت', 'NABT / BOTANICAL', 'ينمو معك.', 'Grows with you.',['عبوة','متجر','قصة'],['PACK','SHOP','STORY']],
      ['مَدى', 'MADA / CULTURE', 'صوتٌ يتّسع.', 'A voice that expands.',['غلاف','منصة','صوت'],['COVER','SITE','AUDIO']],
      ['سُرى', 'SURA / HOSPITALITY', 'دفءٌ يُرى.', 'Warmth you can see.',['ترحيب','حجز','مكان'],['WELCOME','BOOKING','PLACE']],
      ['أثَر', 'ATHAR / ARCHITECTURE', 'مكانٌ يبقى.', 'A place that remains.',['واجهة','مخطط','لوحة'],['FACADE','PLAN','SIGN']],
      ['نَوَاة', 'NAWA / TECHNOLOGY', 'من الفكرة يبدأ.', 'It starts with an idea.',['تطبيق','لوحة','نظام'],['APP','DASH','SYSTEM']],
    ];
    const social = [
      [['رَشْف','RASHF'],['',''],['08:00','08:00'],['',''],['قهوة\nبمزاج','COFFEE\nWITH MOOD'],['',''],['↓','↓'],['',''],['كل يوم','EVERY DAY']],
      [['دَرْب','DARB'],['اكتشف','DISCOVER'],['24°','24°'],['وجهة','DESTINATION'],['',''],['رحلة','JOURNEY'],['03','03'],['',''],['امشِ أبعد','GO FURTHER']],
      [['نُور','NOOR'],['LIVE','LIVE'],['+48%','+48%'],['',''],['تقنية\nأبسط','SIMPLER\nTECH'],['SYNC','SYNC'],['01','01'],['',''],['الآن','NOW']],
      [['بَيْت','BAYT'],['مساحة','SPACE'],['120M²','120M²'],['',''],['حياة\nأهدأ','CALMER\nLIVING'],['',''],['↗','↗'],['تفاصيل','DETAILS'],['ابدأ هنا','START HERE']],
      [['مَشْهَد','MASHHAD'],['08','08'],['اقرأ','READ'],['صوت','AUDIO'],['فكرة\nتتحرك','IDEAS\nIN MOTION'],['',''],['مدينة','CITY'],['',''],['عدد جديد','NEW ISSUE']],
    ];
    const packs = [
      { type:'care', label:['لُمى · عناية','LUMA · CARE'], items:'<i class="nm-pack-object nm-pack-object--carton"><b>LUMA</b></i><i class="nm-pack-object nm-pack-object--bottle"><b>L</b></i><i class="nm-pack-object nm-pack-object--tube"><b>L</b></i>' },
      { type:'coffee', label:['رَشْف · قهوة','RASHF · COFFEE'], items:'<i class="nm-pack-object nm-pack-object--pouch"><b>رشف</b></i><i class="nm-pack-object nm-pack-object--cup"><b>R</b></i><i class="nm-pack-object nm-pack-object--sleeve"><b>◆</b></i>' },
      { type:'drink', label:['مَوْج · مشروب','MAWJ · DRINK'], items:'<i class="nm-pack-object nm-pack-object--can"><b>M</b></i><i class="nm-pack-object nm-pack-object--can nm-pack-object--tall"><b>W</b></i><i class="nm-pack-object nm-pack-object--can"><b>J</b></i>' },
      { type:'rice', label:['سُنْبُل · أرز','SUNBUL · RICE'], items:'<i class="nm-pack-object nm-pack-object--rice"><b>سنبل</b><small>أرز بسمتي</small></i><i class="nm-pack-object nm-pack-object--bowl"><b>•••</b></i><i class="nm-pack-object nm-pack-object--sack"><b>S</b></i>' },
      { type:'fragrance', label:['سُرى · عطر','SURA · FRAGRANCE'], items:'<i class="nm-pack-object nm-pack-object--perfume"><b>س</b></i><i class="nm-pack-object nm-pack-object--fragrance-box"><b>SURA</b></i><i class="nm-pack-object nm-pack-object--cap"><b>✦</b></i>' },
    ];
    const info = [
      { title:['كيف تنمو الفكرة؟','How does an idea grow?'], values:['24%','46%','72%','100%'], steps:[['بحث','Research'],['نموذج','Prototype'],['إطلاق','Launch'],['تحسين','Improve']] },
      { title:['قمع رحلة العميل','The customer journey funnel'], values:['120K','36K','4.8K','860'], steps:[['وصول','Reach'],['اهتمام','Interest'],['طلب','Lead'],['تحويل','Convert']] },
      { title:['من الحبة إلى الكوب','From bean to cup'], values:['1650m','198°','18h','32s'], steps:[['المزرعة','Farm'],['التحميص','Roast'],['الاستخلاص','Brew'],['التقديم','Serve']] },
      { title:['لوحة أداء الحملة','Campaign performance board'], values:['+62%','8.4%','3.1×','74%'], steps:[['الوصول','Reach'],['التفاعل','Engage'],['العائد','Return'],['الولاء','Retain']] },
      { title:['خريطة تجربة المكان','A map of place'], values:['01','07','12','19'], steps:[['الوصول','Arrival'],['الاكتشاف','Discover'],['التجربة','Experience'],['العودة','Return']] },
    ];
    const decks = [
      { label:'MADAR / 2026', ar:['نرى','الصورة','كاملة.'], en:['SEE','THE WHOLE','PICTURE.'], meta:'STRATEGY · PROFILE · PRESENTATION' },
      { label:'SUKUN / PROFILE', ar:['رعاية','تبدأ','بالثقة.'], en:['CARE','STARTS WITH','TRUST.'], meta:'COMPANY · SERVICES · IMPACT' },
      { label:'NIBRAS / PITCH', ar:['قرار','أوضح،','نمو أسرع.'], en:['CLEARER','DECISIONS,','FASTER GROWTH.'], meta:'PRODUCT · MARKET · TRACTION' },
      { label:'MASHHAD / REPORT', ar:['عامٌ','صنع','المشهد.'], en:['A YEAR','THAT SHAPED','THE SCENE.'], meta:'ANNUAL · STORIES · NUMBERS' },
      { label:'ATHAR / PROPOSAL', ar:['فكرة','تستحق','أن تُبنى.'], en:['AN IDEA','WORTH','BUILDING.'], meta:'VISION · SCOPE · ROADMAP' },
    ];

    if (cardIndex === 0) {
      const item = identity[frameIndex];
      return `<b>${item[0]}</b><span>${item[1]}</span><div class="nm-identity-palette"><i></i><i></i><i></i><i></i></div><small data-work-ar="${item[2]}" data-work-en="${item[3]}">${item[2]}</small><section class="nm-identity-apps">${item[4].map((label,index)=>`<i data-work-ar="${label}" data-work-en="${item[5][index]}">${label}</i>`).join('')}</section>`;
    }
    if (cardIndex === 1) {
      return social[frameIndex].map(([ar, en]) => `<i data-work-ar="${ar}" data-work-en="${en}">${ar.replace('\n','<br>')}</i>`).join('');
    }
    if (cardIndex === 2) {
      const item = packs[frameIndex];
      return `<div class="nm-pack-stage-art nm-pack-stage-art--${item.type}">${item.items}<span data-work-ar="${item.label[0]}" data-work-en="${item.label[1]}">${item.label[0]}</span></div>`;
    }
    if (cardIndex === 3) {
      const item = info[frameIndex];
      const kinds = ['steps','funnel','timeline','dashboard','map'];
      return `<header><b data-work-ar="${item.title[0]}" data-work-en="${item.title[1]}">${item.title[0]}</b><span>0${frameIndex + 1} / INFO</span></header><section class="nm-info-scene nm-info-scene--${kinds[frameIndex]}"><ol>${item.steps.map((step, index) => `<li><i>0${index + 1}</i><span data-work-ar="${step[0]}" data-work-en="${step[1]}">${step[0]}</span><b>${item.values[index]}</b></li>`).join('')}</ol><div class="nm-info-accent"><i></i><i></i><i></i><i></i><i></i></div></section>`;
    }
    const item = decks[frameIndex];
    const deckKinds = ['strategy','profile','pitch','report','proposal'];
    return `<section class="nm-deck-layout nm-deck-layout--${deckKinds[frameIndex]}"><header><span>${item.label}</span><small>0${frameIndex + 1} / 05</small></header><div class="nm-deck-copy"><b><span data-work-ar="${item.ar[0]}" data-work-en="${item.en[0]}">${item.ar[0]}</span><br><span data-work-ar="${item.ar[1]}" data-work-en="${item.en[1]}">${item.ar[1]}</span><br><em data-work-ar="${item.ar[2]}" data-work-en="${item.en[2]}">${item.ar[2]}</em></b><p>${item.meta.replaceAll(' · ','<br>')}</p></div><div class="nm-deck-art"><i></i><i></i><i></i><i></i><strong>${['360°','4×','+38%','2026','12W'][frameIndex]}</strong></div></section>`;
  }

  function designFrameMeta(cardIndex, frameIndex) {
    const groups = [
      [
        ['حزمة هوية نباتية','نظام مرن لعلامة طبيعية ينمو عبر كل نقطة اتصال.','Botanical identity system','A flexible natural brand designed to grow across every touchpoint.'],
        ['هوية ثقافية تحريرية','صوت بصري جريء لمنصة ثقافة ومحتوى.','Editorial culture identity','A bold visual voice for a culture and content platform.'],
        ['هوية ضيافة دافئة','تفاصيل هادئة تصنع إحساس المكان قبل الوصول.','Warm hospitality identity','Calm details that make the place felt before arrival.'],
        ['نظام علامة معمارية','هندسة واضحة للهوية والمطبوعات والواجهات.','Architectural brand system','A precise identity spanning print, signage, and space.'],
        ['هوية منتج تقني','علامة رقمية سريعة وواضحة وقابلة للتوسع.','Technology product identity','A clear, scalable identity built for a digital product.'],
      ],
      [
        ['شبكة مقهى يومية','تسعة منشورات تعمل معًا كقصة واحدة.','Daily café social grid','Nine posts working together as one daily story.'],
        ['سلسلة سفر واكتشاف','محتوى وجهات يحوّل الرحلة إلى حلقات مترابطة.','Travel discovery series','Destination content structured as a connected journey.'],
        ['محتوى منتج تقني','نظام يشرح المزايا والأرقام بلغة بصرية سريعة.','Technology content system','A fast visual system for product benefits and metrics.'],
        ['حملة مشروع سكني','منشورات تجمع المساحة والتفاصيل ودعوة المعاينة.','Residential campaign system','A social campaign connecting spaces, details, and visits.'],
        ['نظام مجلة ثقافية','أغلفة واقتباسات وصوت تحريري متجدد.','Culture magazine system','Covers, quotes, and a living editorial voice.'],
      ],
      [
        ['تغليف منتجات العناية','عائلة عبوات هادئة توحّد الرف والتجربة.','Care product packaging','A calm packaging family unifying shelf and experience.'],
        ['تجربة قهوة متكاملة','كيس وكوب وملحقات تحمل شخصية واحدة.','Complete coffee packaging','A pouch, cup, and accessories sharing one personality.'],
        ['هوية مشروبات جاهزة','مجموعة علب واضحة وسهلة التمييز.','Ready-to-drink packaging','A distinctive, easy-to-navigate can family.'],
        ['تغليف أرز ومواد غذائية','حل عملي يوازن الوضوح مع حضور الرف.','Food and rice packaging','A practical system balancing clarity and shelf presence.'],
        ['تغليف عطر فاخر','عبوة وصندوق وتفاصيل تجعل الفتح طقسًا.','Luxury fragrance packaging','A bottle and box designed as an opening ritual.'],
      ],
      [
        ['مخطط مراحل النمو','خطوات متتابعة تحوّل العملية إلى مسار مفهوم.','Growth process infographic','A clear sequence turning process into an understandable path.'],
        ['قمع رحلة العميل','مراحل قرار العميل في مشهد يتدرج نحو التحويل.','Customer journey funnel','A funnel showing the path from attention to conversion.'],
        ['خط زمني من الحبة للكوب','قصة إنتاج تُقرأ رأسيًا من المصدر إلى التجربة.','Bean-to-cup timeline','A vertical production story from source to experience.'],
        ['لوحة أداء الحملة','مؤشرات ودوائر ونسب تختصر قراءة النتائج.','Campaign performance board','Metrics, rings, and signals that summarize performance.'],
        ['خريطة تجربة المكان','مسار ونقاط توقف تحول المكان إلى رحلة بصرية.','Experience map infographic','A mapped journey connecting movement and memorable stops.'],
      ],
      [
        ['ملف استراتيجي شامل','رؤية واتجاه وأولويات في عرض تنفيذي واضح.','Strategic company deck','Vision, direction, and priorities in a decisive executive deck.'],
        ['ملف شركة رعاية','قصة ثقة وخدمات وأثر بتكوين هادئ وإنساني.','Care company profile','Trust, services, and impact in a calm human profile.'],
        ['عرض استثماري تقني','سوق ومنتج ونمو في شرائح مبنية على البيانات.','Technology investor pitch','Market, product, and growth in a data-led pitch.'],
        ['تقرير سنوي تحريري','أرقام وقصص العام في تجربة تشبه المجلة.','Editorial annual report','A year of numbers and stories designed like a magazine.'],
        ['عرض مشروع وتنفيذ','نطاق وزمن ومراحل تسهّل اتخاذ القرار.','Project proposal deck','Scope, timing, and milestones that make decisions easier.'],
      ],
    ];
    return groups[cardIndex][frameIndex];
  }

  function installWorkRotators() {
    const contentStories = [
      [
        ['product-02','01 / PRODUCT','سُرى · عطر فاخر','ضوء نحتي يقدّم العطر كقطعة تُقتنى.','Sura · Fine fragrance','Sculptural light presenting fragrance as a collectible.','لقطة عطر فاخر بإضاءة تحريرية'],
        ['product-03','02 / BEAUTY','لُمى · سيروم عناية','ملمس نقي وتفاصيل دقيقة تشرح خفة المنتج.','Luma · Care serum','Clean texture and precise detail communicating lightness.','تصوير سيروم عناية بالبشرة'],
        ['product-04','03 / FOOD','شَهْد · عسل موسمي','ضوء دافئ يحوّل المكوّن الطبيعي إلى قصة مذاق.','Shahd · Seasonal honey','Warm light turning a natural ingredient into a taste story.','تصوير منتج عسل طبيعي'],
        ['product-05','04 / TECH','نبراس · منتج تقني','مشهد ليلي جريء يوضّح الشكل والوظيفة والحضور.','Nibras · Technology product','A bold night scene clarifying form, function, and presence.','تصوير منتج تقني ذكي'],
        ['product-06','05 / PANTRY','نَبْت · منتج طبيعي','تكوين هادئ للعبوة يربط المنتج بمصدره الطبيعي.','Nabt · Natural product','A calm pack shot connecting the product to its natural source.','تصوير عبوة منتج طبيعي'],
      ],
      [
        ['space-02','01 / HOSPITALITY','رِواق · ضيافة هادئة','مدخل معماري يجعل الوصول أول لحظة في التجربة.','Riwaq · Calm hospitality','An architectural entrance making arrival part of the experience.','تصوير مدخل منشأة ضيافة'],
        ['space-03','02 / DINING','مَجلِس · مطعم معاصر','الإضاءة والخامة تحكيان طابع المكان قبل قائمة الطعام.','Majlis · Contemporary dining','Light and material tell the place story before the menu.','تصوير داخلي لمطعم معاصر'],
        ['space-04','03 / HOTEL','وِجهة · فندق حضري','خطوط وزوايا حادة تمنح الفندق حضورًا سينمائيًا.','W وجهة · Urban hotel','Strong lines and angles give the hotel a cinematic presence.','تصوير بهو فندق حضري'],
        ['space-05','04 / WELLNESS','سُكون · مساحة عافية','ضوء طبيعي وتفاصيل صامتة تشرح معنى الراحة.','Sukun · Wellness space','Natural light and quiet detail communicate rest.','تصوير مساحة عافية هادئة'],
        ['space-06','05 / RESIDENCE','أثَر · سكن صحراوي','الواجهة والمنظر يربطان العمارة بطبيعة الموقع.','Athar · Desert residence','Facade and landscape tie the architecture to its setting.','تصوير مشروع سكني صحراوي'],
      ],
      [
        ['campaign-02','01 / LAUNCH','مِدار · حملة إطلاق','مجسم بصري جريء يصنع أصلًا رئيسيًا لحملة متعددة القنوات.','Madar · Launch campaign','A bold visual object built as the hero asset for many channels.','حملة إطلاق بصرية جريئة'],
        ['campaign-03','02 / IMPACT','مُكعّب · لحظة توقف','تصادم الماء واللون يحوّل ثانية واحدة إلى صورة لا تُنسى.','Mukab · Stop moment','Water and color turn one second into a memorable key visual.','حملة منتج بمشهد ماء جريء'],
        ['campaign-04','03 / BEAUTY','لُمى · طاقة اللون','تكوين لوني حاد يربط العبوة بالحركة والحيوية.','Luma · Color energy','A sharp color world connecting packaging with motion and energy.','حملة جمالية لمنتج ملون'],
        ['campaign-05','04 / PLACE','بَوّابة · حملة وجهة','هندسة ورسالة مباشرة تفتحان فضول الجمهور نحو المكان.','Bawaba · Destination campaign','Geometry and direct messaging build curiosity around a place.','حملة تجارية لوجهة معمارية'],
        ['campaign-06','05 / CULTURE','نَبْض · حملة ثقافية','عالم تجريدي مرن يعمل كملصق وحركة وافتتاحية.','Nabd · Culture campaign','A flexible abstract world working across posters, motion, and openers.','حملة ثقافية تجريدية'],
      ],
      [
        ['ugc-02','01 / STORY','مذاق البيت · قصة يومية','لقطة قريبة وبسيطة تجعل المنتج جزءًا من روتين حقيقي.','At home · Daily story','A close, simple setup placing the product in a real routine.','إنتاج محتوى منزلي لمنتج ضيافة'],
        ['ugc-03','02 / REVIEW','لُمى · تجربة عناية','مراجعة عملية توضّح القوام والاستخدام والنتيجة بلا تكلّف.','Luma · Care review','A practical review showing texture, use, and result naturally.','إنتاج مراجعة منتج عناية'],
        ['ugc-04','03 / FOOD','من المطبخ · وصفة قصيرة','تصوير علوي سريع يحوّل الوصفة إلى خطوات قابلة للحفظ.','From the kitchen · Short recipe','Fast overhead coverage turns a recipe into saveable steps.','تصوير وصفة طعام قصيرة'],
        ['ugc-05','04 / TECH','جرّبته · مراجعة تقنية','لقطات A-roll وB-roll تشرح الجهاز في أقل من دقيقة.','Tested · Tech review','A-roll and B-roll explain the device in under a minute.','تصوير مراجعة تقنية بالجوال'],
        ['ugc-06','05 / HOME','تفاصيل · استخدام واقعي','محتوى هادئ يبيّن المنتج داخل بيئته بدل عرضه منفصلًا.','Details · Real use','Quiet content showing a product in context rather than isolation.','إنتاج محتوى واقعي لمنتج منزلي'],
      ],
      [
        ['podcast-02','01 / PODCAST','بين سطرين · حوار عميق','مشهد مظلم وصوت قريب لحلقة تضع الفكرة أولًا.','Between Lines · Deep conversation','An intimate dark set putting the idea first.','استوديو بودكاست حواري'],
        ['podcast-03','02 / INTERVIEW','دائرة · مقابلة خبراء','تكوين نهاري نظيف يناسب الحوارات المهنية المصوّرة.','Daira · Expert interview','A clean daylight set for filmed professional interviews.','إنتاج مقابلة خبراء'],
        ['podcast-04','03 / DOCUMENTARY','صوت المكان · تسجيل ميداني','إضاءة درامية ولقطات B-roll تبني حكاية تتجاوز الطاولة.','Voice of Place · Field story','Dramatic light and B-roll build a story beyond the table.','إنتاج بودكاست وثائقي'],
        ['podcast-05','04 / ROUNDTABLE','المجلس · نقاش جماعي','توزيع صوت وصورة يترك مساحة متساوية لكل ضيف.','The Majlis · Roundtable','Audio and framing give every guest equal room.','تصوير نقاش جماعي'],
        ['podcast-06','05 / POST','غرفة الصوت · مونتاج الحلقة','مونتاج وصناعة هوية صوتية ونسخ قصيرة للنشر.','Sound Room · Episode post','Editing, sonic identity, and short cutdowns for publishing.','مونتاج ومعالجة بودكاست'],
      ],
    ];

    root.querySelectorAll('.nm-content-case').forEach((card, cardIndex) => {
      const original = card.querySelector(':scope > img');
      if (!original) return;
      const carousel = document.createElement('div');
      carousel.className = 'nm-work-rotator nm-content-carousel';
      carousel.dataset.autoRotator = '';
      contentStories[cardIndex].forEach((story, frameIndex) => {
        const image = document.createElement('img');
        image.className = `nm-rotator-frame${frameIndex === 0 ? ' is-active' : ''}`;
        image.src = `/assets/work/content-${story[0]}.webp`;
        image.alt = story[6];
        image.loading = 'lazy';
        image.decoding = 'async';
        image.setAttribute('aria-hidden', frameIndex === 0 ? 'false' : 'true');
        image.dataset.metaLabel = story[1];
        image.dataset.metaArTitle = story[2];
        image.dataset.metaArDescription = story[3];
        image.dataset.metaEnTitle = story[4];
        image.dataset.metaEnDescription = story[5];
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
        const meta = designFrameMeta(cardIndex, frameIndex);
        frame.innerHTML = designFrameMarkup(cardIndex, frameIndex);
        frame.classList.add('nm-rotator-frame', `nm-visual-variant--${frameIndex + 1}`);
        frame.classList.toggle('is-active', frameIndex === 0);
        frame.setAttribute('aria-hidden', frameIndex === 0 ? 'false' : 'true');
        frame.dataset.metaArTitle = meta[0];
        frame.dataset.metaArDescription = meta[1];
        frame.dataset.metaEnTitle = meta[2];
        frame.dataset.metaEnDescription = meta[3];
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
        if (rotator.classList.contains('nm-design-rotator')) {
          const card = rotator.closest('.nm-design-case');
          const activeFrame = frames[current];
          const title = card?.querySelector(':scope > footer h4');
          const description = card?.querySelector(':scope > footer p');
          const number = card?.querySelector(':scope > footer > span');
          if (title && description && activeFrame) {
            title.dataset.workAr = activeFrame.dataset.metaArTitle;
            title.dataset.workEn = activeFrame.dataset.metaEnTitle;
            description.dataset.workAr = activeFrame.dataset.metaArDescription;
            description.dataset.workEn = activeFrame.dataset.metaEnDescription;
            title.textContent = language() === 'en' ? activeFrame.dataset.metaEnTitle : activeFrame.dataset.metaArTitle;
            description.textContent = language() === 'en' ? activeFrame.dataset.metaEnDescription : activeFrame.dataset.metaArDescription;
          }
          if (number) number.textContent = `0${current + 1} / 05`;
        }
        if (rotator.classList.contains('nm-content-carousel')) {
          const card = rotator.closest('.nm-content-case');
          const activeFrame = frames[current];
          const meta = card?.lastElementChild;
          const label = meta?.querySelector(':scope > span');
          const title = meta?.querySelector(':scope > h4');
          const description = meta?.querySelector(':scope > p');
          if (label) label.textContent = activeFrame.dataset.metaLabel || `0${current + 1}`;
          if (title && description) {
            title.dataset.workAr = activeFrame.dataset.metaArTitle;
            title.dataset.workEn = activeFrame.dataset.metaEnTitle;
            description.dataset.workAr = activeFrame.dataset.metaArDescription;
            description.dataset.workEn = activeFrame.dataset.metaEnDescription;
            title.textContent = language() === 'en' ? activeFrame.dataset.metaEnTitle : activeFrame.dataset.metaArTitle;
            description.textContent = language() === 'en' ? activeFrame.dataset.metaEnDescription : activeFrame.dataset.metaArDescription;
          }
        }
      };

      frames.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `${index + 1} / ${frames.length}`);
        dot.addEventListener('click', () => show(index));
        dots.appendChild(dot);
      });
      rotator.appendChild(dots);
      const arrows = document.createElement('div');
      arrows.className = 'nm-rotator-arrows';
      const previous = document.createElement('button');
      previous.type = 'button';
      previous.textContent = '‹';
      previous.setAttribute('aria-label', language() === 'ar' ? 'النموذج السابق' : 'Previous example');
      previous.addEventListener('click', (event) => { event.stopPropagation(); show(current - 1); schedule(); });
      const next = document.createElement('button');
      next.type = 'button';
      next.textContent = '›';
      next.setAttribute('aria-label', language() === 'ar' ? 'النموذج التالي' : 'Next example');
      next.addEventListener('click', (event) => { event.stopPropagation(); show(current + 1); schedule(); });
      arrows.append(previous, next);
      rotator.appendChild(arrows);
      rotator.tabIndex = 0;
      rotator.setAttribute('role', 'group');
      rotator.addEventListener('click', (event) => {
        if (event.target.closest('button')) return;
        show(current + 1);
        schedule();
      });
      rotator.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        show(current + (event.key === 'ArrowRight' ? 1 : -1));
        schedule();
      });
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
