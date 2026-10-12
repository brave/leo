# Surfaces inside the Brave browser

Rules for surfaces that ship in the Brave browser. Builds on [AGENTS.md](../AGENTS.md).

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
