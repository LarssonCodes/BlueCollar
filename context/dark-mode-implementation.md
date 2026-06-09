# Dark Mode Color Token Implementation

This document details the color mappings and Tailwind integrations to transition the application to the **Profound Utility Dark** color palette in dark mode, while maintaining the Material Design 3 light mode theme in light mode.

---

## Architecture

To support seamless toggling between light and dark mode for all color components (including primary actions, semantic errors, and container elevations), all core color tokens are defined as CSS custom properties (variables) in `index.css` under the `:root` and `.dark` scopes. Tailwind's configuration maps these variables directly.

```
                  ┌──────────────┐
                  │  index.css   │
                  └──────┬───────┘
                         │ (Defines CSS variables)
                         ▼
        ┌──────────────────────────────────┐
        │  :root (Light Mode values)        │
        │  .dark (Profound Utility values) │
        └────────────────┬─────────────────┘
                         │
                         ▼
             ┌────────────────────────┐
             │   tailwind.config.js   │
             └───────────┬────────────┘
                         │ (Maps color names to var(--color-...))
                         ▼
             ┌────────────────────────┐
             │    React Components    │
             └────────────────────────┘
```

---

## Color Token Mapping Table

The following table documents the hex values for both light mode (existing theme) and dark mode (**Profound Utility Dark**):

| Color Token | Variable Name | Light Mode (Hex) | Dark Mode (Hex) | Usage |
| :--- | :--- | :---: | :---: | :--- |
| **background** | `--color-background` | `#F7F9FB` | `#0B1326` | Background of the page |
| **surface** | `--color-surface` | `#F7F9FB` | `#0B1326` | Standard surface container background |
| **surface-bright** | `--color-surface-bright` | `#F7F9FB` | `#31394D` | Table row hover, bright highlighted surface |
| **surface-container-lowest** | `--color-surface-container-lowest` | `#FFFFFF` | `#060E20` | Base content cards, modals |
| **surface-container-low** | `--color-surface-container-low` | `#F2F4F6` | `#131B2E` | Secondary backgrounds, tables, hover fills |
| **surface-container** | `--color-surface-container` | `#ECEEF0` | `#171F33` | Nav panels, input borders |
| **surface-container-high** | `--color-surface-container-high` | `#E6E8EA` | `#222A3D` | Hover selectors |
| **surface-container-highest**| `--color-surface-container-highest`| `#E0E3E5` | `#2D3449` | Badges, chips, indicators |
| **surface-dim** | `--color-surface-dim` | `#D8DADC` | `#0B1326` | Muted or disabled surface elements |
| **surface-variant** | `--color-surface-variant` | `#E0E3E5` | `#2D3449` | Alt cards / outline styling |
| **on-background** | `--color-on-background` | `#191C1E` | `#DAE2FD` | Primary text on backgrounds |
| **on-surface** | `--color-on-surface` | `#191C1E` | `#DAE2FD` | Primary text inside containers |
| **on-surface-variant** | `--color-on-surface-variant` | `#434655` | `#C2C6D6` | Captions, placeholders, metadata |
| **inverse-surface** | `--color-inverse-surface` | `#2D3133` | `#DAE2FD` | High-contrast overlays |
| **inverse-on-surface** | `--color-inverse-on-surface` | `#EFF1F3` | `#283044` | Text inside high-contrast overlays |
| **outline** | `--color-outline` | `#737686` | `#8C909F` | Strong border outlines |
| **outline-variant** | `--color-outline-variant` | `#C3C6D7` | `#424754` | Subtle container lines |
| **primary** | `--color-primary` | `#004AC6` | `#ADC6FF` | Brand identity color |
| **on-primary** | `--color-on-primary` | `#FFFFFF` | `#002E6A` | Text on primary button |
| **primary-container** | `--color-primary-container` | `#2563EB` | `#4D8EFF` | Call-to-action button color |
| **on-primary-container** | `--color-on-primary-container` | `#EEEFFF` | `#00285D` | Text on CTAs |
| **inverse-primary** | `--color-inverse-primary` | `#B4C5FF` | `#005AC2` | Accent buttons |
| **surface-tint** | `--color-surface-tint` | `#0053DB` | `#ADC6FF` | Focus rings / primary hovers |
| **secondary** | `--color-secondary` | `#A73A00` | `#B9C8DE` | Accent elements |
| **on-secondary** | `--color-on-secondary` | `#FFFFFF` | `#233143` | Text on accent elements |
| **secondary-container** | `--color-secondary-container` | `#FD651E` | `#39485A` | Accent container highlights |
| **on-secondary-container** | `--color-on-secondary-container` | `#571A00` | `#A7B6CC` | Text on secondary highlights |
| **tertiary** | `--color-tertiary` | `#4D556B` | `#FFB786` | Muted info colors |
| **on-tertiary** | `--color-on-tertiary` | `#FFFFFF` | `#502400` | Text on info colors |
| **tertiary-container** | `--color-tertiary-container` | `#656D84` | `#DF7412` | Muted container blocks |
| **on-tertiary-container** | `--color-on-tertiary-container` | `#EEF0FF` | `#461F00` | Text on info containers |
| **error** | `--color-error` | `#BA1A1A` | `#FFB4AB` | Semantic error color |
| **on-error** | `--color-on-error` | `#FFFFFF` | `#690005` | Text on error backgrounds |
| **error-container** | `--color-error-container` | `#FFDAD6` | `#93000A` | Error boxes background |
| **on-error-container** | `--color-on-error-container` | `#93000A` | `#FFDAD6` | Text on error boxes |
| **primary-fixed** | `--color-primary-fixed` | `#DBE1FF` | `#D8E2FF` | Persistent light primary fills |
| **primary-fixed-dim** | `--color-primary-fixed-dim` | `#B4C5FF` | `#ADC6FF` | Persistent dim primary fills |
| **on-primary-fixed** | `--color-on-primary-fixed` | `#00174B` | `#001A42` | Text on light primary fills |
| **on-primary-fixed-variant**| `--color-on-primary-fixed-variant`| `#003EA8` | `#004395` | Muted text on primary fills |
| **secondary-fixed** | `--color-secondary-fixed` | `#FFDBCE` | `#D4E4FA` | Persistent light secondary fills |
| **secondary-fixed-dim** | `--color-secondary-fixed-dim` | `#FFB599` | `#B9C8DE` | Persistent dim secondary fills |
| **on-secondary-fixed** | `--color-on-secondary-fixed` | `#370E00` | `#0D1C2D` | Text on light secondary fills |
| **on-secondary-fixed-variant**| `--color-on-secondary-fixed-variant`| `#7F2B00` | `#39485A` | Muted text on secondary fills |
| **tertiary-fixed** | `--color-tertiary-fixed` | `#DAE2FD` | `#FFDCC6` | Persistent light tertiary fills |
| **tertiary-fixed-dim** | `--color-tertiary-fixed-dim` | `#BEC6E0` | `#FFB786` | Persistent dim tertiary fills |
| **on-tertiary-fixed** | `--color-on-tertiary-fixed` | `#131B2E` | `#311400` | Text on light tertiary fills |
| **on-tertiary-fixed-variant**| `--color-on-tertiary-fixed-variant`| `#3F465C` | `#723600` | Muted text on tertiary fills |
