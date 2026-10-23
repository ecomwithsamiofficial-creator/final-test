import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { mysqlGetMediaUpload } from '@/lib/mysql';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function nodeStreamToWebStream(stream: Readable): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      stream.on('data', (chunk) => {
        controller.enqueue(new Uint8Array(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      });
      stream.on('end', () => controller.close());
      stream.on('error', (err) => controller.error(err));
    },
    cancel() {
      stream.destroy();
    }
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const sanitizedFilename = path.basename(filename);
    const range = request.headers.get('range');

    const candidatePaths = [
      path.join(process.cwd(), 'public', 'uploads', 'community', sanitizedFilename),
      path.join(process.cwd(), 'public', 'uploads', sanitizedFilename)
    ];

    let filePath = candidatePaths.find(p => fs.existsSync(p));

    if (!filePath) {
      // Fallback: Check Hostinger MySQL media_uploads table (immune to Git resets)
      try {
        const mediaRecord = await mysqlGetMediaUpload(sanitizedFilename);
        if (mediaRecord && mediaRecord.buffer) {
          const restoreDir = path.join(process.cwd(), 'public', 'uploads', 'community');
          if (!fs.existsSync(restoreDir)) {
            fs.mkdirSync(restoreDir, { recursive: true });
          }
          const restoredPath = path.join(restoreDir, sanitizedFilename);
          fs.writeFileSync(restoredPath, mediaRecord.buffer);
          filePath = restoredPath;
        }
      } catch (dbErr) {
        console.warn('Fallback to MySQL media_uploads failed:', dbErr);
      }
    }

    if (!filePath) {
      return NextResponse.json({ error: 'Audio file not found' }, { status: 404 });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const ext = path.extname(filePath).toLowerCase();

    const mimeTypes: Record<string, string> = {
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.m4a': 'audio/mp4',
      '.aac': 'audio/aac',
      '.ogg': 'audio/ogg',
      '.webm': 'audio/webm',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp'
    };

    const contentType = mimeTypes[ext] || 'audio/mpeg';

    // Support HTTP Range requests (Critical for iOS Safari & Android audio seeking)
    if (range && range.startsWith('bytes=')) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        return new NextResponse(null, {
          status: 416,
          headers: { 'Content-Range': `bytes */${fileSize}` }
        });
      }

      const chunksize = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });
      const webStream = nodeStreamToWebStream(fileStream);

      return new NextResponse(webStream, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': String(chunksize),
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      });
    }

    // Normal non-range response
    const fileStream = fs.createReadStream(filePath);
    const webStream = nodeStreamToWebStream(fileStream);

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        'Accept-Ranges': 'bytes',
        'Content-Length': String(fileSize),
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error: any) {
    console.error('Community media stream error:', error);
    return NextResponse.json({ error: 'Stream failed' }, { status: 500 });
  }
}
