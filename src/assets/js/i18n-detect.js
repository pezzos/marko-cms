(function(){
  var supported = ['en','fr','es'];
  var path = location.pathname;
  if (/^\/(fr|es)(\/|$)/.test(path)) return;
  var isBot = /bot|crawl|spider/i.test(navigator.userAgent);
  if (isBot) return;
  var key = 'i18n.locale';
  try {
    var stored = localStorage.getItem(key);
    if (stored && supported.includes(stored) && stored !== 'en') {
      location.replace('/' + stored + path);
      return;
    }
  } catch (e) {}
  var lang = (navigator.languages && navigator.languages[0] || navigator.language || 'en').slice(0,2).toLowerCase();
  if (!supported.includes(lang)) lang = 'en';
  try { localStorage.setItem(key, lang); } catch (e) {}
  if (lang !== 'en') {
    location.replace('/' + lang + path);
  }
})();
