import { NextResponse } from 'next/server';
import {
  mysqlGetCommunityChatConfig,
  mysqlUpdateCommunityChatConfig
} from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = await mysqlGetCommunityChatConfig();
    return NextResponse.json({
      success: true,
      config
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to fetch community settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { isOpen, noticeText } = body;

    const updated = await mysqlUpdateCommunityChatConfig({
      isOpen: isOpen !== undefined ? Boolean(isOpen) : undefined,
      noticeText: noticeText !== undefined ? String(noticeText).trim() : undefined
    });

    return NextResponse.json({
      success: true,
      config: updated,
      message: `Community chat status updated to ${updated.isOpen ? 'OPEN' : 'LOCKED'}`
    });
  } catch (err: any) {
    console.error('API /api/community/chat/settings PATCH error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to update community chat settings' },
      { status: 500 }
    );
  }
}
