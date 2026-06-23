# @tmg0/oxlint-config

[![npm version](https://img.shields.io/npm/v/@tmg0/oxlint-config?color=cb3837&logo=npm)](https://www.npmjs.com/package/@tmg0/oxlint-config)

Tamago's personal lint + format preset, powered by [oxlint](https://oxc.rs) and [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) instead of ESLint + Prettier.

The rule set is **inspired by [@antfu/eslint-config](https://github.com/antfu/eslint-config)** — antfu's rule choices were mapped onto the rules oxlint implements — so you get most of antfu's behaviour at oxlint speed, with one line of config. It's a plain, hand-maintained config (no ESLint, no antfu, nothing extra at install time).

> [!NOTE]
> This is not a drop-in replacement for `@antfu/eslint-config`. oxlint is a linter only and can't parse every file type ESLint can. See [Coverage & limitations](#coverage--limitations).

## Compatibility

| `@tmg0/oxlint-config`           | `0.1.0`                           |
| ------------------------------- | --------------------------------- |
| Based on `@antfu/eslint-config` | `9.0.0`                           |
| Targets `oxlint`                | `1.70.0`                          |
| JS/TS rule coverage             | 210 rules (~89% of non-Vue JS/TS) |

## Why

- ⚡ **Fast** — oxlint is a Rust linter; no ESLint runtime in your project.
- 🪶 **Light** — ships only the rule data + a tiny factory. No antfu / ESLint dependency tree in your install.
- 🎯 **Familiar** — antfu's rule choices wherever oxlint supports them.
- 🧼 **Formatting** — antfu-style (single quotes, no semicolons, 2-space, trailing commas) via oxfmt.

## Install

```bash
pnpm add -D @tmg0/oxlint-config oxlint oxfmt
```

Requires Node `>=22.18` (TypeScript config files run on the Node TS loader).

## Usage

### Linting — `oxlint.config.ts`

```ts
import { tmg0 } from '@tmg0/oxlint-config'

export default tmg0()
```

With options:

```ts
import { tmg0 } from '@tmg0/oxlint-config'

export default tmg0({
  vue: true,
  rules: {
    'no-console': 'off',
  },
})
```

### Formatting — `oxfmt.config.ts`

The oxfmt entry mirrors the oxlint one — same `tmg0()` call:

```ts
import { tmg0 } from '@tmg0/oxlint-config/oxfmt'

export default tmg0()
```

With overrides:

```ts
import { tmg0 } from '@tmg0/oxlint-config/oxfmt'

export default tmg0({ printWidth: 120 })
```

### Ignores

Both oxlint and oxfmt read **`.gitignore`** (and oxfmt also `.prettierignore`) from your project root automatically — so build artifacts you already gitignore are skipped without repeating them here. Add anything extra via the `ignores` option (lint) or `--ignore-pattern` (CLI).

### Scripts

```jsonc
{
  "scripts": {
    "lint": "oxlint",
    "lint:fix": "oxlint --fix",
    "format": "oxfmt",
    "format:check": "oxfmt --check",
  },
}
```

oxlint owns **import/export sorting** (via perfectionist), so oxfmt's `sortImports` is left off to avoid the two fighting.

## Options

| Option              | Default | Description                                                          |
| ------------------- | ------- | -------------------------------------------------------------------- |
| `typescript`        | `true`  | TypeScript rules, scoped to `.ts`/`.tsx`.                            |
| `vue`               | `false` | Vue rules, scoped to `.vue`. oxlint's vue coverage is partial.       |
| `test`              | `false` | Test-file rules (vitest), scoped to test globs.                      |
| `jsdoc`             | `true`  | JSDoc rules.                                                         |
| `unicorn`           | `true`  | unicorn best-practice rules.                                         |
| `imports`           | `true`  | import rules.                                                        |
| `node`              | `true`  | node rules.                                                          |
| `perfectionist`     | `true`  | import/export sorting via `eslint-plugin-perfectionist` (JS plugin). |
| `oxlintRecommended` | `false` | Layer oxlint's own `correctness` category on top of antfu's rules.   |
| `ignores`           | —       | Extra globs to ignore.                                               |
| `rules`             | —       | Extra oxlint rules, merged last (win over everything).               |
| `overrides`         | —       | Extra raw oxlint overrides, appended last.                           |

## Coverage & limitations

The rules were derived from `@antfu/eslint-config@9.0.0` and filtered to what oxlint implements.

**Reproduced** (same rule + severity as antfu):

| Plugin        | Coverage          |
| ------------- | ----------------- |
| typescript    | 36 / 36           |
| import        | 6 / 6             |
| unicorn       | 15 / 15           |
| eslint core   | 99 / 109          |
| jsdoc         | 10 / 17           |
| node          | 4 / 8             |
| vitest        | 5 / 6             |
| vue           | 35 / 159          |
| perfectionist | 4 (via JS plugin) |

**210 rules** total — about **89%** of antfu's non-Vue, non-formatting JS/TS rules.

**Not reproduced** (handled elsewhere or unsupported by oxlint):

- **Formatting** (`@stylistic`) → handled by **oxfmt** instead. oxfmt is a Prettier-style formatter, so it can't replicate every lint-based nuance (e.g. antfu's `arrow-parens: as-needed + requireForBlockBody`).
- **`regexp/`** → oxlint has no regexp plugin.
- **`jsonc` / `yaml` / `toml` / `markdown`** → oxlint can't parse these file types. Use oxfmt for formatting them.
- **Vue / Svelte / Astro templates** → oxlint currently extracts the `<script>` block and **ignores the `<template>`**, so template-logic rules (e.g. `vue/require-v-for-key`, `vue/no-use-v-if-with-v-for`) can't run. The JS-plugin system can't fill this gap either: it has no custom-parser support, so `eslint-plugin-vue` loads but its rules go inert (they bail out asking for `vue-eslint-parser`). Formatting of `.vue` (template included) is still handled by oxfmt. Full SFC support is planned via oxc's **language-plugin system** (lower SFCs to "virtual" TS) — see the RFC at [oxc-project/oxc#21936](https://github.com/oxc-project/oxc/discussions/21936). Svelte/Astro are unsupported for the same reason.
- Misc antfu-specific plugins (`antfu/`, `command/`, `eslint-comments/`, `unused-imports/`, `e18e/`).

Inspect the rule groups, perfectionist rules, the known gaps, and provenance at runtime:

```ts
import { GAPS, GEN_META, RULE_GROUPS } from '@tmg0/oxlint-config'
```

## Updating

The rules live in [`src/rules.ts`](./src/rules.ts) as plain data — edit it directly to add, drop, or re-tune rules. There is no antfu dependency and no codegen; this preset does not auto-track antfu. To re-baseline against a newer antfu by hand, diff its rules against `src/rules.ts` and update the [Compatibility](#compatibility) table.

## License

MIT © tmg0
