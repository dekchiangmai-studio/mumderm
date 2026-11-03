<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Place } from '../types/place'

defineProps<{ place: Place }>()
</script>

<template>
  <article class="place-card">
    <RouterLink class="place-card__image-link" :to="`/places/${place.id}`">
      <img
        class="place-card__image"
        :src="place.image"
        :alt="place.name"
        loading="lazy"
      />
      <span
        class="place-card__status"
        :class="`place-card__status--${place.status}`"
      >
        {{ place.status === 'active' ? 'เปิดบันทึกแล้ว' : 'กำลังเตรียมกรอบ' }}
      </span>
    </RouterLink>
    <div class="place-card__body">
      <p class="eyebrow">{{ place.province }} · {{ place.country }}</p>
      <h3>{{ place.name }}</h3>
      <p>{{ place.description }}</p>
      <RouterLink class="text-link" :to="`/places/${place.id}`">
        ดูรายละเอียด <span aria-hidden="true">↗</span>
      </RouterLink>
    </div>
  </article>
</template>
