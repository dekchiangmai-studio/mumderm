## v0.4.0 - 2026-09-18

- Started image submission vertical slice with protected mobile capture route, gallery/camera file selection, preview, reference-frame overlay, and fit-only presentation.
- Added Google Apps Script upload adapter and Drive Web App contract using Supabase access-token validation.
- Added pending submission creation and submission history thumbnails.

# MUMDERM Changelog

บันทึกการเปลี่ยนแปลงของ MUMDERM โดยยึดแนวทาง Keep a Changelog และ Semantic Versioning

## [0.2.0] - 2026-09-18

### Added

- เพิ่ม Supabase schema และ seed สำหรับ `places`, `shot_points` และ `reference_frames`
- เพิ่ม public read RLS policies และ metadata พิกัดระดับ Place
- เปลี่ยน Home, Places และ Place Detail ให้โหลดข้อมูลจาก Supabase จริง
- เพิ่มหน้า Shot Point Detail และการแสดง Reference Frame ที่ active
- เพิ่ม loading, error, empty และ not-found states สำหรับ flow สถานที่
- เพิ่ม route `/places/:placeId/shot-points/:shotPointId`

### Deferred

- Authentication และ User Profile
- Camera, image upload และการส่งภาพจริง
- GPS validation
- Admin UI และ moderation
- Daily Image และ Timeline

### Validation

- `npm run typecheck`

## [0.3.0] - 2026-09-18

### Added

- เพิ่ม Supabase Auth แบบ Email + Password พร้อม session hydration และ logout
- เพิ่ม email confirmation state สำหรับผู้สมัครใหม่
- เพิ่ม protected routes `/profile` และ `/my-submissions`
- เพิ่ม `profiles` และ `submissions` schema พร้อม owner-only RLS
- เพิ่ม profile trigger ที่สร้าง profile อัตโนมัติหลัง signup
- เพิ่มหน้าแก้ไข display name และหน้า My Submissions แบบ empty state
- เพิ่ม authenticated navigation ใน App Header

### Deferred

- Camera และ image upload
- การสร้าง submission ผ่าน UI
- GPS validation
- Magic Link, OAuth และ avatar upload
- Moderation, Daily Image และ Timeline

### Validation

- `supabase db push`
- `supabase migration list`
- `npm run typecheck`

## [Unreleased]

ยังไม่มีการเปลี่ยนแปลงที่ประกาศสำหรับ release ถัดไป

## [0.1.0] - 2026-09-18

### Added

- สร้างพื้นฐานโปรเจกต์ด้วย Vite, Vue 3 และ TypeScript
- เพิ่ม layout หลักและ design foundation สำหรับ responsive UI
- เพิ่ม Vue Router และ route หลักของแอป:
  - `/` หน้า Home
  - `/places` รายการสถานที่
  - `/places/tha-phae-gate` รายละเอียดประตูท่าแพและ Shot Point แบบ mock
  - หน้า Not Found สำหรับ route ที่ไม่รู้จัก
- เพิ่ม mock data สำหรับ Place และ Shot Point
- เตรียม Supabase client และ environment variables สำหรับการพัฒนาขั้นถัดไป
- เพิ่มคำสั่งตรวจสอบ TypeScript, ESLint และ production build ใน Frontend

### Deferred

ฟีเจอร์ต่อไปนี้ยังไม่อยู่ใน release นี้:

- Authentication และ User Profile
- Camera, image upload และการส่งภาพจริง
- GPS validation
- Database schema และข้อมูลจาก backend จริง
- Daily Image และการคัดเลือกภาพ
- Timeline และ Time-lapse
- Admin, moderation และระบบจัดเก็บภาพ production

### Validation

- `npm run typecheck`
- `npm run lint`
- `npm run build`
