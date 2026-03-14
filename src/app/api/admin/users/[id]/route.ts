import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-middleware";

const VALID_ROLES = new Set(["USER", "BUSINESS", "MODERATOR", "ADMIN"] as const);

function normalizeOptional(value: unknown): string | null {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: "Only admin can update users" },
        { status: 403 },
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "User id is required" }, { status: 400 });
    }

    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const phone = normalizeOptional(body.phone);
    const province = normalizeOptional(body.province);
    const organization = normalizeOptional(body.organization);
    const role = String(body.role ?? "").trim().toUpperCase();
    const isVerified = Boolean(body.isVerified);
    const newPassword = String(body.newPassword ?? "");

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!VALID_ROLES.has(role as "USER" | "BUSINESS" | "MODERATOR" | "ADMIN")) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (admin.id === id && role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin cannot remove own admin role" },
        { status: 400 },
      );
    }

    if (newPassword && newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (phone) {
      const duplicatePhone = await prisma.user.findFirst({
        where: {
          phone,
          id: { not: id },
        },
        select: { id: true },
      });

      if (duplicatePhone) {
        return NextResponse.json(
          { error: "Phone number is already used" },
          { status: 409 },
        );
      }
    }

    const data: {
      name: string;
      phone: string | null;
      province: string | null;
      organization: string | null;
      role: "USER" | "BUSINESS" | "MODERATOR" | "ADMIN";
      isVerified: boolean;
      password?: string;
    } = {
      name,
      phone,
      province,
      organization,
      role: role as "USER" | "BUSINESS" | "MODERATOR" | "ADMIN",
      isVerified,
    };

    if (newPassword) {
      data.password = await bcrypt.hash(newPassword, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        province: true,
        organization: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            contents: true,
            submissions: true,
            comments: true,
            bookmarks: true,
          },
        },
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: "Only admin can delete users" },
        { status: 403 },
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "User id is required" }, { status: 400 });
    }

    if (admin.id === id) {
      return NextResponse.json(
        { error: "Admin cannot delete own account" },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        _count: {
          select: {
            contents: true,
            comments: true,
            submissions: true,
            bookmarks: true,
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hasRelatedData =
      existing._count.contents > 0 ||
      existing._count.comments > 0 ||
      existing._count.submissions > 0 ||
      existing._count.bookmarks > 0;

    if (hasRelatedData) {
      return NextResponse.json(
        {
          error:
            "Cannot delete this user because related data exists (content/comments/submissions/bookmarks).",
          counts: existing._count,
        },
        { status: 409 },
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin user delete error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
