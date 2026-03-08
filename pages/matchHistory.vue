<script setup>
// 경기 결과 팝업
const showResultPopup = ref(false)

const openResultPopup = () => {
  showResultPopup.value = true
  document.body.style.overflow = 'hidden'
}

const closeResultPopup = () => {
  showResultPopup.value = false
  document.body.style.overflow = ''
}

// 전체 매칭 기록 (임시 데이터)
const matchHistory = ref([
  {
    id: 1,
    date: '2024-06-15 20:30',
    result: '승리',
    balanceScore: 92,
    blueTeam: [
      { name: '플레이어1', primaryPos: '미드', primaryTier: 'Gold IV', secondaryPos: '원딜', secondaryTier: 'Gold II', isMe: true },
      { name: '플레이어2', primaryPos: '탑', primaryTier: 'Silver I', secondaryPos: '정글', secondaryTier: 'Silver III' },
      { name: '플레이어3', primaryPos: '원딜', primaryTier: 'Platinum III', secondaryPos: '서포트', secondaryTier: 'Platinum IV' },
      { name: '플레이어4', primaryPos: '정글', primaryTier: 'Gold II', secondaryPos: '탑', secondaryTier: 'Gold III' },
      { name: '플레이어5', primaryPos: '서포트', primaryTier: 'Bronze I', secondaryPos: '미드', secondaryTier: 'Bronze II' }
    ],
    redTeam: [
      { name: '플레이어6', primaryPos: '미드', primaryTier: 'Gold I', secondaryPos: '정글', secondaryTier: 'Gold II' },
      { name: '플레이어7', primaryPos: '탑', primaryTier: 'Silver II', secondaryPos: '원딜', secondaryTier: 'Silver III' },
      { name: '플레이어8', primaryPos: '원딜', primaryTier: 'Platinum IV', secondaryPos: '미드', secondaryTier: 'Gold I' },
      { name: '플레이어9', primaryPos: '정글', primaryTier: 'Gold III', secondaryPos: '서포트', secondaryTier: 'Gold IV' },
      { name: '플레이어10', primaryPos: '서포트', primaryTier: 'Bronze II', secondaryPos: '탑', secondaryTier: 'Bronze III' }
    ]
  },
  {
    id: 2,
    date: '2024-06-14 19:15',
    result: '결과 미정',
    balanceScore: 88,
    blueTeam: [
      { name: '플레이어11', primaryPos: '미드', primaryTier: 'Platinum I', secondaryPos: '원딜', secondaryTier: 'Platinum III' },
      { name: '플레이어12', primaryPos: '탑', primaryTier: 'Gold III', secondaryPos: '정글', secondaryTier: 'Gold IV' },
      { name: '플레이어13', primaryPos: '원딜', primaryTier: 'Silver II', secondaryPos: '미드', secondaryTier: 'Silver III' },
      { name: '플레이어14', primaryPos: '정글', primaryTier: 'Gold I', secondaryPos: '서포트', secondaryTier: 'Gold II' },
      { name: '플레이어15', primaryPos: '서포트', primaryTier: 'Bronze III', secondaryPos: '탑', secondaryTier: 'Bronze IV' }
    ],
    redTeam: [
      { name: '플레이어1', primaryPos: '미드', primaryTier: 'Gold IV', secondaryPos: '원딜', secondaryTier: 'Gold II', isMe: true },
      { name: '플레이어16', primaryPos: '미드', primaryTier: 'Silver I', secondaryPos: '원딜', secondaryTier: 'Silver II' },
      { name: '플레이어17', primaryPos: '탑', primaryTier: 'Platinum II', secondaryPos: '정글', secondaryTier: 'Platinum III' },
      { name: '플레이어18', primaryPos: '원딜', primaryTier: 'Gold II', secondaryPos: '미드', secondaryTier: 'Gold III' },
      { name: '플레이어19', primaryPos: '정글', primaryTier: 'Bronze I', secondaryPos: '서포트', secondaryTier: 'Bronze II' }
    ]
  },
  {
    id: 3,
    date: '2024-06-13 21:45',
    result: '패배',
    balanceScore: 95,
    blueTeam: [
      { name: '플레이어1', primaryPos: '미드', primaryTier: 'Gold IV', secondaryPos: '원딜', secondaryTier: 'Gold II', isMe: true },
      { name: '플레이어3', primaryPos: '원딜', primaryTier: 'Platinum III', secondaryPos: '서포트', secondaryTier: 'Platinum IV' },
      { name: '플레이어5', primaryPos: '서포트', primaryTier: 'Bronze I', secondaryPos: '미드', secondaryTier: 'Bronze II' },
      { name: '플레이어7', primaryPos: '탑', primaryTier: 'Silver II', secondaryPos: '원딜', secondaryTier: 'Silver III' },
      { name: '플레이어9', primaryPos: '정글', primaryTier: 'Gold III', secondaryPos: '서포트', secondaryTier: 'Gold IV' }
    ],
    redTeam: [
      { name: '플레이어11', primaryPos: '미드', primaryTier: 'Platinum I', secondaryPos: '원딜', secondaryTier: 'Platinum III' },
      { name: '플레이어2', primaryPos: '탑', primaryTier: 'Silver I', secondaryPos: '정글', secondaryTier: 'Silver III' },
      { name: '플레이어4', primaryPos: '정글', primaryTier: 'Gold II', secondaryPos: '탑', secondaryTier: 'Gold III' },
      { name: '플레이어6', primaryPos: '미드', primaryTier: 'Gold I', secondaryPos: '정글', secondaryTier: 'Gold II' },
      { name: '플레이어8', primaryPos: '원딜', primaryTier: 'Platinum IV', secondaryPos: '미드', secondaryTier: 'Gold I' }
    ]
  },
  {
    id: 4,
    date: '2024-06-12 18:30',
    result: '승리',
    balanceScore: 90,
    blueTeam: [
      { name: '플레이어12', primaryPos: '탑', primaryTier: 'Gold III', secondaryPos: '정글', secondaryTier: 'Gold IV' },
      { name: '플레이어13', primaryPos: '원딜', primaryTier: 'Silver II', secondaryPos: '미드', secondaryTier: 'Silver III' },
      { name: '플레이어14', primaryPos: '정글', primaryTier: 'Gold I', secondaryPos: '서포트', secondaryTier: 'Gold II' },
      { name: '플레이어15', primaryPos: '서포트', primaryTier: 'Bronze III', secondaryPos: '탑', secondaryTier: 'Bronze IV' },
      { name: '플레이어1', primaryPos: '미드', primaryTier: 'Gold IV', secondaryPos: '원딜', secondaryTier: 'Gold II', isMe: true }
    ],
    redTeam: [
      { name: '플레이어16', primaryPos: '미드', primaryTier: 'Silver I', secondaryPos: '원딜', secondaryTier: 'Silver II' },
      { name: '플레이어17', primaryPos: '탑', primaryTier: 'Platinum II', secondaryPos: '정글', secondaryTier: 'Platinum III' },
      { name: '플레이어18', primaryPos: '원딜', primaryTier: 'Gold II', secondaryPos: '미드', secondaryTier: 'Gold III' },
      { name: '플레이어19', primaryPos: '정글', primaryTier: 'Bronze I', secondaryPos: '서포트', secondaryTier: 'Bronze II' },
      { name: '플레이어10', primaryPos: '서포트', primaryTier: 'Bronze II', secondaryPos: '탑', secondaryTier: 'Bronze III' }
    ]
  },
  {
    id: 5,
    date: '2024-06-11 20:00',
    result: '패배',
    balanceScore: 85,
    blueTeam: [
      { name: '플레이어2', primaryPos: '탑', primaryTier: 'Silver I', secondaryPos: '정글', secondaryTier: 'Silver III' },
      { name: '플레이어4', primaryPos: '정글', primaryTier: 'Gold II', secondaryPos: '탑', secondaryTier: 'Gold III' },
      { name: '플레이어6', primaryPos: '미드', primaryTier: 'Gold I', secondaryPos: '정글', secondaryTier: 'Gold II' },
      { name: '플레이어8', primaryPos: '원딜', primaryTier: 'Platinum IV', secondaryPos: '미드', secondaryTier: 'Gold I' },
      { name: '플레이어10', primaryPos: '서포트', primaryTier: 'Bronze II', secondaryPos: '탑', secondaryTier: 'Bronze III' }
    ],
    redTeam: [
      { name: '플레이어1', primaryPos: '미드', primaryTier: 'Gold IV', secondaryPos: '원딜', secondaryTier: 'Gold II', isMe: true },
      { name: '플레이어3', primaryPos: '원딜', primaryTier: 'Platinum III', secondaryPos: '서포트', secondaryTier: 'Platinum IV' },
      { name: '플레이어5', primaryPos: '서포트', primaryTier: 'Bronze I', secondaryPos: '미드', secondaryTier: 'Bronze II' },
      { name: '플레이어7', primaryPos: '탑', primaryTier: 'Silver II', secondaryPos: '원딜', secondaryTier: 'Silver III' },
      { name: '플레이어9', primaryPos: '정글', primaryTier: 'Gold III', secondaryPos: '서포트', secondaryTier: 'Gold IV' }
    ]
  }
])
</script>

<template>
  <div class="container">
    <div class="mainWrap">
      <div class="nameCard">
        <h1>전체 매칭 기록</h1>
        <div>
          <p>총 <span>{{ matchHistory.length }}</span>개의 경기</p>
          <NuxtLink to="/main" class="backBtn">← 메인으로</NuxtLink>
        </div>
      </div>

      <div class="card matchRecordBox">
        <ul>
          <li v-for="match in matchHistory" :key="match.id" class="matchRecord">
            <div class="matchInfo between">
              <div>
                <p class="matchResult" :class="match.result === '승리' ? 'win' : match.result === '패배' ? 'loss' : 'pending'">
                  {{ match.result }}
                </p>
                <button type="button" @click="openResultPopup()">설정</button>
                <p class="matchBalance">팀 밸런스 점수: {{ match.balanceScore }}/100</p>
              </div>
              <p class="matchDate">{{ match.date }}</p>
            </div>
            <div class="teams">
              <div class="team blueTeam">
                <h3>블루 팀</h3>
                <ul class="playerList">
                  <li v-for="(player, index) in match.blueTeam" :key="index" :class="{ me: player.isMe }">
                    <div class="playerName">{{ player.name }}</div>
                    <div class="playerPositions">
                      <span class="primary">주: {{ player.primaryPos }} ({{ player.primaryTier }})</span>
                      <span class="secondary">부: {{ player.secondaryPos }} ({{ player.secondaryTier }})</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="team redTeam">
                <h3>레드 팀</h3>
                <ul class="playerList">
                  <li v-for="(player, index) in match.redTeam" :key="index" :class="{ me: player.isMe }">
                    <div class="playerName">{{ player.name }}</div>
                    <div class="playerPositions">
                      <span class="primary">주: {{ player.primaryPos }} ({{ player.primaryTier }})</span>
                      <span class="secondary">부: {{ player.secondaryPos }} ({{ player.secondaryTier }})</span>
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
</template>
