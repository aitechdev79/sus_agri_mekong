ALTER TYPE "public"."ContentType" ADD VALUE IF NOT EXISTS 'EVENT';

ALTER TABLE "public"."Content"
ADD COLUMN "eventStartAt" TIMESTAMP(3),
ADD COLUMN "eventEndAt" TIMESTAMP(3),
ADD COLUMN "eventTimezone" TEXT,
ADD COLUMN "eventLocation" TEXT,
ADD COLUMN "isAllDay" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "Content_eventStartAt_idx" ON "public"."Content"("eventStartAt");
