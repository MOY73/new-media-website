(function () {
  if (/\/(?:employee-(?:login|dashboard)(?:\.html)?|work-demo(?:\.html)?|team\/(?:login|workspace))\/?$/.test(location.pathname)) return;

  const copy = {
    ar: {
      services: 'خدماتنا', work: 'أعمالنا', home: 'الرئيسية', contact: 'ابدأ مشروعك', login: 'تسجيل الدخول', profile: 'حسابي',
      accountLabel: 'حساب العميل', dashboard: 'لوحتي', projects: 'مشاريعي', requests: 'طلباتي', level: 'مستواي والباقات', appearance: 'المظهر', light: 'فاتح', dark: 'داكن', logout: 'تسجيل الخروج',
      desc: 'وكالة تسويق شاملة تصنع حضوراً لا يُنسى، من الاستراتيجية إلى النتائج.',
      divisions: 'خدماتنا', digital: 'إدارة الحضور الرقمي', creative: 'المحتوى والإنتاج الإبداعي', brand: 'الهوية والعلامة التجارية', web: 'المواقع والتجارب الرقمية', growth: 'النمو والتسويق الرقمي',
      policies: 'السياسات', privacy: 'سياسة الخصوصية', terms: 'شروط الخدمة', refund: 'سياسة الاسترداد', confidentiality: 'اتفاقية السرية', cookies: 'ملفات تعريف الارتباط', employees: 'للموظفين',
      reach: 'تواصل معنا', location: 'مكة المكرمة، المملكة العربية السعودية', rights: '© جميع الحقوق محفوظة لدى New Media.'
    },
    en: {
      services: 'Services', work: 'Work', home: 'Home', contact: 'Start a Project', login: 'Log in', profile: 'Profile',
      accountLabel: 'Client account', dashboard: 'My dashboard', projects: 'Projects', requests: 'Requests', level: 'Level & packages', appearance: 'Appearance', light: 'Light', dark: 'Dark', logout: 'Log out',
      desc: 'A full-service marketing agency creating an unforgettable presence, from strategy to results.',
      divisions: 'Services', digital: 'Digital Presence Management', creative: 'Content & Creative Production', brand: 'Brand Identity', web: 'Websites & Digital Experiences', growth: 'Growth & Digital Marketing',
      policies: 'Policies', privacy: 'Privacy Policy', terms: 'Terms of Service', refund: 'Refund Policy', confidentiality: 'Confidentiality', cookies: 'Cookie Policy', employees: 'Employees',
      reach: 'Contact Us', location: 'Makkah, Saudi Arabia', rights: '© All rights reserved by New Media.'
    }
  };

  function labels() { return copy[document.documentElement.lang === 'en' ? 'en' : 'ar']; }

  function install() {
    const oldNav = document.querySelector('nav');
    const oldFooter = document.querySelector('body > footer');
    const themeButton = document.getElementById('themeBtn');
    const languageButton = document.getElementById('langBtn');
    if (!themeButton || !languageButton) return;

    document.body.classList.add('nm-has-shared-chrome');
    if (/404\.html$/.test(location.pathname)) document.body.classList.add('nm-404-page');

    const nav = document.createElement('nav');
    nav.className = 'nm-site-nav';
    nav.setAttribute('aria-label', 'Main navigation');
    nav.innerHTML = `
      <div class="nm-site-nav__identity"><a class="nm-site-nav__brand" href="/" aria-label="New Media"><img src="/newmedia-logo.png" alt=""></a><span data-nm-language></span></div>
      <ul class="nm-site-nav__links"><li><a href="/" data-nm-label="home"></a></li><li><a href="/#services" data-nm-label="services"></a></li><li><a href="/#work" data-nm-label="work"></a></li><li><a href="#policies" data-nm-label="policies"></a></li></ul>
      <div class="nm-site-nav__actions"><div class="nm-account" data-nm-account><a class="nm-account__login" data-nm-login href="/client/login" data-nm-label="login"></a></div><a class="nm-site-nav__cta" href="/client/login?next=%2Fcontact-application.html" data-nm-label="contact"></a></div>`;
    nav.querySelector('[data-nm-language]').replaceWith(languageButton);
    themeButton.remove();
    if (oldNav) oldNav.replaceWith(nav);
    else document.body.prepend(nav);

    const footer = document.createElement('footer');
    footer.className = 'nm-site-footer';
    footer.id = 'policies';
    footer.innerHTML = `
      <div class="nm-site-footer__grid">
        <div class="nm-site-footer__about"><div class="nm-site-footer__brand"><img src="/newmedia-logo.png" alt=""><strong>NEW MEDIA</strong></div><p data-nm-label="desc"></p><div class="nm-site-footer__social"><a href="https://www.instagram.com/newmedia.website/" target="_blank" rel="noopener noreferrer" aria-label="Instagram. newmedia.website" title="Instagram @newmedia.website"><img src="/assets/social/instagram-newmedia.webp" alt=""></a><a href="https://www.tiktok.com/@newmedia.website" target="_blank" rel="noopener noreferrer" aria-label="TikTok. newmedia.website" title="TikTok @newmedia.website"><img src="/assets/social/tiktok-newmedia.webp" alt=""></a><a href="https://x.com/newmediawebsite" target="_blank" rel="noopener noreferrer" aria-label="X. newmediawebsite" title="X @newmediawebsite"><img src="/assets/social/x-newmedia.png" alt=""></a></div><p class="nm-site-footer__rights" data-nm-label="rights"></p></div>
        <div><h3 data-nm-label="divisions"></h3><ul><li><a href="digital-presence.html" data-nm-label="digital"></a></li><li><a href="creative-production.html" data-nm-label="creative"></a></li><li><a href="brand-experience.html" data-nm-label="brand"></a></li><li><a href="web-experience.html" data-nm-label="web"></a></li><li><a href="growth-performance.html" data-nm-label="growth"></a></li></ul></div>
        <div><h3 data-nm-label="policies"></h3><ul><li><a href="privacy-policy.html" data-nm-label="privacy"></a></li><li><a href="terms-of-service.html" data-nm-label="terms"></a></li><li><a href="refund-policy.html" data-nm-label="refund"></a></li><li><a href="confidentiality.html" data-nm-label="confidentiality"></a></li><li><a href="cookie-policy.html" data-nm-label="cookies"></a></li><li><a href="employees.html" data-nm-label="employees"></a></li></ul></div>
        <div><h3 data-nm-label="reach"></h3><ul><li><a href="mailto:newmediahc@gmail.com">newmediahc@gmail.com</a></li><li><a href="https://wa.me/966544006084" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp: +966 54 400 6084" dir="ltr">+966 54 400 6084</a></li><li data-nm-label="location"></li></ul></div>
      </div>`;
    if (oldFooter) oldFooter.replaceWith(footer);
    else {
      document.querySelector('.footer-copy-404')?.remove();
      document.body.appendChild(footer);
    }

    function render() {
      const text = labels();
      document.querySelectorAll('[data-nm-label]').forEach((element) => {
        const key = element.getAttribute('data-nm-label');
        if (text[key]) element.textContent = text[key];
      });
      renderAccountText();
    }
    render();
    languageButton.addEventListener('click', () => queueMicrotask(render));
    installAccount(nav, themeButton, render);
  }

  function safeNextPath() {
    return `${location.pathname}${location.search}${location.hash}`.startsWith('/') ? `${location.pathname}${location.search}${location.hash}` : '/';
  }

  let accountProfile = null;
  function renderAccountText() {
    const menu = document.querySelector('[data-nm-account]');
    if (!menu || !accountProfile) return;
    const text = labels();
    menu.querySelectorAll('[data-account-label]').forEach((node) => {
      const key = node.dataset.accountLabel;
      if (text[key]) node.textContent = text[key];
    });
    const name = accountProfile.display_name || accountProfile.organization || accountProfile.email?.split('@')[0] || text.profile;
    const triggerName = menu.querySelector('[data-account-name]');
    if (triggerName) triggerName.textContent = name.split(/\s+/)[0];
    const fullName = menu.querySelector('[data-account-full-name]');
    if (fullName) fullName.textContent = name;
    const theme = window.NMPreferences?.getTheme?.() || (document.documentElement.classList.contains('light') ? 'light' : 'dark');
    menu.querySelectorAll('[data-theme-choice]').forEach((button) => button.classList.toggle('is-active', button.dataset.themeChoice === theme));
  }

  async function installAccount(nav, oldThemeButton, render) {
    const account = nav.querySelector('[data-nm-account]');
    const login = account.querySelector('[data-nm-login]');
    login.href = `/client/login?next=${encodeURIComponent(safeNextPath())}`;
    try {
      const response = await fetch('/api/client/session', { credentials: 'same-origin', headers: { Accept: 'application/json' } });
      if (!response.ok) return;
      const data = await response.json();
      accountProfile = data.profile;
    } catch { return; }

    const photo = accountProfile.photo_url
      ? `<img src="${String(accountProfile.photo_url).replace(/"/g, '&quot;')}" alt="">`
      : `<span>${(accountProfile.display_name || accountProfile.email || 'NM').trim().charAt(0).toUpperCase()}</span>`;
    account.innerHTML = `
      <button class="nm-account__trigger" type="button" aria-haspopup="menu" aria-expanded="false"><i>${photo}</i><b data-account-name></b><em aria-hidden="true">⌄</em></button>
      <div class="nm-account__menu" role="menu" hidden>
        <div class="nm-account__identity"><i>${photo}</i><div><strong data-account-full-name></strong><span>${accountProfile.email || ''}</span><small data-account-label="accountLabel"></small></div></div>
        <div class="nm-account__links"><a href="/client/portal" role="menuitem"><span>⌂</span><b data-account-label="dashboard"></b></a><a href="/client/portal#projects" role="menuitem"><span>◈</span><b data-account-label="projects"></b></a><a href="/client/portal#requests" role="menuitem"><span>↗</span><b data-account-label="requests"></b></a><a href="/client/portal#explore" role="menuitem"><span>✦</span><b data-account-label="level"></b></a></div>
        <div class="nm-account__theme"><span data-account-label="appearance"></span><div><button type="button" data-theme-choice="light"><i>☀</i><b data-account-label="light"></b></button><button type="button" data-theme-choice="dark"><i>☾</i><b data-account-label="dark"></b></button></div></div>
        <button class="nm-account__logout" type="button" role="menuitem"><span>↪</span><b data-account-label="logout"></b></button>
      </div>`;
    const trigger = account.querySelector('.nm-account__trigger');
    const menu = account.querySelector('.nm-account__menu');
    const close = () => { menu.hidden = true; trigger.setAttribute('aria-expanded', 'false'); account.classList.remove('is-open'); };
    trigger.addEventListener('click', () => {
      const open = menu.hidden;
      menu.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
      account.classList.toggle('is-open', open);
      if (open) renderAccountText();
    });
    document.addEventListener('click', (event) => { if (!account.contains(event.target)) close(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
    account.querySelectorAll('[data-theme-choice]').forEach((button) => button.addEventListener('click', () => {
      window.NMPreferences?.setTheme?.(button.dataset.themeChoice);
      renderAccountText();
    }));
    account.querySelector('.nm-account__logout').addEventListener('click', async () => {
      const button = account.querySelector('.nm-account__logout');
      button.disabled = true;
      try {
        await fetch('/api/client/logout', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: '{}' });
        try {
          const { getFirebaseServices } = await import('/firebase-client.js');
          const firebase = await getFirebaseServices();
          await firebase.authSdk.signOut(firebase.auth);
        } catch { /* The secure site session is already closed. */ }
      } finally { location.replace('/'); }
    });
    oldThemeButton.remove();
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
