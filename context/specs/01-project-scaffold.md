# Unit 01: Project Scaffold + Database Schema

## Goal
Initialize the complete monorepo folder structure, configure all tooling (Vite, Tailwind, Express, Prisma), define the full database schema across all five models, and verify both dev servers start cleanly. No UI pages, auth, or feature code is written in this unit.

## Design
- No UI is rendered in this unit beyond the Vite default blank shell at `localhost:5173`.
- The health endpoint is the only visible backend output: `GET /api/health` → `{ success: true, data: { status: "ok" } }`.
- The Tailwind config must include the exact MD3 token system from `ui-context.md`: all color tokens, spacing tokens, font-family tokens, font-size tokens, border-radius tokens, and shadow utilities — so that every token class (e.g. `bg-primary-container`, `text-on-surface`, `rounded-saas`, `p-stack-md`) resolves without error in later units.
- `index.html` must load Inter (Google Fonts, weights 400/500/600/700) and Material Symbols Outlined via `<link>` tags in `<head>`.
- No colors, component classes, or layout decisions are made in this unit. All Tailwind config is purely token registration.

---

## Implementation

### Database

Full Prisma schema with all 5 models and all enums. File lives at `server/src/prisma/schema.prisma`.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              String           @id @default(uuid())
  email           String           @unique
  password        String
  role            Role             @default(WORKER)
  createdAt       DateTime         @default(now())
  workerProfile   WorkerProfile?
  employerProfile EmployerProfile?
}

enum Role { WORKER EMPLOYER ADMIN }

model WorkerProfile {
  id           String        @id @default(uuid())
  userId       String        @unique
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  fullName     String
  phone        String
  trade        Trade
  pincode      String
  city         String
  state        String
  experience   Int
  bio          String
  skills       String[]
  isAvailable  Boolean       @default(true)
  createdAt    DateTime      @default(now())
  applications Application[]
}

enum Trade { ELECTRICIAN PLUMBER DRIVER WELDER MECHANIC CONSTRUCTION OTHER }

model EmployerProfile {
  id          String   @id @default(uuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  fullName    String
  companyName String?
  phone       String
  pincode     String
  city        String
  createdAt   DateTime @default(now())
  jobs        Job[]
}

model Job {
  id           String          @id @default(uuid())
  employerId   String
  employer     EmployerProfile @relation(fields: [employerId], references: [id], onDelete: Cascade)
  title        String
  description  String
  trade        Trade
  type         JobType
  pincode      String
  city         String
  state        String
  payAmount    Int
  payType      PayType
  startDate    DateTime
  endDate      DateTime?
  status       JobStatus       @default(OPEN)
  createdAt    DateTime        @default(now())
  applications Application[]
}

enum JobType   { GIG CONTRACT }
enum PayType   { DAILY MONTHLY }
enum JobStatus { OPEN FILLED CLOSED }

model Application {
  id        String        @id @default(uuid())
  jobId     String
  job       Job           @relation(fields: [jobId], references: [id], onDelete: Cascade)
  workerId  String
  worker    WorkerProfile @relation(fields: [workerId], references: [id], onDelete: Cascade)
  coverNote String?
  status    AppStatus     @default(PENDING)
  createdAt DateTime      @default(now())

  @@unique([jobId, workerId])
}

enum AppStatus { PENDING SHORTLISTED REJECTED }
```

Run `prisma migrate dev --name init` inside `server/`. All five tables (`User`, `WorkerProfile`, `EmployerProfile`, `Job`, `Application`) must be created.

---

### Backend API

**File structure to create:**
```
server/
  src/
    routes/
      health.js
    controllers/
      healthController.js
    services/           (empty — no services yet)
    middleware/         (empty — no middleware yet)
    validators/         (empty — no validators yet)
    prisma/
      schema.prisma
  index.js
  .env
  .env.example
  package.json
```

**`server/index.js`:**
- Imports: `express`, `cors`, `dotenv/config`, `express-async-errors`
- Creates Express app
- Mounts CORS (`origin: process.env.NODE_ENV === 'production' ? <Vercel URL> : '*'`)
- Parses JSON bodies with `express.json()`
- Mounts health route at `/api/health`
- Starts listening on `process.env.PORT || 5000`
- No other routes exist yet

**`GET /api/health`:**
- Controller: `healthController.js` — single function, returns `res.json({ success: true, data: { status: 'ok' } })`
- Route: `health.js` — mounts controller with `router.get('/', healthController.getHealth)`
- No auth, no middleware, no database calls
- HTTP 200

**Invariant:** No Prisma queries in controllers. The health controller has no Prisma import.

---

### Frontend Pages

No pages are built in this unit. The Vite scaffold at `client/` renders whatever the default `App.jsx` contains (can be a blank `<div>` or the Vite default placeholder). The only requirement is that it loads without console errors.

**File structure to create:**
```
client/
  src/
    api/
      axios.js
    context/            (empty)
    components/         (empty)
    pages/
      public/           (empty)
      worker/           (empty)
      employer/         (empty)
      admin/            (empty)
    routes/             (empty)
  index.html
  tailwind.config.js
  postcss.config.js
  vite.config.js
  .env
  .env.example
  package.json
```

**`client/index.html` `<head>` must include:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
```

---

### Components

No components in this unit.

---

### State Management

No state in this unit.

**`client/src/api/axios.js`:**
```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default api;
```
- No interceptors yet — those are added in Unit 02 when auth is introduced.
- Exported as default. All future API modules import this instance, never raw `axios`.

---

### Security

No auth in this unit.

**Environment variables — never commit values:**

`.env.example` (both server and client):
```
# Server
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
PORT=
NODE_ENV=

# Client
VITE_API_URL=
```

`.env` files are gitignored. The `.env.example` files are committed with empty values only.

---

### Tailwind Configuration

`client/tailwind.config.js` must register the exact tokens from `ui-context.md`. Key config excerpt:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'background': '#f7f9fb',
        'surface': '#f7f9fb',
        'surface-bright': '#f7f9fb',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f2f4f6',
        'surface-container': '#eceef0',
        'surface-container-high': '#e6e8ea',
        'surface-container-highest': '#e0e3e5',
        'surface-dim': '#d8dadc',
        'surface-variant': '#e0e3e5',
        'primary': '#004ac6',
        'primary-container': '#2563eb',
        'on-primary': '#ffffff',
        'on-primary-container': '#eeefff',
        'on-primary-fixed-variant': '#003ea8',
        'primary-fixed': '#dbe1ff',
        'primary-fixed-dim': '#b4c5ff',
        'inverse-primary': '#b4c5ff',
        'surface-tint': '#0053db',
        'secondary': '#a73a00',
        'secondary-container': '#fd651e',
        'on-secondary': '#ffffff',
        'secondary-fixed': '#ffdbce',
        'secondary-fixed-dim': '#ffb599',
        'on-secondary-fixed-variant': '#7f2b00',
        'on-secondary-container': '#571a00',
        'on-secondary-fixed': '#370e00',
        'tertiary': '#4d556b',
        'tertiary-container': '#656d84',
        'on-tertiary': '#ffffff',
        'tertiary-fixed': '#dae2fd',
        'tertiary-fixed-dim': '#bec6e0',
        'on-tertiary-fixed': '#131b2e',
        'on-tertiary-fixed-variant': '#3f465c',
        'on-tertiary-container': '#eef0ff',
        'on-background': '#191c1e',
        'on-surface': '#191c1e',
        'on-surface-variant': '#434655',
        'inverse-on-surface': '#eff1f3',
        'inverse-surface': '#2d3133',
        'outline': '#737686',
        'outline-variant': '#c3c6d7',
        'error': '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        'on-error': '#ffffff',
        'on-primary-fixed': '#00174b',
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        'saas': '12px',
        'full': '9999px',
      },
      spacing: {
        'base': '4px',
        'stack-sm': '8px',
        'stack-md': '16px',
        'stack-lg': '32px',
        'gutter': '24px',
        'margin-mobile': '16px',
        'margin-desktop': '40px',
        'container-max': '1280px',
      },
      fontFamily: {
        'headline-xl': ['Inter', 'sans-serif'],
        'headline-lg': ['Inter', 'sans-serif'],
        'headline-lg-mobile': ['Inter', 'sans-serif'],
        'headline-md': ['Inter', 'sans-serif'],
        'headline-sm': ['Inter', 'sans-serif'],
        'body-lg': ['Inter', 'sans-serif'],
        'body-md': ['Inter', 'sans-serif'],
        'body-sm': ['Inter', 'sans-serif'],
        'label-md': ['Inter', 'sans-serif'],
        'label-sm': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'headline-xl': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg-mobile': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '16px', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }],
      },
      maxWidth: {
        'container-max': '1280px',
      },
      boxShadow: {
        'level-1': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.02)',
        'level-2': '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.03)',
      },
    },
  },
  plugins: [],
};
```

`client/postcss.config.js`:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## Dependencies

**Server (production):**
* express — HTTP server framework
* cors — cross-origin resource sharing
* dotenv — environment variable loading
* express-async-errors — automatic async error forwarding to errorHandler
* prisma — Prisma CLI (dev dependency)
* @prisma/client — Prisma runtime ORM client
* bcrypt — password hashing (installed now, used in Unit 02)
* jsonwebtoken — JWT signing and verification (installed now, used in Unit 02)
* zod — request body validation (installed now, used in Unit 02)

**Server (dev):**
* nodemon — auto-restart on file changes

**Client:**
* react-router-dom — client-side routing (installed now, used in Unit 02)
* axios — HTTP client

---

## Verify when done

### Folder Structure
- [ ] `client/src/api/`, `client/src/context/`, `client/src/components/`, `client/src/pages/public/`, `client/src/pages/worker/`, `client/src/pages/employer/`, `client/src/pages/admin/`, `client/src/routes/` all exist (may be empty)
- [ ] `server/src/routes/`, `server/src/controllers/`, `server/src/services/`, `server/src/middleware/`, `server/src/validators/`, `server/src/prisma/` all exist

### Dev Servers
- [ ] `npm run dev` in `client/` starts Vite at `localhost:5173` without error
- [ ] `npm run dev` in `server/` starts Express (nodemon) at `localhost:5000` without error
- [ ] No console errors in the browser at `localhost:5173`

### Health Endpoint
- [ ] `GET http://localhost:5000/api/health` returns HTTP 200
- [ ] Response body is exactly `{ "success": true, "data": { "status": "ok" } }`

### Database
- [ ] `prisma migrate dev --name init` completes without error
- [ ] Tables `User`, `WorkerProfile`, `EmployerProfile`, `Job`, `Application` exist in PostgreSQL
- [ ] Enums `Role`, `Trade`, `JobType`, `PayType`, `JobStatus`, `AppStatus` exist in PostgreSQL
- [ ] `@@unique([jobId, workerId])` constraint exists on `Application`

### Tailwind
- [ ] `bg-primary-container` resolves to `#2563eb` in browser devtools
- [ ] `text-on-surface` resolves to `#191c1e`
- [ ] `rounded-saas` resolves to `12px`
- [ ] `p-stack-md` resolves to `16px`
- [ ] `font-headline-xl text-headline-xl` applied to a test element renders Inter at 48px/700 weight

### Fonts & Icons
- [ ] Inter font loads from Google Fonts (visible in Network tab)
- [ ] Material Symbols Outlined loads from Google Fonts (visible in Network tab)
- [ ] A `<span class="material-symbols-outlined">work</span>` placed in App.jsx renders a filled icon (not a text string)

### Axios Instance
- [ ] `client/src/api/axios.js` exports a default Axios instance with `baseURL` set to `import.meta.env.VITE_API_URL`
- [ ] No raw `axios` imports exist anywhere outside `client/src/api/`

### Environment
- [ ] `.env.example` exists in both `client/` and `server/` with exactly the correct keys and no values
- [ ] Neither `.env` file is committed to source control (`.gitignore` covers both)
- [ ] `server/.env` contains real values for `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`, `NODE_ENV`
- [ ] `client/.env` contains a real value for `VITE_API_URL`

### Code Standards
- [ ] No `var` used anywhere
- [ ] No `console.log` left in any file
- [ ] No Prisma imports outside `server/src/services/`
- [ ] No hardcoded port, URL, or secret values in source files
- [ ] No schema changes in this unit after initial migration (schema is final as defined above)

### Build
- [ ] `npm run build` in `client/` completes without errors or warnings
- [ ] Responsive at desktop (1280px) and mobile (375px) widths
