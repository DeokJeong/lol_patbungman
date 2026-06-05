import { useCookie } from 'nuxt/app'

// API 호출을 위한 공통 함수를 만드는 composable
// 1. .env 파일
//    ↓
// 2. nuxt.config.ts (runtimeConfig)
//    ↓
// 3. useRuntimeConfig() → config 객체
//    ↓
// 4. config.public.apiBase → baseURL
//    ↓
// 5. $fetch.create({ baseURL }) → api 함수
export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase
  const accessToken = useCookie<string | null>('access_token')
  const refreshToken = useCookie<string | null>('refresh_token')
  // 동시에 여러 요청이 401이어도 refresh API는 한 번만 호출하기 위한 잠금값
  let refreshPromise: Promise<string | null> | null = null

  const client = $fetch.create({

    baseURL,
    
    onRequest({ options }) {
      // access token이 있으면 모든 요청에 자동 부착
      const token = accessToken.value
      if (!token) {
        return
      }

      const headers = new Headers(options.headers as HeadersInit | undefined)
      if (!headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      options.headers = headers
    },

    // 서버에서 에러 응답(4xx, 5xx)이 왔을 때 실행되는 함수
    onResponseError({ response }) {
      // 콘솔에 에러 정보 출력 (개발 시 디버깅용)
      console.error('API Error:', response.status, response._data)
      
      // HTTP 상태 코드별로 다른 에러 메시지 출력
      // 401: Unauthorized - 인증 실패 (로그인 필요)
      if (response.status === 401) {
        console.error('인증 오류: 로그인이 필요합니다.')
      } 
      // 404: Not Found - 요청한 리소스가 없음
      else if (response.status === 404) {
        console.error('요청한 리소스를 찾을 수 없습니다.')
      } 
      // 500+: Server Error - 서버 내부 오류
      else if (response.status >= 500) {
        console.error('서버 오류가 발생했습니다.')
      }
    }
  })

  const refreshAccessToken = async () => {
    // 이미 refresh 진행 중이면 기존 Promise를 재사용
    if (refreshPromise) {
      return await refreshPromise
    }

    refreshPromise = (async () => {
      const currentRefreshToken = refreshToken.value
      if (!currentRefreshToken) {
        // refresh token 자체가 없으면 재발급 불가
        return null
      }

      try {
        const response: any = await $fetch('/api/accounts/token/refresh/', {
          baseURL,
          method: 'POST',
          body: { refresh: currentRefreshToken }
        })

        const nextAccess = response?.access ?? response?.access_token ?? null
        const nextRefresh = response?.refresh ?? response?.refresh_token ?? null

        if (!nextAccess) {
          // 성공 응답이어도 access가 없으면 실패로 간주
          return null
        }

        accessToken.value = nextAccess
        if (nextRefresh) {
          refreshToken.value = nextRefresh
        }

        return nextAccess
      } catch {
        // refresh 실패 시 인증 정보를 비워서 잘못된 상태를 방지
        accessToken.value = null
        refreshToken.value = null
        return null
      } finally {
        refreshPromise = null
      }
    })()

    return await refreshPromise
  }

  const api = async <T>(request: string, options: any = {}): Promise<T> => {
    try {
      return await client<T>(request, options)
    } catch (error: any) {
      const status = error?.response?.status
      const hasRetried = Boolean(options?._retry)
      const isRefreshEndpoint = request.includes('/api/accounts/token/refresh/')

      // 401이 아니거나, 이미 재시도했거나, refresh 요청 자체면 그대로 실패 처리
      if (status !== 401 || hasRetried || isRefreshEndpoint) {
        throw error
      }

      // 401이면 refresh 후 원요청 1회 재시도
      const nextAccessToken = await refreshAccessToken()
      if (!nextAccessToken) {
        throw error
      }

      const retryHeaders = new Headers(options?.headers as HeadersInit | undefined)
      retryHeaders.set('Authorization', `Bearer ${nextAccessToken}`)

      return await client<T>(request, {
        ...options,
        _retry: true,
        headers: retryHeaders
      })
    }
  }

  // 생성한 API 클라이언트 함수를 반환
  // 다른 곳에서 const api = useApi()로 사용 가능
  return api
}