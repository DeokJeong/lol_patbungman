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
    getMatchHistory
  }
}