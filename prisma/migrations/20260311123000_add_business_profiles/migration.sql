-- Alter user role enum
ALTER TYPE "public"."UserRole" ADD VALUE IF NOT EXISTS 'BUSINESS';

-- Create business status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BusinessProfileStatus') THEN
    CREATE TYPE "public"."BusinessProfileStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
  END IF;
END $$;

-- Create table
CREATE TABLE IF NOT EXISTS "public"."BusinessProfile" (
  "id" TEXT NOT NULL,
  "ownerUserId" TEXT,
  "companyName" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "logoUrl" TEXT,
  "coverUrl" TEXT,
  "website" TEXT,
  "contactEmail" TEXT,
  "phone" TEXT,
  "province" TEXT,
  "description" TEXT,
  "status" "public"."BusinessProfileStatus" NOT NULL DEFAULT 'DRAFT',
  "isPublic" BOOLEAN NOT NULL DEFAULT false,
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "reviewedById" TEXT,
  "reviewNotes" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BusinessProfile_pkey" PRIMARY KEY ("id")
);

-- Constraints and indexes
CREATE UNIQUE INDEX IF NOT EXISTS "BusinessProfile_slug_key" ON "public"."BusinessProfile"("slug");
CREATE INDEX IF NOT EXISTS "BusinessProfile_ownerUserId_idx" ON "public"."BusinessProfile"("ownerUserId");
CREATE INDEX IF NOT EXISTS "BusinessProfile_status_idx" ON "public"."BusinessProfile"("status");
CREATE INDEX IF NOT EXISTS "BusinessProfile_isPublic_idx" ON "public"."BusinessProfile"("isPublic");
CREATE INDEX IF NOT EXISTS "BusinessProfile_displayOrder_idx" ON "public"."BusinessProfile"("displayOrder");

ALTER TABLE "public"."BusinessProfile"
ADD CONSTRAINT "BusinessProfile_ownerUserId_fkey"
FOREIGN KEY ("ownerUserId") REFERENCES "public"."User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "public"."BusinessProfile"
ADD CONSTRAINT "BusinessProfile_reviewedById_fkey"
FOREIGN KEY ("reviewedById") REFERENCES "public"."User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

