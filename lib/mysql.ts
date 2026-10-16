import mysql from 'mysql2/promise';
import path from 'path';
import { defaultCmsContent } from '@/utils/cmsStore';
import { 
  Module, 
  Lesson, 
  initialModules,
  Enrollment, 
  Student, 
  Supplier, 
  SupportTicket, 
  ResourceItem,
  initialStudents, 
  initialEnrollments, 
  initialSuppliers,
  initialResources 
} from '@/utils/db';
import { ShowcaseCmsData, defaultShowcaseCmsData } from '@/utils/showcaseData';

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

    // 4B. Persistent Media Uploads Table (Immune to Git deployments & Hostinger disk resets)
    try {
      await p.query(`
        CREATE TABLE IF NOT EXISTS \`media_uploads\` (
          \`id\` VARCHAR(191) NOT NULL,
          \`category\` VARCHAR(64) NOT NULL DEFAULT 'reviews',
          \`filename\` VARCHAR(255) NOT NULL,
          \`content_type\` VARCHAR(64) NOT NULL DEFAULT 'image/jpeg',
          \`data_base64\` LONGTEXT NOT NULL,
          \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (\`id\`),
          KEY \`idx_media_filename\` (\`filename\`),
          KEY \`idx_media_category\` (\`category\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
    } catch (mErr: any) {
      console.warn('media_uploads table init error:', mErr?.message);
    }


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

    // Auto-seed latest initialModules (matching homepage curriculum) once
    try {
      const [seedFlag]: any = await p.query(`SELECT \`key\` FROM cms_settings WHERE \`key\` = 'lms_seeded_homepage_sync_v2' LIMIT 1`);
      if (!Array.isArray(seedFlag) || seedFlag.length === 0) {
        // Clean out legacy modules from old template if any exist
        try {
          await p.query(`DELETE FROM lms_modules WHERE id > 8`);
        } catch {}

        for (const mod of initialModules) {
          await p.query(
            `INSERT INTO lms_modules (\`id\`, \`title\`, \`duration\`, \`description\`, \`lessons_json\`, \`updated_at\`)
             VALUES (?, ?, ?, ?, ?, NOW())
             ON DUPLICATE KEY UPDATE 
               \`title\` = VALUES(\`title\`),
               \`duration\` = VALUES(\`duration\`),
               \`description\` = VALUES(\`description\`),
               \`lessons_json\` = VALUES(\`lessons_json\`),
               \`updated_at\` = NOW()`,
            [mod.id, mod.title, mod.duration, mod.description, JSON.stringify(mod.lessons || [])]
          );
        }
        await p.query(`INSERT INTO cms_settings (\`key\`, \`value_json\`) VALUES ('lms_seeded_homepage_sync_v2', 'true') ON DUPLICATE KEY UPDATE \`value_json\` = 'true'`);
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
        `ALTER TABLE \`enrollments\` MODIFY COLUMN \`receipt_url\` LONGTEXT NULL`,
        `ALTER TABLE \`enrollments\` ADD COLUMN IF NOT EXISTS \`amount\` VARCHAR(100) NULL`,
        `ALTER TABLE \`enrollments\` ADD COLUMN IF NOT EXISTS \`status\` VARCHAR(50) DEFAULT 'pending'`,
        `ALTER TABLE \`enrollments\` ADD COLUMN IF NOT EXISTS \`password\` VARCHAR(255) NULL`,
        `ALTER TABLE \`enrollments\` ADD COLUMN IF NOT EXISTS \`created_at\` VARCHAR(100) NULL`,
        `ALTER TABLE \`media_uploads\` MODIFY COLUMN \`data_base64\` LONGTEXT NOT NULL`
      ];
      for (const colQuery of enrCols) {
        try { await p.query(colQuery); } catch {}
      }

      // Self-heal legacy 0.00 or missing amounts to the official course fee PKR 3,799
      try {
        await p.query(
          `UPDATE \`enrollments\` 
           SET \`amount\` = 'PKR 3,799' 
           WHERE \`amount\` IS NULL OR \`amount\` = '' OR \`amount\` = '0.00' OR \`amount\` = '0' OR \`amount\` = '0.0'`
        );
      } catch {}
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

    // 8B. LMS Bonuses & Resources table in Hostinger MySQL
    try {
      await p.query(`
        CREATE TABLE IF NOT EXISTS \`lms_resources\` (
          \`id\` VARCHAR(191) NOT NULL,
          \`title\` VARCHAR(255) NOT NULL,
          \`type\` VARCHAR(100) NULL,
          \`size\` VARCHAR(100) NULL,
          \`download_url\` LONGTEXT NOT NULL,
          \`value\` VARCHAR(100) NULL,
          \`description\` TEXT NULL,
          \`created_at\` VARCHAR(100) NULL,
          \`updated_at\` DATETIME NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // Auto-seed initialResources if table is empty
      const [resCount]: any = await p.query(`SELECT COUNT(*) as cnt FROM \`lms_resources\``);
      if (Number(resCount?.[0]?.cnt || 0) === 0 && Array.isArray(initialResources)) {
        for (const res of initialResources) {
          await p.query(
            `INSERT INTO \`lms_resources\` (id, title, type, size, download_url, value, description, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
             ON DUPLICATE KEY UPDATE title = VALUES(title)`,
            [res.id, res.title, res.type, res.size, res.downloadUrl, res.value, res.description]
          );
        }
      }
    } catch (err) {
      console.error('ensureAnalyticsTables lms_resources error:', err);
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

    // 10. Community Updates table in Hostinger MySQL
    try {
      await p.query(`
        CREATE TABLE IF NOT EXISTS \`community_updates\` (
          \`id\` VARCHAR(191) NOT NULL,
          \`title\` VARCHAR(255) NOT NULL,
          \`content\` LONGTEXT NOT NULL,
          \`tag\` VARCHAR(50) DEFAULT 'Announcement',
          \`author\` VARCHAR(100) DEFAULT 'Mentor Sardar Samiullah',
          \`pinned\` TINYINT(1) DEFAULT 0,
          \`created_at\` VARCHAR(100) NOT NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      const [updRows]: any = await p.query(`SELECT COUNT(*) as count FROM community_updates`);
      if (Number(updRows?.[0]?.count || 0) === 0) {
        const initialSeedUpdates = [
          {
            id: 'upd-01',
            title: '🎉 Welcome to Ecom With Sami Mentorship Hub!',
            content: 'Assalam-o-Alaikum Students! Tamam naye students ko VIP Mentorship mein khushamdeed. Course ke tamam 8 modules sequence wise dekhein aur notes banayein. Har Module ke baad resources aur action steps lazmi follow karein.',
            tag: 'Announcement',
            author: 'Mentor Sardar Samiullah',
            pinned: 1,
            createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
          },
          {
            id: 'upd-02',
            title: '🚀 Winning Product Formula & TikTok Ad Testing SOP Uploaded',
            content: 'Student feedback ke mutabiq Module 4 aur 5 ke sath TikTok Spark Ads ka testing formula update kardiya gaya hai. Low-budget testing ke liye yeh strategy lazmi implement karein.',
            tag: 'Strategy',
            author: 'Mentor Sardar Samiullah',
            pinned: 0,
            createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
          },
          {
            id: 'upd-03',
            title: '📹 Live Q&A Session This Sunday 9:00 PM PKT',
            content: 'Tamam enrolled students ke liye weekly Zoom / Live Q&A session schedule kiya gaya hai. Apne store audits aur questions tayar rakhein.',
            tag: 'Live Session',
            author: 'Mentor Sardar Samiullah',
            pinned: 0,
            createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
          }
        ];
        for (const u of initialSeedUpdates) {
          await p.query(
            `INSERT IGNORE INTO community_updates (id, title, content, tag, author, pinned, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [u.id, u.title, u.content, u.tag, u.author, u.pinned, u.createdAt]
          );
        }
      }
    } catch (err) {
      console.error('ensureAnalyticsTables community_updates error:', err);
    }

    // 11. Community Chat Messages table (Student Support & Success Stories)
    try {
      await p.query(`
        CREATE TABLE IF NOT EXISTS \`community_chat_messages\` (
          \`id\` VARCHAR(191) NOT NULL,
          \`student_id\` VARCHAR(191) NULL,
          \`student_name\` VARCHAR(191) NOT NULL,
          \`is_mentor\` TINYINT(1) DEFAULT 0,
          \`message\` TEXT,
          \`image_url\` VARCHAR(500) NULL,
          \`audio_url\` VARCHAR(500) NULL,
          \`audio_duration\` VARCHAR(50) NULL,
          \`created_at\` VARCHAR(100) NOT NULL,
          PRIMARY KEY (\`id\`),
          INDEX \`idx_chat_created\` (\`created_at\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      const [chatCountRows]: any = await p.query(`SELECT COUNT(*) as count FROM community_chat_messages`);
      if (Number(chatCountRows?.[0]?.count || 0) === 0) {
        const seedMessages = [
          {
            id: 'cmsg-01',
            student_id: null,
            student_name: 'Mentor Sardar Samiullah',
            is_mentor: 1,
            message: '🎉 Assalam-o-Alaikum Students! Ecom With Sami Community Support & Success Stories hub live hai. Yahan apni success stories, store scaling milestones aur doubts share karein. We grow together!',
            image_url: null,
            audio_url: null,
            audio_duration: null,
            created_at: new Date(Date.now() - 3600000 * 24).toISOString()
          },
          {
            id: 'cmsg-02',
            student_id: null,
            student_name: 'Hamza Tariq',
            is_mentor: 0,
            message: 'Alhamdulillah pehla winning product scale hona start hua hai! Module 4 ka Spark Ads testing formula follow kiya tha, aj 16 orders dispatch huye hain.',
            image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
            audio_url: null,
            audio_duration: null,
            created_at: new Date(Date.now() - 3600000 * 5).toISOString()
          },
          {
            id: 'cmsg-03',
            student_id: null,
            student_name: 'Zeeshan Ali',
            is_mentor: 0,
            message: 'Bhaiyon TCS courier portal integrate karne me agar kisi ko mushkil pesh aa rahi ho toh batayein, maine verify karwaya hai bohot smooth process hai.',
            image_url: null,
            audio_url: null,
            audio_duration: null,
            created_at: new Date(Date.now() - 3600000 * 2).toISOString()
          }
        ];
        for (const m of seedMessages) {
          await p.query(
            `INSERT IGNORE INTO community_chat_messages (id, student_id, student_name, is_mentor, message, image_url, audio_url, audio_duration, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [m.id, m.student_id, m.student_name, m.is_mentor, m.message, m.image_url, m.audio_url, m.audio_duration, m.created_at]
          );
        }
      }
    } catch (err) {
      console.error('ensureAnalyticsTables community_chat_messages error:', err);
    }

    tablesInitialized = true;
    return true;
  } catch (error) {
    console.error('ensureAnalyticsTables outer error:', error);
    return false;
  }
}

let cachedCmsSettings: { data: any; expiresAt: number } | null = null;

/**
 * Fetches CMS settings from Hostinger MySQL with short-lived memory cache.
 */
export async function mysqlGetCmsSettings(): Promise<any | null> {
  if (cachedCmsSettings && Date.now() < cachedCmsSettings.expiresAt) {
    return cachedCmsSettings.data;
  }

  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const [rows]: any = await pool.query(
        `SELECT value_json FROM cms_settings WHERE \`key\` = 'main_cms' LIMIT 1`
      );
      if (Array.isArray(rows) && rows.length > 0 && rows[0]?.value_json) {
        const raw = rows[0].value_json;
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        cachedCmsSettings = { data: parsed, expiresAt: Date.now() + 30000 };
        return parsed;
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
  cachedCmsSettings = null; // Instantly invalidate memory cache
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
      cachedCmsSettings = null; // Re-invalidate to ensure fresh data
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

let cachedModules: { data: Module[] | null; expiresAt: number } | null = null;

/**
 * Fetches all LMS modules from Hostinger MySQL with short-lived memory cache.
 * Returns empty array [] if admin deleted all modules (avoids resurrection).
 */
export async function mysqlGetModules(): Promise<Module[] | null> {
  if (cachedModules && Date.now() < cachedModules.expiresAt) {
    return cachedModules.data;
  }

  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const [rows]: any = await pool.query(
        `SELECT id, title, duration, description, lessons_json FROM lms_modules ORDER BY id ASC`
      );
      if (Array.isArray(rows)) {
        const result = rows.map((r: any) => {
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
        cachedModules = { data: result, expiresAt: Date.now() + 30000 };
        return result;
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
  cachedModules = null; // Instantly invalidate cache
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

      cachedModules = null; // Instantly invalidate cache
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
  cachedModules = null; // Instantly invalidate cache
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      await pool.query(`DELETE FROM lms_modules WHERE id = ?`, [id]);
      cachedModules = null;
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
  cachedModules = null; // Instantly invalidate cache
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const numericIds = ids.map(id => Number(id)).filter(id => !isNaN(id) && id > 0);
      if (numericIds.length === 0) return true;
      const idList = numericIds.join(',');
      await pool.query(`DELETE FROM lms_modules WHERE id IN (${idList})`);
      cachedModules = null;
      return true;
    } catch (err) {
      console.error('mysqlBulkDeleteModules error:', err);
    }
  }
  return false;
}

/**
 * Bulk replaces or sets all LMS modules in Hostinger MySQL.
 */
export async function mysqlSetAllModules(modules: Module[]): Promise<Module[]> {
  cachedModules = null;
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const maxId = modules.length;
      if (maxId > 0) {
        await pool.query(`DELETE FROM lms_modules WHERE id > ?`, [maxId]);
      } else {
        await pool.query(`DELETE FROM lms_modules`);
      }

      for (const mod of modules) {
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
          [mod.id, mod.title || '', mod.duration || '', mod.description || '', lessonsJson]
        );
      }
      cachedModules = { data: modules, expiresAt: Date.now() + 30000 };
      return modules;
    } catch (err) {
      console.error('mysqlSetAllModules error:', err);
    }
  }
  return modules;
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

  // Preserve complete receipt image data intact without truncation (stored in LONGTEXT)
  const safeReceipt = enr.receiptUrl || '';

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

      let finalAmount = enr.amount;
      if (status === 'approved' && (!finalAmount || finalAmount === '0.00' || finalAmount === '0' || finalAmount === '0.0')) {
        finalAmount = 'PKR 3,799';
      }

      await p.query(
        `UPDATE enrollments SET status = ?, password = ?, amount = ? WHERE id = ?`,
        [status, pass, finalAmount || 'PKR 3,799', enr.id]
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

export async function mysqlUpdateSupplier(id: string, patch: Partial<Supplier>): Promise<Supplier | null> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const [existing]: any = await pool.query(`SELECT * FROM lms_suppliers WHERE id = ? LIMIT 1`, [id]);
      if (Array.isArray(existing) && existing.length > 0) {
        const cur = existing[0];
        const name = patch.name !== undefined ? patch.name : cur.name;
        const category = patch.category !== undefined ? patch.category : cur.category;
        const country = patch.country !== undefined ? patch.country : cur.country;
        const city = patch.city !== undefined ? patch.city : cur.city;
        const phone = patch.phone !== undefined ? patch.phone : cur.phone;
        const whatsappLink = patch.whatsappLink !== undefined ? patch.whatsappLink : (patch.phone ? `https://wa.me/${patch.phone.replace(/[^0-9]/g, '')}` : cur.whatsapp_link);
        const minOrder = patch.minOrder !== undefined ? patch.minOrder : cur.min_order;
        const deliveryTime = patch.deliveryTime !== undefined ? patch.deliveryTime : cur.delivery_time;
        const codSupported = patch.codSupported !== undefined ? (patch.codSupported ? 1 : 0) : cur.cod_supported;
        const notes = patch.notes !== undefined ? patch.notes : cur.notes;

        await pool.query(
          `UPDATE lms_suppliers SET
             name = ?, category = ?, country = ?, city = ?, phone = ?, whatsapp_link = ?,
             min_order = ?, delivery_time = ?, cod_supported = ?, notes = ?, updated_at = NOW()
           WHERE id = ?`,
          [name, category, country, city, phone, whatsappLink, minOrder, deliveryTime, codSupported, notes, id]
        );

        return {
          id,
          name,
          category,
          country,
          city,
          phone,
          whatsappLink,
          minOrder,
          deliveryTime,
          codSupported: Boolean(codSupported),
          notes
        };
      }
    } catch (err) {
      console.error('mysqlUpdateSupplier error:', err);
    }
  }
  return null;
}

// =============================================================================
// LMS BONUSES & DOWNLOAD RESOURCES (100% NATIVE HOSTINGER MYSQL)
// =============================================================================

export async function mysqlGetResources(): Promise<ResourceItem[]> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const [rows]: any = await pool.query(`SELECT * FROM lms_resources ORDER BY updated_at DESC, created_at DESC`);
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map((r: any) => ({
          id: String(r.id),
          title: String(r.title || ''),
          type: String(r.type || 'Resource'),
          size: String(r.size || '1.0 MB'),
          downloadUrl: String(r.download_url || ''),
          value: String(r.value || 'Rs 5,000'),
          description: String(r.description || '')
        }));
      }
    } catch (err) {
      console.error('mysqlGetResources error:', err);
    }
  }
  return initialResources;
}

export async function mysqlAddResource(resource: ResourceItem): Promise<ResourceItem> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      await pool.query(
        `INSERT INTO lms_resources (
          id, title, type, size, download_url, value, description, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          type = VALUES(type),
          size = VALUES(size),
          download_url = VALUES(download_url),
          value = VALUES(value),
          description = VALUES(description),
          updated_at = NOW()`,
        [
          resource.id,
          resource.title,
          resource.type,
          resource.size,
          resource.downloadUrl,
          resource.value,
          resource.description
        ]
      );
      return resource;
    } catch (err) {
      console.error('mysqlAddResource error:', err);
    }
  }
  return resource;
}

export async function mysqlUpdateResource(id: string, patch: Partial<ResourceItem>): Promise<ResourceItem | null> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const [existing]: any = await pool.query(`SELECT * FROM lms_resources WHERE id = ? LIMIT 1`, [id]);
      if (Array.isArray(existing) && existing.length > 0) {
        const cur = existing[0];
        const title = patch.title !== undefined ? patch.title : cur.title;
        const type = patch.type !== undefined ? patch.type : cur.type;
        const size = patch.size !== undefined ? patch.size : cur.size;
        const downloadUrl = patch.downloadUrl !== undefined ? patch.downloadUrl : cur.download_url;
        const value = patch.value !== undefined ? patch.value : cur.value;
        const description = patch.description !== undefined ? patch.description : cur.description;

        await pool.query(
          `UPDATE lms_resources SET
             title = ?, type = ?, size = ?, download_url = ?, value = ?, description = ?, updated_at = NOW()
           WHERE id = ?`,
          [title, type, size, downloadUrl, value, description, id]
        );

        return {
          id,
          title,
          type,
          size,
          downloadUrl,
          value,
          description
        };
      }
    } catch (err) {
      console.error('mysqlUpdateResource error:', err);
    }
  }
  return null;
}

export async function mysqlDeleteResource(id: string): Promise<boolean> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      await pool.query(`DELETE FROM lms_resources WHERE id = ?`, [id]);
      return true;
    } catch (err) {
      console.error('mysqlDeleteResource error:', err);
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

// ============================================================================
// PERSISTENT MEDIA UPLOADS (SAVED PERMANENTLY IN MYSQL - IMMUNE TO GIT WIPES)
// ============================================================================

export async function mysqlSaveMediaUpload(
  id: string,
  category: string,
  filename: string,
  contentType: string,
  buffer: Buffer
): Promise<boolean> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const base64Data = buffer.toString('base64');
      await pool.query(
        `INSERT INTO media_uploads (\`id\`, \`category\`, \`filename\`, \`content_type\`, \`data_base64\`)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE \`content_type\` = VALUES(\`content_type\`), \`data_base64\` = VALUES(\`data_base64\`)`,
        [id, category, filename, contentType, base64Data]
      );
      return true;
    } catch (err) {
      console.error('mysqlSaveMediaUpload error:', err);
    }
  }
  return false;
}

export async function mysqlGetMediaUpload(idOrFilename: string): Promise<{
  contentType: string;
  buffer: Buffer;
} | null> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const cleanName = path.basename(idOrFilename);
      const cleanId = cleanName.includes('.') ? cleanName.split('.')[0] : cleanName;
      const [rows]: any = await pool.query(
        `SELECT content_type, data_base64 FROM media_uploads WHERE id = ? OR filename = ? OR id = ? LIMIT 1`,
        [idOrFilename, cleanName, cleanId]
      );
      if (rows && rows.length > 0 && rows[0].data_base64) {
        return {
          contentType: rows[0].content_type || 'image/jpeg',
          buffer: Buffer.from(rows[0].data_base64, 'base64')
        };
      }
    } catch (err) {
      console.error('mysqlGetMediaUpload error:', err);
    }
  }
  return null;
}

export interface CommunityUpdateItem {
  id: string;
  title: string;
  content: string;
  tag: string;
  author: string;
  pinned: boolean;
  createdAt: string;
}

let inMemoryCommunityUpdates: CommunityUpdateItem[] = [
  {
    id: 'upd-01',
    title: '🎉 Welcome to Ecom With Sami Mentorship Hub!',
    content: 'Assalam-o-Alaikum Students! Tamam naye students ko VIP Mentorship mein khushamdeed. Course ke tamam 8 modules sequence wise dekhein aur notes banayein. Har Module ke baad resources aur action steps lazmi follow karein.',
    tag: 'Announcement',
    author: 'Mentor Sardar Samiullah',
    pinned: true,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'upd-02',
    title: '🚀 Winning Product Formula & TikTok Ad Testing SOP Uploaded',
    content: 'Student feedback ke mutabiq Module 4 aur 5 ke sath TikTok Spark Ads ka testing formula update kardiya gaya hai. Low-budget testing ke liye yeh strategy lazmi implement karein.',
    tag: 'Strategy',
    author: 'Mentor Sardar Samiullah',
    pinned: false,
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'upd-03',
    title: '📹 Live Q&A Session This Sunday 9:00 PM PKT',
    content: 'Tamam enrolled students ke liye weekly Zoom / Live Q&A session schedule kiya gaya hai. Apne store audits aur questions tayar rakhein.',
    tag: 'Live Session',
    author: 'Mentor Sardar Samiullah',
    pinned: false,
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
  }
];

export async function mysqlGetCommunityUpdates(): Promise<CommunityUpdateItem[]> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const [rows]: any = await pool.query(
        `SELECT id, title, content, tag, author, pinned, created_at FROM community_updates ORDER BY pinned DESC, created_at DESC LIMIT 50`
      );
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map((r: any) => ({
          id: String(r.id),
          title: String(r.title || ''),
          content: String(r.content || ''),
          tag: String(r.tag || 'Announcement'),
          author: String(r.author || 'Mentor Sardar Samiullah'),
          pinned: Boolean(r.pinned),
          createdAt: String(r.created_at || new Date().toISOString())
        }));
      }
    } catch (err) {
      console.error('mysqlGetCommunityUpdates error:', err);
    }
  }
  return inMemoryCommunityUpdates;
}

export async function mysqlCreateCommunityUpdate(data: {
  title: string;
  content: string;
  tag?: string;
  author?: string;
  pinned?: boolean;
}): Promise<CommunityUpdateItem> {
  const id = 'upd-' + Date.now();
  const newItem: CommunityUpdateItem = {
    id,
    title: data.title,
    content: data.content,
    tag: data.tag || 'Announcement',
    author: data.author || 'Mentor Sardar Samiullah',
    pinned: Boolean(data.pinned),
    createdAt: new Date().toISOString()
  };

  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      await pool.query(
        `INSERT INTO community_updates (id, title, content, tag, author, pinned, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [newItem.id, newItem.title, newItem.content, newItem.tag, newItem.author, newItem.pinned ? 1 : 0, newItem.createdAt]
      );
    } catch (err) {
      console.error('mysqlCreateCommunityUpdate error:', err);
    }
  }

  inMemoryCommunityUpdates = [newItem, ...inMemoryCommunityUpdates];
  return newItem;
}

export async function mysqlDeleteCommunityUpdate(id: string): Promise<boolean> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      await pool.query(`DELETE FROM community_updates WHERE id = ?`, [id]);
    } catch (err) {
      console.error('mysqlDeleteCommunityUpdate error:', err);
    }
  }
  inMemoryCommunityUpdates = inMemoryCommunityUpdates.filter(u => u.id !== id);
  return true;
}

let inMemoryShowcaseCms: ShowcaseCmsData = defaultShowcaseCmsData;

export async function mysqlGetShowcaseCms(): Promise<ShowcaseCmsData> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const [rows]: any = await pool.query(
        `SELECT value_json FROM cms_settings WHERE \`key\` = 'showcase_cms' LIMIT 1`
      );
      if (Array.isArray(rows) && rows.length > 0 && rows[0]?.value_json) {
        const raw = rows[0].value_json;
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (parsed && typeof parsed === 'object') {
          return {
            ...defaultShowcaseCmsData,
            ...parsed,
            navLabels: { ...defaultShowcaseCmsData.navLabels, ...(parsed.navLabels || {}) },
            hero: { ...defaultShowcaseCmsData.hero, ...(parsed.hero || {}) },
            metrics: { ...defaultShowcaseCmsData.metrics, ...(parsed.metrics || {}) },
            enrollments: Array.isArray(parsed.enrollments) ? parsed.enrollments : defaultShowcaseCmsData.enrollments,
            reviews: Array.isArray(parsed.reviews) ? parsed.reviews : defaultShowcaseCmsData.reviews
          };
        }
      }
    } catch (err) {
      console.error('mysqlGetShowcaseCms error:', err);
    }
  }
  return inMemoryShowcaseCms;
}

export async function mysqlSaveShowcaseCms(data: ShowcaseCmsData): Promise<boolean> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const jsonStr = JSON.stringify(data);
      await pool.query(
        `INSERT INTO cms_settings (\`key\`, \`value_json\`, \`updated_at\`)
         VALUES ('showcase_cms', ?, NOW())
         ON DUPLICATE KEY UPDATE \`value_json\` = VALUES(\`value_json\`), \`updated_at\` = NOW()`,
        [jsonStr]
      );
      inMemoryShowcaseCms = data;
      return true;
    } catch (err) {
      console.error('mysqlSaveShowcaseCms error:', err);
    }
  }
  inMemoryShowcaseCms = data;
  return true;
}

// ============================================================================
// STUDENT COMMUNITY CHAT & SUCCESS STORIES
// ============================================================================

export interface CommunityChatMessageItem {
  id: string;
  studentId?: string | null;
  studentName: string;
  isMentor: boolean;
  message: string;
  imageUrl?: string | null;
  audioUrl?: string | null;
  audioDuration?: string | null;
  createdAt: string;
}

export interface CommunityChatConfig {
  isOpen: boolean;
  noticeText: string;
}

let inMemoryChatConfig: CommunityChatConfig = {
  isOpen: true,
  noticeText: 'Sunday Student-to-Student Support Chat is currently locked. Opens every Sunday at 8:00 PM PKT with Mentor Sardar Samiullah for reviews and live store audits!'
};

let inMemoryChatMessages: CommunityChatMessageItem[] = [
  {
    id: 'cmsg-01',
    studentId: null,
    studentName: 'Mentor Sardar Samiullah',
    isMentor: true,
    message: '🎉 Assalam-o-Alaikum Students! Ecom With Sami Community Support & Success Stories hub live hai. Yahan apni success stories, store scaling milestones aur doubts share karein. We grow together!',
    imageUrl: null,
    audioUrl: null,
    audioDuration: null,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'cmsg-02',
    studentId: null,
    studentName: 'Hamza Tariq',
    isMentor: false,
    message: 'Alhamdulillah pehla winning product scale hona start hua hai! Module 4 ka Spark Ads testing formula follow kiya tha, aj 16 orders dispatch huye hain.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    audioUrl: null,
    audioDuration: null,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'cmsg-03',
    studentId: null,
    studentName: 'Zeeshan Ali',
    isMentor: false,
    message: 'Bhaiyon TCS courier portal integrate karne me agar kisi ko mushkil pesh aa rahi ho toh batayein, maine verify karwaya hai bohot smooth process hai.',
    imageUrl: null,
    audioUrl: null,
    audioDuration: null,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

export async function mysqlGetCommunityChatConfig(): Promise<CommunityChatConfig> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const [rows]: any = await pool.query(
        `SELECT value_json FROM cms_settings WHERE \`key\` = 'community_chat_config' LIMIT 1`
      );
      if (Array.isArray(rows) && rows.length > 0 && rows[0].value_json) {
        const raw = rows[0].value_json;
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (parsed && typeof parsed === 'object') {
          return {
            isOpen: Boolean(parsed.isOpen ?? true),
            noticeText: String(parsed.noticeText || inMemoryChatConfig.noticeText)
          };
        }
      }
    } catch (err) {
      console.error('mysqlGetCommunityChatConfig error:', err);
    }
  }
  return inMemoryChatConfig;
}

export async function mysqlUpdateCommunityChatConfig(config: Partial<CommunityChatConfig>): Promise<CommunityChatConfig> {
  const current = await mysqlGetCommunityChatConfig();
  const updated: CommunityChatConfig = {
    isOpen: config.isOpen !== undefined ? Boolean(config.isOpen) : current.isOpen,
    noticeText: config.noticeText !== undefined ? String(config.noticeText) : current.noticeText
  };

  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const jsonStr = JSON.stringify(updated);
      await pool.query(
        `INSERT INTO cms_settings (\`key\`, \`value_json\`, \`updated_at\`)
         VALUES ('community_chat_config', ?, NOW())
         ON DUPLICATE KEY UPDATE \`value_json\` = VALUES(\`value_json\`), \`updated_at\` = NOW()`,
        [jsonStr]
      );
    } catch (err) {
      console.error('mysqlUpdateCommunityChatConfig error:', err);
    }
  }
  inMemoryChatConfig = updated;
  return updated;
}

export async function mysqlGetCommunityChatMessages(limit: number = 80): Promise<CommunityChatMessageItem[]> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const [rows]: any = await pool.query(
        `SELECT id, student_id, student_name, is_mentor, message, image_url, audio_url, audio_duration, created_at
         FROM community_chat_messages
         ORDER BY created_at DESC
         LIMIT ?`,
        [limit]
      );
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map((r: any) => ({
          id: String(r.id),
          studentId: r.student_id ? String(r.student_id) : null,
          studentName: String(r.student_name || 'Student'),
          isMentor: Boolean(r.is_mentor),
          message: String(r.message || ''),
          imageUrl: r.image_url ? String(r.image_url) : null,
          audioUrl: r.audio_url ? String(r.audio_url) : null,
          audioDuration: r.audio_duration ? String(r.audio_duration) : null,
          createdAt: String(r.created_at || new Date().toISOString())
        })).reverse(); // Return in chronological order for chat view
      }
    } catch (err) {
      console.error('mysqlGetCommunityChatMessages error:', err);
    }
  }
  return inMemoryChatMessages;
}

export async function mysqlCreateCommunityChatMessage(data: {
  studentId?: string | null;
  studentName: string;
  isMentor?: boolean;
  message: string;
  imageUrl?: string | null;
  audioUrl?: string | null;
  audioDuration?: string | null;
}): Promise<CommunityChatMessageItem> {
  const newItem: CommunityChatMessageItem = {
    id: 'cmsg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    studentId: data.studentId || null,
    studentName: data.studentName.trim(),
    isMentor: Boolean(data.isMentor),
    message: data.message ? data.message.trim() : '',
    imageUrl: data.imageUrl || null,
    audioUrl: data.audioUrl || null,
    audioDuration: data.audioDuration || null,
    createdAt: new Date().toISOString()
  };

  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      await pool.query(
        `INSERT INTO community_chat_messages (id, student_id, student_name, is_mentor, message, image_url, audio_url, audio_duration, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newItem.id,
          newItem.studentId,
          newItem.studentName,
          newItem.isMentor ? 1 : 0,
          newItem.message,
          newItem.imageUrl,
          newItem.audioUrl,
          newItem.audioDuration,
          newItem.createdAt
        ]
      );
    } catch (err) {
      console.error('mysqlCreateCommunityChatMessage error:', err);
    }
  }

  inMemoryChatMessages = [...inMemoryChatMessages, newItem];
  return newItem;
}

export async function mysqlDeleteCommunityChatMessage(id: string): Promise<boolean> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      await pool.query(`DELETE FROM community_chat_messages WHERE id = ?`, [id]);
    } catch (err) {
      console.error('mysqlDeleteCommunityChatMessage error:', err);
    }
  }
  inMemoryChatMessages = inMemoryChatMessages.filter((m) => m.id !== id);
  return true;
}

export async function mysqlPurgeCommunityChatMessages(olderThanDays?: number): Promise<{ deletedCount: number }> {
  let deletedCount = 0;
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      if (olderThanDays && olderThanDays > 0) {
        const cutoffDate = new Date(Date.now() - olderThanDays * 86400000).toISOString();
        const [res]: any = await pool.query(
          `DELETE FROM community_chat_messages WHERE created_at < ?`,
          [cutoffDate]
        );
        deletedCount = res?.affectedRows || 0;
      } else {
        const [res]: any = await pool.query(`DELETE FROM community_chat_messages`);
        deletedCount = res?.affectedRows || 0;
      }
    } catch (err) {
      console.error('mysqlPurgeCommunityChatMessages error:', err);
    }
  }
  inMemoryChatMessages = [];
  return { deletedCount };
}

export async function mysqlGetCommunityChatStorageStats(): Promise<{
  totalMessages: number;
  totalImages: number;
  totalAudio: number;
  estimatedDiskMb: number;
}> {
  let totalMessages = 0;
  let totalImages = 0;
  let totalAudio = 0;

  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const [rows]: any = await pool.query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END) as images,
          SUM(CASE WHEN audio_url IS NOT NULL AND audio_url != '' THEN 1 ELSE 0 END) as audios
        FROM community_chat_messages
      `);
      if (Array.isArray(rows) && rows[0]) {
        totalMessages = Number(rows[0].total || 0);
        totalImages = Number(rows[0].images || 0);
        totalAudio = Number(rows[0].audios || 0);
      }
    } catch (err) {
      console.error('mysqlGetCommunityChatStorageStats error:', err);
    }
  } else {
    totalMessages = inMemoryChatMessages.length;
    totalImages = inMemoryChatMessages.filter((m) => Boolean(m.imageUrl)).length;
    totalAudio = inMemoryChatMessages.filter((m) => Boolean(m.audioUrl)).length;
  }

  // Calculate estimated disk usage in MB (images average ~150KB, audios ~300KB, messages ~1KB)
  const estimatedDiskMb = Math.round(((totalImages * 0.15) + (totalAudio * 0.3) + (totalMessages * 0.002)) * 10) / 10;

  return {
    totalMessages,
    totalImages,
    totalAudio,
    estimatedDiskMb
  };
}

