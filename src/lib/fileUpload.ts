import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'gallery');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Ensure upload directory exists
export async function ensureUploadDir(eventId: string) {
  const eventDir = path.join(UPLOAD_DIR, eventId);
  console.log('Ensuring upload directory exists:', eventDir);
  if (!existsSync(eventDir)) {
    await mkdir(eventDir, { recursive: true });
    console.log('Created directory:', eventDir);
  }
  return eventDir;
}

// Validate image file
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size must be less than 5MB` };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: `Only JPEG, PNG, and WebP images are allowed` };
  }

  return { valid: true };
}

// Upload single image
export async function uploadImage(
  file: File,
  eventId: string
): Promise<{ imageUrl: string; imagePath: string }> {
  console.log('Uploading image:', file.name, 'Size:', file.size, 'Type:', file.type);
  
  const validation = validateImageFile(file);
  if (!validation.valid) {
    console.error('Image validation failed:', validation.error);
    throw new Error(validation.error);
  }

  // Create event directory
  const eventDir = await ensureUploadDir(eventId);

  // Generate unique filename
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(7);
  const ext = path.extname(file.name);
  const filename = `${timestamp}-${randomStr}${ext}`;
  const filepath = path.join(eventDir, filename);

  console.log('Writing file to:', filepath);

  // Convert file to buffer and save
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filepath, buffer);

  console.log('File written successfully:', filepath);

  // Return URL and path
  const imageUrl = `/uploads/gallery/${eventId}/${filename}`;
  const imagePath = filepath;

  return { imageUrl, imagePath };
}

// Delete image file
export async function deleteImageFile(imagePath: string): Promise<void> {
  try {
    if (existsSync(imagePath)) {
      await unlink(imagePath);
    }
  } catch (error) {
    console.error('Error deleting image file:', error);
    // Don't throw - allow deletion to continue even if file doesn't exist
  }
}

// Delete entire event directory
export async function deleteEventDirectory(eventId: string): Promise<void> {
  try {
    const eventDir = path.join(UPLOAD_DIR, eventId);
    if (existsSync(eventDir)) {
      const fs = await import('fs/promises');
      await fs.rm(eventDir, { recursive: true, force: true });
    }
  } catch (error) {
    console.error('Error deleting event directory:', error);
  }
}

// Process multiple images from FormData
export async function processImageUploads(
  formData: FormData,
  eventId: string
): Promise<Array<{ imageUrl: string; imagePath: string; altText?: string }>> {
  const images: Array<{ imageUrl: string; imagePath: string; altText?: string }> = [];
  const files = formData.getAll('images[]');
  const altTexts = formData.getAll('imageAltTexts[]');

  console.log('Processing', files.length, 'files from FormData');

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file instanceof File) {
      console.log('Processing file', i + 1, 'of', files.length);
      const { imageUrl, imagePath } = await uploadImage(file, eventId);
      const altText = typeof altTexts[i] === 'string' ? altTexts[i] as string : undefined;
      images.push({ imageUrl, imagePath, altText });
    } else {
      console.warn('Skipping non-file entry at index', i);
    }
  }

  if (images.length === 0) {
    throw new Error('At least one image is required');
  }

  console.log('Successfully processed', images.length, 'images');
  return images;
}

