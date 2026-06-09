# Unit 06: Job Search + Filtering + Job Detail

## Goal
A logged-in Worker can browse all open jobs, filter results by trade, pincode, and job type, page through results, and view the full detail of any job.

## Design

### Layout
- Both pages use the authenticated worker layout: fixed sidebar (`w-64`, `bg-surface-container-lowest border-r border-outline-variant`) on `md+`, hidden on mobile; main content with `ml-64` offset on `md+`.
- Content wrapped in `px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto`.

### Browse Jobs Page (`/worker/jobs`)
- Sidebar nav item "Browse Jobs" is active: `bg-primary-container text-on-primary-container rounded-lg translate-x-1`.
- Page title "Browse Jobs": `font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface`.
- **Filter bar** (directly below page title, `mt-stack-md`): horizontal row on desktop, stacked on mobile.
  - Trade `<select>`: first option "All Trades" (value `""`), then all seven `Trade` enum values. Uses standard input classes.
  - Pincode text input: placeholder "Pincode", with `search` Material Symbol icon inset on the left side (`relative` wrapper, icon `absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant`).
  - Job Type toggle: three buttons `All | GIG | CONTRACT` — active state `bg-primary-container text-on-primary font-label-md text-label-md`; inactive `border border-outline-variant text-on-surface-variant font-label-md text-label-md`. Container: `flex rounded-saas overflow-hidden border border-outline-variant`.
  - "Search" primary button: `bg-primary-container text-on-primary rounded-saas px-6 py-2.5 hover:bg-surface-tint font-label-md text-label-md`.
- **Filter state persistence**: filter values are stored as URL query params (`?trade=PLUMBER&pincode=400001&type=GIG&page=1`). On mount, read `useSearchParams()` to initialise filter state. Changing filters updates URL params via `setSearchParams` — this means page refresh preserves the active filters.
- **Job cards grid**: `grid grid-cols-1 md:grid-cols-2 gap-gutter mt-stack-lg`.
  - Each card: `bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0] p-stack-md flex flex-col gap-stack-sm hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.08),_0_4px_6px_-2px_rgba(0,0,0,0.03)] transition-shadow`.
  - Title: `font-label-md text-label-md text-on-surface` (bold, 14px — as specified).
  - Row: trade `StatusBadge`, type `StatusBadge`, side by side.
  - Pay row: `font-body-sm text-body-sm text-on-surface` — `₹ {payAmount} / day` or `/ month`, with `payments` Material Symbol icon.
  - City row: `font-body-sm text-body-sm text-on-surface-variant` with `location_on` icon.
  - Start date row: `font-label-sm text-label-sm text-on-surface-variant` — "Starts {formatted date}".
  - "View Details" link-button at the bottom of the card: `bg-primary-container text-on-primary rounded-saas px-4 py-2 font-label-md text-label-md hover:bg-surface-tint self-start` — navigates to `/worker/jobs/:id`.
- **Pagination** (below the grid, `mt-stack-lg`): `flex justify-center items-center gap-stack-md`.
  - "Previous" ghost button: disabled and styled `opacity-50 cursor-not-allowed` on page 1.
  - "Page X of Y" text: `font-body-sm text-body-sm text-on-surface-variant`.
  - "Next" ghost button: disabled on last page.
- **Empty state** (when `total === 0`): centered, `mt-stack-lg`. Text "No jobs match your filters" (`font-body-md text-body-md text-on-surface-variant`). Below it: "Clear Filters" ghost button that resets all URL params to defaults and resets local filter state.
- **Loading state**: while fetching, render 4 skeleton cards — `bg-surface-container animate-pulse rounded-xl h-48 border border-[#E2E8F0]`.

### Job Detail Page (`/worker/jobs/:id`)
- Sidebar nav item "Browse Jobs" remains active (detail is a sub-page of the browse flow).
- **Back button** at the top: `← Back to Jobs` ghost link (`text-on-surface-variant font-label-md text-label-md`) → navigates to `/worker/jobs` (preserving query params if possible via `useNavigate(-1)`).
- Two-column layout on `lg+`: `grid grid-cols-1 lg:grid-cols-12 gap-gutter`.
- **Left column** (`lg:col-span-8`):
  - Job title: `font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface`.
  - Badge row: trade `StatusBadge` + type `StatusBadge`, `flex gap-stack-sm mt-stack-sm`.
  - Description heading "About this job": `font-headline-sm text-headline-sm text-on-surface mt-stack-lg`.
  - Description body: `font-body-md text-body-md text-on-surface mt-stack-sm whitespace-pre-wrap`.
  - Details section (`mt-stack-lg grid grid-cols-2 gap-stack-md`):
    - Pay: `₹ {payAmount} / {day or month}` with `payments` icon.
    - Start date with `event` icon.
    - End date with `event` icon, or "No end date" if `endDate` is null.
    - City + state with `location_on` icon.
  - Each detail item: icon `text-primary-container`, label `font-label-sm text-label-sm text-on-surface-variant`, value `font-body-sm text-body-sm text-on-surface`.
- **Right column** (`lg:col-span-4`):
  - Employer info card: `bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0] p-stack-md`.
    - Heading "About the Employer": `font-headline-sm text-headline-sm text-on-surface`.
    - Employer full name: `font-body-md text-body-md text-on-surface mt-stack-sm`.
    - City: `font-body-sm text-body-sm text-on-surface-variant` with `location_on` icon.
  - Apply button placeholder (full-width, below employer card, `mt-stack-md`): renders as primary button "Apply Now" — **in this unit the button is a disabled placeholder** with `disabled` attribute and `title="Coming soon"` tooltip. It will be wired up in Unit 07.
- **404 state**: if the API returns 404, render a centred message: "Job not found" (`font-headline-sm text-headline-sm text-on-surface`) with a "← Back to Jobs" link below.

### Responsiveness
- Mobile (375px): sidebar hidden; filter bar stacks vertically (each filter full-width); job cards single column; job detail two-column layout collapses to single column (right column stacks below left).
- Desktop (1280px): sidebar fixed; 2-col job cards grid; 12-col detail layout.

### Components
- `JobCard.jsx` — receives a `job` object prop; renders the full job card as described above.
- `Pagination.jsx` — receives `page`, `totalPages`, `onPageChange` props; renders the pagination controls.

---

## Implementation

### Database
No schema changes in this unit. This unit queries the `Job` model and joins `EmployerProfile`.

### Backend API

Routes in `server/src/routes/jobs.js`. Controllers in `server/src/controllers/jobController.js`. Queries in `server/src/services/jobService.js`.

#### `GET /api/jobs` (paginated, filtered list of open jobs)
- Middleware: `authGuard` → `getJobsController` (no `roleGuard` — both WORKER and EMPLOYER may access).
- Query params:
  - `trade` (optional) — must be a valid `Trade` enum value; ignored if not a valid enum member.
  - `pincode` (optional) — string; filter `job.pincode === pincode`.
  - `type` (optional) — must be a valid `JobType` enum value.
  - `page` (optional, default `1`) — positive integer.
  - `limit` (optional, default `10`) — positive integer, max `50`.
- No Zod body schema (query params validated manually in service or controller).
- Service (`jobService.getJobs({ trade, pincode, type, page, limit })`):
  1. Build Prisma `where` clause: always include `status: 'OPEN'`; add `trade`, `pincode`, `type` conditions only when the param is present and valid.
  2. Run `prisma.job.count({ where })` and `prisma.job.findMany({ where, skip: (page-1)*limit, take: limit, orderBy: { createdAt: 'desc' }, include: { employer: { select: { fullName: true, city: true, pincode: true } } } })`.
  3. Return `{ items, total, page, totalPages: Math.ceil(total / limit) }`.
- Response: `200 { success: true, data: { items, total, page, totalPages } }`.

#### `GET /api/jobs/:id`
- Already specified in Unit 05. This unit ensures it also includes `employer.pincode` in the select so the detail page can display it.
- No changes needed if Unit 05 already includes `fullName`, `city`, `pincode` in the employer select.

### Frontend Pages

#### `client/src/pages/worker/BrowseJobsPage.jsx`
- On mount and on filter/page change: read URL params via `useSearchParams()`, call `api/jobs.js → getJobs(params)`, store result in `{ items, total, page, totalPages }` state.
- Filter state is the URL — `setSearchParams` is the only write path. Do not maintain a separate local filter object that diverges from the URL.
- "Search" button and Enter keypress on the pincode input both trigger `setSearchParams` with current filter values and reset `page` to `1`.
- "Clear Filters" button calls `setSearchParams({})`.
- Renders filter bar, job cards grid (via `JobCard`), pagination (via `Pagination`), empty state, and loading skeletons as described.

#### `client/src/pages/worker/JobDetailPage.jsx`
- Reads `:id` from `useParams()`.
- On mount: call `api/jobs.js → getJobById(id)`. Store in `job` state.
- Handles three states: loading (spinner or skeleton), error/not-found (404 message), success (render detail layout).
- Apply button is a disabled placeholder in this unit (`<button disabled title="Coming soon" className="... opacity-50 cursor-not-allowed">`).

#### `client/src/api/jobs.js` — additions
```js
getJobs(params)   // GET /api/jobs?trade=&pincode=&type=&page=&limit=
getJobById(id)    // GET /api/jobs/:id  (already from Unit 05)
```
`getJobs` passes `params` as Axios `params` object (serialised as query string automatically).

### Components

#### `client/src/components/JobCard.jsx`
Props: `job` (object with fields: `id`, `title`, `trade`, `type`, `payAmount`, `payType`, `city`, `startDate`, `employer.fullName`).
- Renders the card layout described in Design section.
- Delegates badge rendering to `StatusBadge`.
- "View Details" is a `<Link to={/worker/jobs/${job.id}}>` styled as a primary button.
- No internal state; purely presentational.

#### `client/src/components/Pagination.jsx`
Props: `page` (number), `totalPages` (number), `onPageChange` (function).
- Renders Previous / "Page X of Y" / Next.
- Previous button: calls `onPageChange(page - 1)`, disabled when `page === 1`.
- Next button: calls `onPageChange(page + 1)`, disabled when `page === totalPages` or `totalPages === 0`.
- Button classes (active): `border border-outline-variant text-on-surface rounded-saas px-4 py-2 hover:bg-surface-container-low font-label-md text-label-md`.
- Button classes (disabled): same + `opacity-50 cursor-not-allowed`.

### State Management
- `BrowseJobsPage`: URL search params are the source of truth for filter state. Local state holds only the API response (`items`, `total`, `page`, `totalPages`) and async states (`loading`, `error`).
- `JobDetailPage`: local state (`job`, `loading`, `error`). No context beyond `AuthContext`.
- No additional React Context introduced.

### Security
- `GET /api/jobs`: requires authentication (`authGuard`). Unauthenticated requests return `401`.
- Filter values from `req.query` are validated against the known enum before being passed to the Prisma query. Unknown enum values are ignored — not passed to Prisma (prevents unexpected filter behaviour).
- `page` and `limit` are clamped: `page = Math.max(1, parseInt(page) || 1)`, `limit = Math.min(50, Math.max(1, parseInt(limit) || 10))`.
- No phone, password, or sensitive worker data is included in any response from this unit.
- The list endpoint filters `status: 'OPEN'` unconditionally — closed or filled jobs are never returned in the browse list.

**Not in scope for this unit:**
- Worker search by employer name.
- Apply flow (Apply button is a disabled placeholder).
- Job editing by employer.
- Any admin-level job listing.

---

## Dependencies
* None — all required packages were installed in Units 01–05.

---

## Verify when done
- [ ] `GET /api/jobs` without auth returns `401`.
- [ ] `GET /api/jobs` returns only `status: "OPEN"` jobs.
- [ ] `GET /api/jobs?trade=PLUMBER` returns only jobs with `trade: "PLUMBER"`.
- [ ] `GET /api/jobs?pincode=400001` returns only jobs matching that pincode.
- [ ] `GET /api/jobs?type=GIG` returns only GIG jobs.
- [ ] `GET /api/jobs` response shape is `{ success: true, data: { items, total, page, totalPages } }`.
- [ ] `GET /api/jobs?page=2&limit=5` returns the correct slice of results (items 6–10).
- [ ] `GET /api/jobs` includes `employer.fullName` and `employer.city` in each item.
- [ ] `GET /api/jobs/:id` returns job with `employer.fullName`, `employer.city`, `employer.pincode`.
- [ ] `GET /api/jobs/:id` for a non-existent id returns `404 { success: false, error: "Job not found" }`.
- [ ] Browse Jobs page at `/worker/jobs`: sidebar "Browse Jobs" item has active styles.
- [ ] Filter bar renders: Trade dropdown, Pincode input, Job Type toggle (All/GIG/CONTRACT), Search button.
- [ ] Selecting a trade and clicking Search updates the URL query param (`?trade=PLUMBER`) and refetches.
- [ ] Refreshing the page with `?trade=PLUMBER` in the URL re-applies the trade filter.
- [ ] Job Type toggle highlights the active selection.
- [ ] Job cards render title (label-md bold), trade badge, type badge, pay string (₹ X / day or / month), city, start date, View Details button.
- [ ] "View Details" navigates to `/worker/jobs/:id`.
- [ ] Pagination "Page 1 of Y" text is shown. Previous disabled on page 1.
- [ ] Clicking Next increments page, URL updates to `?page=2`, and next batch of jobs loads.
- [ ] Empty state "No jobs match your filters" renders when `total === 0`.
- [ ] "Clear Filters" button resets all URL params and re-fetches all open jobs.
- [ ] Loading state renders 4 skeleton cards while fetching.
- [ ] Job Detail page renders: title (headline scale), trade + type badges, description, pay details, start/end date, city/state, employer info card.
- [ ] End date shows "No end date" when `endDate` is null.
- [ ] Apply button is rendered as disabled with "Coming soon" tooltip — no API call fires on click.
- [ ] Job Detail page 404 state shows "Job not found" message with back link.
- [ ] Back button on Job Detail returns to `/worker/jobs`.
- [ ] `JobCard` accepts `job` object prop and renders without internal data fetching.
- [ ] `Pagination` Previous button is disabled (opacity-50, cursor-not-allowed) when on page 1.
- [ ] `Pagination` Next button is disabled when `page === totalPages`.
- [ ] No console errors.
- [ ] Responsive at desktop (1280px) and mobile (375px) widths.
- [ ] `npm run build` passes (client).
