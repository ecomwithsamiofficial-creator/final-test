import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { 
  dbGetModules, 
  dbAddModule, 
  dbUpdateModule, 
  dbDeleteModule, 
  dbBulkDeleteModules,
  dbSetAllModules,
  dbGetCmsSettings,
  dbAddLesson, 
  dbUpdateLesson, 
  dbDeleteLesson 
} from '@/lib/database';
import { Module, Lesson } from '@/utils/db';

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
    revalidatePath('/', 'page');
    revalidatePath('/', 'layout');
    revalidatePath('/lms', 'page');
    revalidatePath('/admin', 'page');
    revalidatePath('/admin/cms', 'page');
  } catch (e) {}
};

export async function GET() {
  try {
    const modules = await dbGetModules();
    return NextResponse.json({
      success: true,
      modules
    }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, module, lesson, moduleId, moduleIds, ids } = body;

    // Action: Bulk Delete Modules
    if (action === 'BULK_DELETE') {
      const targetIds: number[] = (moduleIds || ids || []).map(Number).filter((n: number) => !isNaN(n));
      await dbBulkDeleteModules(targetIds);
      triggerRevalidate();
      return NextResponse.json({
        success: true,
        message: `${targetIds.length} modules permanently deleted!`,
        modules: await dbGetModules()
      }, { headers: NO_CACHE_HEADERS });
    }

    // Action: Sync LMS modules from Homepage Curriculum
    if (action === 'SYNC_FROM_HOMEPAGE') {
      const cms = await dbGetCmsSettings();
      const hpModules = cms.homepage_curriculum?.modules || [];
      const currentModules = await dbGetModules();

      // Map existing lecture video URLs by title so we don't lose videos if already entered
      const existingVideosByTitle = new Map<string, string>();
      for (const m of currentModules) {
        for (const l of (m.lessons || [])) {
          if (l.title && l.videoUrl) {
            existingVideosByTitle.set(l.title.trim().toLowerCase(), l.videoUrl);
          }
        }
      }

      const syncedModules: Module[] = hpModules.map((m: any, mIdx: number) => {
        const modId = mIdx + 1;
        const lessonList: Lesson[] = (m.lessons || []).map((lTitle: string, lIdx: number) => {
          const cleanTitle = typeof lTitle === 'string' ? lTitle.trim() : `Lecture ${lIdx + 1}`;
          const existingUrl = existingVideosByTitle.get(cleanTitle.toLowerCase()) || '';
          return {
            id: `m${modId}_l${lIdx + 1}`,
            title: cleanTitle,
            duration: '',
            videoUrl: existingUrl,
            notes: ''
          };
        });

        return {
          id: modId,
          title: m.title || `Module ${modId}`,
          duration: m.badge || '45 mins',
          description: m.description || m.subtitle || 'Step-by-step practical training.',
          lessons: lessonList
        };
      });

      const saved = await dbSetAllModules(syncedModules);
      triggerRevalidate();

      const totalLessons = saved.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
      return NextResponse.json({
        success: true,
        message: `Successfully synchronized ${saved.length} modules and ${totalLessons} lectures from Homepage Curriculum!`,
        modules: saved
      }, { headers: NO_CACHE_HEADERS });
    }

    // Action: Add new module
    if (action === 'ADD_MODULE' || (!action && module)) {
      const newMod = module || body;
      const currentModules = await dbGetModules();
      const nextId = currentModules.length > 0 
        ? Math.max(...currentModules.map(m => m.id)) + 1 
        : 1;

      const createdModule = await dbAddModule({
        id: newMod.id || nextId,
        title: newMod.title || `Module ${nextId}: New Course Topic`,
        duration: newMod.duration || '45 mins',
        description: newMod.description || 'Comprehensive step-by-step practical training.',
        lessons: newMod.lessons || []
      });

      triggerRevalidate();

      return NextResponse.json({
        success: true,
        message: 'Module added to database successfully!',
        module: createdModule,
        modules: await dbGetModules()
      }, { headers: NO_CACHE_HEADERS });
    }

    // Action: Add lesson to existing module
    if (action === 'ADD_LESSON') {
      if (!moduleId || !lesson) {
        return NextResponse.json({ success: false, message: 'Missing moduleId or lesson data' }, { status: 400, headers: NO_CACHE_HEADERS });
      }

      const lessonId = lesson.id || `m${moduleId}_l${Date.now()}`;
      const createdLesson = await dbAddLesson(Number(moduleId), {
        id: lessonId,
        title: lesson.title || 'New Lecture Video',
        duration: lesson.duration || '15:00',
        videoUrl: lesson.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        notes: lesson.notes || ''
      });

      if (!createdLesson) {
        return NextResponse.json({ success: false, message: 'Module not found in database' }, { status: 404, headers: NO_CACHE_HEADERS });
      }

      triggerRevalidate();

      return NextResponse.json({
        success: true,
        message: 'Lesson added to module in database successfully!',
        lesson: createdLesson,
        modules: await dbGetModules()
      }, { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json({ success: false, message: 'Invalid action payload' }, { status: 400, headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, moduleId, lessonId, patch } = body;

    if (action === 'UPDATE_MODULE') {
      const updated = await dbUpdateModule(Number(moduleId), patch);
      if (!updated) return NextResponse.json({ success: false, message: 'Module not found' }, { status: 404, headers: NO_CACHE_HEADERS });
      
      triggerRevalidate();
      return NextResponse.json({ success: true, message: 'Module updated in database', module: updated, modules: await dbGetModules() }, { headers: NO_CACHE_HEADERS });
    }

    if (action === 'UPDATE_LESSON') {
      const updated = await dbUpdateLesson(Number(moduleId), lessonId, patch);
      if (!updated) return NextResponse.json({ success: false, message: 'Lesson not found' }, { status: 404, headers: NO_CACHE_HEADERS });
      
      triggerRevalidate();
      return NextResponse.json({ success: true, message: 'Lesson updated in database', lesson: updated, modules: await dbGetModules() }, { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json({ success: false, message: 'Invalid update action' }, { status: 400, headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    const lessonId = searchParams.get('lessonId');
    const idsParam = searchParams.get('ids');

    // Bulk delete modules via query param
    if (idsParam) {
      const targetIds = idsParam.split(',').map(Number).filter(n => !isNaN(n));
      await dbBulkDeleteModules(targetIds);
      triggerRevalidate();
      return NextResponse.json({ success: true, message: `${targetIds.length} modules deleted from database`, modules: await dbGetModules() }, { headers: NO_CACHE_HEADERS });
    }

    // Check if JSON body provided for bulk delete
    let bodyJson: any = null;
    try {
      bodyJson = await request.json();
    } catch {}

    if (bodyJson && (bodyJson.moduleIds || bodyJson.ids)) {
      const targetIds = (bodyJson.moduleIds || bodyJson.ids).map(Number).filter((n: number) => !isNaN(n));
      await dbBulkDeleteModules(targetIds);
      triggerRevalidate();
      return NextResponse.json({ success: true, message: `${targetIds.length} modules deleted from database`, modules: await dbGetModules() }, { headers: NO_CACHE_HEADERS });
    }

    // Delete specific lesson
    if (moduleId && lessonId) {
      const removed = await dbDeleteLesson(Number(moduleId), lessonId);
      if (!removed) return NextResponse.json({ success: false, message: 'Lesson not found' }, { status: 404, headers: NO_CACHE_HEADERS });
      
      triggerRevalidate();
      return NextResponse.json({ success: true, message: 'Lesson removed from database', modules: await dbGetModules() }, { headers: NO_CACHE_HEADERS });
    }

    // Delete entire module
    if (moduleId) {
      const removed = await dbDeleteModule(Number(moduleId));
      if (!removed) return NextResponse.json({ success: false, message: 'Module not found' }, { status: 404, headers: NO_CACHE_HEADERS });
      
      triggerRevalidate();
      return NextResponse.json({ success: true, message: 'Module deleted from database', modules: await dbGetModules() }, { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json({ success: false, message: 'Missing moduleId, lessonId, or ids' }, { status: 400, headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

