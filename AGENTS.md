# Leo

Leo is Brave's cross-platform design system. It powers the Brave Browser
(desktop and mobile), the new tab and search experiences, brave.com
marketing, and the broader privacy-product portfolio.

Components are authored in Svelte and shipped to consumers as **React**, **Svelte** and
**Web Component** wrappers. Tokens are authored once and exported to CSS,
Tailwind, Skia (C++), Java/XML (Android), and Swift (iOS).

See [README.md](README.md) for consumer setup — wiring up `variables.css`,
the Tailwind plugin, and the `data-theme="dark|light"` theming rule.

> **Generated output, do not hand-edit.** `tokens/`, `react/`,
> `web-components/`, `shared/`, `build/`, `types/`, `icons-skia/`,
> `icons-sf/`, and `storybook-static/` are all produced by `npm run build`
> and listed in [.gitignore](.gitignore). Edit the sources under
> [src/](src/) (and [icons/](icons/) for raw SVGs) and rebuild.

## Nala

`nala` is the codename used for Leo on the native side of the stack. The
generated Skia/C++ token files live in the `nala::` namespace
(see [tokens/skia/](tokens/skia/) and the templates under
[src/tokens/transformation/skia/templates/](src/tokens/transformation/skia/templates/))
and per-PR Storybook previews are deployed to
`https://<pr-number>.pr-nala.s.brave.dev/` by
[.github/workflows/deploy.yml](.github/workflows/deploy.yml). For
everything in this repo, "Leo" and "nala" refer to the same design system.

## Tokens

Tokens are authored in [src/tokens/](src/tokens/) (`*.tokens.json` /
`*.variables.json`) and compiled to per-platform output by
`npm run transform-tokens` (also part of `npm run build`). The generated
files are the source of truth for what each platform actually consumes.

### CSS variables (web)

The full list of CSS variables — semantic and primitive, light and dark —
lives in [tokens/css/variables.css](tokens/css/variables.css) (the
universal/web base). Per-product files extend or override the universal
set:

- [tokens/css/variables-browser.css](tokens/css/variables-browser.css) —
  desktop browser chrome.
- [tokens/css/variables-ios.css](tokens/css/variables-ios.css) — iOS web
  surfaces.
- [tokens/css/variables-android.css](tokens/css/variables-android.css) —
  Android web surfaces.
- [tokens/css/variables-marketing.css](tokens/css/variables-marketing.css)
  — brave.com.
- [tokens/css/variables-search.css](tokens/css/variables-search.css) —
  search.brave.com.
- [tokens/css/variables-news.css](tokens/css/variables-news.css) — Brave
  News.
- [tokens/css/variables-newtab.css](tokens/css/variables-newtab.css) — new
  tab page.
- [tokens/css/variables-web3.css](tokens/css/variables-web3.css) — wallet
  / web3.

A Tailwind plugin and JS / TS exports are emitted alongside each CSS file
in [tokens/tailwind/](tokens/tailwind/) and as `variables*.js` /
`variables*.ts` in [tokens/css/](tokens/css/).

### Other platforms

- **Skia / C++** — [tokens/skia/](tokens/skia/) (the `nala::` color id
  enum, color mixer, and `radius.h` / `spacing.h` headers).
- **Android** — [tokens/android/](tokens/android/) (XML resources under
  `values/` and `values-night/`, plus icon drawables).
- **iOS / Swift** — [tokens/ios-swift/](tokens/ios-swift/)
  (`Colors.xcassets`, `ColorSetAccessors.swift`, `Gradients.swift`).
- **JSON** — [tokens/json/](tokens/json/) (Style Dictionary output for
  downstream tooling).

The Storybook deployed at the nala preview URL above also renders every
token group as live swatches, which is the easiest way to browse them
visually.

## Components

All component source lives in [src/components/](src/components/), one
folder per atom (button, input, alert, dialog, dropdown, menu, tooltip,
checkbox, radioButton, toggle, segmentedControl, tabs, progress, icon,
etc.). Each is authored in Svelte with stories alongside in
`<name>.stories.svelte`.

At build time (`npm run build`), every component is emitted in two
consumer formats:

- **React** — `react/<name>.js`, imported as `@brave/leo/react/<name>`.
- **Web Component** — `web-components/<name>.js`, imported as
  `@brave/leo/web-components/<name>` and used via `<leo-<name>>` tags.

See [src/components/README.md](src/components/README.md) for the
component authoring recipe and the React / Web Component caveats.

### Icons

Icons live in [icons/](icons/) (~2200 SVGs synced from Figma by
[.github/workflows/update-icons.yml](.github/workflows/update-icons.yml))
and are consumed via the typed
[`<Icon name="..." />`](src/components/icon/icon.svelte) component, with
autocomplete from `@brave/leo/icons/meta`.

### Storybook

Every component and token group has a `<name>.stories.svelte` file —
Storybook is the live visual reference for both. Run it locally via
`npm run storybook` (`:6006`), or browse the per-PR preview at the nala
URL above.

## Build / Dev

```bash
npm install        # also runs the build via the `prepare` script
npm run build      # transform-tokens → skiafy-icons → android-icons → rollup
npm run dev        # rollup --watch for iterating on a component
npm run storybook  # Storybook on :6006
npm run test       # jest
```

## Using Leo in a product

These rules are for agents building a Brave surface on top of Leo, in any
repository. Where a consuming repository has more specific guidelines,
follow them.

- **Semantic tokens first.** Use the token named for a role
  (`color-text-primary`, `color-container-background`,
  `color-divider-subtle`, `color-systemfeedback-error-icon`,
  `font-default-regular`). Use a primitive only when no semantic token
  describes the role, and record why next to the use.
- **One semantic layer per product.** A product names its roles once, in
  one file, and aliases each to a Leo token. Components read those roles,
  so a Leo upgrade or theme change is made in one place.
- **No raw values.** No hex colours, hand-written shadows or timing, and
  nothing off Leo's scales:
  - spacing: `spacing-xs` 2, `s` 4, `m` 8, `l` 12, `xl` 16, `2xl` 24,
    `3xl` 32, `4xl` 40, `5xl` 48, `6xl` 64, `7xl` 80, `8xl` 96, `9xl` 160
  - radius: `radius-2xs` 1, `xs` 2, `s` 4, `m` 8, `l` 12, `xl` 16,
    `xxl` 24, `full`
  - icon size: `icon-xs` 16, `s` 18, `m` 20, `l` 24, `xl` 32

  A 1px hairline border is the one allowed literal.
- **Light and dark come from Leo.** Use Leo's values and theme switching
  (`data-theme`, `values-night`, the asset catalog's appearances). Do not
  derive one theme from the other with opacity or filters.
- **Typography uses the role tokens** (`font-heading-h1` to `-h4`,
  `font-large-*`, `font-default-*`, `font-small-*`, `font-x-small-*`,
  `font-monospace-*`) rather than setting size, weight and line height
  separately.
- **Motion uses Leo's tokens.** Durations are `duration-xs` (50ms), `s`
  (100ms), `m` (200ms), `l` (300ms) and `xl` (500ms). Use `easing-out` for
  things that enter, `easing-in` for things that leave, `easing-in-out`
  for things that change in place, and `easing-linear` only for progress.
  `easing-in-out-back` overshoots and is for rare emphasis. Nothing
  routine is longer than `l`.
- **Icons come from Leo**, and the name must exist in the pinned Leo
  version (`@brave/leo/icons/meta`). Do not draw icons, copy SVGs from
  elsewhere, or add another icon set (Lucide, Material Symbols, Font
  Awesome, emoji as icons). If Leo has no icon for a concept, use the
  closest one, flag it in the change description, and request it in Leo.
  The exception is a system symbol a platform convention requires.
- **Components before composition.** Use a Leo component when one exists.
  When none fits, build from Leo tokens and icons, keep it with the other
  shared components, and propose it to Leo.
- **A component's decisions belong to the component.** Tokens are the
  values a component can use; the component decides its shape, sizes,
  padding, kinds and states. Every Leo button is a pill (`radius-full`),
  its height comes from `size` (`tiny` to `jumbo`), and its colours come
  from `kind` (`filled`, `outline`, `plain`, `plain-faint`, `hero`). Do not
  restyle a Leo component beyond the custom properties it exposes, and do
  not rebuild one from tokens with different choices. Using only real
  tokens does not make a lookalike correct.
- **Where a component cannot be imported** (a standalone prototype, a
  mock-up, a platform without the build), recreate it from its source in
  [src/components/](src/components/). Match its shape, sizes, kinds and
  states, and say in the change description that it is a copy and which
  Leo version it copies.
- **Copies name their source.** Where a platform cannot read Leo at build
  time, such as terminal colours, copy the value from
  [tokens/json/](tokens/json/) and name the token in a comment (for example
  `color-primitive-brands-rorange-1` for Brave orange).
- **Do not invent values.** If no token, role or component fits, use the
  nearest semantic role, say so in the change description, and raise the
  gap with Leo so the role can alias a real token later.
- **Pin and upgrade deliberately.** Leo is pinned to a version or commit
  in the consumer's manifest. An upgrade is its own change, checked in
  light and dark on every surface that uses it.

### Brand

- **Brave orange is for the brand mark, not the UI.** The accent for
  buttons, links, focus and selection is the interactive colour
  (`color-button-background`, `color-text-interactive`). Brave orange
  (`color-primitive-brands-rorange-*`) appears in the logo and where Leo's
  brand tokens assign it.
- **Logos come from Leo.** Use the Brave icon for the release channel
  (`brave-icon-release-color`, `brave-icon-beta-color`,
  `brave-icon-nightly-color`, `brave-icon-dev-color`), or
  `brave-icon-monochrome` where colour is not possible. Product marks are
  the `product-*` icons. Do not redraw, recolour, stretch, crop or add
  effects to a logo. The lion is a logo, not a generic icon.
- **Gradients are used for what they are named for:** `hero` for hero
  areas, `brave-release`, `brave-beta` and `brave-nightly` for
  release-channel identity, and `braveai` for AI identity, sparingly.
  Never put body text on a gradient, and never invent one.
- **Third-party marks** use Leo's `*-color` brand icons where one exists,
  unmodified.

## Changing Leo

These rules are for agents changing tokens, components or icons in this
repository.

- **Tokens.** Add or change tokens in the sources under
  [src/tokens/](src/tokens/), never in generated output. A new colour is a
  semantic role with both a light and a dark value, named for what it is
  for rather than how it looks. Check the change in every platform's
  output, not only CSS.
- **Icons** are synced from Figma by
  [.github/workflows/update-icons.yml](.github/workflows/update-icons.yml).
  Request a new icon through design rather than hand-adding an SVG to
  [icons/](icons/), and do not rename or remove an icon that consumers may
  use without flagging it as a breaking change.
- **Components use Leo's own tokens.** No raw colours, off-scale sizes, or
  hand-written shadows or timing inside a component.
- **Every state is designed.** Hover, pressed, focus, disabled, loading and
  error exist for every interactive component, with a story for each in
  `<name>.stories.svelte`. Nothing shifts layout when a label changes or
  content loads.
- **Accessible by default.** Text and icons meet WCAG 2.2 AA contrast in
  light and dark. Every control has an accessible name, is reachable by
  keyboard, and shows a visible focus ring. Focus moves into a dialog or
  menu when it opens, stays inside a modal, and returns to the opener on
  close. Nothing is available only on hover. State is never shown by colour
  alone, and the component still reads in forced-colours mode.
- **Motion** animates opacity and transform, not layout properties, never
  blocks input, and honours reduced motion (see
  [src/components/prefersReducedMotion.ts](src/components/prefersReducedMotion.ts))
  by replacing movement with a short fade or an instant change.
- **Right-to-left works.** Use logical properties (start and end, not left
  and right). Directional icons mirror; non-directional ones do not.
- **No built-in strings.** User-visible text comes from the consumer
  through props or slots so it can be localized, and layouts allow for
  translated text 30–40% longer than English.
- **Before calling a change done,** check it in Storybook in light and
  dark, with keyboard only, with reduced motion and forced colours, and in
  an RTL direction, and list anything you could not check in the PR.
