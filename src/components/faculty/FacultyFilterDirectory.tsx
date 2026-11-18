'use client';

import React, { useState } from 'react';
import CmsImage from '@/components/media/CmsImage';
import { GraduationCap, Award } from 'lucide-react';
import type { FacultyMember } from '@/data/schoolData';
import { getUiDictionary } from '@/lib/i18n/dictionaries';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locales';

interface FacultyFilterDirectoryProps {
  faculty: FacultyMember[];
  locale?: Locale;
}

export default function FacultyFilterDirectory({ faculty, locale = DEFAULT_LOCALE }: FacultyFilterDirectoryProps) {
  const dictionary = getUiDictionary(locale);
  const [selectedDept, setSelectedDept] = useState<string>('All');

  const departments = ['All', ...Array.from(new Set(faculty.map((member) => member.department).filter(Boolean)))];

  const filteredFaculty = selectedDept === 'All'
    ? faculty
    : faculty.filter((f) => f.department === selectedDept);

  return (
    <div className="space-y-12">
      {/* Department Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label={dictionary.collections.allDepartments}>
        {departments.map((dept) => (
          <button
            key={dept}
            type="button"
            aria-pressed={selectedDept === dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-4 py-2 min-h-[40px] rounded-xl text-xs font-bold transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#308599] ${
              selectedDept === dept
                ? 'bg-[#308599] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-[#243B43]'
            }`}
          >
            {dept === 'All' ? dictionary.collections.allDepartments : dept}
          </button>
        ))}
      </div>

      {/* Faculty Grid or Empty State */}
      {filteredFaculty.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFaculty.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Photo */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <CmsImage
                    src={mentor.image}
                    alt={mentor.name}
                    fallbackSrc="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=450&q=75"
                    placeholderText={mentor.name}
                    fill
                    sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) 50vw, 320px"
                    loading="lazy"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#243B43]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {mentor.department}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-[#243B43] group-hover:text-[#308599] transition-colors leading-snug">
                      {mentor.name}
                    </h3>
                    <p className="text-xs text-[#308599] font-semibold mt-0.5">
                      {mentor.role}
                    </p>
                  </div>

                  <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#308599]" />
                      <span className="truncate">{mentor.qualification}</span>
                    </div>
                    {mentor.experienceYears > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>{mentor.experienceYears}+ {dictionary.collections.teachingExperience}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 pt-1">
                    {mentor.bio}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2">
                <span className="text-[11px] font-medium bg-[#EAF5F7] text-[#308599] px-2.5 py-1 rounded-lg block text-center border border-[#A5D1DC]/60 truncate">
                  {mentor.specialization}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center space-y-3">
          <GraduationCap className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-[#243B43]">
            {dictionary.collections.noFaculty}
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            {dictionary.common.noResults}
          </p>
          {selectedDept !== 'All' && (
            <button
              type="button"
              onClick={() => setSelectedDept('All')}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-[#308599] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {dictionary.collections.allDepartments}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
