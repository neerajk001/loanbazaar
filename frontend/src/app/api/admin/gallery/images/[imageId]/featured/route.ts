import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import {
  GalleryEvent,
  GALLERY_EVENTS_COLLECTION,
} from '@/models/GalleryEvent';

// PUT /api/admin/gallery/images/:imageId/featured - Set featured image
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
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
    const { imageId } = await params;

    const body = await request.json();
    const { isFeatured } = body;

    if (typeof isFeatured !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Invalid isFeatured value' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection<GalleryEvent>(GALLERY_EVENTS_COLLECTION);

    // Find event containing the image
    const event = await collection.findOne({
      'images._id': new ObjectId(imageId),
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    // Update images: set all to not featured, then set the target image to featured
    const updatedImages = event.images.map(img => ({
      ...img,
      isFeatured: img._id?.toString() === imageId ? isFeatured : false,
    }));

    // Update event
    await collection.updateOne(
      { _id: event._id },
      {
        $set: {
          images: updatedImages,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Featured image updated successfully',
    });
  } catch (error) {
    console.error('Error setting featured image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to set featured image' },
      { status: 500 }
    );
  }
}

