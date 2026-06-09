---
name: Profound Utility
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#a73a00'
  on-secondary: '#ffffff'
  secondary-container: '#fd651e'
  on-secondary-container: '#571a00'
  tertiary: '#4d556b'
  on-tertiary: '#ffffff'
  tertiary-container: '#656d84'
  on-tertiary-container: '#eef0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#ffdbce'
  secondary-fixed-dim: '#ffb599'
  on-secondary-fixed: '#370e00'
  on-secondary-fixed-variant: '#7f2b00'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is engineered to bridge the gap between enterprise-grade reliability and high-utility job seeking. Targeting skilled professionals and recruiters, the UI must feel both industrial and polished. 

The aesthetic is **Corporate Modern**, drawing inspiration from high-end SaaS dashboards. It prioritizes clarity over decoration, using generous whitespace to reduce cognitive load in data-heavy environments. The emotional response should be one of "effortless efficiency"—the user should feel that the platform is a stable, professional tool for career advancement. 

Key visual principles:
- **Clarity of Intent:** Every element has a clear functional purpose.
- **Structural Integrity:** Alignment to a strict grid to evoke a sense of order.
- **Human-Centric SaaS:** While professional, the use of soft corners and vibrant accents keeps the interface approachable.

## Colors
The palette is rooted in a "Trust and Action" logic. 

- **Primary (#2563EB):** Used for navigation, primary branding, and "safe" actions. It establishes the professional baseline.
- **Secondary (#EA580C):** A high-visibility orange reserved exclusively for conversion points, "Apply Now" buttons, and urgent status notifications.
- **Tertiary (#0F172A):** A deep Slate used for text and heavy structural elements to provide grounding and high contrast.
- **Background (#F8FAFC):** A cool neutral that reduces glare and allows white cards to pop with subtle depth.

## Typography
Inter is utilized across all levels for its exceptional legibility and systematic feel. 

- **Headlines:** Use tight letter-spacing (-0.02em) for larger sizes to maintain a "tight" professional look.
- **Body Text:** Standard weight is 400. For instructional text on light backgrounds, ensure the color is no lighter than Slate-600 to maintain accessibility.
- **Labels:** Used for buttons, tags, and table headers. Always use Semi-Bold (600) for button labels to ensure clear hierarchy against body text.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for desktop (1280px max-width) to maintain a controlled, professional reading experience similar to LinkedIn.

- **Desktop:** 12-column grid with 24px gutters.
- **Tablet:** 8-column grid with 20px gutters.
- **Mobile:** 4-column grid with 16px gutters and 16px side margins.

A 4px base unit drives the spacing rhythm. All component padding and margins should be multiples of 4 (e.g., 8, 16, 24, 32, 48, 64). Use "Stack" spacing for vertical rhythm between elements in a card.

## Elevation & Depth
This design system uses **Tonal Layering** combined with **Ambient Shadows** to create a structured hierarchy.

- **Level 0 (Background):** #F8FAFC. No shadow.
- **Level 1 (Cards/Surfaces):** #FFFFFF. Shadow: `0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.02)`. This is the default state for job listings and profile sections.
- **Level 2 (Interactive/Hover):** #FFFFFF. Shadow: `0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.03)`. Used when a user hovers over a job card or when a modal is active.

Borders are kept minimal. Use a 1px border of #E2E8F0 only when elements are adjacent on a white surface and need structural separation.

## Shapes
The shape language is "Soft-Modern." 

- **Cards & Primary Containers:** 12px (rounded-lg) to provide a contemporary, friendly feel.
- **Buttons & Inputs:** 8px (standard) for a more precise, tool-like appearance.
- **Small Elements (Chips/Tags):** 4px or fully pill-shaped depending on the content length.

Avoid sharp 0px corners, as they appear too aggressive for a people-focused recruitment platform.

## Components
### Buttons
- **Primary:** Background #2563EB, Text #FFFFFF. Solid fill.
- **Action (CTA):** Background #EA580C, Text #FFFFFF. Used for "Apply," "Post Job," or "Submit."
- **Secondary:** Transparent background, Border #D1D5DB, Text #1E293B.

### Input Fields
- Background #FFFFFF, Border 1px #E2E8F0, 8px corner radius.
- Active state: Border #2563EB with a 2px soft blue focus ring.
- Placeholder text: #94A3B8.

### Cards
- White background, 12px rounded corners, Level 1 shadow. 
- Padding should be 24px for desktop and 16px for mobile.

### Chips/Badges
- For job categories: Light blue background (#EFF6FF), Blue text (#2563EB), 4px radius.
- For status (e.g., "Urgent"): Light orange background (#FFF7ED), Orange text (#EA580C).

### Lists
- Job lists should have a hover state that transitions from Level 1 to Level 2 elevation.
- Dividers between list items: 1px #F1F5F9.