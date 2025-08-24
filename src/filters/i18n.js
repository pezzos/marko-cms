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

module.exports = { i18nPath, t };
