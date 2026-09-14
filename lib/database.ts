import { 
  mysqlGetCmsSettings, 
  mysqlSaveCmsSettings, 
  mysqlGetModules, 
  mysqlAddModule, 
  mysqlUpdateModule, 
  mysqlDeleteModule, 
  mysqlBulkDeleteModules,
  mysqlGetEnrollments,
  mysqlAddEnrollment,
  mysqlUpdateEnrollmentStatus,
  mysqlDeleteEnrollment,
  mysqlGetStudents,
  mysqlGetStudentByEmail,
  mysqlAddStudent,
  mysqlUpdateStudent,
  mysqlDeleteStudent,
  mysqlResetStudentPassword,
  mysqlGetSuppliers,
  mysqlAddSupplier,
  mysqlDeleteSupplier,
  mysqlGetTickets,
  mysqlAddTicket,
  mysqlUpdateTicketStatus,
  mysqlDeleteTicket,
  mysqlBulkDeleteTickets
} from './mysql';
import { defaultCmsContent, CmsContentSchema, ThemeCustomColors, DEFAULT_THEME_COLORS } from '@/utils/cmsStore';
import { 
  initialStudents, 
  initialEnrollments, 
  initialModules, 
  initialSuppliers, 
  initialResources, 
  initialTickets, 
  Student, 
  Enrollment, 
  Module, 
  Supplier, 
  ResourceItem, 
  SupportTicket,
  Lesson 
} from '@/utils/db';

function parseCmsSchema(parsed: any): CmsContentSchema {
  return {
    ...defaultCmsContent,
    ...parsed,
    hero: { ...defaultCmsContent.hero, ...(parsed.hero || {}) },
    stats: { ...defaultCmsContent.stats, ...(parsed.stats || {}) },
    mentor: { ...defaultCmsContent.mentor, ...(parsed.mentor || {}) },
    marquee: { ...defaultCmsContent.marquee, ...(parsed.marquee || {}) },
    contact: { ...defaultCmsContent.contact, ...(parsed.contact || {}) },
    bonuses: { ...defaultCmsContent.bonuses, ...(parsed.bonuses || {}) },
    why_dropshipping: { ...defaultCmsContent.why_dropshipping, ...(parsed.why_dropshipping || {}) },
    what_you_get: parsed.what_you_get
      ? {
          ...defaultCmsContent.what_you_get,
          ...parsed.what_you_get,
          items: Array.isArray(parsed.what_you_get.items) && parsed.what_you_get.items.length > 0
            ? parsed.what_you_get.items
            : defaultCmsContent.what_you_get.items
        }
      : defaultCmsContent.what_you_get,
    who_is_this_for: parsed.who_is_this_for
      ? {
          ...defaultCmsContent.who_is_this_for,
          ...parsed.who_is_this_for,
          items: Array.isArray(parsed.who_is_this_for.items) && parsed.who_is_this_for.items.length > 0
            ? parsed.who_is_this_for.items
            : defaultCmsContent.who_is_this_for.items
        }
      : defaultCmsContent.who_is_this_for,
    video_reviews: parsed.video_reviews
      ? {
          ...defaultCmsContent.video_reviews,
          ...parsed.video_reviews,
          items: Array.isArray(parsed.video_reviews.items) && parsed.video_reviews.items.length > 0
            ? parsed.video_reviews.items
            : defaultCmsContent.video_reviews.items
        }
      : defaultCmsContent.video_reviews,
    options_comparison: { ...defaultCmsContent.options_comparison, ...(parsed.options_comparison || {}) },
    cost_of_waiting: { ...defaultCmsContent.cost_of_waiting, ...(parsed.cost_of_waiting || {}) },
    final_cta: { ...defaultCmsContent.final_cta, ...(parsed.final_cta || {}) },
    footer: { ...defaultCmsContent.footer, ...(parsed.footer || {}) },
    testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : defaultCmsContent.testimonials,
    faqs: Array.isArray(parsed.faqs) ? parsed.faqs : defaultCmsContent.faqs,
    payment_methods: Array.isArray(parsed.payment_methods) ? parsed.payment_methods : defaultCmsContent.payment_methods,
    theme: parsed.theme 
      ? { 
          ...defaultCmsContent.theme, 
          ...parsed.theme, 
          custom_colors: { 
            ...defaultCmsContent.theme?.custom_colors, 
            ...(parsed.theme.custom_colors || {}) 
          } 
        } 
      : defaultCmsContent.theme,
    screenshot_reviews: parsed.screenshot_reviews
      ? {
          ...defaultCmsContent.screenshot_reviews,
          ...parsed.screenshot_reviews,
          images: Array.isArray(parsed.screenshot_reviews.images)
            ? parsed.screenshot_reviews.images
            : []
        }
      : defaultCmsContent.screenshot_reviews,
    homepage_proof_wall: parsed.homepage_proof_wall
      ? {
          ...defaultCmsContent.homepage_proof_wall,
          ...parsed.homepage_proof_wall,
          images: Array.isArray(parsed.homepage_proof_wall.images)
            ? parsed.homepage_proof_wall.images
            : []
        }
      : defaultCmsContent.homepage_proof_wall,
    success_page: parsed.success_page
      ? {
          ...defaultCmsContent.success_page,
          ...parsed.success_page,
        }
      : defaultCmsContent.success_page,
    checkout_page: parsed.checkout_page
      ? {
          ...defaultCmsContent.checkout_page,
          ...parsed.checkout_page,
        }
      : defaultCmsContent.checkout_page,
    homepage_curriculum: parsed.homepage_curriculum !== undefined
      ? {
          tag: parsed.homepage_curriculum?.tag ?? defaultCmsContent.homepage_curriculum?.tag ?? '',
          title: parsed.homepage_curriculum?.title ?? defaultCmsContent.homepage_curriculum?.title ?? '',
          subtitle: parsed.homepage_curriculum?.subtitle ?? defaultCmsContent.homepage_curriculum?.subtitle ?? '',
          modules: Array.isArray(parsed.homepage_curriculum?.modules)
            ? parsed.homepage_curriculum.modules
            : (defaultCmsContent.homepage_curriculum?.modules || [])
        }
      : defaultCmsContent.homepage_curriculum,
    why_different: parsed.why_different !== undefined
      ? {
          is_active: parsed.why_different?.is_active ?? defaultCmsContent.why_different?.is_active ?? true,
          title: parsed.why_different?.title ?? defaultCmsContent.why_different?.title ?? '',
          subtitle: parsed.why_different?.subtitle ?? defaultCmsContent.why_different?.subtitle ?? '',
          cards: Array.isArray(parsed.why_different?.cards)
            ? parsed.why_different.cards
            : (defaultCmsContent.why_different?.cards || [])
        }
      : defaultCmsContent.why_different,
    signature_framework: parsed.signature_framework !== undefined
      ? {
          is_active: parsed.signature_framework?.is_active ?? defaultCmsContent.signature_framework?.is_active ?? true,
          badge: parsed.signature_framework?.badge ?? defaultCmsContent.signature_framework?.badge ?? 'SIGNATURE FRAMEWORK',
          eyebrow: parsed.signature_framework?.eyebrow ?? defaultCmsContent.signature_framework?.eyebrow ?? 'SIGNATURE FRAMEWORK',
          title: parsed.signature_framework?.title ?? defaultCmsContent.signature_framework?.title ?? '',
          subtitle: parsed.signature_framework?.subtitle ?? defaultCmsContent.signature_framework?.subtitle ?? '',
          description: parsed.signature_framework?.description ?? defaultCmsContent.signature_framework?.description ?? '',
          highlight_tag: parsed.signature_framework?.highlight_tag ?? defaultCmsContent.signature_framework?.highlight_tag ?? '',
          cta_text: parsed.signature_framework?.cta_text ?? defaultCmsContent.signature_framework?.cta_text ?? ''
        }
      : defaultCmsContent.signature_framework
  };
}

// -----------------------------------------------------------------------------
// 1. CMS SETTINGS (100% NATIVE HOSTINGER MYSQL)
// -----------------------------------------------------------------------------
export async function dbGetCmsSettings(): Promise<CmsContentSchema> {
  try {
    const mysqlData = await mysqlGetCmsSettings();
    if (mysqlData && typeof mysqlData === 'object') {
      return parseCmsSchema(mysqlData);
    }
  } catch (e) {
    console.error('dbGetCmsSettings error:', e);
  }
  return defaultCmsContent;
}

export async function dbSaveCmsSettings(patch: Partial<CmsContentSchema>): Promise<CmsContentSchema> {
  const existing = await dbGetCmsSettings();
  const updated: CmsContentSchema = {
    ...existing,
    ...patch,
    hero: patch.hero !== undefined ? { ...existing.hero, ...patch.hero } : existing.hero,
    stats: patch.stats !== undefined ? { ...existing.stats, ...patch.stats } : existing.stats,
    mentor: patch.mentor !== undefined ? { ...existing.mentor, ...patch.mentor } : existing.mentor,
    marquee: patch.marquee !== undefined ? { ...existing.marquee, ...patch.marquee } : existing.marquee,
    contact: patch.contact !== undefined ? { ...existing.contact, ...patch.contact } : existing.contact,
    bonuses: patch.bonuses !== undefined ? patch.bonuses : existing.bonuses,
    why_dropshipping: patch.why_dropshipping !== undefined ? patch.why_dropshipping : existing.why_dropshipping,
    what_you_get: patch.what_you_get !== undefined ? patch.what_you_get : existing.what_you_get,
    who_is_this_for: patch.who_is_this_for !== undefined ? patch.who_is_this_for : existing.who_is_this_for,
    video_reviews: patch.video_reviews !== undefined ? patch.video_reviews : existing.video_reviews,
    options_comparison: patch.options_comparison !== undefined ? patch.options_comparison : existing.options_comparison,
    cost_of_waiting: patch.cost_of_waiting !== undefined ? patch.cost_of_waiting : existing.cost_of_waiting,
    final_cta: patch.final_cta !== undefined ? { ...existing.final_cta, ...patch.final_cta } : existing.final_cta,
    footer: patch.footer !== undefined ? { ...existing.footer, ...patch.footer } : existing.footer,
    testimonials: patch.testimonials !== undefined ? patch.testimonials : existing.testimonials,
    faqs: patch.faqs !== undefined ? patch.faqs : existing.faqs,
    payment_methods: patch.payment_methods !== undefined ? patch.payment_methods : existing.payment_methods,
    pixels: patch.pixels !== undefined ? patch.pixels : existing.pixels,
    screenshot_reviews: patch.screenshot_reviews !== undefined ? patch.screenshot_reviews : existing.screenshot_reviews,
    homepage_proof_wall: patch.homepage_proof_wall !== undefined ? patch.homepage_proof_wall : existing.homepage_proof_wall,
    success_page: patch.success_page !== undefined ? patch.success_page : existing.success_page,
    checkout_page: patch.checkout_page !== undefined ? { ...existing.checkout_page, ...patch.checkout_page } : existing.checkout_page,
    homepage_curriculum: patch.homepage_curriculum !== undefined ? patch.homepage_curriculum : existing.homepage_curriculum,
    why_different: patch.why_different !== undefined ? patch.why_different : existing.why_different,
    signature_framework: patch.signature_framework !== undefined ? patch.signature_framework : existing.signature_framework,
    theme: patch.theme !== undefined 
      ? { 
          ...(existing.theme || defaultCmsContent.theme), 
          ...patch.theme, 
          custom_colors: { 
            ...((existing.theme && existing.theme.custom_colors) || defaultCmsContent.theme?.custom_colors || DEFAULT_THEME_COLORS), 
            ...(patch.theme.custom_colors || {}) 
          } as ThemeCustomColors
        } 
      : (existing.theme || defaultCmsContent.theme)
  };

  try {
    await mysqlSaveCmsSettings(updated);
  } catch (e) {
    console.error('Hostinger MySQL save CMS error:', e);
  }

  return updated;
}

// -----------------------------------------------------------------------------
// 2. LMS MODULES & LECTURES (100% NATIVE HOSTINGER MYSQL)
// -----------------------------------------------------------------------------
export async function dbGetModules(): Promise<Module[]> {
  try {
    const mysqlMods = await mysqlGetModules();
    if (mysqlMods !== null) {
      return mysqlMods;
    }
  } catch (e) {
    console.error('Hostinger MySQL get modules error:', e);
  }
  return initialModules;
}

export async function dbAddModule(module: Module): Promise<Module> {
  try {
    return await mysqlAddModule(module);
  } catch (e) {
    console.error('Hostinger MySQL add module error:', e);
    return module;
  }
}

export async function dbUpdateModule(id: number, patch: Partial<Module>): Promise<Module | null> {
  try {
    return await mysqlUpdateModule(id, patch);
  } catch (e) {
    console.error('Hostinger MySQL update module error:', e);
    return null;
  }
}

export async function dbDeleteModule(id: number): Promise<boolean> {
  try {
    return await mysqlDeleteModule(Number(id));
  } catch (e) {
    console.error('Hostinger MySQL delete module error:', e);
    return false;
  }
}

export async function dbBulkDeleteModules(ids: number[]): Promise<boolean> {
  try {
    return await mysqlBulkDeleteModules(ids);
  } catch (e) {
    console.error('Hostinger MySQL bulk delete modules error:', e);
    return false;
  }
}

export async function dbAddLesson(moduleId: number, lesson: Lesson): Promise<Lesson | null> {
  const modules = await dbGetModules();
  const mod = modules.find(m => m.id === moduleId);
  if (!mod) return null;

  mod.lessons = mod.lessons || [];
  mod.lessons.push(lesson);
  await dbUpdateModule(moduleId, { lessons: mod.lessons });
  return lesson;
}

export async function dbUpdateLesson(moduleId: number, lessonId: string, patch: Partial<Lesson>): Promise<Lesson | null> {
  const modules = await dbGetModules();
  const mod = modules.find(m => m.id === moduleId);
  if (!mod) return null;

  const lIdx = mod.lessons.findIndex(l => l.id === lessonId);
  if (lIdx === -1) return null;

  mod.lessons[lIdx] = { ...mod.lessons[lIdx], ...patch };
  await dbUpdateModule(moduleId, { lessons: mod.lessons });
  return mod.lessons[lIdx];
}

export async function dbDeleteLesson(moduleId: number, lessonId: string): Promise<boolean> {
  const modules = await dbGetModules();
  const mod = modules.find(m => m.id === moduleId);
  if (!mod) return false;

  mod.lessons = mod.lessons.filter(l => l.id !== lessonId);
  await dbUpdateModule(moduleId, { lessons: mod.lessons });
  return true;
}

// -----------------------------------------------------------------------------
// 3. WHOLESALE SUPPLIERS (100% NATIVE HOSTINGER MYSQL)
// -----------------------------------------------------------------------------
export async function dbGetSuppliers(): Promise<Supplier[]> {
  try {
    return await mysqlGetSuppliers();
  } catch (e) {
    console.error('Hostinger MySQL get suppliers error:', e);
    return initialSuppliers;
  }
}

export async function dbAddSupplier(supplier: Supplier): Promise<Supplier> {
  try {
    return await mysqlAddSupplier(supplier);
  } catch (e) {
    console.error('Hostinger MySQL add supplier error:', e);
    return supplier;
  }
}

export async function dbDeleteSupplier(id: string): Promise<boolean> {
  try {
    return await mysqlDeleteSupplier(id);
  } catch (e) {
    console.error('Hostinger MySQL delete supplier error:', e);
    return false;
  }
}

// -----------------------------------------------------------------------------
// 4. STUDENTS (100% NATIVE HOSTINGER MYSQL)
// -----------------------------------------------------------------------------
export function generateRandomNumericPassword(length = 8): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export function generateStableNumericPassword(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash);
  const num = 10000000 + (positive % 90000000);
  return num.toString();
}

interface MemoryCacheEntry<T> {
  data: T;
  expiry: number;
}

let cachedStudents: MemoryCacheEntry<Student[]> | null = null;
let cachedEnrollments: MemoryCacheEntry<Enrollment[]> | null = null;
const CACHE_TTL_MS = 10000; // 10 seconds cache for instant response

export function clearDatabaseCache() {
  cachedStudents = null;
  cachedEnrollments = null;
}

export async function dbGetStudents(forceFresh = false): Promise<Student[]> {
  if (!forceFresh && cachedStudents && Date.now() < cachedStudents.expiry) {
    return cachedStudents.data;
  }

  try {
    const result = await mysqlGetStudents();
    cachedStudents = { data: result, expiry: Date.now() + CACHE_TTL_MS };
    return result;
  } catch (e) {
    console.error('Hostinger MySQL get students error:', e);
    return initialStudents;
  }
}

export async function dbGetStudentByEmail(email: string): Promise<Student | null> {
  try {
    return await mysqlGetStudentByEmail(email);
  } catch (e) {
    console.error('Hostinger MySQL get student by email error:', e);
    return null;
  }
}

export async function dbAddStudent(student: Student): Promise<Student> {
  clearDatabaseCache();
  try {
    return await mysqlAddStudent(student);
  } catch (e) {
    console.error('Hostinger MySQL add student error:', e);
    return student;
  }
}

export async function dbUpdateStudent(id: string, patch: Partial<Student>): Promise<Student | null> {
  clearDatabaseCache();
  try {
    return await mysqlUpdateStudent(id, patch);
  } catch (e) {
    console.error('Hostinger MySQL update student error:', e);
    return null;
  }
}

export async function dbDeleteStudent(idOrEmail: string): Promise<boolean> {
  clearDatabaseCache();
  try {
    return await mysqlDeleteStudent(idOrEmail);
  } catch (e) {
    console.error('Hostinger MySQL delete student error:', e);
    return false;
  }
}

export async function dbRecordStudentStrike(
  studentId: string, 
  violationType = 'CAPTURE_ATTEMPT'
): Promise<{ strikeCount: number; isBlocked: boolean; student: Student | null }> {
  clearDatabaseCache();
  const students = await dbGetStudents(true);
  const target = students.find(s => String(s.id) === String(studentId) || s.email.toLowerCase() === studentId.toLowerCase());
  if (!target) {
    return { strikeCount: 1, isBlocked: false, student: null };
  }

  const currentStrikes = Number(target.strikeCount || 0);
  const newStrikes = currentStrikes + 1;
  const isBlocked = newStrikes >= 5;

  const updated: Student = {
    ...target,
    strikeCount: newStrikes,
    isActive: isBlocked ? false : target.isActive
  };

  try {
    await mysqlUpdateStudent(target.id, {
      strikeCount: newStrikes,
      isActive: updated.isActive
    });
  } catch (e) {
    console.error('Hostinger MySQL record strike error:', e);
  }

  return { strikeCount: newStrikes, isBlocked, student: updated };
}

export async function dbResetStudentStrikes(
  studentId: string, 
  reactivate = true
): Promise<{ success: boolean; student: Student | null }> {
  clearDatabaseCache();
  const students = await dbGetStudents(true);
  const target = students.find(s => String(s.id) === String(studentId) || s.email.toLowerCase() === studentId.toLowerCase());
  if (!target) return { success: false, student: null };

  const updated: Student = {
    ...target,
    strikeCount: 0,
    isActive: reactivate ? true : target.isActive
  };

  try {
    await mysqlUpdateStudent(target.id, {
      strikeCount: 0,
      isActive: updated.isActive
    });
  } catch (e) {
    console.error('Hostinger MySQL reset strikes error:', e);
  }

  return { success: true, student: updated };
}

// -----------------------------------------------------------------------------
// 5. ENROLLMENTS (100% NATIVE HOSTINGER MYSQL)
// -----------------------------------------------------------------------------
export async function dbGetEnrollments(providedStudents?: Student[], forceFresh = false): Promise<Enrollment[]> {
  if (!forceFresh && cachedEnrollments && Date.now() < cachedEnrollments.expiry) {
    return cachedEnrollments.data;
  }

  try {
    const list = await mysqlGetEnrollments();
    cachedEnrollments = { data: list, expiry: Date.now() + CACHE_TTL_MS };
    return list;
  } catch (e) {
    console.error('Hostinger MySQL get enrollments error:', e);
    return initialEnrollments;
  }
}

export async function dbAddEnrollment(enr: Enrollment): Promise<Enrollment> {
  clearDatabaseCache();
  try {
    return await mysqlAddEnrollment(enr);
  } catch (e) {
    console.error('Hostinger MySQL add enrollment error:', e);
    return enr;
  }
}

export async function dbUpdateEnrollmentStatus(
  id: string, 
  status: 'approved' | 'rejected', 
  customPassword?: string
): Promise<{ enrollment: Enrollment; password?: string } | null> {
  clearDatabaseCache();
  try {
    return await mysqlUpdateEnrollmentStatus(id, status, customPassword);
  } catch (e) {
    console.error('Hostinger MySQL update enrollment status error:', e);
    return null;
  }
}

export async function dbResetStudentPassword(identifier: string, newPassword?: string): Promise<{ success: boolean; email: string; newPassword: string } | null> {
  clearDatabaseCache();
  try {
    const res = await mysqlResetStudentPassword(identifier, newPassword);
    if (res) {
      return { success: true, email: res.email, newPassword: res.newPassword };
    }
  } catch (e) {
    console.error('Hostinger MySQL reset student password error:', e);
  }
  return null;
}

export async function dbDeleteEnrollment(id: string): Promise<boolean> {
  clearDatabaseCache();
  try {
    return await mysqlDeleteEnrollment(id);
  } catch (e) {
    console.error('Hostinger MySQL delete enrollment error:', e);
    return false;
  }
}

// -----------------------------------------------------------------------------
// 6. RESOURCES & TICKETS (100% NATIVE HOSTINGER MYSQL)
// -----------------------------------------------------------------------------
export async function dbGetResources(): Promise<ResourceItem[]> {
  return initialResources;
}

export async function dbGetTickets(): Promise<SupportTicket[]> {
  try {
    return await mysqlGetTickets();
  } catch (e) {
    console.error('Hostinger MySQL get tickets error:', e);
    return initialTickets;
  }
}

export async function dbAddTicket(ticket: SupportTicket): Promise<SupportTicket> {
  try {
    return await mysqlAddTicket(ticket);
  } catch (e) {
    console.error('Hostinger MySQL add ticket error:', e);
    return ticket;
  }
}

export async function dbUpdateTicketStatus(id: string, status: 'open' | 'in_progress' | 'resolved'): Promise<boolean> {
  try {
    return await mysqlUpdateTicketStatus(id, status);
  } catch (e) {
    console.error('Hostinger MySQL update ticket status error:', e);
    return false;
  }
}

export async function dbDeleteTicket(id: string): Promise<boolean> {
  try {
    return await mysqlDeleteTicket(id);
  } catch (e) {
    console.error('Hostinger MySQL delete ticket error:', e);
    return false;
  }
}

export async function dbBulkDeleteTickets(ids: string[]): Promise<boolean> {
  try {
    return await mysqlBulkDeleteTickets(ids);
  } catch (e) {
    console.error('Hostinger MySQL bulk delete tickets error:', e);
    return false;
  }
}
