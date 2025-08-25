const translations = {
  home: { en: "Home", fr: "Accueil", es: "Inicio" },
  contact: { en: "Contact", fr: "Contact", es: "Contacto" }
};

function i18nPath(url, locale, defaultLocale = "en") {
  const normalized = url.startsWith("/") ? url : `/${url}`;
  return locale === defaultLocale ? normalized : `/${locale}${normalized}`;
}

function t(key, locale, defaultLocale = "en") {
  const entry = translations[key] || {};
  return entry[locale] || entry[defaultLocale] || key;
}

function localizedUrl(url, locale, siteUrl, defaultLocale = "en") {
  const path = i18nPath(url, locale, defaultLocale);
  return new URL(path, siteUrl).toString();
}

module.exports = { i18nPath, t, localizedUrl };
