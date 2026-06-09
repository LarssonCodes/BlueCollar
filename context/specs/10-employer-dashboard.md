# Unit 10: Employer Dashboard

## Goal
A logged-in employer sees four live hiring-activity metrics and their five most recent job postings immediately after login, rendered in the 12-column dashboard layout with a quick-actions sidebar card.

---

## Design

### Layout
- Authenticated layout: fixed sidebar `w-64` on `md+`, hidden on mobile. Main content area `ml-64` on `md+`.
- Page background: `bg-background` (`#F7F9FB`).
- Page inner padding: `p-stack-lg` (32px) on desktop, `p-stack-md` (16px) on mobile.
- Page header block:
  - Title: `'Overview'` — `font-headline-lg text-headline-lg` on desktop, `font-headline-lg-mobile text-headline-lg-mobile` on mobile (`text-on-surface`).
  - Subtitle: `'Here is your hiring activity.'` — `font-body-sm text-body-sm text-on-surface-variant mt-1`.
  - Header `mb-stack-lg`.
- 12-column grid below header: `grid grid-cols-12 gap-gutter`.
  - Left column: `col-span-12 lg:col-span-8`, `flex flex-col gap-stack-lg`.
  - Right column: `col-span-12 lg:col-span-4`, `flex flex-col gap-stack-lg`.

### Metric Cards (Left column — top section)
- Grid: `grid grid-cols-2 md:grid-cols-4 gap-stack-md`.
- Four cards using the standard metric card pattern:

| Card | Label | Icon | Icon color | Icon bg |
|---|---|---|---|---|
| Jobs Posted | `'Jobs Posted'` | `work` | `text-primary-container` | `bg-tertiary-fixed` |
| Open | `'Open'` | `trending_up` | `text-[#059669]` | `bg-[#D1FAE5]` |
| Filled | `'Filled'` | `check_circle` | `text-on-surface-variant` | `bg-surface-container` |
| Total Applicants | `'Total Applicants'` | `people` | `text-[#EA580C]` | `bg-[#FFF7ED]` |

- Metric card HTML pattern (exact):
  ```html
  <div class="bg-surface-container-lowest p-stack-md rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0] flex flex-col gap-2">
    <div class="flex justify-between items-start">
      <span class="font-label-md text-label-md text-on-surface-variant">Label</span>
      <span class="material-symbols-outlined text-{color} text-xl p-1 bg-{bg} rounded-md">icon</span>
    </div>
    <span class="font-headline-lg text-headline-lg text-on-surface font-bold">5</span>
  </div>
  ```
- While loading: render 4 skeleton placeholder divs (`animate-pulse bg-surface-container rounded-xl h-24`).

### Recent Jobs Table (Left column — below metrics)
- Card container: `bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0]`.
- Card header: `p-stack-md border-b border-[#F1F5F9]`, title `'Recent Jobs'` — `font-headline-sm text-headline-sm text-on-surface`.
- Table wrapper: `overflow-x-auto` (required for mobile).
- Table: `w-full text-left border-collapse`.
- `<thead>`: `bg-surface-container-low border-b border-[#F1F5F9]`.
- `<th>` cells: `p-4 font-label-md text-label-md text-on-surface-variant font-medium`.
- Columns: **Title**, **Trade**, **Type**, **Status**, **Posted Date**, **Action**.
- `<tbody>`: `font-body-sm text-body-sm text-on-surface`.
- `<tr>`: `border-b border-[#F1F5F9] hover:bg-surface-bright transition-colors`.
- `<td>`: `p-4`.
- Type values: `GIG` or `CONTRACT` — rendered as-is.
- Status badge: `inline-flex items-center px-2 py-1 rounded font-label-sm text-label-sm`:
  - OPEN → `bg-[#EFF6FF] text-[#2563EB]`.
  - FILLED → `bg-surface-container text-on-surface-variant`.
  - CLOSED → `bg-surface-container text-on-surface-variant`.
- Posted Date: formatted as `'DD MMM YYYY'` (e.g. `'05 Jun 2025'`). Use `new Date(createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })`.
- Action column: `'View'` button — `font-label-md text-label-md text-primary-container hover:underline`. Clicking navigates to `/employer/jobs/:id`.
- Empty state (no jobs): centered `<tr>` spanning all columns — `work_off` icon 48px `text-on-surface-variant`, heading `'No jobs posted yet'` (`font-headline-sm text-headline-sm text-on-surface mt-4`), body `'Post your first job to start hiring.'` (`font-body-sm text-body-sm text-on-surface-variant mt-2`), `<Link to="/employer/jobs/new">Post a Job</Link>` as primary button below.
- While loading: render 5 skeleton rows.

### Right Sidebar Column

**Quick Actions Card:**
- Card: standard card pattern, `p-stack-md`, `flex flex-col gap-stack-sm`.
- Title: `'Quick Actions'` — `font-headline-sm text-headline-sm text-on-surface mb-stack-sm`.
- `'Post a New Job'` — primary button: `bg-primary-container text-on-primary rounded-saas px-6 py-2.5 hover:bg-surface-tint w-full`. Links to `/employer/jobs/new`.
- `'View All Jobs'` — ghost button: `bg-transparent border border-outline-variant text-on-surface rounded-saas px-6 py-2.5 hover:bg-surface-container-low w-full mt-2`. Links to `/employer/jobs`.

**Profile Completion Card:**
- Card: standard card pattern, `p-stack-md`.
- Title: `'Profile Completion'` — `font-headline-sm text-headline-sm text-on-surface mb-stack-md`.
- Progress bar container: `w-full bg-surface-container rounded-full h-2`. Inner fill: `bg-primary-container rounded-full h-2` at computed `completionPercent%`.
- Completion logic: count filled fields among: `fullName`, `companyName`, `phone`, `city`, `pincode` (5 fields). `completionPercent = Math.round((filledCount / 5) * 100)`.
- Percentage text below bar: `font-label-sm text-label-sm text-on-surface-variant mt-1`.
- If `completionPercent < 100`: show `'Complete Profile'` primary button linking to `/employer/profile`.

### Responsiveness
- `< 768px`: sidebar hidden. Bottom navigation bar rendered (see Unit 13). Metric grid `grid-cols-2`. Table wrapped in `overflow-x-auto`. Page padding `px-margin-mobile`.
- `≥ 768px`: sidebar visible `w-64 fixed`. Metric grid `grid-cols-4`. Columns stack vertically until `lg` breakpoint.

### Sidebar Active State
- `'Dashboard'` nav item active: `flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container rounded-lg translate-x-1 transition-transform`.
- Other nav items inactive: `flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all`.

---

## Implementation

### Database
No schema changes in this unit.

### Backend API

#### `GET /api/employer/stats`
- Middleware: `[authGuard, roleGuard('EMPLOYER')]`
- Service: `getEmployerStats(userId)`
  1. Find `EmployerProfile` where `userId === req.user.userId`. If not found → 404 `'Employer profile not found'`.
  2. Find all `Job` records where `employerId === profile.id`.
  3. Compute:
     - `jobsPosted`: total count of employer's jobs (all statuses).
     - `openJobs`: count where `status === 'OPEN'`.
     - `filledJobs`: count where `status === 'FILLED'`.
     - `totalApplicants`: count all `Application` records joined through employer's jobs (`Application.jobId IN [employer's job IDs]`).
  4. Return `{ success: true, data: { jobsPosted, openJobs, filledJobs, totalApplicants } }`.

#### `GET /api/employer/jobs/recent`
- Middleware: `[authGuard, roleGuard('EMPLOYER')]`
- Service: `getRecentEmployerJobs(userId)`
  1. Find `EmployerProfile` by `userId`.
  2. Query `Job` where `employerId === profile.id`, order by `createdAt DESC`, take 5.
  3. Select: `id`, `title`, `trade`, `type`, `status`, `city`, `createdAt`.
  4. Do NOT include application details or worker phone in this response.
  5. Return `{ success: true, data: [ ...jobs ] }`.

- **Alternative**: reuse `GET /api/employer/jobs?limit=5` if that endpoint exists from a prior unit and supports a `limit` query parameter.

**Route file:** `server/src/routes/employerRoutes.js`
**Controller file:** `server/src/controllers/employerController.js`
**Service file:** `server/src/services/employerService.js`

### Frontend Pages

#### `/employer/dashboard` — `client/src/pages/employer/EmployerDashboard.jsx`
- Default redirect destination after successful EMPLOYER login.
- On mount: call `GET /api/employer/stats` and `GET /api/employer/jobs/recent` in parallel via `Promise.all`.
- `isLoading = true` until both calls resolve or fail.
- Error state: render `ApiErrorDisplay` component (Unit 13) with retry handler.
- Render layout as described in Design section.

### Components

#### `MetricCard` (reused from Unit 09)
- Import `MetricCard` from `client/src/components/MetricCard.jsx`. No duplication.

#### `ProfileCompletionCard` — `client/src/components/employer/EmployerProfileCompletionCard.jsx`
Props:
```js
{
  profile: EmployerProfile | null,
}
```
- Computes `completionPercent` from employer profile fields as described.
- Renders progress bar and conditional CTA linking to `/employer/profile`.

#### `RecentJobsTable` — `client/src/components/employer/RecentJobsTable.jsx`
Props:
```js
{
  jobs: Job[],
  isLoading: boolean,
}
```
- Renders table with skeleton rows when `isLoading`.
- Renders empty state when `jobs.length === 0 && !isLoading`.

### State Management
- Both API calls in `EmployerDashboard.jsx` using `useState` + `useEffect`.
- `stats` state: `{ jobsPosted: 0, openJobs: 0, filledJobs: 0, totalApplicants: 0 }`.
- `recentJobs` state: `[]`.
- `isLoading` state: `true` on mount, `false` after resolution.
- `error` state: `null` or string.
- Auth context (`useAuth`) provides `user.userId`.
- Axios instance attaches JWT automatically.

### Security
- `authGuard` verifies JWT; `roleGuard('EMPLOYER')` returns 403 if `role !== 'EMPLOYER'`.
- Stats and recent jobs are always scoped to the authenticated employer's own `EmployerProfile` — other employers' data cannot be accessed.
- No worker phone numbers included in any response.
- Passwords never returned.
- Ownership check: `EmployerProfile.userId === req.user.userId` enforced in service layer.

---

## Dependencies
* None

---

## Verify when done
- [ ] `GET /api/employer/stats` returns `{ jobsPosted, openJobs, filledJobs, totalApplicants }` for a logged-in employer.
- [ ] `totalApplicants` reflects the sum of applicants across all of the employer's jobs (not platform-wide).
- [ ] `GET /api/employer/jobs/recent` returns at most 5 jobs in descending `createdAt` order.
- [ ] `GET /api/employer/stats` returns 403 if called with a WORKER JWT.
- [ ] `GET /api/employer/stats` returns 401 if called with no token.
- [ ] Employer dashboard (`/employer/dashboard`) renders 4 metric cards with correct values.
- [ ] Metric card icons match spec: `work` blue, `trending_up` green, `check_circle` gray, `people` orange.
- [ ] Recent Jobs table shows up to 5 rows with Title, Trade, Type, Status badge, Posted Date, View button.
- [ ] Status badges: OPEN→blue, FILLED→gray, CLOSED→gray.
- [ ] Posted Date formatted as `'DD MMM YYYY'`.
- [ ] Clicking `'View'` navigates to `/employer/jobs/:id`.
- [ ] Empty state shows `work_off` icon, 'No jobs posted yet' heading, 'Post a Job' CTA when employer has no jobs.
- [ ] Quick Actions card has `'Post a New Job'` (primary) and `'View All Jobs'` (ghost) buttons.
- [ ] `'Post a New Job'` navigates to `/employer/jobs/new`.
- [ ] `'View All Jobs'` navigates to `/employer/jobs`.
- [ ] Profile Completion card shows correct percentage based on filled employer profile fields.
- [ ] `'Complete Profile'` CTA visible when completion < 100%, links to `/employer/profile`.
- [ ] Loading skeletons render while API calls are in flight.
- [ ] `'Dashboard'` sidebar nav item is highlighted with active state.
- [ ] Redirected to `/employer/dashboard` automatically after EMPLOYER login.
- [ ] No console errors
- [ ] Responsive at desktop (1280px) and mobile (375px) widths
- [ ] npm run build passes (client)
