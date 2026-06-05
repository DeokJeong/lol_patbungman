export default defineNuxtRouteMiddleware((to) => {
  // 로그인 없이 접근 가능한 공개 페이지
  const publicPaths = ['/', '/join', '/terms']
  const isPublicPage = publicPaths.includes(to.path)

  const accessToken = useCookie<string | null>('access_token')
  const isLoggedIn = Boolean(accessToken.value)

  // 비로그인 사용자가 보호 페이지로 접근하면 로그인 페이지로 이동
  if (!isLoggedIn && !isPublicPage) {
    return navigateTo('/')
  }

  // 로그인 사용자가 로그인/회원가입 페이지로 다시 들어오면 메인으로 이동
  if (isLoggedIn && (to.path === '/' || to.path === '/join')) {
    return navigateTo('/main')
  }
})
