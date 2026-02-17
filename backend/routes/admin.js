const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const clientPromise = require('../config/database');
const { requireAdmin } = require('./auth');
const { LOAN_APPLICATIONS_COLLECTION } = require('../models/LoanApplication');
const { INSURANCE_APPLICATIONS_COLLECTION } = require('../models/InsuranceApplication');
const { CONSULTANCY_REQUESTS_COLLECTION } = require('../models/ConsultancyRequest');
const {
  GALLERY_EVENTS_COLLECTION,
  validateGalleryEvent,
  getNextGalleryEventSequenceNumber,
  generateGalleryEventId,
  formatGalleryEventForResponse,
} = require('../models/GalleryEvent');
const { upload, deleteImageFile, deleteEventDirectory } = require('../utils/fileUpload');
const { sendEmail, createStatusUpdateEmail } = require('../utils/email');
const { detectSource } = require('../utils/sourceDetection');

// GET /api/admin/applications - Get all applications
router.get('/applications', requireAdmin, async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    
    // Get query parameters for filtering
    const status = req.query.status;
    const type = req.query.type; // 'loan' or 'insurance' or 'all'
    const search = req.query.search;
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '20');
    const skip = (page - 1) * limit;
    
    let allApplications = [];
    
    // Fetch loan applications
    if (!type || type === 'all' || type === 'loan') {
      const loanCollection = db.collection(LOAN_APPLICATIONS_COLLECTION);
      let loanQuery = {};
      
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
      const insuranceCollection = db.collection(INSURANCE_APPLICATIONS_COLLECTION);
      let insuranceQuery = {};
      
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
      const consultancyCollection = db.collection(CONSULTANCY_REQUESTS_COLLECTION);
      let consultancyQuery = {};
      
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
      
      allApplications.push(...consultancyRequests.map(reqItem => ({
        _id: reqItem._id,
        id: reqItem.requestId,
        applicationId: reqItem.requestId,
        type: 'consultancy',
        name: reqItem.fullName,
        email: reqItem.email,
        phone: reqItem.phoneNumber,
        interestedIn: reqItem.interestedIn,
        message: reqItem.message,
        status: reqItem.status,
        source: reqItem.source || 'loan-sarathi',
        date: reqItem.createdAt,
        createdAt: reqItem.createdAt,
        updatedAt: reqItem.updatedAt,
        statusHistory: reqItem.statusHistory,
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

    return res.json({ 
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
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/admin/applications/:id - Get single application details
router.get('/applications/:id', requireAdmin, async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    
    const { id } = req.params;
    
    // Try to find in loan applications
    const loanApp = await db.collection(LOAN_APPLICATIONS_COLLECTION).findOne({
      applicationId: id
    });
    
    if (loanApp) {
      return res.json({
        success: true,
        application: {
          ...loanApp,
          type: 'loan'
        }
      });
    }
    
    // Try to find in insurance applications
    const insuranceApp = await db.collection(INSURANCE_APPLICATIONS_COLLECTION).findOne({
      applicationId: id
    });
    
    if (insuranceApp) {
      return res.json({
        success: true,
        application: {
          ...insuranceApp,
          type: 'insurance'
        }
      });
    }
    
    // Try to find in consultancy requests
    const consultancyReq = await db.collection(CONSULTANCY_REQUESTS_COLLECTION).findOne({
      requestId: id
    });
    
    if (consultancyReq) {
      return res.json({
        success: true,
        application: {
          ...consultancyReq,
          type: 'consultancy'
        }
      });
    }
    
    return res.status(404).json({
      success: false,
      error: 'Application not found'
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH /api/admin/applications/:id - Update application status
router.patch('/applications/:id', requireAdmin, async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    
    const { id } = req.params;
    const { status, notes } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }
    
    const statusUpdate = {
      status: status,
      updatedAt: new Date(),
      updatedBy: req.user.email || 'admin',
      notes: notes,
    };
    
    const historyEntry = {
      ...statusUpdate,
      updatedByEmail: req.user.email,
    };
    
    // Try loan applications
    let result = await db.collection(LOAN_APPLICATIONS_COLLECTION).findOneAndUpdate(
      { applicationId: id },
      {
        $set: { status: status, updatedAt: new Date() },
        $push: { statusHistory: historyEntry }
      },
      { returnDocument: 'after' }
    );
    
    if (result) {
      // Send status update email
      try {
        const email = createStatusUpdateEmail(
          result.personalInfo.fullName,
          id,
          result.personalInfo.email,
          result.status,
          status,
          notes
        );
        await sendEmail(email);
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
      }
      
      return res.json({
        success: true,
        application: result
      });
    }
    
    // Try insurance applications
    result = await db.collection(INSURANCE_APPLICATIONS_COLLECTION).findOneAndUpdate(
      { applicationId: id },
      {
        $set: { status: status, updatedAt: new Date() },
        $push: { statusHistory: historyEntry }
      },
      { returnDocument: 'after' }
    );
    
    if (result) {
      return res.json({
        success: true,
        application: result
      });
    }
    
    // Try consultancy requests
    result = await db.collection(CONSULTANCY_REQUESTS_COLLECTION).findOneAndUpdate(
      { requestId: id },
      {
        $set: { status: status, updatedAt: new Date() },
        $push: { statusHistory: historyEntry }
      },
      { returnDocument: 'after' }
    );
    
    if (result) {
      return res.json({
        success: true,
        application: result
      });
    }
    
    return res.status(404).json({
      success: false,
      error: 'Application not found'
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/admin/consultancy - Get all consultancy requests
router.get('/consultancy', requireAdmin, async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    
    const requests = await db.collection(CONSULTANCY_REQUESTS_COLLECTION)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return res.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error('Error fetching consultancy requests:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/admin/consultancy/:id - Delete consultancy request
router.delete('/consultancy/:id', requireAdmin, async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    
    const result = await db.collection(CONSULTANCY_REQUESTS_COLLECTION).deleteOne({
      requestId: req.params.id
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }
    
    return res.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting consultancy request:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/admin/settings - Get admin settings
router.get('/settings', requireAdmin, async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    
    const settings = await db.collection('adminSettings').findOne({ _id: 'main' });
    
    return res.json({
      success: true,
      settings: settings?.settings || {}
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/admin/settings - Update admin settings
router.post('/settings', requireAdmin, async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    
    const { adminEmails } = req.body;
    
    await db.collection('adminSettings').updateOne(
      { _id: 'main' },
      {
        $set: {
          settings: { adminEmails },
          updatedAt: new Date(),
          updatedBy: req.user.email
        }
      },
      { upsert: true }
    );
    
    return res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/admin/check-emails - Check if emails are admin
router.get('/check-emails', requireAdmin, async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    
    const settings = await db.collection('adminSettings').findOne({ _id: 'main' });
    const adminEmails = settings?.settings?.adminEmails || [];
    
    return res.json({
      success: true,
      adminEmails
    });
  } catch (error) {
    console.error('Error checking emails:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Gallery admin routes
// GET /api/admin/gallery/events - Get all gallery events (published and unpublished)
router.get('/gallery/events', requireAdmin, async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection(GALLERY_EVENTS_COLLECTION);
    
    const events = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return res.json({
      success: true,
      events: events.map(formatGalleryEventForResponse)
    });
  } catch (error) {
    console.error('Error fetching gallery events:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/admin/gallery/events - Create new gallery event
router.post('/gallery/events', requireAdmin, upload.array('images[]', 10), async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    
    const validation = validateGalleryEvent(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors
      });
    }
    
    const sequenceNumber = await getNextGalleryEventSequenceNumber(db);
    const eventId = generateGalleryEventId(sequenceNumber);
    
    const images = req.files.map((file, index) => ({
      _id: new ObjectId(),
      imageUrl: `/uploads/gallery/${eventId}/${file.filename}`,
      imagePath: file.path,
      altText: req.body.imageAltTexts?.[index] || '',
      displayOrder: index,
      isFeatured: index === 0,
      uploadedAt: new Date()
    }));
    
    const source = detectSource(req);
    
    const event = {
      title: req.body.title,
      description: req.body.description,
      eventDate: new Date(req.body.eventDate),
      location: req.body.location,
      isFeatured: req.body.isFeatured === 'true',
      isPublished: req.body.isPublished === 'true',
      displayOrder: parseInt(req.body.displayOrder || '0'),
      images: images,
      source: source,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: req.user.email
    };
    
    const result = await db.collection(GALLERY_EVENTS_COLLECTION).insertOne(event);
    
    return res.status(201).json({
      success: true,
      event: formatGalleryEventForResponse(event)
    });
  } catch (error) {
    console.error('Error creating gallery event:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/admin/gallery/events/:id - Get single event
router.get('/gallery/events/:id', requireAdmin, async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    
    const event = await db.collection(GALLERY_EVENTS_COLLECTION).findOne({
      _id: new ObjectId(req.params.id)
    });
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    return res.json({
      success: true,
      event: formatGalleryEventForResponse(event)
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /api/admin/gallery/events/:id - Delete gallery event
router.delete('/gallery/events/:id', requireAdmin, async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    
    const event = await db.collection(GALLERY_EVENTS_COLLECTION).findOne({
      _id: new ObjectId(req.params.id)
    });
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    // Delete all images
    for (const image of event.images) {
      if (image.imagePath) {
        deleteImageFile(image.imagePath);
      }
    }
    
    await db.collection(GALLERY_EVENTS_COLLECTION).deleteOne({
      _id: new ObjectId(req.params.id)
    });
    
    return res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
