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
  
  // Basic Info validation
  if (!data.basicInfo?.fullName || data.basicInfo.fullName.length < 2) {
    errors.push('Full name is required and must be at least 2 characters');
  }
  
  if (!data.basicInfo?.mobileNumber || !/^\d{10}$/.test(data.basicInfo.mobileNumber)) {
    errors.push('Valid 10-digit mobile number is required');
  }
  
  // DOB or Age validation based on insurance type
  if (data.insuranceType === 'loan-protector') {
    if (!data.basicInfo?.age || data.basicInfo.age < 18 || data.basicInfo.age > 100) {
      errors.push('Age is required and must be between 18 and 100');
    }
  } else {
    if (!data.basicInfo?.dob) {
      errors.push('Date of birth is required');
    }
  }
  
  // Type-specific validation
  if (data.insuranceType === 'health' || data.insuranceType === 'term-life') {
    if (!data.sumInsured || data.sumInsured < 100000) {
      errors.push('Sum insured must be at least ₹1,00,000');
    }
  }
  
  if (data.insuranceType === 'car' || data.insuranceType === 'bike') {
    if (!data.vehicleInfo?.pincode || !/^\d{6}$/.test(data.vehicleInfo.pincode)) {
      errors.push('Valid 6-digit pincode is required');
    }
    
    if (!data.vehicleInfo?.vehicleNumber || !/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/.test(data.vehicleInfo.vehicleNumber)) {
      errors.push('Valid vehicle number is required (e.g., MH12AB1234)');
    }
    
    if (!data.vehicleInfo?.policyTerm || data.vehicleInfo.policyTerm < 1 || data.vehicleInfo.policyTerm > 3) {
      errors.push('Policy term must be between 1 and 3 years');
    }
  }
  
  if (data.insuranceType === 'loan-protector' || data.insuranceType === 'emi-protector') {
    if (!data.loanInfo?.loanType) {
      errors.push('Loan type is required');
    }
    
    if (!data.loanInfo?.loanAmount || data.loanInfo.loanAmount < 100000) {
      errors.push('Loan amount must be at least ₹1,00,000');
    }
    
    if (!data.loanInfo?.tenure || data.loanInfo.tenure < 1 || data.loanInfo.tenure > 30) {
      errors.push('Tenure must be between 1 and 30 years');
    }
  }
  
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
