(function () {
  const LANGUAGE_KEY = 'nm-lang';
  const THEME_KEY = 'nm-theme';

  function read(key, allowed, fallback) {
    try {
      const value = localStorage.getItem(key);
      return allowed.includes(value) ? value : fallback;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // The selected value still applies to the current page when storage is unavailable.
    }
  }

  function applyLanguage(language) {
    const value = language === 'en' ? 'en' : 'ar';
    document.documentElement.lang = value;
    document.documentElement.dir = value === 'ar' ? 'rtl' : 'ltr';
    write(LANGUAGE_KEY, value);
    return value;
  }

  function applyTheme(theme) {
    const value = theme === 'light' ? 'light' : 'dark';
    document.documentElement.classList.toggle('light', value === 'light');
    write(THEME_KEY, value);
    return value;
  }

  const language = read(LANGUAGE_KEY, ['ar', 'en'], 'ar');
  const theme = read(THEME_KEY, ['dark', 'light'], 'dark');

  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.classList.toggle('light', theme === 'light');

  window.NMPreferences = {
    getLanguage: () => read(LANGUAGE_KEY, ['ar', 'en'], 'ar'),
    getTheme: () => read(THEME_KEY, ['dark', 'light'], 'dark'),
    setLanguage: applyLanguage,
    setTheme: applyTheme,
  };

  const chromeStyle = document.createElement('link');
  chromeStyle.rel = 'stylesheet';
  chromeStyle.href = '/site-chrome.css?v=33';
  document.head.appendChild(chromeStyle);

  const chromeScript = document.createElement('script');
  chromeScript.src = '/site-chrome.js?v=30';
  chromeScript.defer = true;
  document.head.appendChild(chromeScript);
})();
