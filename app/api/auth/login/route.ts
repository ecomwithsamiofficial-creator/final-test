import { NextRequest, NextResponse } from 'next/server';
import { dbGetStudentByEmail, dbUpdateStudent } from '@/lib/database';
import { signSessionToken } from '@/lib/auth';
import { getMysqlPool } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide both email and password' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    let student = await dbGetStudentByEmail(cleanEmail);

    // Self-Healing LMS Login Sync:
    // If student not found or password doesn't match, check enrollments table
    if (!student || (student.password !== cleanPassword && cleanPassword !== 'sami2026')) {
      try {
        const p = getMysqlPool();
        const [enrRows]: any = await p.query(
          `SELECT * FROM enrollments WHERE LOWER(email) = LOWER(?) ORDER BY created_at DESC LIMIT 1`,
          [cleanEmail]
        );
        if (Array.isArray(enrRows) && enrRows.length > 0) {
          const enr = enrRows[0];
          // If approved and password matches enrollment password (or user is approved student entering their credentials)
          if (enr.status === 'approved' && (enr.password === cleanPassword || !student)) {
            const stdId = enr.student_id || student?.id || `std_${Date.now()}`;
            await p.query(
              `INSERT INTO students (id, name, email, phone, city, is_active, password, enrolled_at, completed_lessons_json, updated_at)
               VALUES (?, ?, ?, ?, ?, 1, ?, NOW(), '[]', NOW())
               ON DUPLICATE KEY UPDATE password = VALUES(password), is_active = 1, updated_at = NOW()`,
              [stdId, enr.name, cleanEmail, enr.phone || '', enr.city || '', cleanPassword]
            );
            // Refresh student object immediately
            student = await dbGetStudentByEmail(cleanEmail);
          }
        }
      } catch (syncErr) {
        console.error('Self-healing login sync error:', syncErr);
      }
    }

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'No registered student account found with this email. Please complete your enrollment first.' },
        { status: 404 }
      );
    }

    if (!student.isActive) {
      return NextResponse.json(
        { success: false, message: 'Your enrollment fee verification is currently pending approval. Please contact WhatsApp support for fast activation.' },
        { status: 403 }
      );
    }

    // Check password (matches student registered password or emergency admin bypass)
    const isPasswordValid = 
      student.password === cleanPassword || 
      cleanPassword === 'sami2026';

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Incorrect password. Please verify your password or contact support.' },
        { status: 401 }
      );
    }

    // Update last login in database
    await dbUpdateStudent(student.id, { lastLogin: new Date().toISOString() });

    // Generate signed session token (30 days)
    const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
    const sessionToken = signSessionToken({
      id: String(student.id),
      email: student.email,
      role: 'STUDENT',
      exp
    });

    const studentProfile = {
      id: student.id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      city: student.city,
      role: 'student'
    };

    const response = NextResponse.json({
      success: true,
      message: 'Login successful! Welcome to your LMS classroom.',
      user: studentProfile,
      token: sessionToken,
      redirectTo: '/lms'
    });

    // 1. Secure HTTP-only signed cookie for Next.js middleware & server auth
    response.cookies.set('sami_student_session', sessionToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    // 2. Client-readable cookie for instant frontend synchronization
    response.cookies.set('sami_student_auth', JSON.stringify(studentProfile), {
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
