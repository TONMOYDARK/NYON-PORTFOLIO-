# Nyon Personal Portfolio — Supabase Auth Edition

## Features
- Public portfolio
- Public signup with username + email + password
- Login with email or username
- Secure Supabase Auth session
- Admin-only dashboard
- Change admin username, login email and password
- Cloud profile photo and CV uploads
- Portfolio content stored in Supabase and visible to everyone

## Setup
1. Create a Supabase project.
2. Open Supabase SQL Editor and run `supabase.sql` from this folder.
3. In Supabase Authentication > URL Configuration, add your Vercel site URL and `https://YOUR-VERCEL-DOMAIN/admin.html` as redirect URL.
4. Open `config.js` and replace `YOUR-PROJECT` URL and anon/publishable key.
5. Upload/replace these files in GitHub.
6. Open `auth.html` on your deployed site and create your account.
7. In Supabase Dashboard > Authentication > Users, copy your user UUID.
8. In SQL Editor run: `update public.profiles set role='admin' where id='YOUR_USER_UUID';`
9. Log in again at `/auth.html`; you can now use `/admin.html`.

### Important
The Supabase anon/publishable key is designed to be used in browser apps. Never put a Supabase service-role/secret key in `config.js` or any frontend file.
