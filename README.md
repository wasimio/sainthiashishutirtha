# Sainthia Shishutirtha — Website & Management Portal Prototype (Phase 1)

This repository contains the **Phase 1 Visual Prototype** for **Sainthia Shishutirtha**, an early childhood and primary educational institution located in Sainthia, Birbhum, West Bengal (U-DISE: 19082200103, Govt. Regd: S/2L/14754 OF 2013-14).

The prototype is designed for demonstration to the school's leadership and management council before full backend implementation.

---

## 🎨 Brand Identity & Design System

- **Official School Logo:** Preserved and integrated directly from the official school seal (`/public/logo.png`), featuring the green tree of wisdom, open book, and red circular border.
- **Brand Colors:**
  - **Primary:** `#308599` (Deep educational teal)
  - **Secondary:** `#A5D1DC` (Soft ice blue / sky tint)
  - **Pale Background:** `#EAF5F7` (Gentle pale slate/cyan wash)
  - **Dark Text:** `#243B43` (Rich charcoal slate)
  - **White:** `#FFFFFF`
  - **Accents:** `#15803d` (School green) & `#D92525` (Crest crimson)

---

## 🏫 Public Website Features (All 12 Sections)

1. **Responsive Header & Navigation:**
   - Top banner with contact numbers, official U-DISE registration, and admission notice ticker.
   - Quick Prototype Switcher bar for switching between public site and admin/parent portals.
   - School name, emblem, and fully responsive navigation with accessible mobile drawer.
2. **Hero Section:**
   - Bold headline, mission overview, U-DISE & Govt registration trust badges.
   - Dual Call-to-Actions (*Apply for Admission 2025–26* and *Explore Classes*).
   - High-fidelity imagery, 18:1 ratio stat, and floating session badge.
3. **Welcome Message from the School:**
   - Warm welcome message from the Headmaster's Desk outlining child-centric ethos and gentle guidance.
4. **About the School:**
   - 2013 founding history in Sainthia, Birbhum.
   - Interactive tabbed presentation for **Mission**, **Vision**, and **Educational Philosophy**.
5. **Classes & Academic Programmes:**
   - Age brackets and curriculum highlights for:
     - **Pre-Primary & Kindergarten (KG)** (Ages 3–5)
     - **Junior Primary (Class I & II)** (Ages 6–7)
     - **Senior Primary (Class III & IV)** (Ages 8–10)
   - Interactive program switcher and continuous formative assessment overview.
6. **Teaching Approach & Campus Facilities:**
   - Interactive cards for child-centric classrooms, safe green playground, junior library & story nook, arts & cultural studio, and digital lab.
   - Zero-compromise safety guarantee: 24x7 CCTV, single-gate access, female attendants, and RO water.
7. **Why Choose Sainthia Shishutirtha:**
   - 6 key pillars (Nurturing faculty, 18:1 ratio, bilingual competence, moral grounding, zero-stress, parent partnership).
   - Real parent testimonials with verified ratings.
8. **Interactive Photo Gallery:**
   - Filterable by *All*, *Classroom*, *Sports*, *Culture*, and *Arts*.
   - Click-to-enlarge Lightbox modal for high-resolution photo previews.
9. **Announcements & Circulars:**
   - Filterable notice board for notices, holiday updates, sports day, and exhibitions with modal preview.
10. **Admission Enquiry Call-to-Action:**
    - Visual 4-step admission journey (Enquiry → Campus Walkthrough → Friendly Interaction → Welcome Kit).
11. **Contact Details & Location:**
    - Address in Sainthia, Birbhum, contact telephone numbers, email, and visiting hours.
    - Interactive Google Maps placeholder with directions callout.
    - Interactive contact/enquiry form with validation and confirmation response.
12. **Professional Footer:**
    - Full accreditation details, quick links, timings, and prototype disclaimer.

---

## 📱 Additional Prototype Screens

- **Admin Dashboard** (`/admin`):
  - Overview of student enrollment (342 students), staff counts, attendance trends, and admissions pipeline.
  - Class-wise capacity visual bars (KG to Class IV).
  - Quick action center (issue circulars, ID cards, export reports).
- **Admission Applications Table** (`/admin/admissions`):
  - Filterable by Grade (KG to Class IV) and Status (Under Review, Interview Scheduled, Approved, Enrolled).
  - Search by student or parent name.
  - Interactive Application Review Drawer with workflow status updates.
- **Parent Dashboard** (`/parent`):
  - Student identity card for fictional student **Aarav Sen (Class II-B, Roll No. 14)**.
  - Today's 5-period routine/timetable.
  - Teacher diary remarks, tuition fee status, and attendance score.
- **Homework & Tasks** (`/parent/homework`):
  - Subject-wise assignments with instructions, due dates, and interactive "Mark as Completed" toggles.
  - Mock downloadable worksheets and digital teacher note submission.
- **Attendance Record** (`/parent/attendance`):
  - Monthly attendance calendar with color-coded status badges.
  - Interactive leave application request form.

---

## 🚀 Local Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.18.0 or later, v20+ / v22 recommended)
- `npm` (v9 or later)

### Steps to Run Locally

1. **Clone or open the directory:**
   ```bash
   cd sainthiashishutirtha
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

5. **To test production build:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🔒 Prototype Data Notice

All personal names, contact numbers, student profiles, and administrative records displayed in this prototype are **fictional sample data** crafted solely for visual and functional demonstration. No live children's personal data is collected or exposed.
