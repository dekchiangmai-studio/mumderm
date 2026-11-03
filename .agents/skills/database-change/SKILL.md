---
name: database-change
description: สร้าง Supabase migration อย่างถูกต้องตาม convention ของ MUMDERM — schema, RLS, indexes, seeds
---

# Database Change

ใช้ skill นี้เมื่อต้องเปลี่ยนแปลง database schema

## Steps

### 1. Plan

- อ่าน `doc/plan.md` — ตรวจว่า table/column ที่จะเพิ่มอยู่ใน scope ของ version ปัจจุบัน
- อ่าน `ARCHITECTURE.md` — ตรวจ schema ที่มีอยู่
- ดู migration files เดิมใน `Backend/supabase/migrations/`

### 2. Create Migration

สร้างไฟล์ migration ใหม่:

```
Backend/supabase/migrations/YYYYMMDDHHMMSS_description.sql
```

### 3. Schema Conventions

- ใช้ `timestamptz` สำหรับทุก timestamp column
- ทุก table ต้องมี `created_at` และ `updated_at` (default `now()`)
- Foreign keys ใช้ `on delete cascade` หรือ `on delete restrict` ตามความเหมาะสม
- Check constraints สำหรับ enum values: `check (status in ('a', 'b', 'c'))`
- สร้าง index สำหรับ FK columns และ columns ที่ query บ่อย

### 4. RLS (Required)

ทุก table ใหม่ต้อง:

```sql
alter table public.table_name enable row level security;

create policy "Policy description"
  on public.table_name for select
  to authenticated
  using (...);
```

### 5. Seed Data (Optional)

- ใช้ `insert ... on conflict do update` สำหรับ seed data
- Seed data ใส่ท้าย migration file เดียวกันได้

### 6. Apply & Verify

```bash
cd Backend/supabase
supabase db push
supabase migration list
```

### 7. Update Docs

- อัปเดต schema section ใน `ARCHITECTURE.md`
- อัปเดต types ใน `Frontend/src/types/` ให้ตรงกับ schema ใหม่

