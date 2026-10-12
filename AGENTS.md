# Leo

Leo is Brave's cross-platform design system. It powers the Brave Browser
(desktop and mobile), the new tab and search experiences, brave.com
marketing, and the broader privacy-product portfolio.

Components are authored in Svelte and shipped to consumers as **React**, **Svelte** and
**Web Component** wrappers. Tokens are authored once and exported to CSS,
Tailwind, Skia (C++), Android XML resources, and Swift (iOS).

See [README.md](README.md) for consumer setup — wiring up `variables.css`,
the Tailwind plugin, and the `data-theme="dark|light"` theming rule.

> **Generated output, do not hand-edit.** `tokens/`, `react/`,
> `web-components/`, `shared/`, `build/`, `types/`, `icons-skia/`,
> `icons-sf/`, and `storybook-static/` are all produced by `pnpm run build`
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

On Android, the Nala tokens are the XML resources generated into
[tokens/android/](tokens/android/). brave-core builds them into the
browser through `android/nala/BUILD.gn`, and remaps Chromium's
`baseline_*` palette to Nala primitives so Chromium's theme also resolves
to Nala. Android surfaces use Nala tokens or theme attributes, never
`@android:color/*` or hex. See
[Android: Nala tokens and dynamic colour](#android-nala-tokens-and-dynamic-colour)
for how to use them so they work with Material dynamic colour.

On the desktop browser, Nala's colour ids are resolved through Chromium's
colour provider, so they follow the user's theme without extra work. See
[Desktop browser: Nala tokens and the user's theme](#desktop-browser-nala-tokens-and-the-users-theme).

## Tokens

Tokens are authored in [src/tokens/](src/tokens/) (`*.tokens.json` /
`*.variables.json`) and compiled to per-platform output by
`pnpm run transform-tokens` (also part of `pnpm run build`). The generated
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
  enum, color mixer, and `radius.h` / `spacing.h` headers). The mixer is
  what makes desktop colours follow the user's theme; see
  [Desktop browser: Nala tokens and the user's theme](#desktop-browser-nala-tokens-and-the-users-theme).
  There are no motion tokens for Skia, Android or iOS.
- **Android (Nala)** — [tokens/android/](tokens/android/):
  - `values/colors.xml`: every primitive, plus light values for the
    Material 3 roles and Leo semantics.
  - `values-night/colors.xml`: dark values for the roles and semantics.
  - `color/` and `color-night/`: colour state lists for colours with
    alpha.
  - `values/styles.xml` and `values/dimens.xml`: text appearances,
    which brave-core does not consume.
  - `sources.gni`: a GN list of the colour state lists, for Chromium
    builds.
  - `drawable/`: `ic_<name>` vector icons.

  Spacing and radius are **not** exported for Android. See
  [Android: Nala tokens and dynamic colour](#android-nala-tokens-and-dynamic-colour).

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

Svelte consumers import the components from source. At build time
(`pnpm run build`), every component is also emitted in two consumer
formats:

- **React** — `react/<name>.js`, imported as `@brave/leo/react/<name>`.
- **Web Component** — `web-components/<name>.js`, imported as
  `@brave/leo/web-components/<name>` and used via `<leo-<name>>` tags.

See [src/components/README.md](src/components/README.md) for the
component authoring recipe and the React / Web Component caveats.

### Icons

Icons live in [icons/](icons/) (~2300 SVGs synced from Figma by
[.github/workflows/update-icons.yml](.github/workflows/update-icons.yml))
and are consumed via the typed
[`<Icon name="..." />`](src/components/icon/icon.svelte) component, with
autocomplete from `@brave/leo/icons/meta`. The same set is generated as
Android vector drawables (`tokens/android/drawable/ic_<name>.xml`, with
dashes in the name becoming underscores) and as Skia icons (`icons-skia/`).

### Storybook

Every component and token group has a `<name>.stories.svelte` file —
Storybook is the live visual reference for both. Run it locally via
`pnpm run storybook` (`:6006`), or browse the per-PR preview at the nala
URL above.

## Build / Dev

```bash
pnpm install        # also runs the build via the `prepare` script
pnpm run build      # transform-tokens → skiafy-icons → android-icons → rollup
pnpm run dev        # rollup --watch for iterating on a component
pnpm run storybook  # Storybook on :6006
pnpm run test       # jest
pnpm run check      # svelte-check + event audit
pnpm run format     # prettier
```

## Using Leo in a product

These rules are for agents building a Brave surface on top of Leo, in any
repository. Where a consuming repository has more specific guidelines,
follow them.

Token names below use the web spelling. Each platform spells the same
token its own way, for example `color-text-primary` is:

| Platform | Name                                                                                                                    |
| -------- | ----------------------------------------------------------------------------------------------------------------------- |
| CSS      | `var(--leo-color-text-primary)`                                                                                         |
| Android  | `@color/text_primary` (see the [Android section](#android-nala-tokens-and-dynamic-colour) for roles backed by Material) |
| Skia     | `nala::kColorTextPrimary`                                                                                               |
| iOS      | `.textPrimary`                                                                                                          |

- **Semantic tokens first.** Use the token named for a role
  (`color-text-primary`, `color-container-background`,
  `color-divider-subtle`, `color-systemfeedback-error-icon`,
  `font-default-regular`). Use a primitive only when no semantic token
  describes the role, and record why next to the use.
- **One semantic layer per product.** A product names its roles once, in
  one file, and aliases each to a Leo token. Components read those roles,
  so a Leo upgrade or theme change is made in one place. brave-core is
  the exception: Leo semantics are its role layer, so Android and C++
  code reference Nala tokens directly and do not add aliases.
- **No raw values.** No hex colours, hand-written shadows or timing, and
  nothing off Leo's scales:
  - spacing: `spacing-xs` 2, `s` 4, `m` 8, `l` 12, `xl` 16, `2xl` 24,
    `3xl` 32, `4xl` 40, `5xl` 48, `6xl` 64, `7xl` 80, `8xl` 96, `9xl` 160
  - radius: `radius-2xs` 1, `xs` 2, `s` 4, `m` 8, `l` 12, `xl` 16,
    `xxl` 24, `full`
  - icon size: `icon-xs` 16, `s` 18, `m` 20, `l` 24, `xl` 32

  A 1px hairline border is the one allowed literal. On platforms where
  a scale is not exported (spacing and radius on Android), copy the
  values into the product's one dimens file and name each token.

- **Light and dark come from Leo.** Use Leo's values and theme switching
  (`data-theme`, `values-night`, the asset catalog's appearances). Do not
  derive one theme from the other with opacity or filters. On Android,
  Material dynamic colour is the one allowed source of other colours,
  and only through theme attributes, as described below. On the desktop
  browser the user's theme is the other, and it reaches Nala through the
  colour provider, so never resolve a Nala colour once and cache it.
- **Typography uses the role tokens** (`font-heading-h1` to `-h4`,
  `font-large-*`, `font-default-*`, `font-small-*`, `font-x-small-*`,
  `font-monospace-*`) rather than setting size, weight and line height
  separately.
- **Motion uses Leo's tokens.** Durations are `duration-xs` (50ms) to
  `duration-l` (300ms), and easings are `easing-out`, `easing-in`,
  `easing-in-out` and `easing-linear`. Nothing routine is longer than
  `duration-l`. See [Motion](#motion) for which to use when, and what to
  do on platforms that have no motion tokens.
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
  `braveai` is defined in
  [src/tokens/universal.tokens.json](src/tokens/universal.tokens.json) but
  is not yet exported to any platform, so raise it with Leo rather than
  copying the stops by hand. Never put body text on a gradient, and never
  invent one.
- **Brand colour does not follow dynamic colour.** On Android, logos,
  `primitive_brands_*`, gradients, and the `private_window_*` and
  `tor_window_*` palettes are referenced as `@color/` resources, so they
  stay fixed whatever the wallpaper.
- **Third-party marks** use Leo's `*-color` brand icons where one exists,
  unmodified.

### Motion

Motion explains what changed. It is never decoration.

| Token         | Value | Use                                                             |
| ------------- | ----- | --------------------------------------------------------------- |
| `duration-xs` | 50ms  | Hover, press and toggle. Also the reduced-motion replacement.   |
| `duration-s`  | 100ms | Small changes, menus, tooltips, popovers.                       |
| `duration-m`  | 200ms | Menus, popovers, panels.                                        |
| `duration-l`  | 300ms | Panels, sheets, page transitions. The longest routine duration. |
| `duration-xl` | 500ms | Not an animation length. The delay before a loading indicator.  |

| Token                | Value                               | Use                                  |
| -------------------- | ----------------------------------- | ------------------------------------ |
| `easing-out`         | `cubic-bezier(0, 0, 0.58, 1)`       | Things that enter.                   |
| `easing-in`          | `cubic-bezier(0.5, 0, 0.5, 1)`      | Things that leave.                   |
| `easing-in-out`      | `cubic-bezier(0.42, 0, 0.58, 1)`    | Things that move or change in place. |
| `easing-linear`      | `cubic-bezier(0, 0, 1, 1)`          | Progress only.                       |
| `easing-in-out-back` | `cubic-bezier(0.7, -0.4, 0.4, 1.4)` | Overshoots. Rare emphasis only.      |

**Where they exist.** Motion tokens are generated for the web only:
`--leo-duration-*` and `--leo-easing-*` in
[tokens/css/variables.css](tokens/css/variables.css), the `duration` and
`easing` exports in `variables.ts` (`duration.s` is
`var(--leo-duration-s)`), and `DurationS`, `EasingOut` and so on in
[tokens/json/](tokens/json/). Skia, Android and iOS have none.

```css
/* Do */
.panel {
  transition:
    opacity var(--leo-duration-s) var(--leo-easing-out),
    transform var(--leo-duration-s) var(--leo-easing-out);
}

/* Don't: hand-written timing, and a layout property. */
.panel {
  transition: width 0.25s ease;
}
```

- **On Android and iOS,** use the platform's system motion (Material
  springs, SwiftUI's standard animations) for platform components. For
  anything custom, copy the values above and name the token in a comment,
  as with any other copied value. For example, `// duration-s,
easing-out` with `PathInterpolator(0f, 0f, 0.58f, 1f)` on Android, or
  `.timingCurve(0, 0, 0.58, 1, duration: 0.1)` on iOS.
- **Size the motion to the change.** Hover, press and toggle use `xs` or
  `s`. Menus, tooltips and popovers use `s` or `m`. Panels, sheets and page
  transitions use `m` or `l`. Leaving is quicker than entering, so give an
  exit the shorter duration.
- **Animate opacity and transform,** not width, height, top or left, so
  motion never drops frames or shifts layout.
- **Never block.** A person can act during an animation, and nothing waits
  for it to finish before responding to input.
- **No loops and no flashing.** Nothing animates continuously except a
  progress indicator while work is happening, and nothing flashes more
  than three times a second.
- **Reduced motion** replaces movement with a short fade or an instant
  change, and no information is carried by motion alone. In Leo, CSS
  transitions use `@media (prefers-reduced-motion: reduce)`
  ([tabs.svelte](src/components/tabs/tabs.svelte) sets
  `transition: none`). JS-driven transitions call
  `prefersReducedMotion()` and switch to `--leo-duration-xs` with no
  scale, as [dialog.svelte](src/components/dialog/dialog.svelte) does. It
  reads the preference each time the dialog opens, so a change in the OS
  setting applies mid-session.
- **Loading indicators wait.** Work that usually finishes quickly shows no
  indicator at first. Show one only after `duration-xl` (500ms), and keep
  it up long enough to be read.

### Surfaces inside the Brave browser

A surface that ships in the browser ([brave-core](https://github.com/brave/brave-core))
looks and behaves like the browser around it. It uses Nala for values and
follows the conventions of the platform. Where Nala and a platform convention
disagree on behaviour (a gesture, where a button goes, how a sheet is
dismissed), follow the platform. Where they disagree on a value (a colour, a
size), use Nala.

Check which Chromium milestone the target brave-core branch is on and which OS
versions it supports. Design for the newest, check the oldest still works, and
adopt a new system pattern in the browser release that adopts it, not before.

- **Desktop follows Chromium.** Use Chromium's surfaces for what they are
  for: the side panel for a persistent companion view, a bubble anchored
  to its toolbar button or omnibox icon for a short task, a tab-modal
  dialog for a decision about the current page, and a WebUI page
  (`brave://`) for settings and full-page tools. Do not build a surface
  Chromium already provides. Match Chromium's dialog widths, button order
  per OS, menu structure, spacing, radii and focus rings, which its layout
  provider supplies to native views. Keep its keyboard behaviour: focus
  order, Esc to close, F6 between panes. Native views take colours from
  `nala::kColor*` ids; WebUI uses `@brave/leo` components and `--leo-*`
  variables.
- **Android follows Chromium and Material 3 Expressive.** Use bottom
  sheets for short tasks, full-screen activities for settings, and the
  toolbar and menu entry points the browser already has. Follow Material
  3 Expressive for components, shape, type emphasis and spring-based
  motion. Draw edge to edge with correct insets, support predictive back,
  keep touch targets at least 48dp, and respect the system font scale and
  dark theme.
- **iOS follows Liquid Glass and the Human Interface Guidelines.** Liquid
  Glass is the material for controls and navigation (toolbars, tab bars,
  sheets, floating buttons), which sit above the content. Use the system's
  glass and standard components instead of imitating glass with blur and
  colour, and do not make content glass. Tint glass with a Nala colour
  only for a primary action. Support Dynamic Type, Reduce Transparency,
  Increase Contrast, Reduce Motion, safe areas, the back-swipe gesture,
  and touch targets of at least 44pt. Use SF Symbols for system controls
  and Leo icons for Brave concepts.
- **Apps outside the browser** hold the same standard and follow the OS
  they run on. A terminal interface cannot use Leo components. It copies
  its colours from Leo, names the token in a comment, and respects
  `NO_COLOR` and the terminal's own palette.

### Desktop browser: Nala tokens and the user's theme

Desktop colours work differently from Android. On Android the Nala colours
are fixed resources, so dynamic colour needs theme attributes. On desktop
the dynamic part is inside Nala, so Nala's semantic colours follow the
user's theme as long as they are resolved through the colour provider.
This describes [brave-core](https://github.com/brave/brave-core).

**How it is wired.**

- `ui/color/BUILD.gn` copies `nala_color_id.h` and `nala_color_mixer.cc` /
  `.h` from [tokens/skia/](tokens/skia/), and
  `chromium_src/ui/color/color_mixers.cc` calls `nala::AddNalaColorMixer`
  right after Chromium's reference palette mixer. Every window's colour
  provider therefore has the `nala::kColor*` ids.
- The generated mixer has two kinds of primitive. **Dynamic** primitives
  (`neutral`, `neutral-variant`, `primary`, `secondary` and `tertiary`, 100
  in all) read `ui::kColorRef*`, which Chromium fills from the user's
  theme. **Static** primitives (`red`, `green`, `blue`, `yellow`,
  `orange`, the brand, `private-window` and `tor-window` palettes, black
  and white) are hard-coded.
- `ui/color/brave_ref_color_mixer.cc` decides what fills the reference
  palette. When the user has an accent colour (`user_color` is set, and
  its source is not baseline or grayscale), it generates a Material
  tonal palette from that seed, using the scheme variant and defaulting to
  tonal spot. Otherwise it uses Brave's baseline, a copy of Leo's
  primitives. I compared the baseline with Leo's primitives and the 100
  shared tones match. So with the default theme the colours are exactly
  Leo's, and with an accent theme the same tones come from the user's
  palette.
- Light and dark come from `key.color_mode`, which picks the matching
  branch in the mixer.

**What follows the theme.** I traced every alias in the generated mixer.
Semantic colours built on dynamic primitives follow the user's theme:
`text-*`, `icon-*`, `divider-*`, `container-*`, `page-background`,
`button-background`, `button-disabled` and all the `desktopbrowser-*`
colours for the tab strip, toolbar, omnibar and menus. These stay fixed:
`systemfeedback-*`, `button-error-*`, `button-success-*`, and the
`material-*`, `elevation-*`, `dialogs-*`, scrollbar and split-view overlays
(black or white at an alpha). Private and Tor windows use their own static
`private-window-*` and `tor-window-*` primitives.

**How to use it.**

- **Resolve through the colour provider, at paint time.** Use
  `GetColorProvider()->GetColor(nala::kColorTextPrimary)` or a themed
  helper that takes the id, such as
  `views::CreateThemedSolidBackground(nala::kColorContainerBackground)`,
  so a theme change repaints. Do not use `SkColorSetRGB`, `SK_Color*`, or a
  colour resolved once and stored.
- **Use the Nala id at the use site.** Do not add an intermediate
  `kColor*` that only maps to it (brave-core NA-012). Use a semantic id
  where one describes the role, and a primitive only where none does.
- **Pick the family on purpose.** A colour that should follow the theme is
  built from dynamic primitives. Status, brand and private or Tor window
  colours are built from static ones and must not be recoloured by an
  accent.
- **Neutral does not look tinted.** The neutral primitives barely show an
  accent, so a surface that must visibly carry it, such as the dark omnibar,
  reads `ui::kColorRefSecondary15` / `20` / `25` directly, and the light one
  reads `ui::kColorSysSurface4`
  (`browser/ui/color/brave_color_mixer.cc`). That is a gap in Leo's
  roles. Raise it rather than copying the pattern, and do not add more
  hand-tuned `HSLShift` values like the ones for tab hover and active in
  `brave_tab_color_mixer.cc`.
- **Custom themes bypass Nala.** When `key.custom_theme` is set, Brave's
  mixers skip the Nala surface tokens for the omnibar, and pick foregrounds
  by contrast with the theme's toolbar colour
  (`PickColorContrastingToToolbar`). A colour drawn on the toolbar or
  frame must do the same. The hex literals in
  `AddBraveLightThemeColorMixer` are legacy, so do not copy them.
- **The darker theme overrides.** With `kBraveDarkerTheme` and
  `SchemeVariant::kDarker`, postprocessing mixers push the location bar,
  omnibox and tabs to near black whatever the accent. Check new colours
  there too.
- **WebUI is different.** In the code I checked, WebUI pages use Leo's CSS
  variables, which switch between light and dark only. They pick up an
  accent only where they load `chrome://theme/colors.css` (the welcome page
  preview does).

**Check before calling a desktop change done.** Check it in light and dark,
with the default theme, an accent colour theme, grayscale, an installed
custom theme, a private window, a Tor window and the darker theme. Mixer
logic belongs in a test beside `brave_color_mixers_unittest.cc`.

### Android: Nala tokens and dynamic colour

These rules describe how the Brave Android browser in
[brave-core](https://github.com/brave/brave-core) consumes Nala. Its
[docs/best-practices/nala.md](https://github.com/brave/brave-core/blob/master/docs/best-practices/nala.md)
and
[docs/best-practices/android.md](https://github.com/brave/brave-core/blob/master/docs/best-practices/android.md)
take precedence where they are more specific.

**What brave-core takes from Leo.** `android/nala/BUILD.gn` copies
`values/colors.xml`, `values-night/colors.xml`, and the colour state lists
in `color/` and `color-night/` (listed in the generated `sources.gni`).
It also copies the drawables named in `android/nala/icons.gni`. It does
not consume `values/styles.xml` or `values/dimens.xml`.

**The colour layers in `colors.xml`:**

1. **Primitives:** `primitive_<palette>_<tone>`, tonal palettes from 0 to
   100 (`primary`, `secondary`, `tertiary`, `neutral`, `neutral_variant`,
   `red`, `green`, …). They are defined only in `values/`.
2. **Material 3 roles:** `schemes_*` (`schemes_primary`,
   `schemes_on_surface`, `schemes_outline_variant`, …), each aliasing a
   primitive tone, with dark values in `values-night/`.
3. **Leo semantics:** `text_primary`, `icon_default`,
   `button_background`, `systemfeedback_error_text`, … Each one aliases
   a role or a primitive.

Do not use the legacy hex names at the top of the file (`background1`,
`text1`, `interactive1`, …).

**How dynamic colour works in brave-core:**

- **The theme comes from Chromium, recoloured with Nala.** brave-core
  does not build a Material theme from `schemes_*`. Chromium's theme
  derives `?attr/colorPrimary`, `?attr/colorOnSurface`,
  `?attr/colorOutline` and the other attributes from its `baseline_*`
  tonal palettes. `android/java/res/values/brave_colors.xml` overrides
  those palettes with Nala primitives (`baseline_primary_40` →
  `primitive_primary_40`, …). With dynamic colour off, the theme
  attributes therefore resolve to Nala tones. With it on, Material
  replaces them with the wallpaper palette.
- **Theme attributes are not identical to `schemes_*`.** Chromium picks
  its own tone for each attribute. For example, with dynamic colour off,
  `?attr/colorOnSurfaceVariant` is `primitive_neutral_variant_30`, while
  `schemes_on_surface_variant` is `primitive_neutral_30`. Do not assume
  that a theme attribute and the `schemes_*` role with the same name are
  the same colour.
- **Dynamic colour is gated by `BraveDynamicColors`.** Chromium's calls
  to `DynamicColors.applyToActivityIfAvailable` are redirected in
  bytecode to `BraveDynamicColors`
  (`browser/ui/android/theme/.../BraveDynamicColors.java`). It applies
  dynamic colour only on Android 12+, when the user's Appearance setting
  is on. When that setting is unset, the `BraveAndroidDynamicColorsByDefault`
  feature decides. Do not call Material's `DynamicColors` directly. To
  branch on dynamic colour, use `BraveDynamicColors.isDynamicColorsEnabled()`
  rather than an SDK check.

**Choosing a colour:**

- **Should it follow the wallpaper?** Surfaces, text and icons on
  surfaces, dividers, outlines, accents and buttons should. Read these
  through the theme: `?attr/colorOnSurface`, `?attr/colorOnSurfaceVariant`,
  `?attr/colorOutline`, `?attr/colorPrimary`, `?attr/colorSurfaceContainerLow`,
  and Chromium's `?attr/globalFilledButtonBgColor`,
  `?attr/globalFilledButtonTextColor` and `?attr/globalTextButtonTextColor`
  for buttons. In Java, use `SemanticColorUtils` and `AttrUtils`. A
  `@color/` resource, Nala or otherwise, never follows dynamic colour.
- **Should it stay fixed?** Use the Nala semantic directly, for example
  `@color/systemfeedback_error_text`, `@color/text_tertiary`,
  brand colours, and the `private_window_*` / `tor_window_*` palettes
  used by private and Tor surfaces.
- **Do you have a custom drawable with a Nala default?** Keep the Nala
  token in XML (for example `themed_button_48_rounded_bg.xml` uses
  `@color/button_background`). Then call
  `BraveDynamicColors.applyToFilledButtonIfEnabled(view)` or
  `applyToOutlinedButtonIfEnabled(view)`, or resolve text with
  `BraveDynamicColors.getTextButtonColor(theme, fallback)`, so the theme
  colour replaces the Nala colour when dynamic colour is on.
- **Prefer XML over Java patches.** Fix theming with colour resources,
  theme attributes and selectors rather than by setting colours
  programmatically (brave-core AND-034).
- **No new colour values.** Do not add `<color>` resources or
  intermediate aliases. Reference the Nala token or theme attribute at
  the use site (brave-core NA-002, and NA-012 for C++ colour mixers). A
  selector or drawable may combine theme attributes and Nala tokens. For
  example, a disabled state can use `@color/button_disabled`, which Leo
  defines as `schemes_on_surface` at 20% alpha.
- **Raise gaps with Leo.** Some semantics alias `primitive_primary_*`
  directly, such as `container_interactive` and `divider_interactive`.
  They stay fixed, so they can clash with a dynamic accent. If one of
  them needs to follow the wallpaper, use the theme attribute for that
  role, or raise the gap with Leo rather than picking a tone.

**Icons.** Add Nala icons by listing them in `nala_icons` in
`android/nala/icons.gni`, not by adding drawable files (brave-core
NA-009). Nala drawables are filled with a static `@color/icon_default`.
They follow dynamic colour only when the call site tints them, for
example with `app:tint="?attr/colorOnSurfaceVariant"`,
`@color/default_icon_color_tint_list`, or `BraveSettingsIconTintUtils`. Use `nala_icon_overrides` to replace a
Chromium drawable only when every call site applies its own tint.

**Typography and dimensions.** Leo's Android `styles.xml` and
`dimens.xml` are not used by brave-core. Use the text appearances that
brave-core and Chromium already define. Use dimensions in `dp` taken from
Leo's spacing and radius scales above, plus `radius-android-dialog` (28)
and `radius-android-list-group` (20).

**Check both paths.** Before calling an Android change done, check it in
light and dark with dynamic colour both enabled and disabled. Check on Android 12+ with at least two
contrasting wallpapers, and on an older Android version where dynamic
colour is unavailable. The setting is Settings → Appearance → Dynamic
colors.

### Beyond tokens: product rules

These come from the Brave product design guidelines
([product-design.md](https://github.com/aguscruiz/brave-design/blob/main/product-design.md)),
which cover writing, privacy and AI surfaces in full. Where a repository's
guidelines are more specific, follow the repository.

#### Principles

- **Quiet, neutral chrome.** The accent marks primary actions, focus,
  selection and links only. Status colour is used only for status.
- **Every element has a purpose.** Remove text that repeats state the UI
  already shows. A note sits with its item, an input problem at the input,
  and an application error is a toast or the platform's equivalent.
- **Nothing approves for the person.** No shortcut, default focus or
  auto-advance answers a permission, privacy or payment decision.
- **Trust markings are never colour alone.** They also have a text label
  or a border that survives high contrast and forced colours.
- **Fast.** Typing, scrolling and opening a menu never wait on the rest of
  the UI.

#### Interaction

- **Undo over confirmation.** Confirm only what cannot be undone. The
  confirmation names the consequence ("Delete 12 files"), not "OK", and
  default focus is on the choice that keeps things as they are.
- **Loading and network.** Use a skeleton sized like the content when its
  shape is known, a determinate bar when the length is known, and a
  labelled spinner otherwise. Offline is a state: say so, keep what is
  loaded, offer a retry, and do not discard what was typed.
- **Forms.** Labels stay visible and a placeholder is never the label.
  Validate on leaving a field or on submit. Errors sit at the field, are
  linked to it for assistive technology, and focus moves to the first one.
  Do not disable submit to signal invalid input, and never block paste or
  autofill.
- **Focus.** It moves into a dialog or menu, stays inside a modal, and
  returns to the opener. It is always visible, and new content does not
  steal it. Nothing is available only on hover.
- **Shortcuts** do not override browser or OS ones, each has a visible
  control, tooltips show the platform's keys, and Esc closes one layer at a
  time (it stops generation first).

#### Writing and localization

- **Plain, calm and honest.** Address the person as "you" and Brave as
  "Brave". No exclamation marks, hype, guilt or false urgency. Buttons are
  verbs that name the result. Errors say what happened, then what to do.
- **Prompts** say who is asking, for what, and what happens on each choice.
  Declining is as easy and as clearly worded as accepting.
- **Strings** live in the platform's resources (GRD/GRDP in brave-core,
  `strings.xml`, string catalogs) in US English. They are whole sentences
  with placeholders, use ICU plurals, and have a translator description.
  Numbers, dates and times use locale APIs. There is no text in images.

#### Privacy and consent

- **Off until chosen.** A feature that sends data off the device is off
  until the person turns it on, never by an update or a pre-checked box.
  Say what is sent, to whom, why, and whether it is stored.
- **Equal choices, asked once.** Accept and decline have the same
  prominence. Ask when the feature is first used, respect a "no", and keep
  every choice changeable in settings.
- **No dark patterns.** Measure only through the approved privacy-preserving
  analytics (P3A in the browser), with no identifiers, content or URLs.

#### Agent and AI surfaces

- **Label AI content** and say where the model runs. Use the `braveai`
  gradient for AI identity, sparingly.
- **Stream in place.** Scroll follows only if the person is at the bottom.
  A visible stop control is always available and keeps what was produced.
- **Show the work.** Say what the agent is doing in plain words, cite
  sources where the claim is made, and never present an error or refusal
  as an answer.
- **Ask before acting** with the exact action, target and data, and with
  specific choices ("Allow once", "Always allow on example.com", "Deny").
  Default focus is never on an allow choice, and nothing allows
  automatically, even after a timeout.
- **Screen readers** hear a reply announced once, not token by token.
  Permission prompts take focus on the least permissive choice.
- **Untrusted content** (pages, emails, tool output) sits in a container
  with a border and a text label naming its source, never looks like UI,
  and trust labels are drawn by the surface, never from model or page output.

### Checks you can run

A match is not always wrong (a token file legitimately contains hex
values), but each one needs a reason. Run them on the files the change
touches.

```sh
BASE=main  # the branch the change will merge into
changed() { git diff --name-only "$BASE" -- "$@"; }

# Web: raw colours, off-scale pixels, hand-written shadows and timing, foreign icon sets.
WEB=('*.css' '*.scss' '*.ts' '*.tsx' '*.svelte')
changed "${WEB[@]}" | xargs grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\('
changed "${WEB[@]}" | xargs grep -noE '\b[0-9]+px\b' \
  | grep -vE ':(0|1|2|4|8|12|16|24|32|40|48|64|80|96|160)px$'
changed "${WEB[@]}" | xargs grep -nE 'box-shadow:' | grep -v 'var(--leo-effect'
changed "${WEB[@]}" | xargs grep -nE '(transition|animation)[^;]*[0-9.]+m?s\b' \
  | grep -v 'var(--leo-duration'

# Desktop native views: literal colours instead of nala::kColor* ids.
changed '*.cc' '*.h' | xargs grep -nE 'SkColorSetA?RGB|SK_Color[A-Z]'

# Android: literal colours and sizes in resources and layouts.
changed '*.xml' | xargs grep -nE '"#[0-9a-fA-F]{6,8}"|"[0-9]+(dp|sp)"'

# iOS: literal colours and font sizes.
changed '*.swift' | xargs grep -nE 'Color\(red:|UIColor\(red:|\.system\(size:'
```

On Android, a `dp` match is fine in the product's one dimens file. For web
surfaces, also run an automated accessibility check (for example axe-core
through Playwright) with the modes the surface supports, then go through
it with the keyboard only and the platform's screen reader:

```ts
await page.emulateMedia({
  colorScheme: 'dark',
  reducedMotion: 'reduce',
  forcedColors: 'active'
})
await page.evaluate(() => {
  document.documentElement.dataset.theme = 'dark'
  document.documentElement.dir = 'rtl'
})
```

## Changing Leo

These rules are for agents changing tokens, components or icons in this
repository.

- **Tokens.** Add or change tokens in the sources under
  [src/tokens/](src/tokens/), never in generated output. A new colour is a
  semantic role with both a light and a dark value, named for what it is
  for rather than how it looks. Android colour names are resource names
  that brave-core references directly, so renaming or removing one is a
  breaking change. An alias to `schemes_*` does not make a colour follow
  dynamic colour, because only theme attributes do. Check the change in every platform's output, not only CSS.
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
- **Motion** takes every duration and easing from the tokens (see
  [Motion](#motion)), animates opacity and transform, not layout
  properties, never blocks input, and honours reduced motion (see
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
