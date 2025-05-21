// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@tresjs/nuxt'],
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/' // Crucial for GitHub Pages deployment
  },
  ssr: false // Recommended for fully static deployment on GitHub Pages
})
