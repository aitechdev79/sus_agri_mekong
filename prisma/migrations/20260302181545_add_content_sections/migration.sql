-- CreateEnum
CREATE TYPE "public"."ContentSection" AS ENUM ('HOME_DIEN_HINH', 'HOME_HOAT_DONG_DU_AN');

-- AlterEnum
ALTER TYPE "public"."ContentType" ADD VALUE 'PROJECT_ACTIVITY';

-- AlterTable
ALTER TABLE "public"."Content" ADD COLUMN     "displayOrder" INTEGER,
ADD COLUMN     "projectUrl" TEXT,
ADD COLUMN     "sectionKey" "public"."ContentSection",
ADD COLUMN     "undertitle" TEXT;

-- CreateIndex
CREATE INDEX "Content_sectionKey_idx" ON "public"."Content"("sectionKey");

-- CreateIndex
CREATE INDEX "Content_sectionKey_displayOrder_idx" ON "public"."Content"("sectionKey", "displayOrder");
