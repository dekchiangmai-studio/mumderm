<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { getPlaceById, getShotPointsByPlaceId } from '../lib/places'
import type { Place, ShotPoint } from '../types/place'

const route = useRoute()
const place = ref<Place | null>(null)
const shotPoints = ref<ShotPoint[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

async function loadPlace() {
  const placeId = route.params.placeId as string
  isLoading.value = true
  errorMessage.value = ''
  place.value = null
  shotPoints.value = []

  try {
    const loadedPlace = await getPlaceById(placeId)

    if (!loadedPlace) return

    place.value = loadedPlace
    shotPoints.value = await getShotPointsByPlaceId(placeId)
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'ไม่สามารถโหลดข้อมูลสถานที่ได้'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadPlace)
watch(() => route.params.placeId, loadPlace)
</script>

<template>
  <div
    v-if="isLoading"
    class="section-shell page-view empty-state"
    aria-live="polite"
  >
    <span class="empty-state__mark">...</span>
    <h1>กำลังเปิดสถานที่</h1>
    <p>กำลังโหลดจุดถ่ายและข้อมูลอ้างอิง</p>
  </div>
  <div
    v-else-if="errorMessage"
    class="section-shell page-view empty-state"
    role="alert"
  >
    <span class="empty-state__mark">!</span>
    <h1>โหลดข้อมูลไม่สำเร็จ</h1>
    <p>{{ errorMessage }}</p>
    <button class="primary-button" type="button" @click="loadPlace">
      ลองอีกครั้ง
    </button>
  </div>
  <div v-else-if="place" class="place-detail">
    <section class="place-detail__hero">
      <img :src="place.image" :alt="place.name" />
      <div class="place-detail__overlay"></div>
      <div class="section-shell place-detail__hero-content">
        <RouterLink class="back-link" to="/places">← สถานที่ทั้งหมด</RouterLink>
        <div>
          <p class="eyebrow">{{ place.province }} · {{ place.country }}</p>
          <h1>{{ place.name }}</h1>
          <p>{{ place.description }}</p>
        </div>
      </div>
    </section>

    <section class="section-shell detail-content">
      <div class="place-location">
        <div>
          <p class="eyebrow">Location metadata</p>
          <p v-if="place.address">{{ place.address }}</p>
          <p v-else>ยังไม่มีที่อยู่ระบุ</p>
        </div>
        <p
          v-if="place.latitude !== null && place.longitude !== null"
          class="place-location__coordinates"
        >
          {{ place.latitude.toFixed(5) }}, {{ place.longitude.toFixed(5) }}
        </p>
      </div>

      <div class="section-heading">
        <div>
          <p class="eyebrow">Shot points</p>
          <h2>เลือกจุดถ่าย</h2>
        </div>
        <span class="detail-count"
          >{{ shotPoints.length }} จุดที่เปิดใช้งาน</span
        >
      </div>

      <div v-if="shotPoints.length" class="shot-point-list">
        <article
          v-for="(shotPoint, index) in shotPoints"
          :key="shotPoint.id"
          class="shot-point"
        >
          <div
            class="shot-point__image-wrap shot-point__image-wrap--placeholder"
          >
            <span class="shot-point__placeholder-label"
              >REFERENCE<br />FRAME</span
            >
            <span class="shot-point__number">0{{ index + 1 }}</span>
            <span class="shot-point__guide" aria-hidden="true"></span>
          </div>
          <div class="shot-point__body">
            <p class="eyebrow">{{ shotPoint.direction }}</p>
            <h3>{{ shotPoint.name }}</h3>
            <p>{{ shotPoint.description }}</p>
            <div class="capture-hint">
              <span aria-hidden="true">⌖</span> {{ shotPoint.captureHint }}
            </div>
            <RouterLink
              class="primary-button"
              :to="`/places/${place.id}/shot-points/${shotPoint.id}`"
            >
              ดูกรอบอ้างอิง <span aria-hidden="true">↗</span>
            </RouterLink>
          </div>
        </article>
      </div>
      <div v-else class="empty-state">
        <span class="empty-state__mark">—</span>
        <h3>กรอบกำลังถูกเตรียม</h3>
        <p>สถานที่นี้จะเปิดให้บันทึกเมื่อจุดถ่ายพร้อมใช้งาน</p>
      </div>
    </section>
  </div>
  <div v-else class="section-shell page-view empty-state">
    <span class="empty-state__mark">404</span>
    <h1>ไม่พบสถานที่นี้</h1>
    <RouterLink class="text-link" to="/places"
      >กลับไปดูสถานที่ทั้งหมด</RouterLink
    >
  </div>
</template>
