// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxt/ui', '@nuxt/image'],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'light'
  }
  // ssr: true,
  // nitro: {
  //   preset: 'static'
  // },
})