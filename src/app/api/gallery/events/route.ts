import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { 
  GalleryEvent, 
  GALLERY_EVENTS_COLLECTION,
  formatGalleryEventForResponse 
} from '@/models/GalleryEvent';
import { detectSource } from '@/lib/source-detection';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

// GET /api/gallery/events - Get all published gallery events
export async function GET(request: NextRequest) {
  try {
    console.log('[Gallery API] GET /api/gallery/events called');
    
    const { searchParams } = new URL(request.url);
    const healthCheck = searchParams.get('health');
    
    if (healthCheck === 'true') {
      const headers = {
        origin: request.headers.get('origin') || 'none',
        host: request.headers.get('host') || 'none',
      };
      return NextResponse.json({
        success: true,
        message: 'Gallery API is working!',
        timestamp: new Date().toISOString(),
        detectedSource: detectSource(request),
        requestHeaders: headers,
        endpoints: {
          getAllEvents: '/api/gallery/events',
          getFeaturedEvents: '/api/gallery/events?featured=true',
          getSingleEvent: '/api/gallery/events/:id',
        },
      });
    }

    const source = detectSource(request);
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('[Gallery API] Query params:', { source, featured, limit, offset });

    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection<GalleryEvent>(GALLERY_EVENTS_COLLECTION);

    // Build query. Prefer source-specific events first.
    const baseQuery: any = {
      isPublished: true,
    };
    const sourceQuery: any = {
      ...baseQuery,
      source: source,
    };

    if (featured === 'true') {
      sourceQuery.isFeatured = true;
      baseQuery.isFeatured = true;
    }

    console.log('[Gallery API] MongoDB source query:', JSON.stringify(sourceQuery));

    // Fetch source-specific events first
    let events = await collection
      .find(sourceQuery)
      .sort({ eventDate: -1, displayOrder: 1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    // Backward compatibility: if no source-specific events, fall back to all published.
    if (events.length === 0) {
      console.log('[Gallery API] No source-matched events found, falling back to all published events');
      events = await collection
        .find(baseQuery)
        .sort({ eventDate: -1, displayOrder: 1 })
        .skip(offset)
        .limit(limit)
        .toArray();
    }

    const total = events.length;

    console.log(`[Gallery API] Found ${events.length} events (total: ${total})`);

    return NextResponse.json({
      success: true,
      total,
      events: events.map(formatGalleryEventForResponse),
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('[Gallery API] Error fetching gallery events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery events', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

