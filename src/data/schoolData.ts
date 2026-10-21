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
  slug: string;
}

export interface ClassDetail {
  slug: string;
  title: string;
  gradeRange: string;
  ageRequirement: string;
  schoolHours: string;
  classTeacher: string;
  studentCapacity: number;
  overview: string;
  learningOutcomes: string[];
  curriculumBreakdown: {
    subject: string;
    description: string;
    weeklyHours: string;
  }[];
  dailyRoutine: {
    time: string;
    activity: string;
  }[];
  booklistHighlights: string[];
}

export interface FacultyMember {
  id: string;
  name: string;
  role: string;
  department: 'Leadership' | 'Primary' | 'Pre-Primary' | 'Activity & Physical';
  qualification: string;
  experienceYears: number;
  bio: string;
  image: string;
  specialization: string;
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
  fullContent?: string;
  issuedBy?: string;
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
    slug: "pre-primary-kg",
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
    slug: "junior-primary",
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
    slug: "senior-primary",
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

export const CLASS_DETAILS: Record<string, ClassDetail> = {
  "pre-primary-kg": {
    slug: "pre-primary-kg",
    title: "Pre-Primary & Kindergarten (KG)",
    gradeRange: "Nursery & KG",
    ageRequirement: "3 to 5 Years as of 1st January of admission year",
    schoolHours: "8:30 AM – 11:45 AM (Monday to Friday)",
    classTeacher: "Mrs. Anindita Ghosh & Mrs. Rina Pal",
    studentCapacity: 65,
    overview: "The Kindergarten years at Sainthia Shishutirtha form the gentle emotional bridge from home to formal school life. Using play-way Montessori methodologies, children develop communication, self-care routines, bilingual phonetic recognition, and joyful socialization in an intimidation-free setting.",
    learningOutcomes: [
      "Clear pronunciation of phonetic sounds and sight words",
      "Counting, numeral recognition (1-100), and simple grouping",
      "Fine motor control for pencil grip, paper tearing, and clay modeling",
      "Social confidence in greeting teachers and sharing toys with peers",
      "Confidence in reciting nursery rhymes in both English and Bengali"
    ],
    curriculumBreakdown: [
      { subject: "Phonics & English Pre-Reading", description: "Letter sounds, picture association, storytelling, and early vocabulary building.", weeklyHours: "5 Hours" },
      { subject: "Play Numeracy & Logic", description: "Counting beads, shape identification, sorting, size comparisons, and number tracing.", weeklyHours: "4 Hours" },
      { subject: "First Language (Bengali/Hindi)", description: "Vowels and basic consonants through songs, rhymes, and pictorial flashcards.", weeklyHours: "4 Hours" },
      { subject: "Creative Arts & Motor Play", description: "Crayons, finger painting, dough sculpting, action songs, and outdoor swing play.", weeklyHours: "4 Hours" },
      { subject: "Life Skills & Etiquette", description: "Handwashing hygiene, table manners during tiffin, packing school bags neatly.", weeklyHours: "2 Hours" }
    ],
    dailyRoutine: [
      { time: "8:30 AM", activity: "Warm welcome, greeting & bag arrangement" },
      { time: "8:45 AM", activity: "Morning prayer, gentle stretch & circle time" },
      { time: "9:15 AM", activity: "Phonics & early literacy activities" },
      { time: "10:00 AM", activity: "Supervised tiffin break & clean-up habits" },
      { time: "10:30 AM", activity: "Playground games, sand play & swings" },
      { time: "11:00 AM", activity: "Storybook reading, rhyme recitation & arts" },
      { time: "11:45 AM", activity: "Safe single-gate dispersal to parents" }
    ],
    booklistHighlights: [
      "Hopscotch Phonics Primer (Early Childhood Edition)",
      "My Fun Number World (Pre-Math Concepts)",
      "সহজ ছড়া ও ছবি (চিত্রসহ বাংলা বর্ণমালা)",
      "Little Artists Drawing & Coloring Book"
    ]
  },
  "junior-primary": {
    slug: "junior-primary",
    title: "Junior Primary (Class I & Class II)",
    gradeRange: "Class I – Class II",
    ageRequirement: "6 to 7 Years as of 1st January of admission year",
    schoolHours: "8:00 AM – 1:00 PM (Monday to Friday)",
    classTeacher: "Mrs. S. Ganguly (Class II-B) & Mr. T. Roy (Class I-A)",
    studentCapacity: 60,
    overview: "Junior Primary focuses on solidifying foundational literacy and numeracy (FLN) as mandated by modern child-development guidelines. Children master cursive penmanship, mental arithmetic, and environmental observation with abundant praise and continuous encouragement.",
    learningOutcomes: [
      "Fluency in reading early chapter books and reading aloud with expression",
      "Mastery of addition, subtraction, simple word problems, and multiplication tables up to 10",
      "Accurate sentence formation and short creative paragraphs in English and Bengali",
      "Awareness of nature, seasonal cycles, plants, animals, and civic hygiene",
      "Basic understanding of digital computers through visual touchscreens and keyboard games"
    ],
    curriculumBreakdown: [
      { subject: "English Literature & Grammar", description: "Guided reading, sentence construction, vocabulary notebooks, and cursive writing.", weeklyHours: "6 Hours" },
      { subject: "First Language (সহজ পাঠ / সাহিত্য)", description: "Rabindranath Tagore's Sahaj Path Part 1 & 2, reading fluency, and dictation.", weeklyHours: "5 Hours" },
      { subject: "Mathematics & Mental Math", description: "2-digit arithmetic, place value, money calculation, time reading, and mental puzzles.", weeklyHours: "6 Hours" },
      { subject: "Environmental Studies (EVS)", description: "Our body, family, neighborhood, plants, water conservation, and clean food habits.", weeklyHours: "4 Hours" },
      { subject: "Computer Studies", description: "Introduction to monitor, CPU, mouse navigation, and interactive typing software.", weeklyHours: "2 Hours" },
      { subject: "Co-Curricular Arts & P.E.", description: "Watercolors, vocal music, morning gymnastics, and team races.", weeklyHours: "3 Hours" }
    ],
    dailyRoutine: [
      { time: "8:00 AM", activity: "Assembly, national anthem, pledge & thought for the day" },
      { time: "8:20 AM", activity: "Period 1: English Language & Phonics" },
      { time: "9:05 AM", activity: "Period 2: Mental Mathematics & Problem Solving" },
      { time: "9:50 AM", activity: "Period 3: Bengali / Hindi Literature" },
      { time: "10:35 AM", activity: "Recess: Nutritious tiffin & outdoor playground play" },
      { time: "11:05 AM", activity: "Period 4: Environmental Studies (EVS) / Nature Walk" },
      { time: "11:50 AM", activity: "Period 5: Drawing / Vocal Music / Computer Lab" },
      { time: "12:35 PM", activity: "Diary writing, teacher remarks review & packing" },
      { time: "1:00 PM", activity: "Gate dispersal with teacher escorts" }
    ],
    booklistHighlights: [
      "New Broadway English Coursebook & Workbook (Oxford/Foundation)",
      "সহজ পাঠ - প্রথম ও দ্বিতীয় ভাগ (রবীন্দ্রনাথ ঠাকুর)",
      "Targeting Mathematics (Foundational FLN Series)",
      "Green Circle: Exploring Environmental Science",
      "Junior Touch: Computer Fundamentals for Primary"
    ]
  },
  "senior-primary": {
    slug: "senior-primary",
    title: "Senior Primary (Class III & Class IV)",
    gradeRange: "Class III – Class IV",
    ageRequirement: "8 to 10 Years as of 1st January of admission year",
    schoolHours: "8:00 AM – 1:30 PM (Monday to Friday)",
    classTeacher: "Mr. B. Pal & Mrs. A. Sen",
    studentCapacity: 60,
    overview: "Senior Primary prepares young students to become independent thinkers, fluent communicators, and disciplined learners. With specialized subject periods, weekly science experiments, debate clubs, and mental math Olympiad challenges, graduates transition seamlessly into leading secondary schools.",
    learningOutcomes: [
      "Independent essay writing, reading comprehension, and confident spoken English presentations",
      "Confidence with long division, fractions, geometry basics, and data handling",
      "Scientific method comprehension: observing, hypothesizing, and drawing conclusions",
      "Respect for cultural heritage, Indian history, geography, and civic responsibility",
      "Team collaboration in group projects, sports relay events, and annual exhibitions"
    ],
    curriculumBreakdown: [
      { subject: "Advanced English Language", description: "Grammar, syntax, essay writing, comprehension passages, and recitation.", weeklyHours: "6 Hours" },
      { subject: "Bengali / Hindi First Language", description: "Classical stories, poetry appreciation, grammatical rules, and spellings.", weeklyHours: "5 Hours" },
      { subject: "Mathematics & Analytical Logic", description: "4-digit operations, fractions, perimeter, time measurement, and unitary method.", weeklyHours: "6 Hours" },
      { subject: "General Science & Experiments", description: "Living organisms, matter, light, sound, simple machines, and laboratory models.", weeklyHours: "4 Hours" },
      { subject: "Social Studies & Civics", description: "Map reading, Indian heritage, Birbhum district history, and community helpers.", weeklyHours: "3 Hours" },
      { subject: "Information Technology", description: "Typing efficiency, basic MS Paint/Word concepts, and digital ethics.", weeklyHours: "2 Hours" },
      { subject: "Physical Training & Yoga", description: "Sprint races, yoga asanas, football fundamentals, and teamwork drills.", weeklyHours: "3 Hours" }
    ],
    dailyRoutine: [
      { time: "8:00 AM", activity: "Assembly, student news reading & physical drill" },
      { time: "8:25 AM", activity: "Period 1: Mathematics & Mental Arithmetic" },
      { time: "9:10 AM", activity: "Period 2: English Literature & Creative Writing" },
      { time: "9:55 AM", activity: "Period 3: General Science / Demonstration Lab" },
      { time: "10:40 AM", activity: "Recess: Wholesome tiffin & sports grounds" },
      { time: "11:10 AM", activity: "Period 4: Bengali / Hindi Language & Grammar" },
      { time: "11:55 AM", activity: "Period 5: Social Studies & Heritage" },
      { time: "12:40 PM", activity: "Period 6: Computer Lab / Art & Craft Studio" },
      { time: "1:25 PM", activity: "Diary endorsement & orderly dismissal" }
    ],
    booklistHighlights: [
      "Oxford Reading Circle & Everyday Grammar",
      "সাহিত্য সঞ্চয়ন ও বাংলা ব্যাকরণ মঞ্জুষা",
      "Mathematics in Action (Class III/IV Standard)",
      "Young Scientists: Interactive Science Discovery",
      "My Land & My People: Primary Social Studies",
      "Byte by Byte: Computer Applications"
    ]
  }
};

export const FACULTY_MEMBERS: FacultyMember[] = [
  {
    id: "fac-1",
    name: "Sri Debabrata Roy",
    role: "Headmaster & Academic Director",
    department: "Leadership",
    qualification: "M.A., B.Ed., Diploma in Early Childhood Education",
    experienceYears: 18,
    bio: "With nearly two decades of educational leadership, Sri Roy has guided Sainthia Shishutirtha since its inception in 2013, championing child-centric schooling without emotional stress.",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    specialization: "Educational Administration & Child Psychology"
  },
  {
    id: "fac-2",
    name: "Smt. Shampa Ganguly",
    role: "Senior Primary Coordinator & Class Teacher (Class II)",
    department: "Primary",
    qualification: "B.A. (Hons. English), B.Ed.",
    experienceYears: 12,
    bio: "Passionate English mentor known for transforming reluctant readers into eager storytellers through interactive phonics games and expressive dramatization.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    specialization: "Phonics, English Literature & Creative Penmanship"
  },
  {
    id: "fac-3",
    name: "Sri Tarun Roy",
    role: "Mathematics & Mental Arithmetic Faculty",
    department: "Primary",
    qualification: "B.Sc. (Mathematics), D.El.Ed.",
    experienceYears: 10,
    bio: "Specializes in demystifying mathematics for young minds through tactile abacus counters, number grids, and joyful mental math puzzles.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    specialization: "Conceptual Math & FLN Numeracy"
  },
  {
    id: "fac-4",
    name: "Smt. Mita Mukherjee",
    role: "First Language (Bengali) Lead Mentor",
    department: "Primary",
    qualification: "M.A. (Bengali), B.Ed.",
    experienceYears: 14,
    bio: "Brings Bengal's rich literary heritage to life in the classroom, instilling correct pronunciation, spelling accuracy, and deep appreciation for Sahaj Path.",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=600&q=80",
    specialization: "Bengali Literature & Recitation"
  },
  {
    id: "fac-5",
    name: "Smt. Anindita Ghosh",
    role: "Kindergarten & Pre-Primary Coordinator",
    department: "Pre-Primary",
    qualification: "B.A., Montessori Certified Educator",
    experienceYears: 9,
    bio: "Expert in early childhood sensory exploration, circle time activities, fine motor development, and gentle behavioral reinforcement.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    specialization: "Early Childhood Montessori & Sensory Learning"
  },
  {
    id: "fac-6",
    name: "Smt. Rina Pal",
    role: "Nursery & Kindergarten Mentor",
    department: "Pre-Primary",
    qualification: "B.Sc., Nursery Teacher Training (NTT)",
    experienceYears: 7,
    bio: "Beloved for her patient, motherly approach that makes first-time schoolgoers feel completely secure, joyful, and excited to return every morning.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    specialization: "Toddler Transition & Language Readiness"
  },
  {
    id: "fac-7",
    name: "Sri Bimal Pal",
    role: "Fine Arts, Crafts & Cultural Instructor",
    department: "Activity & Physical",
    qualification: "B.F.A. (Visual Arts), Diploma in Indian Folk Art",
    experienceYears: 11,
    bio: "Nurtures creative imagination through watercolors, clay models, festival decorations, and cultural stage decor for school celebrations.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    specialization: "Visual Arts, Clay Sculpting & Stage Design"
  },
  {
    id: "fac-8",
    name: "Smt. Aparna Sen",
    role: "Science & Nature Exploration Mentor",
    department: "Primary",
    qualification: "B.Sc. (Botany), B.Ed.",
    experienceYears: 8,
    bio: "Conducts hands-on nature discovery sessions, garden walks, and simple classroom science demonstrations that stimulate curiosity.",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80",
    specialization: "Environmental Studies (EVS) & Primary Science"
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
    fullContent: "The Admission Committee of Sainthia Shishutirtha hereby announces the commencement of registration for the Academic Session 2025–2026 across Kindergarten (KG), Class I, Class II, Class III, and Class IV. Parents seeking admission for their wards are advised to complete the online enquiry or collect the physical prospectus from the school office between 8:30 AM and 1:30 PM on all working days. Documents required include child's birth certificate copy, 3 passport photographs, previous school report card (if applicable), and parent identity proof. Please note that batch sizes are capped strictly at 30 students per section.",
    issuedBy: "Office of the Headmaster & Admissions Council",
    downloadUrl: "#"
  },
  {
    id: "n-2",
    title: "Annual Sports & Athletic Fun Meet 2026",
    date: "28 Nov 2026",
    category: "Event",
    isImportant: true,
    description: "Our annual sports meet will be held at the school sports ground. Parents are warmly invited to cheer their little champions in fun races and drills.",
    fullContent: "We are delighted to invite all parents, guardians, and well-wishers to our Annual Sports & Athletic Fun Meet 2026, scheduled to take place on Saturday, 28th November 2026 at the Sainthia Shishutirtha campus sports ground. Events will feature fun races (frog jump, lemon & spoon, hurdle crawl), sprint races for Class III & IV, a drill performance by Kindergarteners, and an exhibition tug-of-war for parents! Reporting time for students in their sports uniform is 8:00 AM.",
    issuedBy: "Department of Physical Education",
    downloadUrl: "#"
  },
  {
    id: "n-3",
    title: "Winter Term Uniform Guidelines & Timetable Notice",
    date: "04 Nov 2026",
    category: "Academic",
    isImportant: false,
    description: "Parents are requested to ensure students wear the prescribed school winter cardigan and clean badge. School morning bell rings promptly at 8:00 AM.",
    fullContent: "With the onset of cooler weather, all parents are requested to ensure students wear the official dark green V-neck woolen cardigan embroidered with the school emblem. Full-length trousers are permitted for boys and girls of all classes during the winter months. White socks and clean black shoes are mandatory. The school morning bell rings at 8:00 AM sharp; parents are requested to ensure punctual arrival.",
    issuedBy: "Administrative Office",
    downloadUrl: "#"
  },
  {
    id: "n-4",
    title: "Children's Day Art & Science Discovery Exhibition",
    date: "14 Nov 2026",
    category: "Event",
    isImportant: false,
    description: "Exhibition displaying handcrafted science models, nature crafts, and paintings prepared by our young innovators from Class I through IV.",
    fullContent: "In celebration of Children's Day, our school will organize an interactive Science & Art Discovery Exhibition. Students from Class I through IV will present working models on water conservation, plant life cycles, solar energy, and indigenous clay crafts. Visiting hours for parents are 10:00 AM to 1:30 PM. Light refreshments will be provided.",
    issuedBy: "Exhibition Committee",
    downloadUrl: "#"
  },
  {
    id: "n-5",
    title: "Parent-Teacher Evaluation & Feedback Meet",
    date: "08 Dec 2026",
    category: "Academic",
    isImportant: false,
    description: "One-on-one progress review for Second Term assessments. Detailed schedule slot will be provided in student communication diaries.",
    fullContent: "The Second Term Parent-Teacher Evaluation and Progress Dialogue will be held on Tuesday, 8th December 2026. This one-on-one meeting allows class teachers and subject educators to review your child's reading fluency, numeracy confidence, peer collaboration, and diary remarks with parents. Specific time-slots will be communicated in student diaries.",
    issuedBy: "Academic Coordination Team",
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

export const ADMISSION_DETAILS = {
  academicSession: "2025–2026",
  ageCriteria: [
    { grade: "Pre-Primary / Nursery", age: "3+ Years", cutoff: "Born between 02/01/2021 and 01/01/2022" },
    { grade: "Kindergarten (KG)", age: "4+ Years", cutoff: "Born between 02/01/2020 and 01/01/2021" },
    { grade: "Class I", age: "6+ Years", cutoff: "Born between 02/01/2018 and 01/01/2019" },
    { grade: "Class II", age: "7+ Years", cutoff: "Class I Passed / Equivalent" },
    { grade: "Class III", age: "8+ Years", cutoff: "Class II Passed / Equivalent" },
    { grade: "Class IV", age: "9+ Years", cutoff: "Class III Passed / Equivalent" }
  ],
  requiredDocuments: [
    "Original & Attested Copy of Child's Birth Certificate (issued by Municipal / Gram Panchayat authority)",
    "Three recent colored passport-size photographs of the student in formal attire",
    "One recent passport-size photograph each of Father, Mother, or Guardian",
    "Proof of Residence in Birbhum (Aadhaar Card, Voter ID, or Electricity Bill copy)",
    "Previous Class Progress Report / Transfer Certificate (for Class I through IV)",
    "Student's Blood Group Certificate / Immunization record copy"
  ],
  feeOverview: [
    { head: "Registration & Prospectus Form", amount: "₹300", frequency: "One-Time (At Enquiry)" },
    { head: "Admission & Enrolment Fee", amount: "₹3,500", frequency: "One-Time (At Admission)" },
    { head: "Annual Development & Activity Charge", amount: "₹2,200", frequency: "Annual (April)" },
    { head: "Monthly Tuition Fee (KG)", amount: "₹750", frequency: "Monthly" },
    { head: "Monthly Tuition Fee (Classes I - IV)", amount: "₹850", frequency: "Monthly" }
  ]
};

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
