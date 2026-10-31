import { dbGetCmsSettings } from '@/lib/database';
import { defaultCmsContent } from '@/utils/cmsStore';
import { EnrollmentPageClient } from './EnrollmentPageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EnrollmentPage() {
  let content = defaultCmsContent;
  try {
    const fetched = await dbGetCmsSettings();
    if (fetched && typeof fetched === 'object') {
      content = fetched;
    }
  } catch (err) {
    console.error('[EnrollmentPage] Failed to fetch CMS settings:', err);
  }

  const cp = content?.checkout_page || defaultCmsContent.checkout_page;

  const duration = Math.max(
    1,
    (Number(cp?.timer_hours) || 0) * 3600 +
    (Number(cp?.timer_minutes) || 0) * 60 +
    (Number(cp?.timer_seconds) || 0)
  );
  const anchor = Number(cp?.timer_anchor_time) || 1773100000000;
  const now = Date.now();
  const elapsed = Math.max(0, Math.floor((now - anchor) / 1000)) % duration;
  const serverRemainingSeconds = Math.max(0, duration - elapsed);

  return (
    <EnrollmentPageClient 
      initialContent={content} 
      serverRemainingSeconds={serverRemainingSeconds}
      serverTime={now}
    />
  );
}
