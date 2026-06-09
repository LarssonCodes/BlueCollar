# Unit 13: Error States + Empty States + Responsive Design — UI Spec

## Goal
Ensure the application handles all edge cases gracefully, including route page-not-found (404), API request failures, and offline network status. Conduct a responsive design audit so that every screen is fully functional and optimized for mobile screens (down to 375px width) and desktop layouts.

## Design & Interactions

### Global 404 Page (`/nonexistent`)
- Content: Centered layout. Large `search_off` Material icon (48px, `text-on-surface-variant`). Heading "Page Not Found" (`font-headline-md text-on-surface mt-4`). Subtitle "The page you are looking for does not exist or has been moved." (`font-body-md text-on-surface-variant mt-2 text-center`).
- Action: "Go to Dashboard" CTA button (`bg-primary-container text-on-primary rounded-saas px-6 py-2.5 mt-6`). Click redirects user to their role-based dashboard, or to the landing page if unauthenticated.

### Global API Error Display Component (`ApiErrorState`)
- Content: Centered block for page content. `error_outline` Material icon (32px, `text-error`). Heading "Something went wrong" (`font-headline-sm text-on-surface mt-2`). Text displaying the specific error message from the API.
- Action: "Try Again" button (`border border-outline-variant text-on-surface rounded-saas hover:bg-surface-container-low px-4 py-2 mt-4`). Clicking it triggers the network fetch again.

### Network Offline Banner (`OfflineBanner`)
- Trigger: Reacts to `window.addEventListener('offline')` and `navigator.onLine`.
- Design: Sticky top banner above the navbar. `bg-[#FFF7ED] text-[#EA580C] border-b border-[#EA580C] py-2 px-4 text-center font-label-md flex items-center justify-center gap-2`.
- Content: "wifi_off" Material icon + "You are offline. Please check your internet connection."

### Empty States (Standardized Design)
All empty lists must render a centered container with:
1. A descriptive Material icon (`48px`, `text-on-surface-variant/40`)
2. Heading (`font-headline-sm text-on-surface mt-4`)
3. Subtitle / explanation (`font-body-sm text-on-surface-variant mt-2`)
4. Optional action button (Primary style, `mt-4`)

#### Specific Views:
- **Browse Jobs (No search results)**:
  - Icon: `search_off`
  - Heading: "No jobs found"
  - Subtitle: "Try adjusting your trade filters or search pincode."
  - Action: "Clear Filters" button (resets URL queries to defaults).
- **My Applications (Worker)**:
  - Icon: `assignment_turned_in`
  - Heading: "No applications yet"
  - Subtitle: "Explore available opportunities and send your first application."
  - Action: "Browse Jobs" button (redirects to `/worker/jobs`).
- **My Jobs (Employer)**:
  - Icon: `work_off`
  - Heading: "No jobs posted yet"
  - Subtitle: "Post a short-term gig or contract job to find skilled workers."
  - Action: "Post a New Job" button (redirects to `/employer/jobs/new`).
- **Applicants List (Employer Job Detail)**:
  - Icon: `group`
  - Heading: "No applications received yet"
  - Subtitle: "Once workers apply to this job post, they will appear here."
  - Action: None.
- **Admin Tables (Users / Jobs)**:
  - Icon: `people` (Users) or `work` (Jobs)
  - Heading: "No records found"
  - Subtitle: "No users or jobs match the current page criteria."
  - Action: None.

---

### Responsive Design Audit Rules (375px Mobile)

#### 1. Navigation & App Shells
- **Public Header (TopNavBar)**: Center links (Find Jobs, Post Jobs, About) collapse on mobile. A hamburger menu icon (`menu`) appears on the right. Clicking it toggles a slide-down mobile nav menu (`bg-surface border-b border-outline-variant flex flex-col gap-4 p-4`).
- **Worker & Employer layouts**: Left sidebar is hidden (`md:flex hidden`). Instead, a persistent bottom navigation bar is shown at the bottom of the screen (`fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest border-t border-outline-variant flex justify-around items-center z-40 md:hidden`).
  - Bottom Nav Items (4 items): Icon + label below. Active item gets `text-primary-container` and slightly larger icon size.
  - Worker Bottom Nav: Dashboard (icon `dashboard`), Browse (`work`), Applications (`assignment`), Profile (`person`).
  - Employer Bottom Nav: Dashboard (icon `dashboard`), My Jobs (`work`), Post (`add_circle`), Profile (`person`).
- **Admin layout**: Sidebar collapses to top hamburger menu containing a slide-out drawer or full-width nav drop-down, or bottom nav.

#### 2. Table Component Scrollability
- All data tables (Recent Applications, My Applications, Admin Users, Admin Jobs) MUST be wrapped in an `overflow-x-auto` wrapper div:
  ```html
  <div class="w-full overflow-x-auto -mx-margin-mobile px-margin-mobile">
    <table class="w-full min-w-[600px] ...">...</table>
  </div>
  ```
  This prevents the page container from stretching or overflowing horizontally.

#### 3. Form Layouts
- Grid form layouts (like the profile location grid or dates grid) must stack vertically as single-column on mobile.
- Ex: `grid grid-cols-1 md:grid-cols-3` (automatically stacks on screens below 768px).

#### 4. Touch Targets
- All buttons, inputs, select fields, and interactive list items must have a minimum tap height of `44px` to comply with mobile accessibility standards (`min-h-[44px]`).

---

## Implementation

### Frontend Setup
- Create `client/src/components/ApiErrorState.jsx`
- Create `client/src/components/OfflineBanner.jsx`
- Update public `TopNavBar.jsx` with mobile drawer/hamburger state.
- Update `WorkerLayout.jsx` and `EmployerLayout.jsx` to render `<BottomNavBar />` on screen sizes below `md` breakpoint.
- Wrap all table components in `overflow-x-auto` utility classes.
- Ensure 404 Catch-all route exists in `client/src/routes/index.jsx`: `<Route path="*" element={<NotFoundPage />} />`.

---

## Verify when done

### Edge Cases
- [ ] Navigating to `/nonexistent-page` renders the 404 page with "Go to Dashboard" button.
- [ ] Setting browser to "Offline" in DevTools Network tab displays the orange offline warning banner at the top of the viewport.
- [ ] Setting browser back to "Online" hides the offline warning banner.
- [ ] Artificially triggering an API fail (e.g. server offline) renders the `ApiErrorState` component with a working "Try Again" button that re-fires the query.
- [ ] Clearing filters on the Job Search page resets trade selection, clears search pincode, and fetches all open jobs.

### Empty States
- [ ] Empty state renders on Browse Jobs when search matches nothing.
- [ ] Empty state renders on Worker My Applications when no applications exist.
- [ ] Empty state renders on Employer My Jobs when no jobs have been posted.
- [ ] Empty state renders on Employer Job Detail when a job has 0 applicants.

### Mobile Responsive Audits (at 375px screen width)
- [ ] Hamburger menu operates correctly on the public landing page.
- [ ] The left sidebar is hidden, and the bottom navigation bar is fixed at the bottom.
- [ ] Clicking icons in the bottom nav navigates to the correct routes.
- [ ] No horizontal scrollbars appear on the dashboard pages.
- [ ] Tables can be scrolled horizontally within their containers without breaking the layout.
- [ ] Form input fields are full-width and stacked vertically.
- [ ] All clickable elements (links, buttons, toggle checkboxes) have a touch height of at least 44px.
- [ ] Landing page Hero title text fits the viewport without clipping or line overlaps.
