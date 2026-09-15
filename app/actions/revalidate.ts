'use server';

import { revalidatePath } from 'next/cache';

/**
 * List of primary website and dynamic pages that require cache updates
 */
const PRIMARY_PAGES = [
  { path: '/', type: 'page' as const },
  { path: '/', type: 'layout' as const },
  { path: '/about', type: 'page' as const },
  { path: '/support', type: 'page' as const },
  { path: '/checkout', type: 'page' as const },
  { path: '/enrollment', type: 'page' as const },
  { path: '/lms', type: 'page' as const },
  { path: '/login', type: 'page' as const },
  { path: '/apps', type: 'page' as const },
  { path: '/blogs', type: 'page' as const },
  { path: '/privacy', type: 'page' as const },
  { path: '/terms', type: 'page' as const },
  { path: '/refund', type: 'page' as const },
  { path: '/admin', type: 'page' as const },
  { path: '/admin/cms', type: 'page' as const },
  { path: '/admin/dashboard', type: 'page' as const },
];

/**
 * Server Action: Revalidates a single path on demand
 */
export async function revalidateTarget(path: string, type?: 'page' | 'layout') {
  try {
    if (!path || typeof path !== 'string') {
      return { success: false, error: 'Valid path is required' };
    }
    if (type) {
      revalidatePath(path, type);
    } else {
      revalidatePath(path);
    }
    return {
      success: true,
      path,
      type: type || 'default',
      revalidatedAt: new Date().toISOString()
    };
  } catch (error: any) {
    console.error(`[Revalidate Action Error for ${path}]:`, error);
    return { success: false, path, error: error.message || 'Failed to revalidate' };
  }
}

/**
 * Server Action: Revalidates multiple paths on demand
 */
export async function revalidateMultiple(paths: string[]) {
  const results: Array<{ path: string; status: 'ok' | 'failed'; error?: string }> = [];

  for (const p of paths) {
    try {
      revalidatePath(p);
      results.push({ path: p, status: 'ok' });
    } catch (err: any) {
      results.push({ path: p, status: 'failed', error: err.message });
    }
  }

  return {
    success: true,
    count: results.length,
    results,
    revalidatedAt: new Date().toISOString()
  };
}

/**
 * Server Action: Revalidates all core website & LMS pages
 */
export async function revalidateAllWebsitePages() {
  const revalidated: string[] = [];

  for (const item of PRIMARY_PAGES) {
    try {
      revalidatePath(item.path, item.type);
      revalidated.push(`${item.path} (${item.type})`);
    } catch (err) {
      console.warn(`Could not revalidate ${item.path}:`, err);
    }
  }

  // Also purge public API cache paths if cached
  try {
    revalidatePath('/api/public/cms-content');
    revalidated.push('/api/public/cms-content');
    revalidatePath('/api/pixels/active');
    revalidated.push('/api/pixels/active');
  } catch (err) {
    // ignore
  }

  return {
    success: true,
    total: revalidated.length,
    revalidated,
    revalidatedAt: new Date().toISOString()
  };
}
