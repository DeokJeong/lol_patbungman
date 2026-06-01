import { useApi } from './useApi'

type RegisterPayload = {
  userId: string
  userPw: string
  mainLine: string
  subLine: string
  tierTop: string
  tierJungle: string
  tierMid: string
  tierAdc: string
  tierSupport: string
  question: string
  answer: string
  serviceTerms: boolean
  privacyTerms: boolean
  ageTerms: boolean
  marketingTerms?: boolean
  eventTerms?: boolean
}

type LoginPayload = {
  username: string
  password: string
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
      body: { username: credentials.username, password: credentials.password }
    })
  }

  // 로그아웃
  const logout = async () => {
    return await api('/api/accounts/logout/', {
      method: 'POST'
    })
  }

  const getProfile = async () => {
    return await api('/api/accounts/profile/', {
      method: 'GET'
    })
  } 

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
    refreshToken
  }
}