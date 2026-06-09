# Unit 02: Authentication + App Shell + Landing Page

## Goal
Implement full JWT-based authentication on the backend (register, login, token verification) and build the public-facing landing page, register page, login page, AuthContext, and route guards on the frontend — so that a user can register, log in, and be redirected to a role-appropriate placeholder dashboard.

## Design

### Landing Page Layout (`/`)
Matches the Stitch landing page mockup. Five stacked sections:

1. **TopNavBar** — sticky, `h-16`, `bg-surface border-b border-outline-variant`. Logo on left (`build_circle` icon + "BlueCollar" text in `font-label-md text-label-md text-primary`). Nav links (`Find Jobs`, `Post Jobs`, `About`) centered, hidden on mobile (`hidden md:flex`), `font-body-md text-on-surface-variant`. Right side: Ghost "Login" button + Primary "Sign Up" button; on mobile both collapse to hamburger `menu` icon.
2. **Hero Section** — `max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-16`, text centered. Badge pill: `inline-flex items-center gap-2 bg-primary-fixed text-primary font-label-sm text-label-sm px-3 py-1 rounded-full mb-6` with `work` icon. H1: `font-headline-xl text-headline-xl text-on-surface` (48px/700, -0.02em) on desktop, `font-headline-lg-mobile text-headline-lg-mobile` on mobile. Body text: `font-body-lg text-body-lg text-on-surface-variant`. Two CTA buttons: Primary "Find Jobs" (`bg-primary-container text-on-primary rounded-saas px-6 py-2.5 font-label-md text-label-md`) and Ghost "Post a Job" (`border border-outline-variant text-on-surface rounded-saas px-8 py-3.5 font-label-md text-label-md hover:bg-surface-container-low`). Stacked on mobile, side-by-side (`flex-row gap-4`) on `sm:`.
3. **Feature Section** — `bg-surface-bright py-24`. Section heading: `font-headline-md text-headline-md text-on-surface text-center mb-12`. Three feature cards in a `grid grid-cols-1 md:grid-cols-3 gap-gutter`. Each card: `bg-surface-container-lowest rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)] border border-[#E2E8F0] p-stack-lg`. Icon chip: `w-12 h-12 rounded-lg bg-tertiary-fixed flex items-center justify-center mb-6` with `material-symbols-outlined fill text-2xl text-on-primary-fixed-variant`. Card title: `font-headline-sm text-headline-sm text-on-surface mb-2`. Card body: `font-body-md text-body-md text-on-surface-variant`. Icons: `location_on` (Find Local Jobs), `handshake` (Hire Skilled Workers), `bolt` (Fast Hiring).
4. **Stats Section** — `bg-background py-16`. White stats card: `max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop`. Inner card: `bg-surface-container-lowest rounded-xl shadow-level-1 border border-[#E2E8F0] p-stack-lg`. Three stats in `grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-outline-variant`. Each stat: number in `font-headline-xl text-headline-xl text-primary` and label in `font-body-md text-body-md text-on-surface-variant`.
5. **Footer** — `bg-surface border-t border-outline-variant py-12`. Logo left, copyright `font-label-sm text-label-sm text-on-surface-variant`.

### Register Page (`/register`)
Centered card layout. `max-w-md mx-auto mt-16 px-margin-mobile`. Card: `bg-surface-container-lowest rounded-xl shadow-level-1 border border-[#E2E8F0] p-stack-lg`. Page title: `font-headline-lg-mobile text-headline-lg-mobile text-on-surface`. Two role cards side-by-side (`grid grid-cols-2 gap-4 mb-6`). Each role card: `border-2 rounded-xl p-4 cursor-pointer text-center transition-colors`. Unselected: `border-outline-variant bg-surface-container-low text-on-surface-variant`. Selected: `border-primary-container bg-primary-fixed text-primary`. Role card label: `font-label-md text-label-md`. Email + password inputs: `font-body-md text-body-md border border-outline-variant rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-container`. Labels: `font-label-md text-label-md text-on-surface-variant mb-1`. Submit button: full-width `bg-primary-container text-on-primary rounded-saas py-3 font-label-md text-label-md hover:bg-surface-tint`. Error: `text-error font-body-sm mt-2`. Link to login at bottom: `text-primary font-body-sm`.

### Login Page (`/login`)
Same card style as register. Email + password inputs with identical styling. Submit button full-width. Error message `text-error font-body-sm` displayed below the submit button. Link to register at bottom.

### Responsiveness
- TopNavBar: hamburger replaces nav links + buttons on mobile (`md:hidden` / `hidden md:flex`)
- Hero H1 switches: `font-headline-lg-mobile text-headline-lg-mobile md:font-headline-xl md:text-headline-xl`
- Feature grid: `grid-cols-1 md:grid-cols-3`
- Stats grid: `grid-cols-1 sm:grid-cols-3`
- Auth forms: single column, max-width constrained, centered

---

## Implementation

### Database
No schema changes in this unit.

---

### Backend API

**File structure:**
```
server/src/
  routes/
    auth.js
  controllers/
    authController.js
  services/
    authService.js
  middleware/
    authGuard.js
    roleGuard.js
    validate.js
    errorHandler.js
  validators/
    authValidator.js
```

#### `POST /api/auth/register`

- **Middleware chain:** `validate(registerSchema)` → `authController.register`
- **No `authGuard`** (public route)
- **Zod schema (`registerSchema`):**
  ```js
  z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['WORKER', 'EMPLOYER']),
  })
  ```
  Note: `ADMIN` is not a valid registration role. Admin accounts are seeded manually.
- **Service (`authService.register`):**
  1. Check if a User with `email` already exists → throw 409 conflict if so
  2. Hash password: `bcrypt.hash(password, 12)`
  3. Create User via Prisma with `{ email, password: hashedPassword, role }`
  4. Sign JWT: `jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })`
  5. Return `{ token, user: { id, email, role } }` — password field never included
- **Controller:** Calls service, responds `201` with `{ success: true, data: { token, user } }`

#### `POST /api/auth/login`

- **Middleware chain:** `validate(loginSchema)` → `authController.login`
- **Zod schema (`loginSchema`):**
  ```js
  z.object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  ```
- **Service (`authService.login`):**
  1. Find User by email → throw 401 if not found (generic message: "Invalid credentials")
  2. `bcrypt.compare(password, user.password)` → throw 401 if false (same generic message)
  3. Sign JWT same as register
  4. Return `{ token, user: { id, email, role } }`
- **Controller:** Responds `200` with `{ success: true, data: { token, user } }`
- **Security:** Never reveal whether the email was not found vs. password was wrong. Both cases return identical 401 with "Invalid credentials".

#### `GET /api/auth/me`

- **Middleware chain:** `authGuard` → `authController.me`
- **Service (`authService.getMe`):**
  1. Find User by `req.user.userId` using Prisma `select: { id: true, email: true, role: true, createdAt: true }` — password explicitly excluded
  2. Return user object
- **Controller:** Responds `200` with `{ success: true, data: user }`

#### `authGuard` middleware (`server/src/middleware/authGuard.js`)

```js
// Pseudo-code
const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
if (!token) return res.status(401).json({ success: false, error: 'No token provided' });
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET); // { userId, role }
  req.user = decoded;
  next();
} catch {
  return res.status(401).json({ success: false, error: 'Invalid or expired token' });
}
```
- Does not call any service or Prisma. Pure token verification.
- Attaches `req.user = { userId, role }`.

#### `roleGuard(role)` middleware (`server/src/middleware/roleGuard.js`)

```js
// Pseudo-code
const roleGuard = (requiredRole) => (req, res, next) => {
  if (req.user.role !== requiredRole) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  next();
};
```
- Always called after `authGuard`. Never used alone.

#### `validate(schema)` middleware (`server/src/middleware/validate.js`)

```js
// Pseudo-code
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ success: false, error: err.errors });
  }
};
```

#### `errorHandler` middleware (`server/src/middleware/errorHandler.js`)

- Registered as `app.use(errorHandler)` last in `index.js`, after all routes.
- Catches any error forwarded by `next(err)` or thrown in async routes (via `express-async-errors`).
- Logs full error to `console.error` on the server.
- Returns `{ success: false, error: err.message || 'Internal server error' }` to client.
- HTTP status: uses `err.status` if set, otherwise `500`.

#### Route mounting in `server/index.js`

```js
app.use('/api/auth', authRouter);
// errorHandler last:
app.use(errorHandler);
```

---

### Frontend Pages

**File structure:**
```
client/src/
  context/
    AuthContext.jsx
  api/
    axios.js         (already exists from Unit 01)
    auth.js
  routes/
    ProtectedRoute.jsx
    RoleRoute.jsx
    index.jsx
  pages/
    public/
      Landing.jsx
      Login.jsx
      Register.jsx
    worker/
      WorkerDashboard.jsx    (placeholder)
    employer/
      EmployerDashboard.jsx  (placeholder)
  components/
    TopNavBar.jsx
    Footer.jsx
```

#### `client/src/api/auth.js`

Three async functions calling the Axios instance from `axios.js`:
```js
export const register = (data) => api.post('/api/auth/register', data);
export const login    = (data) => api.post('/api/auth/login', data);
export const getMe   = ()     => api.get('/api/auth/me');
```

Add a request interceptor to `axios.js` (update from Unit 01) that attaches the JWT from localStorage:
```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

#### `AuthContext.jsx`

Provides: `{ user, token, isAuthenticated, isLoading, login, logout }`

- `login(token, user)`: saves token to `localStorage.setItem('token', token)`, sets `user` and `token` state.
- `logout()`: calls `localStorage.removeItem('token')`, clears state, navigates to `/`.
- On mount (`useEffect` with `[]`): reads `localStorage.getItem('token')`. If found, calls `getMe()`. On success sets `user`. On failure (expired/invalid token) calls `logout()`. Sets `isLoading = false` when done.
- `isAuthenticated`: `Boolean(user)`.

#### `ProtectedRoute.jsx`

```jsx
// If isLoading: return null or a spinner
// If !isAuthenticated: return <Navigate to="/login" replace />
// Otherwise: return <Outlet />
```

#### `RoleRoute.jsx`

```jsx
// Props: role (string)
// If isLoading: return null
// If !isAuthenticated: return <Navigate to="/login" replace />
// If user.role !== role: redirect to correct dashboard:
//   WORKER → /worker/dashboard, EMPLOYER → /employer/dashboard, ADMIN → /admin
// Otherwise: return <Outlet />
```

#### Route definitions (`client/src/routes/index.jsx`)

```jsx
<Routes>
  {/* Public */}
  <Route path="/"          element={<Landing />} />
  <Route path="/login"     element={<Login />} />
  <Route path="/register"  element={<Register />} />

  {/* Worker (requires auth + WORKER role) */}
  <Route element={<RoleRoute role="WORKER" />}>
    <Route path="/worker/dashboard" element={<WorkerDashboard />} />
    {/* More worker routes added in later units */}
  </Route>

  {/* Employer (requires auth + EMPLOYER role) */}
  <Route element={<RoleRoute role="EMPLOYER" />}>
    <Route path="/employer/dashboard" element={<EmployerDashboard />} />
    {/* More employer routes added in later units */}
  </Route>
</Routes>
```

#### `Landing.jsx`

Assembles `<TopNavBar />`, Hero section, Feature section, Stats section, `<Footer />`. No data fetching. Pure presentational. All content is static strings.

#### `Register.jsx`

- Local state: `{ role: null, email: '', password: '', error: '', isLoading: false }`
- `handleSubmit`: calls `register({ email, password, role })` from `api/auth.js` → on success calls `login(token, user)` from AuthContext → navigate to `/worker/dashboard` or `/employer/dashboard` based on returned `user.role`
- Validation: Role must be selected before submit (show `text-error` inline if not selected). Email and password are validated by Zod on the server — display server error on failure.
- Role not selected state: submit shows `text-error font-body-sm` message "Please select a role".

#### `Login.jsx`

- Local state: `{ email: '', password: '', error: '', isLoading: false }`
- `handleSubmit`: calls `login({ email, password })` from `api/auth.js` → on success calls AuthContext `login()` → navigate to correct dashboard
- Error: display server error `text-error font-body-sm` below submit button

#### `WorkerDashboard.jsx` / `EmployerDashboard.jsx`

These are placeholder files in this unit only. They render a minimal page with a heading ("Worker Dashboard" / "Employer Dashboard") so the redirect target exists. They will be fully replaced in Units 09 and 10 respectively.

#### `TopNavBar.jsx`

Props: none (reads from AuthContext).
- Shows logo left: `<span class="material-symbols-outlined text-primary">build_circle</span>` + "BlueCollar" `font-headline-sm text-headline-sm text-on-surface`.
- If `!isAuthenticated`: nav links + Login + Sign Up buttons.
- If `isAuthenticated`: show user role badge + Logout button. (Sidebar handles navigation for authenticated users — TopNavBar is public-only nav.)
- Hamburger `menu` icon replaces nav links at mobile. Mobile menu state is local (`useState`).

---

### Components

#### `TopNavBar.jsx`
- Must use `useAuth()` hook (or `useContext(AuthContext)`).
- Must not contain any data fetching.
- Ghost button: `border border-outline-variant text-on-surface rounded-saas px-4 py-2 font-label-md text-label-md hover:bg-surface-container-low`
- Primary button: `bg-primary-container text-on-primary rounded-saas px-4 py-2 font-label-md text-label-md hover:bg-surface-tint`

#### `Footer.jsx`
- `bg-surface border-t border-outline-variant py-12`
- Logo + "BlueCollar" left, copyright `font-label-sm text-label-sm text-on-surface-variant` right
- No links to authenticated pages

---

### State Management

- `AuthContext` is the only context provider. Wrap `<App>` in `<AuthProvider>`.
- Components call `useContext(AuthContext)` (or a `useAuth()` hook wrapper).
- No other context providers exist in this unit.
- Login/register forms use local component state only (`useState`).
- No server data is stored in component state beyond what is returned from `getMe()` and placed in AuthContext.

---

### Security

- Passwords are hashed with `bcrypt.hash(password, 12)` before `User.create()` — never stored in plain text.
- No `password` field is included in any API response. Prisma `select` excludes `password` on all User queries.
- JWT payload contains only `{ userId, role }` — no email, no profile data.
- JWT stored in `localStorage` (v1 tradeoff — acceptable for this scope, noted as XSS risk for v2).
- Login error messages are identical whether email is missing or password is wrong — no enumeration possible.
- `ADMIN` role cannot be registered via the public register endpoint. Zod schema enforces `z.enum(['WORKER', 'EMPLOYER'])`.
- `authGuard` must run before `roleGuard` on every protected route, always.
- Auth routes (`/api/auth/register`, `/api/auth/login`) must not be protected by `authGuard`.
- `GET /api/auth/me` is protected by `authGuard` only (no roleGuard — all authenticated roles may call it).

---

## Dependencies

* None (all required packages were installed in Unit 01)

---

## Verify when done

### Backend — Register
- [ ] `POST /api/auth/register` with valid `{ email, password: "password123", role: "WORKER" }` returns HTTP 201 with `{ success: true, data: { token, user: { id, email, role } } }`
- [ ] Response does NOT contain `password` field anywhere
- [ ] `POST /api/auth/register` with the same email twice returns HTTP 409
- [ ] `POST /api/auth/register` with `password: "short"` (fewer than 8 chars) returns HTTP 400
- [ ] `POST /api/auth/register` with `role: "ADMIN"` returns HTTP 400 (not in Zod enum)
- [ ] `POST /api/auth/register` with missing `email` returns HTTP 400
- [ ] Hashed password is stored in `User` table (verify directly in DB — not plaintext)

### Backend — Login
- [ ] `POST /api/auth/login` with correct credentials returns HTTP 200 with `{ success: true, data: { token, user } }`
- [ ] `POST /api/auth/login` with wrong password returns HTTP 401 with `{ success: false, error: "Invalid credentials" }`
- [ ] `POST /api/auth/login` with non-existent email returns HTTP 401 with same message as wrong password
- [ ] Response does NOT contain `password` field

### Backend — Me
- [ ] `GET /api/auth/me` with valid Bearer token returns HTTP 200 with `{ success: true, data: { id, email, role, createdAt } }`
- [ ] Response does NOT contain `password`
- [ ] `GET /api/auth/me` with no Authorization header returns HTTP 401
- [ ] `GET /api/auth/me` with malformed token returns HTTP 401
- [ ] `GET /api/auth/me` with expired token returns HTTP 401

### Backend — Middleware
- [ ] A route with `roleGuard('WORKER')` called with an EMPLOYER token returns HTTP 403
- [ ] A route with `validate(schema)` and an invalid body returns HTTP 400 with error details
- [ ] The global error handler catches a thrown error and returns `{ success: false, error: "..." }` with HTTP 500

### Frontend — Landing Page
- [ ] Landing page renders at `http://localhost:5173/` without console errors
- [ ] TopNavBar is visible at top with logo, nav links (desktop), Login + Sign Up buttons
- [ ] Hero section renders H1, body text, and two CTA buttons
- [ ] Feature section renders 3 cards with correct icons (`location_on`, `handshake`, `bolt`)
- [ ] Stats section renders a card with 3 statistics
- [ ] Footer renders with logo and copyright
- [ ] "Sign Up" button navigates to `/register`
- [ ] "Login" button navigates to `/login`
- [ ] At 375px width: nav links hidden, hamburger icon visible; hero H1 uses mobile type scale; feature cards stack to single column

### Frontend — Register Page
- [ ] `/register` renders without console errors
- [ ] Two role cards render; clicking one visually selects it (`border-primary-container bg-primary-fixed`)
- [ ] Clicking the other card deselects the first
- [ ] Submitting with no role selected shows "Please select a role" in `text-error font-body-sm`
- [ ] Submitting with role selected and valid credentials calls `POST /api/auth/register`
- [ ] On success as WORKER: user is redirected to `/worker/dashboard`
- [ ] On success as EMPLOYER: user is redirected to `/employer/dashboard`
- [ ] On server error (e.g. duplicate email): error message appears inline in `text-error font-body-sm`
- [ ] "Already have an account?" link navigates to `/login`

### Frontend — Login Page
- [ ] `/login` renders without console errors
- [ ] Submitting with correct credentials redirects WORKER to `/worker/dashboard`, EMPLOYER to `/employer/dashboard`
- [ ] Submitting with wrong password shows error in `text-error font-body-sm` below submit button
- [ ] "Don't have an account?" link navigates to `/register`

### Frontend — Auth Persistence
- [ ] After login, refreshing the page keeps the user logged in (token rehydration via `GET /api/auth/me`)
- [ ] If the stored token is invalid, the user is logged out and redirected to `/login`
- [ ] After logout, navigating to `/worker/dashboard` redirects to `/login`

### Frontend — Route Guards
- [ ] Visiting `/worker/dashboard` while unauthenticated redirects to `/login`
- [ ] Visiting `/worker/dashboard` while authenticated as EMPLOYER redirects to `/employer/dashboard`
- [ ] Visiting `/employer/dashboard` while authenticated as WORKER redirects to `/worker/dashboard`

### General
- [ ] No console errors at any page
- [ ] Responsive at desktop (1280px) and mobile (375px) widths
- [ ] `npm run build` passes (client)
