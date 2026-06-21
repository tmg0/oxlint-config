import type { GroupKey } from './rules'
import type { JsPlugin, OxlintConfig, OxlintOverride, Tmg0Options } from './types'
import { createRequire } from 'node:module'
import { PERFECTIONIST_RULES, RULE_GROUPS } from './rules'

const require = createRequire(import.meta.url)

/** Resolve perfectionist to an absolute path so oxlint can load it regardless of node_modules layout. */
function perfectionistPlugin(): JsPlugin {
  try {
    return { name: 'perfectionist', specifier: require.resolve('eslint-plugin-perfectionist') }
  } catch {
    return { name: 'perfectionist', specifier: 'eslint-plugin-perfectionist' }
  }
}

/** Map each rule group to the option flag that enables it. */
const GROUP_OPTION: Record<GroupKey, keyof Tmg0Options | true> = {
  js: true,
  ts: 'typescript',
  imports: 'imports',
  unicorn: 'unicorn',
  node: 'node',
  jsdoc: 'jsdoc',
  vue: 'vue',
  test: 'test',
}

const DEFAULTS: Required<Omit<Tmg0Options, 'ignores' | 'rules' | 'overrides'>> = {
  typescript: true,
  vue: false,
  test: false,
  jsdoc: true,
  unicorn: true,
  imports: true,
  node: true,
  perfectionist: true,
  oxlintRecommended: false,
}

/**
 * Build an oxlint config that reproduces `@antfu/eslint-config`'s rule choices,
 * filtered to the rules oxlint actually implements.
 *
 * Formatting is intentionally NOT handled here — pair this with oxfmt
 * (`@tmg0/oxlint-config/oxfmt`) for antfu-style formatting.
 *
 * @example
 * ```ts
 * // oxlint.config.ts
 * import { tmg0 } from '@tmg0/oxlint-config'
 * export default tmg0({ vue: true })
 * ```
 */
export function tmg0(options: Tmg0Options = {}): OxlintConfig {
  const o = { ...DEFAULTS, ...options }

  const plugins = new Set<string>(['eslint'])
  const rules: Record<string, unknown> = {}
  const overrides: OxlintOverride[] = []

  for (const key of Object.keys(RULE_GROUPS) as GroupKey[]) {
    const flag = GROUP_OPTION[key]
    if (flag !== true && !o[flag]) continue

    const group = RULE_GROUPS[key]
    for (const p of group.plugins) plugins.add(p)

    if (group.files == null) Object.assign(rules, group.rules)
    else overrides.push({ files: group.files, rules: group.rules })
  }

  const jsPlugins: JsPlugin[] = []
  if (o.perfectionist) {
    jsPlugins.push(perfectionistPlugin())
    Object.assign(rules, PERFECTIONIST_RULES)
  }

  // User extras win over everything derived above.
  if (options.rules) Object.assign(rules, options.rules)
  if (options.overrides) overrides.push(...options.overrides)

  const config: OxlintConfig = {
    plugins: [...plugins],
    // Faithful reproduction: only antfu-derived rules run unless the user opts
    // back into oxlint's own recommended set.
    categories: o.oxlintRecommended ? { correctness: 'warn' } : { correctness: 'off' },
    rules,
    overrides,
  }

  if (jsPlugins.length) config.jsPlugins = jsPlugins
  if (options.ignores?.length) config.ignorePatterns = options.ignores

  return config
}
