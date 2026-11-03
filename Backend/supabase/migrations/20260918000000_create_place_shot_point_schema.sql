create table public.places (
  id text primary key,
  name text not null,
  province text not null,
  country text not null default 'ประเทศไทย',
  description text not null default '',
  image_url text not null,
  status text not null default 'coming-soon' check (status in ('active', 'coming-soon', 'archived')),
  address text,
  latitude double precision check (latitude is null or latitude between -90 and 90),
  longitude double precision check (longitude is null or longitude between -180 and 180),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shot_points (
  id text primary key,
  place_id text not null references public.places(id) on delete cascade,
  name text not null,
  direction text not null default '',
  description text not null default '',
  capture_hint text not null default '',
  status text not null default 'coming-soon' check (status in ('active', 'coming-soon', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reference_frames (
  id text primary key,
  shot_point_id text not null references public.shot_points(id) on delete cascade,
  name text not null,
  image_url text not null,
  fit text not null default 'cover' check (fit in ('contain', 'cover')),
  opacity numeric(3, 2) not null default 0.65 check (opacity between 0 and 1),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index shot_points_place_id_idx on public.shot_points (place_id);
create index reference_frames_shot_point_id_idx on public.reference_frames (shot_point_id);
create index places_status_idx on public.places (status);

alter table public.places enable row level security;
alter table public.shot_points enable row level security;
alter table public.reference_frames enable row level security;

create policy "Public can read places"
  on public.places for select
  to anon, authenticated
  using (true);

create policy "Public can read shot points"
  on public.shot_points for select
  to anon, authenticated
  using (true);

create policy "Public can read reference frames"
  on public.reference_frames for select
  to anon, authenticated
  using (true);

insert into public.places (
  id, name, province, country, description, image_url, status, address, latitude, longitude
) values (
  'tha-phae-gate',
  'ประตูท่าแพ',
  'เชียงใหม่',
  'ประเทศไทย',
  'จุดเริ่มต้นของการบันทึกการเปลี่ยนแปลงเมืองเชียงใหม่ ผ่านภาพจากมุมเดิมในทุกวัน',
  'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'active',
  'ถนนท่าแพ ตำบลช้างคลาน อำเภอเมืองเชียงใหม่ เชียงใหม่',
  18.788438,
  98.993235
) on conflict (id) do update set
  name = excluded.name,
  province = excluded.province,
  country = excluded.country,
  description = excluded.description,
  image_url = excluded.image_url,
  status = excluded.status,
  address = excluded.address,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  updated_at = now();

insert into public.shot_points (
  id, place_id, name, direction, description, capture_hint, status
) values (
  'tha-phae-gate-main',
  'tha-phae-gate',
  'มุมด้านหน้าประตู',
  'ทิศตะวันตก',
  'ยืนฝั่งคูเมือง หันเข้าหาประตูท่าแพ ให้แนวกำแพงอยู่ในกรอบทั้งสองข้าง',
  'จัดยอดกำแพงให้อยู่ใต้เส้นบน และให้ประตูอยู่กึ่งกลางเฟรม',
  'active'
) on conflict (id) do update set
  place_id = excluded.place_id,
  name = excluded.name,
  direction = excluded.direction,
  description = excluded.description,
  capture_hint = excluded.capture_hint,
  status = excluded.status,
  updated_at = now();

insert into public.reference_frames (
  id, shot_point_id, name, image_url, fit, opacity, is_active
) values (
  'tha-phae-gate-main-reference',
  'tha-phae-gate-main',
  'กรอบอ้างอิงหลัก',
  '/frames/tha-phae-gate-frame.png',
  'cover',
  0.65,
  true
) on conflict (id) do update set
  shot_point_id = excluded.shot_point_id,
  name = excluded.name,
  image_url = excluded.image_url,
  fit = excluded.fit,
  opacity = excluded.opacity,
  is_active = excluded.is_active,
  updated_at = now();
