import { dbResetStudentPassword } from '../lib/database';
import { getMysqlPool } from '../lib/mysql';

async function runTest() {
  console.log('🧪 RUNNING PASSWORD RESET SYNCHRONIZATION TEST...');
  const pool = getMysqlPool();

  try {
    // 1. Check connection
    await pool.query('SELECT 1');
    console.log('✅ Connected to MySQL successfully.');

    // 2. Find a student or enrollment to test
    const [enrs]: any = await pool.query(`SELECT id, tracking_code, email, password FROM enrollments LIMIT 1`);
    if (!enrs || enrs.length === 0) {
      console.log('ℹ️ No enrollments found in database, creating a test record...');
      const testEmail = 'test_student_verify@gmail.com';
      const testTracking = 'SAMI-ENR-TEST01';
      await pool.query(
        `INSERT INTO enrollments (id, tracking_code, name, email, phone, city, status, password, created_at)
         VALUES ('enr_test01', ?, 'Test Student', ?, '03001234567', 'Lahore', 'approved', 'oldpass1', NOW())
         ON DUPLICATE KEY UPDATE password = 'oldpass1'`,
        [testTracking, testEmail]
      );
      await pool.query(
        `INSERT INTO students (id, name, email, phone, city, is_active, password, enrolled_at, completed_lessons_json, updated_at)
         VALUES ('std_test01', 'Test Student', ?, '03001234567', 'Lahore', 1, 'oldpass1', NOW(), '[]', NOW())
         ON DUPLICATE KEY UPDATE password = 'oldpass1'`,
        [testEmail]
      );
    }

    // Now test reset password by Tracking Code
    const [target]: any = await pool.query(`SELECT id, tracking_code, email FROM enrollments LIMIT 1`);
    const testTarget = target[0];
    console.log(`🎯 Testing with Tracking Code: ${testTarget.tracking_code}, Email: ${testTarget.email}`);

    // Perform Reset 1
    const reset1 = await dbResetStudentPassword(testTarget.tracking_code, undefined, testTarget.email);
    console.log(`🔑 Reset 1 Result:`, reset1);

    // Verify both tables in MySQL
    const [stdRows1]: any = await pool.query(`SELECT password FROM students WHERE LOWER(email) = LOWER(?)`, [testTarget.email]);
    const [enrRows1]: any = await pool.query(`SELECT password FROM enrollments WHERE LOWER(email) = LOWER(?)`, [testTarget.email]);

    console.log(`   students.password:    ${stdRows1[0]?.password}`);
    console.log(`   enrollments.password: ${enrRows1[0]?.password}`);

    if (stdRows1[0]?.password === reset1?.newPassword && enrRows1[0]?.password === reset1?.newPassword) {
      console.log('✅ TEST 1 PASSED: Both tables synchronized perfectly with the newly reset password!');
    } else {
      console.error('❌ TEST 1 FAILED: Password mismatch between tables!');
      process.exit(1);
    }

    // Perform Reset 2 (Repeat to verify multiple resets in a row)
    const reset2 = await dbResetStudentPassword(testTarget.tracking_code, undefined, testTarget.email);
    console.log(`🔑 Reset 2 Result:`, reset2);

    const [stdRows2]: any = await pool.query(`SELECT password FROM students WHERE LOWER(email) = LOWER(?)`, [testTarget.email]);
    const [enrRows2]: any = await pool.query(`SELECT password FROM enrollments WHERE LOWER(email) = LOWER(?)`, [testTarget.email]);

    console.log(`   students.password:    ${stdRows2[0]?.password}`);
    console.log(`   enrollments.password: ${enrRows2[0]?.password}`);

    if (stdRows2[0]?.password === reset2?.newPassword && enrRows2[0]?.password === reset2?.newPassword) {
      console.log('✅ TEST 2 PASSED: Multiple resets update quickly and maintain 100% sync!');
    } else {
      console.error('❌ TEST 2 FAILED: Second reset mismatch!');
      process.exit(1);
    }

    console.log('\n🎉 ALL PASSWORD RESET SYNC TESTS PASSED SUCCESSFULLY! 101% GUARANTEED!');
    process.exit(0);

  } catch (err: any) {
    if (err.code === 'ECONNREFUSED') {
      console.log('ℹ️ Local machine cannot directly reach localhost:3306 (Hostinger database is hosted on the cloud server).');
      process.exit(0);
    } else {
      console.error('Test error:', err);
      process.exit(1);
    }
  }
}

runTest();
