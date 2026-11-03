---
name: bug-fix
description: ขั้นตอนแก้ bug อย่างเป็นระบบสำหรับ MUMDERM — reproduce, isolate, fix, verify
---

# Bug Fix

ใช้ skill นี้เมื่อต้องแก้ bug ที่รายงานเข้ามา

## Steps

### 1. Reproduce

- เข้าใจ bug จากคำอธิบาย: เกิดที่หน้าไหน, ขั้นตอนอะไร, ผลที่ได้ vs ที่คาดหวัง
- ระบุ route และ component ที่เกี่ยวข้อง
- ตรวจว่า bug เกิดเฉพาะ mobile หรือ desktop หรือทั้งสอง

### 2. Isolate

- ค้นหาไฟล์ที่เกี่ยวข้อง (view → component → lib → type)
- ตรวจว่าเป็นปัญหา frontend, backend (RLS/query), หรือ GAS
- ถ้าเกี่ยวกับ data — ตรวจ Supabase query และ RLS policy
- ถ้าเกี่ยวกับ upload — ตรวจ `image-storage.ts` และ `Code.gs`

### 3. Fix

- แก้ไขที่ root cause ไม่ใช่ symptom
- ตรวจว่าไม่กระทบฟีเจอร์อื่น
- ถ้าต้องแก้ schema — สร้าง migration ใหม่ (ใช้ skill `database-change`)

### 4. Verify

```bash
cd Frontend
npm run typecheck
npm run lint
npm run build
```

- ตรวจว่า bug หายแล้ว
- ตรวจว่า flow หลักยังทำงานปกติ: Home → Places → Shot Point → Capture
- ตรวจ loading, error, empty states ของหน้าที่แก้

