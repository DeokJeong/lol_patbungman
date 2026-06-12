export default defineEventHandler(async (event): Promise<any> => {
  const matchId = getRouterParam(event, 'matchId')

  if (!matchId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'matchId is required.'
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

  const encodedMatchId = encodeURIComponent(matchId)
  const baseUrl = riotApiBase || `https://${accountRegion}.api.riotgames.com`
  const riotUrl = `${baseUrl}/lol/match/v5/matches/${encodedMatchId}`

  try {
    return await $fetch<any>(riotUrl, {
      method: 'GET',
      headers: {
        'X-Riot-Token': riotApiKey
      }
    })
  } catch (error: any) {
    const statusCode = error?.response?.status || 502
    const statusMessage = error?.response?._data?.status?.message || 'Failed to fetch match detail.'

    throw createError({
      statusCode,
      statusMessage
    })
  }
})
