import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import {
  GalleryEvent,
  GALLERY_EVENTS_COLLECTION,
} from '@/models/GalleryEvent';
import { deleteImageFile } from '@/lib/fileUpload';

// DELETE /api/admin/gallery/images/:imageId - Delete specific image
export async function DELETE(
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

    // Get the image to be deleted
    const imageToDelete = event.images.find(
      img => img._id?.toString() === imageId
    );

    if (!imageToDelete) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    // Don't allow deleting the last image
    if (event.images.length === 1) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete the last image. Events must have at least one image.' },
        { status: 400 }
      );
    }

    // Remove image from event
    await collection.updateOne(
      { _id: event._id },
      {
        $pull: { images: { _id: new ObjectId(imageId) } },
        $set: { updatedAt: new Date() },
      }
    );

    // Delete physical file
    if (imageToDelete.imagePath) {
      await deleteImageFile(imageToDelete.imagePath);
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
      deletedImageId: imageId,
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

