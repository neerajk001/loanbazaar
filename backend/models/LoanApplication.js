// Collection name constant
const LOAN_APPLICATIONS_COLLECTION = 'loanApplications';

// Helper function to generate application ID
function generateLoanApplicationId(sequenceNumber) {
  const year = new Date().getFullYear();
  const paddedNumber = sequenceNumber.toString().padStart(5, '0');
  return `LOAN-${year}-${paddedNumber}`;
}

// Validation helper
function validateLoanApplication(data) {
  const errors = [];
  
  // Support both flat and nested payloads
  const fullName = data.fullName || data.customerName || data.personalInfo?.fullName;
  const mobileNumber = data.mobileNumber || data.mobileNo || data.personalInfo?.mobileNumber;
  
  if (!fullName || fullName.length < 2) {
    errors.push('Full name is required and must be at least 2 characters');
  }
  
  if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
    errors.push('Valid 10-digit mobile number is required');
  }
  
  // All other fields are optional for the simplified lead forms
  return {
    valid: errors.length === 0,
    errors
  };
}

// Get next sequence number for application ID
async function getNextLoanSequenceNumber(db) {
  const counterCollection = db.collection('counters');
  
  const result = await counterCollection.findOneAndUpdate(
    { _id: 'loanApplicationId' },
    { $inc: { sequence: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  
  return result.sequence;
}

module.exports = {
  LOAN_APPLICATIONS_COLLECTION,
  generateLoanApplicationId,
  validateLoanApplication,
  getNextLoanSequenceNumber,
};
