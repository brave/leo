import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import webColor from './src/tokens/transformation/web/color'
import formatCss from './src/tokens/transformation/web/formatCss'
import composedColors from './src/tokens/transformation/android/composedColors'

const dynamicValue =
  'color-mix(in srgb, var(--leo-color-text-primary) 50%, transparent)'
const token = {
  type: 'color',
  name: 'color-light-text-disabled',
  path: ['color', 'light', 'text', 'disabled'],
  attributes: { category: 'color' },
  value: dynamicValue,
  original: { value: 'rgba(28, 28, 29, 0.5000)' },
  referencedVariable: '$text.primary',
  opacity: 0.5
}

assert.equal(webColor.transformer(token as never), dynamicValue)

const css = formatCss({
  dictionary: {
    allTokens: [token],
    usesReference: () => false
  },
  options: {},
  file: { destination: 'variables.css' }
} as never)
assert.match(css, /--leo-color-text-disabled: rgba\(28, 28, 29, 0.5\)/)
assert.match(css, /@supports \(color: color-mix/)
assert.match(css, new RegExp(dynamicValue.replace(/[()]/g, '\\$&')))

const androidToken = { ...token, name: 'text_disabled' }
const buildPath = `${mkdtempSync(path.join(tmpdir(), 'leo-colors-'))}/`
try {
  composedColors.do({ allTokens: [androidToken] }, { buildPath })
  assert.match(
    readFileSync(path.join(buildPath, 'color/text_disabled.xml'), 'utf8'),
    /android:color="#801c1c1d"/
  )
  assert.match(
    readFileSync(path.join(buildPath, 'color-v23/text_disabled.xml'), 'utf8'),
    /android:color="@color\/text_primary" android:alpha="0.5"/
  )
} finally {
  rmSync(buildPath, { recursive: true, force: true })
}
