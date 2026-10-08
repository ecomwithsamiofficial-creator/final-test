import { dbGetCmsSettings, dbGetModules } from '@/lib/database';
import { HomePageClient } from '@/components/landing/HomePageClient';

export const revalidate = 60; // ISR: Ultra-fast static caching with automatic 60s background revalidation

export default async function HomePage() {
  const [content, modules] = await Promise.all([
    dbGetCmsSettings(),
    dbGetModules(),
  ]);

  const cp = content?.checkout_page;
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
    <HomePageClient 
      initialContent={content} 
      initialModules={modules} 
      serverRemainingSeconds={serverRemainingSeconds}
      serverTime={now}
    />
  );
}
