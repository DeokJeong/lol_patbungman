<script setup>
import { ref } from 'vue';

// 비밀번호 보이기/숨기기 기능
const userPwInput = ref(null);
const isPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;

  if (userPwInput.value) {
    if (isPasswordVisible.value) {
      userPwInput.value.type = 'text'; 
    } else {
      userPwInput.value.type = 'password'; 
    }
  }
};
</script>

<template>
  <div class="container">
    <div class="loginBox card pointInputDesign customCheckBox">
      <form action="">
        <ul>
          <li class="pointInputField">
            <input type="text" name="userId" id="userId" autocomplete="userId" placeholder=" ">
            <label for="userId">아이디</label>
          </li>
          <li class="pointInputField">
            <input type="password" name="userPw" id="userPw" autocomplete="userPw" ref="userPwInput" placeholder=" ">
            <label for="userPw">비밀번호</label>
            <button 
              type="button" 
              class="pwEyeIcon"
              @click="togglePasswordVisibility"
              :aria-pressed="isPasswordVisible"
              :aria-label="isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'"
            >
              {{ isPasswordVisible ? '👁️' : '👁️‍🗨️' }} 
            </button>
          </li>
        </ul>
        <div class="saveIdBox checkboxWrap">
          <input type="checkbox" name="saveId" id="saveId" autocomplete="off">
          <label for="saveId">아이디 저장</label>
        </div>
        <button type="submit" class="fullBtn">로그인</button>
        <div class="linkBox">
          <NuxtLink to="/find-id">아이디 찾기</NuxtLink>
          <NuxtLink to="/find-password">비밀번호 찾기</NuxtLink>
          <NuxtLink to="/join">회원가입</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>
