# ESLint 9/10 Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate `eslint-plugin-suitescript` from ESLint 8 / eslintrc-style configs to ESLint 9/10 flat-config-only, releasing as `2.0.0`.

**Architecture:** Hard cut: drop legacy `eslintrc` config export and the `environments` API. Plugin exports a flat-config-shaped object with `meta`, `rules`, and `configs` (arrays of flat-config blocks). Globals previously delivered via `environments` are exposed as the new `configs.suitescript1` and `configs.suitescript2` flat configs.

**Tech Stack:** Node.js 18.18+, ESLint 9/10, Mocha (existing), Prettier (existing). No new runtime dependencies.

**Branch:** `feat/eslint-flat-config-v2` (already created).

**Spec:** `docs/superpowers/specs/2026-04-29-eslint-10-migration-design.md`.

---

### Task 1: Verify baseline before any change

**Files:** none (verification only).

- [ ] **Step 1: Confirm clean working tree on the feature branch**

Run:
```bash
git status
git rev-parse --abbrev-ref HEAD
```

Expected: clean tree, branch `feat/eslint-flat-config-v2`.

- [ ] **Step 2: Install current deps and run the existing test suite**

Run:
```bash
npm install
npm test
```

Expected: install succeeds with ESLint 8.57.1 (current devDep). All Mocha tests pass.

If tests fail here, STOP and investigate — the migration must start from a green baseline.

---

### Task 2: Replace deprecated `context.getSourceCode()`

**Files:**
- Modify: `lib/util/metadata.js:14`
- Modify: `lib/rules/api-version.js:18`

`context.sourceCode` exists since ESLint 8.40, so this change is safe under the current ESLint 8.57 dev dep too.

- [ ] **Step 1: Edit `lib/util/metadata.js` line 14**

Replace:
```js
  const sourceCode = context.getSourceCode();
```
with:
```js
  const sourceCode = context.sourceCode;
```

- [ ] **Step 2: Edit `lib/rules/api-version.js` line 18**

Replace:
```js
      const sourceCode = context.getSourceCode();
```
with:
```js
      const sourceCode = context.sourceCode;
```

- [ ] **Step 3: Run tests**

Run:
```bash
npm test
```

Expected: all tests still green (rule behavior unchanged).

- [ ] **Step 4: Commit**

Run:
```bash
git add lib/util/metadata.js lib/rules/api-version.js
git commit -m "Replace deprecated context.getSourceCode() with context.sourceCode"
```

---

### Task 3: Bump `package.json` to ESLint 10 and v2.0.0

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update fields**

Edit `package.json` so the relevant fields read:

```json
{
  "version": "2.0.0",
  "peerDependencies": {
    "eslint": ">=9.0.0"
  },
  "engines": {
    "node": ">=18.18.0"
  },
  "devDependencies": {
    "eslint": "^10.0.0",
    "eslint-config-prettier": "^10.1.5",
    "mocha": "^11.4.0",
    "prettier": "^3.5.3"
  }
}
```

Leave `name`, `description`, `author`, `license`, `repository`, `bugs`, `homepage`, `main`, `scripts`, `files`, `keywords` untouched.

- [ ] **Step 2: Reinstall to pull ESLint 10**

Run:
```bash
npm install
```

Expected: installs `eslint@^10.0.0`. The yarn.lock will become stale; we will not regenerate it (the project's `npm` lockfile, if any, will be updated automatically).

- [ ] **Step 3: Run tests — they will fail**

Run:
```bash
npm test
```

Expected: tests fail because `RuleTester` in ESLint 9+ no longer accepts `parserOptions` at the top level. The next task fixes this.

- [ ] **Step 4: Commit (red state, with explanation)**

Run:
```bash
git add package.json package-lock.json
git commit -m "Bump eslint devDep to v10 and peerDep floor to v9"
```

If `package-lock.json` was not generated (project uses yarn), substitute `yarn.lock` or skip the lockfile from `git add`.

---

### Task 4: Migrate `RuleTester` calls in tests

**Files:**
- Modify (10 files): `tests/rules/api-version.js`, `tests/rules/entry-points.js`, `tests/rules/log-args.js`, `tests/rules/module-vars.js`, `tests/rules/no-amd-name.js`, `tests/rules/no-extra-modules.js`, `tests/rules/no-invalid-modules.js`, `tests/rules/no-log-module.js`, `tests/rules/no-module-extensions.js`, `tests/rules/script-type.js`

The mechanical change in each file:

**Before:**
```js
const parserOptions = {
  ecmaVersion: 2015,
  sourceType: 'module',
};

const ruleTester = new RuleTester({ parserOptions });
```

**After:**
```js
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
});
```

If a specific test file overrides `parserOptions` per test case (e.g. `{ code, parserOptions: { ... } }`), move the same fields into a `languageOptions` key on that test case.

- [ ] **Step 1: Apply the rewrite to all 10 files**

For each file in `tests/rules/`:
1. Remove the `const parserOptions = { ... };` block.
2. Replace `new RuleTester({ parserOptions })` with `new RuleTester({ languageOptions: { ecmaVersion: 2015, sourceType: 'module' } })`.
3. If any per-test-case `parserOptions` field exists, rename it to `languageOptions` (same shape).

- [ ] **Step 2: Run tests**

Run:
```bash
npm test
```

Expected: all tests green.

- [ ] **Step 3: Commit**

Run:
```bash
git add tests/rules/
git commit -m "Migrate RuleTester to languageOptions"
```

---

### Task 5: Add `meta.schema` to rules that lack it

**Files:** Each rule file under `lib/rules/` whose `meta` object does not define `schema`.

`module-vars.js` already has a real schema — leave it alone.

For every other rule, add `schema: []` directly under `meta.type`. Example for `lib/rules/script-type.js`:

```js
module.exports = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      invalidValue: 'Invalid @NScriptType value: {{ value }}',
      noValue: 'No @NScriptType value provided',
    },
  },
  // …
};
```

- [ ] **Step 1: Identify files needing the change**

Run:
```bash
grep -L "schema:" lib/rules/*.js
```

Expected: a list of rule files without `schema`. (`module-vars.js` will be absent because it already has one.)

- [ ] **Step 2: Add `schema: []` to each listed file**

For each listed rule, insert `schema: [],` between `type:` and `messages:` inside `meta`.

- [ ] **Step 3: Run tests**

Run:
```bash
npm test
```

Expected: all tests green, no schema-related warnings.

- [ ] **Step 4: Commit**

Run:
```bash
git add lib/rules/
git commit -m "Add schema: [] to option-less rules"
```

---

### Task 6: Create `lib/util/globals.js` (replaces `lib/environments.js`)

**Files:**
- Create: `lib/util/globals.js`

The new file exposes the same NetSuite globals as plain `globals` objects (no `environments` wrapper), with values switched from `false` to `'readonly'` (flat-config equivalent).

- [ ] **Step 1: Create the file**

Create `lib/util/globals.js` with:

```js
'use strict';

module.exports = {
  suitescript2: {
    log: 'readonly',
    util: 'readonly',
  },
  suitescript1: {
    createSubrecord: 'readonly',
    editSubrecord: 'readonly',
    // … (copy every key from lib/environments.js#suitescript1.globals,
    //    with value 'readonly')
    // Generation hint: in lib/environments.js, replace `: false` with `: 'readonly'`,
    // drop the `globals:` wrapper and the `environments` outer keys.
  },
};
```

When generating the file, take the full list of identifiers from the existing `lib/environments.js` `suitescript1.globals` block (each `name: false` becomes `name: 'readonly'`).

- [ ] **Step 2: Sanity check the export shape**

Run:
```bash
node -e "const g = require('./lib/util/globals'); console.log(Object.keys(g.suitescript1).length, Object.keys(g.suitescript2).length);"
```

Expected output (matches the current `environments.js` count): a number around `170` for `suitescript1` and `2` for `suitescript2`.

- [ ] **Step 3: Commit**

Run:
```bash
git add lib/util/globals.js
git commit -m "Add lib/util/globals.js with SuiteScript 1/2 globals"
```

(`lib/environments.js` is deleted in Task 7 along with the `index.js` rewrite, so the two changes commit together.)

---

### Task 7: Rewrite `lib/index.js` and delete `lib/environments.js`

**Files:**
- Modify: `lib/index.js` (full rewrite)
- Delete: `lib/environments.js`

- [ ] **Step 1: Replace `lib/index.js` with the flat-config plugin shape**

Overwrite `lib/index.js` with:

```js
'use strict';

const { MODULES } = require('./util/modules');
const globals = require('./util/globals');

const allRules = {
  'script-type': require('./rules/script-type'),
  'api-version': require('./rules/api-version'),
  'no-invalid-modules': require('./rules/no-invalid-modules'),
  'no-extra-modules': require('./rules/no-extra-modules'),
  'no-log-module': require('./rules/no-log-module'),
  'log-args': require('./rules/log-args'),
  'module-vars': require('./rules/module-vars'),
  'no-amd-name': require('./rules/no-amd-name'),
  'entry-points': require('./rules/entry-points'),
  'no-module-extensions': require('./rules/no-module-extensions'),
};

const pkg = require('../package.json');

const plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules: allRules,
};

const ruleNames = [
  'api-version',
  'entry-points',
  'log-args',
  'no-amd-name',
  'no-extra-modules',
  'no-invalid-modules',
  'no-log-module',
  'no-module-extensions',
  'script-type',
];

const errorRules = Object.fromEntries(
  ruleNames.map((name) => [`suitescript/${name}`, 'error'])
);

const baseConfig = {
  plugins: { suitescript: plugin },
  languageOptions: {
    sourceType: 'module',
    globals: { log: 'readonly' },
  },
  rules: {
    ...errorRules,
    'suitescript/module-vars': ['error', MODULES],
  },
};

plugin.configs = {
  recommended: [baseConfig],
  all: [baseConfig],
  suitescript1: [
    { languageOptions: { globals: globals.suitescript1 } },
  ],
  suitescript2: [
    { languageOptions: { globals: globals.suitescript2 } },
  ],
};

module.exports = plugin;
```

- [ ] **Step 2: Delete `lib/environments.js`**

Run:
```bash
git rm lib/environments.js
```

- [ ] **Step 3: Run tests**

Run:
```bash
npm test
```

Expected: all tests green. (Tests import rules directly, not configs, so this rewrite doesn't affect them.)

- [ ] **Step 4: Commit**

Run:
```bash
git add lib/index.js
git commit -m "Rewrite plugin entry as flat-config-only and drop environments export"
```

---

### Task 8: Smoke-test the flat configs end-to-end

**Files:**
- Create (temporary): `/tmp/eslint-plugin-suitescript-smoke/eslint.config.mjs`
- Create (temporary): `/tmp/eslint-plugin-suitescript-smoke/sample.js`

This task is throwaway — it verifies the plugin works when consumed via flat config. Files are deleted at the end.

- [ ] **Step 1: Set up the smoke directory**

Run:
```bash
mkdir -p /tmp/eslint-plugin-suitescript-smoke
cd /tmp/eslint-plugin-suitescript-smoke
npm init -y
npm install eslint@^10.0.0
npm install /Users/agerber/github/eslint-plugin-suitescript
```

- [ ] **Step 2: Create `eslint.config.mjs`**

Contents:
```js
import suitescript from 'eslint-plugin-suitescript';

export default [
  ...suitescript.configs.recommended,
  ...suitescript.configs.suitescript2,
];
```

- [ ] **Step 3: Create a clean sample SuiteScript file `sample.js`**

Contents:
```js
/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/log'], function (logModule) {
  function onRequest(context) {
    log.audit({ title: 'hello', details: 'world' });
  }
  return { onRequest: onRequest };
});
```

- [ ] **Step 4: Lint it**

Run:
```bash
npx eslint sample.js
```

Expected: ESLint reports the `no-log-module` violation (loading `N/log` is restricted) and nothing else. Specifically: 1 problem, no parser errors, no plugin-loading errors.

- [ ] **Step 5: Create an invalid sample to confirm rules fire**

Append to `sample.js`:
```js
/**
 * @NApiVersion 9.x
 */
```

Run:
```bash
npx eslint sample.js
```

Expected: additional `api-version` violation reported.

- [ ] **Step 6: Tear down**

Run:
```bash
cd /Users/agerber/github/eslint-plugin-suitescript
rm -rf /tmp/eslint-plugin-suitescript-smoke
```

No commit (nothing changed in the repo).

---

### Task 9: Update rules with `meta.docs.url`

**Files:** Each rule file under `lib/rules/`.

Each rule's `meta` gets a `docs` block pointing at its public documentation. This is a low-risk professionalization step; ESLint and IDE plugins surface the URL on hover.

Example for `lib/rules/script-type.js`:

```js
meta: {
  type: 'problem',
  docs: {
    description: 'Enforce valid @NScriptType tag values',
    url: 'https://github.com/acdvs/eslint-plugin-suitescript/blob/master/docs/rules/script-type.md',
  },
  schema: [],
  messages: { /* … */ },
},
```

Map of rule → description (use the description from `README.md`'s rules list verbatim where possible):

- `api-version` — `Enforce valid @NApiVersion tag values`
- `entry-points` — `Enforce inclusion of at least one entry point based on @NScriptType`
- `log-args` — `Enforce correct log arguments`
- `module-vars` — `Enforce correct module identifiers for each configured module`
- `no-amd-name` — `Restrict naming of AMD modules`
- `no-extra-modules` — `Enforce equal number of module literals and identifiers`
- `no-invalid-modules` — `Enforce valid SuiteScript modules in define array`
- `no-log-module` — `Restrict loading of the N/log module in favor of global log`
- `no-module-extensions` — `Restrict filename extensions on module dependencies`
- `script-type` — `Enforce valid @NScriptType tag values`

URL pattern: `https://github.com/acdvs/eslint-plugin-suitescript/blob/master/docs/rules/<rule>.md`.

- [ ] **Step 1: Add `docs` blocks**

For each rule file, insert a `docs` block as shown above using the description and URL from the table.

- [ ] **Step 2: Run tests**

Run:
```bash
npm test
```

Expected: all tests green.

- [ ] **Step 3: Commit**

Run:
```bash
git add lib/rules/
git commit -m "Add meta.docs to all rules"
```

---

### Task 10: Rewrite the `Configuration` section of `README.md`

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace the `## Installation` and `## Configuration` sections**

Replace the existing `## Installation` and `## Configuration` blocks with:

````markdown
## Installation

```sh
npm i -D eslint eslint-plugin-suitescript
```

Requires ESLint v9 or higher. Users on ESLint v8 (or `.eslintrc.*`) should stay on `eslint-plugin-suitescript@1`.

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

## Migration from v1.x

v2 is **flat-config only**. To migrate:

- Replace `.eslintrc.*` with `eslint.config.js`.
- Replace `extends: ['plugin:suitescript/recommended']` with `...suitescript.configs.recommended` (spread).
- Replace `env: { 'suitescript/suitescript2': true }` with `...suitescript.configs.suitescript2`.
- Bump `eslint` to `>= 9` in your project.

Stay on `eslint-plugin-suitescript@1` if you cannot migrate.
````

Leave the `## List of supported rules` and `## License` sections unchanged.

- [ ] **Step 2: Commit**

Run:
```bash
git add README.md
git commit -m "Document flat-config usage and v1 -> v2 migration"
```

---

### Task 11: Add `CHANGELOG.md`

**Files:**
- Create: `CHANGELOG.md`

- [ ] **Step 1: Create the file**

Contents:

```md
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
- Requires Node.js `>= 18.18.0`.
```

- [ ] **Step 2: Commit**

Run:
```bash
git add CHANGELOG.md
git commit -m "Add CHANGELOG with v2.0.0 release notes"
```

---

### Task 12: Add `AGENTS.md`

**Files:**
- Create: `AGENTS.md`

- [ ] **Step 1: Create the file**

Contents:

```md
# Agent Guide — eslint-plugin-suitescript

This file gives AI coding agents the context they need to work in this repo without surprises.

## Project type

ESLint **flat-config plugin** that provides lint rules for NetSuite SuiteScript v1 and v2.

## Setup

```sh
npm install
```

Requires Node.js `>= 18.18.0` and npm.

## Common commands

| Command | Purpose |
|---|---|
| `npm test` | Run the Mocha rule-tester suite |
| `npm run lint` | Lint the plugin source itself |
| `npm run lint:fix` | Lint and auto-fix |
| `npm run format` | Check Prettier formatting |
| `npm run format:fix` | Apply Prettier formatting |
| `npm run build:docs` | Regenerate `docs/rules/*.md` from `docs/src/*` |

## Layout

- `lib/index.js` — plugin entry point (registers rules and flat configs)
- `lib/rules/` — one file per rule
- `lib/util/` — shared helpers (`metadata`, `modules`, `script-types`, `globals`, …)
- `tests/rules/` — one Mocha test file per rule, using ESLint `RuleTester`
- `docs/src/` — doc templates (with `<TOKEN>` placeholders consumed by `scripts/generate_docs.js`)
- `docs/rules/` — generated rule docs (output of `npm run build:docs`)

## Rule-authoring conventions

- Use `context.sourceCode` — never `context.getSourceCode()` (the latter was removed in ESLint 9).
- Provide `meta.schema`. Use `[]` for option-less rules.
- Provide `meta.messages` and report findings via `messageId`, not inline strings.
- Provide `meta.docs.description` and `meta.docs.url` (`https://github.com/acdvs/eslint-plugin-suitescript/blob/master/docs/rules/<rule>.md`).

## Test conventions

- Configure `RuleTester` with `languageOptions`, never `parserOptions`.
- Each rule has a corresponding `tests/rules/<rule>.js` with both `valid` and `invalid` cases.

## Adding a new rule

1. Create `lib/rules/<rule>.js`.
2. Register it in `lib/index.js` (the `allRules` map and the relevant configs).
3. Add `tests/rules/<rule>.js` with `valid` and `invalid` cases.
4. Add a doc template in `docs/src/<rule>.md`.
5. Run `npm run build:docs` to regenerate `docs/rules/<rule>.md`.
6. Add the rule to the list in `README.md`.

## Commit conventions

- English, imperative mood (`Add rule for X`, `Fix off-by-one in Y`).
- One logical change per commit.

## Out of scope without explicit instruction

- Bumping the `peerDependencies` floor.
- Introducing TypeScript or a build step.
- Changing the public `configs` shape.
- Adding runtime dependencies.
```

- [ ] **Step 2: Commit**

Run:
```bash
git add AGENTS.md
git commit -m "Add AGENTS.md with repo conventions for AI agents"
```

---

### Task 13: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Lint**

Run:
```bash
npm run lint
```

Expected: clean.

- [ ] **Step 2: Format check**

Run:
```bash
npm run format
```

Expected: clean.

- [ ] **Step 3: Tests**

Run:
```bash
npm test
```

Expected: all tests green.

- [ ] **Step 4: Inspect commit history**

Run:
```bash
git log --oneline master..HEAD
```

Expected: one design-spec commit followed by one commit per task. No fixup commits or accidental changes outside the migration scope.

- [ ] **Step 5: Done**

The branch is ready for PR or merge into `master`. Tagging `v2.0.0` and publishing to npm are out of scope for this plan.
