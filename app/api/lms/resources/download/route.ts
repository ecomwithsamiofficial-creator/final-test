import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MIME_MAP: Record<string, string> = {
  '.zip': 'application/zip',
  '.rar': 'application/x-rar-compressed',
  '.7z': 'application/x-7z-compressed',
  '.pdf': 'application/pdf',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.xls': 'application/vnd.ms-excel',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('url');
    const customName = searchParams.get('name');

    if (!fileUrl) {
      return new NextResponse('File URL is required', { status: 400 });
    }

    // If external URL (http/https and not local host)
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      const urlObj = new URL(fileUrl);
      const isLocalHost = urlObj.hostname === 'localhost' || urlObj.hostname.includes('ecomwithsami');
      if (!isLocalHost) {
        // Redirect directly to external resource (e.g. Google Drive, CDN)
        return NextResponse.redirect(fileUrl, { status: 302 });
      }
    }

    // Local file path resolution
    const cleanPath = fileUrl.replace(/^\/+/, '').replace(/^public\/+/, '');
    const fullDiskPath = path.join(process.cwd(), 'public', cleanPath);
    const filename = customName || path.basename(cleanPath) || 'resource-download';
    const ext = path.extname(filename).toLowerCase();
    const contentType = MIME_MAP[ext] || 'application/octet-stream';

    // 1. Try disk
    if (fs.existsSync(fullDiskPath)) {
      const stat = fs.statSync(fullDiskPath);
      if (stat.isFile()) {
        const fileBuffer = fs.readFileSync(fullDiskPath);
        return new NextResponse(new Uint8Array(fileBuffer), {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Content-Length': String(stat.size),
            'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
            'Cache-Control': 'public, max-age=86400',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    // 2. Try MySQL persistent media backup
    try {
      const { mysqlGetMediaUpload } = await import('@/lib/mysql');
      const media = await mysqlGetMediaUpload(cleanPath.replace(/^uploads\//, ''));
      if (media && media.buffer) {
        return new NextResponse(new Uint8Array(media.buffer), {
          status: 200,
          headers: {
            'Content-Type': media.contentType || contentType,
            'Content-Length': String(media.buffer.length),
            'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
            'Cache-Control': 'public, max-age=3600',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    } catch (e) {}

    // Fallback: If not found, redirect to the URL directly
    return NextResponse.redirect(fileUrl, { status: 302 });
  } catch (err: any) {
    console.error('Download route error:', err);
    return new NextResponse('Download failed: ' + (err.message || 'unknown error'), { status: 500 });
  }
}
