// nuxt.config.ts
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

  tailwindcss: {
    configPath: 'tailwind.config.ts',
  },

  plugins: ['~/plugins/apexcharts.client.ts'],

  site: {
    url: 'https://sales.smart-saha.com',
    name: 'SmartSaha Marketplace',
  },

  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'fr', 
    locales: [
      { code: 'fr', iso: 'fr-FR', name: 'Français' },
      { code: 'en', iso: 'en-US', name: 'English' }
    ],
    vueI18n: {
      legacy: false,
      fallbackLocale: 'fr',
      messages: {
        fr: {},
        en: {}
      }
    }
  },

  sitemap: {
    gzip: true,
    autoI18n: true,
    locales: ['fr', 'en'], 
    urls: [
      '/market',
      '/market/about'
    ],
  },

  build: {
    rollupOptions: {
    }
  }
})