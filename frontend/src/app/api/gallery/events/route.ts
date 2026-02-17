import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { 
  GalleryEvent, 
  GALLERY_EVENTS_COLLECTION,
  formatGalleryEventForResponse 
} from '@/models/GalleryEvent';
import { detectSource } from '@/lib/source-detection';

// GET /api/gallery/events - Get all published gallery events
export async function GET(request: NextRequest) {
  try {
    console.log('[Gallery API] GET /api/gallery/events called');
    
    const { searchParams } = new URL(request.url);
    const source = detectSource(request);
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('[Gallery API] Query params:', { source, featured, limit, offset });

    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection<GalleryEvent>(GALLERY_EVENTS_COLLECTION);

    // Build query
    const query: any = {
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

    return NextResponse.json({
      success: true,
      total,
      events: events.map(formatGalleryEventForResponse),
    });
  } catch (error) {
    console.error('[Gallery API] Error fetching gallery events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery events', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

