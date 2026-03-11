import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
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
      take: 12,
    });

    return NextResponse.json({ partners });
  } catch (error) {
    console.error("Partners fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 });
  }
}

export const revalidate = 60;
export const dynamic = "force-dynamic";
