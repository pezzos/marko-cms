(function(){
  var supported = ['en','fr','es'];
  var path = location.pathname;
  // If already on a localized path (including 'en'), do nothing
  var first = (path.split('/')[1] || '').toLowerCase();
  if (supported.includes(first)) return;
  var isBot = /bot|crawl|spider/i.test(navigator.userAgent);
  if (isBot) return;
  var key = 'i18n.locale';
  var stored = null;
  try { stored = localStorage.getItem(key); } catch (e) {}
  var lang = stored || (navigator.languages && navigator.languages[0] || navigator.language || 'en');
  lang = (lang || 'en').slice(0,2).toLowerCase();
  if (!supported.includes(lang)) lang = 'en';
  try { localStorage.setItem(key, lang); } catch (e) {}
  if (lang !== 'en') {
    location.replace('/' + lang + path);
  }
})();
