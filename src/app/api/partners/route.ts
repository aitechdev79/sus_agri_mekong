import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PARTNERS_HOME_LIMIT_KEY = "partners_home_limit";
const DEFAULT_HOME_LIMIT = 4;

export async function GET(request: NextRequest) {
  try {
    const showAll = request.nextUrl.searchParams.get("all") === "1";
    const setting = await prisma.appSetting.findUnique({
      where: { key: PARTNERS_HOME_LIMIT_KEY },
      select: { valueInt: true },
    });
    const homeLimit = setting?.valueInt && setting.valueInt > 0 ? setting.valueInt : DEFAULT_HOME_LIMIT;

    const partners = await prisma.businessProfile.findMany({
      where: {
        displayOrder: {
          gte: 0,
        },
      },
      select: {
        id: true,
        companyName: true,
        slug: true,
        logoUrl: true,
        website: true,
        description: true,
        displayOrder: true,
      },
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }],
      ...(showAll ? {} : { take: homeLimit }),
    });

    return NextResponse.json({ partners, homeDisplayLimit: homeLimit });
  } catch (error) {
    console.error("Partners fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 });
  }
}

export const revalidate = 60;
export const dynamic = "force-dynamic";
