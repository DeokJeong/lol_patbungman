import { defineNuxtConfig } from 'nuxt/config';
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vite: {
    server: {
      // Dev server behind proxy/domain: allow external host headers.
      allowedHosts: true
    }
  },
  modules: ['@pinia/nuxt'],
  css: [ '~/assets/common.css' ],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      matchHistoryEndpoint: process.env.NUXT_PUBLIC_MATCH_HISTORY_ENDPOINT || '/api/matches/history/'
    }
  }
})
