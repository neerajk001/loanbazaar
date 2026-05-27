const express = require('express');
const router = express.Router();
const clientPromise = require('../config/database');
const {
  LOAN_APPLICATIONS_COLLECTION,
  generateLoanApplicationId,
  getNextLoanSequenceNumber,
  validateLoanApplication,
} = require('../models/LoanApplication');
const {
  INSURANCE_APPLICATIONS_COLLECTION,
  generateInsuranceApplicationId,
  getNextInsuranceSequenceNumber,
  validateInsuranceApplication,
} = require('../models/InsuranceApplication');
const {
  sendEmail,
  createLoanApplicationConfirmationEmail,
  createInsuranceApplicationConfirmationEmail,
  createAdminNotificationEmail,
} = require('../utils/email');
const { detectSource } = require('../utils/sourceDetection');

// POST /api/applications/loan - Submit a new loan application
router.post('/loan', async (req, res) => {
  try {
    const body = req.body;
    
    // Support flat payload from quick application forms
    if (!body.personalInfo) body.personalInfo = {};
    if (!body.employmentInfo) body.employmentInfo = {};
    
    if (body.customerName || body.fullName) {
      body.personalInfo.fullName = body.customerName || body.fullName;
    }
    if (body.mobileNo || body.mobileNumber) {
      body.personalInfo.mobileNumber = body.mobileNo || body.mobileNumber;
    }
    if (body.employmentType) {
      body.employmentInfo.employmentType = body.employmentType.toLowerCase();
    }
    if (body.annualIncome) {
      body.employmentInfo.annualIncome = body.annualIncome;
    }

    // Normalize loanType and set default fallbacks for simplified lead forms
    if (body.loanType) {
      let mappedType = body.loanType.toLowerCase();
      if (mappedType === 'personal-loan') mappedType = 'personal';
      else if (mappedType === 'business-loan') mappedType = 'business';
      else if (mappedType === 'home-loan') mappedType = 'home';
      else if (mappedType === 'mortgage-loan' || mappedType === 'lap') mappedType = 'lap';
      else if (mappedType === 'car-loan') mappedType = 'car';
      else if (mappedType === 'education-loan') mappedType = 'education';
      body.loanType = mappedType;
    }

    if (!body.personalInfo) body.personalInfo = {};
    if (!body.employmentInfo) body.employmentInfo = {};

    // Note: We've removed all fallback generation. We only store what the frontend sends.

    
    // Validate the application data
    const validation = validateLoanApplication(body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors
      });
    }
    
    // Connect to database
    const client = await clientPromise;
    const db = client.db('loanbaazaar');
    
    // Generate unique application ID
    const sequenceNumber = await getNextLoanSequenceNumber(db);
    const applicationId = generateLoanApplicationId(sequenceNumber);
    
    // Get client IP address
    const ipAddress = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.ip ||
                     'unknown';
    
    // Detect source (loan-sarathi or smartmumbaisolutions)
    const source = detectSource(req);
    
    // Create application document
    const application = {
      applicationId,
      userId: undefined,
      userEmail: body.personalInfo.email,
      loanType: body.loanType,
      personalInfo: {
        ...body.personalInfo,
        dob: body.personalInfo.dob ? new Date(body.personalInfo.dob) : undefined,
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
    const collection = db.collection(LOAN_APPLICATIONS_COLLECTION);
    const result = await collection.insertOne(application);
    
    if (!result.acknowledged) {
      throw new Error('Failed to insert application');
    }
    
    // Send confirmation email to applicant if email is provided
    try {
      if (body.personalInfo.email) {
        const confirmationEmail = createLoanApplicationConfirmationEmail(
          body.personalInfo.fullName,
          applicationId,
          body.personalInfo.email,
          body.loanType,
          body.loanRequirement?.loanAmount || 'As requested'
        );
        await sendEmail(confirmationEmail);
      }
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }
    
    // Send notification to admins
    try {
      const adminEmails = ['workwithneeraj.01@gmail.com', 'shashichanyal@gmail.com'];
      for (const adminEmail of adminEmails) {
        const adminEmailNotification = createAdminNotificationEmail(
          adminEmail,
          applicationId,
          body.personalInfo.fullName,
          'loan'
        );
        await sendEmail(adminEmailNotification);
      }
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
    }
    
    // Return success response with application ID
    return res.status(201).json({
      success: true,
      applicationId,
      message: 'Application submitted successfully',
      data: {
        applicationId,
        status: 'pending',
        createdAt: application.createdAt,
      },
    });
  } catch (error) {
    console.error('Error submitting loan application:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit application. Please try again.',
    });
  }
});

// POST /api/applications/insurance - Submit a new insurance application
router.post('/insurance', async (req, res) => {
  try {
    const body = req.body;
    
    // Support flat payload from quick application forms
    if (!body.basicInfo) body.basicInfo = {};
    if (!body.employmentInfo) body.employmentInfo = {};
    
    if (body.customerName || body.fullName) {
      body.basicInfo.fullName = body.customerName || body.fullName;
    }
    if (body.mobileNo || body.mobileNumber) {
      body.basicInfo.mobileNumber = body.mobileNo || body.mobileNumber;
    }
    if (body.employmentType) {
      body.employmentInfo.employmentType = body.employmentType.toLowerCase();
    }
    if (body.annualIncome) {
      body.employmentInfo.annualIncome = body.annualIncome;
    }

    // Normalize insuranceType and set default fallbacks for simplified lead forms
    if (body.insuranceType) {
      let mappedType = body.insuranceType.toLowerCase();
      if (mappedType === 'health-insurance') mappedType = 'health';
      else if (mappedType === 'car-insurance') mappedType = 'car';
      else if (mappedType === 'bike-insurance') mappedType = 'bike';
      body.insuranceType = mappedType;
    }

    if (!body.basicInfo) body.basicInfo = {};
    if (!body.employmentInfo) body.employmentInfo = {};

    // Note: We've removed all fallback generation. We only store what the frontend sends.


    // Validate the application data
    const validation = validateInsuranceApplication(body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors
      });
    }
    
    // Connect to database
    const client = await clientPromise;
    const db = client.db('loanbaazaar');
    
    // Generate unique application ID
    const sequenceNumber = await getNextInsuranceSequenceNumber(db);
    const applicationId = generateInsuranceApplicationId(sequenceNumber);
    
    // Get client IP address
    const ipAddress = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.ip ||
                     'unknown';
    
    // Detect source
    const source = detectSource(req);
    
    // Create application document
    const application = {
      applicationId,
      userId: undefined,
      userEmail: body.basicInfo.email,
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
          notes: `Application submitted from ${source}`,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress,
      source: source,
    };
    
    // Insert into database
    const collection = db.collection(INSURANCE_APPLICATIONS_COLLECTION);
    const result = await collection.insertOne(application);
    
    if (!result.acknowledged) {
      throw new Error('Failed to insert application');
    }
    
    // Send confirmation email to applicant if email is provided
    try {
      if (body.basicInfo.email) {
        const confirmationEmail = createInsuranceApplicationConfirmationEmail(
          body.basicInfo.fullName,
          applicationId,
          body.basicInfo.email,
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
        const adminEmailNotification = createAdminNotificationEmail(
          adminEmail,
          applicationId,
          body.basicInfo.fullName,
          'insurance'
        );
        await sendEmail(adminEmailNotification);
      }
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
    }
    
    // Return success response
    return res.status(201).json({
      success: true,
      applicationId,
      message: 'Insurance application submitted successfully',
      data: {
        applicationId,
        status: 'pending',
        createdAt: application.createdAt,
      },
    });
  } catch (error) {
    console.error('Error submitting insurance application:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit application. Please try again.',
    });
  }
});

module.exports = router;
