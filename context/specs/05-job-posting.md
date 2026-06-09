# Unit 05: Job Posting

## Goal
An authenticated Employer can post a new job through a form and immediately see it appear in their My Jobs list. They can delete any of their own jobs from that list via a confirmation modal.

## Design

### Layout
- Both pages use the authenticated employer layout: fixed sidebar (`w-64`, `bg-surface-container-lowest border-r border-outline-variant`) on `md+`, hidden on mobile; main content area with `ml-64` offset on `md+`.
- Page content is wrapped in `px-margin-mobile md:px-margin-desktop` with `max-w-container-max mx-auto`.

### Post a Job Page (`/employer/jobs/new`)
- Sidebar nav item "Post a Job" is active state: `bg-primary-container text-on-primary-container rounded-lg translate-x-1`.
- Single-column form in a card: `bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0] p-stack-md`.
- Page title above the card: `font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface` — "Post a Job".
- Form sections (visual groupings, no `<fieldset>` required):
  1. **Job Details**: "Job Title" text input; "Description" `<textarea>` with `rows={6}`.
  2. **Trade & Type**: "Trade" `<select>` with all seven `Trade` enum values as options; "Job Type" rendered as two radio buttons — `GIG` and `CONTRACT`.
  3. **Location**: "Pincode" text input; "City" text input; "State" text input.
  4. **Pay**: "Pay Amount (₹)" number input (min=1); "Pay Type" rendered as two radio buttons — `DAILY` and `MONTHLY`.
  5. **Dates**: "Start Date" `<input type="date">`; "End Date" `<input type="date">` labeled "(Optional)".
- All inputs use: `border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container`.
- Section labels above each input: `font-label-md text-label-md text-on-surface-variant`.
- Submit button "Post Job": `bg-primary-container text-on-primary rounded-saas px-6 py-2.5 hover:bg-surface-tint font-label-md text-label-md`. During loading: button is `disabled` and shows an inline spinner (e.g. `animate-spin` border circle, 16px).
- No cancel button — navigation away is via the sidebar.

### My Jobs Page (`/employer/jobs`)
- Sidebar nav item "My Jobs" is active state.
- Page header row (`flex justify-between items-center`): page title "My Jobs" (headline scale) on the left; "Post a Job" primary button on the right that links to `/employer/jobs/new`.
- Job list: vertical stack of cards, `gap-gutter` between each. Each card: `bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0] p-stack-md`.
  - Row 1: job title (`font-headline-sm text-headline-sm text-on-surface`), trade badge, type badge, status badge — all inline-flex with `gap-stack-sm`.
  - Row 2: city (`font-body-sm text-body-sm text-on-surface-variant` with `location_on` Material Symbol icon), pay string (`₹ {payAmount} / day` or `/ month`), start date.
  - Row 3: "Posted {date}" caption (`font-label-sm text-label-sm text-on-surface-variant`) on the left; action buttons on the right: "View Applicants" ghost link-button navigating to `/employer/jobs/:id`; "Delete" danger ghost button (`text-error border border-error rounded-saas px-4 py-2`).
- **Badges**: All badges use `inline-flex items-center px-2 py-1 rounded font-label-sm text-label-sm`:
  - Trade and type: `bg-surface-container text-on-surface-variant`.
  - Status OPEN: `bg-[#EFF6FF] text-[#2563EB]`.
  - Status FILLED: `bg-surface-container text-on-surface-variant`.
  - Status CLOSED: `bg-surface-container text-on-surface-variant`.
- **Delete flow**: Delete button opens `ConfirmModal`. On confirm → call `DELETE /api/jobs/:id` → remove card from list. On cancel → close modal, no change.
- **Empty state**: When jobs array is empty: centered illustration area with text "No jobs posted yet" (`font-body-md text-body-md text-on-surface-variant`) and a "Post a Job" primary button.
- **Loading state**: While fetching, render 3 skeleton cards — `bg-surface-container animate-pulse rounded-xl h-32 border border-[#E2E8F0]`.

### Responsiveness
- Mobile (375px): sidebar hidden; job cards stack single-column; form stacks to single column; card action buttons stack vertically if needed.
- Desktop (1280px): sidebar fixed; content uses full width within `max-w-container-max`.

### Components
- `StatusBadge` — renders a correctly styled badge for any `JobStatus`, `AppStatus`, or trade/type string.
- `ConfirmModal` — general-purpose confirmation dialog.

---

## Implementation

### Database
No schema changes in this unit. Uses the `Job` model defined in Unit 01:
```
Job {
  id          String     @id @default(uuid())
  employerId  String     // FK → EmployerProfile.id
  title       String
  description String
  trade       Trade
  type        JobType
  pincode     String
  city        String
  state       String
  payAmount   Int
  payType     PayType
  startDate   DateTime
  endDate     DateTime?
  status      JobStatus  @default(OPEN)
  createdAt   DateTime   @default(now())
}
```

### Backend API

All routes live in `server/src/routes/jobs.js`. Controllers in `server/src/controllers/jobController.js`. All Prisma queries in `server/src/services/jobService.js`.

#### `POST /api/jobs`
- Middleware: `authGuard` → `roleGuard('EMPLOYER')` → `validate(createJobSchema)` → `createJobController`.
- Controller: calls `jobService.createJob(req.user.userId, req.body)`.
- Service:
  1. Look up `EmployerProfile` where `userId === req.user.userId`. If not found → throw 400 `"Employer profile not found. Please complete your profile first."`.
  2. Create `Job` with `employerId: profile.id`, all validated body fields, `status: 'OPEN'`.
  3. Return the created job.
- Response: `201 { success: true, data: job }`.
- Zod schema (`createJobSchema`):
  ```js
  {
    title:       z.string().min(1).max(200),
    description: z.string().min(1).max(5000),
    trade:       z.enum(['ELECTRICIAN','PLUMBER','DRIVER','WELDER','MECHANIC','CONSTRUCTION','OTHER']),
    type:        z.enum(['GIG','CONTRACT']),
    pincode:     z.string().min(1).max(10),
    city:        z.string().min(1).max(100),
    state:       z.string().min(1).max(100),
    payAmount:   z.number().int().positive(),
    payType:     z.enum(['DAILY','MONTHLY']),
    startDate:   z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    endDate:     z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  }
  ```

#### `GET /api/employer/jobs`
- Middleware: `authGuard` → `roleGuard('EMPLOYER')` → `getEmployerJobsController`.
- No request body. No Zod schema needed.
- Service:
  1. Look up `EmployerProfile` where `userId === req.user.userId`.
  2. Find all `Job` records where `employerId === profile.id`, ordered by `createdAt desc`.
  3. Return the array.
- Response: `200 { success: true, data: jobs[] }`.

#### `GET /api/jobs/:id`
- Middleware: `authGuard` → `getJobByIdController`.
- No role restriction (both WORKER and EMPLOYER).
- Service:
  1. Find `Job` by `id`, include `employer: { select: { fullName: true, city: true, pincode: true } }` (join EmployerProfile).
  2. If not found → throw 404 `"Job not found"`.
  3. Return job with employer fields.
- Response: `200 { success: true, data: job }`.

#### `PUT /api/jobs/:id`
- Middleware: `authGuard` → `roleGuard('EMPLOYER')` → `validate(updateJobSchema)` → `updateJobController`.
- `updateJobSchema`: same shape as `createJobSchema` but all fields optional (`.partial()`).
- Service:
  1. Find job by `id`. If not found → 404.
  2. Look up employer's `EmployerProfile`. If `job.employerId !== profile.id` → throw 403 `"You do not own this job"`.
  3. Update only the fields present in the body.
  4. Return updated job.
- Response: `200 { success: true, data: updatedJob }`.

#### `DELETE /api/jobs/:id`
- Middleware: `authGuard` → `roleGuard('EMPLOYER')` → `deleteJobController`.
- No request body.
- Service:
  1. Find job by `id`. If not found → 404.
  2. Look up employer's `EmployerProfile`. If `job.employerId !== profile.id` → throw 403.
  3. Delete the job. Prisma cascade deletes associated `Application` records (ensure `onDelete: Cascade` on the `Application → Job` relation in `schema.prisma`).
  4. Return `null`.
- Response: `200 { success: true, data: null }`.

### Frontend Pages

#### `client/src/pages/employer/PostJobPage.jsx`
- On mount: nothing fetched.
- Local state: `formData` object (all fields), `loading` boolean, `error` string or null.
- On submit:
  1. Client-side check: all required fields non-empty (title, description, trade, type, pincode, city, state, payAmount > 0, payType, startDate). If any missing, set `error` string and abort.
  2. Set `loading = true`, call `api/jobs.js → createJob(formData)`.
  3. On success: `navigate('/employer/jobs')`.
  4. On failure: set `error` to `response.data.error` or generic message. Set `loading = false`.
- Renders the form described in Design section.
- Error message rendered in `text-error font-body-sm text-body-sm` above the submit button.

#### `client/src/pages/employer/MyJobsPage.jsx`
- On mount: call `api/jobs.js → getEmployerJobs()`. Store in `jobs` state array.
- `deletingId` state: id of job being deleted (to show loading on that card's delete button), or null.
- Delete flow:
  1. User clicks Delete → set `confirmDeleteId` state to job id → renders `ConfirmModal`.
  2. User confirms → call `deleteJob(id)` → filter job out of `jobs` array → clear `confirmDeleteId`.
  3. User cancels → clear `confirmDeleteId`.
- Renders empty state, loading skeletons, or job cards as described.

#### `client/src/api/jobs.js`
Exports:
```js
createJob(data)         // POST /api/jobs
getEmployerJobs()       // GET  /api/employer/jobs
getJobById(id)          // GET  /api/jobs/:id
updateJob(id, data)     // PUT  /api/jobs/:id
deleteJob(id)           // DELETE /api/jobs/:id
```
All functions use the shared Axios instance from `src/api/axios.js` which attaches the JWT `Authorization: Bearer <token>` header automatically.

### Components

#### `client/src/components/StatusBadge.jsx`
Props: `status` (string).
- Maps status string to badge classes:
  - `'OPEN'` | `'PENDING'` | `'Applied'` | `'New'`: `bg-[#EFF6FF] text-[#2563EB]`
  - `'SHORTLISTED'` | `'Interviewing'` | `'Urgent'`: `bg-[#FFF7ED] text-[#EA580C]`
  - `'REJECTED'`: `bg-error-container text-error`
  - `'FILLED'` | `'CLOSED'`: `bg-surface-container text-on-surface-variant`
  - Default/unknown: `bg-surface-container text-on-surface-variant`
- Base classes always applied: `inline-flex items-center px-2 py-1 rounded font-label-sm text-label-sm`.
- Displays the `status` string in title-case (e.g. `"OPEN"` → `"Open"`).
- No props other than `status` in this unit.

#### `client/src/components/ConfirmModal.jsx`
Props: `title` (string), `message` (string), `onConfirm` (function), `onCancel` (function), `confirmLabel` (string, default `"Confirm"`), `loading` (boolean, default `false`).
- Renders: overlay `fixed inset-0 bg-black/50 flex items-center justify-center z-50`.
- Card: `bg-surface-container-lowest rounded-xl p-6 w-full max-w-lg mx-4`.
- Title: `font-headline-sm text-headline-sm text-on-surface`.
- Message: `font-body-md text-body-md text-on-surface-variant mt-2`.
- Buttons row (`flex justify-end gap-stack-sm mt-6`):
  - Cancel: ghost button — `border border-outline-variant text-on-surface rounded-saas px-6 py-2.5 hover:bg-surface-container-low font-label-md text-label-md`.
  - Confirm: danger button — `bg-error text-on-error rounded-saas px-6 py-2.5 font-label-md text-label-md`. Disabled + spinner when `loading=true`.
- Clicking the overlay calls `onCancel`.
- Pressing `Escape` calls `onCancel` (add `keydown` listener on mount, remove on unmount).

### State Management
- `PostJobPage`: fully local state (`formData`, `loading`, `error`). No context used beyond `AuthContext` (via `useAuth()` hook for the JWT, attached by Axios interceptor automatically).
- `MyJobsPage`: local state (`jobs`, `loading`, `error`, `confirmDeleteId`). Mutations update local state optimistically after successful API call (remove deleted card from array).
- No additional React Context is introduced in this unit.

### Security
- `POST /api/jobs`: requires `EMPLOYER` role. `employerId` is derived from `req.user.userId` server-side — the client never sends an `employerId` field; if present in body, it is ignored.
- `PUT /api/jobs/:id` and `DELETE /api/jobs/:id`: ownership enforced in service via `job.employerId === profile.id`. Mismatch returns `403` — not `404`.
- `GET /api/employer/jobs`: scoped to the authenticated employer only; cannot access another employer's jobs.
- `GET /api/jobs/:id`: both roles can read; no sensitive data (phone, password) is returned.
- Zod validation runs before the controller for all mutating routes; unvalidated input never reaches the service.

---

## Dependencies
* None — all required packages (`zod`, `prisma`, `express`, `react-router-dom`, `axios`) were installed in Units 01–04.

---

## Verify when done
- [ ] `POST /api/jobs` with valid body returns `201 { success: true, data: { id, title, status: "OPEN", ... } }`.
- [ ] `POST /api/jobs` with missing required field returns `400 { success: false, error: "..." }`.
- [ ] `POST /api/jobs` with `payAmount: 0` returns `400` (Zod positive integer check).
- [ ] `POST /api/jobs` without JWT returns `401`.
- [ ] `POST /api/jobs` with WORKER JWT returns `403`.
- [ ] `POST /api/jobs` with EMPLOYER JWT but no EmployerProfile returns `400` with profile-not-found message.
- [ ] `GET /api/employer/jobs` returns only jobs belonging to the authenticated employer, ordered newest-first.
- [ ] `GET /api/jobs/:id` returns job with `employer.fullName` and `employer.city`.
- [ ] `GET /api/jobs/:id` for a non-existent id returns `404`.
- [ ] `DELETE /api/jobs/:id` by the owning employer returns `200 { success: true, data: null }`.
- [ ] `DELETE /api/jobs/:id` by a different employer returns `403`.
- [ ] Deleted job no longer appears in `GET /api/employer/jobs` response.
- [ ] Associated applications are cascade-deleted when a job is deleted (confirm in DB).
- [ ] Post a Job page at `/employer/jobs/new`: sidebar "Post a Job" item has active styles.
- [ ] Submitting the form with all fields valid navigates to `/employer/jobs` and the new job appears.
- [ ] Submitting without required fields shows a client-side error message; no API call is made.
- [ ] Submit button is disabled and shows spinner during the API call.
- [ ] My Jobs page: each job card shows title, trade badge, type badge, status badge (OPEN = blue), city, pay string (₹ X / day or / month), start date.
- [ ] My Jobs page: clicking Delete opens ConfirmModal with correct title and message.
- [ ] Confirming delete removes the job card from the list without a page reload.
- [ ] Cancelling the ConfirmModal leaves the job card intact.
- [ ] `ConfirmModal` closes on `Escape` key press.
- [ ] `ConfirmModal` closes on overlay click.
- [ ] My Jobs page empty state renders "No jobs posted yet" with a Post a Job CTA when no jobs exist.
- [ ] My Jobs page loading state shows 3 skeleton cards.
- [ ] `StatusBadge` with `status="OPEN"` renders blue badge; `status="FILLED"` renders muted badge; `status="REJECTED"` renders red badge.
- [ ] No console errors.
- [ ] Responsive at desktop (1280px) and mobile (375px) widths.
- [ ] `npm run build` passes (client).
