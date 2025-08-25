// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui'
  ],
  ui: {
    icons: ['heroicons']
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      janusUrl: process.env.JANUS_URL || 'wss://janus1.januscaler.com/janus/ws'
    }
  }
})
