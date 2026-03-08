<script setup>
// 티어별 점수 설정
const tierScores = ref({
  'Iron IV': 100,
  'Iron III': 150,
  'Iron II': 200,
  'Iron I': 250,
  'Bronze IV': 300,
  'Bronze III': 350,
  'Bronze II': 400,
  'Bronze I': 450,
  'Silver IV': 500,
  'Silver III': 550,
  'Silver II': 600,
  'Silver I': 650,
  'Gold IV': 700,
  'Gold III': 750,
  'Gold II': 800,
  'Gold I': 850,
  'Platinum IV': 900,
  'Platinum III': 950,
  'Platinum II': 1000,
  'Platinum I': 1050,
  'Diamond IV': 1100,
  'Diamond III': 1150,
  'Diamond II': 1200,
  'Diamond I': 1250
})

// 포지션별 가산점 (%)
const positionBonus = ref({
  '탑': 0,
  '정글': 0,
  '미드': 0,
  '원딜': 0,
  '서포트': 0
})

const saveSettings = () => {
  // TODO: API 호출하여 설정 저장
  alert('매칭 설정이 저장되었습니다')
}

const resetToDefault = () => {
  if (confirm('기본 설정으로 초기화하시겠습니까?')) {
    tierScores.value = {
      'Iron IV': 100,
      'Iron III': 150,
      'Iron II': 200,
      'Iron I': 250,
      'Bronze IV': 300,
      'Bronze III': 350,
      'Bronze II': 400,
      'Bronze I': 450,
      'Silver IV': 500,
      'Silver III': 550,
      'Silver II': 600,
      'Silver I': 650,
      'Gold IV': 700,
      'Gold III': 750,
      'Gold II': 800,
      'Gold I': 850,
      'Platinum IV': 900,
      'Platinum III': 950,
      'Platinum II': 1000,
      'Platinum I': 1050,
      'Diamond IV': 1100,
      'Diamond III': 1150,
      'Diamond II': 1200,
      'Diamond I': 1250
    }
    positionBonus.value = {
    '탑': 0,
    '정글': 0,
    '미드': 0,
    '원딜': 0,
    '서포트': 0
    }
  }
}

const goBack = () => {
  navigateTo('/main')
}
</script>

<template>
  <div class="container">
    <div class="mainWrap">
      <div class="nameCard">
        <h1>관리자 설정</h1>
        <div>
          <p>매칭 시스템의 티어 점수와 포지션 가산점을 설정합니다</p>
          <button type="button" class="backBtn" @click="goBack">← 메인으로</button>
        </div>
      </div>

      <div class="card customInputBox adminSettingsWrap">
        <!-- 포지션별 가산점 -->
        <div class="settingSection">
          <div class="settingHeader">
            <h2>포지션별 가산점</h2>
            <p>현재 시즌 메타에 따라 포지션별 가산점을 조정할 수 있습니다 (%)</p>
          </div>
          <div class="positionBonusGrid">
            <div v-for="(bonus, position) in positionBonus" :key="position" class="bonusItem">
              <label>{{ position }}</label>
              <div class="bonusControl">
                <input 
                  type="number" 
                  v-model.number="positionBonus[position]" 
                  :class="{'positive': bonus > 0, 'negative': bonus < 0, 'neutral': bonus === 0}"
                />
                <span class="bonusLabel">%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 티어별 점수 -->
        <div class="settingSection">
          <div class="settingHeader">
            <h2>티어별 기본 점수</h2>
            <p>각 티어의 기본 점수를 설정합니다 (매칭 밸런스 계산에 사용)</p>
          </div>
          <div class="tierScoreGrid">
            <div v-for="(score, tier) in tierScores" :key="tier" class="tierScoreItem">
              <label>{{ tier }}</label>
              <input type="number" v-model.number="tierScores[tier]" step="10" />
            </div>
          </div>
        </div>

        <!-- 버튼 그룹 -->
        <div class="adminButtonGroup">
          <button type="button" class="fullBtn" @click="saveSettings">저장</button>
          <button type="button" class="fullBtn resetBtn" @click="resetToDefault">기본값으로 초기화</button>
        </div>
      </div>
    </div>
  </div>
</template>
