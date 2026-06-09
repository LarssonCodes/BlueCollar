# BlueCollar — Build Plan

This document defines the complete build order for the BlueCollar job portal.
Each unit has exactly one visible result, stays within defined system boundaries,
and introduces dependencies only when needed.

---

## Rules Applied

- Each unit produces **one visible, testable result**
- Each unit stays within **one session's worth of work**
- Features with no standalone result are **merged** with the adjacent unit that needs them
- Features always built together in the same session are **merged into one unit**
- Dependencies are stated explicitly — nothing is built before it is needed

---

## Unit List

---

### Unit 01 — Project Scaffold + Database Schema

**Builds:**
- Initializes `client/` with Vite + React + Tailwind CSS
- Initializes `server/` with Node.js + Express
- Installs all project dependencies on both sides
- Configures Tailwind with the full design token config from `ui-context.md`
- Defines the complete Prisma schema: `User`, `WorkerProfile`, `EmployerProfile`, `Job`, `Application`
- Runs `prisma migrate dev` to create all tables
- Adds a `GET /api/health` endpoint that returns `{ status: "ok" }`
- Sets up `.env` and `.env.example` with `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`, `VITE_API_URL`
- Configures Axios base instance in `client/src/api/axios.js`

**Visible result:** Both dev servers run without errors. The frontend loads a blank shell at `localhost:5173`. The backend returns `{ status: "ok" }` at `localhost:5000/api/health`. All five database tables exist in PostgreSQL.

**Dependencies:** None

---

### Unit 02 — Authentication + App Shell + Landing Page

**Builds:**

*Backend:*
- `POST /api/auth/register` — creates User with hashed password, returns JWT
- `POST /api/auth/login` — verifies credentials, returns JWT
- `GET /api/auth/me` — returns current user from token
- `authGuard` middleware — verifies JWT, attaches `req.user`
- `roleGuard(role)` middleware — checks `req.user.role` matches required role
- Zod validators for register and login request bodies

*Frontend:*
- `AuthContext` — stores user object, token, login(), logout() functions
- Landing page (`/`) — hero section, feature cards, CTA buttons (Find Jobs / Post a Job)
- Register page (`/register`) — role selector (Worker / Employer), email, password
- Login page (`/login`) — email, password, error state
- Protected route guard component — redirects unauthenticated users to `/login`
- Role-based route guard — redirects wrong-role users to their dashboard
- Top navigation bar — logo, nav links, Login / Sign Up buttons (public); user avatar + logout (authenticated)

**Visible result:** A user can visit the landing page, register as a Worker or Employer, log in, and be redirected to a role-appropriate placeholder dashboard page. Logging out returns them to the landing page.

**Dependencies:** Unit 01

---

### Unit 03 — Worker Profile — API + UI

**Builds:**

*Backend:*
- `POST /api/worker/profile` — creates WorkerProfile linked to authenticated user
- `GET /api/worker/profile` — returns own profile
- `PUT /api/worker/profile` — updates own profile
- Zod validator for profile body
- Ownership check: only the profile owner can read/write

*Frontend:*
- Worker profile page (`/worker/profile`) — form with fields: full name, phone, trade (dropdown), pincode, city, state, years of experience, bio, skills (tag input), availability toggle
- Shows saved values on load; submits updates inline
- Basic sidebar nav shell for worker layout (Dashboard, Browse Jobs, My Applications, Profile, Logout)

**Visible result:** A logged-in Worker can fill in and save their full profile. The form repopulates with saved data on reload.

**Dependencies:** Unit 02

---

### Unit 04 — Employer Profile — API + UI

**Builds:**

*Backend:*
- `POST /api/employer/profile` — creates EmployerProfile linked to authenticated user
- `GET /api/employer/profile` — returns own profile
- `PUT /api/employer/profile` — updates own profile
- Zod validator for profile body
- Ownership check enforced

*Frontend:*
- Employer profile page (`/employer/profile`) — form with fields: full name, company name (optional), phone, pincode, city
- Basic sidebar nav shell for employer layout (Dashboard, My Jobs, Post a Job, Profile, Logout)

**Visible result:** A logged-in Employer can fill in and save their profile. The form repopulates with saved data on reload.

**Dependencies:** Unit 02

---

### Unit 05 — Job Posting — API + UI

**Builds:**

*Backend:*
- `POST /api/jobs` — creates a Job owned by authenticated employer
- `GET /api/employer/jobs` — lists all jobs posted by the authenticated employer
- `GET /api/jobs/:id` — returns a single job (public, used by both roles)
- `PUT /api/jobs/:id` — updates own job (employer only, ownership enforced)
- `DELETE /api/jobs/:id` — deletes own job (employer only, ownership enforced)
- Zod validator for job body

*Frontend:*
- Post a Job page (`/employer/jobs/new`) — form with: title, description, trade (dropdown), type (GIG / CONTRACT), pincode, city, pay amount, pay type (DAILY / MONTHLY), start date, end date (optional)
- My Jobs page (`/employer/jobs`) — list of employer's own jobs with title, trade, type, status badge (OPEN / FILLED / CLOSED), date posted, edit and delete actions

**Visible result:** An Employer can post a new job and see it immediately appear in their My Jobs list. They can delete it from the same list.

**Dependencies:** Unit 04

---

### Unit 06 — Job Search + Filtering + Job Detail — API + UI

**Builds:**

*Backend:*
- `GET /api/jobs` — lists open jobs with optional query filters: `?trade=PLUMBER&pincode=400001`
- Pagination: accepts `?page=1&limit=10`, returns `{ data, total, page, totalPages }`

*Frontend:*
- Browse Jobs page (`/worker/jobs`) — filter bar (trade dropdown, pincode text input, job type toggle), paginated job card list; each card shows title, trade, type, pay, city, posted date, status badge
- Job detail page (`/worker/jobs/:id`) — full job description, employer info (name, city), pay, dates, trade, type, Apply button
- Empty state: "No jobs match your filters" with clear-filters action

**Visible result:** A logged-in Worker can browse all open jobs, filter by trade and pincode, page through results, and view full job details.

**Dependencies:** Unit 05

---

### Unit 07 — Job Applications + Application Tracking — API + UI

**Builds:**

*Backend:*
- `POST /api/jobs/:id/apply` — Worker submits application with optional cover note; returns 409 if already applied
- `GET /api/worker/applications` — lists all of the authenticated worker's applications with job title, employer, status, applied date

*Frontend:*
- Apply button on Job detail page → opens cover note modal (textarea, max 500 chars) → submits → button changes to "Applied" (disabled)
- My Applications page (`/worker/applications`) — table of all applications: job title, employer name, trade, status badge (PENDING / SHORTLISTED / REJECTED), applied date, link to job detail
- Empty state: "You haven't applied to any jobs yet" with Browse Jobs CTA

**Visible result:** A Worker can apply to a job from the detail page. The My Applications page shows all submitted applications and their current statuses.

**Dependencies:** Unit 06, Unit 03

---

### Unit 08 — Applicant Management + Shortlisting + Contact Reveal + Mark as Filled — API + UI

**Builds:**

*Backend:*
- `GET /api/jobs/:id/applications` — returns list of applicants for a job (employer only, ownership enforced); `phone` field excluded from all responses
- `PUT /api/applications/:id/shortlist` — sets application status to SHORTLISTED; contact reveal gate: `phone` is now included in the response for the job owner only
- `PUT /api/applications/:id/reject` — sets application status to REJECTED
- `PUT /api/jobs/:id/fill` — sets job status to FILLED; requires at least one SHORTLISTED applicant

*Frontend:*
- Employer job detail page (`/employer/jobs/:id`) — shows applicant list: worker name, trade, experience, cover note, status badge; Shortlist and Reject action buttons
- After shortlisting: worker's phone number appears inline under their name with a phone icon
- Mark as Filled button — appears when at least one applicant is shortlisted; sets job status to FILLED; button disabled with "Filled" label after action
- Confirmation prompt before marking as filled

**Visible result:** An Employer can view all applicants for a job, shortlist one to reveal their phone number, reject others, and mark the job as filled.

**Dependencies:** Unit 07, Unit 05

---

### Unit 09 — Worker Dashboard

**Builds:**

*Backend:*
- `GET /api/worker/stats` — returns `{ applicationsSent, shortlisted, rejected, activeJobs }` counts for the authenticated worker

*Frontend:*
- Worker dashboard (`/worker/dashboard`) — four metric cards (Applications Sent, Shortlisted, Rejected, Active Opportunities), recent applications table (last 5), Browse Jobs CTA if no applications exist
- Becomes the default page after worker login

**Visible result:** A Worker sees real activity metrics on their dashboard immediately after logging in.

**Dependencies:** Unit 07

---

### Unit 10 — Employer Dashboard

**Builds:**

*Backend:*
- `GET /api/employer/stats` — returns `{ jobsPosted, openJobs, filledJobs, totalApplicants }` counts for the authenticated employer

*Frontend:*
- Employer dashboard (`/employer/dashboard`) — four metric cards (Jobs Posted, Open, Filled, Total Applicants), recent jobs table (last 5 with status), Post a Job CTA if no jobs exist
- Becomes the default page after employer login

**Visible result:** An Employer sees real activity metrics on their dashboard immediately after logging in.

**Dependencies:** Unit 08

---

### Unit 11 — Admin Panel — API + UI

**Builds:**

*Backend:*
- `GET /api/admin/stats` — returns `{ totalUsers, totalWorkers, totalEmployers, totalJobs, totalApplications }`
- `GET /api/admin/users` — paginated list of all users (id, email, role, createdAt)
- `DELETE /api/admin/users/:id` — deletes a user and cascades to their profile, jobs, and applications
- `GET /api/admin/jobs` — paginated list of all jobs (id, title, trade, status, employer name, createdAt)
- `DELETE /api/admin/jobs/:id` — deletes a job and cascades to its applications
- All routes guarded with `authGuard` + `roleGuard(ADMIN)`

*Frontend:*
- Admin layout with sidebar (Stats, Users, Jobs)
- Admin stats page (`/admin`) — five metric cards
- Admin users page (`/admin/users`) — paginated table: email, role, join date, delete button with confirmation prompt
- Admin jobs page (`/admin/jobs`) — paginated table: title, employer, trade, status, post date, delete button with confirmation prompt

**Visible result:** An Admin user can log in and view platform-wide stats, browse all users and jobs, and delete any record.

**Dependencies:** Unit 02

---

### Unit 12 — Account Settings

**Builds:**

*Backend:*
- `PUT /api/auth/password` — verifies current password, updates to new bcrypt hash; requires `{ currentPassword, newPassword }` with Zod validation

*Frontend:*
- Account settings page (`/settings`) — change password form: current password, new password, confirm new password; inline success/error feedback
- Linked from the sidebar "Settings" nav item (added to all three layouts)

**Visible result:** Any authenticated user (Worker, Employer, or Admin) can change their password from the settings page.

**Dependencies:** Unit 02

---

### Unit 13 — Error States + Empty States + Responsive Design

**Builds:**

*Frontend (no new backend endpoints):*
- Global 404 page — shown for any unmatched route; links back to dashboard
- Global API error boundary — catches network failures and shows a readable message with retry option
- Empty states on every list view:
  - Browse Jobs: "No jobs match your filters" + clear filters button
  - My Applications: "No applications yet" + Browse Jobs CTA
  - My Jobs (employer): "No jobs posted yet" + Post a Job CTA
  - Applicants list: "No applications received yet"
  - Admin users/jobs tables: "No records found"
- Responsive design audit pass on all pages at 375px (mobile) and 1280px (desktop):
  - Sidebar collapses to bottom nav or hamburger on mobile
  - All tables scroll horizontally on small screens
  - All forms stack to single column on mobile
  - All tap targets meet minimum 44px height

**Visible result:** Every page in the app handles empty data and errors gracefully. Every page is fully usable at 375px width without horizontal overflow.

**Dependencies:** Units 01–12 (all prior units must be complete)

---

### Unit 14 — Deployment

**Builds:**
- Frontend deployed to Vercel: `VITE_API_URL` set to the live backend URL
- Backend deployed to Render or Railway: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV=production`, `PORT` set as environment variables
- PostgreSQL database hosted on Supabase or Railway: connection string provided to backend
- `prisma migrate deploy` run against the production database
- CORS configured on the backend to allow requests from the Vercel domain only
- End-to-end smoke test: register → post job → apply → shortlist → contact revealed → mark filled → admin view

**Visible result:** Three live, publicly accessible URLs: Vercel frontend, Render/Railway backend API, and a connected production database. The complete user flow works end-to-end in production.

**Dependencies:** Unit 13

---

## Summary Table

| Unit | Name | Visible Result | Depends On |
|---|---|---|---|
| 01 | Project Scaffold + Database Schema | Dev servers running, all DB tables created | — |
| 02 | Authentication + App Shell + Landing Page | Register, login, role-based redirect | 01 |
| 03 | Worker Profile — API + UI | Worker can create and save their profile | 02 |
| 04 | Employer Profile — API + UI | Employer can create and save their profile | 02 |
| 05 | Job Posting — API + UI | Employer can post and manage their jobs | 04 |
| 06 | Job Search + Filtering + Job Detail | Worker can search, filter, and view jobs | 05 |
| 07 | Job Applications + Application Tracking | Worker can apply and track application status | 06, 03 |
| 08 | Applicant Management + Shortlisting + Contact Reveal + Mark as Filled | Employer manages applicants, contact revealed after shortlist | 07, 05 |
| 09 | Worker Dashboard | Worker sees real activity metrics | 07 |
| 10 | Employer Dashboard | Employer sees real activity metrics | 08 |
| 11 | Admin Panel — API + UI | Admin manages users and jobs, sees platform stats | 02 |
| 12 | Account Settings | Any user can change their password | 02 |
| 13 | Error States + Empty States + Responsive Design | All pages handle edge cases; mobile layout at 375px | 01–12 |
| 14 | Deployment | Live URLs for frontend, backend, and database | 13 |
