'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, MapPin, Images, ArrowRight } from 'lucide-react';

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
  isPublished: boolean;
  images: GalleryImage[];
};

export default function GalleryPage() {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/gallery/events', { cache: 'no-store' });
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to load gallery');
        }

        setEvents((data.events || []).filter((event: GalleryEvent) => event.images?.length > 0));
      } catch (err) {
        console.error('Error loading gallery:', err);
        setError('Unable to load gallery right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="pt-24 pb-8 bg-linear-to-br from-slate-900 via-blue-950 to-cyan-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.2),transparent_45%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Gallery</h1>
          <p className="mt-3 text-slate-200 max-w-2xl text-sm md:text-base">
            Explore moments from our events, partner meetups, and customer success stories.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 animate-pulse">
                <div className="h-52 rounded-xl bg-slate-200" />
                <div className="h-5 bg-slate-200 rounded mt-4 w-2/3" />
                <div className="h-4 bg-slate-200 rounded mt-2 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">{error}</div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <Images className="w-12 h-12 text-slate-400 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-slate-800">No Gallery Events Yet</h2>
            <p className="mt-2 text-slate-500">New event photos will appear here once published.</p>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="space-y-8">
            {events.map((event) => {
              const previewImages = event.images.slice(0, 2);

              return (
                <article key={event.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900">{event.title}</h2>
                      {event.isFeatured && (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                          Featured Event
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
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

                    <p className="mt-4 text-slate-600 leading-relaxed">{event.description}</p>

                    <div className="mt-5 flex flex-wrap gap-4">
                      {previewImages.map((img) => (
                        <div key={img.id} className="relative rounded-xl overflow-hidden w-56 h-36 sm:w-64 sm:h-40 md:w-72 md:h-44 bg-slate-100 shrink-0">
                          <Image
                            src={img.imageUrl}
                            alt={img.altText || event.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, 288px"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-5">
                      <Link
                        href={`/gallery/${event.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition-colors"
                      >
                        View All
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
