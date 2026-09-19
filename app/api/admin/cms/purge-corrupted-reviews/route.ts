import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  return handlePurge(request);
}

export async function POST(request: NextRequest) {
  return handlePurge(request);
}

async function handlePurge(request: NextRequest) {
  const results: any = {
    deletedDbRows: 0,
    deletedDiskFiles: 0,
    cleanedCmsSections: [],
    errors: []
  };

  try {
    const { getMysqlPool, ensureAnalyticsTables } = await import('@/lib/mysql');
    await ensureAnalyticsTables();
    const pool = getMysqlPool();

    // 1. Delete all corrupt review rows from media_uploads table
    try {
      const [delRes]: any = await pool.query(`
        DELETE FROM media_uploads 
        WHERE category = 'reviews' 
          AND (
            filename LIKE 'review_1789677%' 
            OR id LIKE 'review_1789677%' 
            OR data_base64 LIKE '%learnwithafaq%'
          )
      `);
      results.deletedDbRows = delRes?.affectedRows || 0;
    } catch (e: any) {
      results.errors.push(`MySQL media_uploads delete error: ${e?.message}`);
    }

    // 2. Delete corrupt review files from server disk
    try {
      const reviewsDir = path.join(process.cwd(), 'public', 'uploads', 'reviews');
      if (fs.existsSync(reviewsDir)) {
        const files = fs.readdirSync(reviewsDir);
        for (const file of files) {
          if (file.startsWith('review_1789677') || file.includes('afaq') || file.endsWith('.webp')) {
            try {
              fs.unlinkSync(path.join(reviewsDir, file));
              results.deletedDiskFiles++;
            } catch {}
          }
        }
      }
    } catch (e: any) {
      results.errors.push(`Disk cleanup error: ${e?.message}`);
    }

    // 3. Clean up cms_content table in MySQL:
    // Remove references to the corrupted September 17 batch so the frontend cleanly points to the verified SVG card
    try {
      const [cmsRows]: any = await pool.query(`
        SELECT section_key, content_json 
        FROM cms_content 
        WHERE section_key IN ('screenshot_reviews', 'homepage_proof_wall')
      `);

      for (const row of cmsRows || []) {
        try {
          const content = JSON.parse(row.content_json);
          if (Array.isArray(content.images)) {
            const filteredImages = content.images.filter((img: string) => {
              if (typeof img !== 'string') return false;
              if (img.includes('learnwithafaq')) return false;
              if (img.includes('review_1789677')) return false;
              return true;
            });

            // If all images were from the corrupted batch, set clean default fallback
            if (filteredImages.length === 0) {
              filteredImages.push('/uploads/reviews/review_verified_student.svg');
            }

            content.images = filteredImages;
            await pool.query(
              `UPDATE cms_content SET content_json = ? WHERE section_key = ?`,
              [JSON.stringify(content), row.section_key]
            );
            results.cleanedCmsSections.push(row.section_key);
          }
        } catch {}
      }
    } catch (e: any) {
      results.errors.push(`CMS content sanitize error: ${e?.message}`);
    }

    // 4. Revalidate all cached pages
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
      message: 'Purge completed successfully. Corrupted Afaq reviews wiped from DB and disk.',
      results
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error?.message || 'Purge failed'
    }, { status: 500 });
  }
}
