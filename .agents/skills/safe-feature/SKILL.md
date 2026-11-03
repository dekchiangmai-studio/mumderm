---
name: safe-feature
description: เพิ่มฟีเจอร์ใหม่อย่างปลอดภัยโดยไม่ทำของเดิมพัง — plan, implement, verify backward compatibility
---

# Safe Feature Implementation

ใช้ skill นี้เมื่อต้องเพิ่มฟีเจอร์ใหม่ โดยมั่นใจว่าไม่ทำให้ฟีเจอร์เดิมพัง

## Steps

### 1. Scope Check

- อ่าน `doc/plan.md` — ฟีเจอร์นี้อยู่ใน version ปัจจุบันหรือไม่
- ถ้าอยู่นอก scope → หยุด แจ้ง user ว่าเป็นของ version ไหน
- ตรวจ prohibited list: gacha, card, marketplace, coins, ranking, social feed, chat, follow, face recognition, AI auto-approval, native app, video editor

### 2. Impact Analysis

- ระบุไฟล์ที่ต้องสร้างใหม่
- ระบุไฟล์ที่ต้องแก้ไข — อ่านโค้ดเดิมก่อนแก้
- ตรวจว่าไม่กระทบ routes, auth, หรือ existing components
- ถ้าต้องแก้ schema → ใช้ skill `database-change`

### 3. Implement

- สร้าง types ใน `src/types/` ก่อน
- สร้าง service functions ใน `src/lib/`
- สร้าง/แก้ components ใน `src/components/`
- สร้าง/แก้ views ใน `src/views/`
- เพิ่ม route ใน `src/router/index.ts` (ถ้าต้องการ)
- ใส่ `meta: { requiresAuth: true }` ถ้าต้อง login

### 4. States

ทุกหน้าใหม่ต้องจัดการ:

- **Loading** — แสดง spinner/skeleton ขณะโหลดข้อมูล
- **Error** — แสดงข้อความ error + retry (ถ้าเหมาะสม)
- **Empty** — แสดงข้อความเมื่อไม่มีข้อมูล

### 5. Backward Compatibility

- ตรวจว่า routes เดิมยังทำงาน
- ตรวจว่า auth flow ไม่เปลี่ยน
- ตรวจว่า components ที่ใช้ร่วมกันไม่พัง (AppHeader, PlaceCard ฯลฯ)
- ทดสอบ flow หลัก: Home → Places → Shot Point → Capture → My Submissions

### 6. Verify

```bash
cd Frontend
npm run typecheck
npm run lint
npm run build
```

