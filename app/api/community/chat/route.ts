import { NextResponse } from 'next/server';
import {
  mysqlGetCommunityChatConfig,
  mysqlGetCommunityChatMessages,
  mysqlCreateCommunityChatMessage,
  mysqlDeleteCommunityChatMessage,
  mysqlPurgeCommunityChatMessages,
  mysqlGetCommunityChatStorageStats
} from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '80', 10);

    const [config, messages, stats] = await Promise.all([
      mysqlGetCommunityChatConfig(),
      mysqlGetCommunityChatMessages(limit),
      mysqlGetCommunityChatStorageStats()
    ]);

    return NextResponse.json({
      success: true,
      config,
      messages: messages || [],
      stats
    });
  } catch (err: any) {
    console.error('API /api/community/chat GET error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to load community chat' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, studentName, isMentor, message, imageUrl, audioUrl, audioDuration } = body;

    if (!studentName || (!message && !imageUrl && !audioUrl)) {
      return NextResponse.json(
        { success: false, message: 'Message or image/audio is required' },
        { status: 400 }
      );
    }

    // Safety check: Videos strictly blocked
    if (imageUrl && (imageUrl.includes('.mp4') || imageUrl.includes('.mov') || imageUrl.includes('.webm') || imageUrl.includes('.avi'))) {
      return NextResponse.json(
        { success: false, message: 'Videos are not allowed in Community Chat. Only pictures & screenshots.' },
        { status: 400 }
      );
    }

    // Check if chat is currently open (if not mentor)
    if (!isMentor) {
      const config = await mysqlGetCommunityChatConfig();
      if (!config.isOpen) {
        return NextResponse.json(
          {
            success: false,
            message: config.noticeText || 'Community chat is currently locked by Mentor.'
          },
          { status: 403 }
        );
      }
    }

    const created = await mysqlCreateCommunityChatMessage({
      studentId: studentId || null,
      studentName: isMentor ? 'Mentor Sardar Samiullah' : studentName.trim(),
      isMentor: Boolean(isMentor),
      message: message ? message.trim() : '',
      imageUrl: imageUrl || null,
      audioUrl: audioUrl || null,
      audioDuration: audioDuration || null
    });

    return NextResponse.json({
      success: true,
      message: created
    });
  } catch (err: any) {
    console.error('API /api/community/chat POST error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to send community chat message' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, purgeAll, olderThanDays } = body;

    if (purgeAll) {
      const result = await mysqlPurgeCommunityChatMessages(olderThanDays);
      return NextResponse.json({
        success: true,
        message: `Purged ${result.deletedCount} chat messages and freed up storage`
      });
    }

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Message ID is required' },
        { status: 400 }
      );
    }

    await mysqlDeleteCommunityChatMessage(id);
    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (err: any) {
    console.error('API /api/community/chat DELETE error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to delete message' },
      { status: 500 }
    );
  }
}
