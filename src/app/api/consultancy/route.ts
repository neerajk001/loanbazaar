import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import {
  ConsultancyRequest,
  CONSULTANCY_REQUESTS_COLLECTION,
  generateConsultancyRequestId,
  getNextConsultancySequenceNumber,
  validateConsultancyRequest,
} from '@/models/ConsultancyRequest';
import { sendEmail } from '@/lib/email';
import { detectSource, isSourceAllowed } from '@/lib/source-detection';

// POST /api/consultancy - Submit a new consultancy request
// NOTE: This endpoint is ONLY available for loan-sarathi, NOT for smartmumbaisolutions
export async function POST(request: NextRequest) {
  try {
    // Detect source and check if allowed
    const source = detectSource(request);
    if (!isSourceAllowed(source, '/api/consultancy')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Consultancy service is not available for this source. This endpoint is only available for Loanbazaar.' 
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate the request data
    const validation = validateConsultancyRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }
    
    // Connect to database
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    
    // Generate unique request ID
    const sequenceNumber = await getNextConsultancySequenceNumber(db);
    const requestId = generateConsultancyRequestId(sequenceNumber);
    
    // Get client IP address
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    // Create consultancy request document
    const consultancyRequest: ConsultancyRequest = {
      requestId,
      fullName: body.fullName.trim(),
      phoneNumber: body.phoneNumber.replace(/\D/g, ''), // Remove non-digits
      email: body.email?.trim() || undefined,
      interestedIn: body.interestedIn.trim(),
      message: body.message?.trim() || undefined,
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          updatedAt: new Date(),
          updatedBy: 'system',
          notes: `Consultancy request submitted from ${source}`,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress,
      source: source,
    };
    
    // Insert into database
    const collection = db.collection<ConsultancyRequest>(CONSULTANCY_REQUESTS_COLLECTION);
    const result = await collection.insertOne(consultancyRequest);
    
    if (!result.acknowledged) {
      throw new Error('Failed to insert consultancy request');
    }
    
    // Send notification to admins
    try {
      const adminEmails = ['workwithneeraj.01@gmail.com', 'shashichanyal@gmail.com'];
      const subject = `New Consultancy Request: ${requestId}`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ea580c;">New Consultancy Request</h2>
          <p><strong>Request ID:</strong> ${requestId}</p>
          <p><strong>Name:</strong> ${body.fullName}</p>
          <p><strong>Phone:</strong> ${body.phoneNumber}</p>
          ${body.email ? `<p><strong>Email:</strong> ${body.email}</p>` : ''}
          <p><strong>Interested In:</strong> ${body.interestedIn}</p>
          ${body.message ? `<p><strong>Message:</strong> ${body.message}</p>` : ''}
          <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN')}</p>
        </div>
      `;
      
      for (const adminEmail of adminEmails) {
        await sendEmail({
          to: adminEmail,
          subject,
          html,
        });
      }
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
      // Don't fail the request if email fails
    }
    
    return NextResponse.json({
      success: true,
      requestId,
      message: 'Consultancy request submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting consultancy request:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

