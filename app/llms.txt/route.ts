import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'llms.txt');
    const content = fs.readFileSync(filePath, 'utf-8');

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    return new NextResponse('Ecom With Sami — Founder Sardar Samiullah (22, Abbottabad, Pakistan).', {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
