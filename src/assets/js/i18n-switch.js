document.addEventListener('DOMContentLoaded', () => {
  const switcher = document.querySelector('[data-lang-switch]');
  if (!switcher) return;
  switcher.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-locale]');
    if (!link) return;
    try {
      localStorage.setItem('i18n.locale', link.dataset.locale);
    } catch {}
  });
});
