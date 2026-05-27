// Collection name constant
const INSURANCE_APPLICATIONS_COLLECTION = 'insuranceApplications';

// Helper function to generate application ID
function generateInsuranceApplicationId(sequenceNumber) {
  const year = new Date().getFullYear();
  const paddedNumber = sequenceNumber.toString().padStart(5, '0');
  return `INS-${year}-${paddedNumber}`;
}

// Validation helper
function validateInsuranceApplication(data) {
  const errors = [];
  
  // Support both flat and nested payloads
  const fullName = data.fullName || data.customerName || data.basicInfo?.fullName;
  const mobileNumber = data.mobileNumber || data.mobileNo || data.basicInfo?.mobileNumber;
  
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
async function getNextInsuranceSequenceNumber(db) {
  const counterCollection = db.collection('counters');
  
  const result = await counterCollection.findOneAndUpdate(
    { _id: 'insuranceApplicationId' },
    { $inc: { sequence: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  
  return result.sequence;
}

module.exports = {
  INSURANCE_APPLICATIONS_COLLECTION,
  generateInsuranceApplicationId,
  validateInsuranceApplication,
  getNextInsuranceSequenceNumber,
};
