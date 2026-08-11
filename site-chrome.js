(function () {
  if (/\/(?:employee-(?:login|dashboard)(?:\.html)?|team\/(?:login|workspace))\/?$/.test(location.pathname)) return;

  const copy = {
    ar: {
      services: 'خدماتنا', work: 'أعمالنا', about: 'من نحن', contact: 'ابدأ مشروعك',
      desc: 'وكالة تسويق شاملة تصنع حضوراً لا يُنسى، من الاستراتيجية إلى النتائج.',
      divisions: 'خدماتنا', digital: 'إدارة الحضور الرقمي', creative: 'المحتوى والإنتاج الإبداعي', brand: 'الهوية والعلامة التجارية', web: 'المواقع والتجارب الرقمية', growth: 'النمو والتسويق الرقمي',
      policies: 'السياسات', privacy: 'سياسة الخصوصية', terms: 'شروط الخدمة', refund: 'سياسة الاسترداد', confidentiality: 'اتفاقية السرية', cookies: 'ملفات تعريف الارتباط', employees: 'للموظفين',
      reach: 'تواصل معنا', location: 'مكة المكرمة، المملكة العربية السعودية', rights: '© جميع الحقوق محفوظة لدى New Media.'
    },
    en: {
      services: 'Services', work: 'Work', about: 'About', contact: 'Start a Project',
      desc: 'A full-service marketing agency creating an unforgettable presence, from strategy to results.',
      divisions: 'Services', digital: 'Digital Presence Management', creative: 'Content & Creative Production', brand: 'Brand Identity', web: 'Websites & Digital Experiences', growth: 'Growth & Digital Marketing',
      policies: 'Policies', privacy: 'Privacy Policy', terms: 'Terms of Service', refund: 'Refund Policy', confidentiality: 'Confidentiality', cookies: 'Cookie Policy', employees: 'Employees',
      reach: 'Contact Us', location: 'Makkah, Saudi Arabia', rights: '© All rights reserved by New Media.'
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
      <ul class="nm-site-nav__links"><li><a href="/index.html#about" data-nm-label="about"></a></li><li><a href="/index.html#services" data-nm-label="services"></a></li><li><a href="/index.html#work" data-nm-label="work"></a></li><li><a href="#policies" data-nm-label="policies"></a></li></ul>
      <div class="nm-site-nav__actions"><span data-nm-controls></span><a class="nm-site-nav__cta" href="/contact-application.html" data-nm-label="contact"></a></div>`;
    const controls = nav.querySelector('[data-nm-controls]');
    controls.replaceWith(themeButton, languageButton);
    if (oldNav) oldNav.replaceWith(nav);
    else document.body.prepend(nav);

    const footer = document.createElement('footer');
    footer.className = 'nm-site-footer';
    footer.id = 'policies';
    footer.innerHTML = `
      <div class="nm-site-footer__grid">
        <div class="nm-site-footer__about"><div class="nm-site-footer__brand"><img src="/favicon.svg" alt=""><strong>NEW MEDIA</strong></div><p data-nm-label="desc"></p><div class="nm-site-footer__social"><a href="https://www.instagram.com/newmedia.hc/" target="_blank" rel="noopener noreferrer" aria-label="Instagram. newmedia.hc" title="@newmedia.hc"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1"></circle></svg></a></div><p class="nm-site-footer__rights" data-nm-label="rights"></p></div>
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
    }
    render();
    languageButton.addEventListener('click', () => queueMicrotask(render));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
