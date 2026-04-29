# ESLint 9/10 Migration — Design

**Date:** 2026-04-29
**Target version:** `eslint-plugin-suitescript@2.0.0`
**Strategy:** Hard cut to flat config; drop `eslintrc` and ESLint 8 support.

## Goal

Make the plugin compatible with ESLint 9 and ESLint 10. Replace the legacy `eslintrc`-style configuration export with flat config, remove the deprecated `environments` API, and update all uses of deprecated `RuleContext`/`RuleTester` APIs.

## Non-Goals

- Backwards compatibility with ESLint 8 or `.eslintrc.*`. Users on those versions must stay on `eslint-plugin-suitescript@1.x`.
- Refactoring rule logic. Rules keep their current behavior; only deprecated API touch points change.
- Adding new rules or removing existing ones.
- TypeScript migration of the plugin source.

## Compatibility

- **ESLint:** `>= 9.0.0`. Tested primarily against ESLint 10.
- **Node.js:** `^20.19.0 || ^22.13.0 || >=24` (ESLint 10 requirement).

## Public API

### Plugin Export

```js
const plugin = {
  meta: { name: 'eslint-plugin-suitescript', version: '2.0.0' },
  rules: {
    /* 10 rules, unchanged */
  },
  configs: {
    recommended: [
      /* flat config */
    ],
    all: [
      /* flat config */
    ],
    suitescript1: [
      /* SuiteScript 1.0 globals only */
    ],
    suitescript2: [
      /* SuiteScript 2.x globals only */
    ],
  },
};
```

### Consumer Usage

```js
// eslint.config.js
import suitescript from 'eslint-plugin-suitescript';

export default [
  ...suitescript.configs.recommended,
  ...suitescript.configs.suitescript2, // optional: load SS2 globals
];
```

### Removed Exports

- `environments` (replaced by `configs.suitescript1` and `configs.suitescript2`).
- Legacy `eslintrc`-shaped `configs.recommended` / `configs.all` (replaced by flat-config arrays).

## Internal Changes

### Deprecated API Replacements

Two locations use `context.getSourceCode()` (removed in ESLint 9):

| File                       | Line | Change                                           |
| -------------------------- | ---- | ------------------------------------------------ |
| `lib/rules/api-version.js` | 18   | `context.getSourceCode()` → `context.sourceCode` |
| `lib/util/metadata.js`     | 14   | `context.getSourceCode()` → `context.sourceCode` |

### File Reorganization

- Rename `lib/environments.js` → `lib/util/globals.js`.
- The file now exports two flat globals objects (`suitescript1`, `suitescript2`) instead of `environments` wrappers. Values switch from `false`/`true` to the flat-config equivalents (`'readonly'`/`'writable'`).

### Rule Meta

All ten rules receive `schema: []` (or a real schema for `module-vars`, which accepts options):

```js
meta: {
  type: 'problem',
  schema: [],            // suppresses ESLint 9+ schema warning
  docs: {
    description: '…',
    url: 'https://github.com/acdvs/eslint-plugin-suitescript/blob/master/docs/rules/<rule>.md',
  },
  messages: { /* … */ },
}
```

`module-vars` schema:

```js
schema: [
  { type: 'array', items: { type: 'object' } },
],
```

### `lib/index.js` Rewrite

The file is rewritten to export a flat-config plugin object (see "Plugin Export" above). Helper:

```js
const ruleSeverity = (rules) =>
  Object.fromEntries(rules.map((r) => [`suitescript/${r}`, 'error']));
```

`recommended` and `all` configs each contain one flat-config object that registers the plugin (`plugins: { suitescript: plugin }`), sets `languageOptions.sourceType = 'module'`, declares `log` as a readonly global, and turns on the rules.

### Tests

All ten files in `tests/rules/*.js` migrate from:

```js
const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
});
```

to:

```js
const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2015, sourceType: 'module' },
});
```

Test cases (`valid`/`invalid`) are unchanged.

## `package.json`

```json
{
  "version": "2.0.0",
  "peerDependencies": {
    "eslint": ">=9.0.0"
  },
  "engines": {
    "node": "^20.19.0 || ^22.13.0 || >=24"
  },
  "devDependencies": {
    "eslint": "^10.0.0",
    "eslint-config-prettier": "^10.1.5",
    "globals": "^15.0.0",
    "mocha": "^11.4.0",
    "prettier": "^3.5.3"
  }
}
```

## Documentation

### `README.md`

The `Configuration` section is rewritten to show flat-config usage. A new `Migration from v1.x` section lists the breaking changes:

- `extends: ['plugin:suitescript/recommended']` → `...suitescript.configs.recommended` (spread)
- `env: { 'suitescript/suitescript2': true }` → `...suitescript.configs.suitescript2`
- ESLint 8 / `.eslintrc.*` users stay on `eslint-plugin-suitescript@1`.

### `CHANGELOG.md` (new file)

Initial entry covers `2.0.0`: breaking changes, internal changes, compatibility floor.

### `AGENTS.md` (new file)

Repo-level guidance for AI coding agents. Covers:

- **Project type:** ESLint flat-config plugin for NetSuite SuiteScript v1/v2.
- **Setup:** `npm install`.
- **Common commands:** `npm test`, `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run build:docs`.
- **Layout:**
  - `lib/index.js` — plugin entry point (configs + rules registration)
  - `lib/rules/` — one file per rule
  - `lib/util/` — shared helpers (`metadata`, `modules`, `script-types`, `globals`, …)
  - `tests/rules/` — one mocha test file per rule, using ESLint `RuleTester`
  - `docs/src/` — doc templates (with `<TOKEN>` placeholders)
  - `docs/rules/` — generated rule docs (output of `npm run build:docs`)
- **API conventions for new/edited rules:**
  - Use `context.sourceCode` (never `context.getSourceCode()`).
  - Provide `meta.schema` (use `[]` for option-less rules).
  - Provide `meta.messages` and report via `messageId` rather than inline strings.
  - Provide `meta.docs.url` pointing at the rule's `docs/rules/*.md`.
- **Test conventions:**
  - `RuleTester` is configured with `languageOptions`, never `parserOptions`.
  - Each rule has a corresponding `tests/rules/<rule>.js` with both `valid` and `invalid` cases.
- **Adding a new rule (checklist):**
  1. Create `lib/rules/<rule>.js`.
  2. Register it in `lib/index.js` (`allRules` map and the `recommended`/`all` configs).
  3. Add `tests/rules/<rule>.js` with `valid` and `invalid` cases.
  4. Add a doc template in `docs/src/<rule>.md`.
  5. Run `npm run build:docs` to regenerate `docs/rules/<rule>.md`.
  6. Add the rule to the list in `README.md`.
- **Commit conventions:** English, imperative mood (e.g. `Migrate to ESLint 9+ flat config`).
- **Out of scope for agents without explicit instruction:**
  - Bumping the `peerDependencies` floor.
  - Adding TypeScript or transpilation.
  - Changing the public `configs` shape.

### Untouched

- `docs/rules/*.md` — inline `/* eslint suitescript/<rule>: "error" */` examples are flat-config compatible.
- `docs/src/*` — doc source templates.
- `scripts/generate_docs.js` — independent of ESLint config format.

## Implementation Order

1. Add `lib/util/globals.js` with the two globals objects; delete `lib/environments.js`.
2. Replace `context.getSourceCode()` → `context.sourceCode` in `lib/rules/api-version.js` and `lib/util/metadata.js`.
3. Add `meta.schema` (and `meta.docs.description`/`meta.docs.url`) to each rule in `lib/rules/*.js`. Add a real schema to `module-vars`.
4. Rewrite `lib/index.js` to export the flat-config plugin shape.
5. Migrate all ten `tests/rules/*.js` from `parserOptions` to `languageOptions`.
6. Update `package.json` (version, `peerDependencies`, `engines`, `devDependencies`).
7. Run `npm install`, `npm test`, `npm run lint` to verify the migration end-to-end.
8. Rewrite `README.md` `Configuration` section and add `Migration from v1.x`. Add `CHANGELOG.md`.
9. Add `AGENTS.md` at the repo root.

## Verification

- `npm test` — all existing rule tests pass under the new `RuleTester` API.
- `npm run lint` — the plugin's own source still lints cleanly.
- Manual smoke test: a sample SuiteScript file (`@NApiVersion 2.x`, `@NScriptType Suitelet`, `define([...], function(...) {})`) lints with `eslint.config.js` importing `suitescript.configs.recommended` and reports no false positives.

## Risks

- **Schema for `module-vars`:** the rule already accepts a complex `MODULES` payload. The proposed loose schema (`{ type: 'array', items: { type: 'object' } }`) is permissive on purpose — tightening it is out of scope and tracked as a follow-up.
- **`globals` package version:** if the dev environment pins an older `globals` package, the docs example may diverge. The plugin itself does not depend on `globals` at runtime (we ship our own SuiteScript globals).
- **Consumer migration friction:** users will see config errors after `npm install` of v2 unless they also migrate to `eslint.config.js`. Mitigated by the `Migration from v1.x` section and a 2.0.0 major bump.
