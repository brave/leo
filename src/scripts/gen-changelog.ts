// Run directly with Node's built-in type stripping (no tsx), so the release
// workflow doesn't need to install or execute any dependencies.
// @ts-ignore
import fs from 'fs/promises'
// @ts-ignore
import { execFileSync } from 'child_process'

const CHANGELOG_PATH = 'CHANGELOG.md'

// Args are passed as an array (no shell), so tag names can't inject commands.
const git = (...args: string[]): string =>
  execFileSync('git', args, { encoding: 'utf-8' })

let lastTag: string
try {
  // Only consider release tags, so a stray tag can't become the diff base.
  lastTag = git('describe', '--tags', '--abbrev=0', '--match', 'v[0-9]*').trim()
} catch {
  console.log(
    'No previous release tag found - nothing to diff against. This is ' +
      'expected before the first release; write that entry by hand instead.'
  )
  // @ts-ignore
  process.exit(0)
}

// Fully-qualified ref so a tag starting with `-` can't be parsed as an option.
const subjects = git('log', `refs/tags/${lastTag}..HEAD`, '--format=%s')
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
