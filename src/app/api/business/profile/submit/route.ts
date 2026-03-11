import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-middleware";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "BUSINESS" && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only business accounts can submit" }, { status: 403 });
    }

    const profile = await prisma.businessProfile.findFirst({
      where: { ownerUserId: user.id },
      select: { id: true, companyName: true, logoUrl: true },
      orderBy: { updatedAt: "desc" },
    });

    if (!profile) {
      return NextResponse.json({ error: "Business profile is missing" }, { status: 404 });
    }

    if (!profile.companyName) {
      return NextResponse.json({ error: "Company name is required before submit" }, { status: 400 });
    }

    const updated = await prisma.businessProfile.update({
      where: { id: profile.id },
      data: {
        status: "PENDING",
        isPublic: false,
      },
    });

    return NextResponse.json({ profile: updated });
  } catch (error) {
    console.error("Business profile submit error:", error);
    return NextResponse.json({ error: "Failed to submit profile" }, { status: 500 });
  }
}

