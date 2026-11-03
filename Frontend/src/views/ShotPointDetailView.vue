<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  getPlaceById,
  getReferenceFramesByShotPointId,
  getShotPointById,
} from '../lib/places'
import type { Place, ReferenceFrame, ShotPoint } from '../types/place'

const route = useRoute()
const place = ref<Place | null>(null)
const shotPoint = ref<ShotPoint | null>(null)
const referenceFrames = ref<ReferenceFrame[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

async function loadShotPoint() {
  const placeId = route.params.placeId as string
  const shotPointId = route.params.shotPointId as string
  isLoading.value = true
  errorMessage.value = ''
  place.value = null
  shotPoint.value = null
  referenceFrames.value = []

  try {
    const [loadedPlace, loadedShotPoint] = await Promise.all([
      getPlaceById(placeId),
      getShotPointById(shotPointId),
    ])

    if (!loadedPlace || !loadedShotPoint) {
      place.value = loadedPlace
      shotPoint.value = loadedShotPoint
      return
    }

    if (loadedShotPoint.placeId !== loadedPlace.id) {
      errorMessage.value = 'จุดถ่ายนี้ไม่ได้อยู่ในสถานที่ที่เลือก'
      return
    }

    place.value = loadedPlace
    shotPoint.value = loadedShotPoint
    referenceFrames.value = await getReferenceFramesByShotPointId(shotPointId)
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'ไม่สามารถโหลดข้อมูลจุดถ่ายได้'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadShotPoint)
watch(() => [route.params.placeId, route.params.shotPointId], loadShotPoint)
</script>

<template>
  <div
    v-if="isLoading"
    class="section-shell page-view empty-state"
    aria-live="polite"
  >
    <span class="empty-state__mark">...</span>
    <h1>กำลังเปิดจุดถ่าย</h1>
    <p>กำลังโหลดกรอบอ้างอิง</p>
  </div>
  <div
    v-else-if="errorMessage"
    class="section-shell page-view empty-state"
    role="alert"
  >
    <span class="empty-state__mark">!</span>
    <h1>โหลดข้อมูลไม่สำเร็จ</h1>
    <p>{{ errorMessage }}</p>
    <RouterLink class="text-link" :to="`/places/${route.params.placeId}`">
      กลับไปที่สถานที่
    </RouterLink>
  </div>
  <div
    v-else-if="place && shotPoint"
    class="section-shell page-view shot-point-detail"
  >
    <RouterLink class="back-link back-link--dark" :to="`/places/${place.id}`">
      ← {{ place.name }}
    </RouterLink>

    <div class="shot-point-detail__heading">
      <div>
        <p class="eyebrow">{{ shotPoint.direction }}</p>
        <h1>{{ shotPoint.name }}</h1>
        <p>{{ shotPoint.description }}</p>
      </div>
      <div class="capture-hint">
        <span aria-hidden="true">⌖</span> {{ shotPoint.captureHint }}
      </div>
    </div>

    <RouterLink
      class="primary-button shot-point-detail__capture"
      :to="{
        name: 'capture',
        params: { placeId: place.id, shotPointId: shotPoint.id },
      }"
    >
      <span aria-hidden="true">◎</span>
      เปิดกล้อง / เลือกรูป
    </RouterLink>

    <section class="reference-frame-list">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Reference frames</p>
          <h2>กรอบอ้างอิง</h2>
        </div>
        <span class="detail-count"
          >{{ referenceFrames.length }} กรอบที่ใช้งาน</span
        >
      </div>

      <div v-if="referenceFrames.length" class="reference-frame-grid">
        <figure
          v-for="frame in referenceFrames"
          :key="frame.id"
          class="reference-frame"
        >
          <div class="reference-frame__image-wrap">
            <img
              :src="frame.imageUrl"
              :alt="frame.name"
              :style="{ objectFit: frame.fit, opacity: frame.opacity }"
            />
            <span class="reference-frame__guide" aria-hidden="true"></span>
          </div>
          <figcaption>
            <span>{{ frame.name }}</span>
            <span
              >{{ frame.fit }} / {{ Math.round(frame.opacity * 100) }}%</span
            >
          </figcaption>
        </figure>
      </div>
      <div v-else class="empty-state">
        <span class="empty-state__mark">—</span>
        <h3>ยังไม่มีกรอบอ้างอิง</h3>
        <p>กรอบสำหรับจุดถ่ายนี้กำลังถูกเตรียม</p>
      </div>
    </section>
  </div>
  <div v-else class="section-shell page-view empty-state">
    <span class="empty-state__mark">404</span>
    <h1>ไม่พบจุดถ่ายนี้</h1>
    <RouterLink class="text-link" to="/places"
      >กลับไปดูสถานที่ทั้งหมด</RouterLink
    >
  </div>
</template>
