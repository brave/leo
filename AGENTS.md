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
  primary: '#434fcf'
  primary-container: '#dfe4f6'
  on-primary: '#ffffff'
  secondary: '#414379'
  secondary-container: '#d7dbff'
  tertiary: '#6c355b'
  tertiary-container: '#f8d2ea'
  error: '#9e0009'
  error-container: '#fbddd8'
  info: '#0154cc'
  info-container: '#e9f3ff'
  success: '#1c713d'
  success-container: '#e8f6ec'
  warning: '#745c00'
  warning-container: '#fcf2d4'
  surface: '#fafafb'
  surface-container: '#f2f2f3'
  surface-container-high: '#e8e8eb'
  on-surface: '#1c1c1d'
  on-surface-variant: '#464649'
  page-background: '#fafafb'
  container-background: '#ffffff'
  container-highlight: '#f2f2f3'
  container-interactive: '#eef2ff'
  text-primary: '#1c1c1d'
  text-secondary: '#464649'
  text-tertiary: '#78787c'
  text-interactive: '#434fcf'
  text-disabled: '#21272a80'
  icon-default: '#464649'
  icon-interactive: '#434fcf'
  icon-disabled: '#46464980'
  divider-subtle: '#e4e4e5'
  divider-strong: '#c9c9ca'
  divider-interactive: '#bcc6f3'
  button-background: '#434fcf'
  button-disabled: '#46464933'
  white: '#ffffff'
  black: '#000000'
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
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    typography: '{typography.button-md}'
    rounded: '{rounded.full}'
    height: 44px
    padding: 12px
  button-filled-hover:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
  button-filled-disabled:
    backgroundColor: '{colors.button-disabled}'
    textColor: '{colors.text-disabled}'
  button-outline:
    backgroundColor: 'transparent'
    textColor: '{colors.text-interactive}'
    typography: '{typography.button-md}'
    rounded: '{rounded.full}'
    height: 44px
    padding: 12px
  button-plain:
    backgroundColor: 'transparent'
    textColor: '{colors.text-interactive}'
    typography: '{typography.button-md}'
    rounded: '{rounded.full}'
    padding: 12px
  button-hero:
    backgroundColor: 'transparent'
    textColor: '{colors.white}'
    typography: '{typography.button-md}'
    rounded: '{rounded.full}'
    height: 44px
    padding: 12px
  input-default:
    backgroundColor: '{colors.container-background}'
    textColor: '{colors.text-primary}'
    typography: '{typography.body-md}'
    rounded: '{rounded.m}'
    padding: 8px
    height: 36px
  input-focus:
    backgroundColor: '{colors.container-background}'
    textColor: '{colors.text-primary}'
  input-error:
    backgroundColor: '{colors.container-background}'
    textColor: '{colors.text-primary}'
  alert-info:
    backgroundColor: '{colors.info-container}'
    textColor: '{colors.text-primary}'
    rounded: '{rounded.m}'
    padding: 16px
  alert-success:
    backgroundColor: '{colors.success-container}'
    textColor: '{colors.text-primary}'
    rounded: '{rounded.m}'
    padding: 16px
  alert-warning:
    backgroundColor: '{colors.warning-container}'
    textColor: '{colors.text-primary}'
    rounded: '{rounded.m}'
    padding: 16px
  alert-error:
    backgroundColor: '{colors.error-container}'
    textColor: '{colors.text-primary}'
    rounded: '{rounded.m}'
    padding: 16px
  dialog:
    backgroundColor: '{colors.container-background}'
    textColor: '{colors.text-primary}'
    typography: '{typography.body-md}'
    rounded: '{rounded.xl}'
    padding: 24px
  tooltip:
    backgroundColor: '{colors.on-surface}'
    textColor: '{colors.surface}'
    typography: '{typography.body-sm}'
    rounded: '{rounded.s}'
    padding: 8px
  chip:
    backgroundColor: '{colors.container-highlight}'
    textColor: '{colors.text-primary}'
    typography: '{typography.button-sm}'
    rounded: '{rounded.full}'
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

This `AGENTS.md` documents the universal/web tokens in their light-theme
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

When a shadow _is_ required (popovers, menus, dialogs, raised cards), the
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

---

The sections below are **agent-operational** guidance. They describe how to
work in this repository: where source lives, which commands to run, and the
conventions Leo's component and token authoring follow. Everything below
is grounded in existing files; nothing here introduces new conventions.

## Repository Map

```text
leo/
  src/                    # source — edit these
    components/           # ~25 Svelte component atoms (one folder per atom)
    tokens/               # *.tokens.json + *.variables.json (Style Dictionary inputs)
    scripts/              # build / icon / token tooling
    storyHelpers/         # shared Storybook utilities
    svelteDirectives/     # internal Svelte runtime helpers
    postcss/, types/      # build internals
  icons/                  # ~2200 raw SVGs, synced from Figma
  tests/                  # jest specs (theme + generated-types smoketests)
  examples/               # consumer integration examples
    example-ui-react/     # React + Vite consumer (built in CI)
    plain-html/           # web-component consumer
  .storybook/             # Storybook 8 (Svelte + Vite)
  .github/workflows/      # CI: build, deploy, audit-deps, sf-symbols, update-icons, cleanup, socket-fix
  spec.md                 # AGENTS.md format spec (governs the YAML + sections above)
  AGENTS.md               # this file
```

**Generated — never hand-edit.** The following live in [.gitignore](.gitignore)
and are produced by `npm run build`:

```text
/build/                   # rolled-up bundle
/react/                   # React wrappers (consumed as @brave/leo/react/<name>)
/web-components/          # Web Component wrappers
/shared/                  # shared internals used by both wrappers
/tokens/css/              # CSS variables (variables.css + per-product variants)
/tokens/tailwind/         # Tailwind plugin + config
/tokens/json/             # Style Dictionary json output
/tokens/ios-swift/        # Swift token sources
/tokens/android/          # Android resources
/tokens/skia/             # Skia C++ headers
/icons-sf/, /icons-skia/  # platform icon variants
/types/                   # generated .d.ts files
/storybook-static/        # built Storybook
```

Governance: [CODEOWNERS](CODEOWNERS), [SECURITY.md](SECURITY.md),
[.github/renovate.json](.github/renovate.json).

## Dev Environment

- **Node** `24.11.1` (CI-pinned in [build.yml](.github/workflows/build.yml)).
- **Package manager: npm.** Lockfile is `package-lock.json`. CI uses
  `npm ci --ignore-scripts` to install — postinstall scripts are deliberately
  skipped except for esbuild's, which is run explicitly. Do not switch to
  pnpm/yarn.
- **First-time setup:**

  ```bash
  npm install
  npm run build
  ```

  `npm install` triggers `prepare` which runs `npm run build`, so the build
  output is ready immediately.

- **Local Storybook preview:** `npm run storybook` (`:6006`).
- **Component watch mode:** `npm run dev` (rollup `--watch`). Rebuilds the
  React + Web Component wrappers on every Svelte change.

## Build / Test / Check Commands

All commands live in [package.json](package.json) `scripts`. The CI sequence
in [build.yml](.github/workflows/build.yml) is:

```text
format-diff → build → audit-tokens → test → diff-tokens → check
            → example-ui-react build → build-storybook
```

| Command                                          | Purpose                                                                                                                                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run build`                                  | Full build: `transform-tokens` → `skiafy-icons` → `android-icons` → `rollup -c`.                                                                                                      |
| `npm run dev`                                    | Rollup watch for component editing.                                                                                                                                                   |
| `npm run test`                                   | Jest, scoped to `tests/` (`--coverage=false`).                                                                                                                                        |
| `npm run check`                                  | `svelte-check` + `node ./src/scripts/audit-events.js`. The two a11y warnings `a11y-click-events-have-key-events` and `a11y-no-static-element-interactions` are intentionally ignored. |
| `npm run format` / `npm run format-diff`         | Prettier; CI fails if `format-diff` reports changes.                                                                                                                                  |
| `npm run transform-tokens`                       | Regenerate every file under `tokens/` from `src/tokens/*.tokens.json`.                                                                                                                |
| `npm run update-icons`                           | Pull SVGs from Figma into `icons/` (auth required; usually run by [.github/workflows/update-icons.yml](.github/workflows/update-icons.yml)).                                          |
| `npm run skiafy-icons` / `npm run android-icons` | Convert raw SVGs to Skia and Android Vector Drawable formats.                                                                                                                         |
| `node ./src/scripts/audit-tokens.js`             | Fail-fast check that every `--leo-*` token referenced in [src/](src/) is defined in [tokens/css/](tokens/css/). Runs in CI.                                                           |
| `node scripts/audit_deps.js`                     | Dependency audit.                                                                                                                                                                     |
| `npm run build-storybook`                        | Static Storybook export, deployed by [.github/workflows/deploy.yml](.github/workflows/deploy.yml).                                                                                    |

The package also exposes a `leo-check` bin pointing at
[src/scripts/audit-tokens.js](src/scripts/audit-tokens.js), so consumers
can validate their own usage of Leo tokens.

## Adding a New Component

Recipe distilled from [src/components/README.md](src/components/README.md):

1. Create `src/components/<name>/<name>.svelte`. Use Svelte 4 syntax,
   `<script lang="ts">`, and SCSS in `<style lang="scss">`.
2. Add `src/components/<name>/<name>.stories.svelte` (Storybook CSF +
   `@storybook/addon-svelte-csf`).
3. Optionally add `src/components/<name>/props.ts` exporting variant props
   as `as const` arrays plus their derived types — see
   [src/components/button/props.ts](src/components/button/props.ts) for the
   canonical pattern.
4. Run `npm run build`. The wrappers are generated at `react/<name>.js`
   and `web-components/<name>.js`. Component file names must be **unique
   across all folders** because rollup flattens output (so consumers can
   `import Button from '@brave/leo/react/button'`, not
   `…/button/button`).
5. If shipping new public props, add an assertion in
   [tests/gen-types.test.ts](tests/gen-types.test.ts) so the generated
   `.d.ts` continues to expose them.

**Three consumption formats** to keep in mind when writing components:

- **Svelte (internal):**
  `import X from 'src/components/x/x.svelte'`.
- **Web Components (consumer):**
  `import 'web-components/x.js'` then `<leo-x>`. Caveats:
  only `string` / `boolean` / `number` props reflect to attributes;
  events do not bubble up; changing slotted content remounts the component
  (Svelte 4 limitation).
- **React (consumer):**
  `import X from '@brave/leo/react/x'`. Props prefixed `on*` are converted
  to event handlers; intrinsic props (`className`, `id`, `hidden`) pass
  through to the underlying custom element; `ref` is supported and points
  at the underlying web component.

## Adding / Updating Tokens

- **Source files** (edit these): `src/tokens/*.tokens.json` and
  `src/tokens/*.variables.json`. Per [README.md](README.md), these are
  authored via the
  [Design Tokens Figma plugin](https://github.com/lukasoppermann/design-tokens)
  and transformed with
  [Amazon Style Dictionary](https://amzn.github.io/style-dictionary/).
- **Generated files** (never edit): everything under `tokens/css/`,
  `tokens/tailwind/`, `tokens/json/`, `tokens/ios-swift/`, `tokens/android/`,
  `tokens/skia/`. They are recreated every time `npm run transform-tokens`
  runs.
- The token system is **layered by product**: `universal` is the base;
  `browser`, `ios`, `android`, `marketing`, `news`, `newtab`, `search`,
  `web3`, and `ai` extend or override universal. Each product produces its
  own `variables-<product>.css` and Tailwind config under `tokens/`.
- Workflow:

  ```bash
  # edit src/tokens/<product>.tokens.json
  npm run transform-tokens
  node ./src/scripts/audit-tokens.js   # confirms src/ still references defined tokens
  ```

- If a semantic token you need does not exist, add it to the token JSON
  rather than inlining a primitive in a component.

## Adding / Updating Icons

- Raw SVGs live in [icons/](icons/) (~2200 files). Don't hand-author them
  in PRs — they are synced from Figma by
  [.github/workflows/update-icons.yml](.github/workflows/update-icons.yml)
  via `npm run update-icons`.
- After raw SVGs land, `npm run skiafy-icons` (Skia C++) and
  `npm run android-icons` (Android Vector Drawables) regenerate platform
  copies in `icons-skia/` and the Android bucket. Both run as part of
  `npm run build`.
- Use icons in components via
  [src/components/icon/icon.svelte](src/components/icon/icon.svelte):

  ```svelte
  <Icon name="info-filled" />
  ```

  `name` is typed as `IconName` from `@brave/leo/icons/meta`, so editor
  autocomplete and type-checking enumerate every available icon.

- Consumers point at the icon directory once via `setIconBasePath('/icons')`
  (default is `/icons`); SVGs are fetched lazily, with optional
  `preloadIcon(name)` for above-the-fold use.

## Theming Runtime

Three layers, evaluated outermost-first:

1. **Closest `data-theme` ancestor.** A `data-theme="dark"` or
   `data-theme="light"` attribute on any ancestor element locks that
   subtree to a theme.
2. **`@media (prefers-color-scheme)`** on `:root`. Used when no
   `data-theme` is in scope. Both rule sets are emitted by
   [tokens/css/variables.css](tokens/css/variables.css).
3. **Programmatic Material-style override.**
   [src/components/applyTheme.ts](src/components/applyTheme.ts) (exported
   as `@brave/leo/shared/applyTheme`) takes a single hex color and
   regenerates the entire `--leo-color-primitive-*` palette via
   `@material/material-color-utilities`, adopting an in-memory
   stylesheet. Use it for runtime brand-color customization (e.g.
   per-tenant theming); not needed for the standard light/dark switch.

Components must consume `--leo-color-*` semantic tokens. Reaching for a
`--leo-color-primitive-*` value bypasses the theming layer and will look
wrong in dark mode.

## Component Authoring Conventions

Patterns observed across [src/components/](src/components/):

- **Variant props** are typed via `as const` arrays + `(typeof X)[number]`.
  Canonical example,
  [src/components/button/props.ts](src/components/button/props.ts):

  ```ts
  export const buttonKinds = [
    'hero',
    'filled',
    'outline',
    'plain',
    'plain-faint'
  ] as const
  export type ButtonKind = (typeof buttonKinds)[number]
  ```

  Common variant prop names: `kind`, `size`, `mode`, `type`.

- **State props** are booleans prefixed `is*`: `isOpen`, `isDisabled`,
  `isLoading`, `isToast`, `isInlineActions`, `isHero`.
- **Callback props** use `on*`: `onClick`, `onChange`, `onClose`, `onBack`,
  `onInput`. The React wrapper turns these into event handlers
  automatically; the Web Component does not bubble events, so consumers
  always rely on these handler props.
- **Slot conventions**: a default slot for content; named slots
  `icon-before` / `icon-after` for inline icons; `title`, `subtitle`,
  `actions` for composite atoms (alert, dialog).
- **Component-level CSS overrides.** Components expose call-site
  escape hatches as CSS variables prefixed with the component name —
  e.g. `--leo-button-color`, `--leo-button-padding`,
  `--leo-button-radius` (see
  [button.svelte](src/components/button/button.svelte) lines 117–145).
  When adding new components, follow the same convention so consumers can
  re-skin without forking.
- **Dark-theme overrides in component CSS** use `@theme (dark) { ... }`
  blocks (lines 352, 410 of
  [button.svelte](src/components/button/button.svelte)). This is processed
  by the project's PostCSS pipeline; it's not standard CSS.
- **A11y trade-off.** Two svelte-check rules are intentionally suppressed
  via the `--compiler-warnings` flag in
  [package.json](package.json)'s `check` script:
  `a11y-click-events-have-key-events` and
  `a11y-no-static-element-interactions`. Don't try to silence individual
  occurrences; the suppression is repo-wide on purpose.

## Storybook Conventions

From [.storybook/main.ts](.storybook/main.ts) and existing stories like
[src/components/button/button.stories.svelte](src/components/button/button.stories.svelte):

- Stories live next to components: `<component>.stories.svelte`. They
  are picked up via the globs `src/tokens/**/*.stories.svelte` and
  `src/components/**/*.stories.{svelte,js}`.
- Use `@storybook/addon-svelte-csf` — `<Story>` and `<Template>` blocks
  with a `meta` export naming the component.
- `argTypes` patterns:
  - Variant props → `control: 'select'` with `options:` from the
    `as const` array.
  - CSS-variable overrides → `control: 'color'` for colors,
    `control: 'text'` for dimensions.
  - Boolean state props → `control: 'boolean'`.
- Story helpers in [src/storyHelpers/](src/storyHelpers/) include
  `SlotInfo`, `Slot`, `ColorTokenSwatchGroup`, `FontTokenSwatchGroup`,
  `Copiable`, and `ConditionalSwatchGroup`.
- Stories double as documentation. Every new component should ship a
  `Slots` story documenting its slot API — see
  [button.stories.svelte](src/components/button/button.stories.svelte)
  for the canonical example.
- Storybook serves icons and the variables CSS as static dirs (mapped
  from `../icons` → `/icons` and `../tokens/css` → `/css`), so component
  stories can resolve assets without extra configuration.

## Code Style

From [.prettierrc](.prettierrc), [tsconfig.json](tsconfig.json), and
[.prettierignore](.prettierignore):

- **Prettier:** `trailingComma: none`, `tabWidth: 2`, `semi: false`,
  `singleQuote: true`, `bracketSameLine: false`,
  `quoteProps: preserve`. CI fails on `npm run format-diff` output.
- **TypeScript:** extends `@tsconfig/svelte`, with
  `strictNullChecks: false` and `noImplicitAny: false`. Lib is `ES2022`.
  The `@brave/leo/*` path alias is preserved so consumer-facing type
  imports work.
- **Styles:** SCSS inside `<style lang="scss">`. Use `var(--leo-*)`
  references — never inline hex. Use `@theme (dark) { ... }` for
  dark-only rules, never duplicate `@media (prefers-color-scheme: dark)`
  inside component styles.

## Testing

[tests/](tests/) is small and focused:

- [tests/gen-types.test.ts](tests/gen-types.test.ts) — smoketest that
  generated wrappers expose expected props. Update when adding or
  renaming public props on shipped components.
- `tests/theme.{light,dark,mixed}.test.js` (+ shared `theme.common.js`)
  — assert that semantic tokens resolve to expected primitives in each
  theme. Update when adding or renaming semantic color tokens.
- [tests/tokens.js.test.js](tests/tokens.js.test.js) — validates the JS
  tokens module shape.
- [tests/data/](tests/data/) — fixtures for the above.

Run with `npm run test`. Jest config is inline in
[package.json](package.json); coverage is off by default.

## PR & Commit Conventions

Observed in `git log` on `main`:

- **Title format**:
  - Component changes: `[<Component>]: <Description> (#<PR>)` — e.g.
    `[Menu]: Fix bug where menu wouldn't flip`,
    `[SegmentedControl]: Move focus state management into the segmented control item`.
  - Cross-cutting fixes use conventional prefixes:
    `fix(security): bump vite override to 6.4.2 to resolve GHSA-…`,
    `fix: use GitHub API for socket-fix PRs to produce verified commits`.
- **CODEOWNERS**: `@fallaciousreasoning @petemill @alanbreck` review
  everything except `package.json` / `package-lock.json` (deliberately
  excluded so renovate / dependabot can auto-merge).
- **Pre-merge gate**: full CI (see "Build / Test / Check Commands"
  above) must pass. Treat any red step as blocking.
- **Dep PRs**: handled by Renovate
  ([.github/renovate.json](.github/renovate.json)); supplemental
  security automation in
  [.github/workflows/audit-deps.yml](.github/workflows/audit-deps.yml).

## Security Notes

- [SECURITY.md](SECURITY.md) is the disclosure entry point.
- CI installs with `--ignore-scripts` ([build.yml](.github/workflows/build.yml)
  line 30); only esbuild's postinstall is whitelisted, run explicitly via
  `npm explore esbuild -- npm run postinstall`. Do not add packages that
  require additional postinstall scripts without security review (called
  out in the workflow comments).
- The `overrides` block in [package.json](package.json) pins `esbuild`,
  `glob`, `svgo`, `uuid`, and `vite` to versions that resolve known CVEs.
  Never relax these without security review.
- The custom `socket-fix` workflow ([socket-fix.yml](.github/workflows/socket-fix.yml))
  produces verified commits for security-bot PRs via the GitHub API
  rather than local commits — keep this path intact when editing
  security tooling.
