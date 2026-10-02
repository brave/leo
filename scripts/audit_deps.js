#!/usr/bin/env node
// Copyright (c) 2026 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at https://mozilla.org/MPL/2.0/.

import { execSync } from 'child_process'

const AUDIT_CONFIG_URL =
  'https://raw.githubusercontent.com/brave/audit-config/main/config.json'

export function extractVulnerabilities(auditJson, ignoredAdvisories) {
  return Object.values(auditJson.advisories)
    .map((advisory) => advisory.url)
    .filter(Boolean)
    .filter((url) => !ignoredAdvisories.includes(url))
    .filter((url, i, arr) => arr.indexOf(url) === i)
}

async function fetchIgnoredAdvisories() {
  const res = await fetch(AUDIT_CONFIG_URL)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${AUDIT_CONFIG_URL}`)
  const config = await res.json()
  return config.ignore.npm.map((e) => e.advisory)
}

function runPnpmAudit() {
  let output
  try {
    output = execSync('pnpm audit --json', { encoding: 'utf8' })
  } catch (err) {
    // pnpm audit exits non-zero when vulnerabilities exist; capture stdout anyway
    if (!err.stdout) {
      console.error(`pnpm audit failed to run: ${err.message}`)
      process.exit(1)
    }
    output = err.stdout
  }

  let auditJson
  try {
    auditJson = JSON.parse(output)
  } catch {
    console.error('pnpm audit did not return valid JSON')
    process.exit(1)
  }

  if (auditJson.error) {
    console.error(
      `pnpm audit returned an error: ${auditJson.error.code ?? ''} ${auditJson.error.message ?? JSON.stringify(auditJson.error)}`.trim()
    )
    process.exit(1)
  }

  // Fail closed if the output shape changes, rather than silently passing
  const advisories = auditJson.advisories
  if (
    !advisories ||
    typeof advisories !== 'object' ||
    Array.isArray(advisories) ||
    Object.values(advisories).some(
      (advisory) =>
        !advisory ||
        typeof advisory !== 'object' ||
        typeof advisory.url !== 'string' ||
        advisory.url.length === 0
    )
  ) {
    console.error('Unexpected pnpm audit output shape: malformed "advisories"')
    process.exit(1)
  }

  return auditJson
}

async function main() {
  const ignoredAdvisories = await fetchIgnoredAdvisories()

  if (ignoredAdvisories.length > 0) {
    console.log(`Ignoring npm advisories: ${ignoredAdvisories.join(', ')}`)
  }

  const auditJson = runPnpmAudit()
  const unignored = extractVulnerabilities(auditJson, ignoredAdvisories)

  if (unignored.length > 0) {
    console.log('Audit failed — unignored vulnerabilities:')
    console.log(JSON.stringify(unignored, null, 2))
    process.exit(1)
  }

  console.log('Audit passed — no unignored vulnerabilities found')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
