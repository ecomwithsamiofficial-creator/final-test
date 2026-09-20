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
            ? parsed.screenshot_reviews.images.filter((url: any) => typeof url === 'string' && !url.includes('learnwithafaq.com'))
            : []
        }
      : defaultCmsContent.screenshot_reviews,
    homepage_proof_wall: parsed.homepage_proof_wall
      ? {
          ...defaultCmsContent.homepage_proof_wall,
          ...parsed.homepage_proof_wall,
          images: Array.isArray(parsed.homepage_proof_wall.images)
            ? parsed.homepage_proof_wall.images.filter((url: any) => typeof url === 'string' && !url.includes('learnwithafaq.com'))
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
      : defaultCmsContent.signature_framework,
    pixels: parsed.pixels !== undefined
      ? {
          ...defaultCmsContent.pixels,
          ...parsed.pixels
        }
      : defaultCmsContent.pixels,
    about_page: parsed.about_page !== undefined
      ? {
          ...defaultCmsContent.about_page,
          ...parsed.about_page,
          benefits: Array.isArray(parsed.about_page?.benefits)
            ? parsed.about_page.benefits
            : (defaultCmsContent.about_page?.benefits || []),
          why_learn_cards: Array.isArray(parsed.about_page?.why_learn_cards)
            ? parsed.about_page.why_learn_cards
            : (defaultCmsContent.about_page?.why_learn_cards || [])
        }
      : defaultCmsContent.about_page
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

export async function dbSaveCmsSettings(patch: any, activeTabHint?: string): Promise<CmsContentSchema> {
  const existing = await dbGetCmsSettings();
  const activeTab = patch?._activeTab || patch?._section || activeTabHint;

  // 1. Explicit Tab/Section Targeted Save (Guarantees other tabs are 100% untouched)
  if (activeTab) {
    const updated: CmsContentSchema = { ...existing };
    if (activeTab === 'faqs' && patch.faqs !== undefined) {
      updated.faqs = patch.faqs;
    } else if (activeTab === 'homepage_curriculum' && patch.homepage_curriculum !== undefined) {
      updated.homepage_curriculum = patch.homepage_curriculum;
    } else if (activeTab === 'hero' && patch.hero !== undefined) {
      updated.hero = { ...existing.hero, ...patch.hero };
    } else if (activeTab === 'mentor' && patch.mentor !== undefined) {
      updated.mentor = { ...existing.mentor, ...patch.mentor };
    } else if (activeTab === 'marquee' && patch.marquee !== undefined) {
      updated.marquee = { ...existing.marquee, ...patch.marquee };
    } else if (activeTab === 'stats' && patch.stats !== undefined) {
      updated.stats = { ...existing.stats, ...patch.stats };
    } else if (activeTab === 'why' && patch.why_dropshipping !== undefined) {
      updated.why_dropshipping = patch.why_dropshipping;
    } else if (activeTab === 'what' && patch.what_you_get !== undefined) {
      updated.what_you_get = patch.what_you_get;
    } else if (activeTab === 'why_different' && patch.why_different !== undefined) {
      updated.why_different = patch.why_different;
    } else if (activeTab === 'signature_framework' && patch.signature_framework !== undefined) {
      updated.signature_framework = patch.signature_framework;
    } else if (activeTab === 'who' && patch.who_is_this_for !== undefined) {
      updated.who_is_this_for = patch.who_is_this_for;
    } else if (activeTab === 'video_reviews' && patch.video_reviews !== undefined) {
      updated.video_reviews = patch.video_reviews;
    } else if (activeTab === 'bonuses' && patch.bonuses !== undefined) {
      updated.bonuses = patch.bonuses;
    } else if (activeTab === 'reviews' && patch.screenshot_reviews !== undefined) {
      updated.screenshot_reviews = patch.screenshot_reviews;
    } else if (activeTab === 'proofwall_home' && patch.homepage_proof_wall !== undefined) {
      updated.homepage_proof_wall = patch.homepage_proof_wall;
    } else if (activeTab === 'options' && patch.options_comparison !== undefined) {
      updated.options_comparison = patch.options_comparison;
    } else if (activeTab === 'cost' && patch.cost_of_waiting !== undefined) {
      updated.cost_of_waiting = patch.cost_of_waiting;
    } else if (activeTab === 'final_cta' || activeTab === 'cta') {
      if (patch.final_cta !== undefined) updated.final_cta = { ...existing.final_cta, ...patch.final_cta };
    } else if (activeTab === 'contact' && patch.contact !== undefined) {
      updated.contact = { ...existing.contact, ...patch.contact };
    } else if (activeTab === 'payments' && patch.payment_methods !== undefined) {
      updated.payment_methods = patch.payment_methods;
    } else if (activeTab === 'themes' && patch.theme !== undefined) {
      updated.theme = { ...existing.theme, ...patch.theme };
    } else if (activeTab === 'pixels' && patch.pixels !== undefined) {
      updated.pixels = { ...existing.pixels, ...patch.pixels };
    } else if (activeTab === 'success_page' && patch.success_page !== undefined) {
      updated.success_page = { ...existing.success_page, ...patch.success_page };
    } else if (activeTab === 'checkout_page' && patch.checkout_page !== undefined) {
      updated.checkout_page = { ...existing.checkout_page, ...patch.checkout_page };
    } else if (activeTab === 'about_page' && patch.about_page !== undefined) {
      updated.about_page = patch.about_page;
    }

    try {
      await mysqlSaveCmsSettings(updated);
    } catch (e) {
      console.error('Hostinger MySQL save CMS error:', e);
    }
    return updated;
  }

  // 2. Intelligent Non-Destructive Delta Merge (For dual-browser / multi-profile saves)
  const updated: CmsContentSchema = { ...existing };

  const isCustomFaqs = (faqs: any[]) => Array.isArray(faqs) && (
    faqs.length > 8 || 
    faqs.some(f => (f?.q && f.q.includes('PKR')) || (f?.a && (f.a.includes('Sami') || f.a.includes('LMS') || f.a.includes('Weak'))))
  );

  const isCustomCurriculum = (curr: any) => {
    if (!curr || !Array.isArray(curr.modules)) return false;
    const defaultMods = defaultCmsContent.homepage_curriculum?.modules || [];
    if (curr.modules.length !== defaultMods.length) return true;
    return curr.modules.some((m: any, idx: number) => {
      const def = defaultMods[idx];
      return !def || m.id !== def.id || m.title !== def.title;
    });
  };

  // Merge FAQs:
  // 1. If incoming has 10+ questions, it is the full customized FAQ list -> ALWAYS accept it!
  // 2. If DB already has 10+ questions, and incoming has fewer than 10 (e.g. 6 items from Browser B),
  //    DO NOT ALLOW stale payload to overwrite the rich 15 FAQs in the database!
  if (patch.faqs !== undefined) {
    const incomingFaqs = Array.isArray(patch.faqs) ? patch.faqs : [];
    const existingFaqs = Array.isArray(existing.faqs) ? existing.faqs : [];
    if (incomingFaqs.length >= 10) {
      updated.faqs = patch.faqs;
    } else if (existingFaqs.length >= 10 && incomingFaqs.length < 10) {
      console.log(`[CMS Merge] Protecting rich ${existingFaqs.length} FAQs against stale ${incomingFaqs.length} payload`);
    } else {
      updated.faqs = patch.faqs;
    }
  }

  // Merge Homepage Curriculum: Do not allow stale default curriculum to overwrite rich customized modules
  if (patch.homepage_curriculum !== undefined) {
    if (isCustomCurriculum(patch.homepage_curriculum) || !isCustomCurriculum(existing.homepage_curriculum)) {
      updated.homepage_curriculum = patch.homepage_curriculum;
    }
  }

  // Merge Mentor Profile: Do not allow stale default mentor profile to overwrite customized mentor profile
  const isCustomMentor = (m: any) => {
    if (!m || typeof m !== 'object') return false;
    if (m.image && m.image.includes('/uploads/mentor/')) return true;
    if (m.stat1_value && m.stat1_value !== '1,200+' && m.stat1_value !== '9,700+' && m.stat1_value !== '9,742+') return true;
    if (m.stat2_value && m.stat2_value !== 'UAE & KSA') return true;
    if (m.bio && m.bio.includes('Pakistani sellers')) return true;
    return false;
  };

  if (patch.mentor !== undefined) {
    if (isCustomMentor(patch.mentor) || !isCustomMentor(existing.mentor)) {
      updated.mentor = { ...existing.mentor, ...patch.mentor };
    }
  }

  // Merge Student Success Proof Wall: Do not allow stale empty arrays to wipe active student results
  if (patch.homepage_proof_wall !== undefined) {
    const incomingImages = Array.isArray(patch.homepage_proof_wall?.images) ? patch.homepage_proof_wall.images : [];
    const existingImages = Array.isArray(existing.homepage_proof_wall?.images) ? existing.homepage_proof_wall.images : [];
    if (incomingImages.length >= existingImages.length || existingImages.length === 0) {
      updated.homepage_proof_wall = patch.homepage_proof_wall;
    }
  }

  // Merge Screenshot Reviews: Do not allow stale empty arrays to wipe checkout reviews
  if (patch.screenshot_reviews !== undefined) {
    const incomingImages = Array.isArray(patch.screenshot_reviews?.images) ? patch.screenshot_reviews.images : [];
    const existingImages = Array.isArray(existing.screenshot_reviews?.images) ? existing.screenshot_reviews.images : [];
    if (incomingImages.length >= existingImages.length || existingImages.length === 0) {
      updated.screenshot_reviews = patch.screenshot_reviews;
    }
  }

  // Merge other sections with non-destructive fallback
  if (patch.hero !== undefined) updated.hero = { ...existing.hero, ...patch.hero };
  if (patch.stats !== undefined) updated.stats = { ...existing.stats, ...patch.stats };
  if (patch.marquee !== undefined) updated.marquee = { ...existing.marquee, ...patch.marquee };
  if (patch.contact !== undefined) updated.contact = { ...existing.contact, ...patch.contact };
  if (patch.bonuses !== undefined) updated.bonuses = patch.bonuses;
  if (patch.why_dropshipping !== undefined) updated.why_dropshipping = patch.why_dropshipping;
  if (patch.what_you_get !== undefined) updated.what_you_get = patch.what_you_get;
  if (patch.who_is_this_for !== undefined) updated.who_is_this_for = patch.who_is_this_for;
  if (patch.video_reviews !== undefined) updated.video_reviews = patch.video_reviews;
  if (patch.options_comparison !== undefined) updated.options_comparison = patch.options_comparison;
  if (patch.cost_of_waiting !== undefined) updated.cost_of_waiting = patch.cost_of_waiting;
  if (patch.final_cta !== undefined) updated.final_cta = { ...existing.final_cta, ...patch.final_cta };
  if (patch.footer !== undefined) updated.footer = { ...existing.footer, ...patch.footer };
  if (patch.testimonials !== undefined) updated.testimonials = patch.testimonials;
  if (patch.payment_methods !== undefined) updated.payment_methods = patch.payment_methods;
  if (patch.pixels !== undefined) updated.pixels = { ...existing.pixels, ...patch.pixels };
  if (patch.success_page !== undefined) updated.success_page = { ...existing.success_page, ...patch.success_page };
  if (patch.checkout_page !== undefined) updated.checkout_page = { ...existing.checkout_page, ...patch.checkout_page };
  if (patch.why_different !== undefined) updated.why_different = patch.why_different;
  if (patch.signature_framework !== undefined) updated.signature_framework = patch.signature_framework;
  if (patch.about_page !== undefined) updated.about_page = patch.about_page;
  if (patch.theme !== undefined) {
    updated.theme = {
      ...(existing.theme || defaultCmsContent.theme),
      ...patch.theme,
      custom_colors: {
        ...((existing.theme && existing.theme.custom_colors) || defaultCmsContent.theme?.custom_colors || DEFAULT_THEME_COLORS),
        ...(patch.theme.custom_colors || {})
      } as ThemeCustomColors
    };
  }

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
    const saved = await mysqlAddEnrollment(enr);
    clearDatabaseCache();
    return saved;
  } catch (e) {
    console.error('Hostinger MySQL add enrollment error:', e);
    clearDatabaseCache();
    throw e;
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

export async function dbResetStudentPassword(identifier: string, newPassword?: string, fallbackEmail?: string): Promise<{ success: boolean; email: string; newPassword: string } | null> {
  clearDatabaseCache();
  try {
    const res = await mysqlResetStudentPassword(identifier, newPassword, fallbackEmail);
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
