# BlueCollar Job Portal — Project Overview

## Overview

BlueCollar is a mobile-responsive web application that connects skilled blue-collar workers — electricians, plumbers, drivers, welders, mechanics, and construction workers — with sole-trader employers in India who need to hire for short-term gigs or fixed-term contracts. Workers create profiles that act as their CV, browse and apply for jobs filtered by trade and pincode, and track their applications. Employers post jobs, review applicants, shortlist one candidate (which reveals that worker's contact details), and mark the job as filled. A basic admin panel allows platform operators to manage users and job posts.

---

## Goals

1. Give sole-trader employers in India a fast, mobile-friendly way to post a gig or contract job in under 5 minutes.
2. Give skilled blue-collar workers a structured profile to represent themselves and a simple interface to find and apply for relevant local work.
3. Build a trust layer by revealing worker contact details only after an employer deliberately shortlists an applicant.
4. Launch a working product in 3–5 days with a lean, stable feature set — no unfinished or partially built features.
5. Establish a relational data foundation (PostgreSQL + Prisma) that supports future features like ratings, payments, and document verification without requiring schema rewrites.
6. Keep the platform free at launch to eliminate signup friction and grow the user base on both sides before introducing monetization.

---

## Core User Flow

### Worker Flow

1. Worker visits the landing page and clicks **"Sign up as a Worker"**.
2. Worker registers with full name, email, and password. No email confirmation required.
3. Worker is redirected to complete their profile: trade category, pincode, city, years of experience, bio, and skills.
4. Worker navigates to **Browse Jobs**, enters a pincode and/or selects a trade to filter listings.
5. Worker opens a job detail page and reads the title, description, trade required, pay (₹ per day or per month), job type (gig or contract), start date, and location.
6. Worker clicks **Apply**, optionally writes a cover note (max 500 characters), and submits.
7. Worker visits **My Applications** to see the status of each application: Pending, Shortlisted, or Rejected.
8. If shortlisted, Worker receives no automated notification in v1 — they must check the portal.

### Employer Flow

1. Employer visits the landing page and clicks **"Sign up as an Employer"**.
2. Employer registers with full name, email, and password. No email confirmation required.
3. Employer is redirected to complete their profile: full name, optional company name, phone number, and pincode.
4. Employer clicks **Post a Job** and fills in: job title, description, trade category, job type (gig or contract), pincode, city, pay amount, pay type (daily or monthly), and start date.
5. Employer submits the job. It is immediately listed as **Open** and visible to workers.
6. Employer navigates to **My Jobs** to see all posted jobs and their statuses.
7. Employer opens a job and sees the list of applicants with their name, trade, experience, and cover note.
8. Employer clicks **Shortlist** on one applicant. The worker's phone number is now visible to the employer.
9. Employer contacts the worker directly via phone or WhatsApp (off-platform).
10. After hiring, Employer returns to the portal and clicks **Mark as Filled**. The job status changes to Filled.

### Admin Flow

1. Admin logs in with an account that has the ADMIN role (created manually in the database).
2. Admin views the dashboard: total users, total jobs posted, and total applications submitted.
3. Admin navigates to **Users** to view a table of all registered accounts (name, email, role, join date) and can delete any account.
4. Admin navigates to **Jobs** to view all job posts (title, employer, trade, status, date posted) and can delete any job post.

---

## Features

### Authentication & Roles
- Email and password registration with role selection (Worker or Employer) at signup
- JWT-based authentication; token stored client-side
- No email confirmation required
- Three roles: Worker, Employer, Admin
- Role-based access control enforced on every protected API route

### Worker Profiles
- Fields: full name, phone number, trade category, pincode, city, state, years of experience, bio, skills (tag list), availability toggle
- Profile serves as the worker's CV — no separate CV builder
- Worker phone number is hidden from all API responses except to the employer who has shortlisted that worker

### Employer Profiles
- Fields: full name, optional company name, phone number, pincode, city

### Job Posting
- Fields: title, description, trade category, job type (gig or contract), pincode, city, state, pay amount (₹), pay type (daily or monthly), start date, optional end date
- Job statuses: Open, Filled, Closed
- Employers can edit or delete their own job posts
- Jobs are publicly visible to all registered workers

### Job Search & Filtering
- Workers can filter jobs by trade category, pincode, and job type (gig or contract)
- Results sorted by most recently posted

### Job Applications
- Workers apply to a job with an optional cover note (max 500 characters)
- A worker cannot apply to the same job twice
- Application statuses: Pending, Shortlisted, Rejected
- Workers can view all their applications and current statuses

### Applicant Management
- Employers see a list of all applicants for each job
- Employer can shortlist one applicant per job — this reveals the worker's phone number to the employer
- Employer can reject applicants
- Employer marks a job as Filled after hiring

### Dashboards
- **Worker dashboard**: count of applications sent, count shortlisted, count rejected, recent job feed
- **Employer dashboard**: count of jobs posted, count open, count filled, total applicants received

### Admin Panel
- Stats overview: total users, total jobs, total applications
- Users table: name, email, role, join date, delete action
- Jobs table: title, employer name, trade, status, post date, delete action

---

## In Scope (v1)

- Mobile-responsive web application (React + Vite + Tailwind CSS)
- Node.js + Express REST API backend
- PostgreSQL database managed via Prisma ORM
- Email + password authentication with JWT and bcrypt
- Three user roles: Worker, Employer, Admin
- Worker profile creation and editing
- Employer profile creation and editing
- Job posting for gigs and contracts
- Job search filtered by trade and pincode
- Job application with optional cover note
- Application status tracking (Pending, Shortlisted, Rejected)
- Employer applicant list with shortlist and reject actions
- Contact reveal: worker phone number shown only after shortlisting
- Mark job as Filled
- Basic admin panel: view users, view jobs, delete users, delete jobs, view stats
- Role-based access control on all API routes
- Input validation with Zod on all request bodies

---

## Out of Scope (v1)

- Native mobile apps (iOS or Android)
- In-app messaging or chat between workers and employers
- Ratings and reviews for workers
- Payment processing (Razorpay or any other provider)
- Social login (Google, Facebook, LinkedIn)
- Push notifications (browser or mobile)
- Email notifications (application received, shortlisted, etc.)
- AI-powered or algorithmic job recommendations
- Multi-language support (Hindi or other regional languages)
- Document upload and credential verification
- Employer-side worker profile search and browsing
- Skill assessments or trade tests
- Referral or invite system
- Analytics dashboard beyond basic counts
- Job bookmarking or saved searches
- Resume or CV builder with PDF export
- Employer posting of permanent/full-time roles

---

## Success Criteria

The v1 build is complete when all of the following are true:

1. **Auth works end-to-end**: A new user can register as a Worker or Employer, log in, and be denied access to routes that don't match their role.
2. **Profile creation works**: A Worker can create and edit their full profile. An Employer can create and edit their full profile.
3. **Job posting works**: An Employer can post a job with all required fields. The job appears in the worker job search immediately after posting.
4. **Job search works**: A Worker can filter jobs by trade category and pincode and see only matching results.
5. **Application flow works end-to-end**: A Worker can apply to a job. The employer sees that application. The employer shortlists the applicant and the worker's phone number becomes visible. The employer can mark the job as Filled.
6. **Contact reveal is gated correctly**: The worker's phone number is not returned in any API response unless the requesting user is the employer who owns that job and has set that application to Shortlisted.
7. **Dashboards show accurate counts**: Worker and Employer dashboards reflect real data from the database.
8. **Admin panel works**: An Admin can view all users and all jobs, and can delete either without breaking referential integrity.
9. **Mobile layout is functional**: All pages are usable on a 375px wide screen (iPhone SE viewport) without horizontal scrolling or broken layouts.
10. **No open bugs in core flows**: The five main flows — register, post job, apply, shortlist, mark filled — complete without errors in a local end-to-end test.
