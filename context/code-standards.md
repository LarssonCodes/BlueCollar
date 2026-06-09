# Code Standards — BlueCollar Job Portal

These standards apply to every file in this codebase. They are not preferences — they are requirements. New code that violates these standards must be corrected before it is considered complete.

---

## General

- Keep every module, component, and function single-purpose. If you cannot describe what it does in one sentence, split it.
- Fix root causes, not symptoms. Do not add null checks or try-catch blocks to hide broken logic — find why the logic is broken and fix that.
- Do not mix unrelated concerns in one file. A route file handles routing. A service file handles database access. A component file handles rendering. Nothing crosses those lines.
- Delete code that is no longer used. Dead code is not harmless — it creates confusion about what is active and what is not.
- Never commit code with `console.log` statements left in for debugging. Use structured logging in the server or remove the statement before finishing a unit.
- Do not hardcode values that belong in environment variables. API base URLs, secrets, and port numbers go in `.env` files — not in source files.

---

## JavaScript

- Do not use `var`. Use `const` for values that do not change and `let` for values that do. Never use `var`.
- Do not use `==`. Always use `===` for equality comparisons.
- Do not use `any` equivalent patterns — do not suppress errors with empty catch blocks or by ignoring return values from async functions.
- Always handle promise rejections. Every `async` function that calls an external service or the database must have error handling. Unhandled promise rejections crash the server silently in some environments.
- Validate all external input at the boundary before it is used. Data from `req.body`, `req.params`, and `req.query` on the server and data from API responses on the client are external input. Treat them as untrusted until validated.
- Use `async/await` consistently. Do not mix `.then()` chains and `await` in the same function.
- Name functions and variables after what they do or represent, not how they do it. `getJobsByPincode` is correct. `fetchData` is not.

---

## React (Frontend)

- Each component must do one thing. A component that fetches data, formats it, and renders it is three responsibilities — split them.
- Do not fetch data directly inside components with raw `axios` calls. All API calls go through functions defined in `src/api/`. Components call those functions, not Axios directly.
- Do not store server data in component state if it can be read directly from the API response. Avoid duplicating server state in the client.
- Use React Context only for global state that genuinely needs to be shared across the entire tree — specifically `AuthContext` for user identity and role. Do not create additional context providers for data that can be passed as props or fetched per-page.
- Every page that requires authentication must check the user's role and redirect if the role does not match. Role guards belong in `src/routes/` — not scattered inside individual page components.
- Handle all three async states visibly in every data-fetching component: loading (show a skeleton or spinner), error (show an error message), and success (show the data). A blank screen is not acceptable for loading or error states.
- Keep page components thin. Pages assemble layout and data. The logic and markup of distinct UI sections belong in components under `src/components/`.

---

## Express (Backend)

- Every route handler must do exactly three things: parse the request, call a service, return a response. No Prisma queries, no business logic, no direct file access inside a controller.
- Middleware runs in this order on every protected route: `authGuard` → `roleGuard` → `validate(zodSchema)` → `controller`. Never skip a step. Never reorder them.
- Return consistent response shapes across all routes. Success responses use `{ success: true, data: ... }`. Error responses use `{ success: false, error: "message" }`. Do not mix formats between routes.
- Return the correct HTTP status code every time. Do not return `200` for an error. Do not return `500` for a validation failure. Common codes: `200` success, `201` created, `400` bad input, `401` unauthenticated, `403` forbidden, `404` not found, `409` conflict, `500` unexpected server error.
- Do not expose internal error details to the client in production. Log the full error on the server. Return only a safe, generic message to the client.
- Keep route files free of logic. A route file imports a controller and chains middleware. That is all it does.

---

## Styling (Tailwind CSS)

- Use only the color tokens defined in `ui-context.md`. Do not write hardcoded hex values, RGB values, or arbitrary color classes anywhere in the codebase. Use the corresponding Tailwind token or CSS custom property.
- Follow the border radius scale from `ui-context.md`. Do not use arbitrary radius values. Use `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, or `rounded-full` as mapped to the design system.
- Use the shadow scale from `ui-context.md`. Do not write arbitrary `box-shadow` values outside of the defined tokens.
- Design mobile-first. Write the base style for the smallest screen size (375px). Use `sm:`, `md:`, `lg:` prefixes to extend for larger screens. Never write desktop styles first and patch mobile after.
- Do not use `!important`. If a style requires `!important` to apply, the component structure or class ordering is wrong — fix that instead.
- All interactive elements (buttons, links, inputs) must have visible focus styles. Do not suppress `outline` without providing an equivalent focus indicator — this breaks keyboard and screen reader accessibility.
- Use status colors consistently: `--color-job-open` (`#16A34A`) for open jobs, `--color-job-filled` (`#64748B`) for filled jobs, `--color-shortlisted` (`#2563EB`) for shortlisted applications, `--color-error` (`#DC2626`) for errors, `--color-success` (`#16A34A`) for success messages.

---

## API Routes

- Validate every request body with a Zod schema before any logic runs. A request that fails validation returns `400` immediately. The controller never sees unvalidated input.
- Check authentication before checking ownership. Check ownership before executing any mutation. The sequence is: authenticated → correct role → owns the resource → perform the action.
- Never expose a worker's `phone` field in a list endpoint or in any response where the requesting employer has not shortlisted that worker. Strip the field at the service layer using explicit Prisma `select` — do not rely on the controller to remove it.
- Never expose the `password` field in any response. Every Prisma query that returns a `User` record must explicitly exclude `password` using `select` or `omit`.
- Use plural nouns for resource URLs: `/api/jobs`, `/api/applications`, `/api/users`. Use HTTP verbs to distinguish actions — not URL verbs like `/api/jobs/create` or `/api/jobs/delete`.
- Paginate list endpoints that can return unbounded results. Job listings and user lists must accept `page` and `limit` query parameters and return paginated responses.

---

## Data and Storage

- All application data goes in PostgreSQL via Prisma. Nothing is stored in memory, in flat files, or in the server filesystem in v1.
- Do not store binary content (images, documents, PDFs) in the database as blobs. When file upload is introduced in v2, files go to an object storage service (S3-compatible). The database stores only the file URL or key.
- Do not cache data in the application layer in v1. All reads go directly to PostgreSQL. If caching is needed later, introduce Redis as a dedicated layer — do not use in-memory objects in Express as a cache.
- Do not duplicate data between tables. If a job's city can be derived from its pincode, do not store city in two places. Pick one location and join when needed.
- Every table must have a `createdAt` timestamp. Mutation-tracking tables (like `Application`) should also have `updatedAt`.
- Use database-level constraints (unique, not-null, foreign key) as the last line of defense. Application-level validation (Zod) is the first line. Both must be present for critical fields.

---

## File Organization

### Client (`client/src/`)

| Folder | What belongs here |
|---|---|
| `api/` | One file per resource (e.g. `jobs.js`, `auth.js`). Each file exports async functions that call Axios. No components here. |
| `context/` | `AuthContext.jsx` only. Stores authenticated user object and role. No other context providers unless explicitly approved. |
| `components/` | Shared, reusable UI components (e.g. `JobCard`, `StatusBadge`, `Button`). No page-level logic or data fetching. |
| `pages/public/` | Landing page, Login page, Register page. Accessible without authentication. |
| `pages/worker/` | Worker dashboard, profile editor, job browse, job detail, application tracker. |
| `pages/employer/` | Employer dashboard, profile editor, job post form, job list, applicant viewer. |
| `pages/admin/` | Admin stats overview, user management table, job management table. |
| `routes/` | React Router route definitions and role-based route guard components. |
| `hooks/` | Custom React hooks (e.g. `useAuth`, `useJobs`). No JSX — logic only. |

### Server (`server/src/`)

| Folder | What belongs here |
|---|---|
| `routes/` | Express router files. Declares URL paths, chains middleware and controller. No logic. |
| `controllers/` | One function per route. Parses request, calls one service function, sends response. No Prisma. |
| `services/` | All business logic and all Prisma queries. One file per resource (e.g. `jobService.js`, `applicationService.js`). |
| `middleware/` | `authGuard.js`, `roleGuard.js`, `validate.js` (Zod runner), `errorHandler.js`. Nothing else. |
| `validators/` | Zod schema definitions. One file per resource. Imported by `validate.js` middleware. |
| `prisma/` | `schema.prisma` and auto-generated `migrations/` folder. Never hand-edit migration files. |
