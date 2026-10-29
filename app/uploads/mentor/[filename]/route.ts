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

    const safeName = path.basename(filename);
    const diskPath = path.join(process.cwd(), 'public', 'uploads', 'mentor', safeName);

    // 1. Try disk
    if (fs.existsSync(diskPath)) {
      const buffer = fs.readFileSync(diskPath);
      const ext = path.extname(safeName).toLowerCase();
      const contentType =
        ext === '.png' ? 'image/png'
        : ext === '.webp' ? 'image/webp'
        : ext === '.svg' ? 'image/svg+xml'
        : 'image/jpeg';

      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 2. MySQL backup
    try {
      const media = await mysqlGetMediaUpload(safeName);
      if (media && media.buffer) {
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
      console.warn('MySQL mentor media lookup failed:', dbErr);
    }

    // 3. Fallback to default mentor-profile.webp or mentor-profile.png
    const fallbackWebp = path.join(process.cwd(), 'public', 'mentor-profile.webp');
    if (fs.existsSync(fallbackWebp)) {
      const buffer = fs.readFileSync(fallbackWebp);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'image/webp',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    const fallbackPng = path.join(process.cwd(), 'public', 'mentor-profile.png');
    if (fs.existsSync(fallbackPng)) {
      const buffer = fs.readFileSync(fallbackPng);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    return new NextResponse('Mentor image not found', { status: 404 });
  } catch (err: any) {
    console.error('Error serving mentor media:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
