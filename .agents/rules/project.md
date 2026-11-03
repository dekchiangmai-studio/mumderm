# Project Rules

## Workflow

1. **ก่อนเริ่มทำงาน** — อ่าน `doc/plan.md` เพื่อระบุ version ปัจจุบันและ scope
2. **อยู่ใน scope** — ห้ามกระโดดไปทำฟีเจอร์ของ version ถัดไปก่อนที่ version ปัจจุบันจะเสร็จ
3. **Vertical slice** — ทุก version ต้องรันได้จริงและไม่ทำฟีเจอร์เดิมพัง
4. **ตรวจ architecture** — อ่าน `ARCHITECTURE.md` และตรวจโค้ดเดิมก่อนแก้ไข

## Version Development Process

เมื่อทำ version ใดให้ตอบในโครงสร้าง:

1. **Scope** — งาน version นี้มีอะไรบ้าง
2. **Files** — ไฟล์ที่จะสร้าง/แก้
3. **Implementation** — เขียนโค้ด
4. **Validation** — รัน typecheck/lint/build
5. **Done** — requirement ที่เสร็จ
6. **Deferred** — สิ่งที่อยู่นอก scope

## Naming & Structure

- ตั้งชื่อไฟล์และ variable ให้ชัดเจน สื่อความหมาย
- Views ตั้งชื่อ `XxxView.vue` ใน `src/views/`
- Components ตั้งชื่อ PascalCase ใน `src/components/`
- Service modules อยู่ใน `src/lib/`
- Type definitions อยู่ใน `src/types/`
- Migration files อยู่ใน `Backend/supabase/migrations/`

## Documentation

- อัปเดต `CHANGELOG.md` หลังทำแต่ละ version เสร็จ
- อัปเดต `ARCHITECTURE.md` เมื่อมีการเปลี่ยนแปลง schema หรือ architecture
- Comments เฉพาะ logic ที่ไม่ชัดเจน ไม่ comment สิ่งที่อ่านจากโค้ดได้

## Prohibited Items (Until Explicitly Requested)

Gacha, card system, marketplace, coins/wallet, ranking, social feed, chat, follow system, face recognition, AI auto-approval, native mobile app, advanced video editor

