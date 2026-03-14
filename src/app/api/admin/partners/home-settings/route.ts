import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-middleware";

const PARTNERS_HOME_LIMIT_KEY = "partners_home_limit";
const DEFAULT_HOME_LIMIT = 4;

function normalizeLimit(value: unknown) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  const parsed = Math.trunc(numeric);
  if (parsed < 1) return null;
  return parsed;
}

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const setting = await prisma.appSetting.findUnique({
      where: { key: PARTNERS_HOME_LIMIT_KEY },
      select: { valueInt: true },
    });

    return NextResponse.json({
      homeDisplayLimit: setting?.valueInt ?? DEFAULT_HOME_LIMIT,
    });
  } catch (error) {
    console.error("Admin partner home setting fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch home settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const limit = normalizeLimit(body.homeDisplayLimit);
    if (!limit) {
      return NextResponse.json(
        { error: "homeDisplayLimit must be a positive integer" },
        { status: 400 },
      );
    }

    const setting = await prisma.appSetting.upsert({
      where: { key: PARTNERS_HOME_LIMIT_KEY },
      update: { valueInt: limit },
      create: { key: PARTNERS_HOME_LIMIT_KEY, valueInt: limit },
      select: { valueInt: true },
    });

    return NextResponse.json({ homeDisplayLimit: setting.valueInt });
  } catch (error) {
    console.error("Admin partner home setting update error:", error);
    return NextResponse.json({ error: "Failed to update home settings" }, { status: 500 });
  }
}

