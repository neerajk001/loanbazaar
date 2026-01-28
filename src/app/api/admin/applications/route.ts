import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { LOAN_APPLICATIONS_COLLECTION, LoanApplication } from '@/models/LoanApplication';
import { INSURANCE_APPLICATIONS_COLLECTION, InsuranceApplication } from '@/models/InsuranceApplication';
import { CONSULTANCY_REQUESTS_COLLECTION, ConsultancyRequest } from '@/models/ConsultancyRequest';

export async function GET(request: NextRequest) {
  // Note: Add proper admin authentication if needed

  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type'); // 'loan' or 'insurance' or 'all'
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    let allApplications: any[] = [];
    
    // Fetch loan applications
    if (!type || type === 'all' || type === 'loan') {
      const loanCollection = db.collection<LoanApplication>(LOAN_APPLICATIONS_COLLECTION);
      let loanQuery: any = {};
      
      if (status && status !== 'all') {
        loanQuery.status = status;
      }
      
      if (search) {
        loanQuery.$or = [
          { applicationId: { $regex: search, $options: 'i' } },
          { 'personalInfo.fullName': { $regex: search, $options: 'i' } },
          { 'personalInfo.email': { $regex: search, $options: 'i' } },
          { 'personalInfo.mobileNumber': { $regex: search, $options: 'i' } },
        ];
      }
      
      const loanApps = await loanCollection
        .find(loanQuery)
        .sort({ createdAt: -1 })
        .toArray();
      
      allApplications.push(...loanApps.map(app => ({
        _id: app._id,
        id: app.applicationId,
        applicationId: app.applicationId,
        type: 'loan',
        name: app.personalInfo.fullName,
        email: app.personalInfo.email,
        phone: app.personalInfo.mobileNumber,
        loanType: app.loanType,
        amount: app.loanRequirement.loanAmount,
        status: app.status,
        source: app.source || 'loan-sarathi',
        date: app.createdAt,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        statusHistory: app.statusHistory,
      })));
    }
    
    // Fetch insurance applications
    if (!type || type === 'all' || type === 'insurance') {
      const insuranceCollection = db.collection<InsuranceApplication>(INSURANCE_APPLICATIONS_COLLECTION);
      let insuranceQuery: any = {};
      
      if (status && status !== 'all') {
        insuranceQuery.status = status;
      }
      
      if (search) {
        insuranceQuery.$or = [
          { applicationId: { $regex: search, $options: 'i' } },
          { 'basicInfo.fullName': { $regex: search, $options: 'i' } },
          { 'basicInfo.mobileNumber': { $regex: search, $options: 'i' } },
        ];
      }
      
      const insuranceApps = await insuranceCollection
        .find(insuranceQuery)
        .sort({ createdAt: -1 })
        .toArray();
      
      allApplications.push(...insuranceApps.map(app => ({
        _id: app._id,
        id: app.applicationId,
        applicationId: app.applicationId,
        type: 'insurance',
        name: app.basicInfo.fullName,
        email: app.userEmail,
        phone: app.basicInfo.mobileNumber,
        insuranceType: app.insuranceType,
        sumInsured: app.sumInsured,
        status: app.status,
        source: app.source || 'loan-sarathi',
        date: app.createdAt,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        statusHistory: app.statusHistory,
      })));
    }
    
    // Fetch consultancy requests
    if (!type || type === 'all' || type === 'consultancy') {
      const consultancyCollection = db.collection<ConsultancyRequest>(CONSULTANCY_REQUESTS_COLLECTION);
      let consultancyQuery: any = {};
      
      if (status && status !== 'all') {
        consultancyQuery.status = status;
      }
      
      if (search) {
        consultancyQuery.$or = [
          { requestId: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }
      
      const consultancyRequests = await consultancyCollection
        .find(consultancyQuery)
        .sort({ createdAt: -1 })
        .toArray();
      
      allApplications.push(...consultancyRequests.map(req => ({
        _id: req._id,
        id: req.requestId,
        applicationId: req.requestId,
        type: 'consultancy',
        name: req.fullName,
        email: req.email,
        phone: req.phoneNumber,
        interestedIn: req.interestedIn,
        message: req.message,
        status: req.status,
        source: req.source || 'loan-sarathi',
        date: req.createdAt,
        createdAt: req.createdAt,
        updatedAt: req.updatedAt,
        statusHistory: req.statusHistory,
      })));
    }
    
    // Sort all applications by creation date
    allApplications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Apply pagination
    const total = allApplications.length;
    const paginatedApplications = allApplications.slice(skip, skip + limit);
    
    // Calculate statistics
    const stats = {
      total: total,
      pending: allApplications.filter(a => a.status === 'pending').length,
      reviewing: allApplications.filter(a => a.status === 'reviewing' || a.status === 'in-review').length,
      approved: allApplications.filter(a => a.status === 'approved' || a.status === 'verified').length,
      rejected: allApplications.filter(a => a.status === 'rejected').length,
      contacted: allApplications.filter(a => a.status === 'contacted').length,
      totalAmount: allApplications
        .filter(a => a.type === 'loan')
        .reduce((sum, a) => sum + (a.amount || 0), 0),
    };

    return NextResponse.json({ 
      success: true,
      applications: paginatedApplications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats,
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

