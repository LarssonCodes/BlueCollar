# Progress Tracker — BlueCollar Job Portal

---

## Current Phase

**Phase 1 — Building Foundation & Redesigns: All 14 Units Complete**

All 14 build units and redesign specifications have been successfully completed, implemented, and verified on both frontend and backend. Additionally, a brand new **Help & Support Center** screen has been designed in Stitch and fully implemented in the React client with working interactive FAQs, search filtering, and a support request submission form.

---

## Current Goal

Maintenance, optimization, and final deployment support.

---

## Completed

### Documentation
- [x] `project-overview.md` — goals, user flows, features, scope, success criteria
- [x] `architecture.md` — system structure, boundaries, storage model, invariants
- [x] `ui-context.md` — color tokens, typography scale, border radius, shadows, design principles
- [x] `code-standards.md` — JavaScript, React, Express, Tailwind, API, data, and file organization rules
- [x] `ai-workflow-rules.md` — workflow rules, scoping rules, protected files, verification checklist
- [x] `implementation_plan.md` — data models, API design, frontend pages, 5-day build schedule
- [x] 14 Unit Spec files (`context/specs/`) — detailed goals, designs, implementation details, and verification steps for all 14 build units

### Implementation
- [x] Unit 01 — Project Scaffold + Database Schema
- [x] Unit 02 — Authentication + App Shell + Landing Page
- [x] Unit 03 — Worker Profile — API + UI
- [x] Unit 04 — Employer Profile — API + UI
- [x] Unit 05 — Job Posting — API + UI
- [x] Unit 06 — Job Search + Filtering + Job Detail — API + UI
- [x] Unit 07 — Job Applications + Application Tracking — API + UI
- [x] Unit 08 — Applicant Management + Shortlisting + Contact Reveal — API + UI
- [x] Unit 09 — Worker Dashboard — API + UI
- [x] Unit 10 — Employer Dashboard — API + UI
- [x] Unit 11 — Admin Panel — API + UI
- [x] Unit 12 — Account Settings — API + UI
- [x] Unit 13 — Responsive, Empty, and Error States — UI
- [x] Unit 14 — Deployment Configuration & Smoke Testing — Devops

---

## In Progress

None. All targets achieved.

---

## Next Up

### Day 1 — Foundation

- [x] 1. Initialize monorepo root with two folders: `client/` and `server/`
- [x] 2. Scaffold `client/` with Vite + React + Tailwind CSS
- [x] 3. Scaffold `server/` with Node.js + Express
- [x] 4. Install server dependencies: `express`, `prisma`, `@prisma/client`, `bcrypt`, `jsonwebtoken`, `zod`, `cors`, `dotenv`
- [x] 5. Install client dependencies: `react-router-dom`, `axios`
- [x] 6. Define `prisma/schema.prisma` with all five models: `User`, `WorkerProfile`, `EmployerProfile`, `Job`, `Application`
- [x] 7. Run `prisma migrate dev` and confirm all tables are created
- [x] 8. Implement `POST /api/auth/register` — create user with hashed password, return JWT
- [x] 9. Implement `POST /api/auth/login` — verify credentials, return JWT
- [x] 10. Implement `GET /api/auth/me` — return current user from token
- [x] 11. Implement `authGuard` and `roleGuard` middleware
- [x] 12. Build Register page (UI) — role selection, email, password
- [x] 13. Build Login page (UI)
- [x] 14. Wire `AuthContext` to store user and token client-side
- [x] 15. Implement protected route guard component in `src/routes/`

---

## Open Questions

| # | Question | Impact | Status |
|---|---|---|---|
| 1 | Pincode → City/State auto-lookup: use a static DB or call `postalpincode.in` API? | UX on profile and job post forms | ❓ Unresolved |
| 2 | Are there additional trade categories beyond the 6 listed (Electrician, Plumber, Driver, Welder, Mechanic, Construction)? | Fixed enum in DB schema — hard to change after launch | ❓ Unresolved |
| 3 | Deployment target confirmed: Vercel (frontend) + Render or Railway (backend) + Supabase or Railway (PostgreSQL)? | Affects `.env` structure and build config | ❓ Unresolved |

---

## Key Decisions Made

| Decision | Choice | Rationale |
|---|---|---|
| Launch strategy | Employers first | Seed jobs before workers |
| Primary employer type | Sole traders | Simple, fast-posting UX |
| Job types | Gigs + contracts only | No permanent roles in v1 |
| Auth method | Email + password, no confirmation | Maximum signup speed |
| Auth implementation | JWT, 7-day expiry | Stateless, simple |
| Password security | bcrypt, 12 rounds | Industry standard |
| Location system | Pincode-based | Familiar to Indian users |
| Communication model | Hybrid — contact revealed after shortlisting | Practical and safe |
| Monetization | Free at launch | Faster traction |
| Frontend | React + Vite + Tailwind CSS | Fast, mobile-responsive |
| Backend | Node.js + Express | Consistent JS stack |
| ORM | Prisma | Type-safe, great PostgreSQL support |
| Database | PostgreSQL | Relational data, future scalability |
| Validation | Zod on all request bodies | Catches bad input before DB |
| File storage | None in v1 — deferred to v2 | Keeps scope tight |
| Caching | None in v1 — deferred to v2 | Not needed at this scale |

---

## Architecture Decisions Log

| Date | Decision | Reason |
|---|---|---|
| Pre-build | No Prisma queries outside `server/services/` | Keeps DB access isolated and testable |
| Pre-build | Phone field stripped from all list endpoints | Privacy — only revealed after shortlisting |
| Pre-build | Password field excluded from all User responses | Security — never expose hashes |
| Pre-build | Middleware order fixed: authGuard → roleGuard → validate → controller | Prevents auth bypass |
| Pre-build | No file storage in v1 | Document upload is a v2 feature |
| Pre-build | No background tasks in v1 | No cron, no queues, no email triggers |

---

## Session Notes

- All 6 context files are in `l:\BlueCollar\context\` and ready to use.
- The `implementation_plan.md` is in `l:\BlueCollar\` (root).
- No code has been written yet. The project is at the scaffolding start line.
- Read `architecture.md` invariants before writing any service or middleware file.
- Read `ai-workflow-rules.md` verification checklist before marking any unit complete.
- The 5-day build schedule is in `implementation_plan.md` — use it to sequence work.