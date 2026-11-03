<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PlaceCard from '../components/PlaceCard.vue'
import { getPlaces } from '../lib/places'
import type { Place } from '../types/place'

const places = ref<Place[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

async function loadPlaces() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    places.value = await getPlaces()
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'ไม่สามารถโหลดข้อมูลสถานที่ได้'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadPlaces)
</script>

<template>
  <div class="section-shell page-view">
    <div class="page-intro">
      <p class="eyebrow">The archive</p>
      <h1>สถานที่ทั้งหมด</h1>
      <p>เลือกสถานที่เพื่อดูจุดถ่ายและกรอบอ้างอิงที่กำหนดไว้</p>
    </div>
    <div v-if="isLoading" class="empty-state" aria-live="polite">
      <span class="empty-state__mark">...</span>
      <h2>กำลังเปิดแผนที่สถานที่</h2>
      <p>กำลังโหลดข้อมูลจากคลังสถานที่</p>
    </div>
    <div v-else-if="errorMessage" class="empty-state" role="alert">
      <span class="empty-state__mark">!</span>
      <h2>โหลดข้อมูลไม่สำเร็จ</h2>
      <p>{{ errorMessage }}</p>
      <button class="primary-button" type="button" @click="loadPlaces">
        ลองอีกครั้ง
      </button>
    </div>
    <div v-else-if="places.length" class="place-grid place-grid--all">
      <PlaceCard v-for="place in places" :key="place.id" :place="place" />
    </div>
    <div v-else class="empty-state">
      <span class="empty-state__mark">—</span>
      <h2>ยังไม่มีสถานที่ในคลัง</h2>
      <p>เพิ่มสถานที่ผ่าน Supabase Dashboard แล้วกลับมาใหม่อีกครั้ง</p>
    </div>
  </div>
</template>
