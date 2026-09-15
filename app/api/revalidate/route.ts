import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { revalidateAllWebsitePages, revalidateTarget } from '@/app/actions/revalidate';

export const dynamic = 'force-dynamic';

function verifySecret(req: NextRequest): boolean {
  const expectedSecret = process.env.REVALIDATE_SECRET;
  // If no secret configured in environment, allow internal API calls
  if (!expectedSecret) return true;

  const url = new URL(req.url);
  const secretFromQuery = url.searchParams.get('secret');
  const secretFromHeader = req.headers.get('x-revalidate-secret');
  const authHeader = req.headers.get('authorization');
  const bearerSecret = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  return (
    secretFromQuery === expectedSecret ||
    secretFromHeader === expectedSecret ||
    bearerSecret === expectedSecret
  );
}

/**
 * GET /api/revalidate?path=/about
 * GET /api/revalidate?all=true
 */
export async function GET(request: NextRequest) {
  if (!verifySecret(request)) {
    return NextResponse.json(
      { success: false, message: 'Invalid or missing revalidation secret token' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  const type = searchParams.get('type') as 'page' | 'layout' | null;
  const isAll = searchParams.get('all') === 'true';

  try {
    if (isAll || (!path && searchParams.size === 0)) {
      const result = await revalidateAllWebsitePages();
      return NextResponse.json({
        success: true,
        message: 'All primary pages successfully revalidated',
        data: result
      });
    }

    if (path) {
      const result = await revalidateTarget(path, type || undefined);
      return NextResponse.json({
        success: true,
        message: `Path ${path} successfully revalidated`,
        data: result
      });
    }

    return NextResponse.json(
      { success: false, message: 'Provide ?path=/your-page or ?all=true' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error during revalidation' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/revalidate
 * Body: { path?: string, paths?: string[], type?: 'page' | 'layout', all?: boolean }
 */
export async function POST(request: NextRequest) {
  if (!verifySecret(request)) {
    return NextResponse.json(
      { success: false, message: 'Invalid or missing revalidation secret token' },
      { status: 401 }
    );
  }

  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Empty body
    }

    const { path, paths, type, all } = body;

    if (all) {
      const result = await revalidateAllWebsitePages();
      return NextResponse.json({
        success: true,
        message: 'All primary pages successfully revalidated',
        data: result
      });
    }

    if (Array.isArray(paths) && paths.length > 0) {
      const revalidated: string[] = [];
      for (const p of paths) {
        if (typeof p === 'string') {
          revalidatePath(p);
          revalidated.push(p);
        }
      }
      return NextResponse.json({
        success: true,
        message: `${revalidated.length} paths successfully revalidated`,
        revalidated,
        timestamp: new Date().toISOString()
      });
    }

    if (typeof path === 'string' && path.trim()) {
      const result = await revalidateTarget(path.trim(), type);
      return NextResponse.json({
        success: true,
        message: `Path ${path} successfully revalidated`,
        data: result
      });
    }

    // Default to all core pages if called with empty POST
    const result = await revalidateAllWebsitePages();
    return NextResponse.json({
      success: true,
      message: 'All primary pages successfully revalidated',
      data: result
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error during revalidation' },
      { status: 500 }
    );
  }
}
