'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHeader from '@/components/common/PageHeader';
import QuickActionRail from '@/components/common/QuickActionRail';
import AdmissionModal from '@/components/modals/AdmissionModal';
import { X, ZoomIn } from 'lucide-react';
import { GALLERY_PHOTOS, GalleryPhoto } from '@/data/schoolData';

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['All', 'Classroom', 'Sports', 'Culture', 'Arts'];

  const filteredPhotos = activeFilter === 'All'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#243B43]">
      <Navbar onOpenAdmissionModal={() => setIsModalOpen(true)} />

      <PageHeader
        badge="Photo & Media Archive"
        title="Campus Life & Moments"
        subtitle="A visual celebration of daily discovery, festive celebrations, creative workshops, and playground smiles at Sainthia Shishutirtha."
        breadcrumbs={[{ label: 'Photo Gallery' }]}
      />

      <main className="flex-1 site-container py-12 space-y-10">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === cat
                  ? 'bg-[#308599] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-[#243B43]'
              }`}
            >
              {cat === 'All' ? 'All Moments' : cat}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100 cursor-pointer shadow-xs hover:shadow-lg transition-all border border-slate-200"
            >
              <Image
                src={photo.imageUrl}
                alt={photo.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-6 text-white">
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
                  <span>Click to enlarge photo</span>
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
      </main>

      <Footer onOpenAdmissionModal={() => setIsModalOpen(true)} />

      <QuickActionRail onOpenAdmissionModal={() => setIsModalOpen(true)} />

      <AdmissionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
