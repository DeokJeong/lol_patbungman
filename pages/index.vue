<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

// 로그인 폼
const userId = ref('');
const userPw = ref('');
const errorMsg = ref('');
const isLoading = ref(false);

// 비밀번호 보이기/숨기기 기능
const userPwInput = ref<any>(null);
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

const handleLogin = async () => {
  errorMsg.value = '';
  if (!userId.value || !userPw.value) {
    errorMsg.value = '아이디와 비밀번호를 입력해주세요.';
    return;
  }
  isLoading.value = true;
  try {
    await authStore.login({ userId: userId.value, password: userPw.value });
    router.push('/main');
  } catch (e: any) {
    if (e?.response?.status === 401) {
      errorMsg.value = '아이디 또는 비밀번호가 올바르지 않습니다.';
    } else {
      errorMsg.value = '로그인 중 오류가 발생했습니다.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="container">
    <div class="loginBox card pointInputDesign customCheckBox">
      <form @submit.prevent="handleLogin">
        <ul>
          <li class="pointInputField">
            <input type="text" name="userId" id="userId" autocomplete="userId" placeholder=" " v-model="userId">
            <label for="userId">아이디</label>
          </li>
          <li class="pointInputField">
            <input type="password" name="userPw" id="userPw" autocomplete="userPw" ref="userPwInput" placeholder=" " v-model="userPw">
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
        <p v-if="errorMsg" class="errorMsg">{{ errorMsg }}</p>
        <div class="saveIdBox checkboxWrap">
          <input type="checkbox" name="saveId" id="saveId" autocomplete="off">
          <label for="saveId">아이디 저장</label>
        </div>
        <button type="submit" class="fullBtn" :disabled="isLoading">
          {{ isLoading ? '로그인 중...' : '로그인' }}
        </button>
        <div class="linkBox">
          <NuxtLink to="/join">회원가입</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>
