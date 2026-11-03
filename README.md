# MUMDERM

> **One place. One frame. Every day.**

เว็บแอปที่ให้ผู้ใช้ไปยังสถานที่จริง ถ่ายภาพจากจุดและมุมที่ระบบกำหนด แล้วสะสมภาพรายวันเพื่อสร้าง **Timeline / Time-lapse** ของสถานที่นั้นตลอดทั้งปี

---

## Core Concept

1. ระบบกำหนด **Place** และ **Shot Point** ในสถานที่จริง
2. แต่ละ Shot Point มี **Reference Frame** เป็นภาพ/เส้นกำกับช่วยจัดองค์ประกอบ
3. ผู้ใช้ไปยังสถานที่จริง ถ่ายภาพให้ตรงกรอบ แล้วส่งเข้าระบบ
4. ระบบคัดเลือก **Daily Image** วันละ 1 ภาพต่อ Shot Point
5. ภาพรายวันเรียงต่อกันเป็น **Timeline** แสดงการเปลี่ยนแปลงของสถานที่

```
เลือกสถานที่ → เลือกจุดถ่าย → ดูกรอบ → ไปสถานที่จริง
→ เปิดกล้อง → จัดภาพ → ถ่าย/อัปโหลด → ส่ง
→ ดู Daily Image → ดู Timeline
```

---

## Tech Stack

| Layer            | Technology                                |
| ---------------- | ----------------------------------------- |
| **Frontend**     | Vite · Vue 3 · TypeScript · Vue Router    |
| **Auth**         | Supabase Auth (Email + Password)          |
| **Database**     | Supabase PostgreSQL + RLS                 |
| **Image Storage**| Google Drive + GAS (MVP) / Supabase Storage |
| **Design**       | Mobile-first responsive CSS               |

---

## Project Structure

```
04_MUMDERM/
├── Frontend/                # Vue 3 SPA
│   ├── src/
│   │   ├── assets/          # Static assets (images, icons)
│   │   ├── components/      # Reusable Vue components
│   │   ├── data/            # Static/mock data
│   │   ├── lib/             # Service modules (auth, supabase, image-storage)
│   │   ├── router/          # Vue Router configuration
│   │   ├── types/           # TypeScript type definitions
│   │   ├── views/           # Page-level view components
│   │   ├── App.vue          # Root component
│   │   ├── main.ts          # App entry point
│   │   └── style.css        # Global styles
│   ├── public/              # Static public files
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── Backend/
│   ├── GAS/                 # Google Apps Script for Drive upload
│   │   ├── Code.gs
│   │   └── README.md
│   └── supabase/
│       └── migrations/      # PostgreSQL migration files
│
├── doc/
│   ├── PROJECT_PROMPT.md    # Product & development prompt
│   └── plan.md              # Version roadmap & spec
│
├── .agents/                 # AI agent rules
│   ├── rules/
│   │   ├── project.md       # Project-wide rules
│   │   ├── frontend.md      # Frontend-specific rules
│   │   └── backend.md       # Backend-specific rules
│   └── skills/
│
├── AGENTS.md                # Agent instruction summary
├── ARCHITECTURE.md          # System architecture overview
├── CHANGELOG.md             # Version change log
└── README.md                # This file
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- Supabase project (with Auth + PostgreSQL)
- Google Apps Script project (for image upload — optional)

### Setup

1. **Clone the repository**

2. **Install frontend dependencies**

   ```bash
   cd Frontend
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Set the following in `Frontend/.env`:

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_GAS_UPLOAD_URL=https://script.google.com/macros/s/.../exec
   ```

4. **Run database migrations**

   ```bash
   cd Backend/supabase
   supabase db push
   ```

5. **Start development server**

   ```bash
   cd Frontend
   npm run dev
   ```

### Available Scripts

| Script              | Description                    |
| ------------------- | ------------------------------ |
| `npm run dev`       | Start Vite dev server          |
| `npm run build`     | Type-check and production build|
| `npm run typecheck` | Run vue-tsc type checking      |
| `npm run lint`      | Run ESLint                     |
| `npm run format`    | Format code with Prettier      |
| `npm run preview`   | Preview production build       |

---

## Current Version

**v0.4.0** — Capture / Upload MVP

สถานะปัจจุบัน: ผู้ใช้สามารถดูสถานที่ เข้าสู่ระบบ ถ่ายภาพ/อัปโหลด และส่ง submission ได้

ดู [CHANGELOG.md](./CHANGELOG.md) สำหรับรายละเอียดแต่ละเวอร์ชัน

---

## Version Roadmap

| Version | Milestone                     | Status |
| ------- | ----------------------------- | ------ |
| v0.1.0  | Project Foundation            | ✅ Done |
| v0.2.0  | Place & Shot Point            | ✅ Done |
| v0.3.0  | Authentication & Profile      | ✅ Done |
| v0.4.0  | Capture / Upload MVP          | ✅ Done |
| v0.5.0  | Daily Image System            | 🔲 Next |
| v0.6.0  | Timeline & Time-lapse Preview | 🔲      |
| v0.7.0  | GPS Validation                | 🔲      |
| v0.8.0  | Admin / Moderation            | 🔲      |
| v0.9.0  | Polish & Security             | 🔲      |
| v1.0.0  | MVP Release                   | 🔲      |

---

## First Test Site

📍 **ประตูท่าแพ, เชียงใหม่** — 1 Place · 1 Shot Point · 1 Reference Frame

ทดสอบ 7 วัน → 30 วัน → 90 วัน → 365 วัน

---

## License

Private — DEKCHIANGMAI STUDIO

