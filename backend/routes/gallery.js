const express = require('express');
const router = express.Router();
const clientPromise = require('../config/database');
const {
  GALLERY_EVENTS_COLLECTION,
  formatGalleryEventForResponse,
} = require('../models/GalleryEvent');
const { detectSource } = require('../utils/sourceDetection');

// GET /api/gallery/events - Get all published gallery events
router.get('/events', async (req, res) => {
  try {
    console.log('[Gallery API] GET /api/gallery/events called');
    
    const source = detectSource(req);
    const featured = req.query.featured;
    const limit = parseInt(req.query.limit || '50');
    const offset = parseInt(req.query.offset || '0');

    console.log('[Gallery API] Query params:', { source, featured, limit, offset });

    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection(GALLERY_EVENTS_COLLECTION);

    // Build query
    const query = {
      source: source,
      isPublished: true,
    };

    if (featured === 'true') {
      query.isFeatured = true;
    }

    console.log('[Gallery API] MongoDB query:', JSON.stringify(query));

    // Fetch events
    const events = await collection
      .find(query)
      .sort({ eventDate: -1, displayOrder: 1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    // Count total
    const total = await collection.countDocuments(query);

    console.log(`[Gallery API] Found ${events.length} events (total: ${total})`);

    return res.json({
      success: true,
      total,
      events: events.map(formatGalleryEventForResponse),
    });
  } catch (error) {
    console.error('[Gallery API] Error fetching gallery events:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch gallery events',
      details: error.message,
    });
  }
});

// GET /api/gallery/events/:id - Get single gallery event
router.get('/events/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection(GALLERY_EVENTS_COLLECTION);
    
    const source = detectSource(req);
    
    const event = await collection.findOne({
      _id: new ObjectId(req.params.id),
      source: source,
      isPublished: true,
    });
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }
    
    return res.json({
      success: true,
      event: formatGalleryEventForResponse(event),
    });
  } catch (error) {
    console.error('[Gallery API] Error fetching event:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch event',
    });
  }
});

// GET /api/gallery/health - Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
