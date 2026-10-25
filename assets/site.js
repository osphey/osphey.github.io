(() => {
  'use strict';

  const root = document.documentElement;
  const storageKeys = { language: 'osphey-language', theme: 'osphey-theme' };

  function readPreference(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function savePreference(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Controls still work when browser storage is unavailable.
    }
  }

  function versionFromUrl() {
    return new URLSearchParams(location.search).get('view') === 'ai' ? 'ai' : 'games';
  }

  function savedState() {
    return {
      language: readPreference(storageKeys.language) === 'zh' ? 'zh' : 'en',
      theme: readPreference(storageKeys.theme) === 'dark' ? 'dark' : 'light',
      version: versionFromUrl()
    };
  }

  const state = savedState();

  // Apply preferences before the stylesheet and content load.
  root.dataset.theme = state.theme;
  root.dataset.version = state.version;

  function initialize() {
    const languageToggle = document.querySelector('.language-toggle');
    const themeToggle = document.querySelector('.theme-toggle');
    const profileSwitcher = document.querySelector('.profile-switcher');
    const profileOptions = [...document.querySelectorAll('[data-profile-option]')];
    const moonIcon = themeToggle.querySelector('.moon-icon');
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const description = document.querySelector('meta[name="description"]');
    const titleElement = document.querySelector('title');
    const titles = { en: document.title, zh: titleElement.dataset.zh };
    const descriptions = {
      games: { en: description.content, zh: description.dataset.zhContent },
      ai: {
        en: description.dataset.aiContent || description.content,
        zh: description.dataset.zhAiContent || description.dataset.zhContent
      }
    };
    const hasProfileContent = Boolean(document.querySelector('[data-profile]'));

    // All page copy stays in HTML; these bindings only switch its language.
    const texts = [...document.querySelectorAll('[data-zh]')].map(element => ({
      element,
      en: element.textContent,
      zh: element.dataset.zh
    }));
    const attributes = [
      ['aria-label', 'data-zh-label'],
      ['title', 'data-zh-title'],
      ['alt', 'data-zh-alt']
    ].flatMap(([attribute, translation]) =>
      [...document.querySelectorAll('[' + translation + ']')].map(element => ({
        element,
        attribute,
        en: element.getAttribute(attribute),
        zh: element.getAttribute(translation)
      }))
    );
    const siteLinks = [...document.querySelectorAll('[data-site-link]')].map(element => ({
      element,
      href: element.getAttribute('href')
    }));

    function render() {
      const chinese = state.language === 'zh';
      const dark = state.theme === 'dark';

      root.lang = chinese ? 'zh-CN' : 'en';
      root.dataset.theme = state.theme;
      root.dataset.version = state.version;
      texts.forEach(item => { item.element.textContent = item[state.language]; });
      attributes.forEach(item => {
        item.element.setAttribute(item.attribute, item[state.language]);
      });

      languageToggle.textContent = chinese ? 'EN' : '中文';
      languageToggle.lang = chinese ? 'en' : 'zh-CN';
      languageToggle.setAttribute('aria-label', chinese ? '切换至英文' : 'Switch to Chinese');

      themeToggle.setAttribute('aria-pressed', String(dark));
      themeToggle.title = chinese
        ? (dark ? '切换至浅色模式' : '切换至深色模式')
        : (dark ? 'Switch to light mode' : 'Switch to dark mode');
      themeToggle.setAttribute('aria-label', themeToggle.title);
      moonIcon.toggleAttribute('hidden', dark);
      sunIcon.toggleAttribute('hidden', !dark);

      profileOptions.forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.profileOption === state.version));
      });
      siteLinks.forEach(({ element, href }) => {
        const url = new URL(href, location.href);
        if (state.version === 'ai') url.searchParams.set('view', 'ai');
        else url.searchParams.delete('view');
        element.href = url.href;
      });
      const suffix = hasProfileContent && state.version === 'ai' ? ' · AI' : '';
      document.title = titles[state.language] + suffix;
      description.content = descriptions[state.version][state.language];
    }

    languageToggle.addEventListener('click', () => {
      state.language = state.language === 'en' ? 'zh' : 'en';
      savePreference(storageKeys.language, state.language);
      render();
    });

    themeToggle.addEventListener('click', () => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      savePreference(storageKeys.theme, state.theme);
      render();
    });

    profileOptions.forEach(button => {
      button.addEventListener('click', () => {
        if (state.version === button.dataset.profileOption) return;
        state.version = button.dataset.profileOption;
        const url = new URL(location.href);
        if (state.version === 'ai') url.searchParams.set('view', 'ai');
        else url.searchParams.delete('view');
        history.pushState(null, '', url);
        render();
      });
    });

    window.addEventListener('popstate', () => {
      state.version = versionFromUrl();
      render();
    });
    window.addEventListener('pageshow', event => {
      if (event.persisted) {
        Object.assign(state, savedState());
        render();
      }
    });

    render();
    languageToggle.hidden = false;
    themeToggle.hidden = false;
    if (profileSwitcher) profileSwitcher.hidden = false;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
