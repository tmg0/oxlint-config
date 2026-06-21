import { tmg0 } from '@tmg0/oxlint-config'

// Dogfood: lint this package with its own config.
// dist/ and node_modules/ are excluded via .gitignore (oxlint honors it natively);
// only the intentionally-broken test fixtures need an explicit ignore.
export default tmg0({
  ignores: ['tests/fixtures/**'],
})
