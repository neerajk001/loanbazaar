'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Loader2,
  Calendar,
  MapPin,
  FileText,
  Star,
  Eye,
  Image as ImageIcon,
  Trash2,
  Save
} from 'lucide-react';
import Link from 'next/link';

interface GalleryImage {
  id: string;
  imageUrl: string;
  altText?: string;
  displayOrder: number;
  isFeatured: boolean;
}

interface GalleryEvent {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  isFeatured: boolean;
  isPublished: boolean;
  images: GalleryImage[];
}

export default function EditGalleryEvent({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [event, setEvent] = useState<GalleryEvent | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [eventId, setEventId] = useState<string>('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    isFeatured: false,
    isPublished: true,
  });

  useEffect(() => {
    // Unwrap params and fetch event
    params.then(({ id }) => {
      setEventId(id);
      fetchEvent(id);
    });
  }, []);

  const fetchEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/gallery/events/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setEvent(data.event);
        setFormData({
          title: data.event.title,
          description: data.event.description,
          eventDate: data.event.eventDate,
          location: data.event.location,
          isFeatured: data.event.isFeatured,
          isPublished: data.event.isPublished,
        });
      } else {
        alert('Event not found');
        router.push('/admin/gallery');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      alert('Error loading event');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024;
      
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a valid image format`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const deleteExistingImage = async (imageId: string) => {
    if (!event) return;
    
    if (event.images.length === 1 && selectedFiles.length === 0) {
      alert('Cannot delete the last image. Events must have at least one image.');
      return;
    }

    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/gallery/images/${imageId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchEvent(eventId); // Refresh event data
      } else {
        alert('Failed to delete image: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image');
    }
  };

  const addNewImages = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const formDataToSend = new FormData();
      selectedFiles.forEach((file, index) => {
        formDataToSend.append('images[]', file);
        formDataToSend.append('imageAltTexts[]', `${formData.title} - Photo`);
      });

      const response = await fetch(`/api/admin/gallery/events/${eventId}/images`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        setSelectedFiles([]);
        setPreviewUrls([]);
        fetchEvent(eventId); // Refresh event data
      } else {
        alert('Failed to add images: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding images:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // First, add new images if any
      if (selectedFiles.length > 0) {
        await addNewImages();
      }

      // Then update event details
      const response = await fetch(`/api/admin/gallery/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Event updated successfully!');
        router.push('/admin/gallery');
      } else {
        alert('Failed to update event: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-gray-600" />
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/admin/gallery"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Gallery
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Gallery Event</h1>
        <p className="text-gray-500">Update event details and manage images</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-8 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Event Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              required
              minLength={5}
              maxLength={255}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            minLength={10}
            maxLength={5000}
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
          />
        </div>

        {/* Event Date & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Event Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                required
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                minLength={3}
                maxLength={255}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-900">Mark as Featured</span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
            />
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-900">Published</span>
            </div>
          </label>
        </div>

        {/* Existing Images */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            Current Images ({event.images.length})
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {event.images.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.imageUrl}
                  alt={image.altText || ''}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => deleteExistingImage(image.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Delete image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {image.isFeatured && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
                    Featured
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add New Images */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Add More Images
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-900 font-medium mb-1">Click to upload</p>
              <p className="text-sm text-gray-500">JPEG, PNG, WebP up to 5MB</p>
            </label>
          </div>

          {previewUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`New ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewFile(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                    New
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
          <Link
            href="/admin/gallery"
            className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-gray-700"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

