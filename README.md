[![License][license-img]][license-link]
[![npm][npm-img]][npm-link]
[![CI][ci-img]][ci-link]

# eslint-plugin-suitescript

NetSuite SuiteScript v1/v2 linting rules for ESLint

## Installation

Local installation is highly recommended. First install ESLint:

```sh
$ npm install eslint --save-dev
```

Then install the plugin:

```sh
$ npm install eslint-plugin-suitescript --save-dev
```

## Configuration

Add "suitescript" to the plugins section of your ESLint config file.

```json
"plugins": ["suitescript"]
```

Enable the rules that you would like to use.

```json
"rules": {
  "suitescript/script-type": "error",
  "suitescript/no-log-module": "error",
}
```

Or use a predefined setting for quick setup (choose one).

```json
// All available rules
"extends": ["plugin:suitescript/all"]

// Just the recommended rules
"extends": ["plugin:suitescript/recommended"]
```


## List of supported rules

* [suitescript/api-version](docs/rules/api-version.md): Enforces valid `@NApiVersion` tag values
* [suitescript/entry-points](docs/rules/entry-points.md): Enforces inclusion of at least one entry point based on `@NScriptType`
* [suitescript/log-args](docs/rules/log-args.md): Enforces correct log arguments
* [suitescript/module-vars](docs/rules/module-vars.md): Enforces correct module identifiers for each configured module
* [suitescript/no-amd-name](docs/rules/no-amd-name.md): Restricts naming of AMD modules
* [suitescript/no-extra-modules](docs/rules/no-extra-modules.md): Enforces equal number of module literals and identifiers
* [suitescript/no-invalid-modules](docs/rules/no-invalid-modules.md): Enforces valid SuiteScript modules in `define` array
* [suitescript/no-log-module](docs/rules/no-log-module.md): Restricts loading of the N/log module in favor of global `log`
* [suitescript/no-module-extensions](docs/rules/no-module-extensions.md): Restricts filename extensions on module dependencies
* [suitescript/script-type](docs/rules/script-type.md): Enforces valid `@NScriptType` tag values

## License

eslint-plugin-suitescript is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

[license-img]: https://img.shields.io/github/license/acdvs/eslint-plugin-suitescript
[license-link]: https://github.com/acdvs/eslint-plugin-suitescript/blob/master/LICENSE

[npm-img]: https://img.shields.io/npm/v/eslint-plugin-suitescript
[npm-link]: https://www.npmjs.com/package/eslint-plugin-suitescript

[ci-img]: https://github.com/acdvs/eslint-plugin-suitescript/workflows/CI/badge.svg
[ci-link]: https://github.com/acdvs/eslint-plugin-suitescript/actions
