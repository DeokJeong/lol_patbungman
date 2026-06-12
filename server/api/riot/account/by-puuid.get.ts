type RiotAccountResponse = {
  puuid: string
  gameName: string
  tagLine: string
}

export default defineEventHandler(async (event): Promise<RiotAccountResponse> => {
  const query = getQuery(event)
  const puuid = typeof query.puuid === 'string' ? query.puuid.trim() : ''

  if (!puuid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'puuid is required.'
    })
  }

  const config = useRuntimeConfig(event)
  const riotApiKey = config.riotApiKey
  const accountRegion = config.riotAccountRegion || 'asia'
  const riotApiBase = (config.riotApiBase || '').replace(/\/$/, '')

  if (!riotApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Riot API key is not configured.'
    })
  }

  const encodedPuuid = encodeURIComponent(puuid)
  const baseUrl = riotApiBase || `https://${accountRegion}.api.riotgames.com`
  const riotUrl = `${baseUrl}/riot/account/v1/accounts/by-puuid/${encodedPuuid}`

  try {
    return await $fetch<RiotAccountResponse>(riotUrl, {
      method: 'GET',
      headers: {
        'X-Riot-Token': riotApiKey
      }
    })
  } catch (error: any) {
    const statusCode = error?.response?.status || 502
    const statusMessage = error?.response?._data?.status?.message || 'Failed to fetch Riot account info.'

    throw createError({
      statusCode,
      statusMessage
    })
  }
})
