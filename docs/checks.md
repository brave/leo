# Checks you can run

Checks to run before calling a change done. Builds on
[AGENTS.md](../AGENTS.md).

A match is not always wrong (a token file legitimately contains hex
values, and the hex check also matches issue references such as `#1234`),
but each one needs a reason. They look only at the lines the change adds,
printed as `file:line:text`, and need bash, not POSIX `sh`.

```bash
BASE=main  # the branch the change will merge into
added() {
  git diff -U0 --diff-filter=d "$BASE" -- "$@" | awk '
    /^\+\+\+ b\// { file = substr($0, 7); next }
    /^@@/ { match($0, /\+[0-9]+/); line = substr($0, RSTART + 1, RLENGTH - 1); next }
    /^\+/ { print file ":" line ":" substr($0, 2); line++ }'
}

# Web: raw colours, off-scale pixels, hand-written shadows and timing.
WEB=('*.css' '*.scss' '*.ts' '*.tsx' '*.svelte')
added "${WEB[@]}" | grep -E \
  '(^|[^&[:alnum:]_])#([[:xdigit:]]{3,4}|[[:xdigit:]]{6}|[[:xdigit:]]{8})\b|rgba?\(|hsla?\('
# 18 and 20 are icon sizes, so they pass here. Radii 26, 28 and 38 are
# platform radii and need a reason.
added "${WEB[@]}" | awk -F: '{
  t = $0; sub(/^[^:]*:[^:]*:/, "", t)
  while (match(t, /[0-9.]*[0-9]px/)) {
    v = substr(t, RSTART, RLENGTH - 2); t = substr(t, RSTART + RLENGTH)
    if (v !~ /^(0|1|2|4|8|12|16|18|20|24|32|40|48|64|80|96|160)$/)
      print $1 ":" $2 ": " v "px"
  }
}'
added "${WEB[@]}" | grep -E 'box-shadow:' | grep -v 'var(--leo-effect'
added "${WEB[@]}" | grep -E '(transition|animation)[^;]*[0-9.]+m?s\b' \
  | grep -v 'var(--leo-duration'

# Web: variables that do not exist in Leo. In a project that depends on
# @brave/leo, run its leo-check bin from the project root. In this repo,
# run the script directly.
npx leo-check
node src/scripts/audit-tokens.js

# Desktop native views: literal colours instead of nala::kColor* ids.
added '*.cc' '*.h' | grep -E 'SkColorSetA?RGB|SK_Color[A-Z]'

# Android: literal colours and sizes in resources and layouts.
added '*.xml' | grep -E '"#[0-9a-fA-F]{6,8}"|"[0-9]+(dp|sp)"'

# iOS: literal colours and font sizes.
added '*.swift' | grep -E 'Color\(red:|UIColor\(red:|\.system\(size:'
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
