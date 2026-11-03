<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import PlaceCard from '../components/PlaceCard.vue'
import { getPlaces } from '../lib/places'
import type { Place } from '../types/place'

const places = ref<Place[]>([])
const errorMessage = ref('')
const featuredPlace = computed(() => places.value[0])

onMounted(async () => {
  try {
    places.value = await getPlaces()
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'ไม่สามารถโหลดข้อมูลสถานที่ได้'
  }
})
</script>

<template>
  <div>
    <section class="hero section-shell">
      <div class="hero__copy">
        <p class="eyebrow">A living archive of real places</p>
        <h1>กลับไปที่เดิม<br /><em>แล้วมองอีกครั้ง</em></h1>
        <p class="hero__intro">
          MUMDERM ชวนคุณบันทึกสถานที่จริงจากจุดเดิมในทุกวัน
          เพื่อมองเห็นการเปลี่ยนแปลงที่เกิดขึ้นทีละน้อย
        </p>
        <RouterLink class="primary-button" to="/places"
          >สำรวจสถานที่ <span aria-hidden="true">↗</span></RouterLink
        >
      </div>
      <div class="hero__visual">
        <div v-if="featuredPlace" class="hero__image-wrap">
          <img :src="featuredPlace.image" :alt="featuredPlace.name" />
          <div class="hero__frame" aria-hidden="true">
            <span class="hero__frame-label">REFERENCE / 01</span>
            <span class="hero__frame-corner hero__frame-corner--tl"></span>
            <span class="hero__frame-corner hero__frame-corner--tr"></span>
            <span class="hero__frame-corner hero__frame-corner--bl"></span>
            <span class="hero__frame-corner hero__frame-corner--br"></span>
          </div>
        </div>
        <div
          v-else
          class="hero__image-wrap hero__image-wrap--loading"
          aria-live="polite"
        >
          <span>{{ errorMessage || 'กำลังเปิดคลังสถานที่...' }}</span>
        </div>
        <div v-if="featuredPlace" class="hero__caption">
          <span>01</span> {{ featuredPlace.name }} /
          {{ featuredPlace.province }}
        </div>
      </div>
    </section>

    <section id="about" class="intro-band">
      <div class="section-shell intro-band__inner">
        <p class="eyebrow">Why MUMDERM</p>
        <h2>หนึ่งสถานที่<br />หลายร้อยช่วงเวลา</h2>
        <p>
          ภาพหนึ่งภาพบอกเล่าเรื่องราวของวันนี้ แต่ภาพจากจุดเดิมที่สะสมไปเรื่อย ๆ
          จะทำให้เราเห็นเรื่องราวของสถานที่นั้นชัดขึ้น
        </p>
      </div>
    </section>

    <section class="section-shell places-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Places in the archive</p>
          <h2>สถานที่ที่กำลังถูกบันทึก</h2>
        </div>
        <RouterLink class="text-link" to="/places"
          >ดูทั้งหมด <span aria-hidden="true">↗</span></RouterLink
        >
      </div>
      <div v-if="places.length" class="place-grid">
        <PlaceCard v-for="place in places" :key="place.id" :place="place" />
      </div>
      <p v-else class="home-empty-state">
        {{ errorMessage || 'กำลังโหลดสถานที่จากคลัง...' }}
      </p>
    </section>
  </div>
</template>
