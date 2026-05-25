import { NextRequest, NextResponse } from 'next/server';
import { getPublicPartners } from '@/lib/public-partners';

export async function GET(request: NextRequest) {
  try {
    const showAll = request.nextUrl.searchParams.get('all') === '1';
    const { partners, homeDisplayLimit } = await getPublicPartners(showAll);

    return NextResponse.json({ partners, homeDisplayLimit });
  } catch (error) {
    console.error('Partners fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}

export const revalidate = 60;
export const dynamic = 'force-dynamic';
