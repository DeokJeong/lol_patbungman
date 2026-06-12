import { useApi } from './useApi'

type RegisterPayload = {
  user_id: string
  user_pw: string
  email: string
  riot_game_name: string
  riot_tag_line: string
  riot_server: string
  main_line: string
  sub_line: string
  tier_top: string
  tier_jungle: string
  tier_mid: string
  tier_adc: string
  tier_support: string
  question: string
  answer: string
  service_terms: boolean
  privacy_terms: boolean
  age_terms: boolean
  marketing_terms?: boolean
  event_terms?: boolean
}

type LoginPayload = {
  userId: string
  password: string
}

// 마이페이지 프로필 수정 요청 payload
type UpdateProfilePayload = {
  riot_game_name?: string
  riot_tag_line?: string
  riot_server?: string
  main_line?: string
  sub_line?: string
  tier_top?: string
  tier_jungle?: string
  tier_mid?: string
  tier_adc?: string
  tier_support?: string
  user_pw?: string
}

export const useAuthApi = () => {
  const api = useApi()

  // 회원가입
  const register = async (userData: RegisterPayload) => {
    return await api('/api/accounts/register/', {
      method: 'POST',
      body: userData
    })
  }

  // 로그인
  const login = async (credentials: LoginPayload) => {
    return await api('/api/accounts/login/', {
      method: 'POST',
      body: { user_id: credentials.userId, password: credentials.password }
    })
  }

  // 로그아웃
  const logout = async () => {
    return await api('/api/accounts/logout/', {
      method: 'POST'
    })
  }

  // 내 프로필 조회
  const getProfile = async () => {
    return await api('/api/accounts/profile/', {
      method: 'GET'
    })
  } 

  // 내 프로필 수정
  const updateProfile = async (profileData: UpdateProfilePayload) => {
    return await api('/api/accounts/profile/', {
      method: 'PATCH',
      body: profileData
    })
  }

  // 토큰 재발급
  const refreshToken = async () => {
    return await api('/api/accounts/token/refresh/', {
      method: 'POST'
    })
  } 

  return {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    refreshToken
  }
}