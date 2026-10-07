const fs = require('fs');
const env = {};
const envContent = fs.readFileSync('.env', 'utf8');
envContent.split(/\r?\n/).forEach(line => {
  const idx = line.indexOf('=');
  if (idx > 0 && !line.startsWith('#')) {
    const k = line.substring(0, idx).trim();
    const v = line.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
    env[k] = v;
  }
});

const mysql = require('mysql2/promise');

async function main() {
  try {
    const conn = await mysql.createConnection({
      host: env.MYSQL_HOST || env.DB_HOST,
      user: env.MYSQL_USER || env.DB_USER,
      password: env.MYSQL_PASSWORD || env.DB_PASSWORD,
      database: env.MYSQL_DATABASE || env.DB_DATABASE,
      port: Number(env.MYSQL_PORT) || 3306,
      connectTimeout: 8000
    });
    console.log('Connected to MySQL successfully!');
    const [rows] = await conn.query('SELECT tracking_code, LENGTH(receipt_url) as len, SUBSTRING(receipt_url, 1, 30) as prefix, RIGHT(receipt_url, 30) as suffix FROM enrollments WHERE tracking_code = ?', ['SAMI-ENR-26769']);
    console.log('Row result:', rows);
    
    // Also get the last 5 enrollments to see lengths
    const [last5] = await conn.query('SELECT tracking_code, name, LENGTH(receipt_url) as len, created_at FROM enrollments ORDER BY created_at DESC LIMIT 5');
    console.log('Last 5 enrollments:', last5);
    await conn.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
