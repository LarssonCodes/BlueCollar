# Unit 08: Applicant Management + Shortlisting + Contact Reveal + Mark as Filled — API + UI

## Goal
An Employer can view all applicants for a job they posted. They can shortlist applicants to reveal their phone numbers, reject unsuitable applicants, and mark the job as filled (closing the job to new applications) once they have shortlisted at least one worker.

## Design

### Employer Job Detail Page (`/employer/jobs/:id`)
- Header: Page title (Job Title) in `font-headline-lg text-headline-lg`.
- Top Section: Row containing job summary details (trade, job type, pay rate, start date, posted date) and status badge (Open / Filled / Closed).
- Mark as Filled Button:
  - Placement: Top right of page header.
  - Visibility: Only visible when `job.status === 'OPEN'` and at least one applicant has `status === 'SHORTLISTED'`.
  - Style: `bg-primary-container text-on-primary rounded-saas px-6 py-2.5 hover:bg-surface-tint font-label-md transition-colors`.
  - Interaction: Clicking it opens `ConfirmModal` asking "Are you sure you want to mark this job as filled? This will close the job and stop new applications."
  - Action: On confirm, triggers API call. Upon success, updates status to `FILLED` in the UI, and the button disappears or changes to a disabled "Filled" state.
- Applicants Section: Heading "Applicants (X)" in `font-headline-sm text-headline-sm mb-4`.
- Applicant Cards List:
  - Grid: `grid grid-cols-1 gap-stack-md`.
  - Card: `bg-surface-container-lowest rounded-xl p-stack-md border border-[#E2E8F0] shadow-level-1 flex flex-col md:flex-row md:justify-between md:items-start gap-4`.
  - Left Side (Worker Details):
    - Name: `font-headline-sm text-on-surface`.
    - Trade & Experience: "Electrician • 5 years experience" (`font-body-md text-on-surface-variant`).
    - Location: "City: Mumbai" (`font-body-sm text-on-surface-variant`).
    - Cover Note (optional): If provided, shown inside a light grey box `mt-2 p-3 bg-surface-container-low rounded-lg font-body-sm text-on-surface` labeled "Cover Note:".
    - Contact Reveal Section (Only visible if status is `SHORTLISTED`):
      - Text: "📞 +91 XXXXXXXXXX" in `font-label-md text-primary font-bold mt-2 flex items-center gap-1`.
  - Right Side (Status & Actions):
    - Status Badge: Displays PENDING (blue), SHORTLISTED (orange), or REJECTED (red) badge.
    - Action Buttons (Horizontal row, visible only if status is `PENDING`):
      - **Shortlist**: Ghost style button with primary color borders. `border border-primary text-primary hover:bg-primary/5 rounded-saas px-4 py-2 font-label-md`.
      - **Reject**: Ghost style button with error color borders. `border border-error text-error hover:bg-error/5 rounded-saas px-4 py-2 font-label-md`.
- Empty State: If no applications received yet. Centered container. `group` Material icon (48px, `text-on-surface-variant/40`). Heading "No applications received yet" (`font-headline-sm`). Description "Workers will appear here once they apply."

---

## Implementation

### Database
- No schema changes. Enforces logic on `Application` and `Job` statuses.

---

### Backend API

#### `GET /api/jobs/:id/applications`
- **Auth**: `authGuard` + `roleGuard(Role.EMPLOYER)`
- **Behavior**:
  - Finds the `Job` by `id`. If not found, returns 404.
  - Finds the `EmployerProfile` of the current user using `req.user.userId`.
  - Verifies that the job's `employerId` matches the current employer's profile ID. If not, returns 403 Forbidden.
  - Queries all `Application` records for the job.
  - Includes `WorkerProfile` relation (to get full name, trade, experience, city, pincode).
  - **CRITICAL INVARIANT**: The `phone` field of the `WorkerProfile` MUST be excluded from this list response. This is enforced in the service or select clause:
    ```prisma
    select: {
      id: true,
      status: true,
      coverNote: true,
      createdAt: true,
      worker: {
        select: {
          id: true,
          fullName: true,
          trade: true,
          experience: true,
          city: true,
          // phone is NOT selected here
        }
      }
    }
    ```
- **Response Shape**:
  - Success: HTTP 200 with `{ success: true, data: Application[] }`

#### `PUT /api/applications/:id/shortlist`
- **Auth**: `authGuard` + `roleGuard(Role.EMPLOYER)`
- **Behavior**:
  - Finds the `Application` by `id` param. If not found, returns 404.
  - Finds the `Job` associated with the application.
  - Finds the `EmployerProfile` of the current user.
  - Verifies that the job's `employerId` matches the current employer's profile ID (403 Forbidden if not owner).
  - Sets the application's status to `SHORTLISTED`.
  - **CONTACT REVEAL GATE**: Returns the updated application with the worker's `phone` number included.
    ```prisma
    select: {
      id: true,
      status: true,
      worker: {
        select: {
          fullName: true,
          trade: true,
          experience: true,
          city: true,
          phone: true, // phone IS selected here because status is shortlisted and owner is authorized
        }
      }
    }
    ```
- **Response Shape**:
  - Success: HTTP 200 with `{ success: true, data: Application }` (containing the phone number).

#### `PUT /api/applications/:id/reject`
- **Auth**: `authGuard` + `roleGuard(Role.EMPLOYER)`
- **Behavior**:
  - Finds the `Application` by `id` param.
  - Finds the associated job and verifies ownership (403 Forbidden if not owner).
  - Sets the application's status to `REJECTED`.
  - Does NOT return the worker's phone number.
- **Response Shape**:
  - Success: HTTP 200 with `{ success: true, data: Application }` (phone excluded).

#### `PUT /api/jobs/:id/fill`
- **Auth**: `authGuard` + `roleGuard(Role.EMPLOYER)`
- **Behavior**:
  - Finds the `Job` by `id`. If not found, returns 404.
  - Verifies job ownership (403 Forbidden if not owner).
  - Checks if the job status is already `FILLED` or `CLOSED` (400 if yes).
  - Checks if there is at least one application for this job that has status `SHORTLISTED`. If there are none, returns 400 Bad Request (`{ success: false, error: "Must shortlist at least one worker before marking the job as filled" }`).
  - Sets the job status to `FILLED`.
- **Response Shape**:
  - Success: HTTP 200 with `{ success: true, data: Job }`

---

### Frontend Pages
- Create `client/src/pages/employer/JobApplicantsPage.jsx`.
- Set up route `/employer/jobs/:id` in `client/src/routes/index.jsx` inside the employer layout, guarded by `ProtectedRoute` + `RoleRoute(EMPLOYER)`.
- Update My Jobs page `/employer/jobs` to add a "View Applicants" link/button on each job card pointing to `/employer/jobs/:id`.

---

### Components
- Create `client/src/components/ApplicantCard.jsx` (props: `application`, `onShortlist`, `onReject`).
- Reuse `client/src/components/ConfirmModal.jsx` for "Mark as Filled" confirmation.

---

### State Management
- JobApplicantsPage:
  - Fetches the job details and applicant list on mount.
  - Stores job and applicant array in local state.
  - On Shortlist click: sends `PUT /api/applications/:id/shortlist`, replaces the specific applicant object in the state array with the returned object (which contains the phone number), updating the UI badge and displaying the phone.
  - On Reject click: sends `PUT /api/applications/:id/reject`, updates that applicant object in the state array, updating the badge and removing the action buttons.
  - On Mark as Filled click: opens the ConfirmModal, on confirm makes the PUT call, updates the job status in local state to `FILLED`, updating the header badge and disabling/hiding the button.

---

### Security
- **Privacy Enforcement**: Phone number is strictly gated at the database query level on the backend. Only a specific application PUT shortlist request returns the phone number, after verifying the requester is the job's employer.
- **Ownership Check**: An employer cannot view applicants, shortlist, or close jobs that belong to other employers (returns 403 Forbidden).
- **Process Guard**: Job cannot be marked as filled without at least one shortlist. This prevents employers from closing active jobs bypass-style without choosing a candidate.

---

## Verify when done

### Backend Tests
- [ ] `GET /api/jobs/:id/applications` returns 200 with all applications (status, cover note, worker details) for the job owner.
- [ ] In the list response, verify the `phone` field is NOT present for any worker profile.
- [ ] `GET /api/jobs/:id/applications` called by an employer who does not own the job returns 403 Forbidden.
- [ ] `GET /api/jobs/:id/applications` called by a worker or admin returns 403 Forbidden.
- [ ] `PUT /api/applications/:id/shortlist` by the job owner returns 200, updates status to `SHORTLISTED` in the database, and returns the worker's `phone` number.
- [ ] `PUT /api/applications/:id/shortlist` by an unauthorized user returns 403 Forbidden.
- [ ] `PUT /api/applications/:id/reject` by the job owner returns 200, updates status to `REJECTED`, and does NOT contain the `phone` number.
- [ ] `PUT /api/jobs/:id/fill` by the job owner when at least one applicant is shortlisted returns 200 and sets status to `FILLED`.
- [ ] `PUT /api/jobs/:id/fill` when NO applicant is shortlisted returns 400 Bad Request.

### Frontend UI Tests
- [ ] Click "View Applicants" on My Jobs page navigates to `/employer/jobs/:id`.
- [ ] The applicants list is shown. If there are no applicants, the empty state displays.
- [ ] PENDING applicants show "Shortlist" and "Reject" buttons.
- [ ] Clicking "Shortlist" updates the status badge to SHORTLISTED, removes the action buttons, and reveals the phone number "📞 +91 XXXXXXXXXX" inline.
- [ ] Clicking "Reject" updates the status badge to REJECTED and removes the action buttons.
- [ ] "Mark as Filled" button is only visible or clickable when there is a SHORTLISTED candidate.
- [ ] Clicking "Mark as Filled" opens the ConfirmModal. Confirming closes the modal, marks the job as filled, and changes the job status badge to FILLED.
