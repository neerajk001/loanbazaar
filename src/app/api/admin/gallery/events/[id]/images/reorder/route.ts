import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import {
  GalleryEvent,
  GALLERY_EVENTS_COLLECTION,
} from '@/models/GalleryEvent';

// PUT /api/admin/gallery/events/:id/images/reorder - Reorder images
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
    const { imageOrders } = body;

    if (!Array.isArray(imageOrders) || imageOrders.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid image orders' },
        { status: 400 }
      );
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection<GalleryEvent>(GALLERY_EVENTS_COLLECTION);

    // Get event
    const event = await collection.findOne({ _id: new ObjectId(id) });
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Update display order for each image
    const updatedImages = event.images.map(img => {
      const orderUpdate = imageOrders.find(
        order => order.imageId === img._id?.toString()
      );
      if (orderUpdate) {
        return { ...img, displayOrder: orderUpdate.displayOrder };
      }
      return img;
    });

    // Sort by new display order
    updatedImages.sort((a, b) => a.displayOrder - b.displayOrder);

    // Update event with new image order
    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          images: updatedImages,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Image order updated successfully',
    });
  } catch (error) {
    console.error('Error reordering images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder images' },
      { status: 500 }
    );
  }
}

