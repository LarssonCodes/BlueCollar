# Unit 04: Employer Profile — API + UI

## Goal
A logged-in Employer can create, read, and update their profile with all required fields (full name, company name, phone, pincode, and city). The profile form repopulates with saved data on reload.

## Design

### Employer Layout (`/employer/*`)
- Sidebar layout: A persistent left sidebar `w-64` on desktop (`hidden md:flex flex-col`), `bg-surface-container-lowest border-r border-outline-variant`.
- Sidebar components:
  - Logo section: `h-16 flex items-center px-6 border-b border-outline-variant`. Renders `build_circle` icon + "BlueCollar" text (`font-headline-sm text-headline-sm text-primary`).
  - User Card: Rounded box in the sidebar (`m-4 p-4 bg-surface-container-low rounded-lg`). Displays logged-in user's name (or email if profile not set) in `font-label-md text-on-surface` and subtitle "Business Owner / Employer" in `font-label-sm text-on-surface-variant`.
  - Navigation links:
    - Dashboard (placeholder, grayed/inactive)
    - My Jobs (placeholder, grayed/inactive)
    - Post a Job (placeholder, grayed/inactive)
    - Profile (Active: `font-label-md text-label-md bg-primary-container text-on-primary rounded-lg px-4 py-3 translate-x-1`)
    - Settings (placeholder, grayed/inactive)
    - Logout (Ghost style button at bottom: `mt-auto mx-4 mb-4 border border-outline-variant text-on-surface rounded-saas hover:bg-surface-container-low px-4 py-2 text-center cursor-pointer`)

### Employer Profile Page (`/employer/profile`)
- Header: Page title "Employer Profile" in `font-headline-lg text-headline-lg text-on-surface mb-6`.
- Profile Form Card: Centered single-column layout `max-w-3xl bg-surface-container-lowest rounded-xl p-stack-md border border-[#E2E8F0] shadow-level-1`.
- Form Fields & Structure (Vertical stack with `gap-gutter` spacing):
  - **Full Name / Contact Person**: Input type text. Label `font-label-md text-on-surface-variant mb-2 block`. Input style: `border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container`.
  - **Company / Shop Name** (Optional): Input type text. Same styling. Helper text: "For sole traders, leave blank or put your shop/trading name." (`font-label-sm text-on-surface-variant/70 mt-1 block`).
  - **Phone Number**: Input type tel. Same styling. Helper text: "This will only be visible to workers whose applications you shortlist."
  - **Location Grid** (Grid `grid-cols-1 md:grid-cols-2 gap-stack-md`):
    - **Pincode**: Input type text. Max length 6.
    - **City**: Input type text. (No state is collected for EmployerProfile as per the schema, only city and pincode).
- Form Actions:
  - Save Button: `bg-primary-container text-on-primary rounded-saas px-6 py-2.5 hover:bg-surface-tint font-label-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed` with a loading spinner inside when submitting.
- Feedback:
  - Success message: Inline banner `bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0] rounded-lg p-3 font-body-sm text-body-sm mb-4` that auto-dismisses after 3 seconds.
  - Error message: Inline banner `bg-error-container text-error border border-error/20 rounded-lg p-3 font-body-sm text-body-sm mb-4`.

---

## Implementation

### Database
- No schema changes. Uses `EmployerProfile` table:
  - `id` (uuid, Primary Key)
  - `userId` (String, unique FK to User)
  - `fullName` (String)
  - `companyName` (String, optional)
  - `phone` (String)
  - `pincode` (String)
  - `city` (String)
  - `createdAt` (DateTime)

---

### Backend API

#### `POST /api/employer/profile`
- **Auth**: `authGuard` + `roleGuard(Role.EMPLOYER)`
- **Behavior**:
  - Checks if a profile already exists for the current user ID. If yes, returns 409 conflict (`{ success: false, error: "Profile already exists" }`).
  - Creates the `EmployerProfile` linked to `req.user.userId`.
- **Validation (Zod)**:
  - `fullName`: string, min 2 chars, max 100.
  - `companyName`: string, optional (empty strings are converted to null/undefined).
  - `phone`: string, min 10 chars, max 15 (must contain digits only or valid format).
  - `pincode`: string, exactly 6 digits.
  - `city`: string, min 2 chars.
- **Response Shape**:
  - Success: HTTP 201 with `{ success: true, data: EmployerProfile }`
  - Validation error: HTTP 400 with `{ success: false, error: "Validation details..." }`
  - Unauthorized: HTTP 401/403

#### `GET /api/employer/profile`
- **Auth**: `authGuard` + `roleGuard(Role.EMPLOYER)`
- **Behavior**:
  - Retrieves the `EmployerProfile` belonging to `req.user.userId`.
- **Response Shape**:
  - Success: HTTP 200 with `{ success: true, data: EmployerProfile }`
  - Not found: HTTP 404 with `{ success: false, error: "Profile not found" }`

#### `PUT /api/employer/profile`
- **Auth**: `authGuard` + `roleGuard(Role.EMPLOYER)`
- **Behavior**:
  - Updates the `EmployerProfile` belonging to `req.user.userId`.
  - Returns 404 if the profile does not exist.
- **Validation (Zod)**: Same as POST, but all fields are optional.
- **Response Shape**:
  - Success: HTTP 200 with `{ success: true, data: UpdatedProfile }`
  - Not found: HTTP 404 with `{ success: false, error: "Profile not found" }`

---

### Frontend Pages
- Create `client/src/pages/employer/EmployerProfilePage.jsx`
- Create Employer layout in `client/src/components/layouts/EmployerLayout.jsx` containing the left sidebar and main content pane.
- Set up routes in `client/src/routes/index.jsx`:
  - `/employer/profile` links to `EmployerProfilePage.jsx` nested inside `EmployerLayout.jsx`.
  - Guard the route with `ProtectedRoute` (authenticated) + `RoleRoute(EMPLOYER)`.

---

### Components
- Uses standard styling for inputs and buttons (no complex reusable inputs needed yet, keep it local to the form).

---

### State Management
- Local form state (`fullName`, `companyName`, `phone`, `pincode`, `city`) in `EmployerProfilePage.jsx`.
- Local loading states (`isFetching`, `isSaving`) and message states (`successMessage`, `errorMessage`).
- On page mount:
  - Send `GET /api/employer/profile`.
  - If success (200), populate the local form state with data.
  - If 404, leave fields blank (user will create profile).
- On form submit:
  - If profile existed (i.e. GET succeeded), call `PUT /api/employer/profile`.
  - If profile did not exist, call `POST /api/employer/profile`.
  - On success, display success message, update form state, and reload profile details.

---

### Security
- **Strict Role enforcement**: `roleGuard(Role.EMPLOYER)` blocks Workers or Admins from accessing these routes.
- **Ownership verification**: Backend implicitly enforces ownership by retrieving and updating profiles using `req.user.userId` directly, rather than an arbitrary profile ID parameter.
- **Strict validation**: Zod validation parses incoming data, preventing database injection or schema type violations.

---

## Verify when done

### Backend Tests
- [ ] `POST /api/employer/profile` with valid data for a logged-in EMPLOYER returns 201 and creates profile in DB.
- [ ] `POST /api/employer/profile` again for same employer returns 409 Conflict.
- [ ] `POST /api/employer/profile` with invalid phone or pincode (e.g. `123`) returns 400 Bad Request.
- [ ] `GET /api/employer/profile` returns the correct employer profile.
- [ ] `GET /api/employer/profile` for an employer with no profile returns 404.
- [ ] `PUT /api/employer/profile` with partial valid data returns 200 and updates the DB profile.
- [ ] `GET /api/employer/profile` called by a WORKER or ADMIN user returns 403 Forbidden.
- [ ] `POST /api/employer/profile` called by a WORKER or ADMIN user returns 403 Forbidden.

### Frontend UI Tests
- [ ] Navigating to `/employer/profile` loads the profile form with Sidebar.
- [ ] If no profile exists, form fields are empty.
- [ ] Filling in the form with valid details and clicking Save creates the profile, shows the success message for exactly 3 seconds, and keeps fields populated.
- [ ] If a profile already exists, page load triggers a GET request, shows a loading skeleton, then fills the form fields with the database values.
- [ ] Pincode field accepts only valid digits (exactly 6 digits).
- [ ] Phone field accepts only valid digits (minimum 10 digits).
- [ ] Changing fields and clicking Save correctly sends a PUT request.
