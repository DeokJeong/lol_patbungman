export const useAuthStore = defineStore('auth', () => {
  // state
  const accessToken = useCookie<string | null>('access_token', {
    default: () => null
  })
  const refreshToken = useCookie<string | null>('refresh_token', {
    default: () => null
  })
  const user = ref<any>(null)

  // getters
  const isLoggedIn = computed(() => Boolean(accessToken.value))

  // action
  const setAuth = (payload: { access: string; refresh: string; user?: any }) => {
    accessToken.value = payload.access
    refreshToken.value = payload.refresh
    user.value = payload.user ?? null
  }

  const clearAuth = () => {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
  }

  const login = async (credentials: { userId: string; password: string }) => {
    const { login: loginApi } = useAuthApi()
    const response: any = await loginApi(credentials)
    setAuth(response)
    return response
  }

  const logout = async () => {
    const { logout: logoutApi } = useAuthApi()
    try {
      await logoutApi()
    } finally {
      clearAuth()
    }
  }

  const fetchProfile = async () => {
    if (!accessToken.value) {
      user.value = null
      return null
    }

    const { getProfile } = useAuthApi()
    const profile = await getProfile()
    user.value = profile
    return profile
  }

  return {
    accessToken,
    refreshToken,
    user,
    isLoggedIn,
    setAuth,
    clearAuth,
    login,
    logout,
    fetchProfile
  }
})
