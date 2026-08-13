(function () {
  const mount = document.getElementById('workArchiveMount');
  if (!mount) return;

  function language() {
    return document.documentElement.lang === 'en' ? 'en' : 'ar';
  }

  const copy = {
    ar: {
      title: 'NEW MEDIA | أعمالنا',
      loading: 'نجهّز معرض الأعمال…',
      error: 'تعذّر فتح المعرض الآن.',
      retry: 'حاول مرة أخرى',
    },
    en: {
      title: 'NEW MEDIA | Our Work',
      loading: 'Preparing the work archive…',
      error: 'The archive could not be opened right now.',
      retry: 'Try again',
    },
  };

  function localizeShell() {
    const text = copy[language()];
    document.title = text.title;
    const loading = mount.querySelector('[data-archive-loading]');
    if (loading) loading.textContent = text.loading;
  }

  function installControls() {
    const languageButton = document.getElementById('langBtn');
    const themeButton = document.getElementById('themeBtn');
    if (languageButton && !languageButton.dataset.archiveReady) {
      languageButton.dataset.archiveReady = 'true';
      languageButton.addEventListener('click', () => {
        const next = language() === 'en' ? 'ar' : 'en';
        if (window.NMPreferences) window.NMPreferences.setLanguage(next);
        else {
          document.documentElement.lang = next;
          document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
        }
        languageButton.textContent = next === 'ar' ? 'EN' : 'ع';
        localizeShell();
      });
    }
    if (themeButton && !themeButton.dataset.archiveReady) {
      themeButton.dataset.archiveReady = 'true';
      themeButton.addEventListener('click', () => {
        const next = document.documentElement.classList.contains('light') ? 'dark' : 'light';
        if (window.NMPreferences) window.NMPreferences.setTheme(next);
        else document.documentElement.classList.toggle('light', next === 'light');
        const icon = themeButton.querySelector('span');
        if (icon) icon.textContent = next === 'light' ? '☀' : '☾';
      });
    }
    if (languageButton) languageButton.textContent = language() === 'ar' ? 'EN' : 'ع';
    const themeIcon = themeButton?.querySelector('span');
    if (themeIcon) themeIcon.textContent = document.documentElement.classList.contains('light') ? '☀' : '☾';
  }

  function loadShowcaseScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/work-showcase.js?v=9';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  async function installArchive() {
    try {
      const response = await fetch('/index.html', { credentials: 'same-origin' });
      if (!response.ok) throw new Error(`Homepage request failed: ${response.status}`);

      const source = await response.text();
      const documentCopy = new DOMParser().parseFromString(source, 'text/html');
      const archive = documentCopy.getElementById('workArchiveHidden');
      if (!archive) throw new Error('Archive source was not found');

      archive.removeAttribute('hidden');
      archive.removeAttribute('inert');
      archive.id = 'workArchive';
      mount.replaceChildren(document.adoptNode(archive));
      await loadShowcaseScript();
    } catch (error) {
      const text = copy[language()];
      mount.innerHTML = `<div class="nm-work-archive-status nm-work-archive-error" role="alert"><div class="nm-archive-loader" aria-hidden="true"><i></i><i></i><img src="/newmedia-logo.png" alt=""></div><span>${text.error}</span><a href="/work-archive">${text.retry}</a></div>`;
      console.error(error);
    }
  }

  const shellObserver = new MutationObserver(localizeShell);
  shellObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  installControls();
  localizeShell();
  installArchive();
})();
