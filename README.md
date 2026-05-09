# KumustaHub

KumustaHub is an MVP for a Filipino community store review site in Japan.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase-ready auth/client wiring
- Prisma schema for Supabase PostgreSQL

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and set these values when Supabase is ready:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
DIRECT_URL=
ADMIN_EMAILS=
```

The current UI uses local seed data in `lib/data.ts` so the MVP can run before the database is provisioned.

For Vercel, set `DATABASE_URL` to the Supabase Transaction pooler connection string. Keep the direct database URL as `DIRECT_URL` for migrations and local admin tasks.

## Supabase Auth

Configure these redirect URLs in Supabase Auth before testing OAuth:

```text
http://localhost:3000/auth/callback
https://kumusta-hub.vercel.app/auth/callback
```

Set `ADMIN_EMAILS` to a comma-separated allowlist of operator email addresses. `/admin` is denied unless the signed-in user's email is listed there.

## Implemented MVP surface

- Top page with area/category discovery
- Search page with keyword, area, category, rating, and Tagalog-support filters
- Store detail pages with SEO metadata, reviews, store info, and OpenStreetMap links
- Brand, area, and category SEO pages
- Login, my page, favorites, store request, admin, contact, terms, and privacy routes
- Prisma schema matching the requirement document's core tables
- Sitemap and robots routes
