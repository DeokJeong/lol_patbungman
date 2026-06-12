import { defineNuxtConfig } from 'nuxt/config';
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: [ '~/assets/common.css' ],
  runtimeConfig: {
    riotApiKey: process.env.NUXT_RIOT_API_KEY || process.env.NUXT_PUBLIC_RIOT_API_KEY,
    riotApiBase: process.env.NUXT_RIOT_API_BASE || '',
    riotAccountRegion: process.env.NUXT_RIOT_ACCOUNT_REGION || 'asia',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      matchHistoryEndpoint: process.env.NUXT_PUBLIC_MATCH_HISTORY_ENDPOINT || '/api/matches/history/'
    }
  }
})
