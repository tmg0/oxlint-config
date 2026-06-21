import { describe, expect, it } from 'vitest'
import { tmg0 } from '../src'

describe('tmg0() factory shape', () => {
  it('produces a faithful (categories-off) config by default', () => {
    const c = tmg0()
    expect(c.categories).toEqual({ correctness: 'off' })
    expect(c.plugins).toContain('typescript')
    expect(c.plugins).toContain('unicorn')
    expect(c.plugins).toContain('import')
    expect(c.jsPlugins?.[0]).toMatchObject({ name: 'perfectionist' })
  })

  it('gates optional groups behind options', () => {
    const off = tmg0({ vue: false, test: false })
    expect(off.plugins).not.toContain('vue')
    expect(off.plugins).not.toContain('vitest')
    const on = tmg0({ vue: true, test: true })
    expect(on.plugins).toContain('vue')
    expect(on.plugins).toContain('vitest')
    expect(on.overrides?.some(o => o.files?.some(f => f.endsWith('.vue')))).toBe(true)
  })

  it('omits perfectionist when disabled', () => {
    const c = tmg0({ perfectionist: false })
    expect(c.jsPlugins).toBeUndefined()
    expect(Object.keys(c.rules ?? {}).some(r => r.startsWith('perfectionist/'))).toBe(false)
  })

  it('lets user rules win', () => {
    const c = tmg0({ rules: { 'no-var': 'off' } })
    expect(c.rules?.['no-var']).toBe('off')
  })
})
