import type { Locale } from './locales';

export interface UiDictionary {
  languageSwitcher: { label: string; currentLanguage: string; unavailable: string };
  common: {
    skipToContent: string; home: string; readMore: string; back: string; close: string;
    loading: string; noResults: string; recent: string; publishedOn: string; by: string;
    search: string; clearFilters: string; previous: string; next: string; viewAll: string;
  };
  navigation: {
    openMenu: string; closeMenu: string; mainNavigation: string; mobileNavigation: string;
    home: string; about: string; academics: string; faculty: string; facilities: string;
    gallery: string; blog: string; admissions: string; notices: string; contact: string;
    helpline: string; quickEnquiry: string; schoolDescriptor: string; established: string;
  };
  actions: {
    applyNow: string; call: string; visit: string; locateCampus: string; backToTop: string;
    admissionEnquiry: string; viewNotices: string; download: string; bookVisit: string;
  };
  footer: {
    divisions: string; quickNavigation: string; schoolOffice: string; exploreFacilities: string;
    aboutSchool: string; facultyRoster: string; campusGallery: string; schoolBlog: string;
    circulars: string; contactOffice: string; established: string; udiseCode: string;
    affiliation: string; schoolHours: string; rights: string; registeredSchool: string;
  };
  pageHeader: { breadcrumbLabel: string; officialInformation: string };
  statusPages: {
    notFoundEyebrow: string; notFoundTitle: string; notFoundDescription: string;
    temporaryEyebrow: string; temporaryTitle: string; temporaryDescription: string;
    returnHome: string; contactSchool: string; tryAgain: string;
  };
  sections: {
    emptyNarrative: string; noFeatureCards: string; noFacilities: string; noItems: string;
    noQuestions: string; noSections: string; unsupported: string; keyHighlights: string;
  };
  notices: {
    title: string; searchPlaceholder: string; allCategories: string; important: string;
    issuedBy: string; attachments: string; officialDocument: string; otherRecent: string;
    notFoundTitle: string; notFoundDescription: string; backToNotices: string;
  };
  blog: {
    title: string; searchPlaceholder: string; allCategories: string; featured: string;
    readArticle: string; related: string; noPosts: string; backToBlog: string; minutesRead: string;
    columnist: string; relatedTopics: string; share: string; viewAll: string;
  };
  collections: {
    facultySearch: string; allDepartments: string; noFaculty: string;
    gallerySearch: string; allAlbums: string; noPhotos: string; teachingExperience: string;
    enlargePhoto: string; closePreview: string; photoCategories: string;
  };
  forms: {
    required: string; submit: string; submitting: string; success: string; error: string;
    name: string; phone: string; email: string; message: string; selectOption: string;
    contactTitle: string; contactIntro: string; parentName: string; emailOptional: string;
    classInterest: string; messagePrompt: string; sentTitle: string; referenceNumber: string;
    saveReference: string; anotherInquiry: string; unableToSend: string; administrativeOffice: string;
  };
  admissionForm: {
    close: string; eyebrow: string; title: string; subtitle: string; successTitle: string; thankYou: string;
    reference: string; studentName: string; gradeApplied: string; guardian: string; contact: string;
    responseNote: string; doneClose: string; incomplete: string; childInfo: string; childName: string;
    grade: string; dateOfBirth: string; gender: string; boy: string; girl: string; guardianInfo: string;
    guardianName: string; mobile: string; emailOptional: string; locality: string; notes: string;
    cancel: string; submit: string; submitting: string;
  };
  academics: {
    ageEligibility: string; classTimings: string; educators: string; capacity: string; seats: string;
    learningOutcomes: string; dailyRoutine: string; regularDay: string; curriculum: string;
    assessment: string; books: string; admissions: string; enroll: string; applyOnline: string; exploreOther: string;
  };
}

const dictionaries = {
  en: {
    languageSwitcher: {
      label: 'Language', currentLanguage: 'Current language: English',
      unavailable: 'Bengali is not published for this page yet.',
    },
    common: {
      skipToContent: 'Skip to main content', home: 'Home', readMore: 'Read more', back: 'Back',
      close: 'Close', loading: 'Loading…', noResults: 'No results found.', recent: 'Recent',
      publishedOn: 'Published on', by: 'by', search: 'Search', clearFilters: 'Clear filters',
      previous: 'Previous', next: 'Next', viewAll: 'View all',
    },
    navigation: {
      openMenu: 'Open navigation menu', closeMenu: 'Close navigation menu', mainNavigation: 'Main navigation',
      mobileNavigation: 'Mobile navigation', home: 'Home', about: 'About', academics: 'Academics',
      faculty: 'Faculty', facilities: 'Facilities', gallery: 'Gallery', blog: 'Blog', admissions: 'Admissions',
      notices: 'Notices', contact: 'Contact', helpline: 'Helpline', quickEnquiry: 'Quick admission enquiry',
      schoolDescriptor: 'Primary & Foundational School', established: 'Estd.',
    },
    actions: {
      applyNow: 'Apply now', call: 'Call', visit: 'Visit', locateCampus: 'Locate campus', backToTop: 'Back to top',
      admissionEnquiry: 'Admission enquiry', viewNotices: 'Notices & updates', download: 'Download', bookVisit: 'Book a visit',
    },
    footer: {
      divisions: 'Academic divisions', quickNavigation: 'Quick navigation', schoolOffice: 'School office',
      exploreFacilities: 'Explore campus facilities', aboutSchool: 'About school history & ethos',
      facultyRoster: 'Faculty & educators', campusGallery: 'Campus photo gallery', schoolBlog: 'School blog & pedagogy',
      circulars: 'Circulars & notices', contactOffice: 'Contact & campus visit', established: 'Estd.',
      udiseCode: 'U-DISE Code', affiliation: 'Affiliation / Reg.', schoolHours: 'School hours',
      rights: 'All rights reserved.', registeredSchool: 'Government Registered School',
    },
    pageHeader: { breadcrumbLabel: 'Breadcrumb', officialInformation: 'Official school information.' },
    statusPages: {
      notFoundEyebrow: 'Error 404', notFoundTitle: 'This page is not available',
      notFoundDescription: 'The page may not have been published yet, or the address may be incorrect. Please return home or visit another section of the school website.',
      temporaryEyebrow: 'Temporary problem', temporaryTitle: 'We could not load this page',
      temporaryDescription: 'The school website is temporarily unable to retrieve its published content. Please try again in a moment.',
      returnHome: 'Return to home', contactSchool: 'Contact the school', tryAgain: 'Try again',
    },
    sections: {
      emptyNarrative: 'This section has no published narrative yet.', noFeatureCards: 'No published feature cards are configured.',
      noFacilities: 'No published facility information is configured.', noItems: 'No published items are available.',
      noQuestions: 'No published questions are configured.', noSections: 'No published content sections are configured for this page.',
      unsupported: 'This published section type is not supported yet.', keyHighlights: 'Key highlights',
    },
    notices: {
      title: 'Notices & circulars', searchPlaceholder: 'Search notices', allCategories: 'All categories', important: 'Important',
      issuedBy: 'Issued by', attachments: 'Official attachments', officialDocument: 'Official school notification document',
      otherRecent: 'Other recent notices & circulars', notFoundTitle: 'Notice not found',
      notFoundDescription: 'The requested circular could not be found or has been unpublished.', backToNotices: 'Back to notices',
    },
    blog: {
      title: 'School blog', searchPlaceholder: 'Search articles', allCategories: 'All categories', featured: 'Featured',
      readArticle: 'Read article', related: 'Related articles', noPosts: 'No published articles found.', backToBlog: 'Back to blog',
      minutesRead: 'min read', columnist: 'Educational columnist', relatedTopics: 'Related topics',
      share: 'Share this article', viewAll: 'View all articles',
    },
    collections: {
      facultySearch: 'Search faculty', allDepartments: 'All departments', noFaculty: 'No published faculty members found.',
      gallerySearch: 'Search gallery', allAlbums: 'All albums', noPhotos: 'No published photos found.',
      teachingExperience: 'years teaching experience', enlargePhoto: 'Enlarge photo', closePreview: 'Close photo preview',
      photoCategories: 'Photo categories',
    },
    forms: {
      required: 'Required', submit: 'Submit', submitting: 'Submitting…', success: 'Thank you. Your message has been received.',
      error: 'Something went wrong. Please try again.', name: 'Name', phone: 'Phone', email: 'Email', message: 'Message',
      selectOption: 'Select an option', contactTitle: 'Send an enquiry or campus visit request',
      contactIntro: 'Share your question with the school office. The team will respond using the contact details you provide.',
      parentName: 'Parent / guardian name', emailOptional: 'Email address (optional)', classInterest: 'Class of interest',
      messagePrompt: 'Your message / specific question', sentTitle: 'Enquiry recorded successfully',
      referenceNumber: 'Official enquiry reference number', saveReference: 'Save this number for follow-up with the school office.',
      anotherInquiry: 'Send another enquiry', unableToSend: 'Unable to send enquiry', administrativeOffice: 'Administrative office',
    },
    admissionForm: {
      close: 'Close admission enquiry dialog', eyebrow: 'Admission enquiry', title: 'Online admission enquiry',
      subtitle: 'Share the applicant and guardian details with the school office.', successTitle: 'Enquiry submitted successfully',
      thankYou: 'Thank you for your interest.', reference: 'Official application reference', studentName: 'Student name',
      gradeApplied: 'Class applied for', guardian: 'Parent / guardian', contact: 'Contact mobile',
      responseNote: 'The school office will contact you. Save the reference number for follow-up.', doneClose: 'Done & close',
      incomplete: 'Submission incomplete', childInfo: "Child's information", childName: "Child's full name", grade: 'Class for admission',
      dateOfBirth: 'Date of birth', gender: 'Gender', boy: 'Boy', girl: 'Girl', guardianInfo: 'Parent / guardian information',
      guardianName: 'Parent / guardian name', mobile: 'Mobile phone number', emailOptional: 'Email address (optional)',
      locality: 'Residential locality', notes: 'Additional notes or previous school (optional)', cancel: 'Cancel',
      submit: 'Submit admission enquiry', submitting: 'Submitting enquiry…',
    },
    academics: {
      ageEligibility: 'Age eligibility', classTimings: 'Class timings', educators: 'Lead educators',
      capacity: 'Section capacity', seats: 'seats', learningOutcomes: 'Learning outcomes & milestones',
      dailyRoutine: 'Daily routine & timetable', regularDay: 'Regular day', curriculum: 'Subjects & weekly allocation',
      assessment: 'Continuous assessment', books: 'Prescribed books & learning kits', admissions: 'Admissions',
      enroll: 'Enrol your child', applyOnline: 'Apply online', exploreOther: 'Explore other academic wings',
    },
  },
  bn: {
    languageSwitcher: {
      label: 'ভাষা', currentLanguage: 'বর্তমান ভাষা: বাংলা', unavailable: 'এই পাতার বাংলা সংস্করণ এখনও প্রকাশিত হয়নি।',
    },
    common: {
      skipToContent: 'মূল বিষয়বস্তুতে যান', home: 'প্রচ্ছদ', readMore: 'আরও পড়ুন', back: 'ফিরে যান', close: 'বন্ধ করুন',
      loading: 'লোড হচ্ছে…', noResults: 'কোনও ফল পাওয়া যায়নি।', recent: 'সাম্প্রতিক', publishedOn: 'প্রকাশিত',
      by: 'প্রকাশক', search: 'খুঁজুন', clearFilters: 'ফিল্টার মুছুন', previous: 'আগের', next: 'পরের', viewAll: 'সব দেখুন',
    },
    navigation: {
      openMenu: 'নেভিগেশন মেনু খুলুন', closeMenu: 'নেভিগেশন মেনু বন্ধ করুন', mainNavigation: 'প্রধান নেভিগেশন',
      mobileNavigation: 'মোবাইল নেভিগেশন', home: 'প্রচ্ছদ', about: 'আমাদের সম্পর্কে', academics: 'পঠনপাঠন',
      faculty: 'শিক্ষকমণ্ডলী', facilities: 'পরিকাঠামো', gallery: 'ছবিঘর', blog: 'লেখালেখি', admissions: 'ভর্তি',
      notices: 'বিজ্ঞপ্তি', contact: 'যোগাযোগ', helpline: 'সহায়তা', quickEnquiry: 'দ্রুত ভর্তি অনুসন্ধান',
      schoolDescriptor: 'প্রাথমিক ও ভিত্তিমূলক বিদ্যালয়', established: 'প্রতিষ্ঠিত',
    },
    actions: {
      applyNow: 'এখনই আবেদন করুন', call: 'ফোন', visit: 'পরিদর্শন', locateCampus: 'বিদ্যালয়ের অবস্থান', backToTop: 'উপরে ফিরুন',
      admissionEnquiry: 'ভর্তি অনুসন্ধান', viewNotices: 'বিজ্ঞপ্তি ও খবর', download: 'ডাউনলোড', bookVisit: 'পরিদর্শনের সময় নিন',
    },
    footer: {
      divisions: 'শিক্ষাবিভাগ', quickNavigation: 'দ্রুত নেভিগেশন', schoolOffice: 'বিদ্যালয় দপ্তর',
      exploreFacilities: 'বিদ্যালয়ের পরিকাঠামো দেখুন', aboutSchool: 'বিদ্যালয়ের ইতিহাস ও আদর্শ', facultyRoster: 'শিক্ষকমণ্ডলী',
      campusGallery: 'বিদ্যালয়ের ছবিঘর', schoolBlog: 'বিদ্যালয়ের লেখা ও শিক্ষাভাবনা', circulars: 'বিজ্ঞপ্তি ও পরিপত্র',
      contactOffice: 'যোগাযোগ ও বিদ্যালয় পরিদর্শন', established: 'প্রতিষ্ঠিত', udiseCode: 'ইউ-ডাইস কোড',
      affiliation: 'স্বীকৃতি / নিবন্ধন', schoolHours: 'বিদ্যালয়ের সময়', rights: 'সর্বস্বত্ব সংরক্ষিত।',
      registeredSchool: 'সরকারি নিবন্ধিত বিদ্যালয়',
    },
    pageHeader: { breadcrumbLabel: 'পথনির্দেশ', officialInformation: 'বিদ্যালয়ের সরকারি তথ্য।' },
    statusPages: {
      notFoundEyebrow: 'ত্রুটি ৪০৪', notFoundTitle: 'এই পাতাটি উপলভ্য নয়',
      notFoundDescription: 'পাতাটি এখনও প্রকাশিত হয়নি অথবা ঠিকানাটি সঠিক নয়। প্রচ্ছদে ফিরুন বা বিদ্যালয়ের অন্য কোনও বিভাগ দেখুন।',
      temporaryEyebrow: 'সাময়িক সমস্যা', temporaryTitle: 'পাতাটি লোড করা যায়নি',
      temporaryDescription: 'বিদ্যালয়ের প্রকাশিত তথ্য এই মুহূর্তে আনা যাচ্ছে না। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।',
      returnHome: 'প্রচ্ছদে ফিরুন', contactSchool: 'বিদ্যালয়ের সঙ্গে যোগাযোগ', tryAgain: 'আবার চেষ্টা করুন',
    },
    sections: {
      emptyNarrative: 'এই অংশে এখনও কোনও প্রকাশিত বিবরণ নেই।', noFeatureCards: 'কোনও প্রকাশিত বৈশিষ্ট্য যোগ করা হয়নি।',
      noFacilities: 'কোনও প্রকাশিত পরিকাঠামোর তথ্য নেই।', noItems: 'কোনও প্রকাশিত বিষয়বস্তু নেই।',
      noQuestions: 'কোনও প্রকাশিত প্রশ্ন নেই।', noSections: 'এই পাতায় কোনও প্রকাশিত বিষয়বস্তুর অংশ নেই।',
      unsupported: 'এই প্রকাশিত অংশটি এখনও দেখানো যায় না।', keyHighlights: 'মূল বৈশিষ্ট্য',
    },
    notices: {
      title: 'বিজ্ঞপ্তি ও পরিপত্র', searchPlaceholder: 'বিজ্ঞপ্তি খুঁজুন', allCategories: 'সব বিভাগ', important: 'গুরুত্বপূর্ণ',
      issuedBy: 'প্রকাশক', attachments: 'সরকারি সংযুক্তি', officialDocument: 'বিদ্যালয়ের সরকারি বিজ্ঞপ্তির নথি',
      otherRecent: 'অন্যান্য সাম্প্রতিক বিজ্ঞপ্তি ও পরিপত্র', notFoundTitle: 'বিজ্ঞপ্তি পাওয়া যায়নি',
      notFoundDescription: 'অনুরোধ করা বিজ্ঞপ্তিটি পাওয়া যায়নি বা প্রকাশনা প্রত্যাহার করা হয়েছে।', backToNotices: 'বিজ্ঞপ্তিতে ফিরুন',
    },
    blog: {
      title: 'বিদ্যালয়ের লেখালেখি', searchPlaceholder: 'লেখা খুঁজুন', allCategories: 'সব বিভাগ', featured: 'নির্বাচিত',
      readArticle: 'লেখাটি পড়ুন', related: 'সম্পর্কিত লেখা', noPosts: 'কোনও প্রকাশিত লেখা পাওয়া যায়নি।',
      backToBlog: 'লেখালেখিতে ফিরুন', minutesRead: 'মিনিটের পাঠ', columnist: 'শিক্ষাবিষয়ক লেখক',
      relatedTopics: 'সম্পর্কিত বিষয়', share: 'লেখাটি শেয়ার করুন', viewAll: 'সব লেখা দেখুন',
    },
    collections: {
      facultySearch: 'শিক্ষক খুঁজুন', allDepartments: 'সব বিভাগ', noFaculty: 'কোনও প্রকাশিত শিক্ষক-তথ্য পাওয়া যায়নি।',
      gallerySearch: 'ছবি খুঁজুন', allAlbums: 'সব অ্যালবাম', noPhotos: 'কোনও প্রকাশিত ছবি পাওয়া যায়নি।',
      teachingExperience: 'বছরের শিক্ষকতার অভিজ্ঞতা', enlargePhoto: 'ছবি বড় করে দেখুন', closePreview: 'ছবির প্রিভিউ বন্ধ করুন',
      photoCategories: 'ছবির বিভাগ',
    },
    forms: {
      required: 'আবশ্যক', submit: 'জমা দিন', submitting: 'জমা হচ্ছে…', success: 'ধন্যবাদ। আপনার বার্তা গ্রহণ করা হয়েছে।',
      error: 'কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।', name: 'নাম', phone: 'ফোন', email: 'ইমেল', message: 'বার্তা',
      selectOption: 'একটি বিকল্প বেছে নিন', contactTitle: 'অনুসন্ধান বা বিদ্যালয় পরিদর্শনের অনুরোধ পাঠান',
      contactIntro: 'বিদ্যালয় দপ্তরে আপনার প্রশ্ন জানান। আপনার দেওয়া যোগাযোগের মাধ্যমে বিদ্যালয় কর্তৃপক্ষ উত্তর দেবেন।',
      parentName: 'অভিভাবকের নাম', emailOptional: 'ইমেল ঠিকানা (ঐচ্ছিক)', classInterest: 'যে শ্রেণিতে আগ্রহী',
      messagePrompt: 'আপনার বার্তা বা নির্দিষ্ট প্রশ্ন', sentTitle: 'অনুসন্ধান সফলভাবে নথিভুক্ত হয়েছে',
      referenceNumber: 'সরকারি অনুসন্ধান রেফারেন্স নম্বর', saveReference: 'বিদ্যালয় দপ্তরে যোগাযোগের জন্য নম্বরটি সংরক্ষণ করুন।',
      anotherInquiry: 'আরেকটি অনুসন্ধান পাঠান', unableToSend: 'অনুসন্ধান পাঠানো যায়নি', administrativeOffice: 'প্রশাসনিক দপ্তর',
    },
    admissionForm: {
      close: 'ভর্তি অনুসন্ধানের সংলাপ বন্ধ করুন', eyebrow: 'ভর্তি অনুসন্ধান', title: 'অনলাইন ভর্তি অনুসন্ধান',
      subtitle: 'শিক্ষার্থী ও অভিভাবকের তথ্য বিদ্যালয় দপ্তরে পাঠান।', successTitle: 'অনুসন্ধান সফলভাবে জমা হয়েছে',
      thankYou: 'আগ্রহের জন্য ধন্যবাদ।', reference: 'সরকারি আবেদন রেফারেন্স', studentName: 'শিক্ষার্থীর নাম',
      gradeApplied: 'আবেদন করা শ্রেণি', guardian: 'অভিভাবক', contact: 'যোগাযোগের মোবাইল',
      responseNote: 'বিদ্যালয় দপ্তর আপনার সঙ্গে যোগাযোগ করবে। পরবর্তী যোগাযোগের জন্য রেফারেন্স নম্বরটি সংরক্ষণ করুন।',
      doneClose: 'সম্পন্ন করে বন্ধ করুন', incomplete: 'আবেদন অসম্পূর্ণ', childInfo: 'শিশুর তথ্য', childName: 'শিশুর পূর্ণ নাম',
      grade: 'ভর্তির শ্রেণি', dateOfBirth: 'জন্মতারিখ', gender: 'লিঙ্গ', boy: 'ছেলে', girl: 'মেয়ে',
      guardianInfo: 'অভিভাবকের তথ্য', guardianName: 'অভিভাবকের নাম', mobile: 'মোবাইল নম্বর',
      emailOptional: 'ইমেল ঠিকানা (ঐচ্ছিক)', locality: 'বাসস্থানের এলাকা', notes: 'অতিরিক্ত তথ্য বা পূর্ববর্তী বিদ্যালয় (ঐচ্ছিক)',
      cancel: 'বাতিল', submit: 'ভর্তি অনুসন্ধান জমা দিন', submitting: 'অনুসন্ধান জমা হচ্ছে…',
    },
    academics: {
      ageEligibility: 'বয়সের যোগ্যতা', classTimings: 'শ্রেণির সময়', educators: 'প্রধান শিক্ষক',
      capacity: 'শ্রেণির আসনসংখ্যা', seats: 'টি আসন', learningOutcomes: 'শেখার লক্ষ্য ও অগ্রগতি',
      dailyRoutine: 'দৈনিক রুটিন ও সময়সূচি', regularDay: 'সাধারণ দিন', curriculum: 'বিষয় ও সাপ্তাহিক পাঠসময়',
      assessment: 'ধারাবাহিক মূল্যায়ন', books: 'নির্ধারিত বই ও শিক্ষাসামগ্রী', admissions: 'ভর্তি',
      enroll: 'আপনার শিশুকে ভর্তি করুন', applyOnline: 'অনলাইনে আবেদন করুন', exploreOther: 'অন্যান্য শিক্ষাবিভাগ দেখুন',
    },
  },
} as const satisfies Record<Locale, UiDictionary>;

export function getUiDictionary(locale: Locale): UiDictionary {
  return dictionaries[locale];
}

export const UI_DICTIONARIES: Readonly<Record<Locale, UiDictionary>> = dictionaries;
