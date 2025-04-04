import { walk } from './common'
import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'

interface Options {
    extractTimestamp: boolean
}

interface UsageMatch {
    type: 'color' | 'spacing' | 'font',
    raw: string,
    property: string,
    value: string,
    isNala: boolean,
    file: string,
    line: number,
    column: number,
    timestamp?: number,
}

const allowedExtensions = [
    '.html',
    '.svelte',
    '.css',
    '.scss',
    '.sass',
    '.less',
    '.lss',
    '.js',
    '.ts',
    '.jsx',
    '.tsx'
]

const spacingPatterns = [
    /\spadding(-(top|right|bottom|left))?:/,
    /\smargin(-(top|right|bottom|left))?:/,
    /\s(gap|row-gap|column-gap):/,
    /\s(top|right|bottom|left):/,
    /\sinset(-(top|right|bottom|left))?:/,
]

// There's a bunch of stuff we'll miss here (like setting just 'background')
const colorPatterns = [
    /\scolor:/,
    /\sbackground-color:/,
    /\sborder-color:/,
    /\soutline-color:/,
    /\sfill:/,
    /\sstroke:/,
]

const fontPatterns = [
    /\sfont((\w|-)+)?:/,
    /\sline((\w|-)+)?:/
]

const detectors = {
    color: colorPatterns,
    spacing: spacingPatterns,
    font: fontPatterns,
}

const isNalaValue = (value: string) => {
    return value.includes('--leo-')
        || value.includes('color.')
        || value.includes('font.')
        || value.includes('spacing.')
}

const isFileTracked = (filepath: string) => {
    // TODO: we shouldn't use try/catch here as it'll be slow. Instead we should
    // check the exit code but I'm in a rush.
    try {
        execSync(`git ls-files --error-unmatch -- ${filepath}`, { stdio: 'ignore' })
        return true
    } catch (e) {
        return false
    }
}

const getLineDateLookup = (filepath: string): number[] | undefined => {
    try {
        const content = execSync(`git blame --line-porcelain -- ${filepath}`, { encoding: 'utf8' })

        const lineDates: number[] = []

        let lastTimeStamp = 0
        for (const line of content.split('\n')) {
            if (line.startsWith('author-time')) {
                lastTimeStamp = parseInt(line.split(' ')[1])
            } else if (line.startsWith('\t')) {
                lineDates.push(lastTimeStamp)
            }
        }

        return lineDates
    } catch (e) {
        return undefined
    }
}

const walkAllowedFiles = () => walk(process.cwd(), (name, filepath, entry) => {
    // Skip node_modules
    if (name === 'node_modules') return true

    // Skip type declarations
    if (name.endsWith('.d.ts')) return true

    // Skip SVGs
    if (name.endsWith('.svg')) return true

    // Skip test files
    if (name.includes('.test.')) return true

    // Skip vendor files
    if (name.includes('vendor')) return true

    // Skip third party files
    if (name.includes('third_party')) return true

    // If this isn't a directory or an allowed file extension, skip it
    if (!entry.isDirectory() && !allowedExtensions.includes(path.extname(filepath))) return true

    // Skip untracked files
    return !isFileTracked(filepath)
})

function* getMatchesFromFile(filepath: string, options: Options): IterableIterator<UsageMatch> {
    const content = fs.readFileSync(filepath, 'utf8')
    const lineDates = options?.extractTimestamp ? getLineDateLookup(filepath) : undefined

    let lineNumber = 0
    const lines = content.split('\n')

    for (const line of lines) {
        lineNumber++
        const getMatch = (type: 'color' | 'spacing', pattern: RegExpMatchArray) => {
            const value = line.substring(pattern.index! + pattern[0].length).trim()
                .replace(';', '') // remove trailing semicolon, if any
            return {
                type: type,
                raw: line.trim(),
                property: pattern[0].trim()
                    .replace(':', ''), // remove trailing colon, if any
                value,
                isNala: isNalaValue(value),
                file: filepath,
                line: lineNumber,
                column: pattern.index!,
                timestamp: lineDates?.[lineNumber - 1],
            }
        }

        let value: UsageMatch | null = null
        for (const [type, patterns] of Object.entries(detectors)) {
            const match = patterns.map(pattern => line.match(pattern)).find(match => match !== null)
            if (match) {
                value = getMatch(type as any, match)
                break
            }
        }

        // Check its not a JS thingy
        // Note: These are heuristics and definitely will have false positives
        // and false negatives.
        const isJSThingy = value?.value.startsWith('{')
            || value?.value.startsWith('"')
            || value?.value.startsWith("'")
            || value?.value.startsWith('`')
            || value?.value.startsWith('/')
            || line.includes(`let ${value?.value}`)
            || line.includes(`const ${value?.value}`)
            || line.includes(`var ${value?.value}`)

        if (value && !isJSThingy) {
            yield value
        }
    }
}

async function json() {
    console.log('[');
    for await (const filepath of await walkAllowedFiles()) {
        for (const match of getMatchesFromFile(filepath, { extractTimestamp: true })) {
            console.log(JSON.stringify(match, null, 4) + ',')
        }
    }
    console.log(']');
}

async function csv() {
    const maybeQuote = (v: any) => {
        v = v.toString()
        return v.includes(',') ? `"${v.toString().replaceAll('"', "'")}"` : v.replaceAll('"', "'")
    }
    console.log('type,property,value,isNala,file,line,column,timestamp,raw');
    for await (const filepath of await walkAllowedFiles()) {
        const relPath = path.relative(process.cwd(), filepath)
        for (const match of getMatchesFromFile(filepath, { extractTimestamp: true })) {
            const date = new Date(match.timestamp! * 1000)
            console.log([
                match.type,
                match.property,
                match.value,
                match.isNala,
                relPath,
                match.line,
                match.column,
                `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDay().toString().padStart(2, '0')}`,
                match.raw,
            ]
                .map(maybeQuote).join(','))
        }
    }
}

csv()
