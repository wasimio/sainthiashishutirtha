export interface AcademicProgram {
  id: string;
  name: string;
  gradeRange: string;
  ageGroup: string;
  timing: string;
  description: string;
  highlights: string[];
  keySubjects: string[];
  badgeColor: string;
  iconName: string;
}

export interface Facility {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  features: string[];
}

export interface NoticeItem {
  id: string;
  title: string;
  date: string;
  category: 'Notice' | 'Event' | 'Holiday' | 'Academic';
  isImportant?: boolean;
  description: string;
  downloadUrl?: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'Classroom' | 'Sports' | 'Culture' | 'Arts';
  imageUrl: string;
  caption: string;
}

export interface Testimonial {
  id: string;
  parentName: string;
  childInfo: string;
  quote: string;
  rating: number;
}

export const SCHOOL_INFO = {
  name: "Sainthia Shishutirtha",
  tagline: "Inspiring Curiosity • Building Character • Nurturing Potential",
  subheading: "A Premier Early Childhood & Primary School (KG to Class IV)",
  affiliation: "Govt. Registered S/2L/14754 OF 2013-14",
  udiseNo: "19082200103",
  estdYear: "2013",
  address: "Sainthia Town, District Birbhum, West Bengal — 731234",
  phone: "+91 94740 12345 / +91 97320 67890",
  email: "info@sainthiashishutirtha.org",
  officeHours: "Monday to Friday: 8:00 AM – 2:30 PM | Saturday: 8:00 AM – 12:30 PM",
  studentTeacherRatio: "18:1",
  totalStudents: "340+",
  classesOffered: "Kindergarten (KG) to Class IV",
};

export const ACADEMIC_PROGRAMS: AcademicProgram[] = [
  {
    id: "pre-primary-kg",
    name: "Pre-Primary & Kindergarten (KG)",
    gradeRange: "Nursery to KG",
    ageGroup: "3 to 5 Years",
    timing: "8:30 AM – 11:45 AM",
    description: "A joyful, sensory-rich play-and-learn foundation where toddlers discover phonics, colors, numbers, sharing, and self-expression through guided storytelling and play.",
    highlights: [
      "Activity-based Montessori sensory materials",
      "Early English phonics & bilingual vocabulary",
      "Fine motor coordination & outdoor sand play",
      "Daily circle time, nursery rhymes & puppetry"
    ],
    keySubjects: ["Foundational Phonics", "Early Numeracy", "Rhymes & Rhythm", "Creative Art & Play", "General Awareness"],
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    iconName: "Sparkles"
  },
  {
    id: "primary-class-1-2",
    name: "Junior Primary (Class I & Class II)",
    gradeRange: "Class I – Class II",
    ageGroup: "6 to 7 Years",
    timing: "8:00 AM – 1:00 PM",
    description: "Transitioning natural curiosity into foundational reading, handwriting fluency, mathematical logic, and hands-on environmental exploration with zero stressful testing.",
    highlights: [
      "Structured reading corners and cursive handwriting",
      "Conceptual mental math & interactive number games",
      "Environmental Science (EVS) through nature walks",
      "Basic computer literacy & smart-board storytelling"
    ],
    keySubjects: ["English Literature & Grammar", "Bengali / Hindi First Language", "Mathematics", "Environmental Studies (EVS)", "General Knowledge & Drawing"],
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
    iconName: "BookOpen"
  },
  {
    id: "senior-primary-class-3-4",
    name: "Senior Primary (Class III & Class IV)",
    gradeRange: "Class III – Class IV",
    ageGroup: "8 to 10 Years",
    timing: "8:00 AM – 1:30 PM",
    description: "Empowering children with critical thinking, bilingual fluency, creative writing, scientific inquiry, and seamless preparation for entrance to leading secondary institutions.",
    highlights: [
      "Independent problem-solving & weekly science experiments",
      "Language lab with spoken English debates & recitation",
      "Foundational computer concepts & digital etiquette",
      "Sports, yoga, physical training & moral value sessions"
    ],
    keySubjects: ["English Literature & Applied Grammar", "First Language (Bengali / Hindi)", "Mathematics & Mental Arithmetic", "Science & Nature Exploration", "Social Studies", "Computer Studies", "Arts & Physical Education"],
    badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-200",
    iconName: "GraduationCap"
  }
];

export const SCHOOL_FACILITIES: Facility[] = [
  {
    id: "smart-classrooms",
    title: "Airy, Child-Centric Classrooms",
    category: "Learning Environment",
    description: "Brightly lit, cross-ventilated classrooms with child-sized ergonomic furniture, interactive digital displays, and vibrant learning walls.",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    features: ["Interactive audio-visual aids", "Ergonomic, rounded-edge desks", "Safety-cushioned floors for pre-primary"]
  },
  {
    id: "playground-sports",
    title: "Safe Green Playground & Play Zone",
    category: "Physical Fitness",
    description: "Spacious grassy field and secure equipment zone for football, sprint races, obstacle courses, swings, and morning gymnastics.",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
    features: ["Full grass field with running tracks", "Toddler play unit with soft landing", "Certified physical education instructor"]
  },
  {
    id: "junior-library",
    title: "Junior Library & Story Nook",
    category: "Literacy & Books",
    description: "Over 1,500 colorful picture books, bilingual fairy tales, children's encyclopedias, and plush reading beanbags that spark a lifelong love for books.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
    features: ["1,500+ curated children's books", "Weekly guided storytelling hours", "Borrow-and-read home lending system"]
  },
  {
    id: "creative-arts",
    title: "Art, Music & Cultural Studio",
    category: "Creative Expression",
    description: "A lively space dedicated to clay modeling, origami, drawing, classical vocals, harmonium, tabla, and folk dance rehearsals.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
    features: ["Drawing and painting easels", "Traditional and acoustic instruments", "Annual cultural drama preparations"]
  },
  {
    id: "safety-health",
    title: "Child Safety & Hygienic Infrastructure",
    category: "Safety & Wellbeing",
    description: "Comprehensive 24x7 CCTV coverage, guarded single-entry gate, multi-stage RO drinking water, and immaculate child-friendly sanitation.",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80",
    features: ["Full CCTV surveillance in all corridors", "Dedicated female attendants for junior washrooms", "First-aid medical room with trained staff"]
  },
  {
    id: "digital-lab",
    title: "Junior Computing & Discovery Lab",
    category: "Modern Skills",
    description: "Supervised computer lab introducing young learners to typing skills, educational logic games, and basic science simulations.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    features: ["Child-friendly keyboards & mice", "No unsupervised internet access", "Interactive logic building software"]
  }
];

export const WHY_CHOOSE_US = [
  {
    title: "Nurturing & Loving Faculty",
    description: "Every educator at Shishutirtha is specifically trained in child psychology and compassionate communication, ensuring no child feels intimidated.",
    icon: "HeartHandshake"
  },
  {
    title: "Individualized Attention (18:1)",
    description: "With small batch sizes, teachers know every single student by name, temperament, strengths, and pace of understanding.",
    icon: "Users"
  },
  {
    title: "Strong Foundational Bilingualism",
    description: "Equal emphasis on spoken & written English alongside mother tongue (Bengali/Hindi), creating confident multilingual communicators.",
    icon: "Languages"
  },
  {
    title: "Holistic Moral & Value Roots",
    description: "Beyond academics, children learn kindness, civic hygiene, mutual respect, table manners, and environmental gratitude.",
    icon: "ShieldCheck"
  },
  {
    title: "Zero-Stress Joyful Learning",
    description: "Play-based conceptual mastery replaces rote cramming. Homework is modest, enjoyable, and reinforcement-focused.",
    icon: "Smile"
  },
  {
    title: "Transparent Parent Partnership",
    description: "Regular parent-teacher dialogues, real-time notice sharing, and an open-door policy with the school leadership.",
    icon: "CalendarCheck"
  }
];

export const NOTICES_AND_EVENTS: NoticeItem[] = [
  {
    id: "n-1",
    title: "Admission Open for Session 2025–2026 (KG to Class IV)",
    date: "15 Oct 2026",
    category: "Notice",
    isImportant: true,
    description: "Forms are available at the school office and online portal. Limited seats available for Kindergarten and Class I. Early registration recommended.",
    downloadUrl: "#"
  },
  {
    id: "n-2",
    title: "Annual Sports & Athletic Fun Meet 2026",
    date: "28 Nov 2026",
    category: "Event",
    isImportant: true,
    description: "Our annual sports meet will be held at the school sports ground. Parents are warmly invited to cheer their little champions in fun races and drills.",
    downloadUrl: "#"
  },
  {
    id: "n-3",
    title: "Winter Term Uniform Guidelines & Timetable Notice",
    date: "04 Nov 2026",
    category: "Academic",
    isImportant: false,
    description: "Parents are requested to ensure students wear the prescribed school winter cardigan and clean badge. School morning bell rings promptly at 8:00 AM.",
    downloadUrl: "#"
  },
  {
    id: "n-4",
    title: "Children's Day Art & Science Discovery Exhibition",
    date: "14 Nov 2026",
    category: "Event",
    isImportant: false,
    description: "Exhibition displaying handcrafted science models, nature crafts, and paintings prepared by our young innovators from Class I through IV.",
    downloadUrl: "#"
  },
  {
    id: "n-5",
    title: "Parent-Teacher Evaluation & Feedback Meet",
    date: "08 Dec 2026",
    category: "Academic",
    isImportant: false,
    description: "One-on-one progress review for Second Term assessments. Detailed schedule slot will be provided in student communication diaries.",
    downloadUrl: "#"
  }
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "g-1",
    title: "Hands-on Math & Phonics Activity",
    category: "Classroom",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    caption: "Students engaged in manipulative math blocks and phonics cards."
  },
  {
    id: "g-2",
    title: "Morning Assembly & Cultural Song",
    category: "Culture",
    imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
    caption: "Children singing the national anthem and morning prayer together."
  },
  {
    id: "g-3",
    title: "Outdoor Relay & Obstacle Fun Race",
    category: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    caption: "Encouraging team spirit, agility, and sportsmanship on our campus grounds."
  },
  {
    id: "g-4",
    title: "Junior Artists Watercolor Workshop",
    category: "Arts",
    imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
    caption: "Expressing imagination through colors, brushstrokes, and clay modeling."
  },
  {
    id: "g-5",
    title: "Storytelling & Library Circle",
    category: "Classroom",
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    caption: "Fostering curious minds with interactive illustrated reading circles."
  },
  {
    id: "g-6",
    title: "Rabindra Jayanti & Folk Dance Performance",
    category: "Culture",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
    caption: "Celebration of Bengal's rich literary and musical heritage."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    parentName: "Smt. Priyanka Roy",
    childInfo: "Mother of Soumyadeep Roy (Class II)",
    quote: "When my son joined in KG, he was extremely shy. Within months, the affectionate teachers transformed him into an eager learner who loves reading aloud and asking questions. We couldn't be happier with Shishutirtha.",
    rating: 5
  },
  {
    id: "t-2",
    parentName: "Sri Anupam Mukherjee",
    childInfo: "Father of Ananya Mukherjee (Class IV)",
    quote: "The individual attention and discipline here are exemplary. Sainthia Shishutirtha strikes the perfect balance between Bengali cultural ethos and modern English-medium standards. Her confidence has grown immensely.",
    rating: 5
  },
  {
    id: "t-3",
    parentName: "Dr. K. Bhattacharya",
    childInfo: "Parent of Rishav (KG)",
    quote: "The emphasis on clean drinking water, safety gates, and child psychology makes this school stand out in Birbhum district. No child is stressed; learning is genuinely celebrated as play and curiosity.",
    rating: 5
  }
];

export const SAMPLE_ADMISSIONS = [
  {
    id: "APP-2026-081",
    applicantName: "Aarav Banerjee",
    appliedClass: "Class I",
    parentName: "Subrata Banerjee",
    phone: "+91 98321 44552",
    submissionDate: "18 Oct 2026",
    status: "Under Review",
    previousSchool: "Shishutirtha KG",
    dob: "12 May 2020",
    address: "Station Road, Sainthia, Birbhum"
  },
  {
    id: "APP-2026-082",
    applicantName: "Ishita Das",
    appliedClass: "KG",
    parentName: "Manoj Das",
    phone: "+91 94340 77123",
    submissionDate: "19 Oct 2026",
    status: "Interview Scheduled",
    previousSchool: "First Steps Playschool",
    dob: "04 Nov 2021",
    address: "College More, Sainthia, Birbhum"
  },
  {
    id: "APP-2026-083",
    applicantName: "Rohan Ghosh",
    appliedClass: "Class III",
    parentName: "Debashis Ghosh",
    phone: "+91 97321 88990",
    submissionDate: "19 Oct 2026",
    status: "Approved",
    previousSchool: "Vivekananda Academy",
    dob: "15 Jan 2018",
    address: "Netaji Pally, Sainthia, Birbhum"
  },
  {
    id: "APP-2026-084",
    applicantName: "Sanjukta Chatterjee",
    appliedClass: "Class II",
    parentName: "Amitava Chatterjee",
    phone: "+91 98322 11234",
    submissionDate: "20 Oct 2026",
    status: "Enrolled",
    previousSchool: "Shishutirtha Class I",
    dob: "22 Aug 2019",
    address: "Hospital Road, Sainthia, Birbhum"
  },
  {
    id: "APP-2026-085",
    applicantName: "Dev Sen",
    appliedClass: "Class IV",
    parentName: "Sandip Sen",
    phone: "+91 94741 55678",
    submissionDate: "20 Oct 2026",
    status: "Under Review",
    previousSchool: "St. Xavier's Prep",
    dob: "09 Feb 2017",
    address: "Mayureswar Road, Sainthia, Birbhum"
  },
  {
    id: "APP-2026-086",
    applicantName: "Tanushree Pal",
    appliedClass: "KG",
    parentName: "Bimal Pal",
    phone: "+91 97330 99432",
    submissionDate: "21 Oct 2026",
    status: "Interview Scheduled",
    previousSchool: "Home / First admission",
    dob: "30 Mar 2021",
    address: "Nandikeshwari Temple Road, Sainthia"
  }
];

export const SAMPLE_HOMEWORK = [
  {
    id: "hw-1",
    subject: "English Literature",
    grade: "Class II-B",
    teacher: "Mrs. S. Ganguly",
    dateAssigned: "20 Oct 2026",
    dueDate: "22 Oct 2026",
    title: "Read Chapter 4: 'The Little Blue Kite' & Complete Exercise B",
    instructions: "Read aloud pages 32-34 twice with parents. In the four-line notebook, write the new vocabulary words (Gently, Breeze, Soar, Ribbon) 3 times each with neat cursive penmanship.",
    status: "Pending",
    attachmentName: "Ch4_WordPractice_Sheet.pdf"
  },
  {
    id: "hw-2",
    subject: "Mathematics",
    grade: "Class II-B",
    teacher: "Mr. T. Roy",
    dateAssigned: "20 Oct 2026",
    dueDate: "21 Oct 2026",
    title: "2-Digit Addition with Carry-Over (Sums 1 to 10)",
    instructions: "Solve sums on page 48 in the Math Workbook. Use the tens and ones column method taught in today's class. Parents may guide but let the student count beads.",
    status: "Completed",
    attachmentName: "Math_Addition_Practice.pdf"
  },
  {
    id: "hw-3",
    subject: "Environmental Studies (EVS)",
    grade: "Class II-B",
    teacher: "Mrs. A. Sen",
    dateAssigned: "19 Oct 2026",
    dueDate: "23 Oct 2026",
    title: "Our Living Green World: Collect & Paste 3 Fallen Leaves",
    instructions: "Take a walk in your garden. Collect 3 different fallen leaves, paste them gently in the drawing scrapbook, and write their shape name (Round, Heart-shaped, Needle-like).",
    status: "Pending",
    attachmentName: "Plant_Life_Guide.pdf"
  },
  {
    id: "hw-4",
    subject: "Bengali (First Language)",
    grade: "Class II-B",
    teacher: "Mrs. M. Mukherjee",
    dateAssigned: "19 Oct 2026",
    dueDate: "21 Oct 2026",
    title: "সহজ পাঠ - দ্বিতীয় ভাগ (কবিতা আবৃত্তি ও হাতের কাজ)",
    instructions: "সহজ পাঠ বইয়ের 'বৃষ্টি পড়ে টাপুর টুপুর' কবিতাটির প্রথম ৮ লাইন সুন্দর করে খাতায় লিখবে এবং মুখস্থ আবৃত্তি অনুশীলন করবে।",
    status: "Completed",
    attachmentName: "Bangla_Lipi_Workbook.pdf"
  }
];

export const SAMPLE_ATTENDANCE_MONTH = {
  month: "October 2026",
  totalWorkingDays: 21,
  presentDays: 20,
  absentDays: 1,
  lateDays: 0,
  percentage: "95.2%",
  records: [
    { date: "01 Oct", status: "Present", remark: "On time" },
    { date: "02 Oct", status: "Holiday", remark: "Gandhi Jayanti" },
    { date: "05 Oct", status: "Present", remark: "On time" },
    { date: "06 Oct", status: "Present", remark: "On time" },
    { date: "07 Oct", status: "Present", remark: "On time" },
    { date: "08 Oct", status: "Present", remark: "On time" },
    { date: "09 Oct", status: "Absent", remark: "Mild seasonal cold (Leave application submitted)" },
    { date: "12 Oct", status: "Present", remark: "On time" },
    { date: "13 Oct", status: "Present", remark: "On time" },
    { date: "14 Oct", status: "Present", remark: "On time" },
    { date: "15 Oct", status: "Present", remark: "On time" },
    { date: "16 Oct", status: "Present", remark: "On time" },
    { date: "19 Oct", status: "Present", remark: "On time" },
    { date: "20 Oct", status: "Present", remark: "On time" },
    { date: "21 Oct", status: "Present", remark: "Today - Present" }
  ]
};
