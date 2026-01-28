import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import {
  LoanApplication,
  LOAN_APPLICATIONS_COLLECTION,
  generateLoanApplicationId,
  getNextLoanSequenceNumber,
  validateLoanApplication,
} from '@/models/LoanApplication';
import {
  sendEmail,
  createLoanApplicationConfirmationEmail,
  createAdminNotificationEmail,
} from '@/lib/email';
import { detectSource } from '@/lib/source-detection';

// POST /api/applications/loan - Submit a new loan application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the application data
    const validation = validateLoanApplication(body);
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
    const sequenceNumber = await getNextLoanSequenceNumber(db);
    const applicationId = generateLoanApplicationId(sequenceNumber);
    
    // Get client IP address
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    // Detect source (loan-sarathi or smartmumbaisolutions)
    const source = detectSource(request);
    
    // Create application document
    const application: LoanApplication = {
      applicationId,
      userId: undefined,
      userEmail: body.personalInfo.email,
      loanType: body.loanType,
      personalInfo: {
        ...body.personalInfo,
        dob: new Date(body.personalInfo.dob),
      },
      employmentInfo: body.employmentInfo,
      businessDetails: body.businessDetails,
      propertyDetails: body.propertyDetails,
      loanRequirement: body.loanRequirement,
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          updatedAt: new Date(),
          updatedBy: 'system',
          notes: `Application submitted from ${source}`,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress,
      source: source,
    };
    
    // Insert into database
    const collection = db.collection<LoanApplication>(LOAN_APPLICATIONS_COLLECTION);
    const result = await collection.insertOne(application);
    
    if (!result.acknowledged) {
      throw new Error('Failed to insert application');
    }
    
    // Send confirmation email to applicant
    try {
      const confirmationEmail = createLoanApplicationConfirmationEmail(
        body.personalInfo.fullName,
        applicationId,
        body.personalInfo.email,
        body.loanType,
        body.loanRequirement.loanAmount
      );
      await sendEmail(confirmationEmail);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }
    
    // Send notification to admins
    try {
      const adminEmails = ['workwithneeraj.01@gmail.com', 'shashichanyal@gmail.com'];
      for (const adminEmail of adminEmails) {
        const adminEmail_notification = createAdminNotificationEmail(
          adminEmail,
          applicationId,
          body.personalInfo.fullName,
          'loan'
        );
        await sendEmail(adminEmail_notification);
      }
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
    }
    
    // Return success response with application ID
    return NextResponse.json(
      {
        success: true,
        applicationId,
        message: 'Application submitted successfully',
        data: {
          applicationId,
          status: 'pending',
          createdAt: application.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting loan application:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit application. Please try again.',
      },
      { status: 500 }
    );
  }
}


