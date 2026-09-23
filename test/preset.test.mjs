import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const presetPath = fileURLToPath(new URL('../default.json', import.meta.url))
const preset = JSON.parse(readFileSync(presetPath, 'utf8'))

const FIRST_PARTY = [
  'pg-core',
  'pg-cli',
  'pg-pkg',
  'pg-ffi',
  'pg-wasm',
  'cryptify',
  '@e4a/**',
  'E4A.PostGuard',
]

test('first-party rule disables every first-party package and is last', () => {
  const rules = preset.packageRules
  assert.ok(Array.isArray(rules) && rules.length > 0, 'packageRules must be a non-empty array')

  const lastRule = rules[rules.length - 1]
  assert.equal(lastRule.enabled, false, 'the last packageRules entry must be enabled: false')
  assert.ok(Array.isArray(lastRule.matchPackageNames), 'the last rule must use matchPackageNames')

  for (const name of FIRST_PARTY) {
    assert.ok(
      lastRule.matchPackageNames.includes(name),
      `first-party rule must list ${name}`
    )
  }

  const disablingRules = rules.filter((rule) => rule.enabled === false)
  assert.equal(
    disablingRules.length,
    1,
    'exactly one packageRules entry disables packages, and it must be the last one'
  )
  assert.equal(
    rules.indexOf(disablingRules[0]),
    rules.length - 1,
    'the first-party disabling rule must be the last packageRules entry'
  )
})

test('automerge is false or absent everywhere', () => {
  assert.notEqual(preset.automerge, true, 'top-level automerge must not be true')

  for (const rule of preset.packageRules ?? []) {
    assert.notEqual(rule.automerge, true, `packageRules entry must not set automerge: true — ${JSON.stringify(rule)}`)
  }
})

test('major updates require Dependency Dashboard approval', () => {
  const majorRule = preset.packageRules.find(
    (rule) => Array.isArray(rule.matchUpdateTypes) && rule.matchUpdateTypes.includes('major')
  )
  assert.ok(majorRule, 'a packageRules entry must matchUpdateTypes: ["major", ...]')
  assert.equal(majorRule.dependencyDashboardApproval, true)
})

test('schedule and timezone match the fleet-wide agreement', () => {
  assert.deepEqual(preset.schedule, ['before 6am on monday'])
  assert.equal(preset.timezone, 'Europe/Amsterdam')
})
