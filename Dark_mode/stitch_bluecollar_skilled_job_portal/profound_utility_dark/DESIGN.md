---
name: Profound Utility Dark
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#b9c8de'
  on-secondary: '#233143'
  secondary-container: '#39485a'
  on-secondary-container: '#a7b6cc'
  tertiary: '#ffb786'
  on-tertiary: '#502400'
  tertiary-container: '#df7412'
  on-tertiary-container: '#461f00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#d4e4fa'
  secondary-fixed-dim: '#b9c8de'
  on-secondary-fixed: '#0d1c2d'
  on-secondary-fixed-variant: '#39485a'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  code:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 24px
  container-max-width: 1280px
---

## Brand & Style

The design system is a high-performance, developer-centric interface optimized for deep-focus environments. It utilizes a **Corporate Modern** style with a heavy emphasis on **Minimalism** and precision. By leveraging a deep navy foundation, the system reduces eye strain while maintaining the authoritative, systematic feel of professional-grade tools.

The aesthetic is defined by high-density information layouts, rigid alignment, and purposeful use of color. Interactive elements are clearly distinguished through vibrant accents, while structural components recede into the background using subtle tonal shifts. The emotional response is one of calm, controlled efficiency and technical reliability.

## Colors

This color palette is engineered for high-contrast accessibility in low-light environments. The core utilizes a "Deep Navy" scale to provide more visual depth than pure black, reducing "smearing" on OLED screens and improving the legibility of fine lines.

- **Primary (#3B82F6):** Reserved for primary actions, active states, and critical paths. It provides a luminous contrast against the dark base.
- **Surface Tiers:** Use `container_lowest` for the main background of the application and `container` for elevated cards or sidebars to create a natural hierarchy of depth.
- **Typography:** Use `on_surface` for headers and primary body text. Use `on_surface_variant` for secondary metadata, labels, and placeholder text to ensure a clear visual hierarchy.

## Typography

The typography system relies exclusively on **Inter** to maintain a systematic, utilitarian aesthetic. Because text on dark backgrounds can appear "bolder" due to light bleed, font weights are carefully selected to maintain clarity.

- **Headlines:** Use a slightly tighter letter-spacing to give titles a more "locked-in" and professional appearance.
- **Body Text:** Standard body text uses `body-md` for maximum density without sacrificing readability.
- **Labels:** Use `label-md` in all-caps for section headers or small metadata to create visual distinction without adding weight.

## Layout & Spacing

The design system uses a **fluid grid** model based on a 4px baseline increment. This ensures all components scale mathematically and align perfectly in data-heavy views.

- **Desktop:** 12-column grid with 24px margins and 16px gutters.
- **Tablet:** 8-column grid with 24px margins and 16px gutters.
- **Mobile:** 4-column grid with 16px margins and 12px gutters.

Padding should be generous within containers to prevent the dark UI from feeling cramped. Use 16px or 24px internal padding for cards and modals to allow the content to breathe.

## Elevation & Depth

Elevation in this dark mode is expressed primarily through **Tonal Layers** rather than heavy shadows. In dark interfaces, shadows are often invisible; instead, we use lighter surface hex codes to represent "higher" elements.

- **Level 0 (Base):** `#020617` (Container Lowest) — used for the furthest background layer.
- **Level 1 (Card):** `#0F172A` (Container Low) — used for primary content containers.
- **Level 2 (Overlay):** `#1E293B` (Container) — used for modals, popovers, and floating menus.
- **Outlines:** Use a 1px solid border of `#1E293B` for low-contrast separation, or `#334155` for high-contrast separation. 

Shadows, if used for modals, should be large, soft, and pure black (`#000000`) with an opacity of 0.4 to create a subtle occlusion effect.

## Shapes

The design system maintains a **Rounded** (8px) corner radius across all standard UI components. This specific radius provides a balance between the rigid precision of a square corner and the approachability of a rounded one.

- **Standard (8px):** Buttons, Input Fields, Cards, and Chips.
- **Large (16px):** Modals and large Hero containers.
- **Small (4px):** Checkboxes, Tooltips, and Tags.

## Components

### Buttons
- **Primary:** Background `#3B82F6`, Text `#F8FAFC`. No border.
- **Secondary:** Background transparent, Border 1px `#1E293B`, Text `#F8FAFC`.
- **Tertiary/Ghost:** Text `#94A3B8`. Hover state should use a subtle `#1E293B` background tint.

### Input Fields
- **Default:** Background `#020617`, Border 1px `#1E293B`, Text `#F8FAFC`.
- **Focus:** Border 2px `#3B82F6`. Placeholder text uses `#475569`.

### Cards
- Use `Surface-Container-Low` for the background with an 8px radius. A subtle 1px border of `Surface-Container` is recommended to define the edge against the background.

### Chips & Tags
- **Informational:** Background `#1E293B`, Text `#94A3B8`, 4px radius.
- **Active:** Background `rgba(59, 130, 246, 0.1)`, Text `#3B82F6`.

### Lists
- Separate list items with a 1px border of `#1E293B`. Interactive list items should have a hover state of `#0F172A`.