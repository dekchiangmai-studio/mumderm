# Backend Rules

## Tech Stack

- Supabase Auth (Email + Password)
- Supabase PostgreSQL with Row Level Security (RLS)
- Supabase Edge Functions — เฉพาะเมื่อจำเป็น
- Google Apps Script (GAS) — Image upload to Google Drive (MVP)

## Database Conventions

- Migration files อยู่ใน `Backend/supabase/migrations/`
- ตั้งชื่อ migration: `YYYYMMDDHHMMSS_description.sql`
- **RLS ทุก table** — เปิด `enable row level security` เสมอ
- ใช้ `timestamptz` สำหรับ timestamp columns ทั้งหมด
- ทุก table ควรมี `created_at` และ `updated_at`
- ใช้ database constraints แทน frontend validation สำหรับ business rules สำคัญ
  - เช่น `UNIQUE(shot_point_id, capture_date)` สำหรับ daily_images

## Schema Summary

### Existing Tables

| Table              | PK Type | RLS                         |
| ------------------ | ------- | --------------------------- |
| `places`           | text    | Public read                 |
| `shot_points`      | text    | Public read                 |
| `reference_frames` | text    | Public read                 |
| `profiles`         | uuid    | Owner read + update         |
| `submissions`      | uuid    | Owner read + insert         |

### Planned Tables

| Table          | Version | Notes                              |
| -------------- | ------- | ---------------------------------- |
| `daily_images` | v0.5.0  | UNIQUE(shot_point_id, capture_date)|
| `audit_logs`   | v0.8.0  | Admin action tracking              |

## RLS Policies

- `places`, `shot_points`, `reference_frames` — anon + authenticated can SELECT
- `profiles` — authenticated owner can SELECT + UPDATE
- `submissions` — authenticated owner can SELECT + INSERT; no UPDATE/DELETE
- ห้ามสร้าง policy ที่เปิดกว้างเกินไป

## Triggers

- `on_auth_user_created` → auto-insert `profiles` row

## Image Storage

- MVP ใช้ Google Drive + GAS (`Backend/GAS/Code.gs`)
- GAS ตรวจ Supabase access token ก่อนรับ upload
- Domain logic ไม่ผูกกับ Google Drive โดยตรง — ใช้ `ImageStorageService` abstraction
- ห้ามเก็บ Google/Supabase service role key ใน frontend หรือ GAS public properties

## GAS Web App Contract

- **Endpoint**: POST with JSON body
- **Auth**: Supabase access token ใน `accessToken` field + `Authorization` header
- **Validation**: JPG/PNG/WebP only, ≤ 8 MB
- **Response**: `{ ok, fileId, url }` or `{ ok: false, error }`
- Config ใน GAS Script Properties: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `DRIVE_FOLDER_ID`

## Security

- ห้าม expose service role key ทุกกรณี
- GAS validate token กับ Supabase `/auth/v1/user` ก่อน process
- File type + size validation ทั้ง client (frontend) และ server (GAS)
- Submissions table ไม่ให้ user UPDATE/DELETE

