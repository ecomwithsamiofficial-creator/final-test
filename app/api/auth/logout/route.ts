import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Student Logout Endpoint (Strictly Clears Student Session Only, NEVER Touches Admin Session)
export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Student logged out successfully' });
  
  response.cookies.set('sami_student_session', '', { path: '/', maxAge: 0 });
  response.cookies.set('sami_student_auth', '', { path: '/', maxAge: 0 });

  return response;
}

export async function GET() {
  const response = NextResponse.json({ success: true, message: 'Student logged out successfully' });
  
  response.cookies.set('sami_student_session', '', { path: '/', maxAge: 0 });
  response.cookies.set('sami_student_auth', '', { path: '/', maxAge: 0 });

  return response;
}
