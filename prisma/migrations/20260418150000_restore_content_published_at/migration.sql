ALTER TABLE "public"."Content" ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);

UPDATE "public"."Content"
SET "publishedAt" = "createdAt"
WHERE "status" = 'PUBLISHED'
  AND "publishedAt" IS NULL;

CREATE INDEX IF NOT EXISTS "Content_publishedAt_idx" ON "public"."Content"("publishedAt");
