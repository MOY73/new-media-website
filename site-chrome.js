(function () {
  if (/\/(?:index\.html)?$/.test(location.pathname)) return;

  const copy = {
    ar: {
      services: 'خدماتنا', work: 'أعمالنا', about: 'من نحن', contact: 'تواصل معنا',
      desc: 'وكالة تسويق شاملة تصنع حضوراً لا يُنسى — من الاستراتيجية إلى النتائج.',
      divisions: 'أقسامنا', growth: 'النمو والأداء', digital: 'الحضور الرقمي', brand: 'الهوية والتجربة', creative: 'الاستديو الإبداعي',
      policies: 'السياسات', privacy: 'سياسة الخصوصية', terms: 'شروط الخدمة', refund: 'سياسة الاسترداد', confidentiality: 'اتفاقية السرية', cookies: 'ملفات تعريف الارتباط',
      reach: 'تواصل معنا', location: 'جدة، المملكة العربية السعودية', rights: '© جميع الحقوق محفوظة لدى New Media.'
    },
    en: {
      services: 'Services', work: 'Work', about: 'About', contact: 'Contact Us',
      desc: 'A full-service marketing agency creating an unforgettable presence — from strategy to results.',
      divisions: 'Divisions', growth: 'Growth & Performance', digital: 'Digital Presence', brand: 'Brand & Experience', creative: 'Creative Studio',
      policies: 'Policies', privacy: 'Privacy Policy', terms: 'Terms of Service', refund: 'Refund Policy', confidentiality: 'Confidentiality', cookies: 'Cookie Policy',
      reach: 'Contact Us', location: 'Jeddah, Saudi Arabia', rights: '© All rights reserved by New Media.'
    }
  };

  function labels() { return copy[document.documentElement.lang === 'en' ? 'en' : 'ar']; }

  function install() {
    const oldNav = document.querySelector('nav');
    const oldFooter = document.querySelector('footer');
    const themeButton = document.getElementById('themeBtn');
    const languageButton = document.getElementById('langBtn');
    if (!themeButton || !languageButton) return;

    document.body.classList.add('nm-has-shared-chrome');
    if (/404\.html$/.test(location.pathname)) document.body.classList.add('nm-404-page');

    const nav = document.createElement('nav');
    nav.className = 'nm-site-nav';
    nav.setAttribute('aria-label', 'Main navigation');
    nav.innerHTML = `
      <a class="nm-site-nav__brand" href="index.html" aria-label="New Media"><img src="/favicon.svg" alt=""><span>NEW MEDIA</span></a>
      <ul class="nm-site-nav__links"><li><a href="index.html#services" data-nm-label="services"></a></li><li><a href="index.html#work" data-nm-label="work"></a></li><li><a href="index.html#about" data-nm-label="about"></a></li></ul>
      <div class="nm-site-nav__actions"><span data-nm-controls></span><a class="nm-site-nav__cta" href="index.html#contact" data-nm-label="contact"></a></div>`;
    const controls = nav.querySelector('[data-nm-controls]');
    controls.replaceWith(themeButton, languageButton);
    if (oldNav) oldNav.replaceWith(nav);
    else document.body.prepend(nav);

    const footer = document.createElement('footer');
    footer.className = 'nm-site-footer';
    footer.innerHTML = `
      <div class="nm-site-footer__grid">
        <div class="nm-site-footer__about"><div class="nm-site-footer__brand"><img src="/favicon.svg" alt=""><strong>NEW MEDIA</strong></div><p data-nm-label="desc"></p><div class="nm-site-footer__social"><a href="#!" aria-label="X">𝕏</a><a href="#!" aria-label="LinkedIn">in</a><a href="#!" aria-label="Instagram">◎</a></div></div>
        <div><h3 data-nm-label="divisions"></h3><ul><li><a href="growth-performance.html" data-nm-label="growth"></a></li><li><a href="digital-presence.html" data-nm-label="digital"></a></li><li><a href="brand-experience.html" data-nm-label="brand"></a></li><li><a href="creative-production.html" data-nm-label="creative"></a></li></ul></div>
        <div><h3 data-nm-label="policies"></h3><ul><li><a href="privacy-policy.html" data-nm-label="privacy"></a></li><li><a href="terms-of-service.html" data-nm-label="terms"></a></li><li><a href="refund-policy.html" data-nm-label="refund"></a></li><li><a href="confidentiality.html" data-nm-label="confidentiality"></a></li><li><a href="cookie-policy.html" data-nm-label="cookies"></a></li></ul></div>
        <div><h3 data-nm-label="reach"></h3><ul><li><a href="mailto:newmediahc@gmail.com">newmediahc@gmail.com</a></li><li><a href="tel:+966500000000" dir="ltr">+966 50 000 0000</a></li><li data-nm-label="location"></li></ul></div>
      </div>
      <div class="nm-site-footer__bottom"><p data-nm-label="rights"></p><div class="nm-site-footer__legal"><a href="privacy-policy.html">Privacy</a><a href="terms-of-service.html">Terms</a><a href="cookie-policy.html">Cookies</a></div></div>`;
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
    }
    render();
    languageButton.addEventListener('click', () => queueMicrotask(render));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
