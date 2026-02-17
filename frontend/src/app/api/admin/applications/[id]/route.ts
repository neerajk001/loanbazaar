import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { LOAN_APPLICATIONS_COLLECTION, LoanApplication } from '@/models/LoanApplication';
import { INSURANCE_APPLICATIONS_COLLECTION, InsuranceApplication } from '@/models/InsuranceApplication';
import { sendEmail, createStatusUpdateEmail } from '@/lib/email';

// GET /api/admin/applications/[id] - Get single application details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  // Note: Add proper admin authentication if needed

  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const resolvedParams = await Promise.resolve(params);
    const applicationId = resolvedParams.id;

    // Try to find in loan applications
    const loanCollection = db.collection<LoanApplication>(LOAN_APPLICATIONS_COLLECTION);
    const loanApp = await loanCollection.findOne({ applicationId });

    if (loanApp) {
      return NextResponse.json({
        success: true,
        application: {
          ...loanApp,
          type: 'loan',
        },
      });
    }

    // Try to find in insurance applications
    const insuranceCollection = db.collection<InsuranceApplication>(INSURANCE_APPLICATIONS_COLLECTION);
    const insuranceApp = await insuranceCollection.findOne({ applicationId });

    if (insuranceApp) {
      return NextResponse.json({
        success: true,
        application: {
          ...insuranceApp,
          type: 'insurance',
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Application not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/applications/[id] - Update application status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  // Note: Add proper admin authentication if needed

  try {
    const body = await request.json();
    const { status, notes, adminNotes } = body;
    const resolvedParams = await Promise.resolve(params);
    const applicationId = resolvedParams.id;

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('loan-sarathi');

    // Create status history entry
    const statusEntry = {
      status,
      updatedAt: new Date(),
      updatedBy: 'Admin',
      updatedByEmail: 'admin',
      notes: notes || '',
    };

    // Try to update loan application
    const loanCollection = db.collection<LoanApplication>(LOAN_APPLICATIONS_COLLECTION);
    const loanApp = await loanCollection.findOne({ applicationId });

    if (loanApp) {
      const updateData: any = {
        status,
        updatedAt: new Date(),
        $push: { statusHistory: statusEntry },
      };

      if (adminNotes) {
        updateData.adminNotes = adminNotes;
      }

      const result = await loanCollection.updateOne(
        { applicationId },
        {
          $set: { status, updatedAt: new Date(), ...(adminNotes && { adminNotes }) },
          $push: { statusHistory: statusEntry as any },
        }
      );

      if (result.modifiedCount > 0) {
        // Send email notification
        try {
          const emailNotification = createStatusUpdateEmail(
            loanApp.personalInfo.fullName,
            applicationId,
            loanApp.personalInfo.email,
            loanApp.status,
            status,
            notes
          );
          await sendEmail(emailNotification);
        } catch (emailError) {
          console.error('Failed to send status update email:', emailError);
        }

        return NextResponse.json({
          success: true,
          message: 'Application status updated successfully',
        });
      }
    }

    // Try to update insurance application
    const insuranceCollection = db.collection<InsuranceApplication>(INSURANCE_APPLICATIONS_COLLECTION);
    const insuranceApp = await insuranceCollection.findOne({ applicationId });

    if (insuranceApp) {
      const result = await insuranceCollection.updateOne(
        { applicationId },
        {
          $set: { status, updatedAt: new Date(), ...(adminNotes && { adminNotes }) },
          $push: { statusHistory: statusEntry as any },
        }
      );

      if (result.modifiedCount > 0) {
        // Send email notification if email available
        try {
          if (insuranceApp.userEmail && !insuranceApp.userEmail.includes('@temp.com')) {
            const emailNotification = createStatusUpdateEmail(
              insuranceApp.basicInfo.fullName,
              applicationId,
              insuranceApp.userEmail,
              insuranceApp.status,
              status,
              notes
            );
            await sendEmail(emailNotification);
          }
        } catch (emailError) {
          console.error('Failed to send status update email:', emailError);
        }

        return NextResponse.json({
          success: true,
          message: 'Application status updated successfully',
        });
      }
    }

    return NextResponse.json(
      { success: false, error: 'Application not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/applications/[id] - Delete application (optional)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  // Note: Add proper admin authentication if needed

  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const resolvedParams = await Promise.resolve(params);
    const applicationId = resolvedParams.id;

    // Try to delete from loan applications
    const loanCollection = db.collection<LoanApplication>(LOAN_APPLICATIONS_COLLECTION);
    const loanResult = await loanCollection.deleteOne({ applicationId });

    if (loanResult.deletedCount > 0) {
      return NextResponse.json({
        success: true,
        message: 'Application deleted successfully',
      });
    }

    // Try to delete from insurance applications
    const insuranceCollection = db.collection<InsuranceApplication>(INSURANCE_APPLICATIONS_COLLECTION);
    const insuranceResult = await insuranceCollection.deleteOne({ applicationId });

    if (insuranceResult.deletedCount > 0) {
      return NextResponse.json({
        success: true,
        message: 'Application deleted successfully',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Application not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
