# MUMDERM Frontend

Frontend ของ MUMDERM สร้างด้วย Vue 3, TypeScript, Vite และ Vue Router

## Requirements

- Node.js 20 ขึ้นไป
- npm 10 ขึ้นไป

ตรวจสอบ version ที่ติดตั้งอยู่:

```powershell
node --version
npm --version
```

## ติดตั้งครั้งแรก

เปิด PowerShell แล้วเข้าโฟลเดอร์ frontend:

```powershell
cd "C:\Users\MATIMON\OneDrive\Workplace\DEKCHIANGMAI STUDIO\02_Web_Development\06_\Frontend"
npm install
```

## ตั้งค่า Environment Variables

v0.2.0 ใช้ Supabase เป็นแหล่งข้อมูลจริงสำหรับ Place, Shot Point และ Reference Frame:

```powershell
Copy-Item .env.example .env
```

เมื่อเริ่มใช้ Supabase ให้เติมค่าใน `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

ห้ามใส่ Supabase service role key หรือ secret อื่นใน frontend

หลังตั้งค่า Supabase CLI แล้ว ให้เข้าโฟลเดอร์ `Backend` และรัน:

```powershell
supabase link --project-ref kqwasmpgsltvuueyuqqz
supabase db push
```

คำสั่งนี้จะรัน migration และเพิ่มข้อมูล seed ประตูท่าแพให้อัตโนมัติ
ตรวจสอบ migration ที่ deploy แล้วด้วย `supabase migration list`

การเพิ่มหรือแก้ไขข้อมูลใน v0.2.0 ใช้ Supabase Dashboard > Table Editor
หรือ migration ใหม่ผ่าน CLI โดย frontend เปิดอ่านข้อมูลแบบ public ผ่าน RLS เท่านั้น

## Authentication ใน v0.3.0

เปิดใช้งาน Email provider ใน Supabase Dashboard > Authentication > Providers
และเปิดการยืนยันอีเมลสำหรับผู้ใช้ใหม่ ตั้งค่า Site URL เป็น URL ของ frontend
เช่น `http://localhost:5173` หรือ `http://127.0.0.1:5173` และเพิ่ม URL เดียวกันใน
Authentication > URL Configuration > Redirect URLs

Migration v0.3 เพิ่ม `profiles` และ `submissions` พร้อม owner-only RLS
โดย profile จะถูกสร้างอัตโนมัติหลัง signup ผู้ใช้แก้ได้เฉพาะ display name

หน้า `/my-submissions` พร้อมแล้วในรูปแบบ empty state การสร้าง submission,
camera และ upload จะเริ่มใน v0.4.0

## รัน Development Server

```powershell
npm run dev
```

จากนั้นเปิด URL ที่ Vite แสดงใน terminal โดยปกติคือ:

```text
http://localhost:5173/
```

กด `Ctrl+C` เพื่อหยุด server

## คำสั่งตรวจสอบโค้ด

ตรวจ TypeScript:

```powershell
npm run typecheck
```

ตรวจ ESLint:

```powershell
npm run lint
```

จัดรูปแบบไฟล์ด้วย Prettier:

```powershell
npm run format
```

รันตรวจสอบทั้งหมดก่อนส่งงาน:

```powershell
npm run typecheck
npm run lint
npm run build
```

## Build และ Preview แบบ Production

สร้าง production build:

```powershell
npm run build
```

ไฟล์จะถูกสร้างไว้ในโฟลเดอร์ `dist/`

เปิดดู production build แบบ local:

```powershell
npm run preview
```

โดยปกติจะเปิดที่:

```text
http://localhost:4173/
```

## Routes ปัจจุบัน

- `/` หน้า Home
- `/places` รายการสถานที่
- `/places/tha-phae-gate` รายละเอียดประตูท่าแพและรายการ Shot Point
- `/places/tha-phae-gate/shot-points/tha-phae-gate-main` รายละเอียด Shot Point และ Reference Frame
- `/login` สมัครสมาชิกและเข้าสู่ระบบด้วย Email + Password
- `/profile` โปรไฟล์ผู้ใช้ (ต้อง login)
- `/my-submissions` ภาพของฉัน (ต้อง login)

## Current Scope: v0.3.0

เวอร์ชันนี้เพิ่ม Email + Password authentication, email confirmation,
protected routes, display-name profile และ owner-only RLS ยังไม่มี:

- Upload หรือ Camera
- GPS validation
- Magic Link หรือ OAuth
- Avatar และ image storage
- การสร้าง submission ผ่าน UI
- Daily Image
- Timeline / Time-lapse
- Admin UI ในแอป
