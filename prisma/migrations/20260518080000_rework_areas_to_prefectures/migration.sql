WITH prefecture_areas AS (
  INSERT INTO "areas" ("id", "prefecture_id", "slug", "name_ja", "name_en")
  SELECT gen_random_uuid(), "id", "slug", "name_ja", "name_en"
  FROM "prefectures"
  ON CONFLICT ("slug") DO UPDATE
  SET
    "prefecture_id" = EXCLUDED."prefecture_id",
    "name_ja" = EXCLUDED."name_ja",
    "name_en" = EXCLUDED."name_en"
  RETURNING "id", "prefecture_id"
)
UPDATE "stores"
SET "area_id" = "prefecture_areas"."id"
FROM "areas" AS "old_areas"
INNER JOIN "prefecture_areas" ON "prefecture_areas"."prefecture_id" = "old_areas"."prefecture_id"
WHERE "stores"."area_id" = "old_areas"."id"
  AND "old_areas"."id" <> "prefecture_areas"."id";

WITH prefecture_areas AS (
  INSERT INTO "areas" ("id", "prefecture_id", "slug", "name_ja", "name_en")
  SELECT gen_random_uuid(), "id", "slug", "name_ja", "name_en"
  FROM "prefectures"
  ON CONFLICT ("slug") DO UPDATE
  SET
    "prefecture_id" = EXCLUDED."prefecture_id",
    "name_ja" = EXCLUDED."name_ja",
    "name_en" = EXCLUDED."name_en"
  RETURNING "id", "prefecture_id"
)
UPDATE "store_requests"
SET "area_id" = "prefecture_areas"."id"
FROM "areas" AS "old_areas"
INNER JOIN "prefecture_areas" ON "prefecture_areas"."prefecture_id" = "old_areas"."prefecture_id"
WHERE "store_requests"."area_id" = "old_areas"."id"
  AND "old_areas"."id" <> "prefecture_areas"."id";

DELETE FROM "areas"
USING "prefectures"
WHERE "areas"."prefecture_id" = "prefectures"."id"
  AND "areas"."slug" <> "prefectures"."slug";
