# Prompt สำหรับสร้างเว็บแอป MUMDERM

คุณคือ Senior Full-Stack Engineer + Product Engineer ช่วยพัฒนาเว็บแอปชื่อว่า **MUMDERM**

## Product concept

สร้างเว็บแอปที่ให้ผู้ใช้ไปยังสถานที่จริง แล้วถ่ายภาพจาก **จุดและมุมที่ระบบกำหนด** โดยมี **Reference Frame / Mockup Overlay** ช่วยจัดองค์ประกอบให้ใกล้เคียงกัน เมื่อมีผู้ใช้ส่งภาพเข้ามาหลายภาพในแต่ละวัน ระบบสามารถเลือก 1 ภาพเป็น **Daily Image** และสะสมภาพตามวันเพื่อสร้าง **Timeline / Time-lapse ของสถานที่นั้น**

ตัวอย่าง:

**Place:** ประตูท่าแพ เชียงใหม่  
**Shot Point:** มุม A  
**Reference Frame:** กรอบที่กำหนดตำแหน่งประตูและองค์ประกอบ  
**Daily Result:** 1 ภาพต่อวัน  
**Final Output:** 365 ภาพ → วิดีโอ/Time-lapse แสดงการเปลี่ยนแปลงของสถานที่ตลอดปี

นี่ไม่ใช่ระบบการ์ด และไม่ควรออกแบบให้เหมือน TAMKEP หรือระบบสะสมไอเท็ม เกม หรือ Marketplace

---

## Tech stack — ห้ามเปลี่ยนโดยไม่มีเหตุผล

### Frontend

- Vite
- Vue 3
- TypeScript
- Vue Router
- Pinia เมื่อจำเป็น
- Mobile-first responsive UI

### Backend

- Supabase Auth
- Supabase PostgreSQL
- Supabase RLS
- Supabase Edge Functions เฉพาะกรณีจำเป็น

### Image storage

ให้รองรับ architecture 2 ทาง:

1. Google Drive + Google Apps Script (GAS)
2. Supabase Storage

เริ่ม MVP สามารถใช้ Google Drive + GAS ได้ แต่ **อย่าผูก domain logic กับ Google Drive โดยตรง** ต้องสร้าง `ImageStorageService` abstraction เพื่อเปลี่ยน provider ได้ภายหลัง

ห้ามใส่ secret ของ Google/Supabase service role ลง frontend

---

## Development strategy

พัฒนาแบบ **version-by-version** โดยยึด `plan.md` เป็น source of truth

ลำดับหลัก:

- v0.1.0 — Foundation
- v0.2.0 — Place & Shot Point
- v0.3.0 — Auth
- v0.4.0 — Capture / Upload
- v0.5.0 — Daily Image
- v0.6.0 — Timeline / Time-lapse Preview
- v0.7.0 — GPS Validation
- v0.8.0 — Admin / Moderation
- v0.9.0 — Polish / Security / Reliability
- v1.0.0 — MVP

**อย่ากระโดดไปทำฟีเจอร์ของเวอร์ชันถัดไปก่อนที่เวอร์ชันปัจจุบันจะใช้งานได้**

ทุก version ต้องเป็น vertical slice ที่รันได้จริงและไม่ทำให้ฟีเจอร์เดิมพัง

---

## วิธีทำงานทุกครั้ง

ก่อนเขียนโค้ด:

1. อ่าน `plan.md`
2. ระบุว่ากำลังทำ version ไหน
3. สรุป scope ของ version นั้นสั้น ๆ
4. ตรวจว่ามีอะไรนอก scope แล้วเลื่อนไปก่อน
5. ตรวจ architecture เดิมก่อนแก้ไฟล์

หลังเขียนโค้ด:

1. รัน type check / lint / build ตาม project setup
2. ตรวจ route หลัก
3. ตรวจ responsive โดยเฉพาะ mobile
4. ตรวจ error state และ empty state ของ flow ที่ทำ
5. สรุปไฟล์ที่แก้และสิ่งที่เสร็จ
6. ระบุสิ่งที่ยังไม่ทำเพราะอยู่นอก scope

---

## UX หลัก

ผู้ใช้ใหม่ต้องเข้าใจ flow นี้โดยไม่ต้องมีคู่มือยาว:

`เลือกสถานที่ → เลือกจุดถ่าย → ดูกรอบ → ไปสถานที่จริง → เปิดกล้อง → จัดภาพ → ถ่าย/อัปโหลด → ส่ง → ดู Daily Image → ดู Timeline`

หน้าหลักต้องเน้น **สถานที่จริง + ภาพจากสถานที่จริง**

การออกแบบควรเรียบ สะอาด และทำให้ “ภาพ” เป็นพระเอก

---

## Reference Frame behavior

Reference Frame คือภาพ/เส้นกำกับที่ซ้อนบนกล้องหรือ preview

ต้องรองรับอย่างน้อย:

- fit / contain / cover ที่ควบคุมได้
- opacity ของ overlay
- guide / alignment
- preview ก่อนส่ง

ยังไม่ต้องทำ computer vision ใน MVP แรก

---

## Submission model

Submission ควรเก็บอย่างน้อย:

- user_id
- place_id
- shot_point_id
- image URL / external file ID
- captured_at
- submitted_at
- latitude
- longitude
- GPS accuracy ถ้ามี
- status
- review note
- reviewed_by / reviewed_at

Status ขั้นต้น:

- pending
- approved
- rejected

Daily Image:

- 1 Shot Point ต่อ 1 วัน มี Daily Image ได้ไม่เกิน 1 ภาพ
- enforce ด้วย database constraint ไม่พึ่ง frontend อย่างเดียว

---

## Initial architecture suggestion

```text
Vue 3 App
   │
   ├── Supabase Auth
   ├── Supabase DB
   │
   └── ImageStorageService
          ├── Google Drive + GAS
          └── Supabase Storage
```

ตัวอย่าง interface:

```ts
export interface ImageStorageService {
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

---

## Database baseline

ออกแบบ schema หลักตามนี้:

- `profiles`
- `places`
- `shot_points`
- `submissions`
- `daily_images`
- `audit_logs`

เพิ่ม table ได้เมื่อจำเป็น แต่ต้องหลีกเลี่ยงการสร้าง schema เกิน requirement ของ current version

---

## MVP constraints

จนกว่าจะถึง v1.0.0 ห้ามใส่สิ่งเหล่านี้โดยอัตโนมัติถ้าไม่ได้สั่ง:

- Gacha
- Card system
- Marketplace
- Coins / Wallet
- Ranking
- Full social feed
- Chat
- Follow system
- Face recognition
- AI auto approval
- Native mobile app
- Advanced video editor

---

## Real-world testing strategy

เริ่ม prototype จาก:

**ประตูท่าแพ — เชียงใหม่**

ใช้เพียง:

- 1 Place
- 1 Shot Point
- 1 Reference Frame

ก่อนทำ 365 วัน ให้ทดสอบ 7 วัน → 30 วัน → 90 วัน

สิ่งที่ต้องพิสูจน์ก่อนขยายระบบ:

- ผู้ใช้เข้าใจการจัดเฟรมหรือไม่
- ผู้ใช้ยอมเดินทางไปถ่ายจริงหรือไม่
- ภาพจากหลายคนยัง align กันได้หรือไม่
- ระบบคัดภาพวันละ 1 ภาพทำได้หรือไม่
- Timeline มีประโยชน์/ความน่าสนใจจริงหรือไม่

---

## Coding style

- ใช้ TypeScript แบบ strict เท่าที่ project รองรับ
- แยก UI, domain logic, services และ data access
- component ไม่ควรมี business logic หนักเกินไป
- ตั้งชื่อชัดเจน
- reuse composables/services เมื่อมี pattern ซ้ำ
- อย่าสร้าง abstraction จำนวนมากโดยไม่มี use case
- comments เฉพาะ logic ที่ไม่ชัดเจน
- ไม่ hardcode secrets
- validate input ทั้ง client และ server ตามความเหมาะสม

---

## Important output format when implementing a version

เมื่อได้รับคำสั่งให้ “ทำ vX.Y.Z” ให้ตอบในโครงสร้างนี้:

### 1. Scope

บอกว่างาน version นี้มีอะไรบ้าง

### 2. Files

ระบุไฟล์ที่จะสร้าง/แก้

### 3. Implementation

เขียนโค้ดที่จำเป็น

### 4. Validation

รัน check/lint/build และแก้ error ที่พบ

### 5. Done

สรุปว่า requirement ไหนเสร็จแล้ว

### 6. Deferred

บอกสิ่งที่ยังไม่ทำเพราะอยู่นอก version นี้

จากนั้นหยุดที่ scope ของ version ปัจจุบัน เว้นแต่ผู้ใช้สั่งไป version ถัดไป
