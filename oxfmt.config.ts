import { tmg0 } from '@tmg0/oxlint-config/oxfmt'

// Dogfood: format this package with the antfu-style preset.
// Ignores come from .gitignore/.prettierignore, which oxfmt honors natively.
export default tmg0()
