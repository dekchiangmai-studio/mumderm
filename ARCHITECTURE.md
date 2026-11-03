# MUMDERM — Architecture

## System Overview

```
┌─────────────────────────────────────────────────────┐
│                    User (Mobile)                    │
└──────────────────────┬──────────────────────────────┘
                       │
              ┌────────▼────────┐
              │   Vue 3 SPA     │
              │   (Vite + TS)   │
              └───┬────┬────┬───┘
                  │    │    │
     ┌────────────┘    │    └────────────┐
     ▼                 ▼                 ▼
┌─────────┐   ┌──────────────┐   ┌──────────────────┐
│ Supabase│   │  Supabase    │   │ ImageStorage     │
│ Auth    │   │  PostgreSQL  │   │ Service          │
│         │   │  + RLS       │   │                  │
└─────────┘   └──────────────┘   │ ┌──────────────┐ │
                                 │ │ Google Drive  │ │
                                 │ │ + GAS (MVP)   │ │
                                 │ ├──────────────┤ │
                                 │ │ Supabase     │ │
                                 │ │ Storage      │ │
                                 │ │ (future)     │ │
                                 │ └──────────────┘ │
                                 └──────────────────┘
```

---

## Frontend Architecture

### Framework & Tooling

- **Vite** — Build tool & dev server
- **Vue 3** — Composition API, `<script setup>` style
- **TypeScript** — Strict typing
- **Vue Router** — SPA routing with auth guards

### Directory Layout

```
src/
├── assets/          # Images, SVGs
├── components/      # Shared UI components
│   ├── AppHeader.vue
│   ├── PlaceCard.vue
│   └── HeroSection (ถ้ามี)
├── data/            # Static/mock data
├── lib/             # Service layer
│   ├── supabase.ts        # Supabase client singleton
│   ├── auth.ts            # Auth state & functions
│   ├── image-storage.ts   # Image upload via GAS
│   ├── places.ts          # Place queries
│   ├── profile.ts         # Profile queries
│   └── submissions.ts     # Submission queries
├── router/          # Route definitions + guards
├── types/           # TypeScript interfaces
│   ├── auth.ts
│   ├── place.ts
│   ├── profile.ts
│   └── submission.ts
└── views/           # Page components (1 per route)
    ├── HomeView.vue
    ├── PlacesView.vue
    ├── PlaceDetailView.vue
    ├── ShotPointDetailView.vue
    ├── CaptureView.vue
    ├── LoginView.vue
    ├── ProfileView.vue
    ├── MySubmissionsView.vue
    └── NotFoundView.vue
```

### Routing

| Path                                            | View                  | Auth |
| ----------------------------------------------- | --------------------- | ---- |
| `/`                                             | HomeView              | No   |
| `/places`                                       | PlacesView            | No   |
| `/places/:placeId`                              | PlaceDetailView       | No   |
| `/places/:placeId/shot-points/:shotPointId`     | ShotPointDetailView   | No   |
| `/places/:placeId/shot-points/:shotPointId/capture` | CaptureView       | Yes  |
| `/login`                                        | LoginView             | No   |
| `/profile`                                      | ProfileView           | Yes  |
| `/my-submissions`                               | MySubmissionsView     | Yes  |

### Auth Flow

1. `initializeAuth()` เรียก `supabase.auth.getSession()` ครั้งเดียว
2. `onAuthStateChange` listener อัปเดต reactive state
3. Router guard ตรวจ `meta.requiresAuth` ก่อนเข้าหน้าที่ต้อง login
4. ถ้ายังไม่ login → redirect ไป `/login?redirect=...`

---

## Backend Architecture

### Supabase

- **Auth** — Email + Password signup/login
- **PostgreSQL** — Main database with RLS
- **Edge Functions** — สำรองไว้ใช้เฉพาะเมื่อจำเป็น

### Database Schema

```
profiles
├── id (uuid, PK, FK → auth.users)
├── display_name
├── created_at
└── updated_at

places
├── id (text, PK)
├── name
├── province
├── country
├── description
├── image_url
├── status (active / coming-soon / archived)
├── address
├── latitude / longitude
├── created_at / updated_at

shot_points
├── id (text, PK)
├── place_id (FK → places)
├── name
├── direction
├── description
├── capture_hint
├── status (active / coming-soon / archived)
├── created_at / updated_at

reference_frames
├── id (text, PK)
├── shot_point_id (FK → shot_points)
├── name
├── image_url
├── fit (contain / cover)
├── opacity (0–1)
├── is_active
├── created_at / updated_at

submissions
├── id (uuid, PK)
├── user_id (FK → auth.users)
├── place_id (FK → places)
├── shot_point_id (FK → shot_points)
├── image_url
├── storage_provider
├── external_file_id
├── captured_at
├── submitted_at
├── latitude / longitude
├── gps_accuracy_meters
├── status (pending / approved / rejected)
├── review_note
├── reviewed_by / reviewed_at
├── created_at / updated_at

daily_images  (planned — v0.5.0)
├── id
├── shot_point_id
├── capture_date
├── submission_id
├── selected_at / selected_by
└── UNIQUE(shot_point_id, capture_date)

audit_logs  (planned — v0.8.0)
├── id
├── actor_user_id
├── action
├── entity_type / entity_id
├── metadata
└── created_at
```

### Row Level Security (RLS)

| Table            | Policy                                      |
| ---------------- | ------------------------------------------- |
| `places`         | Public read (anon + authenticated)          |
| `shot_points`    | Public read (anon + authenticated)          |
| `reference_frames` | Public read (anon + authenticated)       |
| `profiles`       | Owner read + update only                    |
| `submissions`    | Owner read + insert only; no update/delete  |

### Triggers

- `on_auth_user_created` → auto-create row ใน `profiles`

---

## Image Storage Architecture

### Abstraction Layer

```typescript
interface ImageStorageService {
  upload(file: File, path: string): Promise<{ url: string; fileId?: string }>
  delete(fileId: string): Promise<void>
}
```

### MVP Implementation — Google Drive + GAS

```
Vue App
  │  POST JSON (base64 image + metadata + access token)
  ▼
Google Apps Script Web App
  │  1. Validate Supabase access token via /auth/v1/user
  │  2. Validate file type (JPG/PNG/WebP) & size (≤ 8 MB)
  │  3. Create file in Google Drive folder
  │  4. Set sharing: anyone-with-link can view
  ▼
Return { fileId, url }
```

### Future — Supabase Storage

สามารถสร้าง `SupabaseStorageService` implement interface เดียวกันแล้วสลับ provider ได้โดยไม่กระทบ domain logic

---

## Security Principles

1. **ไม่ expose secrets ใน frontend** — ไม่มี service role key, Drive credentials
2. **RLS ทุก table** — enforce ที่ database ไม่พึ่ง frontend อย่างเดียว
3. **Token validation** — GAS ตรวจ Supabase access token ก่อนรับ upload
4. **File validation** — ตรวจ type + size ทั้ง client และ server (GAS)
5. **No direct update/delete** — user ไม่สามารถแก้ไขหรือลบ submission ของตัวเอง

---

## Key Design Decisions

| Decision | Rationale |
| -------- | --------- |
| Google Drive + GAS สำหรับ MVP | ลดต้นทุน storage; เปลี่ยนได้ภายหลัง |
| Text-based IDs สำหรับ places/shot_points | อ่านง่าย ใช้เป็น slug ได้ |
| UUID สำหรับ submissions | ป้องกัน enumeration |
| Mobile-first CSS | Use case หลักเกิดที่สถานที่จริงบนมือถือ |
| Manual moderation ก่อน | พิสูจน์ concept ก่อนทำ automation |
| Reactive auth state (ไม่ใช่ Pinia) | เรียบง่าย ยังไม่ต้องการ store เต็มรูปแบบ |

