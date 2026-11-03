<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { signIn, signUp } from '../lib/auth'

const route = useRoute()
const router = useRouter()
const isSignUp = ref(false)
const email = ref('')
const password = ref('')
const displayName = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const confirmationMessage = ref('')
const submitLabel = computed(() =>
  isSignUp.value ? 'สร้างบัญชี' : 'เข้าสู่ระบบ',
)

function resetMessages() {
  errorMessage.value = ''
  confirmationMessage.value = ''
}

function toggleMode() {
  isSignUp.value = !isSignUp.value
  resetMessages()
}

async function submit() {
  resetMessages()
  if (
    !email.value ||
    !password.value ||
    (isSignUp.value && !displayName.value)
  ) {
    errorMessage.value = 'กรุณากรอกข้อมูลให้ครบถ้วน'
    return
  }

  isLoading.value = true
  try {
    if (isSignUp.value) {
      const result = await signUp(
        email.value,
        password.value,
        displayName.value,
      )
      if (!result.session) {
        confirmationMessage.value =
          'สมัครสำเร็จ กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีก่อนเข้าสู่ระบบ'
        return
      }
    } else {
      await signIn(email.value, password.value)
    }

    const redirect =
      typeof route.query.redirect === 'string'
        ? route.query.redirect
        : '/profile'
    await router.push(redirect)
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'ไม่สามารถดำเนินการได้'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="section-shell page-view auth-page">
    <div class="auth-panel">
      <p class="eyebrow">Your archive</p>
      <h1>{{ isSignUp ? 'เริ่มบันทึกไปด้วยกัน' : 'กลับเข้าสู่คลังของคุณ' }}</h1>
      <p class="auth-panel__intro">
        {{
          isSignUp
            ? 'สร้างบัญชีเพื่อเตรียมตัวสำหรับการส่งภาพในอนาคต'
            : 'เข้าสู่ระบบเพื่อดูโปรไฟล์และภาพที่คุณส่ง'
        }}
      </p>

      <form class="auth-form" @submit.prevent="submit">
        <label v-if="isSignUp">
          ชื่อที่แสดง
          <input v-model.trim="displayName" type="text" autocomplete="name" />
        </label>
        <label>
          อีเมล
          <input v-model.trim="email" type="email" autocomplete="email" />
        </label>
        <label>
          รหัสผ่าน
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            minlength="6"
          />
        </label>
        <p
          v-if="errorMessage"
          class="form-message form-message--error"
          role="alert"
        >
          {{ errorMessage }}
        </p>
        <p
          v-if="confirmationMessage"
          class="form-message form-message--success"
        >
          {{ confirmationMessage }}
        </p>
        <button class="primary-button" type="submit" :disabled="isLoading">
          {{ isLoading ? 'กำลังดำเนินการ...' : submitLabel }}
        </button>
      </form>

      <button class="auth-switch" type="button" @click="toggleMode">
        {{
          isSignUp ? 'มีบัญชีแล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชี? สร้างบัญชี'
        }}
      </button>
      <RouterLink class="text-link auth-back-link" to="/places"
        >กลับไปดูสถานที่</RouterLink
      >
    </div>
  </div>
</template>
