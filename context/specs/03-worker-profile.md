# Unit 03: Worker Profile — API + UI

## Goal
A logged-in Worker can create, read, and update their profile with all required fields (full name, phone, trade, pincode, city, state, experience, bio, skills, and availability). The profile form repopulates with saved data on reload.

## Design

### Worker Dashboard Layout (`/worker/*`)
- Sidebar layout: A persistent left sidebar `w-64` on desktop (`hidden md:flex flex-col`), `bg-surface-container-lowest border-r border-outline-variant`.
- Sidebar components:
  - Logo section: `h-16 flex items-center px-6 border-b border-outline-variant`. Renders `build_circle` icon + "BlueCollar" text (`font-headline-sm text-headline-sm text-primary`).
  - User Card: Rounded box in the sidebar (`m-4 p-4 bg-surface-container-low rounded-lg`). Displays logged-in user's name (or email if profile not set) in `font-label-md text-on-surface` and subtitle "Skilled Professional" in `font-label-sm text-on-surface-variant`.
  - Navigation links:
    - Dashboard (placeholder, grayed/inactive: `font-body-md text-on-surface-variant/50 cursor-not-allowed`)
    - Browse Jobs (placeholder, grayed/inactive: `font-body-md text-on-surface-variant/50 cursor-not-allowed`)
    - My Applications (placeholder, grayed/inactive: `font-body-md text-on-surface-variant/50 cursor-not-allowed`)
    - Profile (Active: `font-label-md text-label-md bg-primary-container text-on-primary rounded-lg px-4 py-3 translate-x-1`)
    - Settings (placeholder, grayed/inactive)
    - Logout (Ghost style button at bottom: `mt-auto mx-4 mb-4 border border-outline-variant text-on-surface rounded-saas hover:bg-surface-container-low px-4 py-2 text-center cursor-pointer`)

### Worker Profile Page (`/worker/profile`)
- Header: Page title "My Profile" in `font-headline-lg text-headline-lg text-on-surface mb-6`.
- Profile Form Card: Centered single-column layout `max-w-3xl bg-surface-container-lowest rounded-xl p-stack-md border border-[#E2E8F0] shadow-level-1`.
- Form Fields & Structure (Vertical stack with `gap-gutter` spacing):
  - **Full Name**: Input type text. Label `font-label-md text-on-surface-variant mb-2 block`. Input style: `border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container`.
  - **Phone Number**: Input type tel. Same styling. Helper text: "Only revealed to employers who shortlist you." (`font-label-sm text-on-surface-variant/70 mt-1 block`).
  - **Trade Category**: Select dropdown. Options: Electrician, Plumber, Driver, Welder, Mechanic, Construction, Other.
  - **Location Grid** (Grid `grid-cols-1 md:grid-cols-3 gap-stack-md`):
    - **Pincode**: Input type text. Max length 6.
    - **City**: Input type text.
    - **State**: Input type text.
  - **Experience (Years)**: Input type number, min 0.
  - **Bio**: Textarea, 4 rows. Label `font-label-md`. Placeholder "Describe your experience, typical work, or certifications..."
  - **Skills**: Text input, comma-separated. Ex: "house wiring, industrial cabling, repair". Explanatory caption below input: "Separate skills with commas" in `font-label-sm text-on-surface-variant`.
  - **Availability Status**: Custom toggle switch or checkbox. Label: "Available for work immediately" (`font-body-md text-on-surface`).
- Form Actions:
  - Save Button: `bg-primary-container text-on-primary rounded-saas px-6 py-2.5 hover:bg-surface-tint font-label-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed` with a loading spinner inside when submitting.
- Feedback:
  - Success message: Inline banner `bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0] rounded-lg p-3 font-body-sm text-body-sm mb-4` that auto-dismisses after 3 seconds.
  - Error message: Inline banner `bg-error-container text-error border border-error/20 rounded-lg p-3 font-body-sm text-body-sm mb-4`.

---

## Implementation

### Database
- No schema changes. Uses `WorkerProfile` table:
  - `id` (uuid, Primary Key)
  - `userId` (String, unique FK to User)
  - `fullName` (String)
  - `phone` (String)
  - `trade` (Trade enum: `ELECTRICIAN`, `PLUMBER`, `DRIVER`, `WELDER`, `MECHANIC`, `CONSTRUCTION`, `OTHER`)
  - `pincode` (String)
  - `city` (String)
  - `state` (String)
  - `experience` (Int)
  - `bio` (String)
  - `skills` (String[])
  - `isAvailable` (Boolean, default true)
  - `createdAt` (DateTime)

---

### Backend API

#### `POST /api/worker/profile`
- **Auth**: `authGuard` + `roleGuard(Role.WORKER)`
- **Behavior**:
  - Checks if a profile already exists for the current user ID. If yes, returns 409 conflict (`{ success: false, error: "Profile already exists" }`).
  - Creates the `WorkerProfile` linked to `req.user.userId`.
- **Validation (Zod)**:
  - `fullName`: string, min 2 chars, max 100.
  - `phone`: string, min 10 chars, max 15 (must contain digits only or valid format).
  - `trade`: must be one of `Trade` enum.
  - `pincode`: string, exactly 6 digits.
  - `city`: string, min 2 chars.
  - `state`: string, min 2 chars.
  - `experience`: integer, min 0.
  - `bio`: string, min 10, max 1000.
  - `skills`: array of strings, at least 1 skill, each skill trimmed and non-empty.
  - `isAvailable`: boolean.
- **Response Shape**:
  - Success: HTTP 201 with `{ success: true, data: WorkerProfile }`
  - Validation error: HTTP 400 with `{ success: false, error: "Validation details..." }`
  - Unauthorized: HTTP 401/403

#### `GET /api/worker/profile`
- **Auth**: `authGuard` + `roleGuard(Role.WORKER)`
- **Behavior**:
  - Retrieves the `WorkerProfile` belonging to `req.user.userId`.
- **Response Shape**:
  - Success: HTTP 200 with `{ success: true, data: WorkerProfile }`
  - Not found: HTTP 404 with `{ success: false, error: "Profile not found" }` (this is expected on first login)

#### `PUT /api/worker/profile`
- **Auth**: `authGuard` + `roleGuard(Role.WORKER)`
- **Behavior**:
  - Updates the `WorkerProfile` belonging to `req.user.userId`.
  - Returns 404 if the profile does not exist.
- **Validation (Zod)**: Same as POST, but all fields are optional.
- **Response Shape**:
  - Success: HTTP 200 with `{ success: true, data: UpdatedProfile }`
  - Not found: HTTP 404 with `{ success: false, error: "Profile not found" }`

---

### Frontend Pages
- Create `client/src/pages/worker/WorkerProfilePage.jsx`
- Create Worker layout in `client/src/components/layouts/WorkerLayout.jsx` containing the left sidebar and main content pane.
- Set up routes in `client/src/routes/index.jsx`:
  - `/worker/profile` links to `WorkerProfilePage.jsx` nested inside `WorkerLayout.jsx`.
  - Guard the route with `ProtectedRoute` (authenticated) + `RoleRoute(WORKER)`.

---

### Components
- Uses standard styling for inputs and buttons (no complex reusable inputs needed yet, keep it local to the form).

---

### State Management
- Local form state (`fullName`, `phone`, `trade`, etc.) in `WorkerProfilePage.jsx`.
- Local loading states (`isFetching`, `isSaving`) and message states (`successMessage`, `errorMessage`).
- On page mount:
  - Send `GET /api/worker/profile`.
  - If success (200), populate the local form state with data. (Note: Convert `skills` array to a comma-separated string for editing).
  - If 404, leave fields blank (user will create profile).
- On form submit:
  - If profile existed (i.e. GET succeeded), call `PUT /api/worker/profile`.
  - If profile did not exist, call `POST /api/worker/profile`.
  - On success, display success message, update form state, and reload profile details.

---

### Security
- **Strict Role enforcement**: `roleGuard(Role.WORKER)` blocks Employers or Admins from hitting these endpoints.
- **Ownership verification**: Backend implicitly enforces ownership by retrieving and updating profiles using `req.user.userId` directly, rather than an arbitrary profile ID parameter.
- **Strict validation**: Zod validation parses incoming data, preventing database injection or schema type violations.

---

## Verify when done

### Backend Tests
- [ ] `POST /api/worker/profile` with valid data for a logged-in WORKER returns 201 and creates profile in DB.
- [ ] `POST /api/worker/profile` again for same worker returns 409 Conflict.
- [ ] `POST /api/worker/profile` with invalid trade (e.g. `DOCTOR`) or negative experience (e.g. `-2`) returns 400 Bad Request.
- [ ] `GET /api/worker/profile` returns the correct worker profile.
- [ ] `GET /api/worker/profile` for a worker with no profile returns 404.
- [ ] `PUT /api/worker/profile` with partial valid data returns 200 and updates the DB profile.
- [ ] `GET /api/worker/profile` called by an EMPLOYER or ADMIN user returns 403 Forbidden.
- [ ] `POST /api/worker/profile` called by an EMPLOYER or ADMIN user returns 403 Forbidden.

### Frontend UI Tests
- [ ] Navigating to `/worker/profile` loads the profile form with Sidebar.
- [ ] If no profile exists, form fields are empty.
- [ ] Filling in the form with valid details and clicking Save creates the profile, shows the success message for exactly 3 seconds, and keeps fields populated.
- [ ] If a profile already exists, page load triggers a GET request, shows a loading skeleton, then fills the form fields with the database values.
- [ ] Experience field does not allow letters or decimal values.
- [ ] Phone field accepts only valid digits (minimum 10 digits).
- [ ] Comma-separated skills (e.g. "painting, plumbing") are saved as an array `["painting", "plumbing"]` on the backend, and display as "painting, plumbing" when reloaded.
- [ ] Setting the availability checkbox to unchecked and saving successfully updates the database field to `false`.
- [ ] Changing fields and clicking Save correctly sends a PUT request.
