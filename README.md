# Personal Portfolio

A responsive personal portfolio with a browser-based profile editor.

## Deploy on Vercel
1. Upload this folder to a GitHub repository.
2. Import the repository in Vercel.
3. Framework Preset: Other (or leave automatic detection).
4. Build Command: leave empty.
5. Output Directory: leave empty / root.
6. Deploy.

## Edit profile
Open `/admin.html` on the deployed site. Photo, contact information, bio, links and skills can be changed without editing code.

### Important limitation
This starter stores edits in `localStorage`, so changes are only visible in the same browser/device. For true cloud editing from any phone and public updates for everyone, replace the localStorage layer with a database + image storage (e.g. Supabase/Firebase/Vercel Blob) and add authentication.
