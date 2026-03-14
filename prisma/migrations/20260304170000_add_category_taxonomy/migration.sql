-- CreateEnum
CREATE TYPE "public"."CategoryAuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'ACTIVATE', 'DEACTIVATE');

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameVi" TEXT NOT NULL,
    "nameEn" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CategoryAuditLog" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT,
    "performedById" TEXT,
    "action" "public"."CategoryAuditAction" NOT NULL,
    "beforeData" JSONB,
    "afterData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoryAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "public"."Category"("slug");

-- CreateIndex
CREATE INDEX "Category_isActive_idx" ON "public"."Category"("isActive");

-- CreateIndex
CREATE INDEX "Category_displayOrder_idx" ON "public"."Category"("displayOrder");

-- CreateIndex
CREATE INDEX "CategoryAuditLog_categoryId_idx" ON "public"."CategoryAuditLog"("categoryId");

-- CreateIndex
CREATE INDEX "CategoryAuditLog_performedById_idx" ON "public"."CategoryAuditLog"("performedById");

-- CreateIndex
CREATE INDEX "CategoryAuditLog_action_idx" ON "public"."CategoryAuditLog"("action");

-- CreateIndex
CREATE INDEX "CategoryAuditLog_createdAt_idx" ON "public"."CategoryAuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."CategoryAuditLog" ADD CONSTRAINT "CategoryAuditLog_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CategoryAuditLog" ADD CONSTRAINT "CategoryAuditLog_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed legacy categories to preserve compatibility with existing Content.category string values
INSERT INTO "public"."Category" ("id", "slug", "nameVi", "nameEn", "isActive", "displayOrder", "createdAt", "updatedAt")
VALUES
    ('cat_shrimp_farming', 'shrimp_farming', 'Nuôi tôm', 'Shrimp Farming', true, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('cat_shrimp_processing', 'shrimp_processing', 'Chế biến tôm', 'Shrimp Processing', true, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('cat_shrimp_export', 'shrimp_export', 'Xuất khẩu tôm', 'Shrimp Export', true, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('cat_rice_cultivation', 'rice_cultivation', 'Trồng lúa', 'Rice Cultivation', true, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('cat_rice_processing', 'rice_processing', 'Chế biến lúa', 'Rice Processing', true, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('cat_rice_marketing', 'rice_marketing', 'Tiếp thị lúa', 'Rice Marketing', true, 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('cat_sustainable_practices', 'sustainable_practices', 'Thực hành bền vững', 'Sustainable Practices', true, 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('cat_technology_innovation', 'technology_innovation', 'Công nghệ và đổi mới', 'Technology & Innovation', true, 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('cat_financial_support', 'financial_support', 'Hỗ trợ tài chính', 'Financial Support', true, 90, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('cat_market_access', 'market_access', 'Tiếp cận thị trường', 'Market Access', true, 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('cat_policy_guidelines', 'policy_guidelines', 'Chính sách và hướng dẫn', 'Policy & Guidelines', true, 110, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('cat_success_stories', 'success_stories', 'Câu chuyện thành công', 'Success Stories', true, 120, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;
