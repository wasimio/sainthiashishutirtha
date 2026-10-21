# Sainthia Shishutirtha — Full-Stack Educational Platform & Management System

This repository contains the official website and school management platform for **Sainthia Shishutirtha**, an early childhood and primary educational institution located in Sainthia, Birbhum, West Bengal (U-DISE: 19082200103, Govt. Regd: S/2L/14754 OF 2013-14).

---

## 🎨 Brand Identity & Design System

- **Official School Seal:** Preserved and loaded directly from the official crest (`/public/logo.png`).
- **Brand Colors:**
  - **Primary:** `#308599` (Deep educational teal)
  - **Secondary:** `#A5D1DC` (Soft ice blue / sky tint)
  - **Pale Background:** `#EAF5F7` (Gentle pale slate/cyan wash)
  - **Dark Text:** `#243B43` (Rich charcoal slate)
  - **Pure White:** `#FFFFFF`
  - **Accents:** `#15803d` (School green) & `#D92525` (Seal crimson)

---

## 🌐 Public Website Route Directory (Phase 1 Implemented)

| Route | Page Title | Key Contents |
|---|---|---|
| [`/`](http://localhost:3000/) | **Home** | Comprehensive landing page with hero, welcome message, academic divisions, facilities, why choose us, photo gallery, notices, and contact. |
| [`/about`](http://localhost:3000/about) | **About School** | Institutional history since 2013, accreditation credentials, Mission, Vision, Educational Philosophy, and Core Guiding Values. |
| [`/academics`](http://localhost:3000/academics) | **Academics Overview** | Early childhood & primary curriculum overview, Foundational Literacy & Numeracy (FLN) philosophy, stress-free continuous assessment. |
| [`/academics/[classId]`](http://localhost:3000/academics/pre-primary-kg) | **Class Details** | Dynamic class pages (`/academics/pre-primary-kg`, `/academics/junior-primary`, `/academics/senior-primary`) with curriculum breakdown, daily routines, and booklists. |
| [`/faculty`](http://localhost:3000/faculty) | **Faculty & Mentors** | Leadership and faculty directory, teacher qualifications, experience years, specializations, and child psychology training. |
| [`/facilities`](http://localhost:3000/facilities) | **Campus Facilities** | Detailed infrastructure showcase: smart classrooms, safe playground, junior library, arts studio, IT lab, 24x7 CCTV, RO water, and sick bay. |
| [`/gallery`](http://localhost:3000/gallery) | **Photo Gallery** | Filterable gallery (*All*, *Classroom*, *Sports*, *Culture*, *Arts*) with an interactive click-to-enlarge Lightbox modal. |
| [`/admissions`](http://localhost:3000/admissions) | **Admissions 2025–26** | 4-step admission journey, class-wise age criteria & cutoffs, required documents checklist, transparent fee overview, and online enquiry. |
| [`/notices`](http://localhost:3000/notices) | **Notices & Circulars** | Filterable notice board with category badges (*Notice*, *Event*, *Academic*), search bar, and circular details. |
| [`/notices/[id]`](http://localhost:3000/notices/n-1) | **Notice Reader** | Dynamic notice detail reader with official issuance metadata and full circular text. |
| [`/contact`](http://localhost:3000/contact) | **Contact & Location** | Campus address in Sainthia, Birbhum, contact telephone numbers, email, visiting hours, interactive map card, and enquiry form. |
| [`/login`](http://localhost:3000/login) | **Unified Portal Login** | Role-tailored login screen with quick-switching demonstration credentials for Management, Principal, Teachers, and Parents. |

---

## 🛡️ School Management Prototype Portals

| Route | Portal Name | Description |
|---|---|---|
| [`/admin`](http://localhost:3000/admin) | **Admin Dashboard** | 342 Enrolled students, 22 staff members, 96.2% daily attendance, class-wise capacity visual bars, administrative quick-action center. |
| [`/admin/admissions`](http://localhost:3000/admin/admissions) | **Admissions Table** | Searchable & filterable applications table by Grade (KG–IV) and Status (*Under Review*, *Interview Scheduled*, *Approved*, *Enrolled*), with application review drawer. |
| [`/parent`](http://localhost:3000/parent) | **Parent Portal Overview** | Profile for fictional student **Aarav Sen (Class II-B, Roll No. 14)**, 5-period daily routine, teacher diary remarks, fee clearance status. |
| [`/parent/homework`](http://localhost:3000/parent/homework) | **Homework & Tasks** | Subject-wise homework cards with teacher instructions, interactive "Mark as Completed" state toggles, and digital diary note submission. |
| [`/parent/attendance`](http://localhost:3000/parent/attendance) | **Attendance Ledger** | Monthly presence calendar (95.2% rate), attendance rules, and interactive student leave request form with simulated confirmation. |

---

## 🚀 Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (`v18.18+`, `v20+` or `v22` recommended)
- `npm` (`v9+`)

### Steps to Run

1. Open a terminal in the project directory:
   ```powershell
   cd d:\sainthiashishutirtha
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Run the development server:
   ```powershell
   npm run dev
   ```
4. Access the application in your browser:
   - **Public Website:** [http://localhost:3000](http://localhost:3000)
   - **Login Portal:** [http://localhost:3000/login](http://localhost:3000/login)
   - **Admin Portal:** [http://localhost:3000/admin](http://localhost:3000/admin)
   - **Parent Portal:** [http://localhost:3000/parent](http://localhost:3000/parent)

---

## 🔒 Prototype Data Notice

All personal names, contact numbers, student profiles, and administrative records displayed in this prototype are **fictional sample data** crafted solely for visual and functional demonstration. No live children's personal data is collected or exposed.
