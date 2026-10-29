import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { mysqlGetMediaUpload } from '@/lib/mysql';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;
    if (!filename) {
      return new NextResponse('Filename required', { status: 400 });
    }

    // Sanitize filename to prevent directory traversal
    const safeName = path.basename(filename);
    const diskPath = path.join(process.cwd(), 'public', 'uploads', 'reviews', safeName);

    // 1. Try reading directly from local disk first (fastest)
    if (fs.existsSync(diskPath)) {
      const buffer = fs.readFileSync(diskPath);
      const ext = path.extname(safeName).toLowerCase();
      const contentType =
        ext === '.png' ? 'image/png'
        : ext === '.webp' ? 'image/webp'
        : ext === '.svg' ? 'image/svg+xml'
        : ext === '.gif' ? 'image/gif'
        : 'image/jpeg';

      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 2. Fallback to MySQL media_uploads table
    try {
      const media = await mysqlGetMediaUpload(safeName);
      if (media && media.buffer) {
        // Save to disk cache for subsequent requests
        try {
          const uploadsDir = path.dirname(diskPath);
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          fs.writeFileSync(diskPath, media.buffer);
        } catch {}

        return new NextResponse(new Uint8Array(media.buffer), {
          headers: {
            'Content-Type': media.contentType || 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    } catch (dbErr) {
      console.warn('MySQL review media lookup failed:', dbErr);
    }

    // 3. Fallback to default verified student review SVG
    const fallbackPath = path.join(process.cwd(), 'public', 'uploads', 'reviews', 'review_verified_student.svg');
    if (fs.existsSync(fallbackPath)) {
      const buffer = fs.readFileSync(fallbackPath);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    return new NextResponse('Image not found', { status: 404 });
  } catch (err: any) {
    console.error('Error serving review media:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
