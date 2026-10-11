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
  '.webp': 'image/webp',
  '.csv': 'text/csv'
};

function sanitizeFileName(name: string): string {
  return name.replace(/[/\\?%*:|"<>]/g, '-').trim();
}

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
        // Redirect directly to external resource (e.g. Google Drive, Mega, CDN)
        return NextResponse.redirect(fileUrl, { status: 302 });
      }
    }

    // Local file path resolution
    const cleanPath = fileUrl.replace(/^\/+/, '').replace(/^public\/+/, '');
    const fullDiskPath = path.join(process.cwd(), 'public', cleanPath);
    
    // Extract real extension from the disk path or URL
    const realExt = (path.extname(cleanPath) || path.extname(fileUrl)).toLowerCase();
    
    // Build human-friendly filename with GUARANTEED extension
    let baseDisplayName = customName ? sanitizeFileName(customName) : path.basename(cleanPath, realExt);
    if (!baseDisplayName || baseDisplayName === '-') {
      baseDisplayName = 'shopify-theme-resource';
    }

    // Ensure the filename strictly ends with the real extension
    let finalFilename = baseDisplayName;
    if (realExt && !finalFilename.toLowerCase().endsWith(realExt)) {
      finalFilename = `${finalFilename}${realExt}`;
    } else if (!realExt && !path.extname(finalFilename)) {
      finalFilename = `${finalFilename}.zip`;
    }

    const effectiveExt = (path.extname(finalFilename) || realExt || '.zip').toLowerCase();
    const contentType = MIME_MAP[effectiveExt] || 'application/octet-stream';

    // Standard RFC 6266 dual-header encoding for 100% compatibility across Windows, Mac, iOS Safari, Android Chrome
    const safeAscii = finalFilename.replace(/[^\x20-\x7E]/g, '_').replace(/["\\]/g, '-');
    const safeUtf8 = encodeURIComponent(finalFilename).replace(/['()]/g, escape).replace(/\*/g, '%2A');
    const contentDisposition = `attachment; filename="${safeAscii}"; filename*=UTF-8''${safeUtf8}`;

    // 1. Try disk first
    if (fs.existsSync(fullDiskPath)) {
      const stat = fs.statSync(fullDiskPath);
      if (stat.isFile() && stat.size > 0) {
        const fileBuffer = fs.readFileSync(fullDiskPath);
        return new NextResponse(new Uint8Array(fileBuffer), {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Content-Length': String(stat.size),
            'Content-Disposition': contentDisposition,
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
      if (media && media.buffer && media.buffer.length > 0) {
        // Re-hydrate disk cache for subsequent ultra-fast serving
        try {
          const dir = path.dirname(fullDiskPath);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(fullDiskPath, media.buffer);
        } catch {}

        return new NextResponse(new Uint8Array(media.buffer), {
          status: 200,
          headers: {
            'Content-Type': media.contentType || contentType,
            'Content-Length': String(media.buffer.length),
            'Content-Disposition': contentDisposition,
            'Cache-Control': 'public, max-age=3600',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    } catch (dbErr: any) {
      console.warn('MySQL persistent media lookup notice:', dbErr?.message);
    }

    // 3. Fallback: Check if file exists in uploads root without subdirectory
    const altDiskPath = path.join(process.cwd(), 'public', 'uploads', path.basename(cleanPath));
    if (fs.existsSync(altDiskPath)) {
      const stat = fs.statSync(altDiskPath);
      if (stat.isFile() && stat.size > 0) {
        const fileBuffer = fs.readFileSync(altDiskPath);
        return new NextResponse(new Uint8Array(fileBuffer), {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Content-Length': String(stat.size),
            'Content-Disposition': contentDisposition,
            'Cache-Control': 'public, max-age=86400',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    return new NextResponse('Requested bonus file not found or is empty on server.', { status: 404 });
  } catch (err: any) {
    console.error('Download route error:', err);
    return new NextResponse('Download failed: ' + (err.message || 'unknown error'), { status: 500 });
  }
}
