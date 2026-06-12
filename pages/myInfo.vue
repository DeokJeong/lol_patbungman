<script setup>
const authStore = useAuthStore()
const { updateProfile, getProfile } = useAuthApi()

// 내 정보 수정 데이터
const myInfo = ref({
  name: '플레이어이름',
  riotGameName: '',
  riotTagLine: '',
  riotServer: 'asia',
  password: '',
  passwordConfirm: '',
  primaryPos: '미드',
  secondaryPos: '원딜',
  topTier: 'Gold III',
  jungleTier: 'Gold IV',
  midTier: 'Gold IV',
  adcTier: 'Gold II',
  supportTier: 'Gold III'
})

// 페이지 진입 시 프로필 값 로드
onMounted(async () => {
  const profile = authStore.user || await authStore.fetchProfile()
  if (!profile) {
    return
  }

  myInfo.value.name = profile?.user_id || profile?.name || myInfo.value.name
  myInfo.value.riotGameName = profile?.riot_game_name || profile?.game_name || ''
  myInfo.value.riotTagLine = profile?.riot_tag_line || profile?.tag_line || ''
  myInfo.value.riotServer = profile?.riot_server || profile?.server || 'asia'
})

const showPasswordChange = ref(false)

// 비밀번호 변경 영역 토글
const togglePasswordChange = () => {
  showPasswordChange.value = !showPasswordChange.value
  if (!showPasswordChange.value) {
    myInfo.value.password = ''
    myInfo.value.passwordConfirm = ''
  }
}

// 마이페이지 입력값 저장
const saveMyInfo = async () => {
  if (!myInfo.value.riotGameName || !myInfo.value.riotTagLine || !myInfo.value.riotServer) {
    alert('게임 내 아이디, 태그, 서버를 입력해주세요.')
    return
  }

  if (showPasswordChange.value && myInfo.value.password !== myInfo.value.passwordConfirm) {
    alert('비밀번호 확인이 일치하지 않습니다.')
    return
  }

  try {
    const payload = {
      riot_game_name: myInfo.value.riotGameName,
      riot_tag_line: myInfo.value.riotTagLine,
      riot_server: myInfo.value.riotServer
    }

    if (showPasswordChange.value && myInfo.value.password) {
      payload.user_pw = myInfo.value.password
    }

    await updateProfile(payload)
    const latestProfile = await getProfile()
    authStore.user = latestProfile

    alert('정보가 저장되었습니다')
    navigateTo('/main')
  } catch {
    alert('정보 저장에 실패했습니다. 다시 시도해주세요.')
  }
}

// 메인 페이지로 이동
const cancel = () => {
  navigateTo('/main')
}
</script>

<template>
  <div class="container">
    <div class="mainWrap">
      <div class="nameCard">
        <h1>내 정보 수정</h1>
        <div>
          <p>프로필 정보를 수정할 수 있습니다</p>
          <button type="button" class="backBtn" @click="cancel">← 메인으로</button>
        </div>
      </div>
      
      <form @submit.prevent="saveMyInfo" class="card customInputBox customSelectBox myInfoForm">
        <div class="sectionContent">
          <div class="subTitle">
            <p>기본정보</p>
          </div>
          <ul class="flexColumn">
            <li class="pointInputField">
              <label for="userName">닉네임</label>
              <input type="text" name="userName" id="userName" v-model="myInfo.name" placeholder="닉네임을 입력해주세요" readonly>
            </li>
            <li class="pointInputField">
              <label for="riotGameName">게임 내 아이디</label>
              <input type="text" name="riotGameName" id="riotGameName" v-model="myInfo.riotGameName" placeholder="게임 내 아이디를 입력해주세요">
            </li>
            <li class="pointInputField">
              <label for="riotTagLine">태그</label>
              <input type="text" name="riotTagLine" id="riotTagLine" v-model="myInfo.riotTagLine" placeholder="태그를 입력해주세요 (예: KR1)">
            </li>
            <li class="pointInputField">
              <label for="riotServer">서버</label>
              <select name="riotServer" id="riotServer" v-model="myInfo.riotServer">
                <option value="asia">ASIA</option>
                <option value="americas">AMERICAS</option>
                <option value="europe">EUROPE</option>
                <option value="sea">SEA</option>
              </select>
            </li>
            <li>
              <button type="button" class="passwordChangeBtn" @click="togglePasswordChange">
                {{ showPasswordChange ? '비밀번호 변경 취소' : '비밀번호 변경' }}
              </button>
            </li>
            <template v-if="showPasswordChange">
              <li class="pointInputField">
                <label for="userPw">새 비밀번호</label>
                <input type="password" name="userPw" id="userPw" v-model="myInfo.password" autocomplete="new-password" placeholder="새 비밀번호를 입력하세요">
              </li>
              <li class="pointInputField">
                <label for="userRePw">비밀번호 확인</label>
                <input type="password" name="userRePw" id="userRePw" v-model="myInfo.passwordConfirm" autocomplete="new-password" placeholder="새 비밀번호를 다시 입력하세요">
              </li>
            </template>
          </ul>
        </div>
        <div class="sectionContent">
          <div class="subTitle">
            <p>주라인 & 부라인</p>
          </div>
          <ul class="flexColumn">
            <li class="pointInputField">
              <label for="mainLine">주 라인</label>
              <select name="mainLine" id="mainLine" v-model="myInfo.primaryPos">
                <option value="" disabled hidden>주 라인을 선택해주세요.</option>
                <option value="탑">탑</option>
                <option value="정글">정글</option>
                <option value="미드">미드</option>
                <option value="원딜">원딜</option>
                <option value="서포트">서포트</option>
              </select>
            </li>
            <li class="pointInputField">
              <label for="subLine">부 라인</label>
              <select name="subLine" id="subLine" v-model="myInfo.secondaryPos">
                <option value="" disabled hidden>부 라인을 선택해주세요.</option>
                <option value="탑">탑</option>
                <option value="정글">정글</option>
                <option value="미드">미드</option>
                <option value="원딜">원딜</option>
                <option value="서포트">서포트</option>
              </select>
            </li>
          </ul>
        </div>
        <div class="sectionContent">
          <div class="subTitle">
            <p>라인 별 티어</p>
          </div>
          <ul class="grid grid5">
          <li class="pointInputField">
            <label for="topTier">탑</label>
            <select name="topTier" id="topTier" v-model="myInfo.topTier">
              <option value="" disabled hidden>티어를 입력해주세요.</option>
              <option value="Iron IV">Iron IV</option>
              <option value="Iron III">Iron III</option>
              <option value="Iron II">Iron II</option>
              <option value="Iron I">Iron I</option>
              <option value="Bronze IV">Bronze IV</option>
              <option value="Bronze III">Bronze III</option>
              <option value="Bronze II">Bronze II</option>
              <option value="Bronze I">Bronze I</option>
              <option value="Silver IV">Silver IV</option>
              <option value="Silver III">Silver III</option>
              <option value="Silver II">Silver II</option>
              <option value="Silver I">Silver I</option>
              <option value="Gold IV">Gold IV</option>
              <option value="Gold III">Gold III</option>
              <option value="Gold II">Gold II</option>
              <option value="Gold I">Gold I</option>
              <option value="Platinum IV">Platinum IV</option>
              <option value="Platinum III">Platinum III</option>
              <option value="Platinum II">Platinum II</option>
              <option value="Platinum I">Platinum I</option>
              <option value="Diamond IV">Diamond IV</option>
              <option value="Diamond III">Diamond III</option>
              <option value="Diamond II">Diamond II</option>
              <option value="Diamond I">Diamond I</option>
            </select>
          </li>
          <li class="pointInputField">
            <label for="jungleTier">정글</label>
            <select name="jungleTier" id="jungleTier" v-model="myInfo.jungleTier">
              <option value="" disabled hidden>티어를 입력해주세요.</option>
              <option value="Iron IV">Iron IV</option>
              <option value="Iron III">Iron III</option>
              <option value="Iron II">Iron II</option>
              <option value="Iron I">Iron I</option>
              <option value="Bronze IV">Bronze IV</option>
              <option value="Bronze III">Bronze III</option>
              <option value="Bronze II">Bronze II</option>
              <option value="Bronze I">Bronze I</option>
              <option value="Silver IV">Silver IV</option>
              <option value="Silver III">Silver III</option>
              <option value="Silver II">Silver II</option>
              <option value="Silver I">Silver I</option>
              <option value="Gold IV">Gold IV</option>
              <option value="Gold III">Gold III</option>
              <option value="Gold II">Gold II</option>
              <option value="Gold I">Gold I</option>
              <option value="Platinum IV">Platinum IV</option>
              <option value="Platinum III">Platinum III</option>
              <option value="Platinum II">Platinum II</option>
              <option value="Platinum I">Platinum I</option>
              <option value="Diamond IV">Diamond IV</option>
              <option value="Diamond III">Diamond III</option>
              <option value="Diamond II">Diamond II</option>
              <option value="Diamond I">Diamond I</option>
            </select>
          </li>
          <li class="pointInputField">
            <label for="midTier">미드</label>
            <select name="midTier" id="midTier" v-model="myInfo.midTier">
              <option value="" disabled hidden>티어를 입력해주세요.</option>
              <option value="Iron IV">Iron IV</option>
              <option value="Iron III">Iron III</option>
              <option value="Iron II">Iron II</option>
              <option value="Iron I">Iron I</option>
              <option value="Bronze IV">Bronze IV</option>
              <option value="Bronze III">Bronze III</option>
              <option value="Bronze II">Bronze II</option>
              <option value="Bronze I">Bronze I</option>
              <option value="Silver IV">Silver IV</option>
              <option value="Silver III">Silver III</option>
              <option value="Silver II">Silver II</option>
              <option value="Silver I">Silver I</option>
              <option value="Gold IV">Gold IV</option>
              <option value="Gold III">Gold III</option>
              <option value="Gold II">Gold II</option>
              <option value="Gold I">Gold I</option>
              <option value="Platinum IV">Platinum IV</option>
              <option value="Platinum III">Platinum III</option>
              <option value="Platinum II">Platinum II</option>
              <option value="Platinum I">Platinum I</option>
              <option value="Diamond IV">Diamond IV</option>
              <option value="Diamond III">Diamond III</option>
              <option value="Diamond II">Diamond II</option>
              <option value="Diamond I">Diamond I</option>
            </select>
          </li>
          <li class="pointInputField">
            <label for="adcTier">원딜</label>
            <select name="adcTier" id="adcTier" v-model="myInfo.adcTier">
              <option value="" disabled hidden>티어를 입력해주세요.</option>
              <option value="Iron IV">Iron IV</option>
              <option value="Iron III">Iron III</option>
              <option value="Iron II">Iron II</option>
              <option value="Iron I">Iron I</option>
              <option value="Bronze IV">Bronze IV</option>
              <option value="Bronze III">Bronze III</option>
              <option value="Bronze II">Bronze II</option>
              <option value="Bronze I">Bronze I</option>
              <option value="Silver IV">Silver IV</option>
              <option value="Silver III">Silver III</option>
              <option value="Silver II">Silver II</option>
              <option value="Silver I">Silver I</option>
              <option value="Gold IV">Gold IV</option>
              <option value="Gold III">Gold III</option>
              <option value="Gold II">Gold II</option>
              <option value="Gold I">Gold I</option>
              <option value="Platinum IV">Platinum IV</option>
              <option value="Platinum III">Platinum III</option>
              <option value="Platinum II">Platinum II</option>
              <option value="Platinum I">Platinum I</option>
              <option value="Diamond IV">Diamond IV</option>
              <option value="Diamond III">Diamond III</option>
              <option value="Diamond II">Diamond II</option>
              <option value="Diamond I">Diamond I</option>
            </select>
          </li>
          <li class="pointInputField">
            <label for="supportTier">서포트</label>
            <select name="supportTier" id="supportTier" v-model="myInfo.supportTier">
              <option value="" disabled hidden>티어를 입력해주세요.</option>
              <option value="Iron IV">Iron IV</option>
              <option value="Iron III">Iron III</option>
              <option value="Iron II">Iron II</option>
              <option value="Iron I">Iron I</option>
              <option value="Bronze IV">Bronze IV</option>
              <option value="Bronze III">Bronze III</option>
              <option value="Bronze II">Bronze II</option>
              <option value="Bronze I">Bronze I</option>
              <option value="Silver IV">Silver IV</option>
              <option value="Silver III">Silver III</option>
              <option value="Silver II">Silver II</option>
              <option value="Silver I">Silver I</option>
              <option value="Gold IV">Gold IV</option>
              <option value="Gold III">Gold III</option>
              <option value="Gold II">Gold II</option>
              <option value="Gold I">Gold I</option>
              <option value="Platinum IV">Platinum IV</option>
              <option value="Platinum III">Platinum III</option>
              <option value="Platinum II">Platinum II</option>
              <option value="Platinum I">Platinum I</option>
              <option value="Diamond IV">Diamond IV</option>
              <option value="Diamond III">Diamond III</option>
              <option value="Diamond II">Diamond II</option>
              <option value="Diamond I">Diamond I</option>
            </select>
          </li>
        </ul>
        </div>
        <div class="buttonGroup">
          <button type="submit" class="fullBtn">저장</button>
          <button type="button" class="fullBtn cancelBtn" @click="cancel">취소</button>
        </div>
      </form>
    </div>
  </div>
</template>
