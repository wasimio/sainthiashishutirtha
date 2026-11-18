'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';
import type { GalleryPhoto } from '@/data/schoolData';
import { resolvePublicMediaUrl } from '@/lib/media/resolveMediaUrl';
import { getUiDictionary } from '@/lib/i18n/dictionaries';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locales';

interface GalleryGridClientProps {
  photos: GalleryPhoto[];
  locale?: Locale;
}

export default function GalleryGridClient({ photos, locale = DEFAULT_LOCALE }: GalleryGridClientProps) {
  const dictionary = getUiDictionary(locale);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const categories = ['All', ...Array.from(new Set(photos.map((photo) => photo.category).filter(Boolean)))];

  const filteredPhotos = activeFilter === 'All'
    ? photos
    : photos.filter((p) => p.category === activeFilter);

  // Focus restoration & body scroll locking when lightbox is active
  useEffect(() => {
    if (selectedPhoto) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      // Focus close button on lightbox open
      requestAnimationFrame(() => {
        const closeBtn = document.getElementById('lightboxCloseButton');
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
    <div className="space-y-10">
      {/* Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label={dictionary.collections.photoCategories}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            aria-pressed={activeFilter === cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 min-h-[40px] rounded-xl text-xs font-bold transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] ${
              activeFilter === cat
                ? 'bg-[#308599] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-[#243B43]'
            }`}
          >
            {cat === 'All' ? dictionary.collections.allAlbums : cat}
          </button>
        ))}
      </div>

      {/* Photos Grid or Empty State */}
      {filteredPhotos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelectedPhoto(photo)}
              aria-label={`${dictionary.collections.enlargePhoto}: ${photo.title}`}
              className="premium-card w-full text-left group relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100 cursor-pointer shadow-xs hover:shadow-lg transition-all border border-slate-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599]"
            >
              <Image
                src={resolvePublicMediaUrl(photo.imageUrl)}
                alt={photo.title}
                fill
                unoptimized={Boolean(photo.imageUrl && !photo.imageUrl.startsWith('/'))}
                sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) 50vw, 420px"
                loading="lazy"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Hover / Focus Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                  {photo.category}
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  {photo.title}
                </h4>
                <p className="text-xs text-slate-200 line-clamp-2 mt-1">
                  {photo.caption}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-[#A5D1DC] font-semibold mt-2.5">
                  <ZoomIn className="w-4 h-4" />
                  <span>{dictionary.collections.enlargePhoto}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center space-y-3">
          <ZoomIn className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-[#243B43]">
            {dictionary.collections.noPhotos}
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            {dictionary.common.noResults}
          </p>
          {activeFilter !== 'All' && (
            <button
              type="button"
              onClick={() => setActiveFilter('All')}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-[#308599] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {dictionary.collections.allAlbums}
            </button>
          )}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightboxPhotoTitle"
          aria-describedby="lightboxPhotoDesc"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="lightboxCloseButton"
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-black/60 text-white hover:bg-black transition-colors flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              aria-label={dictionary.collections.closePreview}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/10] w-full bg-black">
              <Image
                src={resolvePublicMediaUrl(selectedPhoto.imageUrl)}
                alt={selectedPhoto.title}
                fill
                unoptimized={Boolean(selectedPhoto.imageUrl && !selectedPhoto.imageUrl.startsWith('/'))}
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-contain"
              />
            </div>

            <div className="p-6 bg-white space-y-1">
              <span className="text-xs font-bold text-[#308599] uppercase tracking-wider">
                {selectedPhoto.category}
              </span>
              <h3 id="lightboxPhotoTitle" className="text-lg font-bold text-[#243B43]">
                {selectedPhoto.title}
              </h3>
              <p id="lightboxPhotoDesc" className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
