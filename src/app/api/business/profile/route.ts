import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-middleware";

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
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.businessProfile.findFirst({
      where: { ownerUserId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Business profile fetch error:", error);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "BUSINESS" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only business accounts can update this profile" }, { status: 403 });
    }

    const body = await request.json();
    const companyName = String(body.companyName || "").trim();
    const slugInput = String(body.slug || companyName).trim();
    const slug = slugify(slugInput);

    if (!companyName) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    if (!slug) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const existing = await prisma.businessProfile.findFirst({
      where: { ownerUserId: user.id },
      select: { id: true, slug: true },
    });

    const slugConflict = await prisma.businessProfile.findFirst({
      where: {
        slug,
        ...(existing ? { id: { not: existing.id } } : {}),
      },
      select: { id: true },
    });

    if (slugConflict) {
      return NextResponse.json({ error: "Slug is already used" }, { status: 409 });
    }

    const data = {
      ownerUserId: user.id,
      companyName,
      slug,
      logoUrl: String(body.logoUrl || "").trim() || null,
      coverUrl: String(body.coverUrl || "").trim() || null,
      website: String(body.website || "").trim() || null,
      contactEmail: String(body.contactEmail || "").trim() || null,
      phone: String(body.phone || "").trim() || null,
      province: String(body.province || "").trim() || null,
      description: String(body.description || "").trim() || null,
      status: "DRAFT" as const,
      isPublic: false,
      reviewedById: null,
      reviewedAt: null,
      reviewNotes: null,
    };

    const profile = existing
      ? await prisma.businessProfile.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.businessProfile.create({ data });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Business profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

