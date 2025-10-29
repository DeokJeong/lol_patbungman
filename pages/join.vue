<template>
  <div class="container joinWrap card customInputBox customCheckBox customSelectBox">
    <form action="">
      <div class="sectionTitle">
        <h2>회원가입</h2>
      </div>
      <div class="sectionContent">
        <div class="subTitle">
          <p>기본정보</p>
        </div>
        <ul class="flexColumn">
          <li class="pointInputField">
            <label for="userId">아이디</label>
            <input type="text" name="userId" id="userId" autocomplete="userId" placeholder="아이디를 입력해주세요">
          </li>
          <!-- <li class="pointInputField">
            <label for="userEmail">이메일</label>
            <input type="email" name="userEmail" id="userEmail" autocomplete="userEmail" placeholder=" ">
          </li> -->
          <li class="pointInputField">
            <label for="userPw">비밀번호</label>
            <input type="password" name="userPw" id="userPw" autocomplete="new-password" placeholder="비밀번호를 입력해주세요">
          </li>
          <li class="pointInputField">
            <label for="userRePw">비밀번호 재입력</label>
            <input type="password" name="userRePw" id="userRePw" autocomplete="new-password" placeholder="비밀번호를 다시 입력해주세요">
          </li> 
        </ul>
      </div>
      <div class="sectionContent">
        <div class="subTitle">
          <p>주라인 & 부라인</p>
        </div>
        <ul class="flexColumn">
          <li class="pointInputField">
            <label for="userId">주 라인</label>
            <select name="mainLine" id="mainLine">
              <option value="" selected hidden>주 라인을 선택해주세요.</option>
              <option value="top">탑</option>
              <option value="top">정글</option>
              <option value="top">미드</option>
              <option value="top">원딜</option>
              <option value="top">서포트</option>
            </select>
          </li>
          <li class="pointInputField">
            <label for="subLine">부 라인</label>
            <select name="subLine" id="subLine">
              <option value="" selected hidden>부 라인을 선택해주세요.</option>
              <option value="top">탑</option>
              <option value="top">정글</option>
              <option value="top">미드</option>
              <option value="top">원딜</option>
              <option value="top">서포트</option>
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
            <label for="userId">탑</label>
            <select name="mainLine" id="mainLine">
              <option value="" selected hidden>티어를 입력해주세요.</option>
              <option value="top">아이언</option>
              <option value="top">브론즈</option>
              <option value="top">실버</option>
              <option value="top">골드</option>
              <option value="top">플래티넘</option>
              <option value="top">다이아</option>
              <option value="top">마스터</option>
              <option value="top">그랜드마스터</option>
              <option value="top">챌린저</option>
            </select>
          </li>
          <li class="pointInputField">
            <label for="subLine">정글</label>
            <select name="subLine" id="subLine">
              <option value="" selected hidden>티어를 입력해주세요.</option>
              <option value="top">아이언</option>
              <option value="top">브론즈</option>
              <option value="top">실버</option>
              <option value="top">골드</option>
              <option value="top">플래티넘</option>
              <option value="top">다이아</option>
              <option value="top">마스터</option>
              <option value="top">그랜드마스터</option>
              <option value="top">챌린저</option>
            </select>
          </li>
          <li class="pointInputField">
            <label for="subLine">미드</label>
            <select name="subLine" id="subLine">
              <option value="" selected hidden>티어를 입력해주세요.</option>
              <option value="top">아이언</option>
              <option value="top">브론즈</option>
              <option value="top">실버</option>
              <option value="top">골드</option>
              <option value="top">플래티넘</option>
              <option value="top">다이아</option>
              <option value="top">마스터</option>
              <option value="top">그랜드마스터</option>
              <option value="top">챌린저</option>
            </select>
          </li>
          <li class="pointInputField">
            <label for="subLine">원딜</label>
            <select name="subLine" id="subLine">
              <option value="" selected hidden>티어를 입력해주세요.</option>
              <option value="top">아이언</option>
              <option value="top">브론즈</option>
              <option value="top">실버</option>
              <option value="top">골드</option>
              <option value="top">플래티넘</option>
              <option value="top">다이아</option>
              <option value="top">마스터</option>
              <option value="top">그랜드마스터</option>
              <option value="top">챌린저</option>
            </select>
          </li>
          <li class="pointInputField">
            <label for="subLine">서포트</label>
            <select name="subLine" id="subLine">
              <option value="" selected hidden>티어를 입력해주세요.</option>
              <option value="top">아이언</option>
              <option value="top">브론즈</option>
              <option value="top">실버</option>
              <option value="top">골드</option>
              <option value="top">플래티넘</option>
              <option value="top">다이아</option>
              <option value="top">마스터</option>
              <option value="top">그랜드마스터</option>
              <option value="top">챌린저</option>
            </select>
          </li>
        </ul>
      </div>
      <button type="submit" class="fullBtn">회원가입</button>
    </form>

  </div>
</template>

<script lang="ts" setup>

</script>

<style></style>