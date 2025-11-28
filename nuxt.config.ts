// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxt/ui', '@nuxt/image'],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'light'
  },
  runtimeConfig: {
    public: {
      mediaBaseUrl: 'https://axtfh7lpburz.objectstorage.sa-santiago-1.oci.customer-oci.com/n/axtfh7lpburz/b/bucket-semla3d/o'
    }
  }
  // ssr: true,
  // nitro: {
  //   preset: 'static'
  // },
})