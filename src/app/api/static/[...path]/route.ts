import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  try {
    const filePath = path.join(process.cwd(), 'public', ...pathSegments);

    // Check if file exists and is within public directory
    const publicDir = path.join(process.cwd(), 'public');
    const resolvedPath = path.resolve(filePath);

    if (!resolvedPath.startsWith(publicDir)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const fileBuffer = await fs.readFile(resolvedPath);

    // Set appropriate content type based on file extension
    const ext = path.extname(resolvedPath).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };

    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    return new Response(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // 24 hours
      },
    });

  } catch (error) {
    console.error('Static file serving error:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}