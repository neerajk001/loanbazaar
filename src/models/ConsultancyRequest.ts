import { ObjectId } from 'mongodb';

export interface ConsultancyRequest {
  _id?: ObjectId;
  requestId: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  interestedIn: string;
  message?: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  statusHistory?: Array<{
    status: string;
    updatedAt: Date;
    updatedBy: string;
    notes?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string;
  source?: 'loan-sarathi' | 'smartmumbaisolutions' | 'web' | 'mobile' | 'agent';
}

export const CONSULTANCY_REQUESTS_COLLECTION = 'consultancyRequests';

export function generateConsultancyRequestId(sequenceNumber: number): string {
  const year = new Date().getFullYear();
  const paddedSequence = sequenceNumber.toString().padStart(5, '0');
  return `CONS-${year}-${paddedSequence}`;
}

export async function getNextConsultancySequenceNumber(db: any): Promise<number> {
  const countersCollection = db.collection('counters');
  
  const result = await countersCollection.findOneAndUpdate(
    { _id: 'consultancyRequest' },
    { $inc: { sequence: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  
  return result.sequence || 1;
}

export function validateConsultancyRequest(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.fullName || typeof data.fullName !== 'string' || data.fullName.trim().length < 2) {
    errors.push('Full name is required and must be at least 2 characters');
  }

  if (!data.phoneNumber || typeof data.phoneNumber !== 'string') {
    errors.push('Phone number is required');
  } else {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(data.phoneNumber.replace(/\D/g, ''))) {
      errors.push('Phone number must be a valid 10-digit number');
    }
  }

  if (data.email && typeof data.email === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Email must be a valid email address');
    }
  }

  if (!data.interestedIn || typeof data.interestedIn !== 'string' || data.interestedIn.trim().length === 0) {
    errors.push('Interested in field is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

