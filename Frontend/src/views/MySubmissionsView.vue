<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuth } from '../lib/auth'
import { getMySubmissions } from '../lib/submissions'
import type { Submission } from '../types/submission'

const auth = useAuth()
const submissions = ref<Submission[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  if (!auth.user) return
  try {
    submissions.value = await getMySubmissions(auth.user.id)
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'ไม่สามารถโหลดรายการของคุณได้'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="section-shell page-view">
    <div class="page-intro">
      <p class="eyebrow">Your archive</p>
      <h1>ภาพของฉัน</h1>
      <p>พื้นที่สำหรับภาพที่คุณส่งเข้าร่วมบันทึกสถานที่</p>
    </div>
    <div v-if="isLoading" class="empty-state" aria-live="polite">
      <span class="empty-state__mark">...</span>
      <h2>กำลังเปิดคลังของคุณ</h2>
    </div>
    <div v-else-if="errorMessage" class="empty-state" role="alert">
      <span class="empty-state__mark">!</span>
      <h2>โหลดข้อมูลไม่สำเร็จ</h2>
      <p>{{ errorMessage }}</p>
    </div>
    <div v-else-if="submissions.length" class="submission-list">
      <article
        v-for="submission in submissions"
        :key="submission.id"
        class="submission-item"
      >
        <img
          v-if="submission.imageUrl"
          class="submission-item__image"
          :src="submission.imageUrl"
          alt="ภาพที่ส่ง"
        />
        <div class="submission-item__content">
          <strong>{{ submission.status }}</strong>
          <span>{{ submission.placeId }} / {{ submission.shotPointId }}</span>
          <span>{{
            new Date(submission.submittedAt).toLocaleDateString('th-TH')
          }}</span>
        </div>
      </article>
    </div>
    <div v-else class="empty-state">
      <span class="empty-state__mark">—</span>
      <h2>ยังไม่มีภาพที่ส่ง</h2>
      <p>ภาพที่คุณส่งจากจุดถ่ายจะแสดงที่นี่พร้อมสถานะการตรวจสอบ</p>
    </div>
  </div>
</template>
