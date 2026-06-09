# BlueCollar Job Portal — Architecture

---

## Stack Table

| Layer | Technology | Role |
|---|---|---|
| **Frontend framework** | React 18 (Vite) | UI rendering, client-side routing, component tree |
| **Styling** | Tailwind CSS | Utility-first responsive styling |
| **Routing** | React Router v6 | Client-side page navigation and protected route guards |
| **HTTP client** | Axios | API requests from frontend to backend; attaches JWT to headers |
| **Auth state** | React Context API | Stores authenticated user object and role; shared across all components |
| **Backend runtime** | Node.js + Express.js | REST API server; handles all business logic |
| **Authentication** | JWT (jsonwebtoken) | Stateless session tokens; signed on login, verified on each request |
| **Password security** | bcrypt (rounds = 12) | One-way hashing of all user passwords before storage |
| **Input validation** | Zod | Schema validation on all incoming request bodies before they touch the database |
| **ORM** | Prisma | Type-safe database access layer; manages schema, migrations, and queries |
| **Database** | PostgreSQL | Primary relational data store for all application data |
| **Frontend hosting** | Vercel | Static build deployment with CDN and automatic HTTPS |
| **Backend hosting** | Render or Railway | Node.js process hosting with environment variable management |
| **Database hosting** | Supabase or Railway | Managed PostgreSQL instance with connection pooling |

---

## System Boundaries

The codebase is a monolithic full-stack application split into two top-level folders: `client/` and `server/`. Each folder has a single, non-overlapping responsibility.

```
bluecollar/
│
├── client/                          # React frontend (Vite)
│   └── src/
│       ├── api/                     # Axios instance + per-resource request functions
│       ├── context/                 # AuthContext: user state, login, logout
│       ├── components/              # Shared, reusable UI components
│       ├── pages/
│       │   ├── public/              # Landing, Login, Register
│       │   ├── worker/              # Worker dashboard, profile, job browse, applications
│       │   ├── employer/            # Employer dashboard, profile, job post, applicants
│       │   └── admin/               # Admin stats, user table, job table
│       └── routes/                  # Route definitions and role-based guards
│
└── server/                          # Node.js + Express backend
    └── src/
        ├── routes/                  # Express route declarations (auth, jobs, applications, admin)
        ├── controllers/             # Request handlers — parse input, call service, return response
        ├── services/                # Business logic — all database interactions go here
        ├── middleware/              # authGuard (JWT verify), roleGuard (role check), errorHandler
        ├── validators/              # Zod schemas for every request body
        └── prisma/
            ├── schema.prisma        # Single source of truth for the database schema
            └── migrations/          # Prisma auto-generated migration files
```

### Responsibility Boundaries

| Boundary | Rule |
|---|---|
| `client/` | No business logic. No direct database access. All data comes from the backend API via Axios. |
| `server/routes/` | Only declares route paths and attaches middleware + controller. No logic. |
| `server/controllers/` | Only parses the request, calls a service function, and sends the response. No raw Prisma queries. |
| `server/services/` | Only place where Prisma queries are written. All database access lives here. |
| `server/middleware/` | Only concerns: token verification, role checking, and error formatting. No business logic. |
| `prisma/schema.prisma` | Single source of truth for data shapes. If the schema changes, a migration must be created before deployment. |

---

## Storage Model

### PostgreSQL (Primary Database)

All application data is stored in PostgreSQL via Prisma. Nothing is stored in memory or local files in v1.

| Table | What it stores |
|---|---|
| `User` | Email, hashed password, role (WORKER / EMPLOYER / ADMIN), created timestamp |
| `WorkerProfile` | Trade, pincode, city, state, experience, bio, skills, availability, phone number |
| `EmployerProfile` | Full name, optional company name, phone number, pincode, city |
| `Job` | Title, description, trade, type (GIG / CONTRACT), pincode, city, pay, dates, status (OPEN / FILLED / CLOSED) |
| `Application` | Foreign keys to Job and WorkerProfile, cover note, status (PENDING / SHORTLISTED / REJECTED) |

### File Storage

There is **no file storage in v1**. Document upload and credential verification are out of scope. When added in v2, uploaded documents will be stored in an object storage service (S3-compatible) — never in the PostgreSQL database or on the server filesystem.

### Cache

There is **no caching layer in v1**. All reads hit PostgreSQL directly. If query performance becomes an issue at scale, Redis can be introduced as a read cache for job listings without structural changes to the application.

---

## Auth and Access Model

### Authentication Flow

1. User submits email and password to `POST /api/auth/login`.
2. Server fetches the User record by email using Prisma.
3. Server compares the submitted password against the stored bcrypt hash using `bcrypt.compare()`.
4. On match, server signs a JWT containing `{ userId, role }` with a secret from environment variables. Token expires in 7 days.
5. Token is returned to the client and stored (e.g. `localStorage`).
6. All subsequent requests attach the token as `Authorization: Bearer <token>`.
7. The `authGuard` middleware verifies the token and attaches the decoded payload to `req.user` before the controller runs.

### Role-Based Access Control

Every protected route passes through two middleware functions in sequence: `authGuard` then `roleGuard`.

| Role | What they can access |
|---|---|
| `WORKER` | Own profile (read/write), job listings (read), own applications (read/write) |
| `EMPLOYER` | Own profile (read/write), own jobs (create/read/write/delete), applicants for own jobs (read), shortlist/reject actions |
| `ADMIN` | All users (read/delete), all jobs (read/delete), platform stats |

### Ownership-Based Authorization

Role alone is not sufficient for write operations. Ownership is checked inside the service or controller before any mutation:

- An Employer can only edit, delete, or mark as filled **their own jobs** (`job.employerId === req.user.userId`).
- An Employer can only shortlist or reject applicants for **their own jobs**.
- A Worker can only view **their own applications**.
- An Admin bypasses ownership checks.

Any request that fails an ownership check returns `403 Forbidden` — not `404`. Returning 404 would leak information about whether a resource exists.

### Contact Reveal Gate

The Worker's `phone` field is **stripped from all API responses by default**. It is only included when all three of the following conditions are true:

1. The requesting user has role `EMPLOYER`.
2. The employer owns the job associated with the application (`job.employerId === req.user.userId`).
3. The application status is `SHORTLISTED`.

This logic is enforced in `server/services/applicationService.js`, not in the controller or the client. The client never receives the phone number unless the server explicitly includes it.

---

## AI and Background Tasks

There are **no AI models and no background tasks in v1.**

- No job recommendation engine.
- No matching algorithm.
- No scheduled jobs (e.g. cron for expiring old listings).
- No email or push notification queues.

When background tasks are introduced (e.g. auto-closing expired jobs, sending notification emails), they will be implemented as a separate worker process — not inside the Express server — to avoid blocking the request/response cycle.

---

## Invariants

These are rules the codebase must never violate. They are architectural constraints, not preferences.

**1. No raw SQL. All database access goes through Prisma.**
Direct SQL queries (`pg.query()`, raw template strings) are forbidden anywhere in the codebase. All reads and writes use the Prisma client. This ensures type safety, prevents SQL injection, and keeps migrations predictable.

**2. No Prisma queries outside of `server/services/`.**
Controllers, middleware, and route files must never import or call `prisma.*` directly. If a controller needs data, it calls a service function. This keeps the database access layer isolated and testable.

**3. Worker phone numbers are never sent in list endpoints.**
Any endpoint that returns an array of workers or applicants must not include the `phone` field. Phone numbers are only returned in the single-applicant detail response when the contact reveal conditions are fully satisfied. This rule is enforced by explicitly selecting only the fields needed in every Prisma query — never using `select: *` or returning the full WorkerProfile object.

**4. Passwords are never logged, returned, or stored in plain text.**
The `password` field is stripped from every object before it is returned from a service or controller. Prisma queries that return User records must explicitly exclude the `password` field using `{ select: { password: false } }` or equivalent. Passwords are hashed with bcrypt before `User.create()` is called. No logging middleware may log request bodies on auth routes.

**5. All request bodies are validated with Zod before reaching the controller.**
No controller may access `req.body` fields without those fields having passed through a Zod schema in the validation middleware first. Unvalidated input never touches the database. This applies to all routes including admin routes.

**6. Role guards run after `authGuard` — never before, never alone.**
A route must never use `roleGuard` without first using `authGuard`. The middleware chain for any protected route must always be `[authGuard, roleGuard(role), controller]` in that exact order. Skipping `authGuard` would allow unsigned tokens to pass role checks.

**7. The `prisma/schema.prisma` file is the single source of truth for data shapes.**
No table, column, or relation may exist in the database that is not declared in `schema.prisma`. No migration may be hand-written or applied outside of `prisma migrate dev` / `prisma migrate deploy`. Ad-hoc `ALTER TABLE` statements run directly against the database are forbidden.

---

## Deployment Architecture

```
User's Browser
     │
     ▼
┌──────────────────┐
│  Vercel (CDN)    │  ← React build (static HTML/JS/CSS)
│  client/         │    Served globally via edge network
└────────┬─────────┘
         │ HTTPS REST API calls
         ▼
┌──────────────────┐
│  Render/Railway  │  ← Node.js + Express server
│  server/         │    Reads JWT_SECRET, DATABASE_URL from env vars
└────────┬─────────┘
         │ Prisma connection pool
         ▼
┌──────────────────┐
│  Supabase/Railway│  ← Managed PostgreSQL
│  PostgreSQL      │    Single database, single schema
└──────────────────┘
```

### Environment Variables

| Variable | Where used | Description |
|---|---|---|
| `DATABASE_URL` | Server | PostgreSQL connection string for Prisma |
| `JWT_SECRET` | Server | Secret key for signing and verifying JWTs |
| `JWT_EXPIRES_IN` | Server | Token expiry duration (e.g. `7d`) |
| `PORT` | Server | Express server port (default: 5000) |
| `VITE_API_URL` | Client (build time) | Base URL of the Express backend API |
| `NODE_ENV` | Server | `development` or `production` |

No environment variables are committed to source control. All secrets are injected at deployment time via Render/Railway and Vercel's environment variable settings.
