# Leo

Leo is Brave's cross-platform design system. It powers the Brave Browser
(desktop and mobile), the new tab and search experiences, brave.com
marketing, and the broader privacy-product portfolio.

Components are authored in Svelte and shipped to consumers as **React** and
**Web Component** wrappers. Tokens are authored once and exported to CSS,
Tailwind, Skia (C++), Java/XML (Android), and Swift (iOS).

## Nala

`nala` is the codename used for Leo on the native side of the stack. The
generated Skia/C++ token files live in the `nala::` namespace
(see [tokens/skia/](tokens/skia/) and the templates under
[src/tokens/transformation/skia/templates/](src/tokens/transformation/skia/templates/))
and per-PR Storybook previews are deployed to
`https://<pr-number>.pr.nala.bravesoftware.com/` by
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

## Build / Dev

```bash
npm install        # also runs the build via the `prepare` script
npm run build      # transform-tokens → skiafy-icons → android-icons → rollup
npm run dev        # rollup --watch for iterating on a component
npm run storybook  # Storybook on :6006
npm run test       # jest
```

Node is pinned to `24.11.1` in CI
([.github/workflows/build.yml](.github/workflows/build.yml)). Use npm —
the lockfile is `package-lock.json` and CI installs with
`npm ci --ignore-scripts`.
