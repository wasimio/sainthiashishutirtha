'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import WelcomeMessage from '@/components/home/WelcomeMessage';
import AboutSection from '@/components/home/AboutSection';
import AcademicPrograms from '@/components/home/AcademicPrograms';
import TeachingFacilities from '@/components/home/TeachingFacilities';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import PhotoGallery from '@/components/home/PhotoGallery';
import NoticesAndEvents from '@/components/home/NoticesAndEvents';
import AdmissionEnquiryCTA from '@/components/home/AdmissionEnquiryCTA';
import ContactSection from '@/components/home/ContactSection';
import AdmissionModal from '@/components/modals/AdmissionModal';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultGrade, setModalDefaultGrade] = useState<string | undefined>(undefined);

  const handleOpenModal = (grade?: string) => {
    setModalDefaultGrade(grade);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#243B43]">
      {/* 1. Header & Navigation */}
      <Navbar onOpenAdmissionModal={() => handleOpenModal()} />

      {/* 2. Hero Section */}
      <HeroSection onOpenAdmissionModal={() => handleOpenModal()} />

      {/* 3. Welcome Message */}
      <WelcomeMessage />

      {/* 4. About the School */}
      <AboutSection />

      {/* 5. Classes & Academic Programmes */}
      <AcademicPrograms onOpenAdmissionModal={(grade) => handleOpenModal(grade)} />

      {/* 6. Teaching Approach & Facilities */}
      <TeachingFacilities />

      {/* 7. Why Parents Choose Us */}
      <WhyChooseUs />

      {/* 8. Photo Gallery Preview */}
      <PhotoGallery />

      {/* 9. Latest Announcements & Events */}
      <NoticesAndEvents />

      {/* 10. Admission Enquiry Call to Action */}
      <AdmissionEnquiryCTA onOpenAdmissionModal={() => handleOpenModal()} />

      {/* 11. Contact Details & Location */}
      <ContactSection />

      {/* 12. Professional Footer */}
      <Footer onOpenAdmissionModal={() => handleOpenModal()} />

      {/* Interactive Admission Enquiry Modal */}
      <AdmissionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        defaultGrade={modalDefaultGrade}
      />
    </main>
  );
}
