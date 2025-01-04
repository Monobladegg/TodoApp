export default defineNuxtConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "sass:math";',
        }
      }
    },
  },
  compatibilityDate: '2025-01-03',
  modules: ['@pinia/nuxt'],
})