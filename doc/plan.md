# MUMDERM — Development Plan

> Working title: **MUMDERM**  
> Concept: **One place. One frame. Every day.**
>
> เว็บแอปที่ให้ผู้ใช้ไปยังสถานที่จริง ถ่ายภาพตามมุม/กรอบที่กำหนด แล้วนำภาพจากแต่ละวันมาสร้างเป็น Time Archive และ 365-day time-lapse ของสถานที่นั้น

---

## 0. Product Definition

### Core idea

- ระบบกำหนด **Place** และ **Shot Point** ในสถานที่จริง
- แต่ละ Shot Point มี **Reference Frame / Mockup** เพื่อช่วยจัดองค์ประกอบให้ใกล้เคียงกัน
- ผู้ใช้ถ่ายภาพจากสถานที่จริงและส่งเข้าระบบ
- ระบบบันทึกภาพตามวัน
- MVP รองรับการเลือก/คัดภาพเพื่อเป็น **Daily Image** ของแต่ละวัน
- เมื่อมีภาพครบช่วงเวลาหนึ่ง ระบบสามารถเรียงภาพเป็น **Timeline / Time-lapse** ได้

### Important product boundary for MVP

MVP เน้นให้วงจรหลักทำงานครบ:

**เปิดสถานที่ → ดูจุดถ่าย → ดูกรอบ → ถ่าย/อัปโหลด → ส่งภาพ → ตรวจสอบ → แสดงภาพรายวัน → ดู Timeline**

ยังไม่ทำระบบ Social Network เต็มรูปแบบ, Marketplace, เหรียญ, Gacha, Ranking หรือระบบ AI คัดภาพอัตโนมัติขั้นสูง

---

# Tech Stack

## Frontend

- Vite
- Vue 3
- TypeScript
- Vue Router
- Pinia (ใช้เมื่อ state เริ่มซับซ้อน)
- CSS / CSS Modules / scoped CSS ตามความเหมาะสม
- Mobile-first responsive design
- PWA-ready architecture แต่ไม่บังคับเปิด install flow ใน MVP แรก

## Backend / Database

- Supabase
  - Auth
  - PostgreSQL
  - Storage (ตัวเลือกสำรอง / ใช้กับ asset ที่เหมาะสม)
  - Edge Functions เฉพาะกรณีที่จำเป็น
  - Row Level Security (RLS)

## Image storage option

แนวทางหลัก:

- **Google Drive + Google Apps Script (GAS)** สำหรับเก็บรูปผู้ใช้/รูป submission หากต้องการลดต้นทุน Storage หรือบริหารรูปภายนอก Supabase
- Supabase เก็บ metadata, status, URL/file ID, audit data

ข้อกำหนด:

- ห้ามผูก frontend โดยตรงกับ secret ของ Google Drive/GAS
- ใช้ backend/API layer หรือ GAS Web App เป็นตัวกลาง
- ต้องออกแบบให้สามารถเปลี่ยนไป Supabase Storage ภายหลังได้โดยไม่ต้องรื้อ domain model

---

# Version Roadmap

## v0.1.0 — Project Foundation

**เป้าหมาย:** สร้างโครงเว็บและโครงสร้างโปรเจกต์ให้พร้อมพัฒนาต่อ

### ทำ

- สร้าง Vite + Vue 3 + TypeScript
- ตั้ง folder structure
- ตั้ง Vue Router
- สร้าง layout หลัก
- สร้างหน้า Home
- สร้างหน้า Places
- สร้างหน้า Place Detail แบบ mock data
- ตั้ง design tokens เบื้องต้น
- ตั้ง environment variables
- ตั้ง ESLint / Prettier ตามความเหมาะสม
- เตรียม Supabase client
- จัดทำ `.env.example`

### ยังไม่ทำ

- Login
- Upload จริง
- GPS จริง
- Camera จริง
- Database schema เต็มระบบ

### Definition of Done

- `npm run dev` ใช้งานได้
- build production ผ่าน
- route หลักทำงาน
- mock Place แสดงผลได้

---

## v0.2.0 — Place & Shot Point

**เป้าหมาย:** ทำระบบสถานที่และจุดถ่ายให้เป็น domain จริง

### ทำ

- ออกแบบ tables สำหรับ
  - places
  - shot_points
  - reference_frames
- แสดงรายการสถานที่จาก Supabase
- หน้า Place Detail
- รายการ Shot Point ของสถานที่
- หน้า Shot Point Detail
- แสดงภาพ Reference Frame / Mockup
- รองรับข้อมูลพิกัดสถานที่แบบ metadata

### Definition of Done

- เพิ่ม/แก้ไข Place ได้จาก admin/simple data workflow
- ผู้ใช้ดู Place และ Shot Point จากฐานข้อมูลจริงได้
- Reference Frame แสดงตาม Shot Point ได้

---

## v0.3.0 — Authentication & User Profile

**เป้าหมาย:** เชื่อมตัวตนผู้ใช้ก่อนเริ่มส่งภาพจริง

### ทำ

- Supabase Auth
- Email login / magic link หรือวิธี auth ที่เหมาะสม
- User profile ขั้นพื้นฐาน
- My Submissions
- Protected routes เท่าที่จำเป็น
- RLS ขั้นต้น

### Definition of Done

- ผู้ใช้สมัคร/เข้าสู่ระบบได้
- ดู profile ได้
- ระบบรู้ว่า submission เป็นของใคร
- ผู้ใช้เห็นเฉพาะข้อมูลที่ตัวเองควรเห็น

---

## v0.4.0 — Capture / Upload MVP

**เป้าหมาย:** ทำหัวใจหลัก “ไปถ่ายแล้วส่งภาพ”

### ทำ

- Camera UI บนมือถือ
- Upload จาก gallery
- Preview image
- Shot Frame overlay บนหน้ากล้อง/อัปโหลด
- Crop / fit ขั้นพื้นฐานเพื่อช่วยจัดองค์ประกอบ
- Submit image
- บันทึก metadata
  - user_id
  - place_id
  - shot_point_id
  - captured_at
  - submitted_at
  - image URL / file ID
- Submission status
  - pending
  - approved
  - rejected

### หมายเหตุ

MVP สามารถใช้ **manual approval** ก่อน ยังไม่ต้องทำ computer vision ตรวจว่าภาพตรง frame หรือไม่

### Definition of Done

ผู้ใช้สามารถ:

**เปิด Shot Point → เปิดกล้อง/เลือกรูป → เห็นกรอบ → ส่งภาพ → เห็นสถานะส่งสำเร็จ**

---

## v0.5.0 — Daily Image System

**เป้าหมาย:** เปลี่ยน submission จำนวนมากให้กลายเป็น “ภาพประจำวัน”

### ทำ

- Daily image record
- 1 Shot Point / 1 วัน / 1 selected image
- Admin/manual selection flow
- กำหนด image เป็น Daily Image
- แสดงปฏิทินย้อนหลัง
- แสดงวันที่มีภาพ / ไม่มีภาพ
- กัน duplicate / duplicate date logic ระดับ database

### Definition of Done

- แต่ละวันมี Daily Image ได้ไม่เกิน 1 ภาพต่อ Shot Point
- ผู้ใช้เปิด Timeline แล้วดูภาพรายวันได้
- แยก “ภาพที่ส่ง” กับ “ภาพที่ถูกเลือกเป็นภาพประจำวัน” ชัดเจน

---

## v0.6.0 — Timeline & Time-lapse Preview

**เป้าหมาย:** ทำให้ผู้ใช้เห็นผลลัพธ์ของการบันทึกสถานที่

### ทำ

- Timeline viewer
- Day-by-day navigation
- Month navigation
- Play sequence
- Time-lapse preview ใน browser
- กำหนด FPS / speed preset แบบง่าย
- Export job concept (ยังไม่ต้องเป็น cloud render เต็มรูปแบบ)

### Definition of Done

- เลือกช่วงวันที่แล้วเล่นภาพต่อเนื่องได้
- ภาพเรียงตามวันที่ถูกต้อง
- รองรับกรณีวันที่ขาดหาย

---

## v0.7.0 — Real Location Validation

**เป้าหมาย:** เพิ่มความน่าเชื่อถือว่า “ถ่ายที่สถานที่จริง”

### ทำ

- Browser Geolocation API
- Distance check จาก Shot Point
- Permission state handling
- แสดงระยะห่างจากจุดถ่าย
- configurable radius ต่อ Shot Point
- บันทึก location metadata ตอนส่งภาพ

### Important

GPS เป็นเพียง evidence หนึ่งชั้น ไม่ควรถือว่าเป็นหลักฐานสมบูรณ์แบบใน MVP

### Definition of Done

- ระบบสามารถตรวจว่าผู้ใช้อยู่ใน radius ที่กำหนดได้
- ข้อมูล location ถูกบันทึกพร้อม submission
- หากผู้ใช้ไม่อนุญาต GPS ยังมี fallback flow ตามที่ product กำหนด

---

## v0.8.0 — Admin / Moderation MVP

**เป้าหมาย:** ให้เจ้าของระบบบริหารสถานที่ ภาพ และ Daily Image ได้จริง

### ทำ

- Admin dashboard
- Place CRUD
- Shot Point CRUD
- Reference Frame management
- Submission review
- Approve / reject
- Daily Image selection
- Filter by date / place / status
- Basic audit log

### Definition of Done

สามารถบริหารระบบโดยไม่ต้องแก้ข้อมูลใน database ตรง ๆ เป็นประจำ

---

## v0.9.0 — Polish, Reliability & Security

**เป้าหมาย:** เตรียมระบบให้เป็น MVP ที่คนภายนอกใช้งานได้จริง

### ทำ

- Error states
- Empty states
- Loading states
- Retry upload
- Image compression / resizing ตามที่เหมาะสม
- Rate limiting / abuse protection ตาม architecture
- RLS review
- Validate file type / size
- Filename normalization
- EXIF/privacy consideration
- Logging / monitoring ขั้นพื้นฐาน
- Mobile UX polish
- Accessibility pass
- Performance pass

### Definition of Done

flow หลักทำงานได้อย่างเสถียรและมีการจัดการ edge cases สำคัญ

---

# v1.0.0 — MVP Release

**เป้าหมาย:** เปิดใช้งาน MVP สำหรับสถานที่จริงจำนวนจำกัด

### MVP Scope

- Public landing page
- Place list
- Place detail
- Shot Point
- Reference Frame
- Auth
- Camera/upload
- Submission
- GPS validation
- Manual moderation
- Daily Image
- Timeline
- Basic time-lapse preview
- Admin dashboard
- Security / RLS
- Responsive mobile-first UI

### MVP Launch Strategy

เริ่มจากสถานที่จริงจำนวนน้อย เช่น

- 1 เมือง
- 3–5 Places
- Place ละ 1–3 Shot Points

เพื่อทดสอบ:

- คนเข้าใจแนวคิดหรือไม่
- คนยอมออกไปถ่ายจริงหรือไม่
- กรอบช่วยให้ภาพ align ได้ดีหรือไม่
- จำนวน submissions ต่อวันเพียงพอหรือไม่
- ระบบคัดภาพทำงานอย่างไร
- คนกลับมาดู Timeline หรือ Time-lapse หรือไม่

---

# Post-MVP Backlog

## v1.1.0 — Auto Frame Assistance

- Perspective / alignment assistance
- Guide lines
- Horizon assistance
- Optional visual similarity check

## v1.2.0 — Community Selection

- Voting / reactions
- Daily shortlist
- Community-assisted selection
- Anti-spam rules

## v1.3.0 — Multi-Year Archive

- Year 2026 / 2027 / 2028 comparison
- Year-over-year playback
- Place history

## v1.4.0 — Export

- Generate MP4 time-lapse
- Generate vertical/social formats
- Generate share page

## v1.5.0 — More Place Types

- Streets
- Landmarks
- Construction / development sites
- Natural locations
- Seasonal locations

---

# Suggested Database Model

## `profiles`

- id
- display_name
- avatar_url
- created_at

## `places`

- id
- name
- slug
- description
- city
- latitude
- longitude
- is_active
- created_at

## `shot_points`

- id
- place_id
- name
- description
- latitude
- longitude
- allowed_radius_meters
- reference_frame_url
- is_active
- created_at

## `submissions`

- id
- user_id
- place_id
- shot_point_id
- image_url
- storage_provider
- external_file_id
- captured_at
- submitted_at
- latitude
- longitude
- gps_accuracy_meters
- status
- review_note
- reviewed_by
- reviewed_at

## `daily_images`

- id
- shot_point_id
- capture_date
- submission_id
- selected_at
- selected_by

### Constraint

`unique(shot_point_id, capture_date)`

## `audit_logs`

- id
- actor_user_id
- action
- entity_type
- entity_id
- metadata
- created_at

---

# Image Storage Architecture

## Option A — Google Drive + GAS

เหมาะสำหรับเริ่ม MVP หากต้องการควบคุมต้นทุนและใช้ Google Drive เป็น image repository

Flow:

`Vue App → API/GAS → Google Drive`

Supabase:

- user/auth
- metadata
- permissions
- submission state
- image reference

## Option B — Supabase Storage

ง่ายกว่าใน architecture เดียว

Flow:

`Vue App → Supabase Storage → Supabase DB`

### Recommendation for architecture

สร้าง abstraction เช่น `ImageStorageService` ตั้งแต่แรก เพื่อให้ระบบไม่ผูกกับ provider เดียว

ตัวอย่าง:

```ts
interface ImageStorageService {
  upload(
    file: File,
    path: string,
  ): Promise<{
    url: string;
    fileId?: string;
  }>;
  delete(fileId: string): Promise<void>;
}
```

จากนั้นทำ implementation แยก:

- `GoogleDriveStorageService`
- `SupabaseStorageService`

---

# Folder Structure

```text
src/
├─ assets/
├─ components/
│  ├─ place/
│  ├─ shot/
│  ├─ camera/
│  └─ timeline/
├─ composables/
├─ layouts/
├─ pages/
│  ├─ HomeView.vue
│  ├─ PlacesView.vue
│  ├─ PlaceDetailView.vue
│  ├─ ShotPointView.vue
│  ├─ CaptureView.vue
│  ├─ TimelineView.vue
│  ├─ LoginView.vue
│  └─ admin/
├─ router/
├─ stores/
├─ services/
│  ├─ supabase/
│  ├─ image-storage/
│  └─ location/
├─ types/
├─ utils/
└─ App.vue
```

---

# Development Principles

1. **Mobile-first** เพราะ use case หลักเกิด ณ สถานที่จริงบนโทรศัพท์
2. **Build vertical slice** ทีละเวอร์ชัน ให้แต่ละเวอร์ชันรันได้
3. **Don't overbuild** ฟีเจอร์ใดไม่จำเป็นต่อ MVP ให้เลื่อนไปก่อน
4. **Separate domain from storage provider** เพื่อเปลี่ยน Google Drive ↔ Supabase Storage ได้
5. **Manual first, automation later** โดยเฉพาะการคัดภาพและ validation
6. **Database constraints > frontend assumptions** สำหรับข้อมูลสำคัญ เช่น 1 วัน 1 Daily Image
7. **Security by default** ใช้ RLS และห้าม expose secret ใน frontend
8. **Real-world test early** ไม่รอจนเสร็จทั้งหมดจึงทดสอบการถ่าย ณ สถานที่จริง

---

# MVP Success Criteria

MVP ถือว่าใช้งานได้เมื่อผู้ใช้ใหม่สามารถทำ flow นี้ได้โดยไม่ต้องมีคนอธิบาย:

```text
เข้าเว็บ
  ↓
เลือกสถานที่
  ↓
เลือกจุดถ่าย
  ↓
ดู Reference Frame
  ↓
ไปยังสถานที่จริง
  ↓
เปิดกล้อง
  ↓
จัดภาพให้ตรงกรอบ
  ↓
ถ่าย / อัปโหลด
  ↓
ส่งภาพ
  ↓
ตรวจสอบสถานะ
  ↓
กลับมาดู Daily Image
  ↓
เปิด Timeline
  ↓
กด Play ดูการเปลี่ยนแปลง
```

---

# Non-MVP / Explicitly Deferred

- ระบบเหรียญ / Wallet
- Gacha
- Card / Collection system
- Marketplace
- Social feed แบบเต็มรูปแบบ
- Chat
- Follow system
- AI image scoring ขั้นสูง
- AI auto-approve
- Face recognition
- Full video editor
- Native mobile app
- Multi-city enterprise dashboard
- Advanced analytics

---

# First Real Test Dataset

เริ่มจาก **ประตูท่าแพ, เชียงใหม่** เป็นสถานที่ทดลอง

### Test setup

- 1 Place
- 1 Shot Point
- 1 Reference Frame
- เปิดรับภาพ 7 วันก่อน
- Manual moderation
- เลือก Daily Image วันละ 1 ภาพ
- ทำ 7-day preview ก่อน 365-day production

จากนั้นค่อยขยายเป็น 30 วัน → 90 วัน → 365 วัน

> เป้าหมายแรกไม่ใช่ “ทำให้ครบ 365 วันทันที” แต่พิสูจน์ก่อนว่า **คนยอมออกไปถ่ายมุมเดิมซ้ำ ๆ และผลลัพธ์ที่ได้มีคุณค่า**
