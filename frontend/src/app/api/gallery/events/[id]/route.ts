import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { 
  GalleryEvent, 
  GALLERY_EVENTS_COLLECTION,
  formatGalleryEventForResponse 
} from '@/models/GalleryEvent';
import { detectSource } from '@/lib/source-detection';

// GET /api/gallery/events/:id - Get single gallery event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 16+
    const { id } = await params;
    
    const source = detectSource(request);
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection<GalleryEvent>(GALLERY_EVENTS_COLLECTION);

    // Find event by ObjectId
    const event = await collection.findOne({
      _id: new ObjectId(id),
      source: source,
      isPublished: true,
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      event: formatGalleryEventForResponse(event),
    });
  } catch (error) {
    console.error('Error fetching gallery event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery event' },
      { status: 500 }
    );
  }
}

