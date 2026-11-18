'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, X, ZoomIn, ArrowRight } from 'lucide-react';
import { GALLERY_PHOTOS, GalleryPhoto } from '@/data/schoolData';

export default function PhotoGallery() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const categories = ['All', 'Classroom', 'Sports', 'Culture', 'Arts'];

  const filteredPhotos = activeFilter === 'All'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter((p) => p.category === activeFilter);

  // Focus restoration & body scroll locking when lightbox is active
  useEffect(() => {
    if (selectedPhoto) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        const closeBtn = document.getElementById('homeLightboxClose');
        if (closeBtn) {
          closeBtn.focus();
        }
      });
    } else {
      document.body.style.overflow = '';
      if (previouslyFocusedElement.current && typeof previouslyFocusedElement.current.focus === 'function') {
        previouslyFocusedElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedPhoto]);

  // Handle Escape key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedPhoto) {
        setSelectedPhoto(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-[#EAF5F7]/30 border-b border-slate-200">
      <div className="site-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-xs font-bold text-[#308599] border border-[#A5D1DC] shadow-xs">
            <Camera className="w-3.5 h-3.5 text-[#308599]" />
            <span>Campus Memories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#243B43] tracking-tight">
            Life at Sainthia Shishutirtha
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Glimpses of daily smiles, hands-on learning, morning sports, and colorful celebrations across our kindergarten and primary campus.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4" role="group" aria-label="Campus photo categories">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={activeFilter === cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 min-h-[40px] rounded-xl text-xs font-bold transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] ${
                  activeFilter === cat
                    ? 'bg-[#308599] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-[#243B43] border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelectedPhoto(photo)}
              aria-label={`View enlarged photo: ${photo.title} (${photo.category})`}
              className="w-full text-left group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 cursor-pointer shadow-xs hover:shadow-lg transition-all border border-slate-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599]"
            >
              <Image
                src={photo.imageUrl}
                alt={photo.title}
                fill
                sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) 50vw, 420px"
                loading="lazy"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                  {photo.category}
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {photo.title}
                </h4>
                <p className="text-xs text-slate-200 line-clamp-1 mt-1">
                  {photo.caption}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-[#A5D1DC] font-semibold mt-2">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Click to view larger</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* View Full Gallery Link */}
        <div className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] bg-white hover:bg-[#EAF5F7] text-[#308599] border border-[#A5D1DC] text-xs sm:text-sm font-bold rounded-xl shadow-2xs hover:shadow-sm transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599]"
          >
            <span>View Full Campus Photo Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Lightbox Modal */}
        {selectedPhoto && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="homeLightboxTitle"
            aria-describedby="homeLightboxDesc"
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                id="homeLightboxClose"
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-black/60 text-white hover:bg-black transition-colors flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-[16/10] w-full bg-black">
                <Image
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-contain"
                />
              </div>

              <div className="p-6 bg-white space-y-1">
                <span className="text-xs font-bold text-[#308599] uppercase tracking-wider">
                  {selectedPhoto.category}
                </span>
                <h3 id="homeLightboxTitle" className="text-lg font-bold text-[#243B43]">
                  {selectedPhoto.title}
                </h3>
                <p id="homeLightboxDesc" className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedPhoto.caption}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
