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

  const api = $fetch.create({

    baseURL,
    
    onRequest({ options }) {
      // 여기서 요청 옵션(헤더, 바디 등)을 수정할 수 있음
      // 나중에 로그인 토큰을 자동으로 헤더에 추가할 때 사용
      // options.headers = {
      //   ...options.headers,  // 기존 헤더 유지
      //   Authorization: `Bearer ${token}`  // 토큰 추가
      // }
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

  // 생성한 API 클라이언트 함수를 반환
  // 다른 곳에서 const api = useApi()로 사용 가능
  return api
}