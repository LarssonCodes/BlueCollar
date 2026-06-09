# Unit 12: Account Settings — API + UI

## Goal
Any logged-in user (Worker, Employer, or Admin) can update their password from a secure "Account Settings" page. The page provides immediate inline validation and feedback upon saving.

## Design

### Layout & Navigation Integration
- Navigation Sidebar Update:
  - Add a "Settings" link to all three layouts (`WorkerLayout`, `EmployerLayout`, and `AdminLayout`).
  - Placement: Positioned directly above the "Logout" button at the bottom of the sidebar.
  - Icon: `settings` Material icon.
  - Active state: Matches other active links (primary color background, white text).
  - Route: `/settings`

### Account Settings Page (`/settings`)
- Layout: Centered form card layout `max-w-2xl bg-surface-container-lowest rounded-xl p-stack-md border border-[#E2E8F0] shadow-level-1`.
- Header: Page title "Account Settings" in `font-headline-lg text-headline-lg text-on-surface mb-2`. Subtitle: "Manage your account security." (`font-body-md text-on-surface-variant mb-6`).
- Section: "Change Password" section header in `font-headline-sm text-headline-sm text-on-surface mb-4`.
- Form Fields & Structure (Vertical stack with `gap-gutter` spacing):
  - **Current Password**: Input type password. Label `font-label-md text-on-surface-variant mb-2 block`. Input style: `border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md w-full focus:outline-none focus:ring-2 focus:ring-primary-container`.
  - **New Password**: Input type password. Label `font-label-md`. Input style: Same as above. Helper text: "Password must be at least 8 characters long." (`font-label-sm text-on-surface-variant/70 mt-1 block`).
  - **Confirm New Password**: Input type password. Label `font-label-md`. Input style: Same as above.
- Form Actions:
  - Save Button: `bg-primary-container text-on-primary rounded-saas px-6 py-2.5 hover:bg-surface-tint font-label-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed` with a loading spinner inside when submitting.
- Feedback:
  - Success message: Inline banner `bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0] rounded-lg p-3 font-body-sm text-body-sm mb-4` that auto-dismisses after 3 seconds. Clears the password input fields.
  - Error message: Inline banner `bg-error-container text-error border border-error/20 rounded-lg p-3 font-body-sm text-body-sm mb-4` showing the server error.

---

## Implementation

### Database
- No schema changes. Enforces logic on `User` table (`password` column).

---

### Backend API

#### `PUT /api/auth/password`
- **Auth**: `authGuard` (all logged-in roles: `WORKER`, `EMPLOYER`, `ADMIN`)
- **Behavior**:
  - Finds the `User` by `req.user.userId`. If not found, returns 404.
  - Compares the `currentPassword` in the request body with the user's current hashed password using `bcrypt.compare`.
  - If they do not match, returns 400 Bad Request (`{ success: false, error: "Incorrect current password" }`).
  - Hashes the `newPassword` using `bcrypt.hash` (12 rounds).
  - Updates the user's password in the database.
  - **CRITICAL INVARIANT**: Never return the password or hash in the response.
- **Validation (Zod)**:
  - `currentPassword`: string, required.
  - `newPassword`: string, min 8 characters, max 100 characters.
- **Response Shape**:
  - Success: HTTP 200 with `{ success: true, data: { message: "Password updated successfully" } }`

---

### Frontend Pages
- Create `client/src/pages/public/SettingsPage.jsx`.
- Set up route `/settings` in `client/src/routes/index.jsx`.
- The settings route should render `SettingsPage.jsx` nested inside the *active user role's layout* so they retain their respective sidebar navigation.
  - Ex: Render settings page inside `WorkerLayout` for workers, `EmployerLayout` for employers, `AdminLayout` for admins. This is achieved in React Router using nested layouts.

---

### Components
- No specific components. Uses local standard inputs.

---

### State Management
- Local form state (`currentPassword`, `newPassword`, `confirmPassword`) in `SettingsPage.jsx`.
- Local validation check: Before submitting the form, verify `newPassword === confirmPassword`. If they do not match, prevent submission and show inline error "New passwords do not match."
- Form submission sends `PUT /api/auth/password`. On success, sets success banner, clears form input fields. On error, shows server error banner.

---

### Security
- **Secure session verification**: Password updates require the user's current password as verification, protecting sessions from unauthorized hijacked update attempts.
- **Bcrypt hashing**: The new password must be hashed with 12 salt rounds before being persisted in the database.
- **No leakages**: No part of the password hashing process is exposed in logs, responses, or client data models.

---

## Verify when done

### Backend Tests
- [ ] `PUT /api/auth/password` with correct current password and valid new password (8+ chars) hashes new password, updates DB, and returns 200.
- [ ] Log in with the *new* password succeeds; logging in with the *old* password fails.
- [ ] `PUT /api/auth/password` with incorrect current password returns 400 Bad Request.
- [ ] `PUT /api/auth/password` with short new password (e.g. `12345`) returns 400 validation error.
- [ ] `PUT /api/auth/password` called without authentication token returns 401 Unauthorized.

### Frontend UI Tests
- [ ] Settings menu item appears in worker, employer, and admin layouts.
- [ ] Clicking Settings menu item displays the Change Password form while keeping the role-appropriate sidebar active.
- [ ] Leaving any field blank and clicking Save shows validation errors.
- [ ] Entering mismatched passwords in New Password and Confirm Password fields displays a "New passwords do not match" validation error.
- [ ] Entering valid fields and clicking Save triggers the API update, displays a green success banner for 3 seconds, and empties all password input fields.
