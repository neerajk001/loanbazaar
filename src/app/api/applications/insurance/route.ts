import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import {
  InsuranceApplication,
  INSURANCE_APPLICATIONS_COLLECTION,
  generateInsuranceApplicationId,
  getNextInsuranceSequenceNumber,
  validateInsuranceApplication,
} from '@/models/InsuranceApplication';
import {
  sendEmail,
  createInsuranceApplicationConfirmationEmail,
  createAdminNotificationEmail,
} from '@/lib/email';
import { detectSource } from '@/lib/source-detection';
import { applyRateLimit } from '@/lib/rate-limit';

// POST /api/applications/insurance - Submit a new insurance application
export async function POST(request: NextRequest) {
  const rateLimitResult = applyRateLimit(request, { interval: 60000, maxRequests: 5 });
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      { status: 429, headers: rateLimitResult.headers }
    );
  }

  try {
    const body = await request.json();
    
    // Validate the application data
    const validation = validateInsuranceApplication(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }
    
    // Connect to database
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    
    // Generate unique application ID
    const sequenceNumber = await getNextInsuranceSequenceNumber(db);
    const applicationId = generateInsuranceApplicationId(sequenceNumber);
    
    // Get client IP address
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    // Detect source (loan-sarathi or smartmumbaisolutions)
    const source = detectSource(request);
    
    // Extract from flat or nested payload safely
    const fullName = body.fullName || body.basicInfo?.fullName || 'Unknown';
    const mobileNumber = body.mobileNumber || body.basicInfo?.mobileNumber || 'Unknown';
    const email = body.email || body.basicInfo?.email || `${mobileNumber}@temp.com`;
    const dob = body.basicInfo?.dob ? new Date(body.basicInfo.dob) : new Date();
    const parsedAnnualIncome = Number(body.annualIncome);
    const annualIncome = !isNaN(parsedAnnualIncome) && parsedAnnualIncome > 0 ? parsedAnnualIncome : 0;

    // Create application document
    const application: InsuranceApplication = {
      applicationId,
      userId: undefined,
      userEmail: email,
      insuranceType: body.insuranceType || 'health',
      basicInfo: {
        fullName,
        mobileNumber,
        dob,
      },
      sumInsured: body.sumInsured || annualIncome || 100000,
      vehicleInfo: body.vehicleInfo,
      loanInfo: body.loanInfo,
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          updatedAt: new Date(),
          updatedBy: 'system',
          notes: `Quote request submitted from ${source}`,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress,
      source: source,
    };
    
    // Insert into database
    const collection = db.collection<InsuranceApplication>(INSURANCE_APPLICATIONS_COLLECTION);
    const result = await collection.insertOne(application);
    
    if (!result.acknowledged) {
      throw new Error('Failed to insert application');
    }
    
    // Send confirmation email (if email available)
    try {
      if (email && email.includes('@')) {
        const confirmationEmail = createInsuranceApplicationConfirmationEmail(
          fullName,
          applicationId,
          email,
          body.insuranceType || 'health'
        );
        await sendEmail(confirmationEmail);
      }
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }
    
    // Send notification to admins
    try {
      const adminEmails = ['workwithneeraj.01@gmail.com', 'shashichanyal@gmail.com'];
      for (const adminEmail of adminEmails) {
        const adminNotification = createAdminNotificationEmail(
          adminEmail,
          applicationId,
          fullName,
          'insurance'
        );
        await sendEmail(adminNotification);
      }
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
    }
    
    // Return success response with application ID
    return NextResponse.json(
      {
        success: true,
        applicationId,
        message: 'Quote request submitted successfully',
        data: {
          applicationId,
          status: 'pending',
          createdAt: application.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting insurance application:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit quote request. Please try again.',
      },
      { status: 500 }
    );
  }
}


