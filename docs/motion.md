# Motion

Motion rules for Leo and for products built on it. Builds on the rules in [AGENTS.md](../AGENTS.md).

Motion explains what changed. It is never decoration.

| Token         | Value | Use                                                             |
| ------------- | ----- | --------------------------------------------------------------- |
| `duration-xs` | 50ms  | Hover, press and toggle. Also the reduced-motion replacement.   |
| `duration-s`  | 100ms | Small changes, tooltips, small menus and popovers.              |
| `duration-m`  | 200ms | Larger menus and popovers, small panels.                        |
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
[tokens/css/variables.css](../tokens/css/variables.css), the `duration` and
`easing` exports in `variables.ts` (`duration.s` is
`var(--leo-duration-s)`), and `DurationS`, `EasingOut` and so on in
[tokens/json/](../tokens/json/). Skia, Android and iOS have none.

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
  `s`. Tooltips and small menus and popovers use `s`, larger ones use `m`.
  Panels, sheets and page transitions use `m` or `l`. Leaving is quicker than entering, so give an
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
  ([tabs.svelte](../src/components/tabs/tabs.svelte) sets
  `transition: none`). JS-driven transitions call
  `prefersReducedMotion()` and switch to `--leo-duration-xs` with no
  scale, as [dialog.svelte](../src/components/dialog/dialog.svelte) does. It
  reads the preference each time the dialog opens, so a change in the OS
  setting applies mid-session.
- **Loading indicators wait.** Work that usually finishes quickly shows no
  indicator at first. Show one only after `duration-xl` (500ms), and keep
  it up long enough to be read.
