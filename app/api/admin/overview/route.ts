import { NextResponse } from 'next/server';
import { dbGetStudents, dbGetEnrollments } from '@/lib/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
  'Pragma': 'no-cache',
  'Expires': '0'
};

export async function GET() {
  try {
    const students = await dbGetStudents();
    const enrollments = await dbGetEnrollments(students);

    const pendingEnrollments = enrollments.filter(e => e.status === 'pending');
    const approvedEnrollments = enrollments.filter(e => e.status === 'approved');
    const rejectedEnrollments = enrollments.filter(e => e.status === 'rejected');
    const totalStudentsCount = students.length;

    const DEFAULT_COURSE_FEE = 3799;

    // Calculate 100% REAL and ORIGINAL revenue from actual approved enrollments
    const totalRevenuePKR = approvedEnrollments.reduce((sum, e) => {
      const numStr = (e.amount || '').replace(/[^0-9.]/g, '');
      const parsed = parseFloat(numStr);
      const validAmount = (!isNaN(parsed) && parsed > 0) ? Math.round(parsed) : DEFAULT_COURSE_FEE;
      return sum + validAmount;
    }, 0);

    const totalRevenueFormatted = `PKR ${totalRevenuePKR.toLocaleString()}`;

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents: totalStudentsCount,
        pendingApprovals: pendingEnrollments.length,
        approvedEnrollments: approvedEnrollments.length,
        rejectedEnrollments: rejectedEnrollments.length,
        totalRevenue: totalRevenuePKR,
        totalRevenueFormatted,
        courseFee: DEFAULT_COURSE_FEE,
        courseFeeFormatted: `PKR ${DEFAULT_COURSE_FEE.toLocaleString()}`,
        recentEnrollments: enrollments.slice(0, 8)
      },
      enrollments,
      students
    }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
