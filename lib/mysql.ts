import mysql from 'mysql2/promise';
import { defaultCmsContent } from '@/utils/cmsStore';
import { 
  Module, 
  Lesson, 
  initialModules,
  Enrollment, 
  Student, 
  Supplier, 
  SupportTicket, 
  initialStudents, 
  initialEnrollments, 
  initialSuppliers 
} from '@/utils/db';

let pool: mysql.Pool | null = null;
let tablesInitialized = false;

// In-memory fallback if MySQL is temporarily unreachable (e.g. local build/dev)
const inMemoryVisitors = new Map<string, { visitorId: string; page: string; lastSeen: number }>();
const inMemorySessions = new Set<string>();
const inMemoryDaily = {
  totalSessions: 0,
  uniqueVisitors: 0,
  homeViews: 0,
  enrollmentViews: 0,
  lmsViews: 0,
  otherViews: 0,
  date: new Date().toISOString().slice(0, 10),
};

export function getMysqlPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
      port: Number(process.env.DB_PORT || process.env.MYSQL_PORT || 3306),
      user: process.env.DB_USER || process.env.DB_USERNAME || process.env.MYSQL_USER || 'u787683477_samihost1',
      password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || 'Sardar@123890#!',
      database: process.env.DB_NAME || process.env.DB_DATABASE || process.env.MYSQL_DATABASE || 'u787683477_ecomsamisiteh',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 4000,
    });
  }
  return pool;
}

export async function ensureAnalyticsTables(): Promise<boolean> {
  if (tablesInitialized) return true;
  try {
    const p = getMysqlPool();

    // 1. Real-time active open tabs/devices table
    await p.query(`
      CREATE TABLE IF NOT EXISTS active_visitors (
        visitor_id VARCHAR(64) PRIMARY KEY,
        page VARCHAR(255) NOT NULL,
        last_seen BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Daily aggregate analytics (Shopify-style: exactly 1 row per day)
    await p.query(`
      CREATE TABLE IF NOT EXISTS analytics_daily (
        report_date DATE PRIMARY KEY,
        total_sessions INT DEFAULT 0,
        unique_visitors INT DEFAULT 0,
        home_views INT DEFAULT 0,
        enrollment_views INT DEFAULT 0,
        lms_views INT DEFAULT 0,
        other_views INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Deduplicated daily session IDs (cleans up older than 2 days automatically)
    await p.query(`
      CREATE TABLE IF NOT EXISTS analytics_sessions (
        session_id VARCHAR(64) PRIMARY KEY,
        session_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_session_date (session_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. CMS Settings table in Hostinger MySQL
    await p.query(`
      CREATE TABLE IF NOT EXISTS cms_settings (
        \`key\` VARCHAR(191) PRIMARY KEY,
        \`value_json\` LONGTEXT NOT NULL,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. LMS Modules table in Hostinger MySQL
    await p.query(`
      CREATE TABLE IF NOT EXISTS \`lms_modules\` (
        \`id\` INT NOT NULL,
        \`title\` VARCHAR(255) NOT NULL,
        \`duration\` VARCHAR(100) NULL,
        \`description\` TEXT NULL,
        \`lessons_json\` LONGTEXT NULL,
        \`updated_at\` DATETIME NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Auto-seed main_cms if not present
    try {
      const [cmsRows]: any = await p.query(`SELECT \`key\` FROM cms_settings WHERE \`key\` = 'main_cms' LIMIT 1`);
      if (!Array.isArray(cmsRows) || cmsRows.length === 0) {
        await p.query(
          `INSERT INTO cms_settings (\`key\`, \`value_json\`) VALUES ('main_cms', ?)`,
          [JSON.stringify(defaultCmsContent)]
        );
      }
    } catch {
      // Ignore seed error
    }

    // Auto-seed initialModules once if lms_seeded flag is not set
    try {
      const [seedFlag]: any = await p.query(`SELECT \`key\` FROM cms_settings WHERE \`key\` = 'lms_seeded' LIMIT 1`);
      if (!Array.isArray(seedFlag) || seedFlag.length === 0) {
        for (const mod of initialModules) {
          await p.query(
            `INSERT INTO lms_modules (\`id\`, \`title\`, \`duration\`, \`description\`, \`lessons_json\`, \`updated_at\`)
             VALUES (?, ?, ?, ?, ?, NOW())
             ON DUPLICATE KEY UPDATE \`updated_at\` = NOW()`,
            [mod.id, mod.title, mod.duration, mod.description, JSON.stringify(mod.lessons || [])]
          );
        }
        await p.query(`INSERT INTO cms_settings (\`key\`, \`value_json\`) VALUES ('lms_seeded', 'true')`);
      }
    } catch {}

    // 6. Enrollments table in Hostinger MySQL
    try {
      await p.query(`
        CREATE TABLE IF NOT EXISTS \`enrollments\` (
          \`id\` VARCHAR(191) NOT NULL,
          \`tracking_code\` VARCHAR(191) NULL,
          \`student_id\` VARCHAR(191) NULL,
          \`name\` VARCHAR(255) NOT NULL,
          \`email\` VARCHAR(191) NOT NULL,
          \`phone\` VARCHAR(100) NULL,
          \`city\` VARCHAR(100) NULL,
          \`payment_method\` VARCHAR(100) NULL,
          \`transaction_id\` VARCHAR(255) NULL,
          \`where_heard\` VARCHAR(100) NULL,
          \`receipt_url\` LONGTEXT NULL,
          \`amount\` VARCHAR(100) NULL,
          \`status\` VARCHAR(50) DEFAULT 'pending',
          \`password\` VARCHAR(255) NULL,
          \`created_at\` VARCHAR(100) NULL,
          PRIMARY KEY (\`id\`),
          KEY \`idx_enrollments_email\` (\`email\`),
          KEY \`idx_enrollments_tracking\` (\`tracking_code\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // Safe column self-healing migrations if table was created in an older revision
      const enrCols = [
        `ALTER TABLE \`enrollments\` ADD COLUMN IF NOT EXISTS \`tracking_code\` VARCHAR(191) NULL`,
        `ALTER TABLE \`enrollments\` ADD COLUMN IF NOT EXISTS \`student_id\` VARCHAR(191) NULL`,
        `ALTER TABLE \`enrollments\` ADD COLUMN IF NOT EXISTS \`city\` VARCHAR(100) NULL`,
        `ALTER TABLE \`enrollments\` ADD COLUMN IF NOT EXISTS \`payment_method\` VARCHAR(100) NULL`,
        `ALTER TABLE \`enrollments\` ADD COLUMN IF NOT EXISTS \`transaction_id\` VARCHAR(255) NULL`,
        `ALTER TABLE \`enrollments\` ADD COLUMN IF NOT EXISTS \`where_heard\` VARCHAR(100) NULL`,
        `ALTER TABLE \`enrollments\` ADD COLUMN IF NOT EXISTS \`receipt_url\` LONGTEXT NULL`,
        `ALTER TABLE \`enrollments\` ADD COLUMN IF NOT EXISTS \`amount\` VARCHAR(100) NULL`,
        `ALTER TABLE \`enrollments\` ADD COLUMN IF NOT EXISTS \`status\` VARCHAR(50) DEFAULT 'pending'`,
        `ALTER TABLE \`enrollments\` ADD COLUMN IF NOT EXISTS \`password\` VARCHAR(255) NULL`,
        `ALTER TABLE \`enrollments\` ADD COLUMN IF NOT EXISTS \`created_at\` VARCHAR(100) NULL`
      ];
      for (const colQuery of enrCols) {
        try { await p.query(colQuery); } catch {}
      }
    } catch (err) {
      console.error('ensureAnalyticsTables enrollments table error:', err);
    }

    // 7. Students table in Hostinger MySQL
    try {
      await p.query(`
        CREATE TABLE IF NOT EXISTS \`students\` (
          \`id\` VARCHAR(191) NOT NULL,
          \`name\` VARCHAR(255) NOT NULL,
          \`email\` VARCHAR(191) NOT NULL,
          \`phone\` VARCHAR(100) NULL,
          \`city\` VARCHAR(100) NULL,
          \`password\` VARCHAR(255) NULL,
          \`is_active\` TINYINT(1) DEFAULT 0,
          \`enrolled_at\` VARCHAR(100) NULL,
          \`completed_lessons_json\` LONGTEXT NULL,
          \`last_login\` DATETIME NULL,
          \`strike_count\` INT DEFAULT 0,
          \`updated_at\` DATETIME NULL,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`idx_students_email\` (\`email\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      const stdCols = [
        `ALTER TABLE \`students\` ADD COLUMN IF NOT EXISTS \`strike_count\` INT DEFAULT 0`,
        `ALTER TABLE \`students\` ADD COLUMN IF NOT EXISTS \`last_login\` DATETIME NULL`,
        `ALTER TABLE \`students\` ADD COLUMN IF NOT EXISTS \`completed_lessons_json\` LONGTEXT NULL`,
        `ALTER TABLE \`students\` ADD COLUMN IF NOT EXISTS \`city\` VARCHAR(100) NULL`,
        `ALTER TABLE \`students\` ADD COLUMN IF NOT EXISTS \`password\` VARCHAR(255) NULL`
      ];
      for (const colQuery of stdCols) {
        try { await p.query(colQuery); } catch {}
      }
    } catch (err) {
      console.error('ensureAnalyticsTables students table error:', err);
    }

    // 8. Wholesale Suppliers table in Hostinger MySQL
    try {
      await p.query(`
        CREATE TABLE IF NOT EXISTS \`lms_suppliers\` (
          \`id\` VARCHAR(191) NOT NULL,
          \`name\` VARCHAR(255) NOT NULL,
          \`category\` VARCHAR(191) NULL,
          \`country\` VARCHAR(100) NULL,
          \`city\` VARCHAR(100) NULL,
          \`phone\` VARCHAR(100) NULL,
          \`whatsapp_link\` VARCHAR(255) NULL,
          \`min_order\` VARCHAR(100) NULL,
          \`delivery_time\` VARCHAR(100) NULL,
          \`cod_supported\` TINYINT(1) DEFAULT 1,
          \`notes\` TEXT NULL,
          \`updated_at\` DATETIME NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
    } catch (err) {
      console.error('ensureAnalyticsTables lms_suppliers error:', err);
    }

    // 9. Support Tickets table in Hostinger MySQL
    try {
      await p.query(`
        CREATE TABLE IF NOT EXISTS \`support_tickets\` (
          \`id\` VARCHAR(191) NOT NULL,
          \`name\` VARCHAR(255) NOT NULL,
          \`email\` VARCHAR(191) NOT NULL,
          \`phone\` VARCHAR(100) NULL,
          \`topic\` VARCHAR(191) NULL,
          \`message\` TEXT NOT NULL,
          \`status\` VARCHAR(50) DEFAULT 'open',
          \`created_at\` VARCHAR(100) NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
    } catch (err) {
      console.error('ensureAnalyticsTables support_tickets error:', err);
    }

    // Auto-seed initial students if empty
    try {
      const [stdRows]: any = await p.query(`SELECT COUNT(*) as count FROM students`);
      if (Number(stdRows?.[0]?.count || 0) === 0) {
        for (const s of initialStudents) {
          await p.query(
            `INSERT IGNORE INTO students (id, name, email, phone, city, password, is_active, enrolled_at, completed_lessons_json, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [s.id, s.name, s.email, s.phone, s.city, s.password, s.isActive ? 1 : 0, s.enrolledAt, JSON.stringify(s.completedLessons || [])]
          );
        }
      }
    } catch {}

    // Auto-seed initial enrollments if empty
    try {
      const [enrRows]: any = await p.query(`SELECT COUNT(*) as count FROM enrollments`);
      if (Number(enrRows?.[0]?.count || 0) === 0) {
        for (const e of initialEnrollments) {
          await p.query(
            `INSERT IGNORE INTO enrollments (id, tracking_code, student_id, name, email, phone, city, payment_method, transaction_id, where_heard, receipt_url, amount, status, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [e.id, e.trackingCode, e.studentId, e.name, e.email, e.phone, e.city, e.paymentMethod, e.transactionId, e.whereHeard || '', e.receiptUrl || '', e.amount, e.status, e.createdAt]
          );
        }
      }
    } catch {}

    // Auto-seed initial suppliers if empty
    try {
      const [supRows]: any = await p.query(`SELECT COUNT(*) as count FROM lms_suppliers`);
      if (Number(supRows?.[0]?.count || 0) === 0) {
        for (const sup of initialSuppliers) {
          await p.query(
            `INSERT IGNORE INTO lms_suppliers (id, name, category, country, city, phone, whatsapp_link, min_order, delivery_time, cod_supported, notes, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [sup.id, sup.name, sup.category, sup.country, sup.city, sup.phone, sup.whatsappLink, sup.minOrder, sup.deliveryTime, sup.codSupported ? 1 : 0, sup.notes]
          );
        }
      }
    } catch {}
    tablesInitialized = true;
    return true;
  } catch (error) {
    console.error('ensureAnalyticsTables outer error:', error);
    return false;
  }
}

/**
 * Fetches CMS settings from Hostinger MySQL.
 */
export async function mysqlGetCmsSettings(): Promise<any | null> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const [rows]: any = await pool.query(
        `SELECT value_json FROM cms_settings WHERE \`key\` = 'main_cms' LIMIT 1`
      );
      if (Array.isArray(rows) && rows.length > 0 && rows[0]?.value_json) {
        const raw = rows[0].value_json;
        return typeof raw === 'string' ? JSON.parse(raw) : raw;
      }
    } catch {
      // Fall through
    }
  }
  return null;
}

/**
 * Saves CMS settings into Hostinger MySQL.
 */
export async function mysqlSaveCmsSettings(data: any): Promise<boolean> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);
      await pool.query(
        `INSERT INTO cms_settings (\`key\`, \`value_json\`, \`updated_at\`)
         VALUES ('main_cms', ?, NOW())
         ON DUPLICATE KEY UPDATE \`value_json\` = VALUES(\`value_json\`), \`updated_at\` = NOW()`,
        [jsonStr]
      );
      return true;
    } catch (err) {
      console.error('MySQL CMS save error:', err);
    }
  }
  return false;
}

/**
 * Records or updates an active visitor in Hostinger MySQL.
 */
export async function recordVisitorPing(visitorId: string, page: string): Promise<void> {
  const now = Date.now();
  const hasTables = await ensureAnalyticsTables();

  if (hasTables && pool) {
    try {
      await pool.query(
        `INSERT INTO active_visitors (visitor_id, page, last_seen)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE page = VALUES(page), last_seen = VALUES(last_seen)`,
        [visitorId, page.slice(0, 250), now]
      );

      // Auto-cleanup stale visitors older than 25 seconds
      const cutoff = now - 25000;
      await pool.query(`DELETE FROM active_visitors WHERE last_seen < ?`, [cutoff]);
      return;
    } catch {
      // Fall through to memory
    }
  }

  // In-memory fallback
  inMemoryVisitors.set(visitorId, { visitorId, page, lastSeen: now });
  const cutoff = now - 25000;
  for (const [key, item] of inMemoryVisitors.entries()) {
    if (item.lastSeen < cutoff) inMemoryVisitors.delete(key);
  }
}

/**
 * Records a page session hit and aggregates into analytics_daily.
 * - Deduplicates sessions so refreshing the page does not falsely inflate session count.
 * - Tracks which page (home, enrollment, lms, etc.) was viewed.
 */
export async function recordSessionHit(sessionId: string, page: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const cleanPage = (page || '/').toLowerCase();
  const hasTables = await ensureAnalyticsTables();

  if (hasTables && pool) {
    try {
      // 1. Check if this is a new unique session today
      let isNewSession = false;
      try {
        const [insertRes]: any = await pool.query(
          `INSERT IGNORE INTO analytics_sessions (session_id, session_date) VALUES (?, ?)`,
          [sessionId, today]
        );
        isNewSession = insertRes?.affectedRows > 0;
      } catch {
        // Ignore session insert error
      }

      // 2. Classify page view
      const isHome = cleanPage === '/' || cleanPage === '';
      const isEnrollment = cleanPage.startsWith('/enrollment') || cleanPage.startsWith('/checkout');
      const isLms = cleanPage.startsWith('/lms') || cleanPage.startsWith('/login');

      // 3. Upsert into analytics_daily
      await pool.query(
        `INSERT INTO analytics_daily (
          report_date, total_sessions, unique_visitors, home_views, enrollment_views, lms_views, other_views
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?
        ) ON DUPLICATE KEY UPDATE
          total_sessions = total_sessions + ?,
          unique_visitors = unique_visitors + ?,
          home_views = home_views + ?,
          enrollment_views = enrollment_views + ?,
          lms_views = lms_views + ?,
          other_views = other_views + ?`,
        [
          today,
          isNewSession ? 1 : 0,
          isNewSession ? 1 : 0,
          isHome ? 1 : 0,
          isEnrollment ? 1 : 0,
          isLms ? 1 : 0,
          !isHome && !isEnrollment && !isLms ? 1 : 0,
          // ON DUPLICATE updates:
          isNewSession ? 1 : 0,
          isNewSession ? 1 : 0,
          isHome ? 1 : 0,
          isEnrollment ? 1 : 0,
          isLms ? 1 : 0,
          !isHome && !isEnrollment && !isLms ? 1 : 0,
        ]
      );

      // 4. Auto-clean sessions table older than 2 days (keeps table tiny < 50 KB)
      await pool.query(
        `DELETE FROM analytics_sessions WHERE session_date < DATE_SUB(CURDATE(), INTERVAL 2 DAY)`
      );
      return;
    } catch {
      // Fall through to memory
    }
  }

  // In-memory fallback
  const isNew = !inMemorySessions.has(sessionId);
  if (isNew) {
    inMemorySessions.add(sessionId);
    inMemoryDaily.totalSessions++;
    inMemoryDaily.uniqueVisitors++;
  }
  if (cleanPage === '/') inMemoryDaily.homeViews++;
  else if (cleanPage.startsWith('/enrollment')) inMemoryDaily.enrollmentViews++;
  else if (cleanPage.startsWith('/lms')) inMemoryDaily.lmsViews++;
  else inMemoryDaily.otherViews++;
}

/**
 * Deletes a visitor on tab close or navigation away.
 */
export async function removeVisitor(visitorId: string): Promise<void> {
  inMemoryVisitors.delete(visitorId);
  try {
    if (pool) {
      await pool.query(`DELETE FROM active_visitors WHERE visitor_id = ?`, [visitorId]);
    }
  } catch {
    // Ignore error
  }
}

/**
 * Returns current live visitor count and active pages.
 */
export async function getLiveVisitors(): Promise<{
  activeCount: number;
  topPages: { path: string; activeUsers: number }[];
}> {
  const now = Date.now();
  const cutoff = now - 25000;
  const hasTables = await ensureAnalyticsTables();

  if (hasTables && pool) {
    try {
      const [countRows]: any = await pool.query(
        `SELECT COUNT(*) as activeCount FROM active_visitors WHERE last_seen >= ?`,
        [cutoff]
      );

      const [pageRows]: any = await pool.query(
        `SELECT page, COUNT(*) as activeUsers 
         FROM active_visitors 
         WHERE last_seen >= ? 
         GROUP BY page 
         ORDER BY activeUsers DESC 
         LIMIT 5`,
        [cutoff]
      );

      const activeCount = Number(countRows[0]?.activeCount || 0);
      const topPages = (pageRows || []).map((r: any) => ({
        path: r.page || '/',
        activeUsers: Number(r.activeUsers || 1),
      }));

      return { activeCount, topPages };
    } catch {
      // Fall through to memory
    }
  }

  // In-memory fallback
  const pagesMap: Record<string, number> = {};
  let activeCount = 0;

  for (const [_, item] of inMemoryVisitors.entries()) {
    if (item.lastSeen >= cutoff) {
      activeCount++;
      pagesMap[item.page] = (pagesMap[item.page] || 0) + 1;
    }
  }

  const topPages = Object.entries(pagesMap)
    .map(([path, users]) => ({ path, activeUsers: users }))
    .sort((a, b) => b.activeUsers - a.activeUsers)
    .slice(0, 5);

  return { activeCount, topPages };
}

/**
 * Returns today's Shopify-style daily aggregate analytics from Hostinger MySQL.
 */
export async function getTodayAnalytics(): Promise<{
  date: string;
  totalSessions: number;
  uniqueVisitors: number;
  homeViews: number;
  enrollmentViews: number;
  checkoutViews: number;
  lmsViews: number;
  enrollmentRate: string;
}> {
  const today = new Date().toISOString().slice(0, 10);
  const hasTables = await ensureAnalyticsTables();

  if (hasTables && pool) {
    try {
      const [rows]: any = await pool.query(
        `SELECT * FROM analytics_daily WHERE report_date = ? LIMIT 1`,
        [today]
      );

      if (Array.isArray(rows) && rows.length > 0) {
        const r = rows[0];
        const totalSessions = Number(r.total_sessions || 0);
        const enrollmentViews = Number(r.enrollment_views || 0);
        const rate = totalSessions > 0
          ? `${((enrollmentViews / totalSessions) * 100).toFixed(1)}%`
          : '0.0%';

        return {
          date: today,
          totalSessions,
          uniqueVisitors: Number(r.unique_visitors || 0),
          homeViews: Number(r.home_views || 0),
          enrollmentViews,
          checkoutViews: enrollmentViews,
          lmsViews: Number(r.lms_views || 0),
          enrollmentRate: rate,
        };
      }
    } catch {
      // Fall through to memory
    }
  }

  // In-memory fallback
  const rate = inMemoryDaily.totalSessions > 0
    ? `${((inMemoryDaily.enrollmentViews / inMemoryDaily.totalSessions) * 100).toFixed(1)}%`
    : '0.0%';

  return {
    date: inMemoryDaily.date,
    totalSessions: inMemoryDaily.totalSessions,
    uniqueVisitors: inMemoryDaily.uniqueVisitors,
    homeViews: inMemoryDaily.homeViews,
    enrollmentViews: inMemoryDaily.enrollmentViews,
    checkoutViews: inMemoryDaily.enrollmentViews,
    lmsViews: inMemoryDaily.lmsViews,
    enrollmentRate: rate,
  };
}

/**
 * Returns cumulative analytics for the last 30 days from Hostinger MySQL.
 */
export async function getLast30DaysAnalytics(): Promise<{
  totalSessions: number;
  uniqueVisitors: number;
  homeViews: number;
  checkoutViews: number;
  lmsViews: number;
}> {
  const hasTables = await ensureAnalyticsTables();

  if (hasTables && pool) {
    try {
      const [rows]: any = await pool.query(
        `SELECT 
          COALESCE(SUM(total_sessions), 0) as totalSessions,
          COALESCE(SUM(unique_visitors), 0) as uniqueVisitors,
          COALESCE(SUM(home_views), 0) as homeViews,
          COALESCE(SUM(enrollment_views), 0) as checkoutViews,
          COALESCE(SUM(lms_views), 0) as lmsViews
        FROM analytics_daily 
        WHERE report_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`
      );

      if (Array.isArray(rows) && rows.length > 0) {
        const r = rows[0];
        return {
          totalSessions: Number(r.totalSessions || 0),
          uniqueVisitors: Number(r.uniqueVisitors || 0),
          homeViews: Number(r.homeViews || 0),
          checkoutViews: Number(r.checkoutViews || 0),
          lmsViews: Number(r.lmsViews || 0),
        };
      }
    } catch {
      // Fall through to memory
    }
  }

  // In-memory fallback
  return {
    totalSessions: inMemoryDaily.totalSessions,
    uniqueVisitors: inMemoryDaily.uniqueVisitors,
    homeViews: inMemoryDaily.homeViews,
    checkoutViews: inMemoryDaily.enrollmentViews,
    lmsViews: inMemoryDaily.lmsViews,
  };
}

/**
 * Fetches all LMS modules from Hostinger MySQL.
 * Returns empty array [] if admin deleted all modules (avoids resurrection).
 */
export async function mysqlGetModules(): Promise<Module[] | null> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const [rows]: any = await pool.query(
        `SELECT id, title, duration, description, lessons_json FROM lms_modules ORDER BY id ASC`
      );
      if (Array.isArray(rows)) {
        return rows.map((r: any) => {
          let lessons: Lesson[] = [];
          if (r.lessons_json) {
            try {
              lessons = typeof r.lessons_json === 'string' ? JSON.parse(r.lessons_json) : r.lessons_json;
            } catch {
              lessons = [];
            }
          }
          return {
            id: Number(r.id),
            title: r.title || '',
            duration: r.duration || '',
            description: r.description || '',
            lessons: Array.isArray(lessons) ? lessons : [],
          };
        });
      }
    } catch (err) {
      console.error('mysqlGetModules error:', err);
    }
  }
  return null;
}

/**
 * Inserts a new LMS module into Hostinger MySQL.
 */
export async function mysqlAddModule(mod: Module): Promise<Module> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    let newId = mod.id;
    if (!newId || newId <= 0) {
      try {
        const [maxRows]: any = await pool.query(`SELECT COALESCE(MAX(id), 0) + 1 as nextId FROM lms_modules`);
        if (Array.isArray(maxRows) && maxRows[0]?.nextId) {
          newId = Number(maxRows[0].nextId);
        } else {
          newId = Date.now();
        }
      } catch {
        newId = Date.now();
      }
    }

    const lessonsJson = JSON.stringify(mod.lessons || []);
    await pool.query(
      `INSERT INTO lms_modules (\`id\`, \`title\`, \`duration\`, \`description\`, \`lessons_json\`, \`updated_at\`)
       VALUES (?, ?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE 
         \`title\` = VALUES(\`title\`),
         \`duration\` = VALUES(\`duration\`),
         \`description\` = VALUES(\`description\`),
         \`lessons_json\` = VALUES(\`lessons_json\`),
         \`updated_at\` = NOW()`,
      [newId, mod.title || '', mod.duration || '', mod.description || '', lessonsJson]
    );

    return { ...mod, id: newId };
  }
  return mod;
}

/**
 * Updates an existing LMS module in Hostinger MySQL.
 */
export async function mysqlUpdateModule(id: number, patch: Partial<Module>): Promise<Module | null> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const [rows]: any = await pool.query(
        `SELECT id, title, duration, description, lessons_json FROM lms_modules WHERE id = ? LIMIT 1`,
        [id]
      );
      if (!Array.isArray(rows) || rows.length === 0) {
        return null;
      }
      const existing = rows[0];
      let existingLessons: Lesson[] = [];
      try {
        existingLessons = typeof existing.lessons_json === 'string' ? JSON.parse(existing.lessons_json) : (existing.lessons_json || []);
      } catch {
        existingLessons = [];
      }

      const updatedTitle = patch.title !== undefined ? patch.title : existing.title;
      const updatedDuration = patch.duration !== undefined ? patch.duration : existing.duration;
      const updatedDesc = patch.description !== undefined ? patch.description : existing.description;
      const updatedLessons = patch.lessons !== undefined ? patch.lessons : existingLessons;

      await pool.query(
        `UPDATE lms_modules SET
           \`title\` = ?,
           \`duration\` = ?,
           \`description\` = ?,
           \`lessons_json\` = ?,
           \`updated_at\` = NOW()
         WHERE \`id\` = ?`,
        [updatedTitle || '', updatedDuration || '', updatedDesc || '', JSON.stringify(updatedLessons || []), id]
      );

      return {
        id: Number(id),
        title: updatedTitle,
        duration: updatedDuration,
        description: updatedDesc,
        lessons: updatedLessons,
      };
    } catch (err) {
      console.error('mysqlUpdateModule error:', err);
    }
  }
  return null;
}

/**
 * Permanently deletes a single module from Hostinger MySQL.
 */
export async function mysqlDeleteModule(id: number): Promise<boolean> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      await pool.query(`DELETE FROM lms_modules WHERE id = ?`, [id]);
      return true;
    } catch (err) {
      console.error('mysqlDeleteModule error:', err);
    }
  }
  return false;
}

/**
 * Permanently deletes multiple modules from Hostinger MySQL.
 */
export async function mysqlBulkDeleteModules(ids: number[]): Promise<boolean> {
  if (!ids || ids.length === 0) return true;
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const numericIds = ids.map(id => Number(id)).filter(id => !isNaN(id) && id > 0);
      if (numericIds.length === 0) return true;
      const idList = numericIds.join(',');
      await pool.query(`DELETE FROM lms_modules WHERE id IN (${idList})`);
      return true;
    } catch (err) {
      console.error('mysqlBulkDeleteModules error:', err);
    }

  }
  return false;
}

// =============================================================================
// ENROLLMENTS (100% NATIVE HOSTINGER MYSQL)
// =============================================================================

export async function mysqlGetEnrollments(): Promise<Enrollment[]> {
  await ensureAnalyticsTables();
  const p = getMysqlPool();
  try {
    const [rows]: any = await p.query(
      `SELECT id, tracking_code, student_id, name, email, phone, city, payment_method, transaction_id, where_heard, receipt_url, amount, status, password, created_at 
       FROM enrollments 
       ORDER BY created_at DESC`
    );
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map((r: any) => ({
        id: r.id,
        trackingCode: r.tracking_code || '',
        studentId: r.student_id || '',
        name: r.name || '',
        email: r.email || '',
        phone: r.phone || '',
        city: r.city || '',
        paymentMethod: r.payment_method || '',
        transactionId: r.transaction_id || '',
        whereHeard: r.where_heard || '',
        receiptUrl: r.receipt_url || '',
        amount: r.amount || '',
        status: (r.status as 'pending' | 'approved' | 'rejected') || 'pending',
        password: r.password || '',
        createdAt: r.created_at || new Date().toISOString()
      }));
    }
  } catch (err) {
    console.error('mysqlGetEnrollments error:', err);
  }
  return initialEnrollments;
}

export async function mysqlAddEnrollment(enr: Enrollment): Promise<Enrollment> {
  await ensureAnalyticsTables();
  const p = getMysqlPool();

  const enrId = enr.id || `enr_${Date.now()}`;
  const trackingCode = enr.trackingCode || `SAMI-ENR-${Math.floor(10000 + Math.random() * 90000)}`;
  const createdAt = enr.createdAt || new Date().toISOString();
  const password = enr.password || '';

  // Cap receipt URL to ~400KB to ensure it never exceeds MySQL max_allowed_packet
  let safeReceipt = enr.receiptUrl || '';
  if (safeReceipt.length > 400000) {
    safeReceipt = safeReceipt.slice(0, 400000);
  }

  try {
    await p.query(
      `INSERT INTO enrollments (
        id, tracking_code, student_id, name, email, phone, city, payment_method, transaction_id, where_heard, receipt_url, amount, status, password, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        name = VALUES(name),
        phone = VALUES(phone),
        city = VALUES(city),
        payment_method = VALUES(payment_method),
        transaction_id = VALUES(transaction_id),
        receipt_url = VALUES(receipt_url),
        status = VALUES(status),
        password = VALUES(password)`,
      [
        enrId,
        trackingCode,
        enr.studentId || '',
        enr.name,
        enr.email,
        enr.phone,
        enr.city || '',
        enr.paymentMethod || 'Easypaisa',
        enr.transactionId || 'Pending Verification',
        enr.whereHeard || 'TikTok',
        safeReceipt,
        enr.amount || 'PKR 3,799',
        enr.status || 'pending',
        password,
        createdAt
      ]
    );

    return {
      ...enr,
      id: enrId,
      trackingCode,
      receiptUrl: safeReceipt,
      createdAt,
      password
    };
  } catch (err) {
    console.error('mysqlAddEnrollment primary error:', err);
    // If packet size or receipt was the cause, safely retry insert without receipt_url
    try {
      await p.query(
        `INSERT INTO enrollments (
          id, tracking_code, student_id, name, email, phone, city, payment_method, transaction_id, where_heard, amount, status, password, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          name = VALUES(name),
          phone = VALUES(phone),
          city = VALUES(city),
          payment_method = VALUES(payment_method),
          transaction_id = VALUES(transaction_id),
          status = VALUES(status),
          password = VALUES(password)`,
        [
          enrId,
          trackingCode,
          enr.studentId || '',
          enr.name,
          enr.email,
          enr.phone,
          enr.city || '',
          enr.paymentMethod || 'Easypaisa',
          enr.transactionId || 'Pending Verification',
          enr.whereHeard || 'TikTok',
          enr.amount || 'PKR 3,799',
          enr.status || 'pending',
          password,
          createdAt
        ]
      );
      return {
        ...enr,
        id: enrId,
        trackingCode,
        receiptUrl: '',
        createdAt,
        password
      };
    } catch (retryErr) {
      console.error('mysqlAddEnrollment retry failed:', retryErr);
      throw retryErr;
    }
  }
}

export async function mysqlUpdateEnrollmentStatus(
  id: string, 
  status: 'approved' | 'rejected', 
  customPassword?: string
): Promise<{ enrollment: Enrollment; password?: string } | null> {
  await ensureAnalyticsTables();
  const p = getMysqlPool();
  try {
    const cleanId = (id || '').trim();
    const [rows]: any = await p.query(
      `SELECT * FROM enrollments WHERE id = ? OR tracking_code = ? OR student_id = ? OR LOWER(email) = LOWER(?) LIMIT 1`,
      [cleanId, cleanId, cleanId, cleanId]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      const enr = rows[0];

      let pass = customPassword || enr.password;
      if (!pass || pass === 'studentpass2026') {
        pass = Math.floor(10000000 + Math.random() * 90000000).toString();
      }

      await p.query(
        `UPDATE enrollments SET status = ?, password = ? WHERE id = ?`,
        [status, pass, enr.id]
      );

      // If approved, activate or create student in Hostinger MySQL
      if (status === 'approved' && enr.email) {
        await p.query(
          `INSERT INTO students (id, name, email, phone, city, password, is_active, enrolled_at, completed_lessons_json, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, 1, ?, '[]', NOW())
           ON DUPLICATE KEY UPDATE is_active = 1, password = VALUES(password), updated_at = NOW()`,
          [
            enr.student_id || `std_${Date.now()}`,
            enr.name,
            enr.email,
            enr.phone,
            enr.city || 'Pakistan',
            pass,
            new Date().toISOString().split('T')[0]
          ]
        );
      }

      // If rejected, immediately deactivate student in Hostinger MySQL so LMS kicks them out in real time
      if (status === 'rejected' && enr.email) {
        await p.query(
          `UPDATE students SET is_active = 0, updated_at = NOW() WHERE LOWER(email) = LOWER(?) OR id = ?`,
          [enr.email.trim(), enr.student_id || enr.id]
        );
      }

      const updatedEnr: Enrollment = {
        id: enr.id,
        trackingCode: enr.tracking_code,
        studentId: enr.student_id,
        name: enr.name,
        email: enr.email,
        phone: enr.phone,
        city: enr.city,
        paymentMethod: enr.payment_method,
        transactionId: enr.transaction_id,
        whereHeard: enr.where_heard,
        receiptUrl: enr.receipt_url,
        amount: enr.amount,
        status,
        password: pass,
        createdAt: enr.created_at
      };

      return { enrollment: updatedEnr, password: pass };
    }

    // Direct fallback for student ID / Email if enrollment row not found
    const [stdRows]: any = await p.query(
      `SELECT * FROM students WHERE id = ? OR LOWER(email) = LOWER(?) LIMIT 1`,
      [cleanId, cleanId]
    );
    if (Array.isArray(stdRows) && stdRows.length > 0) {
      const std = stdRows[0];
      const newActive = status === 'approved' ? 1 : 0;
      await p.query(
        `UPDATE students SET is_active = ?, updated_at = NOW() WHERE id = ?`,
        [newActive, std.id]
      );
      const mockEnr: Enrollment = {
        id: `enr_${std.id}`,
        trackingCode: `SAMI-ENR-${std.id.slice(-5)}`,
        studentId: std.id,
        name: std.name,
        email: std.email,
        phone: std.phone || '',
        city: std.city || '',
        paymentMethod: 'Direct',
        transactionId: 'VERIFIED',
        amount: 'PKR 3,799',
        status,
        password: std.password || 'studentpass2026',
        createdAt: new Date().toISOString()
      };
      return { enrollment: mockEnr, password: std.password };
    }
  } catch (err) {
    console.error('mysqlUpdateEnrollmentStatus error:', err);
  }
  return null;
}

export async function mysqlDeleteEnrollment(id: string): Promise<boolean> {
  await ensureAnalyticsTables();
  const p = getMysqlPool();
  try {
    await p.query(`DELETE FROM enrollments WHERE id = ? OR tracking_code = ?`, [id, id]);
    return true;
  } catch (err) {
    console.error('mysqlDeleteEnrollment error:', err);
  }
  return false;
}

// =============================================================================
// STUDENTS (100% NATIVE HOSTINGER MYSQL)
// =============================================================================

export async function mysqlGetStudents(): Promise<Student[]> {
  await ensureAnalyticsTables();
  const p = getMysqlPool();
  try {
    const [rows]: any = await p.query(
      `SELECT id, name, email, phone, city, password, is_active, enrolled_at, completed_lessons_json, last_login, strike_count 
       FROM students 
       ORDER BY enrolled_at DESC`
    );
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name || '',
        email: r.email || '',
        phone: r.phone || '',
        city: r.city || '',
        password: r.password || '',
        isActive: Boolean(r.is_active),
        enrolledAt: r.enrolled_at || '',
        completedLessons: typeof r.completed_lessons_json === 'string' ? JSON.parse(r.completed_lessons_json || '[]') : (r.completed_lessons_json || []),
        lastLogin: r.last_login ? new Date(r.last_login).toISOString() : undefined,
        strikeCount: Number(r.strike_count || 0)
      }));
    }
  } catch (err) {
    console.error('mysqlGetStudents error:', err);
  }
  return initialStudents;
}

export async function mysqlGetStudentByEmail(email: string): Promise<Student | null> {
  if (!email) return null;
  await ensureAnalyticsTables();
  const p = getMysqlPool();
  try {
    const [rows]: any = await p.query(
      `SELECT id, name, email, phone, city, password, is_active, enrolled_at, completed_lessons_json, last_login, strike_count 
       FROM students 
       WHERE LOWER(email) = LOWER(?) 
       LIMIT 1`,
      [email.trim()]
    );
    if (Array.isArray(rows) && rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        name: r.name || '',
        email: r.email || '',
        phone: r.phone || '',
        city: r.city || '',
        password: r.password || '',
        isActive: Boolean(r.is_active),
        enrolledAt: r.enrolled_at || '',
        completedLessons: typeof r.completed_lessons_json === 'string' ? JSON.parse(r.completed_lessons_json || '[]') : (r.completed_lessons_json || []),
        lastLogin: r.last_login ? new Date(r.last_login).toISOString() : undefined,
        strikeCount: Number(r.strike_count || 0)
      };
    }
  } catch (err) {
    console.error('mysqlGetStudentByEmail error:', err);
  }
  return null;
}

export async function mysqlAddStudent(student: Student): Promise<Student> {
  await ensureAnalyticsTables();
  const p = getMysqlPool();
  try {
    await p.query(
      `INSERT INTO students (
        id, name, email, phone, city, password, is_active, enrolled_at, completed_lessons_json, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE 
        name = VALUES(name),
        phone = VALUES(phone),
        city = VALUES(city),
        password = VALUES(password),
        is_active = VALUES(is_active),
        completed_lessons_json = VALUES(completed_lessons_json),
        updated_at = NOW()`,
      [
        student.id,
        student.name,
        student.email,
        student.phone,
        student.city || '',
        student.password,
        student.isActive ? 1 : 0,
        student.enrolledAt || new Date().toISOString().split('T')[0],
        JSON.stringify(student.completedLessons || [])
      ]
    );
    return student;
  } catch (err) {
    console.error('mysqlAddStudent error:', err);
  }
  return student;
}

export async function mysqlUpdateStudent(id: string, patch: Partial<Student>): Promise<Student | null> {
  await ensureAnalyticsTables();
  const p = getMysqlPool();
  try {
    const [rows]: any = await p.query(`SELECT * FROM students WHERE id = ? OR LOWER(email) = LOWER(?) LIMIT 1`, [id, id]);
    if (!Array.isArray(rows) || rows.length === 0) return null;
    const current = rows[0];

    const name = patch.name !== undefined ? patch.name : current.name;
    const email = patch.email !== undefined ? patch.email : current.email;
    const phone = patch.phone !== undefined ? patch.phone : current.phone;
    const city = patch.city !== undefined ? patch.city : current.city;
    const password = patch.password !== undefined ? patch.password : current.password;
    const isActive = patch.isActive !== undefined ? (patch.isActive ? 1 : 0) : current.is_active;
    const completedLessons = patch.completedLessons !== undefined ? JSON.stringify(patch.completedLessons) : current.completed_lessons_json;
    const lastLogin = patch.lastLogin !== undefined ? patch.lastLogin : current.last_login;
    const strikeCount = patch.strikeCount !== undefined ? patch.strikeCount : current.strike_count;

    await p.query(
      `UPDATE students SET 
        name = ?, email = ?, phone = ?, city = ?, password = ?, is_active = ?, completed_lessons_json = ?, last_login = ?, strike_count = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, email, phone, city, password, isActive, completedLessons, lastLogin, strikeCount, current.id]
    );

    return {
      id: current.id,
      name,
      email,
      phone,
      city,
      password,
      isActive: Boolean(isActive),
      enrolledAt: current.enrolled_at,
      completedLessons: typeof completedLessons === 'string' ? JSON.parse(completedLessons) : completedLessons,
      lastLogin: lastLogin ? new Date(lastLogin).toISOString() : undefined,
      strikeCount
    };
  } catch (err) {
    console.error('mysqlUpdateStudent error:', err);
  }
  return null;
}

export async function mysqlDeleteStudent(idOrEmail: string): Promise<boolean> {
  await ensureAnalyticsTables();
  const p = getMysqlPool();
  try {
    await p.query(`DELETE FROM students WHERE id = ? OR LOWER(email) = LOWER(?)`, [idOrEmail, idOrEmail]);
    await p.query(`DELETE FROM enrollments WHERE student_id = ? OR LOWER(email) = LOWER(?)`, [idOrEmail, idOrEmail]);
    return true;
  } catch (err) {
    console.error('mysqlDeleteStudent error:', err);
  }
  return false;
}

export async function mysqlResetStudentPassword(
  identifier: string, 
  newPassword?: string,
  fallbackEmail?: string
): Promise<{ email: string; newPassword: string } | null> {
  await ensureAnalyticsTables();
  const p = getMysqlPool();
  try {
    const pass = newPassword || Math.floor(10000000 + Math.random() * 90000000).toString();
    const cleanIdent = String(identifier || '').trim();
    const cleanEmail = String(fallbackEmail || '').trim().toLowerCase();

    let targetEmail = cleanEmail;
    let targetStudentId = '';
    let studentName = '';
    let studentPhone = '';
    let studentCity = '';

    // 1. Check students table
    const [stdRows]: any = await p.query(
      `SELECT id, name, email, phone, city FROM students WHERE id = ? OR LOWER(email) = LOWER(?) ${cleanEmail ? 'OR LOWER(email) = LOWER(?)' : ''} LIMIT 1`,
      cleanEmail ? [cleanIdent, cleanIdent, cleanEmail] : [cleanIdent, cleanIdent]
    );

    if (Array.isArray(stdRows) && stdRows.length > 0) {
      targetEmail = (stdRows[0].email || targetEmail).toLowerCase().trim();
      targetStudentId = stdRows[0].id;
      studentName = stdRows[0].name || '';
      studentPhone = stdRows[0].phone || '';
      studentCity = stdRows[0].city || '';
    }

    // 2. Check enrollments table
    const [enrRows]: any = await p.query(
      `SELECT id, student_id, name, email, phone, city FROM enrollments WHERE id = ? OR tracking_code = ? OR LOWER(email) = LOWER(?) ${targetEmail ? 'OR LOWER(email) = LOWER(?)' : ''} LIMIT 1`,
      targetEmail ? [cleanIdent, cleanIdent, cleanIdent, targetEmail] : [cleanIdent, cleanIdent, cleanIdent]
    );

    if (Array.isArray(enrRows) && enrRows.length > 0) {
      if (!targetEmail) targetEmail = (enrRows[0].email || '').toLowerCase().trim();
      if (!targetStudentId && enrRows[0].student_id) targetStudentId = enrRows[0].student_id;
      if (!studentName) studentName = enrRows[0].name || '';
      if (!studentPhone) studentPhone = enrRows[0].phone || '';
      if (!studentCity) studentCity = enrRows[0].city || '';
    }

    if (!targetEmail && !targetStudentId) {
      console.warn('mysqlResetStudentPassword: no record found for', identifier, fallbackEmail);
      return null;
    }

    // 3. Synchronize `students` table (guarantees LMS login works immediately!)
    const [updateStdRes]: any = await p.query(
      `UPDATE students SET password = ?, is_active = 1, updated_at = NOW() WHERE LOWER(email) = LOWER(?) OR id = ?`,
      [pass, targetEmail, targetStudentId || 'NONE']
    );

    // If student record didn't exist in students table yet, auto-provision it
    if (updateStdRes.affectedRows === 0 && targetEmail) {
      const newStdId = targetStudentId || `std_${Date.now()}`;
      await p.query(
        `INSERT INTO students (id, name, email, phone, city, is_active, password, enrolled_at, completed_lessons_json, updated_at)
         VALUES (?, ?, ?, ?, ?, 1, ?, NOW(), '[]', NOW())
         ON DUPLICATE KEY UPDATE password = VALUES(password), is_active = 1, updated_at = NOW()`,
        [newStdId, studentName || targetEmail.split('@')[0], targetEmail, studentPhone, studentCity, pass]
      );
    }

    // 4. Synchronize `enrollments` table (guarantees Admin panel displays the new password!)
    await p.query(
      `UPDATE enrollments SET password = ? WHERE LOWER(email) = LOWER(?) OR student_id = ? OR id = ? OR tracking_code = ?`,
      [pass, targetEmail, targetStudentId || 'NONE', cleanIdent, cleanIdent]
    );

    return { email: targetEmail, newPassword: pass };
  } catch (err) {
    console.error('mysqlResetStudentPassword error:', err);
  }
  return null;
}

// =============================================================================
// WHOLESALE SUPPLIERS (100% NATIVE HOSTINGER MYSQL)
// =============================================================================

export async function mysqlGetSuppliers(): Promise<Supplier[]> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const [rows]: any = await pool.query(`SELECT * FROM lms_suppliers ORDER BY updated_at DESC`);
      if (Array.isArray(rows)) {
        return rows.map((r: any) => ({
          id: r.id,
          name: r.name,
          category: r.category || '',
          country: r.country || 'UAE',
          city: r.city || '',
          phone: r.phone || '',
          whatsappLink: r.whatsapp_link || '',
          minOrder: r.min_order || '',
          deliveryTime: r.delivery_time || '',
          codSupported: Boolean(r.cod_supported),
          notes: r.notes || ''
        }));
      }
    } catch (err) {
      console.error('mysqlGetSuppliers error:', err);
    }
  }
  return initialSuppliers;
}

export async function mysqlAddSupplier(supplier: Supplier): Promise<Supplier> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      await pool.query(
        `INSERT INTO lms_suppliers (
          id, name, category, country, city, phone, whatsapp_link, min_order, delivery_time, cod_supported, notes, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE 
          name = VALUES(name),
          category = VALUES(category),
          country = VALUES(country),
          city = VALUES(city),
          phone = VALUES(phone),
          whatsapp_link = VALUES(whatsapp_link),
          min_order = VALUES(min_order),
          delivery_time = VALUES(delivery_time),
          cod_supported = VALUES(cod_supported),
          notes = VALUES(notes),
          updated_at = NOW()`,
        [
          supplier.id,
          supplier.name,
          supplier.category,
          supplier.country,
          supplier.city,
          supplier.phone,
          supplier.whatsappLink,
          supplier.minOrder,
          supplier.deliveryTime,
          supplier.codSupported ? 1 : 0,
          supplier.notes
        ]
      );
      return supplier;
    } catch (err) {
      console.error('mysqlAddSupplier error:', err);
    }
  }
  return supplier;
}

export async function mysqlDeleteSupplier(id: string): Promise<boolean> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      await pool.query(`DELETE FROM lms_suppliers WHERE id = ?`, [id]);
      return true;
    } catch (err) {
      console.error('mysqlDeleteSupplier error:', err);
    }
  }
  return false;
}

// =============================================================================
// SUPPORT TICKETS (100% NATIVE HOSTINGER MYSQL)
// =============================================================================

export async function mysqlGetTickets(): Promise<SupportTicket[]> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const [rows]: any = await pool.query(`SELECT * FROM support_tickets ORDER BY created_at DESC`);
      if (Array.isArray(rows)) {
        return rows.map((r: any) => ({
          id: r.id,
          name: r.name || '',
          email: r.email || '',
          phone: r.phone || '',
          topic: r.topic || '',
          message: r.message || '',
          status: (r.status as 'open' | 'in_progress' | 'resolved') || 'open',
          createdAt: r.created_at || new Date().toISOString()
        }));
      }
    } catch (err) {
      console.error('mysqlGetTickets error:', err);
    }
  }
  return [];
}

export async function mysqlAddTicket(ticket: SupportTicket): Promise<SupportTicket> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      await pool.query(
        `INSERT INTO support_tickets (id, name, email, phone, topic, message, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ticket.id,
          ticket.name,
          ticket.email,
          ticket.phone || '',
          ticket.topic || '',
          ticket.message,
          ticket.status || 'open',
          ticket.createdAt || new Date().toISOString()
        ]
      );
      return ticket;
    } catch (err) {
      console.error('mysqlAddTicket error:', err);
    }
  }
  return ticket;
}

export async function mysqlUpdateTicketStatus(id: string, status: 'open' | 'in_progress' | 'resolved'): Promise<boolean> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      await pool.query(`UPDATE support_tickets SET status = ? WHERE id = ?`, [status, id]);
      return true;
    } catch (err) {
      console.error('mysqlUpdateTicketStatus error:', err);
    }
  }
  return false;
}

export async function mysqlDeleteTicket(id: string): Promise<boolean> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      await pool.query(`DELETE FROM support_tickets WHERE id = ?`, [id]);
      return true;
    } catch (err) {
      console.error('mysqlDeleteTicket error:', err);
    }
  }
  return false;
}

export async function mysqlBulkDeleteTickets(ids: string[]): Promise<boolean> {
  if (!ids || ids.length === 0) return true;
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const placeholders = ids.map(() => '?').join(',');
      await pool.query(`DELETE FROM support_tickets WHERE id IN (${placeholders})`, ids);
      return true;
    } catch (err) {
      console.error('mysqlBulkDeleteTickets error:', err);
    }
  }
  return false;
}
