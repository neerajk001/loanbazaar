const express = require('express');
const router = express.Router();
const clientPromise = require('../config/database');
const {
  CONSULTANCY_REQUESTS_COLLECTION,
  generateConsultancyRequestId,
  getNextConsultancySequenceNumber,
  validateConsultancyRequest,
} = require('../models/ConsultancyRequest');
const { detectSource } = require('../utils/sourceDetection');

// POST /api/consultancy - Submit consultancy request
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    
    // Validate request
    const validation = validateConsultancyRequest(body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors
      });
    }
    
    // Connect to database
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    
    // Generate unique request ID
    const sequenceNumber = await getNextConsultancySequenceNumber(db);
    const requestId = generateConsultancyRequestId(sequenceNumber);
    
    // Get client IP address
    const ipAddress = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.ip ||
                     'unknown';
    
    // Detect source
    const source = detectSource(req);
    
    // Create request document
    const consultancyRequest = {
      requestId,
      fullName: body.fullName,
      phoneNumber: body.phoneNumber,
      email: body.email,
      interestedIn: body.interestedIn,
      message: body.message,
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          updatedAt: new Date(),
          updatedBy: 'system',
          notes: `Request submitted from ${source}`,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress,
      source,
    };
    
    // Insert into database
    const collection = db.collection(CONSULTANCY_REQUESTS_COLLECTION);
    const result = await collection.insertOne(consultancyRequest);
    
    if (!result.acknowledged) {
      throw new Error('Failed to insert consultancy request');
    }
    
    // Return success response
    return res.status(201).json({
      success: true,
      requestId,
      message: 'Consultancy request submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting consultancy request:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit request. Please try again.',
    });
  }
});

module.exports = router;
