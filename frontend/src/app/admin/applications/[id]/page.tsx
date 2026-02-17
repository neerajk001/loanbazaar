'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Check, 
  X, 
  Loader2,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Building2,
  Wallet,
  Home,
  FileText,
  Clock,
  Edit,
  Save,
  X as XIcon,
  Globe
} from 'lucide-react';

interface ApplicationDetail {
  applicationId?: string;
  requestId?: string;
  type?: 'loan' | 'insurance' | 'consultancy';
  status: string;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  interestedIn?: string;
  message?: string;
  personalInfo?: {
    fullName: string;
    mobileNumber: string;
    email: string;
    pincode: string;
    dob?: Date | string;
    city: string;
    panCard: string;
  };
  basicInfo?: {
    fullName: string;
    mobileNumber: string;
    dob?: Date | string;
    age?: number;
  };
  employmentInfo?: {
    employmentType: string;
    monthlyIncome: number;
    employerName: string;
    existingEmi: number;
  };
  businessDetails?: {
    businessType: string;
    turnover: number;
    yearsInBusiness: number;
    gstRegistered: boolean;
  };
  propertyDetails?: {
    propertyCost?: number;
    currentMarketValue?: number;
    propertyLoanType?: string;
    propertyType?: string;
    propertyCity: string;
    propertyStatus?: string;
    occupancyStatus?: string;
  };
  loanRequirement?: {
    loanAmount: number;
    tenure: number;
    loanPurpose: string;
  };
  loanType?: string;
  insuranceType?: string;
  sumInsured?: number;
  vehicleInfo?: {
    pincode: string;
    vehicleNumber: string;
    policyTerm: number;
  };
  loanInfo?: {
    loanType: string;
    loanAmount: number;
    tenure: number;
  };
  statusHistory?: Array<{
    status: string;
    updatedAt: Date | string;
    updatedBy: string;
    notes?: string;
  }>;
  createdAt: Date | string;
  updatedAt: Date | string;
  userEmail?: string;
  source?: string;
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;
  
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', notes: '' });
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  const fetchApplication = async () => {
    setLoading(true);
    setError('');
    try {
      // Try to fetch as application first
      let response = await fetch(`/api/admin/applications/${applicationId}`);
      
      if (response.status === 404) {
        // If not found, try as consultancy request
        response = await fetch(`/api/admin/consultancy/${applicationId}`);
      }
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Unauthorized. Please login as admin.');
          setLoading(false);
          return;
        }
        if (response.status === 404) {
          setError('Application/Request not found');
          setLoading(false);
          return;
        }
      }

      const data = await response.json();
      
      console.log('API Response:', data); // Debug log

      if (data.success && (data.application || data.request)) {
        // Handle both application and consultancy request
        const item = data.application || data.request;
        const app = { ...item };
        
        // If it's a consultancy request, normalize the structure
        if (data.request) {
          app.type = 'consultancy';
          app.applicationId = app.requestId;
        }
        
        // Handle personalInfo dates
        if (app.personalInfo?.dob) {
          if (typeof app.personalInfo.dob === 'string') {
            app.personalInfo.dob = new Date(app.personalInfo.dob);
          }
        }
        
        // Handle basicInfo dates
        if (app.basicInfo?.dob) {
          if (typeof app.basicInfo.dob === 'string') {
            app.basicInfo.dob = new Date(app.basicInfo.dob);
          }
        }
        
        // Handle main dates
        if (app.createdAt && typeof app.createdAt === 'string') {
          app.createdAt = new Date(app.createdAt);
        }
        if (app.updatedAt && typeof app.updatedAt === 'string') {
          app.updatedAt = new Date(app.updatedAt);
        }
        
        // Handle status history dates
        if (app.statusHistory && Array.isArray(app.statusHistory)) {
          app.statusHistory = app.statusHistory.map((entry: any) => ({
            ...entry,
            updatedAt: typeof entry.updatedAt === 'string' ? new Date(entry.updatedAt) : entry.updatedAt,
          }));
        }
        
        console.log('Processed Application:', app); // Debug log
        setApplication(app);
      } else {
        console.error('API Error:', data); // Debug log
        setError(data.error || 'Application/Request not found');
      }
    } catch (err) {
      console.error('Error fetching application:', err);
      setError('Failed to load application details. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!statusUpdate.status) {
      alert('Please select a status');
      return;
    }

    setIsUpdating(true);
    try {
      // Determine which API to call based on application type
      const isConsultancy = application?.type === 'consultancy' || application?.requestId;
      const apiUrl = isConsultancy 
        ? `/api/admin/consultancy/${applicationId}`
        : `/api/admin/applications/${applicationId}`;
      
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusUpdate.status,
          notes: statusUpdate.notes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowStatusModal(false);
        setStatusUpdate({ status: '', notes: '' });
        fetchApplication(); // Refresh data
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
      case 'disbursed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'reviewing':
      case 'in-review':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'quote-sent':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'purchased':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return 'N/A';
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getSourceBadge = (source?: string) => {
    const appSource = source || 'loan-sarathi';
    if (appSource === 'smartmumbaisolutions') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold bg-orange-100 text-orange-700 border border-orange-200">
          <Globe className="w-4 h-4" />
          Smart Mumbai Solutions
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-200">
        <Globe className="w-4 h-4" />
        Loanbazaar
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Applications
        </button>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-700 font-semibold mb-2">{error || 'Application not found'}</p>
          <p className="text-sm text-red-600">Application ID: {applicationId}</p>
          <p className="text-xs text-red-500 mt-2">Please check if the application ID is correct and you have admin access.</p>
        </div>
      </div>
    );
  }

  const isLoan = application.type === 'loan';
  const isConsultancy = application.type === 'consultancy';
  const personalInfo = isLoan ? application.personalInfo : application.basicInfo;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-gray-500">Application ID: {application.applicationId}</p>
              {getSourceBadge(application.source)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusStyle(application.status)}`}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1).replace('-', ' ')}
          </span>
          <button
            onClick={() => setShowStatusModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Update Status
          </button>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Update Status</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={statusUpdate.status}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                >
                  <option value="">Select status</option>
                  {isConsultancy ? (
                    <>
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </>
                  ) : isLoan ? (
                    <>
                      <option value="pending">Pending</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="approved">Approved</option>
                      <option value="disbursed">Disbursed</option>
                      <option value="rejected">Rejected</option>
                    </>
                  ) : (
                    <>
                      <option value="pending">Pending</option>
                      <option value="in-review">In Review</option>
                      <option value="quote-sent">Quote Sent</option>
                      <option value="purchased">Purchased</option>
                      <option value="rejected">Rejected</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={statusUpdate.notes}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none resize-none"
                  placeholder="Add any notes about this status update..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={isUpdating || !statusUpdate.status}
                  className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal/Basic Information or Consultancy Request Info */}
        {isConsultancy ? (
          <div className="bg-white border border-gray-900 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <DetailField label="Full Name" value={application.fullName} />
              <DetailField label="Phone Number" value={application.phoneNumber} icon={<Phone className="w-4 h-4" />} />
              {application.email && <DetailField label="Email" value={application.email} icon={<Mail className="w-4 h-4" />} />}
              <DetailField label="Interested In" value={application.interestedIn} />
              {application.message && <DetailField label="Message" value={application.message} />}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-900 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              {isLoan ? 'Personal Information' : 'Basic Information'}
            </h2>
            <div className="space-y-4">
              <DetailField label="Full Name" value={personalInfo?.fullName} />
              <DetailField label="Mobile Number" value={personalInfo?.mobileNumber} icon={<Phone className="w-4 h-4" />} />
              {isLoan && <DetailField label="Email" value={application.personalInfo?.email} icon={<Mail className="w-4 h-4" />} />}
              {isLoan && <DetailField label="Date of Birth" value={formatDate(application.personalInfo?.dob)} icon={<Calendar className="w-4 h-4" />} />}
              {!isLoan && application.basicInfo?.age && <DetailField label="Age" value={application.basicInfo.age.toString()} />}
              {isLoan && <DetailField label="City" value={application.personalInfo?.city} icon={<MapPin className="w-4 h-4" />} />}
              {isLoan && <DetailField label="Pincode" value={application.personalInfo?.pincode} />}
              {isLoan && <DetailField label="PAN Card" value={application.personalInfo?.panCard} />}
            </div>
          </div>
        )}

        {/* Employment Information (Loan only) */}
        {isLoan && application.employmentInfo && (
          <div className="bg-white border border-gray-900 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-600" />
              Employment Information
            </h2>
            <div className="space-y-4">
              <DetailField label="Employment Type" value={application.employmentInfo.employmentType} />
              <DetailField label="Monthly Income" value={formatCurrency(application.employmentInfo.monthlyIncome)} />
              <DetailField label="Employer Name" value={application.employmentInfo.employerName} />
              <DetailField label="Existing EMI" value={formatCurrency(application.employmentInfo.existingEmi)} />
            </div>
          </div>
        )}

        {/* Business Details (Business Loan only) */}
        {isLoan && application.businessDetails && (
          <div className="bg-white border border-gray-900 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-600" />
              Business Details
            </h2>
            <div className="space-y-4">
              <DetailField label="Business Type" value={application.businessDetails.businessType} />
              <DetailField label="Annual Turnover" value={formatCurrency(application.businessDetails.turnover)} />
              <DetailField label="Years in Business" value={application.businessDetails.yearsInBusiness.toString()} />
              <DetailField label="GST Registered" value={application.businessDetails.gstRegistered ? 'Yes' : 'No'} />
            </div>
          </div>
        )}

        {/* Property Details (Home Loan & LAP) */}
        {isLoan && application.propertyDetails && (
          <div className="bg-white border border-gray-900 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Home className="w-5 h-5 text-gray-600" />
              Property Details
            </h2>
            <div className="space-y-4">
              {application.propertyDetails.propertyCost && (
                <DetailField label="Property Cost" value={formatCurrency(application.propertyDetails.propertyCost)} />
              )}
              {application.propertyDetails.currentMarketValue && (
                <DetailField label="Market Value" value={formatCurrency(application.propertyDetails.currentMarketValue)} />
              )}
              {application.propertyDetails.propertyType && (
                <DetailField label="Property Type" value={application.propertyDetails.propertyType} />
              )}
              {application.propertyDetails.propertyLoanType && (
                <DetailField label="Loan Type" value={application.propertyDetails.propertyLoanType} />
              )}
              <DetailField label="Property City" value={application.propertyDetails.propertyCity} />
              {application.propertyDetails.propertyStatus && (
                <DetailField label="Property Status" value={application.propertyDetails.propertyStatus} />
              )}
              {application.propertyDetails.occupancyStatus && (
                <DetailField label="Occupancy Status" value={application.propertyDetails.occupancyStatus} />
              )}
            </div>
          </div>
        )}

        {/* Loan Requirement (Loan only) */}
        {isLoan && application.loanRequirement && (
          <div className="bg-white border border-gray-900 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-gray-600" />
              Loan Requirement
            </h2>
            <div className="space-y-4">
              <DetailField label="Loan Amount" value={formatCurrency(application.loanRequirement.loanAmount)} />
              <DetailField label="Tenure" value={`${application.loanRequirement.tenure} Years`} />
              <DetailField label="Purpose" value={application.loanRequirement.loanPurpose} />
            </div>
          </div>
        )}

        {/* Insurance Specific Information */}
        {!isLoan && (
          <>
            {application.sumInsured && (
              <div className="bg-white border border-gray-900 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  Insurance Details
                </h2>
                <div className="space-y-4">
                  <DetailField label="Insurance Type" value={application.insuranceType} />
                  <DetailField label="Sum Insured" value={formatCurrency(application.sumInsured)} />
                </div>
              </div>
            )}

            {application.vehicleInfo && (
              <div className="bg-white border border-gray-900 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  Vehicle Information
                </h2>
                <div className="space-y-4">
                  <DetailField label="Pincode" value={application.vehicleInfo.pincode} />
                  <DetailField label="Vehicle Number" value={application.vehicleInfo.vehicleNumber} />
                  <DetailField label="Policy Term" value={`${application.vehicleInfo.policyTerm} Year(s)`} />
                </div>
              </div>
            )}

            {application.loanInfo && (
              <div className="bg-white border border-gray-900 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-gray-600" />
                  Loan Information
                </h2>
                <div className="space-y-4">
                  <DetailField label="Loan Type" value={application.loanInfo.loanType} />
                  <DetailField label="Loan Amount" value={formatCurrency(application.loanInfo.loanAmount)} />
                  <DetailField label="Tenure" value={`${application.loanInfo.tenure} Years`} />
                </div>
              </div>
            )}
          </>
        )}

        {/* Status History */}
        {application.statusHistory && application.statusHistory.length > 0 && (
          <div className="bg-white border border-gray-900 rounded-2xl p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600" />
              Status History
            </h2>
            <div className="space-y-3">
              {application.statusHistory.map((entry, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    entry.status === 'approved' || entry.status === 'disbursed' ? 'bg-green-500' :
                    entry.status === 'pending' ? 'bg-amber-500' :
                    entry.status === 'rejected' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusStyle(entry.status)}`}>
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1).replace('-', ' ')}
                      </span>
                      <span className="text-sm text-gray-500">{formatDate(entry.updatedAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600">Updated by: {entry.updatedBy}</p>
                    {entry.notes && (
                      <p className="text-sm text-gray-700 mt-2">{entry.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="bg-white border border-gray-900 rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            Application Metadata
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailField label="Application ID" value={application.applicationId} />
            <DetailField label="Type" value={application.type} />
            <DetailField label="Loan/Insurance Type" value={isLoan ? application.loanType : application.insuranceType} />
            <DetailField label="Created At" value={formatDate(application.createdAt)} />
            <DetailField label="Last Updated" value={formatDate(application.updatedAt)} />
            {application.userEmail && <DetailField label="User Email" value={application.userEmail} />}
          </div>
        </div>

        {/* Debug Section - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Debug Information</h2>
            <pre className="text-xs overflow-auto bg-white p-4 rounded-lg border border-gray-200">
              {JSON.stringify(application, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

const DetailField = ({ label, value, icon }: { label: string; value: string | undefined; icon?: React.ReactNode }) => (
  <div>
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</p>
    </div>
    <p className="text-base font-semibold text-gray-900">{value || 'N/A'}</p>
  </div>
);

