'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Calendar, MapPin, Images } from 'lucide-react';

type GalleryImage = {
  id: string;
  imageUrl: string;
  altText?: string;
  displayOrder: number;
  isFeatured: boolean;
};

type GalleryEvent = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  isFeatured: boolean;
  images: GalleryImage[];
};

export default function GalleryEventPage() {
  const params = useParams<{ id: string }>();
  const eventId = params?.id;

  const [event, setEvent] = useState<GalleryEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/gallery/events/${eventId}`, { cache: 'no-store' });
        const data = await response.json();

        if (!data.success || !data.event) {
          throw new Error(data.error || 'Failed to load event');
        }

        setEvent(data.event);
      } catch (err) {
        console.error('Error loading gallery event:', err);
        setError('Unable to load this event right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="pt-24 pb-8 bg-linear-to-br from-slate-900 via-blue-950 to-cyan-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.2),transparent_45%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-slate-200 hover:text-white text-sm font-medium mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back To Gallery
          </Link>

          {event && (
            <>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{event.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-200">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(event.eventDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Images className="h-4 w-4" />
                  {event.images.length} photos
                </span>
              </div>
              <p className="mt-4 max-w-3xl text-slate-100">{event.description}</p>
            </>
          )}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {loading && (
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 animate-pulse">
                <div className="h-[260px] md:h-[420px] rounded-xl bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">{error}</div>
        )}

        {!loading && !error && event && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {event.images.map((img, index) => (
              <article key={img.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative aspect-square bg-slate-100">
                  <Image
                    src={img.imageUrl}
                    alt={img.altText || `${event.title} image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={index < 4}
                  />
                </div>
                <div className="px-3 py-2 text-[11px] text-slate-500">Photo {index + 1}</div>
              </article>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
