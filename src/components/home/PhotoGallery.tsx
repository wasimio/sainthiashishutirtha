'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, X, ZoomIn } from 'lucide-react';
import { GALLERY_PHOTOS, GalleryPhoto } from '@/data/schoolData';

export default function PhotoGallery() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const categories = ['All', 'Classroom', 'Sports', 'Culture', 'Arts'];

  const filteredPhotos = activeFilter === 'All'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter((p) => p.category === activeFilter);

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-[#EAF5F7]/30 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
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
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 cursor-pointer shadow-xs hover:shadow-lg transition-all border border-slate-200"
            >
              <Image
                src={photo.imageUrl}
                alt={photo.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-5 text-white">
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
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-[16/10] w-full bg-black">
                <Image
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>

              <div className="p-6 bg-white space-y-1">
                <span className="text-xs font-bold text-[#308599] uppercase tracking-wider">
                  {selectedPhoto.category}
                </span>
                <h3 className="text-lg font-bold text-[#243B43]">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
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
