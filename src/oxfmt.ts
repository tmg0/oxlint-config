/**
 * oxfmt preset mirroring `@antfu/eslint-config`'s formatting style as closely as a
 * Prettier-like formatter can: single quotes, no semicolons, 2-space indent,
 * trailing commas. (oxfmt cannot replicate every lint-based stylistic nuance,
 * e.g. antfu's `arrow-parens: as-needed + requireForBlockBody`.)
 *
 * Ignores are sourced from `.gitignore`/`.prettierignore` by oxfmt itself, so
 * this preset does not hardcode any.
 */
export interface OxfmtConfig {
  printWidth?: number
  tabWidth?: number
  useTabs?: boolean
  semi?: boolean
  singleQuote?: boolean
  jsxSingleQuote?: boolean
  quoteProps?: 'as-needed' | 'consistent' | 'preserve'
  trailingComma?: 'all' | 'es5' | 'none'
  arrowParens?: 'always' | 'avoid'
  bracketSpacing?: boolean
  insertFinalNewline?: boolean
  /**
   * Import sorting is owned by the linter (perfectionist via the oxlint `tmg0()`),
   * so keep this disabled to avoid the formatter and linter fighting over order.
   */
  sortImports?: boolean | Record<string, unknown>
  [key: string]: unknown
}

/** The antfu-style oxfmt preset (raw object). */
export const preset: OxfmtConfig = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  jsxSingleQuote: false,
  quoteProps: 'consistent',
  trailingComma: 'all',
  arrowParens: 'avoid',
  bracketSpacing: true,
  insertFinalNewline: true,
  sortImports: false,
}

/**
 * Build an antfu-style oxfmt config, merging your overrides onto the preset.
 *
 * @example
 * ```ts
 * // oxfmt.config.ts
 * import { tmg0 } from '@tmg0/oxlint-config/oxfmt'
 * export default tmg0()
 * ```
 */
export function tmg0(overrides: OxfmtConfig = {}): OxfmtConfig {
  return { ...preset, ...overrides }
}

export { tmg0 as default }
