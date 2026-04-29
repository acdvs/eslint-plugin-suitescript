# Changelog

## 2.0.0

### Breaking

- Drop ESLint 8 / `.eslintrc.*` config support. Flat config (`eslint.config.js`) is now required.
- Remove the `environments` plugin export. SuiteScript globals are now delivered via the new flat configs `configs.suitescript1` and `configs.suitescript2`.
- Rename plugin export to a flat-config plugin object with `meta`, `rules`, and `configs`.

### Internal

- Replace deprecated `context.getSourceCode()` with `context.sourceCode`.
- Add `meta.schema` to all rules.
- Add `meta.docs.description` and `meta.docs.url` to all rules.
- Migrate `RuleTester` setup from `parserOptions` to `languageOptions`.

### Compatibility

- Requires ESLint `>= 9.0.0`.
- Requires Node.js `^20.19.0 || ^22.13.0 || >=24`.
