import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import {
  GalleryEvent,
  GALLERY_EVENTS_COLLECTION,
  validateGalleryEvent,
  formatGalleryEventForResponse,
} from '@/models/GalleryEvent';
import { deleteEventDirectory } from '@/lib/fileUpload';

// GET /api/admin/gallery/events/:id - Get single gallery event (admin)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Await params in Next.js 16+
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection<GalleryEvent>(GALLERY_EVENTS_COLLECTION);

    // Find event by ObjectId (no filters for admin)
    const event = await collection.findOne({
      _id: new ObjectId(id),
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

// PUT /api/admin/gallery/events/:id - Update gallery event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Await params in Next.js 16+
    const { id } = await params;

    const body = await request.json();

    // Validate partial update data
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.eventDate !== undefined) updateData.eventDate = new Date(body.eventDate);
    if (body.location !== undefined) updateData.location = body.location;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.isPublished !== undefined) updateData.isPublished = body.isPublished;
    if (body.displayOrder !== undefined) updateData.displayOrder = body.displayOrder;

    // Validate if basic fields are being updated
    if (body.title || body.description || body.eventDate || body.location) {
      const validation = validateGalleryEvent({
        title: body.title || 'Valid Title',
        description: body.description || 'Valid Description',
        eventDate: body.eventDate || new Date(),
        location: body.location || 'Valid Location',
      });
      
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, errors: validation.errors },
          { status: 400 }
        );
      }
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection<GalleryEvent>(GALLERY_EVENTS_COLLECTION);

    // Update event
    updateData.updatedAt = new Date();
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Gallery event updated successfully',
      event: formatGalleryEventForResponse(result),
    });
  } catch (error) {
    console.error('Error updating gallery event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update gallery event' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/gallery/events/:id - Delete gallery event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Await params in Next.js 16+
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection<GalleryEvent>(GALLERY_EVENTS_COLLECTION);

    // Find event first to get image count
    const event = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Delete event from database
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Delete event directory and all images
    await deleteEventDirectory(id);

    return NextResponse.json({
      success: true,
      message: 'Gallery event deleted successfully',
      deletedEventId: id,
      deletedImagesCount: event.images.length,
    });
  } catch (error) {
    console.error('Error deleting gallery event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete gallery event' },
      { status: 500 }
    );
  }
}

