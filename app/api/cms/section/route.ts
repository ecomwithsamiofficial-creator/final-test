import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbSaveCmsSettings } from '@/lib/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
  'Pragma': 'no-cache',
  'Expires': '0'
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const section = body.section || request.nextUrl.searchParams.get('section');

    if (!section) {
      return NextResponse.json(
        { success: false, message: 'No section specified' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const patch: any = {
      _section: section,
      [section]: body.data !== undefined ? body.data : body[section]
    };

    const updated = await dbSaveCmsSettings(patch, section);

    // Revalidate paths
    try {
      revalidatePath('/', 'page');
      revalidatePath('/', 'layout');
      revalidatePath('/checkout', 'page');
      revalidatePath('/enrollment', 'page');
      revalidatePath('/admin/cms', 'page');
      revalidatePath('/api/public/cms-content');
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Section ${section} saved to database permanently!`,
      section,
      content: updated
    }, { headers: NO_CACHE_HEADERS });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to save section' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}
