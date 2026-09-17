import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json(
      { success: false, message: 'URL query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const trimmed = targetUrl.trim();

    // If already direct image link, return directly
    if (/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(trimmed)) {
      return NextResponse.json({ success: true, directUrl: trimmed });
    }

    const res = await fetch(trimmed, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: `Failed to fetch URL: HTTP ${res.status}` },
        { status: res.status }
      );
    }

    const html = await res.text();

    // 1. Check og:image meta tag
    const ogMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i)
      || html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);

    if (ogMatch && ogMatch[1]) {
      return NextResponse.json({
        success: true,
        directUrl: ogMatch[1]
      });
    }

    // 2. Check twitter:image meta tag
    const twMatch = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i)
      || html.match(/<meta\s+content=["']([^"']+)["']\s+name=["']twitter:image["']/i);

    if (twMatch && twMatch[1]) {
      return NextResponse.json({
        success: true,
        directUrl: twMatch[1]
      });
    }

    // 3. Fallback: check link image_src
    const linkMatch = html.match(/<link\s+rel=["']image_src["']\s+href=["']([^"']+)["']/i);
    if (linkMatch && linkMatch[1]) {
      return NextResponse.json({
        success: true,
        directUrl: linkMatch[1]
      });
    }

    return NextResponse.json(
      { success: false, message: 'Could not extract direct image URL from page metadata' },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Error resolving image URL' },
      { status: 500 }
    );
  }
}
