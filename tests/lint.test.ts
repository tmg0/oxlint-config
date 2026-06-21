import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { beforeAll, describe, expect, it } from 'vitest'
import { tmg0 } from '../src'

// Drive the real oxlint binary against fixtures, using a config produced by
// tmg0(). This proves the baked rules + perfectionist JS plugin actually run.

const here = dirname(fileURLToPath(import.meta.url))
const oxlintBin = resolve(here, '../node_modules/.bin/oxlint')
const fixtures = join(here, 'fixtures')

let configPath: string

beforeAll(() => {
  const dir = mkdtempSync(join(tmpdir(), 'tmg0-lint-'))
  configPath = join(dir, '.oxlintrc.json')
  writeFileSync(
    configPath,
    JSON.stringify(tmg0({ typescript: true, perfectionist: true }), null, 2),
  )
})

function lint(file: string): string {
  try {
    return execFileSync(oxlintBin, ['--config', configPath, join(fixtures, file)], {
      encoding: 'utf8',
    })
  } catch (error) {
    const e = error as { stdout?: string; stderr?: string }
    return `${e.stdout ?? ''}${e.stderr ?? ''}`
  }
}

describe('linting fixtures with tmg0()', () => {
  it('flags core antfu rules on messy code', () => {
    const out = lint('messy.ts')
    expect(out).toContain('eslint(no-var)')
    expect(out).toContain('eslint(eqeqeq)')
    expect(out).toContain('eslint(prefer-const)')
  })

  it('runs the perfectionist JS plugin (import sorting)', () => {
    const out = lint('messy.ts')
    expect(out).toContain('perfectionist(sort-named-imports)')
  })

  it('reports no problems on clean code', () => {
    const out = lint('clean.ts')
    expect(out).not.toMatch(/\b(?:error|warning)\b/)
  })
})
