import { useApi } from './useApi'

// Riot ID(예: 이필댕#KR1)를 분리해 비교/조회할 때 쓰는 타입
type RiotIdParts = {
  gameName: string
  tagLine: string
}

export const useMatchApi = () => {
  const api = useApi()
  const config = useRuntimeConfig()
  const endpoint = config.public.matchHistoryEndpoint

  // Riot ID 비교를 위한 문자열 정규화
  const normalizeRiotPart = (value: string) => value.trim().toLowerCase()

  // 이필댕#KR1 형식을 gameName/tagLine으로 분리
  const parseRiotId = (riotId: string): RiotIdParts | null => {
    const value = riotId?.trim()
    if (!value) {
      return null
    }

    const [rawGameName, rawTagLine] = value.split('#')
    const gameName = rawGameName?.trim() || ''
    const tagLine = rawTagLine?.trim() || ''

    if (!gameName || !tagLine) {
      return null
    }

    return { gameName, tagLine }
  }

  // Riot ID 비교용 고정 키 생성
  const buildRiotIdKey = (gameName: string, tagLine: string) => {
    return `${normalizeRiotPart(gameName)}#${normalizeRiotPart(tagLine)}`
  }

  // 두 Riot ID가 같은 계정인지 판별
  const isSameRiotId = (left: RiotIdParts, right: RiotIdParts) => {
    return buildRiotIdKey(left.gameName, left.tagLine) === buildRiotIdKey(right.gameName, right.tagLine)
  }

  // 개발환경 요청/응답 로그 출력
  const log = (...args: any[]) => {
    if (import.meta.dev) {
      console.log('[useMatchApi]', ...args)
    }
  }

  // 개발환경 에러 로그 출력
  const logError = (...args: any[]) => {
    if (import.meta.dev) {
      console.error('[useMatchApi]', ...args)
    }
  }

  // Nuxt 서버의 Riot 프록시 API 호출
  const riotApi = <T>(request: string, options: any = {}) => {
    return $fetch<T>(request, options)
  }

  // gameName/tagLine으로 puuid 조회
  const getPuuidByRiotId = async (gameName: string, tagLine: string) => {
    log('REQUEST getPuuidByRiotId', { gameName, tagLine })
    try {
      const response = await riotApi<{ puuid: string; gameName: string; tagLine: string }>('/api/riot/account/by-riot-id', {
        method: 'GET',
        query: {
          gameName,
          tagLine
        }
      })
      log('RESPONSE getPuuidByRiotId', response)
      return response
    } catch (error) {
      logError('ERROR getPuuidByRiotId', error)
      throw error
    }
  }

  // puuid로 Riot 계정 정보 조회
  const getAccountByPuuid = async (puuid: string) => {
    log('REQUEST getAccountByPuuid', { puuid })
    try {
      const response = await riotApi<{ puuid: string; gameName: string; tagLine: string }>('/api/riot/account/by-puuid', {
        method: 'GET',
        query: {
          puuid
        }
      })
      log('RESPONSE getAccountByPuuid', response)
      return response
    } catch (error) {
      logError('ERROR getAccountByPuuid', error)
      throw error
    }
  }

  // puuid로 최근 매치 ID 목록 조회
  const getMatchIdsByPuuid = async (puuid: string, options: { start?: number; count?: number; queue?: string; type?: string } = {}) => {
    log('REQUEST getMatchIdsByPuuid', { puuid, ...options })
    try {
      const response = await riotApi<string[]>('/api/riot/match/by-puuid', {
        method: 'GET',
        query: {
          puuid,
          start: options.start ?? 0,
          count: options.count ?? 10,
          ...(options.queue ? { queue: options.queue } : {}),
          ...(options.type ? { type: options.type } : {})
        }
      })
      log('RESPONSE getMatchIdsByPuuid', response)
      return response
    } catch (error) {
      logError('ERROR getMatchIdsByPuuid', error)
      throw error
    }
  }

  // matchId로 매치 상세 조회
  const getMatchDetailByMatchId = async (matchId: string) => {
    log('REQUEST getMatchDetailByMatchId', { matchId })
    try {
      const response = await riotApi<any>(`/api/riot/match/by-id/${encodeURIComponent(matchId)}`, {
        method: 'GET'
      })
      log('RESPONSE getMatchDetailByMatchId', response)
      return response
    } catch (error) {
      logError('ERROR getMatchDetailByMatchId', error)
      throw error
    }
  }

  // 기존 백엔드 매치 히스토리 엔드포인트 조회
  const getMatchHistory = async () => {
    log('REQUEST getMatchHistory', { endpoint })
    try {
      const response = await api<any>(endpoint, {
        method: 'GET'
      })
      log('RESPONSE getMatchHistory', response)
      return response
    } catch (error) {
      logError('ERROR getMatchHistory', error)
      throw error
    }
  }

  return {
    endpoint,
    parseRiotId,
    buildRiotIdKey,
    isSameRiotId,
    getPuuidByRiotId,
    getAccountByPuuid,
    getMatchIdsByPuuid,
    getMatchDetailByMatchId,
    getMatchHistory
  }
}