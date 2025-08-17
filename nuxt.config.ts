// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/i18n'],
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css'
        }
      ],
      script: [
        {
          src: 'https://kit.fontawesome.com/4335c2f54b.js',
          crossorigin: 'anonymous'
        },
        ...(process.env.NODE_ENV === 'production'
          ? [
              {
                src: 'https://www.googletagmanager.com/gtag/js?id=G-XLRM21CEWV',
                async: true
              },
              {
                innerHTML: `
              window.dataLayer = window.dataLayer || [];
              function gtag() { dataLayer.push(arguments); }
              gtag('js', new Date());
              gtag('config', 'G-XLRM21CEWV');
            `
              }
            ]
          : [])
      ]
    }
  },
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'ar', name: 'العربية', file: 'ar.json' },
      { code: 'bn', name: 'বাংলা', file: 'bn.json' },
      { code: 'bg', name: 'Български', file: 'bg.json' },
      { code: 'ca', name: 'Català', file: 'ca.json' },
      { code: 'zh-CN', name: '简体中文', file: 'zh-CN.json' },
      { code: 'zh-TW', name: '繁體中文', file: 'zh-TW.json' },
      { code: 'hr', name: 'Hrvatski', file: 'hr.json' },
      { code: 'cs', name: 'Čeština', file: 'cs.json' },
      { code: 'da', name: 'Dansk', file: 'da.json' },
      { code: 'nl', name: 'Nederlands', file: 'nl.json' },
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'et', name: 'Eesti', file: 'et.json' },
      { code: 'fil', name: 'Filipino', file: 'fil.json' },
      { code: 'fi', name: 'Suomi', file: 'fi.json' },
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'de', name: 'Deutsch', file: 'de.json' },
      { code: 'el', name: 'Ελληνικά', file: 'el.json' },
      { code: 'gu', name: 'ગુજરાતી', file: 'gu.json' },
      { code: 'he', name: 'עברית', file: 'he.json' },
      { code: 'hi', name: 'हिन्दी', file: 'hi.json' },
      { code: 'hu', name: 'Magyar', file: 'hu.json' },
      { code: 'id', name: 'Bahasa Indonesia', file: 'id.json' },
      { code: 'it', name: 'Italiano', file: 'it.json' },
      { code: 'ja', name: '日本語', file: 'ja.json' },
      { code: 'kn', name: 'ಕನ್ನಡ', file: 'kn.json' },
      { code: 'ko', name: '한국어', file: 'ko.json' },
      { code: 'lv', name: 'Latviešu', file: 'lv.json' },
      { code: 'lt', name: 'Lietuvių', file: 'lt.json' },
      { code: 'ms', name: 'Bahasa Melayu', file: 'ms.json' },
      { code: 'ml', name: 'മലയാളം', file: 'ml.json' },
      { code: 'mr', name: 'मराठी', file: 'mr.json' },
      { code: 'no', name: 'Norsk', file: 'no.json' },
      { code: 'pl', name: 'Polski', file: 'pl.json' },
      { code: 'pt', name: 'Português', file: 'pt.json' },
      { code: 'pa', name: 'ਪੰਜਾਬੀ', file: 'pa.json' },
      { code: 'ro', name: 'Română', file: 'ro.json' },
      { code: 'ru', name: 'Русский', file: 'ru.json' },
      { code: 'sr', name: 'Српски', file: 'sr.json' },
      { code: 'sk', name: 'Slovenčina', file: 'sk.json' },
      { code: 'sl', name: 'Slovenščina', file: 'sl.json' },
      { code: 'es-ES', name: 'Español (España)', file: 'es-ES.json' },
      { code: 'es-419', name: 'Español (Latinoamérica)', file: 'es-419.json' },
      { code: 'sv', name: 'Svenska', file: 'sv.json' },
      { code: 'ta', name: 'தமிழ்', file: 'ta.json' },
      { code: 'te', name: 'తెలుగు', file: 'te.json' },
      { code: 'th', name: 'ไทย', file: 'th.json' },
      { code: 'tr', name: 'Türkçe', file: 'tr.json' },
      { code: 'uk', name: 'Українська', file: 'uk.json' },
      { code: 'ur', name: 'اردو', file: 'ur.json' },
      { code: 'vi', name: 'Tiếng Việt', file: 'vi.json' }
    ],
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false
  }
})
