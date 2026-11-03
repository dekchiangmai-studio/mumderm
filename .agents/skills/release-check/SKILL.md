---
name: release-check
description: ตรวจสอบความพร้อมก่อน release — build, lint, typecheck, migrations, RLS และ checklist
---

# Release Check

Skill สำหรับตรวจสอบความเรียบร้อยรอบด้านก่อนทำ Release

## Quick Check Commands

```bash
cd Frontend
npm run typecheck
npm run lint
npm run build
```

## Database Verification

```bash
cd Backend/supabase
supabase migration list
```

## Verification Checklist

1. **Type & Build**: โค้ดคอมไพล์ผ่าน ไม่มี TypeScript / ESLint errors
2. **Security & RLS**: ทุก table ใน Supabase มี RLS เปิดอยู่ และไม่มี secret หลุดใน frontend
3. **Core Flows**:
   - หน้าหลัก (`/`)
   - สถานที่และจุดถ่าย (`/places`, `/places/:id/shot-points/:id`)
   - กล้อง / กรอบอ้างอิง / Submission (`.../capture`)
   - ข้อมูลส่วนตัว / ประวัติ (`/profile`, `/my-submissions`)
4. **Docs & Changelog**: บันทึกสิ่งที่ทำเสร็จ (Done) และสิ่งที่เลื่อน (Deferred) ลงใน `CHANGELOG.md`

