# Unit 14: Deployment — Configuration & Smoke Test Spec

## Goal
The application is fully configured, built, and deployed to production. The frontend is hosted on Vercel, the backend on Render or Railway, and the PostgreSQL database on Supabase or Railway. A complete end-to-end smoke test verifies all roles and user flows in the production environment.

## Deployment Target & Build Configurations

### 1. Database (Supabase or Railway PostgreSQL)
- Setup: Create a managed PostgreSQL instance.
- Migrations: Run migrations from the local developer machine against the production database:
  ```bash
  $env:DATABASE_URL="postgresql://<prod_db_user>:<prod_db_password>@<prod_db_host>:<port>/postgres"
  npx prisma migrate deploy
  ```
- Verification: Connect to the DB using PgAdmin, DBeaver, or the provider's SQL editor and verify that all five tables (`User`, `WorkerProfile`, `EmployerProfile`, `Job`, `Application`) and enums exist.

### 2. Backend (Render or Railway)
- **Root Directory**: `server/` (set this in the hosting configuration).
- **Build Command**: `npm install && npx prisma generate`
- **Start Command**: `node src/index.js` (or `npm start` as configured in `server/package.json`).
- **Environment Variables**:
  - `DATABASE_URL`: Production connection string.
  - `JWT_SECRET`: A strong, randomly generated production secret key.
  - `JWT_EXPIRES_IN`: `7d`
  - `NODE_ENV`: `production`
  - `PORT`: `5000` (Render/Railway override this automatically, but set default).
  - `CLIENT_URL`: The production Vercel frontend URL (e.g. `https://bluecollar-jobportal.vercel.app`).
- **CORS Configuration**: Enforce production CORS restriction in `server/src/index.js`:
  ```js
  const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : '*',
    credentials: true
  };
  app.use(cors(corsOptions));
  ```

### 3. Frontend (Vercel)
- **Root Directory**: `client/`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: The live, HTTPS URL of the backend service (e.g. `https://bluecollar-api.onrender.com`).
- **Single Page Application Routing Configuration**:
  - Add `client/vercel.json` to handle client-side routing rewrites:
    ```json
    {
      "rewrites": [
        { "source": "/(.*)", "destination": "/index.html" }
      ]
    }
    ```
    Without this, accessing nested pages directly (e.g., refreshing `/worker/profile`) results in Vercel 404 errors.

---

## E2E Smoke Test Checklist

Follow this precise sequence to verify production health. If any check fails, investigate backend logs or browser network logs.

### Phase 1: Authentication & Onboarding
- [ ] **Worker Registration**: Navigate to `/register`. Select "Worker" card, input `worker_test@bluecollar.in` and password `password123`. Click Register. Redirects to `/worker/profile` (or a page asking to set up profile).
- [ ] **Worker Profile Setup**: Fill out the worker profile. Full Name: "Ramesh Kumar", Phone: "9876543210", Trade: "Electrician", Pincode: "400001", City: "Mumbai", State: "Maharashtra", Experience: "5", Bio: "Expert in home electrical wiring and diagnostics.", Skills: "wiring, switches, fuse, inverter repair". Click Save. Verify inline green success banner appears.
- [ ] **Employer Registration**: Log out. Click Sign Up. Select "Employer" card, input `employer_test@bluecollar.in` and password `password123`. Click Register. Redirects to `/employer/profile`.
- [ ] **Employer Profile Setup**: Fill out the employer profile. Name: "Anil Gupta", Shop Name: "Gupta Electricals", Phone: "9988776655", Pincode: "400001", City: "Mumbai". Click Save. Verify success banner.

### Phase 2: Job Posting & Search
- [ ] **Employer Job Posting**: On employer dashboard, click "Post a Job" or go to `/employer/jobs/new`. Title: "Urgent House Wiring Helper", Description: "Need a skilled assistant to help with rewiring a 3BHK flat in South Mumbai.", Trade: "Electrician", Type: "GIG", Pincode: "400001", City: "Mumbai", Pay: "800" per Daily, Start Date: [Tomorrow's Date]. Click Post Job. Redirects to My Jobs page, and the new job is listed with status `OPEN`.
- [ ] **Worker Job Search**: Log out. Log in as `worker_test@bluecollar.in`. Go to `/worker/jobs`. Verify the job "Urgent House Wiring Helper" is listed.
- [ ] **Filter Check**: In filters, choose Trade: "Plumber" and search. Verify the electrician job disappears. Select "Electrician", verify it reappears. Enter pincode `110001` (Delhi), search. Verify the job disappears. Clear filters, verify it reappears.

### Phase 3: Applications & Shortlisting
- [ ] **Worker Job Application**: Click "View Details" on the electrician job card. Verify the job description loads. Click "Apply Now". In the modal, write "I have 5 years experience in house wiring and can start immediately." Click Submit. Apply button updates to disabled "Applied" state with a green checkmark.
- [ ] **Worker Track Application**: Go to `/worker/applications`. Verify the job is listed with status `PENDING`.
- [ ] **Employer Review Application**: Log out. Log in as `employer_test@bluecollar.in`. Click the posted job card (or "View Applicants"). In the applicants list, verify worker "Ramesh Kumar" is listed. Verify that Ramesh's phone number is **NOT** visible.
- [ ] **Employer Shortlist & Reveal**: Click "Shortlist" next to Ramesh Kumar. Verify the status updates to `SHORTLISTED` and Ramesh's phone number "📞 +91 9876543210" is revealed inline.
- [ ] **Worker Check Status Update**: Log out. Log in as `worker_test@bluecollar.in`. Go to `/worker/applications`. Verify the application status has updated to `SHORTLISTED`.

### Phase 4: Closure & Security
- [ ] **Employer Mark as Filled**: Log out. Log in as `employer_test@bluecollar.in`. Go to the job details page. Click the "Mark as Filled" button. In the confirmation dialog, click confirm. Verify the job status badge updates to `FILLED` and the "Mark as Filled" button is no longer active.
- [ ] **Worker Verify Closed Job**: Log out. Log in as `worker_test@bluecollar.in`. Go to `/worker/jobs`. Verify the job is no longer listed (filters only show `OPEN` jobs). Search for the job ID directly if possible, or verify that the Apply button in application tracking says "Filled" and is disabled.
- [ ] **Password Change**: Go to Settings (`/settings`). Change password from `password123` to `newsecure123`. Verify success. Log out and log back in with the new password.
- [ ] **Admin Verification**: Log in as `admin@bluecollar.in` (admin account seeded manually in DB). Go to `/admin`. Verify stats (shows 1 Worker, 1 Employer, 1 Job, 1 Application). Go to Jobs, delete the test job. Go to Users, delete `worker_test@bluecollar.in`. Verify both records are deleted and Cascades remove associated profiles/applications in the database.
- [ ] **Public Route Test**: Access `/` (Landing Page). Refresh page. Verify loading. Verify direct route access to `/settings` forces redirect to `/login` if unauthenticated.
