---
version: alpha
name: Leo
description: >-
  Brave's cross-platform design system. This file captures the universal/web
  token set in its light theme. Dark theme, platform overrides (iOS, Android,
  desktop browser chrome) and product palettes (search, news, marketing, web3,
  newtab) are mirrored versions of the same semantic structure and live in
  tokens/css/variables-*.css.
colors:
  primary: "#434fcf"
  primary-container: "#dfe4f6"
  on-primary: "#ffffff"
  secondary: "#414379"
  secondary-container: "#d7dbff"
  tertiary: "#6c355b"
  tertiary-container: "#f8d2ea"
  error: "#9e0009"
  error-container: "#fbddd8"
  info: "#0154cc"
  info-container: "#e9f3ff"
  success: "#1c713d"
  success-container: "#e8f6ec"
  warning: "#745c00"
  warning-container: "#fcf2d4"
  surface: "#fafafb"
  surface-container: "#f2f2f3"
  surface-container-high: "#e8e8eb"
  on-surface: "#1c1c1d"
  on-surface-variant: "#464649"
  page-background: "#fafafb"
  container-background: "#ffffff"
  container-highlight: "#f2f2f3"
  container-interactive: "#eef2ff"
  text-primary: "#1c1c1d"
  text-secondary: "#464649"
  text-tertiary: "#78787c"
  text-interactive: "#434fcf"
  text-disabled: "#21272a80"
  icon-default: "#464649"
  icon-interactive: "#434fcf"
  icon-disabled: "#46464980"
  divider-subtle: "#e4e4e5"
  divider-strong: "#c9c9ca"
  divider-interactive: "#bcc6f3"
  button-background: "#434fcf"
  button-disabled: "#46464933"
  white: "#ffffff"
  black: "#000000"
typography:
  display-lg:
    fontFamily: system-ui
    fontSize: 46px
    fontWeight: 600
    lineHeight: 54px
    letterSpacing: -0.5px
  display-md:
    fontFamily: system-ui
    fontSize: 40px
    fontWeight: 600
    lineHeight: 48px
    letterSpacing: -0.5px
  display-sm:
    fontFamily: system-ui
    fontSize: 34px
    fontWeight: 600
    lineHeight: 40px
    letterSpacing: -0.5px
  h1:
    fontFamily: system-ui
    fontSize: 28px
    fontWeight: 600
    lineHeight: 34px
    letterSpacing: -0.5px
  h2:
    fontFamily: system-ui
    fontSize: 22px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: -0.5px
  h3:
    fontFamily: system-ui
    fontSize: 20px
    fontWeight: 600
    lineHeight: 26px
    letterSpacing: -0.5px
  h4:
    fontFamily: system-ui
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: -0.23px
  body-lg:
    fontFamily: system-ui
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: -0.23px
  body-md:
    fontFamily: system-ui
    fontSize: 14px
    fontWeight: 400
    lineHeight: 22px
    letterSpacing: -0.23px
  body-sm:
    fontFamily: system-ui
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: -0.08px
  body-xs:
    fontFamily: system-ui
    fontSize: 11px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: -0.08px
  label:
    fontFamily: system-ui
    fontSize: 12px
    fontWeight: 400
    lineHeight: 12px
    letterSpacing: -0.08px
  button-jumbo:
    fontFamily: system-ui
    fontSize: 18px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: -0.4px
  button-lg:
    fontFamily: system-ui
    fontSize: 16px
    fontWeight: 600
    lineHeight: 22px
    letterSpacing: -0.4px
  button-md:
    fontFamily: system-ui
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: -0.4px
  button-sm:
    fontFamily: system-ui
    fontSize: 12px
    fontWeight: 600
    lineHeight: 18px
    letterSpacing: -0.4px
  mono-md:
    fontFamily: SF Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 16.8px
    letterSpacing: 0px
spacing:
  none: 0px
  xs: 2px
  s: 4px
  m: 8px
  l: 12px
  xl: 16px
  2xl: 24px
  3xl: 32px
  4xl: 40px
  5xl: 48px
  6xl: 64px
rounded:
  xs: 2px
  s: 4px
  m: 8px
  l: 12px
  xl: 16px
  xxl: 24px
  full: 1000px
components:
  button-filled:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    height: 44px
    padding: 12px
  button-filled-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  button-filled-disabled:
    backgroundColor: "{colors.button-disabled}"
    textColor: "{colors.text-disabled}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text-interactive}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    height: 44px
    padding: 12px
  button-plain:
    backgroundColor: "transparent"
    textColor: "{colors.text-interactive}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 12px
  button-hero:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    height: 44px
    padding: 12px
  input-default:
    backgroundColor: "{colors.container-background}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.m}"
    padding: 8px
    height: 36px
  input-focus:
    backgroundColor: "{colors.container-background}"
    textColor: "{colors.text-primary}"
  input-error:
    backgroundColor: "{colors.container-background}"
    textColor: "{colors.text-primary}"
  alert-info:
    backgroundColor: "{colors.info-container}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.m}"
    padding: 16px
  alert-success:
    backgroundColor: "{colors.success-container}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.m}"
    padding: 16px
  alert-warning:
    backgroundColor: "{colors.warning-container}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.m}"
    padding: 16px
  alert-error:
    backgroundColor: "{colors.error-container}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.m}"
    padding: 16px
  dialog:
    backgroundColor: "{colors.container-background}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.xl}"
    padding: 24px
  tooltip:
    backgroundColor: "{colors.on-surface}"
    textColor: "{colors.surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.s}"
    padding: 8px
  chip:
    backgroundColor: "{colors.container-highlight}"
    textColor: "{colors.text-primary}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.full}"
    padding: 4px
---

# Leo

Leo is Brave's cross-platform design system. It powers the Brave Browser
across desktop and mobile, the new tab and search experiences, brave.com
marketing, and the broader privacy-product portfolio. The system is delivered
as Svelte components compiled to Web Components and React wrappers, plus a
full set of design tokens exported to CSS, Tailwind, Skia, Java, and Swift.

## Overview

Leo's voice is **calm, technical, and trustworthy**. It is the visual identity
of a privacy-first browser, so the system favors clarity and restraint over
ornamentation. The default surface is a warm-tinted off-white; type is set in
the platform's system font stack so Leo feels native on every operating
system; and the brand expresses itself through a single, focused accent —
Brave Blurple — supported by a vivid rorange "Hero" gradient reserved for the
single most important action on a screen.

The system is built around two non-negotiable principles:

- **Theme-aware by default.** Every semantic color exists as a light/dark
  pair. Components and pages must opt into a theme via the closest
  `data-theme="dark|light"` ancestor (or the user's
  `prefers-color-scheme`). Hex values are reserved for primitive scales;
  surfaces, text, icons, and borders are always semantic tokens.
- **Pill-first, soft-cornered.** Buttons default to a fully rounded pill
  shape; cards, inputs, and dialogs use moderate radii (8–16px). Sharp
  corners are reserved for primitives and dense data UI.

This `design.md` documents the universal/web tokens in their light-theme
resolution. Platform-specific tokens (iOS, Android, desktop browser chrome)
and product overrides (search, news, marketing, web3, newtab) reuse the same
semantic names and roles — only the underlying primitive mapping changes.

## Colors

The palette is anchored on a deep neutral surface, a single dominant accent
("Brave Blurple"), and a feedback set tuned for accessibility on both
themes.

- **Primary — Brave Blurple (`#434fcf`).** The signature accent. Used for
  primary actions, links, focus rings, selected states, and the
  `--leo-color-button-background`. Pair with `on-primary` (`#ffffff`) for
  filled surfaces and with `primary-container` (`#dfe4f6`) for tonal/quiet
  applications.
- **Secondary — Slate Blurple (`#414379`).** A muted, lower-contrast
  companion to primary. Used for supporting accents, decorative chrome,
  and second-tier emphasis. Rarely a CTA.
- **Tertiary — Plum Pink (`#6c355b`).** Used sparingly for visited links,
  highlight states, and editorial accents. Appears in `text-interactive-visited`.
- **Neutral — Warm Greys.** The neutral ramp drives every surface, divider,
  and most icons. `page-background` (`#fafafb`) is the default canvas;
  cards and dialogs sit on `container-background` (`#ffffff`); raised
  containers step through `surface-container` (`#f2f2f3`) and
  `surface-container-high` (`#e8e8eb`).
- **System feedback.** A four-color status set: `info` (blue, `#0154cc`),
  `success` (green, `#1c713d`), `warning` (amber, `#745c00`), and `error`
  (red, `#9e0009`). Each ships with a tonal `*-container` companion for
  alert backgrounds.
- **Hero gradient.** A reserved rorange-to-red linear gradient
  (`#ff5601 → #ff1f01`) used exclusively by the `hero` button kind for the
  single most prominent CTA on a screen.

Light/dark theming is wired through the
`@media (prefers-color-scheme)` rules in
[tokens/css/variables.css](tokens/css/variables.css), and can be locally
overridden by a `data-theme="dark"` or `data-theme="light"` attribute on any
ancestor element. Components consume the semantic tokens — never the
primitive scale directly — so theming "just works".

## Typography

Leo uses the **system font stack**
(`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`)
for all text. There is no brand font. This keeps interfaces feeling native
and avoids a web-font payload — important for a browser shipping its own
chrome. Monospace data, inline code, and technical metadata use **SF Mono**.

The strategy is intentionally constrained:

- **Two weights only.** `400` (regular) and `600` (semibold). Headlines and
  buttons are always semibold; body text is regular; semibold body
  variants exist for inline emphasis.
- **Tight headline tracking.** All display and heading sizes use
  `letter-spacing: -0.5px` to compensate for the looseness of system
  fonts at large sizes. Body text uses a softer `-0.23px`; small/x-small
  use `-0.08px`.
- **Three display sizes** (46/40/34) for marketing and onboarding,
  **four heading sizes** (h1 28 → h4 16) for in-app hierarchy, and
  **four body sizes** (16/14/12/11) for content density.
- **Buttons have their own scale** that is one weight heavier than the
  body equivalent, ensuring tap targets remain readable in compact UI.

Body default is `body-md` (14/22). Long-form reading on marketing or
documentation surfaces should step up to `body-lg` (16/24).

## Layout

Leo follows a **4px base spacing scale with an 8px rhythm**. The scale is
exposed both as named steps (`xs`–`9xl`) and as Tailwind utility classes.

- Micro spacing (icon gaps, inline padding): `xs` (2px), `s` (4px), `m` (8px).
- Component padding and gaps: `l` (12px), `xl` (16px), `2xl` (24px).
- Section rhythm: `3xl` (32px), `4xl` (40px), `5xl` (48px).
- Page-level margins and hero spacing: `6xl` (64px), `7xl` (80px),
  `8xl` (96px), `9xl` (160px).

Component-level conventions observed across the codebase:

- **Buttons.** Vertical padding scales with size (`s`/`m`/`l`/`xl`); icon
  gap is one step smaller than padding-x. Min-heights are
  28 / 36 / 44 / 52 / 60 px for `tiny` / `small` / `medium` / `large` / `jumbo`.
- **Dialogs.** Default padding is `2xl` (24px) on all sides; gap between
  header, body, and actions is `xl` (16px).
- **Alerts.** `xl` (16px) padding, `xl` gap between icon, content, and
  actions.
- **Inputs.** `m` (8px) internal padding, `l` (12px) gap between label and
  field.

There is no fixed grid. Page-level layouts are fluid and rely on the spacing
scale plus container queries; nothing in the system assumes a 12-column
grid.

## Elevation & Depth

Leo conveys depth through **tonal layering first, shadows second**.

The default page sits on `surface` (`#fafafb`); raised content steps onto
`container-background` (`#ffffff`), then `surface-container` (`#f2f2f3`),
then `surface-container-high` (`#e8e8eb`) for the most prominent surfaces.
This tonal approach renders correctly in dark mode without inverting
shadow color.

When a shadow *is* required (popovers, menus, dialogs, raised cards), the
system provides five elevation effects, each composed of two layered
shadows for natural-looking softness:

- **`elevation-01`** — buttons on hover, subtle lift.
- **`elevation-02`** — cards, list items.
- **`elevation-03`** — popovers, dropdowns.
- **`elevation-04`** — modals, dialogs.
- **`elevation-05`** — full-screen overlays, app-level surfaces.

Light-theme shadows use 4–8% black; dark-theme shadows use 33% black plus
a 1px white inset highlight to read against dark surfaces. Focus rings are
a separate effect (`focus-state` / `focus-state-offset`) and use the
primary color, not a shadow.

## Shapes

Leo's shape language is **soft, with a strong preference for full pills on
interactive elements**. The radius scale is:

- `xs` (2px), `s` (4px) — primitive UI: checkboxes, badges, dense lists.
- `m` (8px) — inputs, alerts, small cards.
- `l` (12px) — list groups, cards, popovers.
- `xl` (16px) — dialogs, modals, prominent cards.
- `xxl` (24px) — marketing surfaces and hero panels.
- `full` (1000px) — buttons (all kinds), pills, chips, FABs, avatars.

Buttons default to `rounded.full`. Fully rounded shapes signal
interactivity; rectangular radii signal containment. Mixing the two on a
single component (e.g. a pill button inside a sharp-cornered container)
is intentional and welcome.

Platform-specific radii exist for native chrome (e.g.
`radius-browserwindow-macos26: 22px`,
`radius-android-dialog: 28px`, `radius-ios-modals: 38px`) and should be
preferred over the generic scale when implementing OS-level surfaces.

## Components

Leo ships ~25 component atoms in [src/components/](src/components/), each
authored in Svelte and compiled to both Web Components and React wrappers.
The most important atoms:

- **Button** ([button.svelte](src/components/button/button.svelte)). Five
  kinds × five sizes, plus a `fab` modifier for circular icon buttons.
  - **Kinds:** `filled` (default CTA, primary background),
    `outline` (border + transparent fill), `plain` (text-only with
    tonal hover), `plain-faint` (lowest-emphasis, inherits color), and
    `hero` (gradient fill, reserved for one CTA per screen).
  - **Sizes:** `tiny` (28px) / `small` (36px) / `medium` (44px) /
    `large` (52px) / `jumbo` (60px). `medium` is the default.
  - **States:** rest, hover (lift + tonal shift), active (75% opacity),
    focus-visible (focus ring), disabled, loading (replaces content
    with `<ProgressRing>`).
- **Input / Textarea** ([input.svelte](src/components/input/input.svelte)).
  Wraps the native element in a `FormItem` shell that owns the label,
  helper text, error state, and required indicator. Three modes: default,
  focus (primary border + focus ring), error (`error` border + helper
  text). `size` accepts `normal` and `small`.
- **Alert** ([alert.svelte](src/components/alert/alert.svelte)). Five
  types: `info`, `success`, `warning`, `error`, `notice`. Each pairs a
  default icon with a tonal background from the matching
  `*-container` token. Variants: `isToast` (dismissible floating),
  `isInlineActions` (actions on the same row), `hideIcon`, and a `small`
  size for dense surfaces.
- **Dialog** ([dialog.svelte](src/components/dialog/dialog.svelte)). Built
  on the native `<dialog>` element. Animated entry (60ms scale from 0.8),
  modal scrim, optional close (`×`) and back (`←`) controls in a
  `plain-faint` FAB. Slots for `title`, `subtitle`, default body, and
  `actions`.
- **Tooltip, Menu, ButtonMenu, Dropdown.** All anchored via Floating UI
  ([floating/](src/components/floating/)). Tooltip uses the inverse
  surface (dark bubble on light theme, light on dark) at `body-sm`.
- **Checkbox, Radio, Toggle.** Standard form atoms with checked,
  unchecked, indeterminate (checkbox only), and disabled states.
- **SegmentedControl, Tabs.** Horizontal selection with a single-active
  rule. SegmentedControl uses a pill background with a sliding
  indicator; Tabs use an underline.
- **Progress (Ring + Bar), Navigation, Collapse, Link, Hr, Label,
  FormItem.** Supporting atoms; see [src/components/](src/components/)
  for the full inventory.

All components consume the semantic tokens above. Any component can be
re-skinned at the call site by overriding the relevant
`--leo-*` CSS variable on a wrapping element — no theme-fork required.

## Do's and Don'ts

- **Do** use `text-primary` / `text-secondary` / `text-tertiary` for the
  three levels of textual hierarchy. Never reach for a primitive
  `--leo-color-primitive-neutral-*` value for body text.
- **Do** use the `hero` button kind for at most one CTA per surface.
  Pair it with a `plain` or `outline` secondary action.
- **Do** use semantic feedback tokens (`error`, `success`, `info`,
  `warning`) for status messaging. Never use primary blurple to signal
  "good" or red to signal "destructive primary action".
- **Do** rely on theme-aware tokens. Place `data-theme="dark"` on the
  nearest ancestor when you need to lock a region to a specific theme;
  never duplicate components for light/dark.
- **Do** prefer `rounded.full` for buttons and chips, `rounded.m`/`l`
  for inputs and cards, and `rounded.xl` for dialogs.
- **Don't** mix two non-system fonts on the same surface. Body and UI
  share the system stack; SF Mono is reserved for code, hashes, and
  technical metadata.
- **Don't** use heavy drop shadows to indicate hierarchy when a tonal
  `surface-container-*` step would suffice. Reach for `elevation-*`
  only when the surface genuinely floats (popover, dialog, toast).
- **Don't** use the rorange Hero gradient anywhere outside the `hero`
  button. It's a brand-level moment, not a decorative pattern.
- **Don't** introduce new spacing values outside the 4px scale. If a
  layout needs an unusual gap, it's almost always solvable by combining
  two scale steps.
- **Don't** hardcode hex colors in component code. If a needed semantic
  token is missing, add it to the token source
  ([src/tokens/](src/tokens/)) rather than inlining a primitive.
- **Do** maintain WCAG AA contrast (4.5:1 for body text, 3:1 for large
  text and non-text UI). `text-primary` on `page-background` and
  `on-primary` on `primary` both clear AA in both themes.
