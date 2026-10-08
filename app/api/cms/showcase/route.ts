import { NextResponse } from 'next/server';
import { mysqlGetShowcaseCms, mysqlSaveShowcaseCms } from '@/lib/mysql';
import { defaultShowcaseCmsData, ShowcaseCmsData } from '@/utils/showcaseData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await mysqlGetShowcaseCms();
    return NextResponse.json({
      success: true,
      data: data || defaultShowcaseCmsData
    });
  } catch (err: any) {
    console.error('API /api/cms/showcase GET error:', err);
    return NextResponse.json({
      success: true,
      data: defaultShowcaseCmsData
    });
  }
}

export async function POST(req: Request) {
  try {
    const body: ShowcaseCmsData = await req.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid payload' },
        { status: 400 }
      );
    }

    const saved = await mysqlSaveShowcaseCms(body);
    return NextResponse.json({
      success: true,
      data: body,
      message: 'Proof Hub & Showcase CMS settings saved successfully'
    });
  } catch (err: any) {
    console.error('API /api/cms/showcase POST error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to save showcase settings' },
      { status: 500 }
    );
  }
}
