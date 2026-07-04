-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  full_name text,
  email text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Bookings table
create table public.bookings (
  id bigint generated always as identity primary key,
  member_id uuid not null references public.profiles(id) on delete cascade,
  lesson_date timestamptz not null,
  platform text not null check (platform in ('zoom','whatsapp','telegram','signal')),
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile row whenever someone signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.bookings enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

create policy "View own profile or admin views all"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "View own bookings or admin views all"
  on public.bookings for select
  using (auth.uid() = member_id or public.is_admin());

create policy "Users create own bookings"
  on public.bookings for insert
  with check (auth.uid() = member_id);

create policy "Admins update bookings"
  on public.bookings for update
  using (public.is_admin());
