import { ObjectId } from 'mongodb';

export interface PersonalInfo {
  fullName: string;
  mobileNumber: string;
  email: string;
  pincode: string;
  dob: Date;
  city: string;
  panCard: string;
}

export interface EmploymentInfo {
  employmentType: 'salaried' | 'self-employed';
  monthlyIncome: number;
  employerName: string;
  existingEmi: number;
}

export interface BusinessDetails {
  businessType: 'proprietorship' | 'partnership' | 'private_ltd' | 'llp';
  turnover: number;
  yearsInBusiness: number;
  gstRegistered: boolean;
}

export interface PropertyDetails {
  propertyCost?: number;
  propertyLoanType?: string;
  propertyCity?: string;
  propertyStatus?: string;
  propertyType?: string;
  currentMarketValue?: number;
  occupancyStatus?: string;
}

export interface LoanRequirement {
  loanAmount: number;
  tenure: number;
  loanPurpose: string;
}

export interface StatusHistoryEntry {
  status: ApplicationStatus;
  updatedAt: Date;
  updatedBy: string;
  updatedByEmail?: string;
  notes?: string;
}

export type ApplicationStatus = 'pending' | 'reviewing' | 'verified' | 'approved' | 'rejected' | 'disbursed';
export type LoanType = 'personal' | 'business' | 'home' | 'lap';

export interface LoanApplication {
  _id?: ObjectId;
  applicationId: string; // e.g., "LOAN-2025-00001"
  userId?: string; // For logged-in users
  userEmail?: string;
  loanType: LoanType;
  
  // Core Information
  personalInfo: PersonalInfo;
  employmentInfo: EmploymentInfo;
  
  // Conditional: Business Loan
  businessDetails?: BusinessDetails;
  
  // Conditional: Home/LAP
  propertyDetails?: PropertyDetails;
  
  // Loan Requirement
  loanRequirement: LoanRequirement;
  
  // Status & Tracking
  status: ApplicationStatus;
  statusHistory: StatusHistoryEntry[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string;
  source: 'loan-sarathi' | 'smartmumbaisolutions' | 'web' | 'mobile' | 'agent';
  
  // Admin Notes
  adminNotes?: string;
  assignedTo?: string;
}

// Collection name constant
export const LOAN_APPLICATIONS_COLLECTION = 'loanApplications';

// Helper function to generate application ID
export function generateLoanApplicationId(sequenceNumber: number): string {
  const year = new Date().getFullYear();
  const paddedNumber = sequenceNumber.toString().padStart(5, '0');
  return `LOAN-${year}-${paddedNumber}`;
}

// Validation helper
export function validateLoanApplication(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const fullName = data.fullName || data.personalInfo?.fullName;
  const mobileNumber = data.mobileNumber || data.personalInfo?.mobileNumber;
  
  if (!fullName || fullName.length < 2) {
    errors.push('Full name is required and must be at least 2 characters');
  }
  
  if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
    errors.push('Valid 10-digit mobile number is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Get next sequence number for application ID
export async function getNextLoanSequenceNumber(db: any): Promise<number> {
  const counterCollection = db.collection('counters');
  
  const result = await counterCollection.findOneAndUpdate(
    { _id: 'loanApplicationId' },
    { $inc: { sequence: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  
  return result.sequence;
}
