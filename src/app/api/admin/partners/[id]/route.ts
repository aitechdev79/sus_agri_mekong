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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const status = String(body.status || "").toUpperCase();

    const data: {
      companyName?: string;
      logoUrl?: string | null;
      website?: string | null;
      contactEmail?: string | null;
      phone?: string | null;
      province?: string | null;
      description?: string | null;
      displayOrder?: number;
      isPublic?: boolean;
      isVerified?: boolean;
      status?: BusinessProfileStatus;
      reviewNotes?: string | null;
      reviewedAt?: Date;
      reviewedById?: string;
    } = {};

    if (body.companyName !== undefined) data.companyName = String(body.companyName || "").trim();
    if (body.logoUrl !== undefined) data.logoUrl = String(body.logoUrl || "").trim() || null;
    if (body.website !== undefined) data.website = String(body.website || "").trim() || null;
    if (body.contactEmail !== undefined) data.contactEmail = String(body.contactEmail || "").trim() || null;
    if (body.phone !== undefined) data.phone = String(body.phone || "").trim() || null;
    if (body.province !== undefined) data.province = String(body.province || "").trim() || null;
    if (body.description !== undefined) data.description = String(body.description || "").trim() || null;
    if (body.displayOrder !== undefined && Number.isFinite(Number(body.displayOrder))) {
      data.displayOrder = Math.trunc(Number(body.displayOrder));
    }
    if (body.isPublic !== undefined) data.isPublic = Boolean(body.isPublic);
    if (body.isVerified !== undefined) data.isVerified = Boolean(body.isVerified);
    if (body.reviewNotes !== undefined) data.reviewNotes = String(body.reviewNotes || "").trim() || null;

    if (status) {
      if (!VALID_STATUSES.has(status as BusinessProfileStatus)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      data.status = status as BusinessProfileStatus;
      data.reviewedAt = new Date();
      data.reviewedById = admin.id;
    }

    const updated = await prisma.businessProfile.update({
      where: { id },
      data,
    });

    return NextResponse.json({ partner: updated });
  } catch (error) {
    console.error("Admin partner update error:", error);
    return NextResponse.json({ error: "Failed to update partner" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Partner id is required" }, { status: 400 });
    }

    const existing = await prisma.businessProfile.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    await prisma.businessProfile.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin partner delete error:", error);
    return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 });
  }
}
