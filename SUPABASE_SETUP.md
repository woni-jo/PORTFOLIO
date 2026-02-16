# Supabase Setup

1. Create a Supabase project.
2. Open `SQL Editor` in Supabase dashboard.
3. Copy and run `supabase/projects.sql`.
4. In `Project Settings > API`, copy:
   - `Project URL`
   - `anon public key`
5. Create `next-portfolio/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

6. Restart dev server:

```bash
npm run dev
```

7. Verify:
   - Home page shows project cards from Supabase.
   - Click card: `/projects/[id]` detail page loads.

## Project Schema (Current)

- Table: `public.projects`
- Core columns:
  - `id`, `slug`, `title`, `summary`, `description`
  - `stack`, `image_path`, `detail_image_path`, `github_url`, `live_url`
  - `year` (period text, example: `2025.08 ~ 2025.12`), `role`, `featured`, `sort_order`
  - `status`, `team_size`, `problem`, `solution`, `key_results`, `tech_details`, `images`
  - `created_at`, `updated_at`

## Local Image Paths

- Hero image file path:
  - `public/images/main/profile-main.jpg`
  - Page fallback is `https://placehold.co/1200x1400` when file does not exist.
- Project image file path pattern:
  - Supabase Storage bucket: `project-images`
  - Save card image path in DB `image_path` as `project-1.jpg`
  - Save modal/detail main image path in DB `detail_image_path` as `project-1-detail.jpg`
  - Additional gallery paths go to `images` (text array)
  - App converts `image_path` / `images` into public URLs automatically

## Recommended Sizes

- Hero image (Main section):
  - `1200 x 1400` (portrait, 6:7 ratio)
- Project card image:
  - `1100 x 840` (landscape, about 1.31:1)
- Detail page header image:
  - `1600 x 960` (landscape, 5:3 ratio)

## Notes

- Use JPG/WebP for photos, PNG for transparent graphics.
- Keep each image under about 500KB when possible for faster loading.
