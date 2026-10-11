import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbGetResources, dbAddResource, dbUpdateResource, dbDeleteResource } from '@/lib/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
  'Pragma': 'no-cache',
  'Expires': '0'
};

const triggerRevalidate = () => {
  try {
    revalidatePath('/lms', 'page');
    revalidatePath('/lms/bonuses', 'page');
    revalidatePath('/bonuses', 'page');
    revalidatePath('/admin', 'page');
    revalidatePath('/admin/cms', 'page');
  } catch (e) {}
};

export async function GET() {
  try {
    const resources = await dbGetResources();
    return NextResponse.json({
      success: true,
      resources
    }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.downloadUrl) {
      return NextResponse.json({ success: false, message: 'Title and Download URL / File are required' }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const newResource = await dbAddResource({
      id: body.id || `res_${Date.now()}`,
      title: body.title,
      type: body.type || 'Shopify Theme ZIP',
      size: body.size || '1.0 MB',
      downloadUrl: body.downloadUrl,
      value: body.value || 'Rs 5,000',
      description: body.description || ''
    });

    triggerRevalidate();

    return NextResponse.json({
      success: true,
      message: 'Bonus resource added successfully!',
      resource: newResource,
      resources: await dbGetResources()
    }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, message: 'Resource ID is required for update' }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const updated = await dbUpdateResource(body.id, {
      title: body.title,
      type: body.type,
      size: body.size,
      downloadUrl: body.downloadUrl,
      value: body.value,
      description: body.description
    });

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Resource not found or update failed' }, { status: 404, headers: NO_CACHE_HEADERS });
    }

    triggerRevalidate();

    return NextResponse.json({
      success: true,
      message: 'Bonus resource updated successfully!',
      resource: updated,
      resources: await dbGetResources()
    }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Resource ID is required' }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const deleted = await dbDeleteResource(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Resource not found' }, { status: 404, headers: NO_CACHE_HEADERS });
    }

    triggerRevalidate();

    return NextResponse.json({
      success: true,
      message: 'Bonus resource deleted successfully',
      resources: await dbGetResources()
    }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
