export default defineEventHandler(async (event): Promise<string[]> => {
  const query = getQuery(event)
  const puuid = typeof query.puuid === 'string' ? query.puuid.trim() : ''
  const start = Number(query.start ?? 0)
  const count = Number(query.count ?? 10)
  const queue = typeof query.queue === 'string' ? query.queue.trim() : undefined
  const type = typeof query.type === 'string' ? query.type.trim() : undefined

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
  const riotUrl = `${baseUrl}/lol/match/v5/matches/by-puuid/${encodedPuuid}/ids`

  try {
    return await $fetch<string[]>(riotUrl, {
      method: 'GET',
      headers: {
        'X-Riot-Token': riotApiKey
      },
      query: {
        start,
        count,
        ...(queue ? { queue } : {}),
        ...(type ? { type } : {})
      }
    })
  } catch (error: any) {
    const statusCode = error?.response?.status || 502
    const statusMessage = error?.response?._data?.status?.message || 'Failed to fetch match id list.'

    throw createError({
      statusCode,
      statusMessage
    })
  }
})
