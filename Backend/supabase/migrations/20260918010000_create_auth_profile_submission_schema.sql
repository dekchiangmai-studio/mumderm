create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.shot_points add constraint shot_points_id_place_id_key unique (id, place_id);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id text not null references public.places(id) on delete restrict,
  shot_point_id text not null references public.shot_points(id) on delete restrict,
  image_url text,
  storage_provider text,
  external_file_id text,
  captured_at timestamptz,
  submitted_at timestamptz not null default now(),
  latitude double precision check (latitude is null or latitude between -90 and 90),
  longitude double precision check (longitude is null or longitude between -180 and 180),
  gps_accuracy_meters double precision check (gps_accuracy_meters is null or gps_accuracy_meters >= 0),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  review_note text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint submissions_shot_point_belongs_to_place foreign key (shot_point_id, place_id)
    references public.shot_points (id, place_id)
);

create index profiles_updated_at_idx on public.profiles (updated_at);
create index submissions_user_id_idx on public.submissions (user_id);
create index submissions_place_id_idx on public.submissions (place_id);
create index submissions_shot_point_id_idx on public.submissions (shot_point_id);
create index submissions_status_idx on public.submissions (status);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.submissions enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Users can read their own submissions"
  on public.submissions for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can create their own submissions"
  on public.submissions for insert
  to authenticated
  with check (user_id = auth.uid());

revoke update on public.submissions from authenticated;
revoke delete on public.submissions from authenticated;
