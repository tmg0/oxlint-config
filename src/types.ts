export type Severity = 'off' | 'warn' | 'error'

/** A single oxlint rule value: a severity, or `[severity, ...options]`. */
export type RuleEntry = Severity | [Severity, ...unknown[]]

/** A JS plugin entry for oxlint's `jsPlugins` (alpha). */
export type JsPlugin = string | { name: string; specifier: string }

export interface OxlintOverride {
  files?: string[]
  excludeFiles?: string[]
  rules?: Record<string, unknown>
  plugins?: string[]
  jsPlugins?: JsPlugin[]
  env?: Record<string, boolean>
  globals?: Record<string, 'readonly' | 'writable' | 'off'>
}

/** A minimal, self-contained model of oxlint's config object (`.oxlintrc` / `oxlint.config.ts`). */
export interface OxlintConfig {
  plugins?: string[]
  jsPlugins?: JsPlugin[]
  categories?: Record<string, Severity>
  rules?: Record<string, unknown>
  overrides?: OxlintOverride[]
  settings?: Record<string, unknown>
  env?: Record<string, boolean>
  globals?: Record<string, 'readonly' | 'writable' | 'off'>
  ignorePatterns?: string[]
  extends?: string[]
}

export interface Tmg0Options {
  /** TypeScript rules, scoped to `.ts`/`.tsx`. @default true */
  typescript?: boolean
  /** Vue rules, scoped to `.vue`. Note: oxlint's vue coverage is partial. @default false */
  vue?: boolean
  /** Test-file rules (vitest), scoped to test globs. @default false */
  test?: boolean
  /** JSDoc rules. @default true */
  jsdoc?: boolean
  /** unicorn best-practice rules. @default true */
  unicorn?: boolean
  /** import rules. @default true */
  imports?: boolean
  /** node rules. @default true */
  node?: boolean
  /**
   * import/export sorting via `eslint-plugin-perfectionist` (loaded as an oxlint JS plugin).
   * This owns import ordering — keep oxfmt's `sortImports` disabled to avoid conflicts.
   * @default true
   */
  perfectionist?: boolean
  /**
   * Layer oxlint's own `correctness` category on top of antfu's rules.
   * When `false`, only antfu-derived rules run (faithful reproduction).
   * @default false
   */
  oxlintRecommended?: boolean
  /** Extra globs to ignore. */
  ignores?: string[]
  /** Extra oxlint rules, merged last (win over everything). */
  rules?: Record<string, unknown>
  /** Extra raw overrides, appended last. */
  overrides?: OxlintOverride[]
}
