# Unit 11: Admin Panel — API + UI

## Goal
An admin user can view platform-wide statistics on a dedicated dashboard, browse all users and all jobs in paginated tables, and permanently delete any user or job record with a confirmation step.

---

## Design

### Admin Layout (separate from worker/employer layout)
- Admin has its own sidebar — do NOT reuse the worker or employer `SidebarLayout` component.
- Sidebar: fixed `w-64`, `bg-surface-container-lowest`, `border-r border-[#E2E8F0]`, full viewport height.
- Sidebar top: logo area — `build_circle` icon `text-primary text-3xl` + brand name `'BlueCollar'` (`font-headline-sm text-headline-sm text-on-surface`) + subtitle `'Admin Panel'` (`font-label-sm text-label-sm text-on-surface-variant`).
- Nav items (inactive): `flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all font-label-md text-label-md`.
- Nav items (active): `flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container rounded-lg translate-x-1 transition-transform font-label-md text-label-md`.
- Nav items (in order):
  1. `trending_up` icon + `'Dashboard'` → `/admin`
  2. `people` icon + `'Users'` → `/admin/users`
  3. `work` icon + `'Jobs'` → `/admin/jobs`
- Bottom of sidebar (pushed with `mt-auto`): `logout` icon + `'Logout'` — calls `logout()` from AuthContext and redirects to `/login`.
- Main content area: `ml-64` on `md+`, full width on mobile (sidebar hidden on mobile — see Unit 13 for mobile nav).
- Page background: `bg-background` (`#F7F9FB`).
- Page inner padding: `p-stack-lg` on desktop, `p-stack-md` on mobile.

### Admin Stats Page (`/admin`)
- Page header: `'Dashboard'` — `font-headline-lg text-headline-lg text-on-surface`, subtitle `'Platform overview'` — `font-body-sm text-body-sm text-on-surface-variant mt-1`, `mb-stack-lg`.
- 5 metric cards in a flex/grid row:
  - Desktop: `grid grid-cols-3 gap-stack-md` for first row (3 cards), `grid grid-cols-2 gap-stack-md mt-stack-md` for second row (2 cards). Alternatively, `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-stack-md`.
  - Mobile: `grid-cols-1`.

| Card | Label | Icon | Icon color | Icon bg |
|---|---|---|---|---|
| Total Users | `'Total Users'` | `group` | `text-primary-container` | `bg-tertiary-fixed` |
| Workers | `'Workers'` | `construction` | `text-[#059669]` | `bg-[#D1FAE5]` |
| Employers | `'Employers'` | `business` | `text-[#EA580C]` | `bg-[#FFF7ED]` |
| Jobs | `'Total Jobs'` | `work` | `text-on-surface-variant` | `bg-surface-container` |
| Applications | `'Applications'` | `assignment_turned_in` | `text-primary-container` | `bg-tertiary-fixed` |

- Uses same `MetricCard` component as Units 09/10.
- While loading: 5 skeleton placeholder divs.

### Admin Users Page (`/admin/users`)
- Page header: `'User Management'` — `font-headline-lg text-headline-lg text-on-surface`, `mb-stack-lg`.
- Table card: `bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0]`.
- Table wrapper: `overflow-x-auto`.
- Table: `w-full text-left border-collapse`.
- `<thead>`: `bg-surface-container-low border-b border-[#F1F5F9]`.
- `<th>` cells: `p-4 font-label-md text-label-md text-on-surface-variant font-medium`.
- Columns: **Email**, **Role**, **Joined**, **Actions**.
- `<tbody>`: `font-body-sm text-body-sm text-on-surface`.
- `<tr>`: `border-b border-[#F1F5F9] hover:bg-surface-bright transition-colors`.
- `<td>`: `p-4`.
- Role badge: `inline-flex items-center px-2 py-1 rounded font-label-sm text-label-sm`:
  - WORKER → `bg-[#EFF6FF] text-[#2563EB]`.
  - EMPLOYER → `bg-[#FFF7ED] text-[#EA580C]`.
  - ADMIN → `bg-surface-container text-on-surface-variant`.
- Joined date: formatted as `'DD MMM YYYY'`.
- Delete button: `text-error hover:bg-error-container rounded px-3 py-1 font-label-md text-label-md transition-colors`. Disabled and grayed out for the currently logged-in admin's own row (the admin cannot delete themselves via UI either).
- Empty state (no users): `people` icon 48px `text-on-surface-variant`, `'No users found'` (`font-headline-sm text-headline-sm text-on-surface mt-4`).
- Pagination below table: `'Previous'` and `'Next'` buttons + `'Page X of Y'` text. Buttons: `bg-surface-container-lowest border border-[#E2E8F0] rounded-lg px-4 py-2 font-label-md text-label-md text-on-surface hover:bg-surface-container-low disabled:opacity-40`.

### Admin Jobs Page (`/admin/jobs`)
- Page header: `'Job Management'` — `font-headline-lg text-headline-lg text-on-surface`, `mb-stack-lg`.
- Same card and table structure as Users page.
- Columns: **Title**, **Employer**, **Trade**, **Status**, **City**, **Posted Date**, **Actions**.
- Status badge: same color rules as job status badges from prior units (OPEN=blue, FILLED/CLOSED=gray).
- Delete button: same styling as Users page.
- Empty state: `work` icon 48px, `'No jobs found'` heading.
- Pagination: same pattern as Users page.

### Confirm Delete Modal (`ConfirmModal`)
- Reuse `ConfirmModal` component if already built, or build it here.
- Rendered as a centered overlay: `fixed inset-0 bg-black/40 flex items-center justify-center z-50`.
- Modal panel: `bg-surface-container-lowest rounded-xl p-stack-lg max-w-md w-full mx-4 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.08),_0_4px_6px_-2px_rgba(0,0,0,0.03)]`.
- Title: `'Delete {type}?'` — `font-headline-sm text-headline-sm text-on-surface`.
- Body message (users): `'This will permanently delete the user and all their data (profile, jobs, and applications). This action cannot be undone.'` — `font-body-sm text-body-sm text-on-surface-variant mt-2`.
- Body message (jobs): `'This will permanently delete the job and all associated applications. This action cannot be undone.'` — same styling.
- Action row: `flex gap-stack-sm justify-end mt-stack-lg`.
  - `'Cancel'` ghost button: closes modal, no action.
  - `'Delete'` destructive button: `bg-error text-on-error rounded-saas px-6 py-2.5 font-label-md text-label-md hover:opacity-90`.
- On confirm: call `DELETE /api/admin/users/:id` or `DELETE /api/admin/jobs/:id`. On success: close modal, remove row from table state.
- Loading state on Delete button while request is in flight: `'Deleting...'` text + disabled.

### Responsiveness
- `< 768px`: admin sidebar hidden. No bottom nav bar in this unit (or show simplified hamburger — defer to Unit 13). Page content full width.
- `≥ 768px`: sidebar visible `w-64 fixed`.

---

## Implementation

### Database
No schema changes in this unit. Cascade deletes are enforced by existing Prisma schema relations: deleting a `User` cascades to `WorkerProfile` or `EmployerProfile`; deleting an `EmployerProfile` cascades to their `Job` records; deleting a `Job` cascades to `Application` records.

Verify that `schema.prisma` has `onDelete: Cascade` on:
- `WorkerProfile.user` → `User`
- `EmployerProfile.user` → `User`
- `Job.employer` → `EmployerProfile`
- `Application.job` → `Job`
- `Application.workerProfile` → `WorkerProfile`

If any cascade is missing, add it and run `npx prisma migrate dev --name add-cascade-deletes`.

### Backend API

#### `GET /api/admin/stats`
- Middleware: `[authGuard, roleGuard('ADMIN')]`
- Service: `getAdminStats()`
  1. Run parallel count queries:
     - `totalUsers`: `prisma.user.count()`
     - `totalWorkers`: `prisma.user.count({ where: { role: 'WORKER' } })`
     - `totalEmployers`: `prisma.user.count({ where: { role: 'EMPLOYER' } })`
     - `totalJobs`: `prisma.job.count()`
     - `totalApplications`: `prisma.application.count()`
  2. Return `{ success: true, data: { totalUsers, totalWorkers, totalEmployers, totalJobs, totalApplications } }`.

#### `GET /api/admin/users`
- Middleware: `[authGuard, roleGuard('ADMIN')]`
- Query params: `page` (default `1`, integer), `limit` (default `20`, max `100`, integer).
- Service: `getAllUsers({ page, limit })`
  1. `const skip = (page - 1) * limit`.
  2. `prisma.user.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' }, select: { id: true, email: true, role: true, createdAt: true } })`.
  3. `prisma.user.count()` for total.
  4. Return `{ success: true, data: { users, total, page, limit, totalPages: Math.ceil(total / limit) } }`.
- Passwords are excluded via explicit `select` — never use `select: *` or omit the select.

#### `DELETE /api/admin/users/:id`
- Middleware: `[authGuard, roleGuard('ADMIN')]`
- Zod validation on route param: `id` must be a non-empty string (UUID).
- Service: `deleteUserById(targetId, requestingUserId)`
  1. Guard: if `targetId === requestingUserId` → throw 400 `'Cannot delete your own account'`.
  2. Check user exists: `prisma.user.findUnique({ where: { id: targetId } })`. If null → 404 `'User not found'`.
  3. `prisma.user.delete({ where: { id: targetId } })` — cascade handles all related records.
  4. Return `{ success: true, data: null }`.

#### `GET /api/admin/jobs`
- Middleware: `[authGuard, roleGuard('ADMIN')]`
- Query params: `page` (default `1`), `limit` (default `20`, max `100`).
- Service: `getAllJobs({ page, limit })`
  1. `prisma.job.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' }, select: { id: true, title: true, trade: true, type: true, status: true, city: true, createdAt: true, employer: { select: { fullName: true } } } })`.
  2. `prisma.job.count()` for total.
  3. Return `{ success: true, data: { jobs, total, page, limit, totalPages } }`.

#### `DELETE /api/admin/jobs/:id`
- Middleware: `[authGuard, roleGuard('ADMIN')]`
- Service: `deleteJobById(jobId)`
  1. Check job exists. If null → 404 `'Job not found'`.
  2. `prisma.job.delete({ where: { id: jobId } })` — cascades to `Application`.
  3. Return `{ success: true, data: null }`.

**Route file:** `server/src/routes/adminRoutes.js`  
**Controller file:** `server/src/controllers/adminController.js`  
**Service file:** `server/src/services/adminService.js`

### Frontend Pages

#### `/admin` — `client/src/pages/admin/AdminDashboard.jsx`
- On mount: `GET /api/admin/stats`.
- Renders 5 `MetricCard` components.
- Loading: skeleton cards.

#### `/admin/users` — `client/src/pages/admin/AdminUsers.jsx`
- State: `users` array, `page` (default 1), `totalPages`, `isLoading`, `error`, `deleteTarget` (user object or null), `isDeleting`.
- On mount and on `page` change: `GET /api/admin/users?page={page}&limit=20`.
- Delete button click: set `deleteTarget` → renders `ConfirmModal`.
- On confirm: `DELETE /api/admin/users/:id` → remove user from `users` state array → close modal.

#### `/admin/jobs` — `client/src/pages/admin/AdminJobs.jsx`
- Same pattern as `AdminUsers.jsx` but for jobs.
- On mount and on `page` change: `GET /api/admin/jobs?page={page}&limit=20`.
- Delete: `DELETE /api/admin/jobs/:id`.

#### Admin Layout — `client/src/layouts/AdminLayout.jsx`
- Wraps all `/admin/*` routes.
- Renders admin sidebar + `<Outlet />`.
- Protected by route guard: if `user.role !== 'ADMIN'` → redirect to `/login`.

#### Login redirect
- In the post-login redirect logic (already built in auth unit), add: if `role === 'ADMIN'` → navigate to `/admin`.

### Components

#### `ConfirmModal` — `client/src/components/ConfirmModal.jsx`
Props:
```js
{
  isOpen: boolean,
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel: () => void,
  isLoading?: boolean,
  confirmLabel?: string,  // default 'Delete'
}
```
- Renders as described in Design section.
- On `isOpen` change, prevents body scroll (`document.body.style.overflow = isOpen ? 'hidden' : ''`).

#### `AdminSidebar` — `client/src/components/admin/AdminSidebar.jsx`
- Renders sidebar nav as described in Design section.
- Uses `useLocation()` from React Router to determine active nav item.

#### `Pagination` — `client/src/components/Pagination.jsx`
Props:
```js
{
  page: number,
  totalPages: number,
  onPrev: () => void,
  onNext: () => void,
}
```
- Renders Previous/Next buttons and page indicator.

### State Management
- All state is local to each page component (`useState` + `useEffect`).
- No global state changes needed for admin operations.
- `useAuth()` provides `user.userId` for self-delete guard on frontend (disable own delete button in table).

### Security
- All admin endpoints require `authGuard` + `roleGuard('ADMIN')`.
- Self-delete guard enforced on BOTH backend (400 error) and frontend (button disabled for own row).
- User and job existence validated before deletion (404 if not found).
- Admin accounts are created manually in the database — no registration endpoint for ADMIN role.
- Passwords are never returned: explicit `select` on all user queries excludes `password` field.
- Paginated responses cap at `limit=100` per page to prevent data exfiltration.

---

## Dependencies
* None

---

## Verify when done
- [ ] `GET /api/admin/stats` returns `{ totalUsers, totalWorkers, totalEmployers, totalJobs, totalApplications }` with accurate counts.
- [ ] `GET /api/admin/stats` returns 403 for WORKER and EMPLOYER tokens.
- [ ] `GET /api/admin/users` returns paginated user list with `id`, `email`, `role`, `createdAt` — no `password` field.
- [ ] `GET /api/admin/users?page=2&limit=20` returns the correct second page of results.
- [ ] `DELETE /api/admin/users/:id` successfully deletes the user and all cascade records (WorkerProfile/EmployerProfile, Jobs, Applications).
- [ ] `DELETE /api/admin/users/:id` returns 400 when the admin attempts to delete their own account.
- [ ] `GET /api/admin/jobs` returns paginated job list with employer `fullName` included.
- [ ] `DELETE /api/admin/jobs/:id` deletes the job and cascades to Applications.
- [ ] Admin dashboard (`/admin`) renders 5 metric cards with correct counts.
- [ ] Admin users page (`/admin/users`) renders all users in a paginated table.
- [ ] Role badges display correct colors: WORKER=blue, EMPLOYER=orange, ADMIN=gray.
- [ ] Delete button opens `ConfirmModal` with correct warning message.
- [ ] Confirming delete removes the row from the table without a page reload.
- [ ] Admin's own row has a disabled/grayed Delete button.
- [ ] Admin jobs page (`/admin/jobs`) renders paginated jobs with employer name, status badge, Posted Date.
- [ ] Delete job opens `ConfirmModal` and removes row on confirm.
- [ ] Pagination Previous/Next buttons work on both users and jobs tables.
- [ ] Previous button disabled on page 1; Next button disabled on last page.
- [ ] Navigating to `/admin` with a WORKER or EMPLOYER JWT redirects to `/login`.
- [ ] Admin sidebar shows correct active nav item per current route.
- [ ] Logout in admin sidebar clears auth and redirects to `/login`.
- [ ] Login with ADMIN role redirects to `/admin`.
- [ ] No console errors
- [ ] Responsive at desktop (1280px) and mobile (375px) widths
- [ ] npm run build passes (client)
