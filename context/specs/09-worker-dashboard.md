# Unit 09: Worker Dashboard

## Goal
A logged-in worker sees four live activity metrics and their five most recent job applications immediately after login, rendered in the 12-column dashboard layout with a profile-completion sidebar card.

---

## Design

### Layout
- Authenticated layout: fixed sidebar `w-64` on `md+`, hidden on mobile. Main content area has `ml-64` on `md+`.
- Page background: `bg-background` (`#F7F9FB`).
- Page inner padding: `p-stack-lg` (32px) on desktop, `p-stack-md` (16px) on mobile.
- Page header block:
  - Title: `'Overview'` — `font-headline-lg text-headline-lg` on desktop, `font-headline-lg-mobile text-headline-lg-mobile` on mobile (`text-on-surface`).
  - Subtitle: `'Welcome back, here is your job search activity.'` — `font-body-sm text-body-sm text-on-surface-variant mt-1`.
  - Header `mb-stack-lg`.
- 12-column grid below header: `grid grid-cols-12 gap-gutter`.
  - Left column: `col-span-12 lg:col-span-8`, `flex flex-col gap-stack-lg`.
  - Right column: `col-span-12 lg:col-span-4`, `flex flex-col gap-stack-lg`.

### Metric Cards (Left column — top section)
- Grid: `grid grid-cols-2 md:grid-cols-4 gap-stack-md`.
- Four cards using the metric card pattern:

| Card | Label | Icon | Icon color | Icon bg |
|---|---|---|---|---|
| Applications Sent | `'Applications Sent'` | `send` | `text-primary-container` | `bg-tertiary-fixed` |
| Shortlisted | `'Shortlisted'` | `bookmark` | `text-[#EA580C]` | `bg-[#FFF7ED]` |
| Rejected | `'Rejected'` | `cancel` | `text-error` | `bg-error-container` |
| Active Opportunities | `'Active Opportunities'` | `trending_up` | `text-[#059669]` | `bg-[#D1FAE5]` |

- Metric card HTML pattern (exact):
  ```html
  <div class="bg-surface-container-lowest p-stack-md rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0] flex flex-col gap-2">
    <div class="flex justify-between items-start">
      <span class="font-label-md text-label-md text-on-surface-variant">Label</span>
      <span class="material-symbols-outlined text-{color} text-xl p-1 bg-{bg} rounded-md">icon</span>
    </div>
    <span class="font-headline-lg text-headline-lg text-on-surface font-bold">42</span>
  </div>
  ```
- While loading: render 4 skeleton placeholder divs (`animate-pulse bg-surface-container rounded-xl h-24`).

### Recent Applications Table (Left column — below metrics)
- Card container: `bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0]`.
- Card header: `p-stack-md border-b border-[#F1F5F9]`, title `'Recent Applications'` — `font-headline-sm text-headline-sm text-on-surface`.
- Table wrapper: `overflow-x-auto` (required for mobile).
- Table: `w-full text-left border-collapse`.
- `<thead>`: `bg-surface-container-low border-b border-[#F1F5F9]`.
- `<th>` cells: `p-4 font-label-md text-label-md text-on-surface-variant font-medium`.
- Columns: **Job Title** (includes employer name as `font-body-sm text-on-surface-variant` below), **Location**, **Status**, **Action**.
- `<tbody>`: `font-body-sm text-body-sm text-on-surface`.
- `<tr>`: `border-b border-[#F1F5F9] hover:bg-surface-bright transition-colors`.
- `<td>`: `p-4`.
- Status badge: `inline-flex items-center px-2 py-1 rounded font-label-sm text-label-sm`:
  - PENDING → `bg-[#EFF6FF] text-[#2563EB]`, label `'Applied'`.
  - SHORTLISTED → `bg-[#FFF7ED] text-[#EA580C]`.
  - REJECTED → `bg-error-container text-error`.
- Action column: `<button>` with `visibility` Material Symbols icon (`text-on-surface-variant hover:text-primary-container`). Clicking navigates to `/jobs/:jobId`.
- Empty state (no applications): centered `<tr>` spanning all columns — `search_off` icon 48px `text-on-surface-variant`, heading `'No recent applications'` (`font-headline-sm text-headline-sm text-on-surface mt-4`), body `'Start browsing jobs to apply!'` (`font-body-sm text-body-sm text-on-surface-variant mt-2`), `<Link to="/jobs">Browse Jobs</Link>` styled as primary button below.
- While loading: render 5 skeleton rows.

### Right Sidebar Column
**Profile Completion Card:**
- Card: standard card pattern, `p-stack-md`.
- Title: `'Profile Completion'` — `font-headline-sm text-headline-sm text-on-surface mb-stack-md`.
- Progress bar container: `w-full bg-surface-container rounded-full h-2`. Inner fill: `bg-primary-container rounded-full h-2` with `width` set to computed `completionPercent%`.
- Completion percentage text below bar: `font-label-sm text-label-sm text-on-surface-variant mt-1`.
- Completion logic: count filled fields among: `trade`, `city`, `state`, `experience`, `bio`, `skills`, `phone`, `pincode` (8 fields). `completionPercent = Math.round((filledCount / 8) * 100)`.
- If `completionPercent < 100`: show `'Complete Profile'` primary button below bar linking to `/worker/profile`.

**Browse Jobs CTA Card** (shown only when `applicationsSent === 0`):
- Card: standard card pattern, `p-stack-md`, `flex flex-col gap-stack-sm`.
- Title: `'Ready to apply?'` — `font-headline-sm text-headline-sm text-on-surface`.
- Body: `'Browse available jobs and apply today.'` — `font-body-sm text-body-sm text-on-surface-variant`.
- CTA: `<Link to="/jobs">Browse Jobs</Link>` — primary button styling.

### Responsiveness
- `< 768px` (mobile): sidebar hidden. Bottom navigation bar rendered (see Unit 13). Metric grid is `grid-cols-2`. Table wrapped in `overflow-x-auto`. Page padding `px-margin-mobile`.
- `≥ 768px` (desktop): sidebar visible `w-64 fixed`. Metric grid is `grid-cols-4`. Left/right columns stack vertically until `lg` breakpoint.

### Sidebar Active State
- `'Dashboard'` nav item rendered with active class: `flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container rounded-lg translate-x-1 transition-transform`.
- All other nav items use inactive class: `flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all`.

---

## Implementation

### Database
No schema changes in this unit.

### Backend API

**Option A — Two separate endpoints (preferred):**

#### `GET /api/worker/stats`
- Middleware: `[authGuard, roleGuard('WORKER')]`
- Service: `getWorkerStats(userId)`
  1. Find `WorkerProfile` where `userId === req.user.userId`. If not found → 404 `'Worker profile not found'`.
  2. Count `Application` records where `workerProfileId === profile.id` grouped by status:
     - `applicationsSent`: total count (all statuses).
     - `shortlisted`: count where `status === 'SHORTLISTED'`.
     - `rejected`: count where `status === 'REJECTED'`.
  3. Count `activeJobs`: total `Job` records where `status === 'OPEN'` (platform-wide).
  4. Return `{ success: true, data: { applicationsSent, shortlisted, rejected, activeJobs } }`.

#### `GET /api/worker/applications/recent`
- Middleware: `[authGuard, roleGuard('WORKER')]`
- Service: `getRecentWorkerApplications(userId)`
  1. Find `WorkerProfile` where `userId === req.user.userId`.
  2. Query `Application` where `workerProfileId === profile.id`, order by `createdAt DESC`, take 5.
  3. Include: `job { id, title, trade, city, employer { fullName } }`, `status`, `createdAt`.
  4. Do NOT include `job.employer.phone` or any worker phone fields.
  5. Return `{ success: true, data: [ ...applications ] }`.

**Option B (acceptable alternative):** Combine both into `GET /api/worker/dashboard` returning `{ stats: {...}, recentApplications: [...] }`.

**Route file:** `server/src/routes/workerRoutes.js`
**Controller file:** `server/src/controllers/workerController.js`
**Service file:** `server/src/services/workerService.js`

### Frontend Pages

#### `/worker/dashboard` — `client/src/pages/worker/WorkerDashboard.jsx`
- Default redirect destination after successful WORKER login (handled by auth routing guard).
- On mount: call `GET /api/worker/stats` and `GET /api/worker/applications/recent` in parallel via `Promise.all`.
- Loading state: `isLoading = true` until both resolve.
- Error state: if either request fails, show the `ApiErrorDisplay` component (Unit 13) with a "Try Again" handler.
- Render layout as described in Design section above.

### Components

#### `MetricCard` — `client/src/components/MetricCard.jsx`
Props:
```js
{
  label: string,        // e.g. 'Applications Sent'
  value: number | string,
  icon: string,         // Material Symbols icon name
  iconColor: string,    // Tailwind class e.g. 'text-primary-container'
  iconBg: string,       // Tailwind class e.g. 'bg-tertiary-fixed'
  isLoading?: boolean,  // renders skeleton if true
}
```
- Renders the exact metric card HTML pattern from Design section.
- When `isLoading` is true, render `animate-pulse bg-surface-container rounded-xl h-24` placeholder div instead.

#### `ProfileCompletionCard` — `client/src/components/worker/ProfileCompletionCard.jsx`
Props:
```js
{
  profile: WorkerProfile | null,
}
```
- Computes `completionPercent` from profile fields as described.
- Renders progress bar and conditional CTA.

#### `RecentApplicationsTable` — `client/src/components/worker/RecentApplicationsTable.jsx`
Props:
```js
{
  applications: Application[],
  isLoading: boolean,
}
```
- Renders table with skeleton rows when `isLoading`.
- Renders empty state when `applications.length === 0` and `!isLoading`.

### State Management
- Both API calls made in `WorkerDashboard.jsx` with `useState` + `useEffect`.
- `stats` state: `{ applicationsSent: 0, shortlisted: 0, rejected: 0, activeJobs: 0 }`.
- `recentApplications` state: `[]`.
- `isLoading` state: `true` on mount, `false` after both calls resolve (or fail).
- `error` state: `null` or error message string.
- No global state changes needed. Auth context (`useAuth`) provides `user.userId` for API calls.
- Axios instance (from `client/src/api/axiosInstance.js`) automatically attaches `Authorization: Bearer <token>` header.

### Security
- `authGuard` verifies JWT and attaches `req.user = { userId, role }` before any route handler runs.
- `roleGuard('WORKER')` returns 403 if `req.user.role !== 'WORKER'`.
- Worker can only see their own stats and applications — queries are always scoped to their `WorkerProfile` found via `userId`.
- No phone numbers included in any response from these endpoints.
- Passwords never returned.

---

## Dependencies
* None

---

## Verify when done
- [ ] `GET /api/worker/stats` returns `{ applicationsSent, shortlisted, rejected, activeJobs }` for a logged-in worker.
- [ ] `GET /api/worker/applications/recent` returns at most 5 applications in descending `createdAt` order.
- [ ] Recent applications include `job.title`, `job.city`, `job.employer.fullName`, and `status`. No `phone` field present anywhere in the response.
- [ ] `GET /api/worker/stats` returns 403 if called with an EMPLOYER JWT.
- [ ] `GET /api/worker/stats` returns 401 if called with no token.
- [ ] Worker dashboard (`/worker/dashboard`) renders 4 metric cards with correct values from the API.
- [ ] Metric card icons match the color spec: `send` blue, `bookmark` orange, `cancel` red, `trending_up` green.
- [ ] Recent Applications table shows up to 5 rows, each with job title, employer name below, city, status badge, and view icon.
- [ ] Status badges use correct colors: PENDING→blue, SHORTLISTED→orange, REJECTED→red.
- [ ] Clicking the view icon (`visibility`) navigates to `/jobs/:jobId`.
- [ ] Empty state is shown when there are no applications: `search_off` icon, 'No recent applications' heading, Browse Jobs link.
- [ ] `'Browse Jobs'` CTA card in sidebar appears when `applicationsSent === 0`.
- [ ] Profile Completion card shows correct percentage based on filled profile fields.
- [ ] `'Complete Profile'` button is visible when completion is below 100%.
- [ ] Loading skeletons render while API calls are in flight.
- [ ] `'Dashboard'` sidebar nav item is highlighted with active state.
- [ ] Redirected to `/worker/dashboard` automatically after WORKER login.
- [ ] No console errors
- [ ] Responsive at desktop (1280px) and mobile (375px) widths
- [ ] npm run build passes (client)
