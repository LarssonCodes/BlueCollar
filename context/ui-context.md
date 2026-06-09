# UI Context — BlueCollar Job Portal

> **Source**: Extracted from Stitch-generated mockups in `stitch_bluecollar_skilled_job_portal/`. All tokens, patterns, and conventions below match the actual rendered screens. Use these as the authoritative reference when building components.

---

## Application

BlueCollar is a job portal that connects skilled workers (electricians, plumbers, welders, drivers, mechanics, construction workers, etc.) with employers looking to hire for gigs and contract-based work in India.

---

## Aesthetic

| Attribute | Value |
|---|---|
| Theme | Light (class `light` on `<html>`) |
| Tone | Professional, trustworthy, modern SaaS |
| Usability | Mobile-first, practical, easy to use |
| Personality | Friendly but not playful |
| Layout | Clear hierarchy, accessible, card-based |
| Inspiration | LinkedIn, Indeed, Material Design 3 |
| Emphasis | Readability, job discovery, clear status communication |

---

## Color System

The color system follows **Material Design 3** naming conventions. All tokens below are used as Tailwind custom color classes (e.g. `bg-primary`, `text-on-surface-variant`).

### Core Surface Colors

| Token | Hex | Usage |
|---|---|---|
| `background` | `#F7F9FB` | Main page background (`bg-background`) |
| `surface` | `#F7F9FB` | Top-level surfaces (nav, header) |
| `surface-bright` | `#F7F9FB` | Hover background on table rows |
| `surface-container-lowest` | `#FFFFFF` | Cards, modals, panels — primary card color |
| `surface-container-low` | `#F2F4F6` | Table header rows, secondary hover states |
| `surface-container` | `#ECEEF0` | Secondary panel backgrounds |
| `surface-container-high` | `#E6E8EA` | Sidebar nav hover states |
| `surface-container-highest` | `#E0E3E5` | Badge backgrounds, pills |
| `surface-dim` | `#D8DADC` | Dimmed or disabled surfaces |
| `surface-variant` | `#E0E3E5` | Alternative surface |

### Primary Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#004AC6` | Brand color — logo, active nav icons, strong emphasis |
| `primary-container` | `#2563EB` | Primary buttons, CTA backgrounds, progress bars, action icons |
| `on-primary` | `#FFFFFF` | Text/icons on `primary-container` buttons |
| `on-primary-container` | `#EEEFFF` | Text on dark primary container |
| `on-primary-fixed-variant` | `#003EA8` | Icon color on `tertiary-fixed` icon backgrounds |
| `primary-fixed` | `#DBE1FF` | Light primary tint |
| `primary-fixed-dim` | `#B4C5FF` | Dimmed primary fixed |
| `inverse-primary` | `#B4C5FF` | Primary on dark surfaces |
| `surface-tint` | `#0053DB` | Primary button hover state |

### Secondary / Orange Accent Colors

| Token | Hex | Usage |
|---|---|---|
| `secondary` | `#A73A00` | Deep orange text |
| `secondary-container` | `#FD651E` | Orange highlight — stat numbers, urgent badges |
| `on-secondary` | `#FFFFFF` | Text on secondary |
| `secondary-fixed` | `#FFDBCE` | Light orange tint |
| `secondary-fixed-dim` | `#FFB599` | Dimmed orange |
| `on-secondary-fixed-variant` | `#7F2B00` | Text on light orange |
| `on-secondary-container` | `#571A00` | Text on secondary container |
| `on-secondary-fixed` | `#370E00` | Dark text on orange fixed |

### Tertiary / Blue-Grey Colors

| Token | Hex | Usage |
|---|---|---|
| `tertiary` | `#4D556B` | Tertiary UI elements |
| `tertiary-container` | `#656D84` | Tertiary icon backgrounds |
| `on-tertiary` | `#FFFFFF` | Text on tertiary |
| `tertiary-fixed` | `#DAE2FD` | Light blue icon chip backgrounds (e.g. location icon chip) |
| `tertiary-fixed-dim` | `#BEC6E0` | Dimmed tertiary fixed |
| `on-tertiary-fixed` | `#131B2E` | Text on tertiary fixed |
| `on-tertiary-fixed-variant` | `#3F465C` | Secondary text on tertiary fixed |
| `on-tertiary-container` | `#EEF0FF` | Text on tertiary container |

### Text & Icon Colors

| Token | Hex | Usage |
|---|---|---|
| `on-background` | `#191C1E` | Primary text on background |
| `on-surface` | `#191C1E` | Primary text on surface — headings, table cells |
| `on-surface-variant` | `#434655` | Supporting text — labels, metadata, descriptions |
| `inverse-on-surface` | `#EFF1F3` | Text on dark inverse surfaces |
| `inverse-surface` | `#2D3133` | Dark inverse surface (e.g. dark tooltips) |

### Border & Divider Colors

| Token | Hex | Usage |
|---|---|---|
| `outline` | `#737686` | Strong borders |
| `outline-variant` | `#C3C6D7` | Subtle borders — cards, dividers, table rows |

> **In code**: Card borders consistently use `border-outline-variant` or `border-[#E2E8F0]`. Table row dividers use `border-[#F1F5F9]`.

### Semantic Status Colors

| Token | Hex | Usage |
|---|---|---|
| `error` | `#BA1A1A` | Error state icon color |
| `error-container` | `#FFDAD6` | Error icon chip background |
| `on-error-container` | `#93000A` | Text on error container |
| `on-error` | `#FFFFFF` | Text on error |

### Additional Status Colors (used inline)

| Color | Hex | Usage |
|---|---|---|
| Applied badge bg | `#EFF6FF` | Light blue badge background |
| Applied badge text | `#2563EB` | Blue badge text |
| Interviewing badge bg | `#FFF7ED` | Light orange badge background |
| Interviewing badge text | `#EA580C` | Orange badge text |
| Shortlisted icon | `#EA580C` | Bookmark icon color |
| Shortlisted icon bg | `#FFF7ED` | Bookmark icon chip background |
| Rejected icon | `#BA1A1A` | Cancel icon color (uses `text-error`) |
| Rejected icon bg | `#FFDAD6` | Cancel icon chip background (uses `bg-error-container`) |
| Active opps icon | `#059669` | Trending up icon color |
| Active opps icon bg | `#D1FAE5` | Trending up icon chip background |
| Urgent badge bg | `#FFF7ED` | Urgent tag background |
| Urgent badge text | `#EA580C` | Urgent tag text |
| New badge bg | `#EFF6FF` | New tag background |
| New badge text | `#2563EB` | New tag text |

---

## Typography

**Font**: Inter (Google Fonts, weights 400 / 500 / 600 / 700)
**Icon font**: Material Symbols Outlined

### Type Scale

| Token | Size | Line Height | Letter Spacing | Weight | Usage |
|---|---|---|---|---|---|
| `headline-xl` | 48px | 56px | -0.02em | 700 | Hero headings, large stat numbers |
| `headline-lg` | 32px | 40px | -0.02em | 700 | Page titles (desktop) |
| `headline-lg-mobile` | 24px | 32px | — | 700 | Page titles (mobile) |
| `headline-md` | 24px | 32px | — | 600 | Section headings, card titles |
| `headline-sm` | 20px | 28px | — | 600 | Card headings, panel headings |
| `body-lg` | 18px | 28px | — | 400 | Hero body text |
| `body-md` | 16px | 24px | — | 400 | Default body text |
| `body-sm` | 14px | 20px | — | 400 | Secondary body, table cells |
| `label-md` | 14px | 16px | 0.01em | 600 | Nav items, button labels, column headers |
| `label-sm` | 12px | 16px | — | 500 | Badges, captions, footer text |

> **Usage convention**: Always pair `font-{token}` and `text-{token}` classes together (e.g. `font-label-md text-label-md`).

---

## Spacing System

| Token | Value | Usage |
|---|---|---|
| `base` | 4px | Base spacing unit |
| `stack-sm` | 8px | Tight vertical spacing between related elements |
| `stack-md` | 16px | Standard internal card padding, gaps between items |
| `stack-lg` | 32px | Section spacing, header margin |
| `gutter` | 24px | Grid column gap |
| `margin-mobile` | 16px | Page horizontal padding on mobile |
| `margin-desktop` | 40px | Page horizontal padding on desktop |
| `container-max` | 1280px | Maximum content width (`max-w-container-max mx-auto`) |

---

## Border Radius Scale

| Token | Value | Usage |
|---|---|---|
| `DEFAULT` | 4px (0.25rem) | Base radius |
| `lg` | 8px (0.5rem) | Small cards, icon chips |
| `xl` | 12px (0.75rem) | Metric cards, inner panels |
| `saas` | 12px | Buttons, nav items (landing page specific) |
| `full` | 9999px | Pills, avatar images, progress bars, stat dividers |

> **In code**: Metric cards use `rounded-xl`. Sidebar nav items use `rounded-lg`. Buttons on the landing page use `rounded-saas`. All avatars use `rounded-full`.

---

## Shadow System

| Class | Value | Usage |
|---|---|---|
| `shadow-level-1` | `0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.02)` | Cards (default state) |
| `shadow-level-2` | `0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.03)` | Cards (hover state), elevated panels |

> **In Tailwind**: Metric cards use `shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)]` inline. Landing page uses `.shadow-level-1` / `.shadow-level-2` CSS classes.

---

## Icons

**Library**: Material Symbols Outlined (Google Fonts)

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
```

**Usage**:
```html
<span class="material-symbols-outlined">icon_name</span>
```

**Fill variant** (solid icon):
```css
.material-symbols-outlined.fill {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
```

### Icon Reference by Screen

| Icon name | Screen | Context |
|---|---|---|
| `work` | Landing | Hero badge |
| `location_on` | Landing | Find Local Jobs feature card |
| `handshake` | Landing | Hire Skilled Workers feature card |
| `bolt` | Landing | Fast Hiring feature card |
| `search` | Landing, Sidebar | Find Jobs CTA, Browse Jobs nav |
| `add_circle` | Landing | Post a Job CTA |
| `menu` | All | Mobile hamburger |
| `build_circle` | Sidebar | Brand logo icon in sidebar |
| `dashboard` | Sidebar | Dashboard nav item |
| `assignment_turned_in` | Sidebar | My Applications nav |
| `person` | Sidebar | Profile nav |
| `logout` | Sidebar | Logout nav |
| `send` | Worker Dashboard | Applications Sent metric icon |
| `bookmark` | Worker Dashboard | Shortlisted metric icon |
| `cancel` | Worker Dashboard | Rejected metric icon |
| `trending_up` | Worker Dashboard | Active Opportunities metric icon |
| `visibility` | Worker Dashboard | View application action |
| `payments` | Worker Dashboard | Pay rate in job card |
| `auto_awesome` | Worker Dashboard | Recommended jobs section |

---

## Layout Patterns

### Page Layout (Authenticated — Dashboard)

```
┌────────────────────────────────────────────┐
│  Sidebar (fixed, w-64, hidden on mobile)  │
│  ┌──────────────────────────────────────┐  │
│  │ Logo + Brand name                    │  │
│  │ User avatar + name                   │  │
│  │ Nav items (Dashboard, Jobs, Profile) │  │
│  │ [spacer]                             │  │
│  │ Logout                               │  │
│  └──────────────────────────────────────┘  │
├────────────────────────────────────────────┤
│  Main Content (ml-64 on md+)              │
│  ┌──────────────────────────────────────┐  │
│  │ Page header (title + mobile toggle)  │  │
│  │ 12-col grid layout                   │  │
│  │  Left col (lg:col-span-8)            │  │
│  │    Metric cards (2-col / 4-col)      │  │
│  │    Data table                        │  │
│  │  Right col (lg:col-span-4)           │  │
│  │    Profile completion card           │  │
│  │    Recommended jobs card             │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

### Page Layout (Public — Landing)

```
┌───────────────────────────────────┐
│  TopNavBar (sticky, h-16)        │
│  Logo | Nav links | CTA buttons   │
├───────────────────────────────────┤
│  Hero Section (centered)          │
│  Badge pill + H1 + body + CTAs    │
├───────────────────────────────────┤
│  Feature Section (bg-surface-bright) │
│  3-col Bento Grid (12-col base)   │
├───────────────────────────────────┤
│  Stats Section (bg-background)    │
│  White panel with 3 stats         │
├───────────────────────────────────┤
│  Footer                           │
└───────────────────────────────────┘
```

### Grid System

| Breakpoint | Columns | Gap |
|---|---|---|
| Mobile (`< 768px`) | 4 columns | 16px |
| Desktop (`≥ 768px`) | 12 columns | 24px |

---

## Component Patterns

### Cards

All cards share this base pattern:
```
bg-surface-container-lowest
rounded-xl
shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_1px_2px_rgba(0,0,0,0.02)]
border border-[#E2E8F0]
```
Hover state adds `shadow-level-2` or `hover:shadow-[0_10px_15px...]`.

### Metric Cards (Dashboard)

```html
<div class="bg-surface-container-lowest p-stack-md rounded-xl shadow-[...] border border-[#E2E8F0] flex flex-col gap-2">
  <div class="flex justify-between items-start">
    <span class="font-label-md text-label-md text-on-surface-variant">Label</span>
    <span class="material-symbols-outlined text-{color} text-xl p-1 bg-{color-bg} rounded-md">icon</span>
  </div>
  <span class="font-headline-lg text-headline-lg text-on-surface font-bold">42</span>
</div>
```

### Sidebar Nav Item (Active)

```html
<a class="flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container rounded-lg translate-x-1 transition-transform">
  <span class="material-symbols-outlined">dashboard</span>
  <span class="font-label-md text-label-md">Dashboard</span>
</a>
```

### Sidebar Nav Item (Inactive)

```html
<a class="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all">
  <span class="material-symbols-outlined">search</span>
  <span class="font-label-md text-label-md">Browse Jobs</span>
</a>
```

### Status Badges

| Status | Background | Text color | Example class |
|---|---|---|---|
| Applied | `#EFF6FF` | `#2563EB` | `bg-[#EFF6FF] text-[#2563EB]` |
| Shortlisted / Interviewing | `#FFF7ED` | `#EA580C` | `bg-[#FFF7ED] text-[#EA580C]` |
| Rejected | `#FFDAD6` | `#BA1A1A` | `bg-error-container text-error` |
| Open (job) | `#EFF6FF` | `#2563EB` | Same as Applied |
| Urgent | `#FFF7ED` | `#EA580C` | Same as Interviewing |
| New | `#EFF6FF` | `#2563EB` | Same as Applied |

Badge base: `inline-flex items-center px-2 py-1 rounded font-label-sm text-label-sm`

### Primary Button (CTA)

```html
<button class="font-label-md text-label-md bg-primary-container text-on-primary rounded-saas px-6 py-2.5 hover:bg-surface-tint transition-colors shadow-level-1 hover:shadow-level-2 active:scale-[0.98]">
  Sign Up
</button>
```

### Secondary / Ghost Button

```html
<button class="font-label-md text-label-md bg-transparent border border-outline-variant text-on-surface rounded-saas px-8 py-3.5 hover:bg-surface-container-low transition-all">
  Post a Job
</button>
```

### Icon Chip (Metric card icons)

```html
<span class="material-symbols-outlined text-{color} text-xl p-1 bg-{bg-color} rounded-md">icon</span>
```

### Feature Card Icon (Landing)

```html
<div class="w-12 h-12 rounded-lg bg-tertiary-fixed text-on-primary-fixed-variant flex items-center justify-center mb-6">
  <span class="material-symbols-outlined fill text-2xl">location_on</span>
</div>
```

### Table Pattern

```
<table class="w-full text-left border-collapse">
  <thead>
    <tr class="bg-surface-container-low border-b border-[#F1F5F9]">
      <th class="p-4 font-label-md text-label-md text-on-surface-variant font-medium">Column</th>
    </tr>
  </thead>
  <tbody class="font-body-sm text-body-sm text-on-surface">
    <tr class="border-b border-[#F1F5F9] hover:bg-surface-bright transition-colors">
      <td class="p-4">...</td>
    </tr>
  </tbody>
</table>
```

---

## Tailwind Config (Exact)

Use this config as the source of truth for all token values:

```js
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "tertiary-fixed": "#dae2fd",
        "surface-container-highest": "#e0e3e5",
        "error": "#ba1a1a",
        "on-primary-fixed-variant": "#003ea8",
        "on-error-container": "#93000a",
        "on-secondary-container": "#571a00",
        "surface-container-lowest": "#ffffff",
        "outline-variant": "#c3c6d7",
        "surface-bright": "#f7f9fb",
        "secondary-fixed-dim": "#ffb599",
        "on-error": "#ffffff",
        "on-secondary": "#ffffff",
        "secondary-container": "#fd651e",
        "on-primary": "#ffffff",
        "outline": "#737686",
        "secondary": "#a73a00",
        "inverse-on-surface": "#eff1f3",
        "secondary-fixed": "#ffdbce",
        "surface-container-high": "#e6e8ea",
        "inverse-surface": "#2d3133",
        "primary-container": "#2563eb",
        "surface": "#f7f9fb",
        "primary-fixed-dim": "#b4c5ff",
        "error-container": "#ffdad6",
        "on-tertiary-fixed-variant": "#3f465c",
        "primary": "#004ac6",
        "tertiary-container": "#656d84",
        "surface-container": "#eceef0",
        "primary-fixed": "#dbe1ff",
        "on-surface": "#191c1e",
        "tertiary": "#4d556b",
        "on-tertiary": "#ffffff",
        "on-surface-variant": "#434655",
        "surface-container-low": "#f2f4f6",
        "background": "#f7f9fb",
        "on-background": "#191c1e",
        "on-secondary-fixed-variant": "#7f2b00",
        "on-tertiary-container": "#eef0ff",
        "on-primary-fixed": "#00174b",
        "on-secondary-fixed": "#370e00",
        "surface-tint": "#0053db",
        "tertiary-fixed-dim": "#bec6e0",
        "on-primary-container": "#eeefff",
        "inverse-primary": "#b4c5ff",
        "on-tertiary-fixed": "#131b2e",
        "surface-variant": "#e0e3e5",
        "surface-dim": "#d8dadc"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px",
        "saas": "12px"
      },
      spacing: {
        "stack-sm": "8px",
        "stack-md": "16px",
        "container-max": "1280px",
        "stack-lg": "32px",
        "base": "4px",
        "gutter": "24px",
        "margin-desktop": "40px",
        "margin-mobile": "16px"
      },
      fontFamily: {
        "headline-xl": ["Inter"],
        "body-lg": ["Inter"],
        "headline-lg": ["Inter"],
        "headline-lg-mobile": ["Inter"],
        "headline-md": ["Inter"],
        "body-md": ["Inter"],
        "headline-sm": ["Inter"],
        "label-md": ["Inter"],
        "body-sm": ["Inter"],
        "label-sm": ["Inter"]
      },
      fontSize: {
        "headline-xl": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "label-md": ["14px", { lineHeight: "16px", letterSpacing: "0.01em", fontWeight: "600" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }]
      }
    }
  }
}
```

---

## Design Principles

| # | Principle |
|---|---|
| 1 | Job search is the primary focus of the homepage |
| 2 | Large, easy-to-tap buttons for mobile users (minimum `py-2.5` on buttons) |
| 3 | Use cards for jobs, profiles, applications, and metrics |
| 4 | Prioritize readability over visual effects — no heavy gradients or animations |
| 5 | Keep forms simple and short |
| 6 | Use color to communicate status: Applied = blue, Shortlisted/Urgent = orange, Rejected = red, Success = green |
| 7 | Workers must be able to find and apply for a job in under 2 minutes |
| 8 | Employers must be able to post a job in under 5 minutes |
| 9 | Always pair `font-{token}` and `text-{token}` together — never use one without the other |
| 10 | Never use hardcoded hex values — use Tailwind token classes. Exception: status badge colors and specific border colors (`border-[#E2E8F0]`, `border-[#F1F5F9]`) that are not in the token system |
