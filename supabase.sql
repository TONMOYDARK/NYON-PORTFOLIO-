-- Run this entire file in Supabase SQL Editor.
-- It creates user profiles, admin roles, and secure RLS policies.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (char_length(username) between 3 and 30),
  display_name text default '',
  title text default 'Tech Enthusiast & Digital Creator',
  bio text default '',
  about text default '',
  location text default 'Bangladesh',
  focus text default 'Technology & Digital Work',
  phone text default '',
  email text default '',
  facebook text default '',
  instagram text default '',
  whatsapp text default '',
  linkedin text default '',
  photo_url text default '',
  cv_url text default '',
  skills jsonb default '[]'::jsonb,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Public can read only the portfolio owner's profile(s). To keep the first version simple,
-- the public page reads the row whose role is admin.
drop policy if exists "Public can read admin profile" on public.profiles;
create policy "Public can read admin profile"
on public.profiles for select
using (role = 'admin');

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select to authenticated
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert to authenticated
with check (auth.uid() = id);

-- Automatically create a profile after signup. Username is generated from email until
-- the user changes it in the dashboard.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  base_username text;
  final_username text;
begin
  base_username := lower(regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9_]+', '', 'g'));
  if char_length(base_username) < 3 then base_username := 'user'; end if;
  final_username := left(base_username, 24) || '_' || substr(replace(new.id::text,'-',''),1,5);
  insert into public.profiles(id, username, display_name, email)
  values (new.id, final_username, coalesce(new.raw_user_meta_data->>'display_name',''), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Username -> email lookup for username login.
-- IMPORTANT: this intentionally returns the login email. If you need stronger privacy,
-- use a Supabase Edge Function for username login instead.
create or replace function public.login_email_for_username(p_username text)
returns text
language sql
security definer
set search_path = public
as $$
  select email from public.profiles where lower(username) = lower(p_username) limit 1;
$$;

grant execute on function public.login_email_for_username(text) to anon, authenticated;

-- Storage bucket for admin photo/CV.
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- Anyone can view portfolio assets; authenticated users can upload/update their own path.
drop policy if exists "Public portfolio assets" on storage.objects;
create policy "Public portfolio assets"
on storage.objects for select
using (bucket_id = 'portfolio');

drop policy if exists "Authenticated upload portfolio assets" on storage.objects;
create policy "Authenticated upload portfolio assets"
on storage.objects for insert to authenticated
with check (bucket_id = 'portfolio' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Authenticated update portfolio assets" on storage.objects;
create policy "Authenticated update portfolio assets"
on storage.objects for update to authenticated
using (bucket_id = 'portfolio' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'portfolio' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Authenticated delete portfolio assets" on storage.objects;
create policy "Authenticated delete portfolio assets"
on storage.objects for delete to authenticated
using (bucket_id = 'portfolio' and (storage.foldername(name))[1] = auth.uid()::text);

-- AFTER creating your own account, replace YOUR_USER_UUID with your Auth user id
-- and run this once to make yourself the admin:
-- update public.profiles set role='admin' where id='YOUR_USER_UUID';
