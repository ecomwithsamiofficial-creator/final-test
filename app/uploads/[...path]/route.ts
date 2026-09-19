import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const pathSegments = resolvedParams.path || [];

    if (pathSegments.length === 0) {
      return new NextResponse('File not specified', { status: 400 });
    }

    // Sanitize and prevent directory traversal
    const safePathSegments = pathSegments.map(seg => path.basename(seg));
    const relativePath = path.join(...safePathSegments);

    // Primary path in public/uploads
    const fullPath = path.join(process.cwd(), 'public', 'uploads', relativePath);

    if (!fs.existsSync(fullPath)) {
      // Check MySQL persistent media storage (Permanent backup immune to Git wipes)
      try {
        const { mysqlGetMediaUpload } = await import('@/lib/mysql');
        const media = await mysqlGetMediaUpload(relativePath);
        if (media && media.buffer) {
          // Re-hydrate file back to disk cache for ultra-fast subsequent serving
          try {
            const dir = path.dirname(fullPath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(fullPath, media.buffer);
          } catch {}

          return new NextResponse(new Uint8Array(media.buffer), {
            status: 200,
            headers: {
              'Content-Type': media.contentType || 'image/jpeg',
              'Content-Length': String(media.buffer.length),
              'Cache-Control': 'public, max-age=31536000, immutable',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
      } catch (dbErr: any) {
        console.warn('MySQL persistent media lookup failed:', dbErr?.message);
      }

      return new NextResponse('File not found', { status: 404 });
    }

    const stat = fs.statSync(fullPath);
    if (!stat.isFile()) {
      return new NextResponse('Not a file', { status: 400 });
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const fileBuffer = fs.readFileSync(fullPath);

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(stat.size),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    console.error('Upload serving error:', error);
    return new NextResponse(error?.message || 'Server error', { status: 500 });
  }
}
