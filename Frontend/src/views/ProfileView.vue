<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuth } from '../lib/auth'
import { getMyProfile, updateMyProfile } from '../lib/profile'
import type { Profile } from '../types/profile'

const auth = useAuth()
const profile = ref<Profile | null>(null)
const displayName = ref('')
const isLoading = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function loadProfile() {
  if (!auth.user) return
  isLoading.value = true
  try {
    profile.value = await getMyProfile(auth.user.id)
    displayName.value = profile.value?.displayName ?? ''
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'ไม่สามารถโหลดโปรไฟล์ได้'
  } finally {
    isLoading.value = false
  }
}

async function saveProfile() {
  if (!auth.user || !displayName.value.trim()) {
    errorMessage.value = 'กรุณากรอกชื่อที่แสดง'
    return
  }
  isSaving.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    profile.value = await updateMyProfile(auth.user.id, displayName.value)
    displayName.value = profile.value.displayName
    successMessage.value = 'บันทึกโปรไฟล์แล้ว'
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'ไม่สามารถบันทึกโปรไฟล์ได้'
  } finally {
    isSaving.value = false
  }
}

onMounted(loadProfile)
</script>

<template>
  <div class="section-shell page-view auth-page">
    <div class="auth-panel profile-panel">
      <p class="eyebrow">Your profile</p>
      <h1>โปรไฟล์</h1>
      <p class="auth-panel__intro">{{ auth.user?.email }}</p>
      <div v-if="isLoading" class="profile-loading">กำลังโหลดโปรไฟล์...</div>
      <form v-else class="auth-form" @submit.prevent="saveProfile">
        <label>
          ชื่อที่แสดง
          <input
            v-model.trim="displayName"
            type="text"
            autocomplete="name"
            maxlength="80"
          />
        </label>
        <p
          v-if="errorMessage"
          class="form-message form-message--error"
          role="alert"
        >
          {{ errorMessage }}
        </p>
        <p v-if="successMessage" class="form-message form-message--success">
          {{ successMessage }}
        </p>
        <button class="primary-button" type="submit" :disabled="isSaving">
          {{ isSaving ? 'กำลังบันทึก...' : 'บันทึกโปรไฟล์' }}
        </button>
      </form>
    </div>
  </div>
</template>
