import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const mime = file.type || '';
    const name = file.name || '';

    // Strictly BLOCK video files
    if (
      mime.startsWith('video/') ||
      name.endsWith('.mp4') ||
      name.endsWith('.mov') ||
      name.endsWith('.avi') ||
      name.endsWith('.webm') ||
      name.endsWith('.mkv')
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Videos are strictly disabled in Community Chat to protect Hostinger disk storage. Only screenshots and photos are permitted.'
        },
        { status: 400 }
      );
    }

    // Determine if image or audio
    const isImage = mime.startsWith('image/');
    const isAudio = mime.startsWith('audio/') || name.endsWith('.mp3') || name.endsWith('.wav') || name.endsWith('.m4a');

    if (!isImage && !isAudio) {
      return NextResponse.json(
        { success: false, message: 'Invalid file format. Only pictures (JPEG, PNG, WebP) and voice notes (MP3, WAV) are supported.' },
        { status: 400 }
      );
    }

    // Max file size: 5MB for images, 10MB for audio
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds maximum 10MB limit.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Target upload folder: public/uploads/community
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'community');
    await mkdir(uploadDir, { recursive: true });

    // Generate safe filename
    const ext = path.extname(name) || (isImage ? '.jpg' : '.mp3');
    const prefix = isImage ? 'comm_img_' : 'comm_audio_';
    const cleanFilename = `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadDir, cleanFilename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/community/${cleanFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileType: isImage ? 'image' : 'audio',
      sizeBytes: file.size
    });
  } catch (err: any) {
    console.error('API /api/community/chat/upload error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
