<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuth, signOut } from '../lib/auth'

const auth = useAuth()

async function handleSignOut() {
  await signOut()
}
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <RouterLink class="brand" to="/" aria-label="MUMDERM หน้าแรก">
        <span class="brand__mark">M</span>
        <span>MUMDERM</span>
      </RouterLink>

      <nav class="main-nav" aria-label="เมนูหลัก">
        <RouterLink to="/places">สถานที่</RouterLink>
        <a href="#about">เกี่ยวกับโปรเจกต์</a>
      </nav>

      <div v-if="auth.isLoading" class="auth-status">กำลังตรวจสอบ...</div>
      <RouterLink v-else-if="!auth.user" class="quiet-button" to="/login">
        เข้าสู่ระบบ
      </RouterLink>
      <div v-else class="account-nav">
        <RouterLink class="account-nav__name" to="/profile">
          {{ auth.user.email }}
        </RouterLink>
        <RouterLink class="account-nav__link" to="/my-submissions"
          >ภาพของฉัน</RouterLink
        >
        <button class="quiet-button" type="button" @click="handleSignOut">
          ออกจากระบบ
        </button>
      </div>
    </div>
  </header>
</template>
