// @ts-ignore
import fs from 'fs/promises'
// @ts-ignore
import { execSync } from 'child_process'

const CHANGELOG_PATH = 'CHANGELOG.md'

let lastTag: string
try {
  lastTag = execSync('git describe --tags --abbrev=0', {
    encoding: 'utf-8'
  }).trim()
} catch {
  console.log(
    'No previous release tag found - nothing to diff against. This is ' +
      'expected before the first release; write that entry by hand instead.'
  )
  // @ts-ignore
  return process.exit(0)
}

const subjects = execSync(`git log ${lastTag}..HEAD --format=%s`, {
  encoding: 'utf-8'
})
  .split('\n')
  .map((s: string) => s.trim())
  .filter(Boolean)

const { version } = JSON.parse(await fs.readFile('package.json', 'utf-8'))

const body = subjects.map((line: string) => `- ${line}`).join('\n')

if (!body) {
  console.log('No changelog-worthy commits found since', lastTag)
  // @ts-ignore
  process.exit(0)
}

const newEntry = `## ${version}\n\n${body}\n`
const existing = await fs.readFile(CHANGELOG_PATH, 'utf-8')
const [heading, ...rest] = existing.split(/\n+?(?=## )/)

await fs.writeFile(
  CHANGELOG_PATH,
  [heading.trimEnd(), newEntry, ...rest].join('\n\n')
)

console.log(`Added changelog entry for ${version}`)
