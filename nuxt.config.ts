// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxtjs/i18n'],
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
    }
  },
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'de', name: 'Deutsch', file: 'de.json' },
      { code: 'es', name: 'Español', file: 'es.json' },
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'zh-TW', name: '繁體中文', file: 'zh-TW.json' }
    ],
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false
  }
})
