import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import {
  GalleryEvent,
  GalleryImage,
  GALLERY_EVENTS_COLLECTION,
  validateGalleryEvent,
  formatGalleryEventForResponse,
} from '@/models/GalleryEvent';
import { processImageUploads } from '@/lib/fileUpload';
import { detectSource } from '@/lib/source-detection';

// Configure route for file uploads
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/admin/gallery/events - Create new gallery event
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    
    const eventData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      eventDate: formData.get('eventDate') as string,
      location: formData.get('location') as string,
      isFeatured: formData.get('isFeatured') === 'true',
      isPublished: formData.get('isPublished') === 'true',
      source: formData.get('source') as string || detectSource(request),
    };

    // Validate event data
    const validation = validateGalleryEvent(eventData);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection<GalleryEvent>(GALLERY_EVENTS_COLLECTION);

    // Create event ID for file storage
    const eventId = new ObjectId().toString();

    // Process image uploads
    let uploadedImages: Array<{ imageUrl: string; imagePath: string; altText?: string }>;
    try {
      console.log('Starting image upload for event:', eventId);
      uploadedImages = await processImageUploads(formData, eventId);
      console.log('Successfully uploaded', uploadedImages.length, 'images');
    } catch (uploadError: any) {
      console.error('Image upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: uploadError.message || 'Failed to upload images' },
        { status: 400 }
      );
    }

    // Create gallery images array
    const images: GalleryImage[] = uploadedImages.map((img, index) => ({
      _id: new ObjectId(),
      imageUrl: img.imageUrl,
      imagePath: img.imagePath,
      altText: img.altText,
      displayOrder: index,
      isFeatured: index === 0, // First image is featured by default
      uploadedAt: new Date(),
    }));

    // Create event document
    const newEvent: GalleryEvent = {
      _id: new ObjectId(eventId),
      title: eventData.title,
      description: eventData.description,
      eventDate: new Date(eventData.eventDate),
      location: eventData.location,
      isFeatured: eventData.isFeatured,
      isPublished: eventData.isPublished,
      displayOrder: 0,
      images,
      source: eventData.source as any,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: session.user.email,
    };

    // Insert into database
    const result = await collection.insertOne(newEvent);

    if (!result.acknowledged) {
      throw new Error('Failed to create gallery event');
    }

    return NextResponse.json(
      {
        success: true,
        eventId: eventId,
        message: 'Gallery event created successfully',
        event: formatGalleryEventForResponse(newEvent),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating gallery event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create gallery event' },
      { status: 500 }
    );
  }
}

// GET /api/admin/gallery/events - Get all gallery events (admin view, includes unpublished)
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sourceFilter = searchParams.get('source'); // Optional source filter
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection<GalleryEvent>(GALLERY_EVENTS_COLLECTION);

    // Fetch all events (including unpublished for admin)
    // Admin can see events from all sources unless filtered
    const query: any = {};
    if (sourceFilter) {
      query.source = sourceFilter;
    }
    
    const events = await collection
      .find(query)
      .sort({ eventDate: -1, createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    const total = await collection.countDocuments(query);

    return NextResponse.json({
      success: true,
      total,
      events: events.map(formatGalleryEventForResponse),
    });
  } catch (error) {
    console.error('Error fetching gallery events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery events' },
      { status: 500 }
    );
  }
}

