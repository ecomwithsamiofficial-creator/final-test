import { NextResponse } from 'next/server';
import { 
  mysqlGetCommunityUpdates, 
  mysqlCreateCommunityUpdate, 
  mysqlDeleteCommunityUpdate 
} from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const updates = await mysqlGetCommunityUpdates();
    return NextResponse.json({
      success: true,
      updates: updates || []
    });
  } catch (err: any) {
    console.error('API /api/community GET error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to fetch community updates' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, tag, author, pinned } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Title and content are required' },
        { status: 400 }
      );
    }

    const created = await mysqlCreateCommunityUpdate({
      title: title.trim(),
      content: content.trim(),
      tag: tag || 'Announcement',
      author: author || 'Mentor Sardar Samiullah',
      pinned: Boolean(pinned)
    });

    return NextResponse.json({
      success: true,
      update: created,
      message: 'Community update broadcasted successfully'
    });
  } catch (err: any) {
    console.error('API /api/community POST error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to create community update' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Update ID is required' },
        { status: 400 }
      );
    }

    await mysqlDeleteCommunityUpdate(id);
    return NextResponse.json({
      success: true,
      message: 'Community update removed'
    });
  } catch (err: any) {
    console.error('API /api/community DELETE error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to delete community update' },
      { status: 500 }
    );
  }
}
