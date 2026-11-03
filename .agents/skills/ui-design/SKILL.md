---
name: ui-design
description: สร้าง UI component ตาม convention ของ MUMDERM — mobile-first, clean, image-focused
---

# UI Design & Component Creation

ใช้ skill นี้เมื่อต้องสร้าง Vue component หรือ view ใหม่

## Design Principles

1. **Mobile-first** — ออกแบบหน้าจอมือถือก่อน แล้วค่อยขยายไป desktop
2. **ภาพเป็นพระเอก** — ให้พื้นที่แสดงภาพเยอะ UI เรียบ สะอาด
3. **เรียบง่าย** — ไม่เพิ่ม element ที่ไม่จำเป็น

## Component Convention

### File Naming

- Views: `src/views/XxxView.vue` (1 ไฟล์ต่อ 1 route)
- Components: `src/components/XxxYyy.vue` (PascalCase)

### Template Structure

```vue
<script setup lang="ts">
// imports
// props/emits
// composables / reactive state
// functions
</script>

<template>
  <!-- single root element preferred -->
</template>

<style scoped>
/* mobile-first styles */
/* media queries for larger screens */
</style>
```

### Rules

- ใช้ `<script setup lang="ts">` เท่านั้น
- ใช้ `<style scoped>` เพื่อไม่ให้ style รั่ว
- Component ไม่ควรมี business logic หนัก — เรียก function จาก `src/lib/`
- Props/emits ต้องมี type definition

## Required States

ทุก view ที่โหลดข้อมูลต้องจัดการ 3 states:

```vue
<template>
  <div v-if="isLoading">กำลังโหลด...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else-if="!data">ไม่พบข้อมูล</div>
  <div v-else>
    <!-- main content -->
  </div>
</template>
```

## Responsive Breakpoints

```css
/* Mobile first (default) */
.container { padding: 1rem; }

/* Tablet */
@media (min-width: 768px) {
  .container { padding: 2rem; }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { max-width: 1200px; margin: 0 auto; }
}
```

## Image Display

- ใช้ `object-fit: cover` สำหรับ thumbnail / card
- ใช้ `object-fit: contain` สำหรับ full preview
- ใส่ `loading="lazy"` สำหรับรูปที่ไม่อยู่ใน viewport แรก
- ใส่ `alt` attribute ทุกรูป

