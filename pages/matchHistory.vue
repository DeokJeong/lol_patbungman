<script setup>
// 경기 결과 팝업
const showResultPopup = ref(false)
const riotGameName = ref('')
const riotTagLine = ref('')
const riotServer = ref('')
const riotPuuid = ref('')
const riotMatchIds = ref([])
const riotMatches = ref([])
const riotNameCache = ref({})
const isLoadingPuuid = ref(false)
const isLoadingMatches = ref(false)
const puuidError = ref('')
const matchesError = ref('')
const recentMatchCount = 10
const myMainLine = ref('')
const mySubLine = ref('')
const myTierByLine = ref({
  top: '',
  jungle: '',
  mid: '',
  adc: '',
  support: ''
})
const friendLineMap = ref({})
const nameTooltip = ref({
  visible: false,
  text: '',
  x: 0,
  y: 0
})
const authStore = useAuthStore()
const temporaryRiotProfile = {
  gameName: '마음만은 청춘',
  tagLine: '나 젊어요',
  server: 'asia'
}

// 프로필의 Riot 정보 로드 (없으면 임시값 사용)
const loadRiotProfile = async () => {
  try {
    const profile = authStore.user || await authStore.fetchProfile()
    riotGameName.value = profile?.riot_game_name || profile?.game_name || temporaryRiotProfile.gameName
    riotTagLine.value = profile?.riot_tag_line || profile?.tag_line || temporaryRiotProfile.tagLine
    riotServer.value = profile?.riot_server || profile?.server || temporaryRiotProfile.server
    myMainLine.value = profile?.main_line || profile?.mainLine || ''
    mySubLine.value = profile?.sub_line || profile?.subLine || ''
    myTierByLine.value = buildTierByLine(profile)
  } catch {
    riotGameName.value = temporaryRiotProfile.gameName
    riotTagLine.value = temporaryRiotProfile.tagLine
    riotServer.value = temporaryRiotProfile.server
    myMainLine.value = ''
    mySubLine.value = ''
    myTierByLine.value = {
      top: '',
      jungle: '',
      mid: '',
      adc: '',
      support: ''
    }
  }
}

const {
  endpoint,
  parseRiotId,
  buildRiotIdKey,
  getPuuidByRiotId,
  getAccountByPuuid,
  getMatchIdsByPuuid,
  getMatchDetailByMatchId
} = useMatchApi()

// 매치 시간 포맷
const formatGameDate = (timestamp) => {
  if (!timestamp) {
    return '-'
  }
  return new Date(timestamp).toLocaleString('ko-KR')
}

// Riot 포지션 코드를 한글 라인명으로 변환
const formatPosition = (position) => {
  const map = {
    TOP: '탑',
    JUNGLE: '정글',
    MIDDLE: '미드',
    BOTTOM: '원딜',
    UTILITY: '서포트'
  }
  return map[position] || '기타'
}

// 라인명을 비교 가능한 키(top/jungle/mid/adc/support)로 정규화
const normalizeLineKey = (line) => {
  const value = String(line || '').trim().toLowerCase()

  const map = {
    top: 'top',
    탑: 'top',
    jungle: 'jungle',
    jg: 'jungle',
    정글: 'jungle',
    mid: 'mid',
    middle: 'mid',
    미드: 'mid',
    adc: 'adc',
    bottom: 'adc',
    bot: 'adc',
    원딜: 'adc',
    support: 'support',
    sup: 'support',
    utility: 'support',
    서포트: 'support'
  }

  return map[value] || ''
}

// 라인 키를 화면용 한글명으로 변환
const formatLineLabel = (line) => {
  const key = normalizeLineKey(line)
  const map = {
    top: '탑',
    jungle: '정글',
    mid: '미드',
    adc: '원딜',
    support: '서포트'
  }

  return map[key] || String(line || '').trim() || '-'
}

// 라인+티어 문구 생성 (예: 주: 원딜 (Platinum III))
const formatLineTierText = (prefix, line, tier) => {
  if (!line) {
    return ''
  }

  const lineLabel = formatLineLabel(line)
  const trimmedTier = String(tier || '').trim()

  if (trimmedTier) {
    return `${prefix}: ${lineLabel} (${trimmedTier})`
  }

  return `${prefix}: ${lineLabel}`
}

// 객체에서 라인별 티어 정보 추출
const buildTierByLine = (source) => {
  return {
    top: source?.tier_top || source?.tierTop || source?.topTier || '',
    jungle: source?.tier_jungle || source?.tierJungle || source?.jungleTier || '',
    mid: source?.tier_mid || source?.tierMid || source?.midTier || '',
    adc: source?.tier_adc || source?.tierAdc || source?.adcTier || '',
    support: source?.tier_support || source?.tierSupport || source?.supportTier || ''
  }
}

// 주/부 라인 표시 문자열 생성
const formatMainSubLine = (mainLine, subLine) => {
  if (!mainLine && !subLine) {
    return ''
  }

  if (mainLine && subLine) {
    return `주: ${mainLine} / 부: ${subLine}`
  }

  if (mainLine) {
    return `주: ${mainLine}`
  }

  return `부: ${subLine}`
}

// 저장된 친구 라인 정보 로드 (localStorage 사용)
const loadFriendLineMap = () => {
  if (!import.meta.client) {
    return
  }

  const keys = ['friend_list', 'friends']

  for (const key of keys) {
    const raw = localStorage.getItem(key)
    if (!raw) {
      continue
    }

    try {
      const list = JSON.parse(raw)
      if (!Array.isArray(list)) {
        continue
      }

      const nextMap = {}
      for (const friend of list) {
        const gameName = friend?.riot_game_name || friend?.game_name || friend?.riotGameName
        const tagLine = friend?.riot_tag_line || friend?.tag_line || friend?.riotTagLine
        const mainLine = friend?.main_line || friend?.mainLine || friend?.primaryPos
        const subLine = friend?.sub_line || friend?.subLine || friend?.secondaryPos
        const mainTier = friend?.main_tier || friend?.mainTier || friend?.primaryTier || ''
        const subTier = friend?.sub_tier || friend?.subTier || friend?.secondaryTier || ''
        const tierByLine = buildTierByLine(friend)

        if (!gameName || !tagLine) {
          continue
        }

        const friendKey = buildRiotIdKey(gameName, tagLine)
        nextMap[friendKey] = {
          mainLine: mainLine || '',
          subLine: subLine || '',
          mainTier,
          subTier,
          tierByLine
        }
      }

      friendLineMap.value = nextMap
      return
    } catch {
      continue
    }
  }
}

// 본인/친구 여부에 따라 회원가입 기준 주/부 라인 문구 생성
const getPlayerProfileLineTexts = (participant, summonerName) => {
  if (participant?.puuid === riotPuuid.value) {
    const mainKey = normalizeLineKey(myMainLine.value)
    const subKey = normalizeLineKey(mySubLine.value)
    const mainTier = mainKey ? myTierByLine.value[mainKey] : ''
    const subTier = subKey ? myTierByLine.value[subKey] : ''

    return {
      main: formatLineTierText('주', myMainLine.value, mainTier),
      sub: formatLineTierText('부', mySubLine.value, subTier)
    }
  }

  const parsed = parseRiotId(summonerName)
  if (!parsed) {
    return ''
  }

  const key = buildRiotIdKey(parsed.gameName, parsed.tagLine)
  const friendLine = friendLineMap.value[key]

  if (!friendLine) {
    return {
      main: '',
      sub: ''
    }
  }

  const mainKey = normalizeLineKey(friendLine.mainLine)
  const subKey = normalizeLineKey(friendLine.subLine)
  const mainTier = friendLine.mainTier || (mainKey ? friendLine?.tierByLine?.[mainKey] : '') || ''
  const subTier = friendLine.subTier || (subKey ? friendLine?.tierByLine?.[subKey] : '') || ''

  return {
    main: formatLineTierText('주', friendLine.mainLine, mainTier),
    sub: formatLineTierText('부', friendLine.subLine, subTier)
  }
}

// 참가자 표시 이름 결정
const getParticipantName = (participant) => {
  const riotIdGameName = participant?.riotIdGameName
  const riotIdTagline = participant?.riotIdTagline

  if (riotIdGameName) {
    return riotIdTagline ? `${riotIdGameName}#${riotIdTagline}` : riotIdGameName
  }

  if (participant?.summonerName) {
    return participant.summonerName
  }

  return riotNameCache.value[participant?.puuid] || 'Unknown'
}

// 참가자 화면 표시 데이터 가공
const toPlayerView = (participant) => {
  const summonerName = getParticipantName(participant)
  const profileLineTexts = getPlayerProfileLineTexts(participant, summonerName)

  return {
    puuid: participant?.puuid || '',
    summonerName,
    championName: participant?.championName || '-',
    teamPosition: participant?.teamPosition || '',
    matchLine: formatPosition(participant?.teamPosition),
    profileMainLine: profileLineTexts.main,
    profileSubLine: profileLineTexts.sub,
    kills: participant?.kills ?? 0,
    deaths: participant?.deaths ?? 0,
    assists: participant?.assists ?? 0
  }
}

// Riot ID -> puuid -> 최근 매치 상세 조회
const fetchPuuid = async () => {
  if (!riotGameName.value || !riotTagLine.value) {
    puuidError.value = 'Riot 게임이름/태그가 필요합니다.'
    riotPuuid.value = ''
    riotMatchIds.value = []
    riotMatches.value = []
    return
  }

  isLoadingPuuid.value = true
  puuidError.value = ''
  matchesError.value = ''

  try {
    const account = await getPuuidByRiotId(riotGameName.value, riotTagLine.value)
    riotPuuid.value = account.puuid
    riotMatchIds.value = await getMatchIdsByPuuid(account.puuid, { count: recentMatchCount })

    isLoadingMatches.value = true
    const idsForDetail = riotMatchIds.value.slice(0, recentMatchCount)
    const details = await Promise.all(idsForDetail.map((matchId) => getMatchDetailByMatchId(matchId)))

    const allParticipants = details.flatMap((detail) => {
      if (!Array.isArray(detail?.info?.participants)) {
        return []
      }
      return detail.info.participants
    })

    const unknownPuuids = [...new Set(allParticipants
      .filter((participant) => !participant?.riotIdGameName && !participant?.summonerName)
      .map((participant) => participant?.puuid)
      .filter(Boolean))]

    if (unknownPuuids.length) {
      const resolvedNameEntries = await Promise.all(unknownPuuids.map(async (puuid) => {
        try {
          const account = await getAccountByPuuid(puuid)
          const fallbackName = account?.gameName
            ? `${account.gameName}${account?.tagLine ? `#${account.tagLine}` : ''}`
            : 'Unknown'

          return [puuid, fallbackName]
        } catch {
          return [puuid, 'Unknown']
        }
      }))

      riotNameCache.value = {
        ...riotNameCache.value,
        ...Object.fromEntries(resolvedNameEntries)
      }
    }

    riotMatches.value = details.map((detail, index) => {
      const participants = Array.isArray(detail?.info?.participants) ? detail.info.participants : []
      const me = participants.find((participant) => participant?.puuid === account.puuid)
      const metadataMatchId = detail?.metadata?.matchId || idsForDetail[index]

      return {
        matchId: metadataMatchId,
        gameMode: detail?.info?.gameMode || '-',
        gameCreation: detail?.info?.gameCreation || 0,
        championName: me?.championName || '-',
        kills: me?.kills ?? 0,
        deaths: me?.deaths ?? 0,
        assists: me?.assists ?? 0,
        win: Boolean(me?.win),
        blueTeam: participants.filter((participant) => participant?.teamId === 100).map(toPlayerView),
        redTeam: participants.filter((participant) => participant?.teamId === 200).map(toPlayerView)
      }
    })
  } catch {
    puuidError.value = 'puuid 조회에 실패했습니다. 입력값 또는 API 키를 확인해주세요.'
    riotPuuid.value = ''
    riotMatchIds.value = []
    riotMatches.value = []
    matchesError.value = '매치 상세 조회에 실패했습니다.'
  } finally {
    isLoadingPuuid.value = false
    isLoadingMatches.value = false
  }
}

// 결과 팝업 열기
const openResultPopup = () => {
  showResultPopup.value = true
  document.body.style.overflow = 'hidden'
}

// 결과 팝업 닫기
const closeResultPopup = () => {
  showResultPopup.value = false
  document.body.style.overflow = ''
}

// 닉네임 툴팁 열기
const openNameTooltip = (event, name) => {
  const rect = event.currentTarget.getBoundingClientRect()
  nameTooltip.value = {
    visible: true,
    text: name,
    x: rect.left + (rect.width / 2),
    y: rect.top - 8
  }
}

// 닉네임 툴팁 닫기
const closeNameTooltip = () => {
  if (!nameTooltip.value.visible) {
    return
  }
  nameTooltip.value.visible = false
}

// 페이지 진입 시 이벤트 바인딩 및 프로필 로드
onMounted(async () => {
  document.addEventListener('click', closeNameTooltip)
  loadFriendLineMap()
  await loadRiotProfile()
})

// 페이지 이탈 시 이벤트 해제
onBeforeUnmount(() => {
  document.removeEventListener('click', closeNameTooltip)
})
</script>

<template>
  <div class="container">
    <div class="mainWrap">
      <div class="nameCard">
        <h1>전체 매칭 기록</h1>
        <div>
          <p>총 <span>{{ riotMatches.length }}</span>개의 경기 (최대 10개만 표시)</p>
          <NuxtLink to="/main" class="backBtn">← 메인으로</NuxtLink>
        </div>
      </div>

      <div class="card customInputBox">
        <div class="title between">
          <h2>Riot API 테스트</h2>
        </div>
        <p>게임이름: {{ riotGameName || '-' }}</p>
        <p>태그: {{ riotTagLine || '-' }}</p>
        <p>서버: {{ riotServer || '-' }}</p>
        <button type="button" class="fullBtn" :disabled="isLoadingPuuid" @click="fetchPuuid">
          {{ isLoadingPuuid ? '조회중...' : '최근 10경기 조회' }}
        </button>
        <p>예정 호출 경로: {{ endpoint }}</p>
        <p v-if="riotPuuid">조회된 puuid: {{ riotPuuid }}</p>
        <p v-if="puuidError">{{ puuidError }}</p>
        <p v-if="isLoadingMatches">매치 상세 조회중...</p>
        <p v-if="matchesError">{{ matchesError }}</p>
        <p v-if="riotMatchIds.length">최근 매치 ID {{ riotMatchIds.length }}개를 가져왔습니다.</p>
        <p>메모: 최근 10개의 기록을 보여줍니다.</p>
      </div>

      <div class="card matchRecordBox">
        <div v-if="!riotMatches.length" class="noRecord">
          현재 매칭 기록이 없습니다.
        </div>
        <ul v-else>
          <li v-for="match in riotMatches" :key="match.matchId" class="matchRecord">
            <div class="matchInfo between">
              <div>
                <p class="matchResult" :class="match.win ? 'win' : 'loss'">{{ match.win ? '승리' : '패배' }}</p>
                <!-- <button type="button" @click="openResultPopup()">설정</button> -->
                <p class="matchBalance">{{ match.gameMode }} | {{ match.championName }} | {{ match.kills }}/{{ match.deaths }}/{{ match.assists }}</p>
              </div>
              <p class="matchDate">{{ formatGameDate(match.gameCreation) }}</p>
            </div>
            <div class="teams">
              <div class="team blueTeam">
                <h3>블루 팀</h3>
                <ul class="playerList">
                  <li v-for="player in match.blueTeam" :key="player.puuid" :class="{ me: player.puuid === riotPuuid }">
                    <div
                      class="playerName"
                      tabindex="0"
                      @mouseenter="openNameTooltip($event, player.summonerName)"
                      @focus="openNameTooltip($event, player.summonerName)"
                      @click.stop="openNameTooltip($event, player.summonerName)"
                      @mouseleave="closeNameTooltip()"
                      @blur="closeNameTooltip()"
                    >{{ player.summonerName }}</div>
                    <div class="playerPositions">
                      <span class="primary">{{ player.matchLine }}</span>
                      <span v-if="player.profileMainLine" class="primary">{{ player.profileMainLine }}</span>
                      <span v-if="player.profileSubLine" class="primary">{{ player.profileSubLine }}</span>
                      <span class="secondary">KDA: {{ player.kills }}/{{ player.deaths }}/{{ player.assists }}</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="team redTeam">
                <h3>레드 팀</h3>
                <ul class="playerList">
                  <li v-for="player in match.redTeam" :key="player.puuid" :class="{ me: player.puuid === riotPuuid }">
                    <div
                      class="playerName"
                      tabindex="0"
                      @mouseenter="openNameTooltip($event, player.summonerName)"
                      @focus="openNameTooltip($event, player.summonerName)"
                      @click.stop="openNameTooltip($event, player.summonerName)"
                      @mouseleave="closeNameTooltip()"
                      @blur="closeNameTooltip()"
                    >{{ player.summonerName }}</div>
                    <div class="playerPositions">
                      <span class="primary">{{ player.matchLine }}</span>
                      <span v-if="player.profileMainLine" class="primary">{{ player.profileMainLine }}</span>
                      <span v-if="player.profileSubLine" class="primary">{{ player.profileSubLine }}</span>
                      <span class="secondary">KDA: {{ player.kills }}/{{ player.deaths }}/{{ player.assists }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div
        v-if="nameTooltip.visible"
        class="nameTooltip"
        :style="{ left: `${nameTooltip.x}px`, top: `${nameTooltip.y}px` }"
      >
        {{ nameTooltip.text }}
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

<style scoped>
.playerName {
  width: 140px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: help;
}

.nameTooltip {
  position: fixed;
  transform: translate(-50%, -100%);
  background: rgba(20, 24, 34, 0.95);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 12px;
  line-height: 1.2;
  z-index: 9999;
  pointer-events: none;
}

.nameTooltip::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: rgba(20, 24, 34, 0.95) transparent transparent transparent;
}
</style>
