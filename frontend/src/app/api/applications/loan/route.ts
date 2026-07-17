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
import { applyRateLimit } from '@/lib/rate-limit';

// POST /api/applications/loan - Submit a new loan application
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
    
    // Extract from flat or nested payload safely
    const fullName = body.fullName || body.personalInfo?.fullName || 'Unknown';
    const mobileNumber = body.mobileNumber || body.personalInfo?.mobileNumber || 'Unknown';
    const email = body.email || body.personalInfo?.email || `lead+${mobileNumber}@temp.com`;
    const employmentType = body.employmentType || body.employmentInfo?.employmentType || 'salaried';
    const parsedAnnualIncome = Number(body.annualIncome);
    const annualIncome = !isNaN(parsedAnnualIncome) && parsedAnnualIncome > 0 
      ? parsedAnnualIncome 
      : (body.employmentInfo?.monthlyIncome ? body.employmentInfo.monthlyIncome * 12 : 0);
    const dob = body.personalInfo?.dob ? new Date(body.personalInfo.dob) : new Date();

    // Create application document
    const application: LoanApplication = {
      applicationId,
      userId: undefined,
      userEmail: email,
      loanType: body.loanType || 'personal',
      personalInfo: {
        fullName,
        mobileNumber,
        email,
        pincode: body.personalInfo?.pincode || '000000',
        dob,
        city: body.personalInfo?.city || 'Unknown',
        panCard: body.personalInfo?.panCard || 'XXXXX0000X',
      },
      employmentInfo: {
        employmentType,
        monthlyIncome: Math.round(annualIncome / 12),
        employerName: body.employmentInfo?.employerName || 'NA',
        existingEmi: body.employmentInfo?.existingEmi || 0,
      },
      businessDetails: body.businessDetails,
      propertyDetails: body.propertyDetails,
      loanRequirement: body.loanRequirement || {
        loanAmount: annualIncome || 100000,
        tenure: 5,
        loanPurpose: 'General'
      },
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
        fullName,
        applicationId,
        email,
        body.loanType || 'personal',
        application.loanRequirement.loanAmount
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
          fullName,
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


