<script setup>
// 팝업 상태 관리
const showPopup = ref(false)
const showResultPopup = ref(false)
const showAddFriendPopup = ref(false)
const showMatchResultPopup = ref(false)
const showFriendListPopup = ref(false)
const isMatching = ref(false)

// 친구 추가 관련
const friendIdInput = ref('')
const friendError = ref('')
const friendSearchQuery = ref('')

// 내 정보
const myInfo = {
  id: 0,
  name: '플레이어이름',
  tier: 'Gold IV',
  isMe: true
}

// 친구 목록 (임시 데이터)
const friendList = ref([
  { id: 1, name: '플레이어1', tier: 'Gold IV', primaryPos: '미드', primaryTier: 'Gold IV', secondaryPos: '원딜', secondaryTier: 'Gold II' },
  { id: 2, name: '플레이어2', tier: 'Silver I', primaryPos: '탑', primaryTier: 'Silver I', secondaryPos: '정글', secondaryTier: 'Silver III' },
  { id: 3, name: '플레이어3', tier: 'Platinum III', primaryPos: '원딜', primaryTier: 'Platinum III', secondaryPos: '서포트', secondaryTier: 'Platinum IV' },
  { id: 4, name: '플레이어4', tier: 'Gold II', primaryPos: '정글', primaryTier: 'Gold II', secondaryPos: '탑', secondaryTier: 'Gold III' },
  { id: 5, name: '플레이어5', tier: 'Bronze I', primaryPos: '서포트', primaryTier: 'Bronze I', secondaryPos: '미드', secondaryTier: 'Bronze II' },
  { id: 6, name: '플레이어6', tier: 'Gold I', primaryPos: '미드', primaryTier: 'Gold I', secondaryPos: '정글', secondaryTier: 'Gold II' },
  { id: 7, name: '플레이어7', tier: 'Silver II', primaryPos: '탑', primaryTier: 'Silver II', secondaryPos: '원딜', secondaryTier: 'Silver III' },
  { id: 8, name: '플레이어8', tier: 'Platinum IV', primaryPos: '원딜', primaryTier: 'Platinum IV', secondaryPos: '미드', secondaryTier: 'Gold I' },
  { id: 9, name: '플레이어9', tier: 'Gold III', primaryPos: '정글', primaryTier: 'Gold III', secondaryPos: '서포트', secondaryTier: 'Gold IV' },
  { id: 10, name: '플레이어10', tier: 'Bronze II', primaryPos: '서포트', primaryTier: 'Bronze II', secondaryPos: '탑', secondaryTier: 'Bronze III' },
  { id: 11, name: '플레이어11', tier: 'Platinum I', primaryPos: '미드', primaryTier: 'Platinum I', secondaryPos: '원딜', secondaryTier: 'Platinum III' },
  { id: 12, name: '플레이어12', tier: 'Gold III', primaryPos: '탑', primaryTier: 'Gold III', secondaryPos: '정글', secondaryTier: 'Gold IV' },
  { id: 13, name: '플레이어13', tier: 'Silver II', primaryPos: '원딜', primaryTier: 'Silver II', secondaryPos: '미드', secondaryTier: 'Silver III' },
  { id: 14, name: '플레이어14', tier: 'Gold I', primaryPos: '정글', primaryTier: 'Gold I', secondaryPos: '서포트', secondaryTier: 'Gold II' },
  { id: 15, name: '플레이어15', tier: 'Bronze III', primaryPos: '서포트', primaryTier: 'Bronze III', secondaryPos: '탑', secondaryTier: 'Bronze IV' },
  { id: 16, name: '플레이어16', tier: 'Silver I', primaryPos: '미드', primaryTier: 'Silver I', secondaryPos: '원딜', secondaryTier: 'Silver II' },
  { id: 17, name: '플레이어17', tier: 'Platinum II', primaryPos: '탑', primaryTier: 'Platinum II', secondaryPos: '정글', secondaryTier: 'Platinum III' },
  { id: 18, name: '플레이어18', tier: 'Gold II', primaryPos: '원딜', primaryTier: 'Gold II', secondaryPos: '미드', secondaryTier: 'Gold III' },
  { id: 19, name: '플레이어19', tier: 'Bronze I', primaryPos: '정글', primaryTier: 'Bronze I', secondaryPos: '서포트', secondaryTier: 'Bronze II' }
])

// 선택된 참가자 목록 (나는 기본으로 포함)
const selectedParticipants = ref([
  {
    ...myInfo,
    positionLock: 'none'
  }
])

// 참가자 통계 계산
const participantCount = computed(() => selectedParticipants.value.length)
const matchableTeams = computed(() => Math.floor(selectedParticipants.value.length / 10))
const remainingPlayers = computed(() => selectedParticipants.value.length % 10)

// 친구 목록 필터링
const filteredFriendList = computed(() => {
  if (!friendSearchQuery.value) return friendList.value
  const query = friendSearchQuery.value.toLowerCase()
  return friendList.value.filter(friend => 
    friend.name.toLowerCase().includes(query)
  )
})

// 팝업 열기/닫기 함수
const openResultPopup = () => {
  showResultPopup.value = true
  document.body.style.overflow = 'hidden'
}

const closeResultPopup = () => {
  showResultPopup.value = false
  document.body.style.overflow = ''
}

const openAddFriendPopup = () => {
  showAddFriendPopup.value = true
  friendIdInput.value = ''
  friendError.value = ''
  document.body.style.overflow = 'hidden'
}

const closeAddFriendPopup = () => {
  showAddFriendPopup.value = false
  friendIdInput.value = ''
  friendError.value = ''
  document.body.style.overflow = ''
}

const openFriendListPopup = () => {
  showFriendListPopup.value = true
  document.body.style.overflow = 'hidden'
}

const closeFriendListPopup = () => {
  showFriendListPopup.value = false
  friendSearchQuery.value = ''
  document.body.style.overflow = ''
}

const addFriendFromSearch = () => {
  alert('친구 추가 기능은 준비중입니다')
}

const openMatchPopup = () => {
  showPopup.value = true
  document.body.style.overflow = 'hidden'
}

const closeMatchPopup = () => {
  showPopup.value = false
  document.body.style.overflow = ''
}

const openMatchResultPopup = () => {
  showMatchResultPopup.value = true
  document.body.style.overflow = 'hidden'
}

const closeMatchResultPopup = () => {
  showMatchResultPopup.value = false
  document.body.style.overflow = ''
}

const removeFriend = (friendId) => {
  if (confirm('정말 친구를 삭제하시겠습니까?')) {
    const index = friendList.value.findIndex(f => f.id === friendId)
    if (index > -1) {
      friendList.value.splice(index, 1)
    }
    
    // 선택된 참가자에서도 제거
    const participantIndex = selectedParticipants.value.findIndex(p => p.id === friendId)
    if (participantIndex > -1) {
      selectedParticipants.value.splice(participantIndex, 1)
    }
  }
}

const addFriend = () => {
  if (!friendIdInput.value.trim()) {
    friendError.value = '아이디를 입력해주세요'
    return
  }
  
  // TODO: 실제 친구 검색 API 호출
  // 임시로 특정 아이디만 성공하도록 처리
  const validIds = ['플레이어1', '플레이어2', '플레이어3']
  if (validIds.includes(friendIdInput.value)) {
    friendError.value = ''
    // 친구 추가 성공 로직
    closeAddFriendPopup()
  } else {
    friendError.value = '없는 아이디입니다'
  }
}

// 참가자 선택/해제
const toggleParticipant = (friend) => {
  const index = selectedParticipants.value.findIndex(p => p.id === friend.id)
  if (index > -1) {
    // 이미 선택되어 있으면 제거
    selectedParticipants.value.splice(index, 1)
  } else {
    // 선택되어 있지 않으면 추가
    selectedParticipants.value.push({
      ...friend,
      positionLock: 'none'
    })
  }
}

// 참가자가 선택되어 있는지 확인
const isSelected = (friendId) => {
  return selectedParticipants.value.some(p => p.id === friendId)
}

// 참가자 삭제
const removeParticipant = (participantId) => {
  // '나'는 삭제할 수 없음
  if (participantId === 0) {
    return
  }
  
  const index = selectedParticipants.value.findIndex(p => p.id === participantId)
  if (index > -1) {
    selectedParticipants.value.splice(index, 1)
  }
}

// 직전 참가자 목록 (로컬 스토리지에서 불러오기)
const lastParticipants = ref([])

// 매칭 결과 (여러 팀)
const matchResults = ref([])
const currentTeamTab = ref(0)
const unmatchedPlayers = ref([])

// 직전 참가자 불러오기
const loadLastParticipants = () => {
  // TODO: 실제로는 API나 로컬 스토리지에서 불러오기
  // 임시로 예시 데이터 사용
  const lastMatch = [
    { id: 1, name: '플레이어1', tier: 'Gold IV' },
    { id: 3, name: '플레이어3', tier: 'Platinum III' },
    { id: 5, name: '플레이어5', tier: 'Bronze I' },
    { id: 7, name: '플레이어7', tier: 'Silver II' },
    { id: 9, name: '플레이어9', tier: 'Gold III' }
  ]
  
  // 기존 선택 초기화 (나는 유지)
  selectedParticipants.value = [selectedParticipants.value[0]]
  
  // 직전 참가자들 추가
  lastMatch.forEach(participant => {
    selectedParticipants.value.push({
      ...participant,
      positionLock: 'none'
    })
  })
}

// 매칭 시작
const startMatching = async () => {
  // 10명 미만 체크
  if (selectedParticipants.value.length < 10) {
    alert(`참가자가 부족합니다. 현재 ${selectedParticipants.value.length}명 (최소 10명 필요)`)
    return
  }

  // 매칭 가능한 팀이 없으면
  if (matchableTeams.value === 0) {
    alert('매칭 가능한 팀이 없습니다.')
    return
  }

  // 로딩 시작
  isMatching.value = true

  // 매칭 알고리즘 실행 (임시로 랜덤 배치)
  await new Promise(resolve => setTimeout(resolve, 2000)) // 2초 로딩

  // 10명씩 묶어서 여러 팀 생성
  const teamCount = matchableTeams.value
  const results = []
  
  for (let i = 0; i < teamCount; i++) {
    const startIdx = i * 10
    const endIdx = startIdx + 10
    const teamParticipants = [...selectedParticipants.value].slice(startIdx, endIdx)
    const shuffled = teamParticipants.sort(() => Math.random() - 0.5)
    
    results.push({
      teamNumber: i + 1,
      blueTeam: shuffled.slice(0, 5),
      redTeam: shuffled.slice(5, 10),
      balanceScore: Math.floor(Math.random() * 20) + 80 // 80-100 사이 랜덤 점수
    })
  }
  
  // 미매칭된 참가자 계산
  const matchedCount = teamCount * 10
  unmatchedPlayers.value = selectedParticipants.value.slice(matchedCount)
  
  matchResults.value = results
  currentTeamTab.value = 0 // 첫 번째 팀 선택

  // 로딩 종료
  isMatching.value = false

  // 매칭 설정 팝업 닫고 결과 팝업 열기
  showPopup.value = false
  openMatchResultPopup()
}
</script>
<template>
  <div class="container">
    <div class="mainWrap">
      <div class="nameCard">
        <h1>patbungman</h1>
        <div>
          <p>환영합니다! <NuxtLink to="/myInfo" style="cursor: pointer; color: var(--bora-gradient); text-decoration: none;">플레이어이름</NuxtLink>님</p>
          <div>
            <button class="friends" type="button" @click="openFriendListPopup()">친구목록</button>
            <button class="logout" type="button">로그아웃</button>
          </div>
        </div>
      </div>
      <div class="card customInputBox matchSystemBox">
        <div class="title">
          <h2>내전 자동 팀 매칭 시스템</h2>
          <p>10명 단위 5vs5 균형잡힌 팀을 자동으로 생성합니다.<br>티어 점수와 라인 가중치 기반으로 최적의 팀 밸런스를 제공하며, 후보자 관리와 실시간 교체가 가능합니다.</p>
        </div>
        <div class="matchBtnBox">
          <button type="button" class="fullBtn" @click="openMatchPopup">팀 매칭 시작</button>
          <!-- <button type="button" class="fullBtn">관리자 설정</button> -->
        </div>
      </div>

      <div class="card matchRecordBox">
        <div class="title between">
          <h2>최근 팀 기록</h2>
          <NuxtLink to="/matchHistory">전체보기</NuxtLink>
        </div>
        <ul>
          <li class="matchRecord">
            <div class="matchInfo between">
              <div>
                <p class="matchResult win">승리</p>
                <button type="button" @click="openResultPopup()">설정</button>
                <p class="matchBalance">팀 밸런스 점수: 92/100</p>
              </div>
              <p class="matchDate">2024-06-15 20:30</p>
            </div>
            <div class="teams">
              <div class="team blueTeam">
                <h3>블루 팀</h3>
                <ul class="playerList">
                  <li class="me">
                    <div class="playerName">플레이어1</div>
                    <div class="playerPositions">
                      <span class="primary">주: 미드 (Gold IV)</span>
                      <span class="secondary">부: 원딜 (Gold II)</span>
                    </div>
                  </li>
                  <li>
                    <div class="playerName">플레이어2</div>
                    <div class="playerPositions">
                      <span class="primary">주: 탑 (Silver I)</span>
                      <span class="secondary">부: 정글 (Silver III)</span>
                    </div>
                  </li>
                  <li>
                    <div class="playerName">플레이어3</div>
                    <div class="playerPositions">
                      <span class="primary">주: 원딜 (Platinum III)</span>
                      <span class="secondary">부: 서포트 (Platinum IV)</span>
                    </div>
                  </li>
                  <li>
                    <div class="playerName">플레이어4</div>
                    <div class="playerPositions">
                      <span class="primary">주: 정글 (Gold II)</span>
                      <span class="secondary">부: 탑 (Gold III)</span>
                    </div>
                  </li>
                  <li>
                    <div class="playerName">플레이어5</div>
                    <div class="playerPositions">
                      <span class="primary">주: 서포트 (Bronze I)</span>
                      <span class="secondary">부: 미드 (Bronze II)</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="team redTeam">
                <h3>레드 팀</h3>
                <ul class="playerList">
                  <li>
                    <div class="playerName">플레이어6</div>
                    <div class="playerPositions">
                      <span class="primary">주: 미드 (Gold I)</span>
                      <span class="secondary">부: 정글 (Gold II)</span>
                    </div>
                  </li>
                  <li>
                    <div class="playerName">플레이어7</div>
                    <div class="playerPositions">
                      <span class="primary">주: 탑 (Silver II)</span>
                      <span class="secondary">부: 원딜 (Silver III)</span>
                    </div>
                  </li>
                  <li>
                    <div class="playerName">플레이어8</div>
                    <div class="playerPositions">
                      <span class="primary">주: 원딜 (Platinum IV)</span>
                      <span class="secondary">부: 미드 (Gold I)</span>
                    </div>
                  </li>
                  <li>
                    <div class="playerName">플레이어9</div>
                    <div class="playerPositions">
                      <span class="primary">주: 정글 (Gold III)</span>
                      <span class="secondary">부: 서포트 (Gold IV)</span>
                    </div>
                  </li>
                  <li>
                    <div class="playerName">플레이어10</div>
                    <div class="playerPositions">
                      <span class="primary">주: 서포트 (Bronze II)</span>
                      <span class="secondary">부: 탑 (Bronze III)</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          
          <li class="matchRecord">
            <div class="matchInfo between">
              <div>
                <p class="matchResult pending">결과 미정</p>
                <button type="button" @click="openResultPopup()">설정</button>
                 <p class="matchBalance">팀 밸런스 점수: 88/100</p>
              </div>
              <p class="matchDate">2024-06-14 19:15</p>
            </div>
            <div class="teams">
              <div class="team blueTeam">
                <h3>블루 팀</h3>
                <ul class="playerList">
                  <li>
                    <div class="playerName">플레이어11</div>
                    <div class="playerPositions">
                      <span class="primary">주: 미드 (Platinum I)</span>
                      <span class="secondary">부: 원딜 (Platinum III)</span>
                    </div>
                  </li>
                  <li>
                    <div class="playerName">플레이어12</div>
                    <div class="playerPositions">
                      <span class="primary">주: 탑 (Gold III)</span>
                      <span class="secondary">부: 정글 (Gold IV)</span>
                    </div>
                  </li>
                  <li>
                    <div class="playerName">플레이어13</div>
                    <div class="playerPositions">
                      <span class="primary">주: 원딜 (Silver II)</span>
                      <span class="secondary">부: 미드 (Silver III)</span>
                    </div>
                  </li>
                  <li>
                    <div class="playerName">플레이어14</div>
                    <div class="playerPositions">
                      <span class="primary">주: 정글 (Gold I)</span>
                      <span class="secondary">부: 서포트 (Gold II)</span>
                    </div>
                  </li>
                  <li>
                    <div class="playerName">플레이어15</div>
                    <div class="playerPositions">
                      <span class="primary">주: 서포트 (Bronze III)</span>
                      <span class="secondary">부: 탑 (Bronze IV)</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="team redTeam">
                <h3>레드 팀</h3>
                <ul class="playerList">
                  <li class="me">
                    <div class="playerName">플레이어1</div>
                    <div class="playerPositions">
                      <span class="primary">주: 미드 (Gold IV)</span>
                      <span class="secondary">부: 원딜 (Gold II)</span>
                    </div>
                  </li>
                  <li>
                    <div class="playerName">플레이어16</div>
                    <div class="playerPositions">
                      <span class="primary">주: 미드 (Silver I)</span>
                      <span class="secondary">부: 원딜 (Silver II)</span>
                    </div>
                  </li>
                  <li>
                    <div class="playerName">플레이어17</div>
                    <div class="playerPositions">
                      <span class="primary">주: 탑 (Platinum II)</span>
                      <span class="secondary">부: 정글 (Platinum III)</span>
                    </div>
                  </li>
                  <li>
                    <div class="playerName">플레이어18</div>
                    <div class="playerPositions">
                      <span class="primary">주: 원딜 (Gold II)</span>
                      <span class="secondary">부: 미드 (Gold III)</span>
                    </div>
                  </li>
                  <li>
                    <div class="playerName">플레이어19</div>
                    <div class="playerPositions">
                      <span class="primary">주: 정글 (Bronze I)</span>
                      <span class="secondary">부: 서포트 (Bronze II)</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- 매칭 시작 팝업 -->
   <div class="matchPopup" v-show="showPopup">
  <!-- <div class="matchPopup" v-show="true"> -->
    <div class="popupOverlay" @click="closeMatchPopup"></div>
    <div class="popupContent card customInputBox customCheckBox customSelectBox">
      <div class="popupTitle">
        <h2>내전 팀 매칭 설정</h2>
        <button type="button" class="popupClose" @click="closeMatchPopup">✕</button>
      </div>
      <div class="popupCont">
        <div class="mtTier">
          <div class="tierHeader">
            <div class="levelBox">내닉네임</div>
            <div class="highestTier">전체 최고 : 플래티넘</div>
          </div>
          
          <div class="positionGrid">
            <div class="positionItem">
              <div class="positionName">탑</div>
              <div class="positionTier">골드</div>
            </div>
            <div class="positionItem">
              <div class="positionName">정글</div>
              <div class="positionTier">골드</div>
            </div>
            <div class="positionItem">
              <div class="positionName">미드</div>
              <div class="positionTier">골드</div>
            </div>
            <div class="positionItem">
              <div class="positionName">원딜</div>
              <div class="positionTier">골드</div>
            </div>
            <div class="positionItem">
              <div class="positionName">서포트</div>
              <div class="positionTier">골드</div>
            </div>
          </div>
          
          <div class="selectedPositions">
            <div class="positionCard">
              <div class="cardInfo">
                <div class="cardTitle">미드</div>
                <div class="cardTier">골드</div>
              </div>
            </div>
            <div class="positionCard">
              <div class="cardInfo">
                <div class="cardTitle">원딜</div>
                <div class="cardTier">골드</div>
              </div>
            </div>
          </div>
        </div>
        <div class="participantStatus">
          <div>
            <div><strong>현재 참가자</strong> <span>{{ participantCount }}</span>명</div>
            <div><strong>매칭 가능팀</strong> <span>{{ matchableTeams }}</span>팀</div>
            <div><strong>여유인원</strong> <span>{{ remainingPlayers }}</span>명</div>
          </div>
          <div>
            ※ 10명당 1팀씩 매칭됩니다
          </div>
        </div>
        
        <!-- 친구 목록 섹션 -->
        <div class="friendSection">
          <div>
            <h3>친구 목록</h3>
            <div class="buttonGroup">
              <button type="button" @click="loadLastParticipants()">직전 참가자 불러오기</button>
              <button type="button" @click="openAddFriendPopup()">친구추가</button>
            </div>
          </div>
          <div class="friendList">
            <div 
              v-for="friend in friendList" 
              :key="friend.id"
              class="friendItem" 
              :class="{ active: isSelected(friend.id) }"
              @click="toggleParticipant(friend)"
            >
              <div>
                <div class="friendAvatar">
                  👤
                </div>
                <div class="friendInfo">
                  <div class="friendName">{{ friend.name }}</div>
                  <div class="friendTierInfo">
                    <span class="tierItem primary">주: {{ friend.primaryPos }} ({{ friend.primaryTier }})</span>
                    <span class="tierItem secondary">부: {{ friend.secondaryPos }} ({{ friend.secondaryTier }})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 선택된 참가자 목록 -->
        <div class="selectedParticipants">
          <h3>선택된 참가자</h3>
          <div>
            <div v-if="selectedParticipants.length === 0" style="text-align: center; padding: 20px; color: rgba(200, 170, 110, 0.5);">
              선택된 참가자가 없습니다
            </div>
            <div 
              v-for="participant in selectedParticipants" 
              :key="participant.id"
              class="selectedItem"
            >
              <div>
                <div>{{ participant.name }} ({{ participant.tier }})</div>
                <div>
                  <label>
                    <input 
                      type="radio" 
                      :name="`player${participant.id}Lock`" 
                      value="primary"
                      v-model="participant.positionLock"
                    > 주포지션
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      :name="`player${participant.id}Lock`" 
                      value="secondary"
                      v-model="participant.positionLock"
                    > 부포지션
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      :name="`player${participant.id}Lock`" 
                      value="none"
                      v-model="participant.positionLock"
                    > 고정해제
                  </label>
                </div>
              </div>
              <button 
                v-if="!participant.isMe" 
                type="button" 
                @click="removeParticipant(participant.id)"
              >
                삭제
              </button>
              <span 
                v-else 
                style="padding: 8px 16px; color: var(--lol-gold); font-size: 1.3rem; font-weight: 600;"
              >
                나
              </span>
            </div>
          </div>
        </div>
        
        <div class="matchBtnBox">
          <button type="button" class="fullBtn" @click="startMatching()" :disabled="isMatching">
            <span v-if="isMatching">매칭 중...</span>
            <span v-else>
              매칭 시작 ({{ participantCount }}명 | {{ matchableTeams }}팀)
            </span>
          </button>
        </div>
      </div><!--// popupCont -->
    </div>
  </div>

  <!-- 경기 결과 설정 팝업 -->
  <div class="matchPopup" v-show="showResultPopup">
    <div class="popupOverlay" @click="closeResultPopup()"></div>
    <div class="popupContent card">
      <div class="popupTitle">
        <h2>경기 결과 설정</h2>
        <p>내가 속한 팀의 경기 결과를 선택하세요.</p>
      </div>
      <div class="resultButtons">
        <button type="button" class="resultBtn winBtn" @click="closeResultPopup()">
          <span class="resultIcon">🏆</span>
          <span>승리</span>
        </button>
        <button type="button" class="resultBtn lossBtn" @click="closeResultPopup()">
          <span class="resultIcon">💔</span>
          <span>패배</span>
        </button>
      </div>
      <button type="button" class="popupClose" @click="closeResultPopup()">×</button>
    </div>
  </div>

  <!-- 매칭 결과 팝업 -->
  <div class="matchPopup" v-show="showMatchResultPopup">
    <div class="popupOverlay" @click="closeMatchResultPopup"></div>
    <div class="popupContent card">
      <div class="popupTitle">
        <h2>매칭 결과</h2>
        <button type="button" class="popupClose" @click="closeMatchResultPopup">✕</button>
      </div>
      <div class="popupCont">
        <div class="matchResultBox">
          <!-- 팀 탭 (여러 팀일 경우) -->
          <div class="teamTabs" v-if="matchResults.length > 1">
            <button 
              v-for="(result, index) in matchResults" 
              :key="index"
              class="teamTab"
              :class="{ active: currentTeamTab === index }"
              @click="currentTeamTab = index"
            >
              {{ result.teamNumber }}팀
            </button>
          </div>
          
          <!-- 현재 선택된 팀 결과 -->
          <div v-if="matchResults[currentTeamTab]">
            <div class="balanceScore">
              <span>팀 밸런스 점수</span>
              <strong>{{ matchResults[currentTeamTab].balanceScore }}/100</strong>
            </div>
            
            <div class="teamsResult">
              <div class="teamResult blueTeam">
                <h3>블루 팀</h3>
                <ul>
                  <li v-for="player in matchResults[currentTeamTab].blueTeam" :key="player.id">
                    {{ player.name }} ({{ player.tier }})
                    <span v-if="player.isMe" class="meTag">나</span>
                  </li>
                </ul>
              </div>
              
              <div class="teamResult redTeam">
                <h3>레드 팀</h3>
                <ul>
                  <li v-for="player in matchResults[currentTeamTab].redTeam" :key="player.id">
                    {{ player.name }} ({{ player.tier }})
                    <span v-if="player.isMe" class="meTag">나</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <!-- 미매칭 참가자 -->
          <div class="unmatchedPlayers" v-if="unmatchedPlayers.length > 0">
            <h3>미매칭 인원 ({{ unmatchedPlayers.length }}명)</h3>
            <ul>
              <li v-for="player in unmatchedPlayers" :key="player.id">
                {{ player.name }} ({{ player.tier }})
                <span v-if="player.isMe" class="meTag">나</span>
              </li>
            </ul>
          </div>
          
          <div class="matchBtnBox">
            <button type="button" class="fullBtn" @click="closeMatchResultPopup">확인</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 친구 추가 팝업 -->
  <div class="addFriendPopup" v-show="showAddFriendPopup">
    <div class="popupOverlay" @click="closeAddFriendPopup()"></div>
    <div class="popupContent card customInputBox">
      <div class="popupTitle">
        <h2>친구 추가</h2>
        <button type="button" class="popupClose" @click="closeAddFriendPopup()">✕</button>
      </div>
      <div class="popupCont">
        <div class="addFriendForm">
          <label>친구 아이디</label>
          <div class="inputWithBtn">
            <input 
              type="text" 
              v-model="friendIdInput" 
              placeholder="아이디를 입력하세요"
              @keyup.enter="addFriend()"
            />
            <button type="button" class="fullBtn" @click="addFriend()">추가</button>
          </div>
          <div class="friendErrorMsg" v-if="friendError">{{ friendError }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- 친구 목록 팝업 -->
  <div class="addFriendPopup" v-show="showFriendListPopup">
    <div class="popupOverlay" @click="closeFriendListPopup()"></div>
    <div class="popupContent card customInputBox friendListWide">
      <div class="popupTitle">
        <h2>친구 목록</h2>
        <button type="button" class="popupClose" @click="closeFriendListPopup()">✕</button>
      </div>
      <div class="popupCont">
        <div class="friendSection">
          <div class="friendSearchBox">
            <input 
              type="text" 
              v-model="friendSearchQuery" 
              placeholder="플레이어 이름 입력"
              class="friendSearchInput"
              @keyup.enter="addFriendFromSearch()"
            />
            <button type="button" class="addFriendBtn" @click="addFriendFromSearch()">
              ➕ 친구 추가
            </button>
          </div>
          <div class="friendListHeader">
            <span>전체 친구 ({{ filteredFriendList.length }}명)</span>
          </div>
          <div class="friendList">
            <div 
              v-for="friend in filteredFriendList" 
              :key="friend.id"
              class="friendItem"
            >
              <div>
                <div class="friendAvatar">
                  👤
                </div>
                <div class="friendInfo">
                  <div class="friendName">{{ friend.name }}</div>
                  <div class="friendTierInfo">
                    <span class="tierItem primary">주: {{ friend.primaryPos }} ({{ friend.primaryTier }})</span>
                    <span class="tierItem secondary">부: {{ friend.secondaryPos }} ({{ friend.secondaryTier }})</span>
                  </div>
                </div>
                <button type="button" class="friendDeleteBtn" @click="removeFriend(friend.id)">
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
