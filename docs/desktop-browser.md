# Desktop browser: Nala tokens and the user's theme

How Nala colours work in the desktop browser. Builds on [AGENTS.md](../AGENTS.md).

Desktop colours work differently from Android. On Android the Nala colours
are fixed resources, so dynamic colour needs theme attributes. On desktop
the dynamic part is inside Nala, so Nala's semantic colours follow the
user's theme as long as they are resolved through the colour provider.
This describes [brave-core](https://github.com/brave/brave-core).

**How it is wired.**

- `ui/color/BUILD.gn` copies `nala_color_id.h` and `nala_color_mixer.cc` /
  `.h` from [tokens/skia/](../tokens/skia/), and
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
  primitives. The baseline matches Leo's primitives on all 100 shared
  tones. So with the default theme the colours are exactly Leo's, and with
  an accent theme the same tones come from the user's palette.
- Light and dark come from `key.color_mode`, which picks the matching
  branch in the mixer.

**What follows the theme.** In the generated mixer, semantic colours built
on dynamic primitives follow the user's theme:
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
- **WebUI is different.** WebUI pages use Leo's CSS variables, which switch between light and dark only. They pick up an
  accent only where they load `chrome://theme/colors.css` (the welcome page
  preview does).

**Check before calling a desktop change done.** Check it in light and dark,
with the default theme, an accent colour theme, grayscale, an installed
custom theme, a private window, a Tor window and the darker theme. Mixer
logic belongs in a test beside `brave_color_mixers_unittest.cc`.
