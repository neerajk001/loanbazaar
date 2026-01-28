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

// POST /api/applications/insurance - Submit a new insurance application
export async function POST(request: NextRequest) {
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
    
    // Create application document
    const application: InsuranceApplication = {
      applicationId,
      userId: undefined,
      userEmail: body.basicInfo.email || `${body.basicInfo.mobileNumber}@temp.com`,
      insuranceType: body.insuranceType,
      basicInfo: {
        ...body.basicInfo,
        dob: body.basicInfo.dob ? new Date(body.basicInfo.dob) : undefined,
      },
      sumInsured: body.sumInsured,
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
      const email = body.basicInfo.email;
      if (email) {
        const confirmationEmail = createInsuranceApplicationConfirmationEmail(
          body.basicInfo.fullName,
          applicationId,
          email,
          body.insuranceType
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
          body.basicInfo.fullName,
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


