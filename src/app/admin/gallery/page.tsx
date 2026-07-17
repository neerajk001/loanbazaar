'use client';
import React, { useState, useEffect } from 'react';
import { 
  Images, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Star,
  Loader2,
  Upload,
  X,
  Calendar,
  MapPin,
  Image as ImageIcon
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
  createdAt: string;
  updatedAt: string;
  source?: string;
}

export default function GalleryManagement() {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<GalleryEvent | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // Fetch all gallery events
  useEffect(() => {
    fetchEvents();
  }, [sourceFilter]);

  const fetchEvents = async () => {
    try {
      const url = sourceFilter === 'all' 
        ? '/api/admin/gallery/events'
        : `/api/admin/gallery/events?source=${sourceFilter}`;
      
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching gallery events:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? All images will be deleted.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/gallery/events/${eventId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('Event deleted successfully');
        fetchEvents(); // Refresh list
      } else {
        alert('Failed to delete event: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event');
    }
  };

  const togglePublished = async (event: GalleryEvent) => {
    try {
      const response = await fetch(`/api/admin/gallery/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !event.isPublished }),
      });

      const data = await response.json();

      if (data.success) {
        fetchEvents(); // Refresh list
      } else {
        alert('Failed to update event: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event');
    }
  };

  const toggleFeatured = async (event: GalleryEvent) => {
    try {
      const response = await fetch(`/api/admin/gallery/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !event.isFeatured }),
      });

      const data = await response.json();

      if (data.success) {
        fetchEvents(); // Refresh list
      } else {
        alert('Failed to update event: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Management</h1>
            <p className="text-gray-500">Manage gallery events and images</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Source Filter */}
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="all">All Sources</option>
              <option value="loan-sarathi">Loanbazaar</option>
              <option value="smartmumbaisolutions">Smart Mumbai Solutions</option>
            </select>
            
            <Link
              href="/admin/gallery/create"
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
            <Images className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{events.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Published</h3>
            <Eye className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {events.filter(e => e.isPublished).length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Featured</h3>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {events.filter(e => e.isFeatured).length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Images</h3>
            <ImageIcon className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {events.reduce((acc, e) => acc + e.images.length, 0)}
          </p>
        </div>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Images className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Yet</h3>
          <p className="text-gray-500 mb-6">Create your first gallery event to get started</p>
          <Link
            href="/admin/gallery/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                {event.images.length > 0 ? (
                  <img
                    src={event.images.find(img => img.isFeatured)?.imageUrl || event.images[0].imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-gray-300" />
                  </div>
                )}
                {/* Badges */}
                <div className="absolute top-3 right-3 flex gap-2">
                  {event.isFeatured && (
                    <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                  {event.isPublished ? (
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Published
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <EyeOff className="w-3 h-3" />
                      Draft
                    </span>
                  )}
                </div>
                {/* Image Count */}
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1 bg-black/70 text-white text-xs font-medium rounded-full flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    {event.images.length} {event.images.length === 1 ? 'photo' : 'photos'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1 flex-1">{event.title}</h3>
                  {event.source && (
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
                      event.source === 'smartmumbaisolutions' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {event.source === 'smartmumbaisolutions' ? 'SMS' : 'LS'}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.eventDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/gallery/${event.id}/edit`}
                    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium text-center"
                  >
                    <Edit className="w-4 h-4 inline mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => togglePublished(event)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    title={event.isPublished ? 'Unpublish' : 'Publish'}
                  >
                    {event.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => toggleFeatured(event)}
                    className={`px-4 py-2 border rounded-lg transition-colors text-sm font-medium ${
                      event.isFeatured 
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    title={event.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                  >
                    <Star className={`w-4 h-4 ${event.isFeatured ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                    title="Delete event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

