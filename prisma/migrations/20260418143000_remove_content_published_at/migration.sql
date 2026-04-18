DROP INDEX IF EXISTS "public"."Content_publishedAt_idx";

ALTER TABLE "public"."Content" DROP COLUMN IF EXISTS "publishedAt";
