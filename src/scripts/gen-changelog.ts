import fs from 'fs/promises'
import { execSync } from 'child_process'

const CHANGELOG_PATH = 'CHANGELOG.md'
const SECTION_HEADINGS: Record<string, string> = {
  breaking: 'Breaking Changes',
  feat: 'Features',
  fix: 'Fixes',
  perf: 'Performance'
}
const SECTION_ORDER = ['breaking', 'feat', 'fix', 'perf']

// Commits with these Conventional Commit types aren't user-facing, so they're
// left out of the changelog.
const IGNORED_TYPES = new Set(['chore', 'docs', 'test', 'ci', 'style'])

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
  process.exit(0)
}

const subjects = execSync(`git log ${lastTag}..HEAD --format=%s`, {
  encoding: 'utf-8'
})
  .split('\n')
  .map((s) => s.trim())
  .filter(Boolean)

const conventionalCommit = /^(\w+)(!)?(\([^)]+\))?:\s*(.+)$/

const sections: Record<string, string[]> = {}
for (const subject of subjects) {
  const match = subject.match(conventionalCommit)
  if (!match) continue

  const [, type, breaking, , description] = match
  const key = breaking ? 'breaking' : type
  if (!breaking && IGNORED_TYPES.has(type)) continue
  if (!SECTION_HEADINGS[key]) continue

  const items = sections[key] || (sections[key] = [])
  items.push(description)
}

const { version } = JSON.parse(await fs.readFile('package.json', 'utf-8'))

const body = SECTION_ORDER.filter((key) => sections[key]?.length)
  .map(
    (key) =>
      `### ${SECTION_HEADINGS[key]}\n\n${sections[key]
        .map((line) => `- ${line}`)
        .join('\n')}`
  )
  .join('\n\n')

if (!body) {
  console.log('No changelog-worthy commits found since', lastTag)
  process.exit(0)
}

const newEntry = `## ${version}\n\n${body}\n`
const existing = await fs.readFile(CHANGELOG_PATH, 'utf-8')
const [heading, ...rest] = existing.split(/\n(?=## )/)

await fs.writeFile(
  CHANGELOG_PATH,
  [heading.trimEnd(), newEntry, ...rest].join('\n\n')
)

console.log(`Added changelog entry for ${version}`)
