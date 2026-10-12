# Android: Nala tokens and dynamic colour

How the Android browser consumes Nala. Builds on [AGENTS.md](../AGENTS.md).

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
`@color/default_icon_color_tint_list`, or `BraveSettingsIconTintUtils`.
Use `nala_icon_overrides` to replace a Chromium drawable only when every
call site applies its own tint.

**Typography and dimensions.** Leo's Android `styles.xml` and
`dimens.xml` are not used by brave-core. Use the text appearances that
brave-core and Chromium already define. Use dimensions in `dp` taken from
the spacing and radius scales in
[AGENTS.md](../AGENTS.md#using-leo-in-a-product), which include the
Android radii.

**Check both paths.** Before calling an Android change done, check it in
light and dark with dynamic colour both enabled and disabled. Check on
Android 12+ with at least two contrasting wallpapers, and on an older
Android version where dynamic colour is unavailable. The setting is Settings → Appearance → Dynamic
colors.
