import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import {
  GalleryEvent,
  GalleryImage,
  GALLERY_EVENTS_COLLECTION,
} from '@/models/GalleryEvent';
import { processImageUploads } from '@/lib/fileUpload';

// Configure route for file uploads
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/admin/gallery/events/:id/images - Upload more images to existing event
export async function POST(
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

    // Parse form data
    const formData = await request.formData();

    // Connect to database
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection<GalleryEvent>(GALLERY_EVENTS_COLLECTION);

    // Check if event exists
    const event = await collection.findOne({ _id: new ObjectId(id) });
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Process image uploads
    let uploadedImages: Array<{ imageUrl: string; imagePath: string; altText?: string }>;
    try {
      uploadedImages = await processImageUploads(formData, id);
    } catch (uploadError: any) {
      return NextResponse.json(
        { success: false, error: uploadError.message || 'Failed to upload images' },
        { status: 400 }
      );
    }

    // Create gallery images array with proper display order
    const currentMaxOrder = Math.max(...event.images.map(img => img.displayOrder), -1);
    const newImages: GalleryImage[] = uploadedImages.map((img, index) => ({
      _id: new ObjectId(),
      imageUrl: img.imageUrl,
      imagePath: img.imagePath,
      altText: img.altText,
      displayOrder: currentMaxOrder + index + 1,
      isFeatured: false,
      uploadedAt: new Date(),
    }));

    // Add new images to event
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $push: { images: { $each: newImages } },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Failed to add images' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Images uploaded successfully',
        uploadedImages: newImages.map(img => ({
          id: img._id?.toString(),
          imageUrl: img.imageUrl,
          displayOrder: img.displayOrder,
        })),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}

