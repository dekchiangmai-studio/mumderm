# Backend

โฟลเดอร์นี้เก็บ backend ทั้งหมดของ MUMDERM

## Structure

```
Backend/
├── GAS/                    # Google Apps Script — image upload
│   ├── Code.gs             # Web App สำหรับรับ upload จาก frontend
│   └── README.md           # Setup & API contract
└── supabase/
    └── migrations/         # PostgreSQL migration files
        ├── 20260918000000_create_place_shot_point_schema.sql
        ├── 20260918010000_create_auth_profile_submission_schema.sql
        └── 20260918020000_tighten_v3_owner_policies.sql
```

## Supabase

- **Auth**: Email + Password
- **Database**: PostgreSQL + RLS on every table
- **Tables**: `places`, `shot_points`, `reference_frames`, `profiles`, `submissions`
- **Planned**: `daily_images` (v0.5.0), `audit_logs` (v0.8.0)

### Running Migrations

```bash
cd Backend/supabase
supabase db push
```

### Creating a New Migration

```bash
supabase migration new description_of_change
```

ตั้งชื่อไฟล์ตาม format: `YYYYMMDDHHMMSS_description.sql`

## Google Apps Script (GAS)

Image upload Web App สำหรับ MVP — ดูรายละเอียดที่ [GAS/README.md](./GAS/README.md)

### Key Points

- รับ POST request จาก frontend (JSON body with base64 image)
- Validate Supabase access token ก่อนรับ upload
- บันทึกไฟล์ลง Google Drive folder ที่กำหนด
- Return `{ fileId, url }` สำหรับบันทึกใน submissions table

