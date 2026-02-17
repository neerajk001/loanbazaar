'use client';
import React, { useState } from 'react';
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
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';

export default function CreateGalleryEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    isFeatured: false,
    isPublished: true,
    source: 'smartmumbaisolutions',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate files
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
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

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      alert('Please select at least one image');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('eventDate', formData.eventDate);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('isFeatured', formData.isFeatured.toString());
      formDataToSend.append('isPublished', formData.isPublished.toString());
      formDataToSend.append('source', formData.source);

      // Append all images
      selectedFiles.forEach((file, index) => {
        formDataToSend.append('images[]', file);
        formDataToSend.append('imageAltTexts[]', `${formData.title} - Photo ${index + 1}`);
      });

      const response = await fetch('/api/admin/gallery/events', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        alert('Event created successfully!');
        router.push('/admin/gallery');
      } else {
        alert('Failed to create event: ' + (data.error || JSON.stringify(data.errors)));
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/gallery"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Gallery
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Gallery Event</h1>
        <p className="text-gray-500">Add a new event with images to the gallery</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-8">
        {/* Title */}
        <div className="mb-6">
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
              placeholder="e.g., Christmas Festival 2024"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">5-255 characters</p>
        </div>

        {/* Description */}
        <div className="mb-6">
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
            placeholder="Describe the event..."
          />
          <p className="text-xs text-gray-500 mt-1">10-5000 characters</p>
        </div>

        {/* Event Date & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                placeholder="e.g., Mumbai Office"
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="mb-8 space-y-3">
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
              <span className="text-xs text-gray-500">(Show on homepage)</span>
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
              <span className="text-sm font-medium text-gray-900">Publish Immediately</span>
              <span className="text-xs text-gray-500">(Make visible to public)</span>
            </div>
          </label>
        </div>

        {/* Image Upload */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Event Images <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-900 font-medium mb-1">Click to upload images</p>
              <p className="text-sm text-gray-500">JPEG, PNG, WebP up to 5MB each</p>
            </label>
          </div>

          {/* Image Previews */}
          {previewUrls.length > 0 && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
                      Featured
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            {selectedFiles.length} {selectedFiles.length === 1 ? 'image' : 'images'} selected. The first image will be the featured image.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading || selectedFiles.length === 0}
            className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Event...
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5" />
                Create Event
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

