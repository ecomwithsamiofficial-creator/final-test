import { NextRequest, NextResponse } from 'next/server';
import { dbAddEnrollment, dbGetStudentByEmail, dbAddStudent, generateRandomNumericPassword } from '@/lib/database';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      fullName, 
      email, 
      phone, 
      city, 
      whereHeard, 
      paymentMethod, 
      transactionId, 
      receiptUrl 
    } = body;

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { success: false, message: 'Please provide full name, email, and phone number.' },
        { status: 400 }
      );
    }

    const trackingCode = `SAMI-ENR-${Math.floor(10000 + Math.random() * 90000)}`;
    const studentId = `std_${Date.now()}`;
    const uniquePassword = generateRandomNumericPassword();

    // Persist receipt image directly to disk & database
    let savedReceiptUrl = receiptUrl || '';
    if (receiptUrl && typeof receiptUrl === 'string' && receiptUrl.startsWith('data:image/')) {
      try {
        const parts = receiptUrl.split(';base64,');
        if (parts.length === 2 && parts[1]) {
          const rawBuffer = Buffer.from(parts[1].trim(), 'base64');
          let processedBuffer = rawBuffer;
          let ext = '.jpg';
          let mime = 'image/jpeg';

          try {
            const sharp = (await import('sharp')).default;
            processedBuffer = await sharp(rawBuffer)
              .rotate()
              .resize({
                width: 1400,
                height: 2200,
                fit: 'inside',
                withoutEnlargement: true,
              })
              .jpeg({ quality: 82, progressive: false })
              .toBuffer();
          } catch (sharpErr) {
            console.warn('Sharp processing fallback to raw buffer:', sharpErr);
          }

          const filename = `receipt_${trackingCode}_${Date.now()}${ext}`;
          const dir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          const filePath = path.join(dir, filename);
          fs.writeFileSync(filePath, processedBuffer);
          savedReceiptUrl = `/uploads/receipts/${filename}`;

          // Also save in MySQL media_uploads for permanent persistence
          try {
            const { mysqlSaveMediaUpload } = await import('@/lib/mysql');
            await mysqlSaveMediaUpload(filename, 'receipts', filename, mime, processedBuffer);
          } catch (mErr) {
            console.warn('Backup receipt to MySQL media error:', mErr);
          }
        }
      } catch (err) {
        console.error('Failed to save receipt file to disk:', err);
      }
    }

    // Add enrollment record to persistent database
    const enrollment = await dbAddEnrollment({
      id: `enr_${Date.now()}`,
      trackingCode,
      studentId,
      name: fullName,
      email,
      phone,
      city: city || 'Pakistan',
      paymentMethod: paymentMethod || 'Easypaisa',
      transactionId: transactionId || 'Pending Verification',
      whereHeard: whereHeard || 'TikTok',
      receiptUrl: savedReceiptUrl,
      amount: 'PKR 3,799',
      status: 'pending',
      createdAt: new Date().toISOString(),
      password: uniquePassword
    });

    // Check if student exists or create provisional student
    let student = await dbGetStudentByEmail(email);
    if (!student) {
      student = await dbAddStudent({
        id: studentId,
        name: fullName,
        email,
        phone,
        city: city || 'Pakistan',
        password: uniquePassword,
        isActive: false, // becomes active upon admin approval
        enrolledAt: new Date().toISOString().split('T')[0],
        completedLessons: []
      });
    }

    const adminPhone = '923330093269';
    const whatsappNotifyText = encodeURIComponent(
      `Hello Mentor Sami / Admin,\n\nI have submitted my enrollment application for UAE & KSA Shopify Dropshipping Mentorship.\n\n` +
      `📋 Tracking Code: ${trackingCode}\n` +
      `👤 Name: ${fullName}\n` +
      `📧 Email: ${email}\n` +
      `📱 Phone: ${phone}\n` +
      `💳 Payment Method: ${paymentMethod || 'Easypaisa'}\n` +
      `🔢 TID: ${transactionId || 'Attached in form'}\n\n` +
      `Please verify my payment proof slip and share my LMS Login password on WhatsApp.`
    );
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${whatsappNotifyText}`;

    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/admin');
      revalidatePath('/admin/enrollments');
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Enrollment application received! Admin will verify your payment slip and send your LMS password on WhatsApp.',
      trackingCode,
      enrollmentId: enrollment.id,
      loginUrl: '/login',
      studentEmail: email,
      enrollment: {
        ...enrollment,
        whatsappUrl
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache'
      }
    });
  } catch (error: any) {
    console.error('Enrollment submit error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to submit enrollment' },
      { status: 500 }
    );
  }
}
