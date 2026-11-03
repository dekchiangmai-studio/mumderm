---
name: release-checklist
description: Checklist ก่อน release version ใหม่ของ MUMDERM — build, test, docs, changelog
---

# Release Checklist

ใช้ skill นี้เมื่อจะปิด version และ release

## Pre-release Checklist

### Build & Lint

- [ ] `npm run typecheck` — ไม่มี type errors
- [ ] `npm run lint` — ไม่มี lint errors
- [ ] `npm run build` — production build สำเร็จ

### Functional Testing

- [ ] Route หลักทำงาน: `/`, `/places`, `/places/:id`, shot point, capture
- [ ] Auth flow: signup → login → logout → protected route redirect
- [ ] Upload flow (ถ้ามีใน version): select image → preview → submit
- [ ] Mobile responsive — ทดสอบทุกหน้าที่แก้
- [ ] Loading states แสดงผลถูกต้อง
- [ ] Error states แสดงผลถูกต้อง
- [ ] Empty states แสดงผลถูกต้อง

### Database

- [ ] Migrations apply ได้โดยไม่ error (`supabase db push`)
- [ ] RLS policies ทำงาน — user เห็นเฉพาะข้อมูลที่ควรเห็น
- [ ] ไม่มี table ที่ลืมเปิด RLS

### Security

- [ ] ไม่มี secret ใน frontend code
- [ ] ไม่มี service role key ใน client
- [ ] File upload validation ทำงาน (type + size)

### Documentation

- [ ] อัปเดต `CHANGELOG.md` — เพิ่ม entry ของ version นี้
- [ ] อัปเดต `ARCHITECTURE.md` — ถ้า schema หรือ architecture เปลี่ยน
- [ ] สรุป Done (สิ่งที่เสร็จ) และ Deferred (สิ่งที่เลื่อน)

## CHANGELOG Format

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- สิ่งที่เพิ่ม

### Changed
- สิ่งที่เปลี่ยน

### Deferred
- สิ่งที่อยู่นอก scope

### Validation
- คำสั่งที่รันตรวจสอบ
```

