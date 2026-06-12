<script setup>
const showResultPopup = ref(false)
const riotPuuid = ref('')
const riotMatches = ref([])
const isLoadingMatches = ref(false)
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

const {
  endpoint,
  parseRiotId,
  buildRiotIdKey,
  getMatchHistory
} = useMatchApi()

const loadRiotProfile = async () => {
  try {
    const profile = authStore.user || await authStore.fetchProfile()
    riotPuuid.value = profile?.puuid || profile?.riot_puuid || ''
    myMainLine.value = profile?.main_line || profile?.mainLine || ''
    mySubLine.value = profile?.sub_line || profile?.subLine || ''
    myTierByLine.value = buildTierByLine(profile)
  } catch {
    riotPuuid.value = ''
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

const formatGameDate = (timestamp) => {
  if (!timestamp) {
    return '-'
  }
  return new Date(timestamp).toLocaleString('ko-KR')
}

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

const buildTierByLine = (source) => {
  return {
    top: source?.tier_top || source?.tierTop || source?.topTier || '',
    jungle: source?.tier_jungle || source?.tierJungle || source?.jungleTier || '',
    mid: source?.tier_mid || source?.tierMid || source?.midTier || '',
    adc: source?.tier_adc || source?.tierAdc || source?.adcTier || '',
    support: source?.tier_support || source?.tierSupport || source?.supportTier || ''
  }
}

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

        nextMap[buildRiotIdKey(gameName, tagLine)] = {
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
    return { main: '', sub: '' }
  }

  const friendLine = friendLineMap.value[buildRiotIdKey(parsed.gameName, parsed.tagLine)]
  if (!friendLine) {
    return { main: '', sub: '' }
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

const getParticipantName = (participant) => {
  const riotIdGameName = participant?.riotIdGameName || participant?.riot_id_game_name || participant?.gameName
  const riotIdTagline = participant?.riotIdTagline || participant?.riot_id_tagline || participant?.tagLine

  if (riotIdGameName) {
    return riotIdTagline ? `${riotIdGameName}#${riotIdTagline}` : riotIdGameName
  }

  if (participant?.summonerName) {
    return participant.summonerName
  }

  if (participant?.summoner_name) {
    return participant.summoner_name
  }

  if (participant?.name) {
    return participant.name
  }

  return 'Unknown'
}

const toPlayerView = (participant) => {
  const summonerName = getParticipantName(participant)
  const profileLineTexts = getPlayerProfileLineTexts(participant, summonerName)

  return {
    puuid: participant?.puuid || '',
    summonerName,
    championName: participant?.championName || participant?.champion_name || '-',
    teamPosition: participant?.teamPosition || participant?.team_position || '',
    matchLine: formatPosition(participant?.teamPosition || participant?.team_position),
    profileMainLine: profileLineTexts.main,
    profileSubLine: profileLineTexts.sub,
    kills: participant?.kills ?? 0,
    deaths: participant?.deaths ?? 0,
    assists: participant?.assists ?? 0
  }
}

const extractMatches = (response) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.results)) return response.results
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.items)) return response.items
  if (Array.isArray(response?.matches)) return response.matches
  return []
}

const normalizeMatch = (rawMatch, index) => {
  const participants = Array.isArray(rawMatch?.participants)
    ? rawMatch.participants
    : Array.isArray(rawMatch?.players)
      ? rawMatch.players
      : []

  const blueTeam = Array.isArray(rawMatch?.blueTeam)
    ? rawMatch.blueTeam
    : participants.filter((participant) => participant?.teamId === 100 || participant?.team === 'blue')

  const redTeam = Array.isArray(rawMatch?.redTeam)
    ? rawMatch.redTeam
    : participants.filter((participant) => participant?.teamId === 200 || participant?.team === 'red')

  const me = [...blueTeam, ...redTeam].find((participant) => participant?.puuid === riotPuuid.value)

  return {
    matchId: rawMatch?.matchId || rawMatch?.match_id || rawMatch?.id || `match-${index}`,
    gameMode: rawMatch?.gameMode || rawMatch?.game_mode || '-',
    gameCreation: rawMatch?.gameCreation || rawMatch?.game_creation || rawMatch?.created_at || 0,
    championName: me?.championName || me?.champion_name || rawMatch?.championName || rawMatch?.champion_name || '-',
    kills: me?.kills ?? rawMatch?.kills ?? 0,
    deaths: me?.deaths ?? rawMatch?.deaths ?? 0,
    assists: me?.assists ?? rawMatch?.assists ?? 0,
    win: typeof rawMatch?.win === 'boolean' ? rawMatch.win : Boolean(me?.win),
    blueTeam: blueTeam.map(toPlayerView),
    redTeam: redTeam.map(toPlayerView)
  }
}

const fetchMatches = async () => {
  if (!riotPuuid.value) {
    matchesError.value = '프로필 puuid가 없습니다. 백엔드 프로필 응답에 puuid를 포함해주세요.'
    riotMatches.value = []
    return
  }

  isLoadingMatches.value = true
  matchesError.value = ''

  try {
    const response = await getMatchHistory()
    const rawMatches = extractMatches(response).slice(0, recentMatchCount)
    riotMatches.value = rawMatches.map((rawMatch, index) => normalizeMatch(rawMatch, index))
  } catch {
    matchesError.value = '매칭 기록 조회에 실패했습니다. 백엔드 응답 스펙을 확인해주세요.'
    riotMatches.value = []
  } finally {
    isLoadingMatches.value = false
  }
}

const openResultPopup = () => {
  showResultPopup.value = true
  document.body.style.overflow = 'hidden'
}

const closeResultPopup = () => {
  showResultPopup.value = false
  document.body.style.overflow = ''
}

const openNameTooltip = (event, name) => {
  const rect = event.currentTarget.getBoundingClientRect()
  nameTooltip.value = {
    visible: true,
    text: name,
    x: rect.left + (rect.width / 2),
    y: rect.top - 8
  }
}

const closeNameTooltip = () => {
  if (!nameTooltip.value.visible) {
    return
  }
  nameTooltip.value.visible = false
}

onMounted(async () => {
  document.addEventListener('click', closeNameTooltip)
  loadFriendLineMap()
  await loadRiotProfile()
})

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
          <h2>매칭 기록 조회</h2>
        </div>
        <button type="button" class="fullBtn" :disabled="isLoadingMatches" @click="fetchMatches">
          {{ isLoadingMatches ? '조회중...' : '최근 10경기 조회' }}
        </button>
        <p>예정 호출 경로: {{ endpoint }}</p>
        <p v-if="riotPuuid">프로필 puuid: {{ riotPuuid }}</p>
        <p v-else>백엔드 프로필 puuid가 아직 없습니다.</p>
        <p v-if="isLoadingMatches">매칭 기록 조회중...</p>
        <p v-if="matchesError">{{ matchesError }}</p>
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
