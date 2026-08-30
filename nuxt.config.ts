// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/i18n', '@nuxtjs/sitemap'],
  site: {
    url: 'https://addwatermark.online'
  },
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
                src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8791642317068591',
                async: true,
                crossorigin: 'anonymous'
              },
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
    baseUrl: 'https://addwatermark.online',
    defaultLocale: 'en',
    locales: [
      { code: 'ar', language: 'ar', name: 'العربية', file: 'ar.json' },
      { code: 'bn', language: 'bn', name: 'বাংলা', file: 'bn.json' },
      { code: 'bg', language: 'bg', name: 'Български', file: 'bg.json' },
      { code: 'ca', language: 'ca', name: 'Català', file: 'ca.json' },
      {
        code: 'zh-CN',
        language: 'zh-CN',
        name: '简体中文',
        file: 'zh-CN.json'
      },
      {
        code: 'zh-TW',
        language: 'zh-TW',
        name: '繁體中文',
        file: 'zh-TW.json'
      },
      { code: 'hr', language: 'hr', name: 'Hrvatski', file: 'hr.json' },
      { code: 'cs', language: 'cs', name: 'Čeština', file: 'cs.json' },
      { code: 'da', language: 'da', name: 'Dansk', file: 'da.json' },
      { code: 'nl', language: 'nl', name: 'Nederlands', file: 'nl.json' },
      { code: 'en', language: 'en', name: 'English', file: 'en.json' },
      { code: 'et', language: 'et', name: 'Eesti', file: 'et.json' },
      { code: 'fil', language: 'fil', name: 'Filipino', file: 'fil.json' },
      { code: 'fi', language: 'fi', name: 'Suomi', file: 'fi.json' },
      { code: 'fr', language: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'de', language: 'de', name: 'Deutsch', file: 'de.json' },
      { code: 'el', language: 'el', name: 'Ελληνικά', file: 'el.json' },
      { code: 'gu', language: 'gu', name: 'ગુજરાતી', file: 'gu.json' },
      { code: 'he', language: 'he', name: 'עברית', file: 'he.json' },
      { code: 'hi', language: 'hi', name: 'हिन्दी', file: 'hi.json' },
      { code: 'hu', language: 'hu', name: 'Magyar', file: 'hu.json' },
      { code: 'id', language: 'id', name: 'Bahasa Indonesia', file: 'id.json' },
      { code: 'it', language: 'it', name: 'Italiano', file: 'it.json' },
      { code: 'ja', language: 'ja', name: '日本語', file: 'ja.json' },
      { code: 'kn', language: 'kn', name: 'ಕನ್ನಡ', file: 'kn.json' },
      { code: 'ko', language: 'ko', name: '한국어', file: 'ko.json' },
      { code: 'lv', language: 'lv', name: 'Latviešu', file: 'lv.json' },
      { code: 'lt', language: 'lt', name: 'Lietuvių', file: 'lt.json' },
      { code: 'ms', language: 'ms', name: 'Bahasa Melayu', file: 'ms.json' },
      { code: 'ml', language: 'ml', name: 'മലയാളം', file: 'ml.json' },
      { code: 'mr', language: 'mr', name: 'मराठी', file: 'mr.json' },
      { code: 'no', language: 'no', name: 'Norsk', file: 'no.json' },
      { code: 'pl', language: 'pl', name: 'Polski', file: 'pl.json' },
      { code: 'pt', language: 'pt', name: 'Português', file: 'pt.json' },
      { code: 'pa', language: 'pa', name: 'ਪੰਜਾਬੀ', file: 'pa.json' },
      { code: 'ro', language: 'ro', name: 'Română', file: 'ro.json' },
      { code: 'ru', language: 'ru', name: 'Русский', file: 'ru.json' },
      { code: 'sr', language: 'sr', name: 'Српски', file: 'sr.json' },
      { code: 'sk', language: 'sk', name: 'Slovenčina', file: 'sk.json' },
      { code: 'sl', language: 'sl', name: 'Slovenščina', file: 'sl.json' },
      {
        code: 'es-ES',
        language: 'es-ES',
        name: 'Español (España)',
        file: 'es-ES.json'
      },
      {
        code: 'es-419',
        language: 'es-419',
        name: 'Español (Latinoamérica)',
        file: 'es-419.json'
      },
      { code: 'sv', language: 'sv', name: 'Svenska', file: 'sv.json' },
      { code: 'ta', language: 'ta', name: 'தமிழ்', file: 'ta.json' },
      { code: 'te', language: 'te', name: 'తెలుగు', file: 'te.json' },
      { code: 'th', language: 'th', name: 'ไทย', file: 'th.json' },
      { code: 'tr', language: 'tr', name: 'Türkçe', file: 'tr.json' },
      { code: 'uk', language: 'uk', name: 'Українська', file: 'uk.json' },
      { code: 'ur', language: 'ur', name: 'اردو', file: 'ur.json' },
      { code: 'vi', language: 'vi', name: 'Tiếng Việt', file: 'vi.json' }
    ],
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false
  },
  sitemap: true
})
