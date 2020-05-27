eslint-plugin-suitescript
===================

NetSuite SuiteScript v1/v2 linting rules for ESLint

## Installation

This repo currently does not have an NPM listing. To install it, download the source into a folder named `eslint-plugin-suitescript` and place it in your project's `node_modules` folder. From here, you can work with it exactly like any other NPM package.

## Configuration

Add "suitescript" to the plugins section of your ESLint config file.

```json
{
  "plugins": [
    "suitescript"
  ]
}
```

Enable the rules that you would like to use.

```json
  "rules": {
    "react/script-type": "error",
    "react/no-log-module": "error",
  }
```

## List of supported rules

* [suitescript/api-version](docs/rules/api-version.md): Enforces valid `@NApiVersion` tag values
* [suitescript/entry-points](docs/rules/entry-points.md): Enforces inclusion of at least one entry point based on `@NScriptType`
* [suitescript/log-args](docs/rules/log-args.md): Enforces correct log arguments
* [suitescript/module-vars](docs/rules/module-vars.md): Enforces correct module identifiers for each configured module
* [suitescript/no-amd-name](docs/rules/no-amd-name.md): Restricts naming of AMD modules
* [suitescript/no-extra-modules](docs/rules/no-extra-modules.md): Enforces equal number of module literals and identifiers
* [suitescript/no-invalid-modules](docs/rules/no-invalid-modules.md): Enforces valid SuiteScript modules in `define` array
* [suitescript/no-log-module](docs/rules/no-log-module.md): Restricts loading of the N/log module in favor of global `Log`
* [suitescript/script-type](docs/rules/script-type.md): Enforces valid `@NScriptType` tag values

## License

eslint-plugin-suitescript is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).


[npm-url]: https://npmjs.org/package/eslint-plugin-react
[npm-image]: https://img.shields.io/npm/v/eslint-plugin-react.svg

[travis-url]: https://travis-ci.org/yannickcr/eslint-plugin-react
[travis-image]: https://img.shields.io/travis/yannickcr/eslint-plugin-react/master.svg

[deps-url]: https://david-dm.org/yannickcr/eslint-plugin-react
[deps-image]: https://img.shields.io/david/dev/yannickcr/eslint-plugin-react.svg

[coverage-url]: https://coveralls.io/r/yannickcr/eslint-plugin-react?branch=master
[coverage-image]: https://img.shields.io/coveralls/yannickcr/eslint-plugin-react/master.svg

[climate-url]: https://codeclimate.com/github/yannickcr/eslint-plugin-react
[climate-image]: https://img.shields.io/codeclimate/maintainability/yannickcr/eslint-plugin-react.svg

[status-url]: https://github.com/yannickcr/eslint-plugin-react/pulse
[status-image]: https://img.shields.io/github/last-commit/yannickcr/eslint-plugin-react.svg

[tidelift-url]: https://tidelift.com/subscription/pkg/npm-eslint-plugin-react?utm_source=npm-eslint-plugin-react&utm_medium=referral&utm_campaign=readme
[tidelift-image]: https://tidelift.com/badges/github/yannickcr/eslint-plugin-react?style=flat