[![License][license-img]][license-link]
[![npm][npm-img]][npm-link]
[![CI][ci-img]][ci-link]

# eslint-plugin-suitescript

NetSuite SuiteScript v1/v2 linting rules for ESLint

## Installation

```sh
npm i -D eslint eslint-plugin-suitescript
```

Requires `eslint@>=9`. Users on `eslint@<9` (or `.eslintrc.*` configs with `eslint@^9`) should stay on `eslint-plugin-suitescript@^1`.

## Configuration

Create `eslint.config.js` (or `eslint.config.mjs`) in your project root:

```js
import suitescript from 'eslint-plugin-suitescript';

export default [
  ...suitescript.configs.recommended,
  // optional: enable SuiteScript 2.x globals (`log`, `util`)
  ...suitescript.configs.suitescript2,
  // or 1.0 globals (`nlapi*`, `nlobj*`)
  // ...suitescript.configs.suitescript1,
];
```

Or wire rules manually:

```js
import suitescript from 'eslint-plugin-suitescript';

export default [
  {
    plugins: { suitescript },
    rules: {
      'suitescript/script-type': 'error',
      'suitescript/no-log-module': 'error',
    },
  },
];
```

## Upgrading

See the [upgrade guide](docs/upgrade.md) for details on upgrading the package to a new major version.

## List of supported rules

- [suitescript/api-version](docs/rules/api-version.md): Enforces valid `@NApiVersion` tag values
- [suitescript/entry-points](docs/rules/entry-points.md): Enforces inclusion of at least one entry point based on `@NScriptType`
- [suitescript/log-args](docs/rules/log-args.md): Enforces correct log arguments
- [suitescript/module-vars](docs/rules/module-vars.md): Enforces correct module identifiers for each configured module
- [suitescript/no-invalid-modules](docs/rules/no-invalid-modules.md): Enforces valid SuiteScript modules in `define` array
- [suitescript/no-log-module](docs/rules/no-log-module.md): Restricts loading of the N/log module in favor of global `log`
- [suitescript/script-type](docs/rules/script-type.md): Enforces valid `@NScriptType` tag values

## License

eslint-plugin-suitescript is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

[license-img]: https://img.shields.io/github/license/acdvs/eslint-plugin-suitescript
[license-link]: https://github.com/acdvs/eslint-plugin-suitescript/blob/master/LICENSE
[npm-img]: https://img.shields.io/npm/v/eslint-plugin-suitescript
[npm-link]: https://www.npmjs.com/package/eslint-plugin-suitescript
[ci-img]: https://github.com/acdvs/eslint-plugin-suitescript/workflows/CI/badge.svg
[ci-link]: https://github.com/acdvs/eslint-plugin-suitescript/actions
