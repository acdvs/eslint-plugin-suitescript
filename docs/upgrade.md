# Upgrading to v2

With v2, the plugin only supports flag config, so the following changes should be made:

- Replace `.eslintrc.*` with `eslint.config.js`.
- Replace `extends: ['plugin:suitescript/recommended']` with `...suitescript.configs.recommended` (spread).
- Replace `env: { 'suitescript/suitescript2': true }` with `...suitescript.configs.suitescript2`.
- Bump `eslint` to `>= 9` in your project.

`configs.recommended` already declares the AMD globals (`define`, `require`) and the standard browser globals (`window`, `document`, ...) that v1's `env: { amd: true, browser: true }` provided, so `no-undef` keeps working on `define([...], function() {})` modules and on client scripts that touch the DOM.

Stay on `eslint-plugin-suitescript@^1` if you cannot migrate.

# Upgrading to v3

With v3, general AMD rules have been abstracted to the [`@acdvs/eslint-plugin-amd`][eslint-plugin-amd] plugin:

- Rule `suitescript/no-amd-name` is replaced by `amd/no-name`.
- Rule `suitescript/no-extra-modules` is replaced by both `amd/no-extra-deps` and `amd/no-extra-params`.
- Rule `suitescript/no-module-extensions` is replaced by `amd/no-module-extensions`.

[eslint-plugin-amd]: https://www.npmjs.com/package/@acdvs/eslint-plugin-amd