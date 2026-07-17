import { ObjectId } from 'mongodb';

export interface BasicInfo {
  fullName: string;
  mobileNumber: string;
  dob?: Date; // Optional for loan-protector (uses age instead)
  age?: number; // For loan-protector
}

export interface VehicleInfo {
  pincode: string;
  vehicleNumber: string;
  policyTerm: number;
}

export interface LoanInfo {
  loanType: string;
  loanAmount: number;
  tenure: number;
}

export interface StatusHistoryEntry {
  status: InsuranceApplicationStatus;
  updatedAt: Date;
  updatedBy: string;
  updatedByEmail?: string;
  notes?: string;
}

export type InsuranceApplicationStatus = 'pending' | 'quote-sent' | 'in-review' | 'purchased' | 'rejected';
export type InsuranceType = 'health' | 'term-life' | 'car' | 'bike' | 'loan-protector' | 'emi-protector';

export interface InsuranceApplication {
  _id?: ObjectId;
  applicationId: string; // e.g., "INS-2025-00001"
  userId?: string;
  userEmail?: string;
  insuranceType: InsuranceType;
  
  // Basic Information
  basicInfo: BasicInfo;
  
  // Type-specific fields
  sumInsured?: number; // For health & term-life
  vehicleInfo?: VehicleInfo; // For car & bike
  loanInfo?: LoanInfo; // For loan-protector & emi-protector
  
  // Status & Tracking
  status: InsuranceApplicationStatus;
  statusHistory: StatusHistoryEntry[];
  
  // Quote Information (set by admin)
  quotedPremium?: number;
  quoteSentAt?: Date;
  quoteSentBy?: string;
  
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
export const INSURANCE_APPLICATIONS_COLLECTION = 'insuranceApplications';

// Helper function to generate application ID
export function generateInsuranceApplicationId(sequenceNumber: number): string {
  const year = new Date().getFullYear();
  const paddedNumber = sequenceNumber.toString().padStart(5, '0');
  return `INS-${year}-${paddedNumber}`;
}

// Validation helper
export function validateInsuranceApplication(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const fullName = data.fullName || data.basicInfo?.fullName;
  const mobileNumber = data.mobileNumber || data.basicInfo?.mobileNumber;

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
export async function getNextInsuranceSequenceNumber(db: any): Promise<number> {
  const counterCollection = db.collection('counters');
  
  const result = await counterCollection.findOneAndUpdate(
    { _id: 'insuranceApplicationId' },
    { $inc: { sequence: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  
  return result.sequence;
}
