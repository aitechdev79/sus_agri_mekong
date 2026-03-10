import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-middleware";

function normalizePhone(phone?: string | null): string | null {
  const value = (phone || "").trim();
  return value ? value : null;
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        province: true,
        organization: true,
        role: true,
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Account profile GET error:", error);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name = (body.name || "").trim();
    const phone = normalizePhone(body.phone);
    const province = (body.province || "").trim() || null;
    const organization = (body.organization || "").trim() || null;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (phone) {
      const existingPhone = await prisma.user.findFirst({
        where: {
          phone,
          id: { not: user.id },
        },
        select: { id: true },
      });

      if (existingPhone) {
        return NextResponse.json({ error: "Phone number is already used" }, { status: 409 });
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        phone,
        province,
        organization,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        province: true,
        organization: true,
        role: true,
      },
    });

    return NextResponse.json({ profile: updated });
  } catch (error) {
    console.error("Account profile PUT error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
