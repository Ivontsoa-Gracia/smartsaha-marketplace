// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
  ],
  css: ['@/assets/css/main.css'],

  site: {
    url: 'https://sales.smart-saha.com',
    name: 'SmartSaha Marketplace'
  },

  sitemap: {
    gzip: true,
    autoI18n: true,
    urls: [
      '/market',
      '/market/about'
    ],
  }
  
})
