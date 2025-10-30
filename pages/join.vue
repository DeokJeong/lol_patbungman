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
      <div class="sectionContent">
        <div class="subTitle">
          <p>질문&답변</p>
        </div>
        <ul class="flexColumn">
          <li>
            <label for="question">질문</label>
            <select name="subLine" id="question">
              <option value="" selected hidden>질문을 선택해주세요.</option>
              <option value="top">처음 키운 반려동물의 이름은?</option>
              <option value="top">다녔던 초등학교 이름은?</option>
              <option value="top">가장 좋아하는 음식은?</option>
              <option value="top">태어난 도시 이름은?</option>
              <option value="top">어릴 적 친구의 이름은?</option>
            </select>
          </li>
          <li>
            <label for="question2">답변</label>
            <input type="text" name="question2" id="question2" placeholder="답변을 입력해주세요">
          </li>
        </ul>
      </div>
      <div class="sectionContent">
        <div class="subTitle">
          <p>약관</p>
        </div>
        <ul class="flexColumn">
          <!-- 전체 동의 -->
          <li class="allAgreeBox checkboxWrap">
            <input type="checkbox" name="allAgree" id="allAgree">
            <label for="allAgree">전체 약관에 동의합니다</label>
          </li>
          
          <!-- 필수 약관들 -->
          <li class="termsItem">
            <div class="checkboxWrap">
              <input type="checkbox" name="serviceTerms" id="serviceTerms" required>
              <label for="serviceTerms">[필수] 서비스 이용약관 동의</label>
            </div>
            <button type="button" class="termsViewBtn">보기</button>
          </li>
          
          <li class="termsItem">
            <div class="checkboxWrap">
              <input type="checkbox" name="privacyTerms" id="privacyTerms" required>
              <label for="privacyTerms">[필수] 개인정보 수집 및 이용 동의</label>
            </div>
            <button type="button" class="termsViewBtn">보기</button>
          </li>
          
          <li class="termsItem">
            <div class="checkboxWrap">
              <input type="checkbox" name="ageTerms" id="ageTerms" required>
              <label for="ageTerms">[필수] 만 14세 이상입니다</label>
            </div>
          </li>
          
          <!-- 선택 약관들 -->
          <li class="termsItem">
            <div class="checkboxWrap">
              <input type="checkbox" name="marketingTerms" id="marketingTerms">
              <label for="marketingTerms">[선택] 마케팅 정보 수신 동의</label>
            </div>
            <button type="button" class="termsViewBtn">보기</button>
          </li>
          
          <li class="termsItem">
            <div class="checkboxWrap">
              <input type="checkbox" name="eventTerms" id="eventTerms">
              <label for="eventTerms">[선택] 이벤트 및 혜택 알림 동의</label>
            </div>
            <button type="button" class="termsViewBtn">보기</button>
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