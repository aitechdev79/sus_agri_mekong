import { NextRequest, NextResponse } from "next/server";
import { BusinessProfileStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-middleware";

const VALID_STATUSES = new Set<BusinessProfileStatus>([
  "DRAFT",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "SUSPENDED",
]);

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = request.nextUrl.searchParams.get("status");

    const partners = await prisma.businessProfile.findMany({
      where: status && VALID_STATUSES.has(status as BusinessProfileStatus) ? { status: status as BusinessProfileStatus } : undefined,
      select: {
        id: true,
        ownerUserId: true,
        companyName: true,
        slug: true,
        logoUrl: true,
        website: true,
        contactEmail: true,
        phone: true,
        province: true,
        status: true,
        isPublic: true,
        isVerified: true,
        displayOrder: true,
        reviewedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }],
    });

    return NextResponse.json({ partners });
  } catch (error) {
    console.error("Admin partners fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const companyName = String(body.companyName || "").trim();
    const ownerUserId = String(body.ownerUserId || "").trim() || null;
    const baseSlug = slugify(String(body.slug || companyName));

    if (!companyName) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    if (!baseSlug) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const existing = await prisma.businessProfile.findUnique({
      where: { slug: baseSlug },
      select: { id: true },
    });

    const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;
    const created = await prisma.businessProfile.create({
      data: {
        ownerUserId,
        companyName,
        slug,
        logoUrl: String(body.logoUrl || "").trim() || null,
        website: String(body.website || "").trim() || null,
        contactEmail: String(body.contactEmail || "").trim() || null,
        phone: String(body.phone || "").trim() || null,
        province: String(body.province || "").trim() || null,
        description: String(body.description || "").trim() || null,
        status: VALID_STATUSES.has(body.status as BusinessProfileStatus)
          ? (body.status as BusinessProfileStatus)
          : "DRAFT",
        isPublic: Boolean(body.isPublic),
        isVerified: Boolean(body.isVerified),
        displayOrder: Number.isFinite(Number(body.displayOrder)) ? Math.trunc(Number(body.displayOrder)) : 0,
        reviewedById: admin.id,
      },
    });

    return NextResponse.json({ partner: created }, { status: 201 });
  } catch (error) {
    console.error("Admin partner create error:", error);
    return NextResponse.json({ error: "Failed to create partner" }, { status: 500 });
  }
}

