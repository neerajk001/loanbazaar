import { ObjectId } from 'mongodb';

export const GALLERY_EVENTS_COLLECTION = 'galleryEvents';

export interface GalleryImage {
  _id?: ObjectId;
  imageUrl: string;
  imagePath?: string; // Server file path for deletion
  altText?: string;
  displayOrder: number;
  isFeatured: boolean;
  uploadedAt: Date;
}

export interface GalleryEvent {
  _id?: ObjectId;
  title: string;
  description: string;
  eventDate: Date;
  location: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  images: GalleryImage[];
  source: 'loan-sarathi' | 'smartmumbaisolutions';
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string; // Admin email
}

// Validation function
export function validateGalleryEvent(data: any): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  // Title validation
  if (!data.title || typeof data.title !== 'string') {
    errors.title = 'Title is required';
  } else if (data.title.length < 5 || data.title.length > 255) {
    errors.title = 'Title must be between 5 and 255 characters';
  }

  // Description validation
  if (!data.description || typeof data.description !== 'string') {
    errors.description = 'Description is required';
  } else if (data.description.length < 10 || data.description.length > 5000) {
    errors.description = 'Description must be between 10 and 5000 characters';
  }

  // Event date validation
  if (!data.eventDate) {
    errors.eventDate = 'Event date is required';
  } else {
    const date = new Date(data.eventDate);
    if (isNaN(date.getTime())) {
      errors.eventDate = 'Invalid date format';
    }
  }

  // Location validation
  if (!data.location || typeof data.location !== 'string') {
    errors.location = 'Location is required';
  } else if (data.location.length < 3 || data.location.length > 255) {
    errors.location = 'Location must be between 3 and 255 characters';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// Generate unique event ID
export async function getNextGalleryEventSequenceNumber(db: any): Promise<number> {
  const counters = db.collection('counters');
  const result = await counters.findOneAndUpdate(
    { _id: 'galleryEventId' },
    { $inc: { sequence: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  return result.sequence;
}

export function generateGalleryEventId(sequenceNumber: number): string {
  const paddedNumber = sequenceNumber.toString().padStart(5, '0');
  return `LS-GE-${new Date().getFullYear()}-${paddedNumber}`;
}

// Convert MongoDB document to API response format
export function formatGalleryEventForResponse(event: GalleryEvent): any {
  return {
    id: event._id?.toString(),
    title: event.title,
    description: event.description,
    eventDate: event.eventDate.toISOString().split('T')[0], // YYYY-MM-DD
    location: event.location,
    isFeatured: event.isFeatured,
    isPublished: event.isPublished,
    source: event.source, // Include source in response
    images: event.images.map((img, index) => ({
      id: img._id?.toString() || index.toString(),
      imageUrl: img.imageUrl,
      altText: img.altText,
      displayOrder: img.displayOrder,
      isFeatured: img.isFeatured,
    })),
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}

