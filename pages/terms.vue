<script setup>
const route = useRoute()
const router = useRouter()

const termsType = computed(() => route.query.type || 'service')

const termsTitle = computed(() => {
  switch (termsType.value) {
    case 'service':
      return '서비스 이용약관'
    case 'privacy':
      return '개인정보 수집 및 이용'
    case 'marketing':
      return '마케팅 정보 수신 동의'
    case 'event':
      return '이벤트 및 혜택 알림 동의'
    default:
      return '약관'
  }
})

const termsContent = computed(() => {
  switch (termsType.value) {
    case 'service':
      return '여기에 서비스 이용약관 내용을 입력하세요.'
    case 'privacy':
      return '여기에 개인정보 처리방침 내용을 입력하세요.'
    case 'marketing':
      return '여기에 마케팅 정보 수신 동의 내용을 입력하세요.'
    case 'event':
      return '여기에 이벤트 및 혜택 알림 동의 내용을 입력하세요.'
    default:
      return ''
  }
})

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="container">
    <div class="mainWrap">
      <div class="nameCard">
        <h1>{{ termsTitle }}</h1>
        <div>
          <button type="button" class="backBtn" @click="goBack">← 뒤로가기</button>
        </div>
      </div>

      <div class="card termsContent">
        <pre>{{ termsContent }}</pre>
      </div>
    </div>
  </div>
</template>

