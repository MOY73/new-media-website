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

  function loadShowcaseScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/work-showcase.js?v=2';
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
      mount.innerHTML = `<div class="nm-work-archive-status nm-work-archive-error" role="alert"><img src="/favicon.svg" alt=""><span>${text.error}</span><a href="/work-archive">${text.retry}</a></div>`;
      console.error(error);
    }
  }

  const shellObserver = new MutationObserver(localizeShell);
  shellObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  localizeShell();
  installArchive();
})();
