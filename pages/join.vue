<script setup>
// ref()를 사용하는 이유:
// Vue3에서 반응형 변수를 만드는 방법이다.
// 값이 바뀌면 화면(template)이 자동으로 업데이트된다.
// v-model과 함께 써야 input 값이 실시간으로 변수에 반영된다.

// 기본 정보 입력값
const userId = ref('')       // 아이디 입력 필드와 연결
const userPw = ref('')       // 비밀번호 입력 필드와 연결
const userRePw = ref('')     // 비밀번호 재입력 필드와 연결 (submit 시 일치 여부 검사용)
const userEmail = ref('')    // 이메일 입력 필드와 연결
const riotGameName = ref('') // Riot 게임 이름 입력 필드와 연결
const riotTagLine = ref('')  // Riot 태그 입력 필드와 연결
const riotServer = ref('asia') // Riot 서버 입력 필드와 연결

// 라인 선택값
const mainLine = ref('')     // 주 라인 select와 연결
const subLine = ref('')      // 부 라인 select와 연결

// 주 라인에서 선택한 값을 제외한 부 라인 옵션 목록
const allLines = [
  { value: 'top', label: '탑' },
  { value: 'jungle', label: '정글' },
  { value: 'mid', label: '미드' },
  { value: 'adc', label: '원딜' },
  { value: 'support', label: '서포트' },
]
const filteredSubLines = computed(() => allLines.filter(line => line.value !== mainLine.value))

// 주 라인 변경 시 부 라인이 같은 값이면 초기화
watch(mainLine, (val) => {
  if (subLine.value === val) subLine.value = ''
})

// 라인별 티어 선택값
const tierTop = ref('')      // 탑 티어 select와 연결
const tierJungle = ref('')   // 정글 티어 select와 연결
const tierMid = ref('')      // 미드 티어 select와 연결
const tierAdc = ref('')      // 원딜 티어 select와 연결
const tierSupport = ref('')  // 서포트 티어 select와 연결

// 질문/답변 입력값 (비밀번호 찾기용)
const question = ref('')     // 질문 select와 연결
const answer = ref('')       // 답변 input과 연결

// 약관 동의 체크박스 상태값
// boolean 타입으로 초기값 false (체크 안 된 상태)
const serviceTerms = ref(false)    // 서비스 이용약관 (필수)
const privacyTerms = ref(false)    // 개인정보 수집 동의 (필수)
const ageTerms = ref(false)        // 만 14세 이상 확인 (필수)
const marketingTerms = ref(false)  // 마케팅 정보 수신 동의 (선택)
const eventTerms = ref(false)      // 이벤트 알림 동의 (선택)

// computed를 사용하는 이유:
// 전체 동의 체크박스는 get/set 두 가지 동작이 필요하다.
// get: 모든 약관이 체크되어 있을 때만 전체 동의 체크박스가 체크된 상태로 보여야 한다.
// set: 전체 동의를 누르면 모든 약관 체크박스를 한 번에 true/false로 바꿔야 한다.
// 이 두 가지를 동시에 처리하려면 writable computed가 적합하다.
const allAgree = computed({
  // 모든 약관이 체크된 경우에만 전체 동의 체크박스를 체크 상태로 표시
  get: () => serviceTerms.value && privacyTerms.value && ageTerms.value && marketingTerms.value && eventTerms.value,
  // 전체 동의 체크박스를 누르면 모든 약관 상태를 동일하게 변경
  set: (val) => {
    serviceTerms.value = val
    privacyTerms.value = val
    ageTerms.value = val
    marketingTerms.value = val
    eventTerms.value = val
  }
})

// useAuthApi composable에서 register 함수만 꺼내서 사용
// API 호출 로직은 composable에 분리되어 있으므로 여기서는 호출만 한다
const { register } = useAuthApi()

// 회원가입 폼 제출 함수
// async를 쓰는 이유: register()가 서버 통신(비동기)이라 응답을 기다려야 한다
const handleSubmit = async () => {
  // 비밀번호 일치 여부 검사
  // 서버에 보내기 전에 클라이언트에서 먼저 확인해 불필요한 요청을 줄인다
  if (userPw.value !== userRePw.value) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }

  // 이메일 입력 여부 검사
  if (!userEmail.value) {
    alert('이메일을 입력해주세요.')
    return
  }

  if (!riotGameName.value || !riotTagLine.value || !riotServer.value) {
    alert('Riot 게임이름, 태그, 서버를 입력해주세요.')
    return
  }

  // 필수 약관 동의 여부 검사
  // 필수 3개(서비스, 개인정보, 나이)가 모두 체크돼야 가입 가능
  if (!serviceTerms.value || !privacyTerms.value || !ageTerms.value) {
    alert('필수 약관에 동의해주세요.')
    return
  }

  // try/catch를 쓰는 이유:
  // API 호출은 네트워크 오류, 서버 오류 등 실패할 수 있다.
  // 실패했을 때 앱이 터지지 않도록 에러를 잡아서 사용자에게 알려준다.
  try {
    // useAuthApi의 register 함수 호출
    // ref의 실제 값을 꺼낼 때는 .value를 사용한다
    await register({
      user_id: userId.value,
      user_pw: userPw.value,
      email: userEmail.value,
      riot_game_name: riotGameName.value,
      riot_tag_line: riotTagLine.value,
      riot_server: riotServer.value,
      main_line: mainLine.value,
      sub_line: subLine.value,
      tier_top: tierTop.value,
      tier_jungle: tierJungle.value,
      tier_mid: tierMid.value,
      tier_adc: tierAdc.value,
      tier_support: tierSupport.value,
      question: question.value,
      answer: answer.value,
      service_terms: serviceTerms.value,
      privacy_terms: privacyTerms.value,
      age_terms: ageTerms.value,
      marketing_terms: marketingTerms.value,
      event_terms: eventTerms.value
    })
    // 가입 성공 시 로그인 페이지로 이동
    alert('회원가입이 완료되었습니다!')
    navigateTo('/')
  } catch (error) {
    console.error('회원가입 실패:', error)
    const data = error?.data || error?.response?.data
    if (data) {
      const messages = Object.values(data).flat().join('\n')
      alert(messages || '회원가입에 실팩했습니다. 다시 시도해주세요.')
    } else {
      alert('회원가입에 실팩했습니다. 다시 시도해주세요.')
    }
  }
}

// 로그인 페이지로 돌아가기
// navigateTo는 Nuxt에서 제공하는 페이지 이동 함수다
const goToLogin = () => {
  navigateTo('/')
}

// 약관 상세 페이지로 이동
// type 파라미터로 어떤 약관인지 구분한다 (service, privacy, marketing, event)
const viewTerms = (type) => {
  navigateTo(`/terms?type=${type}`)
}
</script>

<template>
  <div class="container">
    <div class="mainWrap">
      <div class="nameCard">
        <h1>회원가입</h1>
        <div>
          <p>새로운 계정을 만들어보세요</p>
          <button type="button" class="backBtn" @click="goToLogin">← 로그인으로</button>
        </div>
      </div>

      <!-- form 제출 시 handleSubmit 호출, 기본 새로고침 동작 막기 -->
      <form class="card customInputBox customCheckBox customSelectBox joinForm" @submit.prevent="handleSubmit">

        <!-- 기본 정보 섹션 -->
        <div class="sectionContent">
          <div class="subTitle">
            <p>기본정보</p>
          </div>
          <ul class="flexColumn">
            <!-- 아이디 입력 -->
            <li class="pointInputField">
              <label for="userId">아이디</label>
              <input type="text" name="userId" id="userId" autocomplete="userId" placeholder="아이디를 입력해주세요" v-model="userId">
            </li>
            <!-- 비밀번호 입력 -->
            <li class="pointInputField">
              <label for="userPw">비밀번호</label>
              <input type="password" name="userPw" id="userPw" autocomplete="new-password" placeholder="비밀번호를 입력해주세요" v-model="userPw">
            </li>
            <!-- 비밀번호 재입력 (일치 여부는 handleSubmit에서 검사) -->
            <li class="pointInputField">
              <label for="userRePw">비밀번호 재입력</label>
              <input type="password" name="userRePw" id="userRePw" autocomplete="new-password" placeholder="비밀번호를 다시 입력해주세요" v-model="userRePw">
            </li>
            <!-- 이메일 입력 -->
            <li class="pointInputField">
              <label for="userEmail">이메일</label>
              <input type="email" name="userEmail" id="userEmail" autocomplete="email" placeholder="이메일을 입력해주세요" required v-model="userEmail">
            </li>
            <li class="pointInputField">
              <label for="riotGameName">Riot 게임이름</label>
              <input type="text" name="riotGameName" id="riotGameName" placeholder="예: Hide on bush" v-model="riotGameName">
            </li>
            <li class="pointInputField">
              <label for="riotTagLine">Riot 태그</label>
              <input type="text" name="riotTagLine" id="riotTagLine" placeholder="예: KR1" v-model="riotTagLine">
            </li>
            <li class="pointInputField">
              <label for="riotServer">Riot 서버</label>
              <select name="riotServer" id="riotServer" v-model="riotServer">
                <option value="asia">ASIA</option>
                <option value="americas">AMERICAS</option>
                <option value="europe">EUROPE</option>
                <option value="sea">SEA</option>
              </select>
            </li>
          </ul>
        </div>

        <!-- 주라인 / 부라인 섹션 -->
        <div class="sectionContent">
          <div class="subTitle">
            <p>주라인 & 부라인</p>
          </div>
          <ul class="flexColumn">
            <!-- 주 라인 선택 -->
            <li class="pointInputField">
              <label for="mainLine">주 라인</label>
              <select name="mainLine" id="mainLine" v-model="mainLine">
                <option value="" selected hidden>주 라인을 선택해주세요.</option>
                <option value="top">탑</option>
                <option value="jungle">정글</option>
                <option value="mid">미드</option>
                <option value="adc">원딜</option>
                <option value="support">서포트</option>
              </select>
            </li>
            <!-- 부 라인 선택 -->
            <li class="pointInputField">
              <label for="subLine">부 라인</label>
              <select name="subLine" id="subLine" v-model="subLine">
                <option value="" selected hidden>부 라인을 선택해주세요.</option>
                <option v-for="line in filteredSubLines" :key="line.value" :value="line.value">
                  {{ line.label }}
                </option>
              </select>
            </li>
          </ul>
        </div>

        <!-- 라인별 티어 섹션 -->
        <div class="sectionContent">
          <div class="subTitle">
            <p>라인 별 티어</p>
          </div>
          <ul class="grid grid5">
            <!-- 탑 티어 -->
            <li class="pointInputField">
              <label for="tierTop">탑</label>
              <select name="tierTop" id="tierTop" v-model="tierTop">
                <option value="" selected hidden>티어를 선택해주세요.</option>
                <option value="iron">아이언</option>
                <option value="bronze">브론즈</option>
                <option value="silver">실버</option>
                <option value="gold">골드</option>
                <option value="platinum">플래티넘</option>
                <option value="diamond">다이아</option>
                <option value="master">마스터</option>
                <option value="grandmaster">그랜드마스터</option>
                <option value="challenger">챌린저</option>
              </select>
            </li>
            <!-- 정글 티어 -->
            <li class="pointInputField">
              <label for="tierJungle">정글</label>
              <select name="tierJungle" id="tierJungle" v-model="tierJungle">
                <option value="" selected hidden>티어를 선택해주세요.</option>
                <option value="iron">아이언</option>
                <option value="bronze">브론즈</option>
                <option value="silver">실버</option>
                <option value="gold">골드</option>
                <option value="platinum">플래티넘</option>
                <option value="diamond">다이아</option>
                <option value="master">마스터</option>
                <option value="grandmaster">그랜드마스터</option>
                <option value="challenger">챌린저</option>
              </select>
            </li>
            <!-- 미드 티어 -->
            <li class="pointInputField">
              <label for="tierMid">미드</label>
              <select name="tierMid" id="tierMid" v-model="tierMid">
                <option value="" selected hidden>티어를 선택해주세요.</option>
                <option value="iron">아이언</option>
                <option value="bronze">브론즈</option>
                <option value="silver">실버</option>
                <option value="gold">골드</option>
                <option value="platinum">플래티넘</option>
                <option value="diamond">다이아</option>
                <option value="master">마스터</option>
                <option value="grandmaster">그랜드마스터</option>
                <option value="challenger">챌린저</option>
              </select>
            </li>
            <!-- 원딜 티어 -->
            <li class="pointInputField">
              <label for="tierAdc">원딜</label>
              <select name="tierAdc" id="tierAdc" v-model="tierAdc">
                <option value="" selected hidden>티어를 선택해주세요.</option>
                <option value="iron">아이언</option>
                <option value="bronze">브론즈</option>
                <option value="silver">실버</option>
                <option value="gold">골드</option>
                <option value="platinum">플래티넘</option>
                <option value="diamond">다이아</option>
                <option value="master">마스터</option>
                <option value="grandmaster">그랜드마스터</option>
                <option value="challenger">챌린저</option>
              </select>
            </li>
            <!-- 서포트 티어 -->
            <li class="pointInputField">
              <label for="tierSupport">서포트</label>
              <select name="tierSupport" id="tierSupport" v-model="tierSupport">
                <option value="" selected hidden>티어를 선택해주세요.</option>
                <option value="iron">아이언</option>
                <option value="bronze">브론즈</option>
                <option value="silver">실버</option>
                <option value="gold">골드</option>
                <option value="platinum">플래티넘</option>
                <option value="diamond">다이아</option>
                <option value="master">마스터</option>
                <option value="grandmaster">그랜드마스터</option>
                <option value="challenger">챌린저</option>
              </select>
            </li>
          </ul>
        </div>

        <!-- 질문 & 답변 섹션 (비밀번호 찾기용) -->
        <div class="sectionContent">
          <div class="subTitle">
            <p>질문&답변</p>
          </div>
          <ul class="flexColumn">
            <!-- 질문 선택 -->
            <li>
              <label for="question">질문</label>
              <select name="question" id="question" v-model="question">
                <option value="" selected hidden>질문을 선택해주세요.</option>
                <option value="pet">처음 키운 반려동물의 이름은?</option>
                <option value="school">다녔던 초등학교 이름은?</option>
                <option value="food">가장 좋아하는 음식은?</option>
                <option value="city">태어난 도시 이름은?</option>
                <option value="friend">어릴 적 친구의 이름은?</option>
              </select>
            </li>
            <!-- 답변 입력 -->
            <li>
              <label for="answer">답변</label>
              <input type="text" name="answer" id="answer" placeholder="답변을 입력해주세요" v-model="answer">
            </li>
          </ul>
        </div>

        <!-- 약관 동의 섹션 -->
        <div class="sectionContent">
          <div class="subTitle">
            <p>약관</p>
          </div>
          <ul class="flexColumn">
            <!-- 전체 동의 체크박스 -->
            <li class="allAgreeBox checkboxWrap">
              <input type="checkbox" name="allAgree" id="allAgree" v-model="allAgree">
              <label for="allAgree">전체 약관에 동의합니다</label>
            </li>

            <!-- 필수: 서비스 이용약관 -->
            <li class="termsItem">
              <div class="checkboxWrap">
                <input type="checkbox" name="serviceTerms" id="serviceTerms" v-model="serviceTerms">
                <label for="serviceTerms">[필수] 서비스 이용약관 동의</label>
              </div>
              <button type="button" class="termsViewBtn" @click="viewTerms('service')">보기</button>
            </li>

            <!-- 필수: 개인정보 수집 동의 -->
            <li class="termsItem">
              <div class="checkboxWrap">
                <input type="checkbox" name="privacyTerms" id="privacyTerms" v-model="privacyTerms">
                <label for="privacyTerms">[필수] 개인정보 수집 및 이용 동의</label>
              </div>
              <button type="button" class="termsViewBtn" @click="viewTerms('privacy')">보기</button>
            </li>

            <!-- 필수: 만 14세 이상 확인 -->
            <li class="termsItem">
              <div class="checkboxWrap">
                <input type="checkbox" name="ageTerms" id="ageTerms" v-model="ageTerms">
                <label for="ageTerms">[필수] 만 14세 이상입니다</label>
              </div>
            </li>

            <!-- 선택: 마케팅 정보 수신 동의 -->
            <li class="termsItem">
              <div class="checkboxWrap">
                <input type="checkbox" name="marketingTerms" id="marketingTerms" v-model="marketingTerms">
                <label for="marketingTerms">[선택] 마케팅 정보 수신 동의</label>
              </div>
              <button type="button" class="termsViewBtn" @click="viewTerms('marketing')">보기</button>
            </li>

            <!-- 선택: 이벤트 알림 동의 -->
            <li class="termsItem">
              <div class="checkboxWrap">
                <input type="checkbox" name="eventTerms" id="eventTerms" v-model="eventTerms">
                <label for="eventTerms">[선택] 이벤트 및 혜택 알림 동의</label>
              </div>
              <button type="button" class="termsViewBtn" @click="viewTerms('event')">보기</button>
            </li>
          </ul>
        </div>

        <!-- 회원가입 제출 버튼 -->
        <button type="submit" class="fullBtn">회원가입</button>
      </form>
    </div>
  </div>
</template>