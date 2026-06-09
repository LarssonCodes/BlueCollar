# Unit 07: Job Applications + Application Tracking — API + UI

## Goal
A logged-in Worker can apply for an open job by providing an optional cover note. They can see and track all of their applications and their real-time statuses (Pending, Shortlisted, Rejected) on a dedicated "My Applications" page.

## Design

### Job Detail Page Apply Flow (`/worker/jobs/:id`)
- Apply Button (Primary button, placed in the Employer Info right column):
  - On page load, if the worker has not applied: Button is active, reading "Apply Now" (`bg-primary-container text-on-primary hover:bg-surface-tint rounded-saas px-6 py-2.5 w-full`). Clicking it opens the `ApplyModal`.
  - If the worker has already applied: Button is disabled, reading "Applied" with a green checkmark icon (`bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0] rounded-saas px-6 py-2.5 w-full cursor-not-allowed`).
  - If the job is closed or filled: Button is disabled, reading "Closed" or "Filled" (`bg-surface-container text-on-surface-variant w-full cursor-not-allowed`).

### Apply Modal (`ApplyModal`)
- Trigger: Clicking "Apply Now" on the job detail page.
- Layout: Backdrop overlay `fixed inset-0 bg-black/50 flex items-center justify-center z-50`. Modal card: `bg-surface-container-lowest rounded-xl p-6 w-full max-w-lg mx-4 shadow-level-2 border border-[#E2E8F0]`.
- Content:
  - Header: Title "Apply for [Job Title]" in `font-headline-sm text-headline-sm text-on-surface mb-2`.
  - Description: "Write a short note to the employer explaining your experience and why you are interested." (`font-body-sm text-on-surface-variant mb-4`).
  - Textarea: Cover note textarea. `border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full h-32 focus:outline-none focus:ring-2 focus:ring-primary-container`.
  - Character Counter: "X / 500" in `font-label-sm text-on-surface-variant mt-1 text-right block`. Textarea limits input to 500 characters.
  - Buttons (Row at bottom, right-aligned, gap 12px):
    - Cancel Button (Ghost style): `border border-outline-variant text-on-surface rounded-saas hover:bg-surface-container-low px-4 py-2 font-label-md`
    - Submit Application Button (Primary style): `bg-primary-container text-on-primary rounded-saas hover:bg-surface-tint px-6 py-2 font-label-md` (disables and shows loading state during API request).

### My Applications Page (`/worker/applications`)
- Active Sidebar navigation: "My Applications"
- Header: Page title "My Applications" in `font-headline-lg text-headline-lg text-on-surface mb-6`.
- Applications Container: Card container `bg-surface-container-lowest rounded-xl border border-[#E2E8F0] overflow-hidden shadow-level-1`.
- Applications Table:
  - Style: `w-full text-left border-collapse`.
  - Header: `bg-surface-container-low border-b border-[#F1F5F9]`. Columns:
    - Job Title (`p-4 font-label-md text-label-md text-on-surface-variant`)
    - Employer (`p-4 font-label-md text-label-md text-on-surface-variant`)
    - Trade (`p-4 font-label-md text-label-md text-on-surface-variant`)
    - Applied Date (`p-4 font-label-md text-label-md text-on-surface-variant`)
    - Status (`p-4 font-label-md text-label-md text-on-surface-variant`)
  - Rows (`border-b border-[#F1F5F9] hover:bg-surface-bright transition-colors`):
    - Job Title is a clickable link (`text-primary hover:underline font-body-md`) pointing to `/worker/jobs/:id`.
    - Employer is the employer's full name.
    - Trade is a badge.
    - Applied Date is formatted like "09 Jun 2026".
    - Status renders a status badge:
      - `PENDING`: `bg-[#EFF6FF] text-[#2563EB] font-label-sm text-label-sm px-2.5 py-1 rounded-full font-medium inline-block`
      - `SHORTLISTED`: `bg-[#FFF7ED] text-[#EA580C] font-label-sm text-label-sm px-2.5 py-1 rounded-full font-medium inline-block`
      - `REJECTED`: `bg-error-container text-error font-label-sm text-label-sm px-2.5 py-1 rounded-full font-medium inline-block`
- Empty State: Centered container in the card. `assignment_turned_in` Material icon (48px, `text-on-surface-variant/40`). Heading "No applications yet" (`font-headline-sm`). Description "Start browsing and applying for gigs today." CTA: `Browse Jobs` button (`bg-primary-container text-on-primary rounded-saas mt-4 px-6 py-2.5`).

---

## Implementation

### Database
- No schema changes. Uses `Application` model:
  - `id` (uuid, PK)
  - `jobId` (String, FK to Job)
  - `workerId` (String, FK to WorkerProfile)
  - `coverNote` (String, optional)
  - `status` (AppStatus enum: `PENDING`, `SHORTLISTED`, `REJECTED`)
  - `createdAt` (DateTime)
  - `@@unique([jobId, workerId])` constraint enforced.

---

### Backend API

#### `POST /api/jobs/:id/apply`
- **Auth**: `authGuard` + `roleGuard(Role.WORKER)`
- **Behavior**:
  - Finds the `WorkerProfile` of the current user using `req.user.userId`. If not found, returns 400 Bad Request (`{ success: false, error: "Please create a worker profile first" }`).
  - Finds the `Job` by `id` param. If not found, returns 404 Not Found (`{ success: false, error: "Job not found" }`).
  - Checks if the job status is `OPEN`. If not, returns 400 Bad Request (`{ success: false, error: "This job is no longer accepting applications" }`).
  - Checks if an application already exists for `[jobId, workerId]`. If yes, returns 409 Conflict (`{ success: false, error: "You have already applied for this job" }`).
  - Creates a new `Application` with the optional `coverNote`.
- **Validation (Zod)**:
  - `coverNote`: string, optional, max 500 chars.
- **Response Shape**:
  - Success: HTTP 201 with `{ success: true, data: Application }`

#### `GET /api/worker/applications`
- **Auth**: `authGuard` + `roleGuard(Role.WORKER)`
- **Behavior**:
  - Finds the `WorkerProfile` of the current user. If not found, returns 200 with `{ success: true, data: [] }`.
  - Queries all `Application` records matching `workerId` of the worker profile.
  - Includes `Job` relation. Under `Job`, includes `EmployerProfile` (to get employer's `fullName`) and job `title`, `trade`, `city`.
  - Orders by `createdAt` desc.
- **Response Shape**:
  - Success: HTTP 200 with `{ success: true, data: Application[] }`

---

### Frontend Pages
- Update `client/src/pages/worker/JobDetailPage.jsx` to fetch application list and determine if already applied.
- Create `client/src/pages/worker/MyApplicationsPage.jsx`.
- Set up route `/worker/applications` in `client/src/routes/index.jsx` inside the worker layout, guarded by `ProtectedRoute` + `RoleRoute(WORKER)`.

---

### Components
- Create `client/src/components/ApplyModal.jsx` (props: `jobId`, `jobTitle`, `onSuccess`, `onClose`).

---

### State Management
- JobDetailPage:
  - Fetches the single job.
  - Fetches worker's applications list `GET /api/worker/applications` on load. Matches `jobId` of current page to determine if worker has already applied.
- MyApplicationsPage:
  - Fetches all applications `GET /api/worker/applications` on mount. Stores list in local state.
  - Loading skeleton and error banners managed locally.

---

### Security
- **Double application prevention**: Enforced at the database level with a unique constraint `@@unique([jobId, workerId])` and verified in backend controller to return 409.
- **Profile verification**: Workers must have a fully created profile before applying. This is enforced by verifying `WorkerProfile` exists on the backend during the apply route.
- **Strict Role checks**: Only `Role.WORKER` users can apply to jobs or view worker applications.

---

## Verify when done

### Backend Tests
- [ ] `POST /api/jobs/:id/apply` with valid cover note for an open job returns 201 and creates application in DB.
- [ ] `POST /api/jobs/:id/apply` again for the same job and worker returns 409 Conflict.
- [ ] `POST /api/jobs/:id/apply` by a worker without a profile returns 400 Bad Request.
- [ ] `POST /api/jobs/:id/apply` to a job that does not exist returns 404.
- [ ] `POST /api/jobs/:id/apply` to a job with status `CLOSED` or `FILLED` returns 400.
- [ ] `GET /api/worker/applications` returns a list of applications for the logged-in worker, including employer name and job details, ordered by date descending.
- [ ] `GET /api/worker/applications` returns an empty array `[]` if the worker has not applied to any jobs yet.
- [ ] `POST /api/jobs/:id/apply` called by an EMPLOYER or ADMIN user returns 403 Forbidden.

### Frontend UI Tests
- [ ] Navigating to a job detail page shows "Apply Now" button if not yet applied.
- [ ] Clicking "Apply Now" opens the ApplyModal. The modal displays the correct job title.
- [ ] The cover note field enforces a 500 character limit and updates the counter (e.g. `250 / 500`).
- [ ] Submitting the modal with a cover note saves the application, closes the modal, and transforms the detail page's apply button to a disabled "Applied" state with a green checkmark.
- [ ] Navigating to `/worker/applications` displays all submitted applications in a clean table.
- [ ] If no applications exist, the empty state displays with a clickable "Browse Jobs" button that redirects to `/worker/jobs`.
- [ ] Clicking a job title in the table redirects the worker back to the detail page for that job, where the button correctly reads "Applied".
- [ ] In the applications table, statuses (Pending, Shortlisted, Rejected) render in their respective colors.
