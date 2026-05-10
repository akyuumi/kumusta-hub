-- Baseline RLS policies for Supabase client-side access.
-- Server-side Prisma uses the database connection string and is not the primary
-- enforcement path for these policies. These policies protect future direct
-- Supabase client access and Storage uploads.

alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.prefectures enable row level security;
alter table public.areas enable row level security;
alter table public.stores enable row level security;
alter table public.store_photos enable row level security;
alter table public.reviews enable row level security;
alter table public.review_photos enable row level security;
alter table public.favorites enable row level security;
alter table public.reports enable row level security;

drop policy if exists "Public can read brands" on public.brands;
create policy "Public can read brands"
on public.brands
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
on public.categories
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read prefectures" on public.prefectures;
create policy "Public can read prefectures"
on public.prefectures
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read areas" on public.areas;
create policy "Public can read areas"
on public.areas
for select
to anon, authenticated
using (true);

drop policy if exists "Public can read published stores" on public.stores;
create policy "Public can read published stores"
on public.stores
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Public can read published store photos" on public.store_photos;
create policy "Public can read published store photos"
on public.store_photos
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.stores
    where stores.id = store_photos.store_id
      and stores.is_published = true
  )
);

drop policy if exists "Public can read visible reviews" on public.reviews;
create policy "Public can read visible reviews"
on public.reviews
for select
to anon, authenticated
using (
  is_hidden = false
  and exists (
    select 1
    from public.stores
    where stores.id = reviews.store_id
      and stores.is_published = true
  )
);

drop policy if exists "Authenticated users can create own reviews" on public.reviews;
create policy "Authenticated users can create own reviews"
on public.reviews
for insert
to authenticated
with check (
  auth.uid() = user_id
  and rating between 1 and 5
);

drop policy if exists "Users can update own visible reviews" on public.reviews;
create policy "Users can update own visible reviews"
on public.reviews
for update
to authenticated
using (auth.uid() = user_id and is_hidden = false)
with check (auth.uid() = user_id and rating between 1 and 5);

drop policy if exists "Users can delete own reviews" on public.reviews;
create policy "Users can delete own reviews"
on public.reviews
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Public can read visible review photos" on public.review_photos;
create policy "Public can read visible review photos"
on public.review_photos
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.reviews
    join public.stores on stores.id = reviews.store_id
    where reviews.id = review_photos.review_id
      and reviews.is_hidden = false
      and stores.is_published = true
  )
);

drop policy if exists "Users can create photos for own reviews" on public.review_photos;
create policy "Users can create photos for own reviews"
on public.review_photos
for insert
to authenticated
with check (
  exists (
    select 1
    from public.reviews
    where reviews.id = review_photos.review_id
      and reviews.user_id = auth.uid()
  )
);

drop policy if exists "Users can read own favorites" on public.favorites;
create policy "Users can read own favorites"
on public.favorites
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create own favorites" on public.favorites;
create policy "Users can create own favorites"
on public.favorites
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own favorites" on public.favorites;
create policy "Users can delete own favorites"
on public.favorites
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read own reports" on public.reports;
create policy "Users can read own reports"
on public.reports
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create own reports" on public.reports;
create policy "Users can create own reports"
on public.reports
for insert
to authenticated
with check (auth.uid() = user_id);

-- Supabase Storage policies. Buckets are managed through the storage schema.
-- The application currently uses a public store-photos bucket for display.
insert into storage.buckets (id, name, public)
values ('store-photos', 'store-photos', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('review-photos', 'review-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read store photos" on storage.objects;
create policy "Public can read store photos"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'store-photos');

drop policy if exists "Authenticated users can upload store photos" on storage.objects;
create policy "Authenticated users can upload store photos"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'store-photos');

drop policy if exists "Public can read review photos" on storage.objects;
create policy "Public can read review photos"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'review-photos');

drop policy if exists "Authenticated users can upload review photos" on storage.objects;
create policy "Authenticated users can upload review photos"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'review-photos');
