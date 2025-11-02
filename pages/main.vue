<script setup>
const showPopup = ref(false)
</script>
<template>
  <div class="container">
    <div class="mainWrap">
      <div class="nameCard">
        <h1>patbungman</h1>
        <div>
          <p>환영합니다! <span>플레이어이름</span>님</p>
          <button type="button">로그아웃</button>
        </div>
      </div>
      <div class="card customInputBox matchSystemBox">
        <div class="title">
          <h2>내전 자동 팀 매칭 시스템</h2>
          <p>10명 단위 5vs5 균형잡힌 팀을 자동으로 생성합니다.<br>티어 점수와 라인 가중치 기반으로 최적의 팀 밸런스를 제공하며, 후보자 관리와 실시간 교체가 가능합니다.</p>
        </div>
        <div class="matchBtnBox">
          <button type="button" class="fullBtn" @click="showPopup = true">팀 매칭 시작</button>
          <!-- <button type="button" class="fullBtn">관리자 설정</button> -->
        </div>
      </div>

      <div class="card matchRecordBox">
        <div class="title between">
          <h2>최근 팀 기록</h2>
          <NuxtLink to="#">전체보기</NuxtLink>
        </div>
        <ul>
          <li class="matchRecord">
            <div class="matchInfo between">
              <div>
                <p class="matchResult win">승리</p>
                <!-- <p class="matchResult loss">패배</p> -->
                <button type="button">설정</button>
              </div>
              <p class="matchDate">2024-06-15 20:30</p>
            </div>
            <div class="teams">
              <div class="team blueTeam">
                <h3>블루 팀</h3>
                <ul class="playerList">
                  <li class="me">플레이어1 (Gold IV)</li>
                  <li>플레이어2 (Silver I)</li>
                  <li>플레이어3 (Platinum III)</li>
                  <li>플레이어4 (Gold II)</li>
                  <li>플레이어5 (Bronze I)</li>
                </ul>
              </div>
              <div class="team redTeam">
                <h3>레드 팀</h3>
                <ul class="playerList">
                  <li>플레이어6 (Gold I)</li>
                  <li>플레이어7 (Silver II)</li>
                  <li>플레이어8 (Platinum IV)</li>
                  <li>플레이어9 (Gold III)</li>
                  <li>플레이어10 (Bronze II)</li>
                </ul>
              </div>
            </div>
            <p class="matchBalance">팀 밸런스 점수: 92/100</p>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div class="matchPopup" v-show="showPopup">
    <div class="popupOverlay" @click="showPopup = false"></div>
    <div class="popupContent card customInputBox customCheckBox customSelectBox">
      <div class="popupTitle">
        <h2>내전 팀 매칭 설정</h2>
        <p>내전에 참가할 플레이어들의 정보를 입력하고, 팀 매칭을 시작하세요.</p>
      </div>
      <button type="button" class="popupClose" @click="showPopup = false">×</button>
    </div>
  </div>
</template>
