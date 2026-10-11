import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function detectResourceType(filename: string, mime: string): string {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.zip' || ext === '.rar' || ext === '.7z') return 'Shopify Theme ZIP';
  if (ext === '.pdf') return 'PDF Blueprint / Guide';
  if (['.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(ext)) return 'Banner & Ad Creatives';
  if (['.xlsx', '.xls', '.csv'].includes(ext)) return 'Excel Profit Calculator';
  return 'VIP Resource File';
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const originalName = file.name || 'resource-file';
    const ext = path.extname(originalName).toLowerCase();
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 50);
    const uniqueSuffix = Date.now().toString(36);
    const finalFilename = `${baseName}-${uniqueSuffix}${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileSize = formatFileSize(buffer.length);
    const resourceType = detectResourceType(finalFilename, file.type);

    // 1. Save to disk in public/uploads/bonuses
    const targetDir = path.join(process.cwd(), 'public', 'uploads', 'bonuses');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const targetPath = path.join(targetDir, finalFilename);
    fs.writeFileSync(targetPath, buffer);

    // 2. Also save to MySQL persistent media_uploads backup (survives Git deployments)
    try {
      const { mysqlSaveMediaUpload } = await import('@/lib/mysql');
      const contentType = file.type || 'application/octet-stream';
      await mysqlSaveMediaUpload(
        `bonuses/${finalFilename}`,
        'bonuses',
        finalFilename,
        contentType,
        buffer
      );
    } catch (dbErr: any) {
      console.warn('MySQL persistent media upload backup notice:', dbErr?.message);
    }

    const publicUrl = `/uploads/bonuses/${finalFilename}`;

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully!',
      url: publicUrl,
      filename: finalFilename,
      originalName,
      size: fileSize,
      type: resourceType,
      bytes: buffer.length
    });
  } catch (error: any) {
    console.error('LMS Resource upload error:', error);
    return NextResponse.json({ success: false, message: error.message || 'File upload failed' }, { status: 500 });
  }
}
