---
name: code-review
description: ขั้นตอน review code ของ MUMDERM — ตรวจ convention, security, architecture compliance
---

# Code Review

ใช้ skill นี้เมื่อต้อง review code ที่เขียนขึ้นมาใหม่หรือถูกแก้ไข

## Checklist

### Convention

- [ ] ใช้ `<script setup>` + Composition API (ไม่ใช้ Options API)
- [ ] TypeScript strict — ไม่มี `any` โดยไม่จำเป็น
- [ ] ชื่อไฟล์ถูกต้อง: `XxxView.vue` สำหรับ views, `PascalCase.vue` สำหรับ components
- [ ] Business logic อยู่ใน `src/lib/` ไม่ใช่ใน component
- [ ] Types อยู่ใน `src/types/`

### Architecture

- [ ] ไม่ผูก domain logic กับ Google Drive โดยตรง
- [ ] ใช้ Supabase client จาก `src/lib/supabase.ts` (singleton)
- [ ] ใช้ auth จาก `src/lib/auth.ts`
- [ ] Route ใหม่มี auth guard ถ้าต้องการ (`meta: { requiresAuth: true }`)

### Security

- [ ] ไม่มี secret หรือ key ใน frontend code
- [ ] env vars ใช้ `VITE_` prefix
- [ ] ถ้ามี table ใหม่ — มี RLS policy
- [ ] Input validation ทั้ง client + server

### UX

- [ ] Mobile-first responsive
- [ ] มี loading state
- [ ] มี error state
- [ ] มี empty state
- [ ] ภาพเป็นจุดเด่นของ UI

### Build

- [ ] `npm run typecheck` ผ่าน
- [ ] `npm run lint` ผ่าน
- [ ] `npm run build` ผ่าน

### Scope

- [ ] ไม่มีฟีเจอร์นอก version ปัจจุบัน
- [ ] ไม่มี item ใน prohibited list (gacha, card, marketplace ฯลฯ)

