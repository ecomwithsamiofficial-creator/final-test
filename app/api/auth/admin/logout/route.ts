import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Dedicated Admin Logout Endpoint (Explicitly triggered ONLY from Admin Dashboard)
export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Admin logged out successfully' });
  
  response.cookies.set('sami_admin_session', '', { path: '/', maxAge: 0 });
  response.cookies.set('sami_admin_active', '', { path: '/', maxAge: 0 });

  return response;
}

export async function GET() {
  const response = NextResponse.json({ success: true, message: 'Admin logged out successfully' });
  
  response.cookies.set('sami_admin_session', '', { path: '/', maxAge: 0 });
  response.cookies.set('sami_admin_active', '', { path: '/', maxAge: 0 });

  return response;
}
