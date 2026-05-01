# Agent Guide — eslint-plugin-suitescript

This file gives AI coding agents the context they need to work in this repo without surprises.

## Project type

ESLint **flat-config plugin** that provides lint rules for NetSuite SuiteScript v1 and v2.

## Setup

```sh
yarn install
```

Requires Node.js `^20.19.0 || ^22.13.0 || >=24` and Yarn Classic (1.x). The repo ships a `yarn.lock` — do not introduce `package-lock.json`.

## Common commands

| Command           | Purpose                                        |
| ----------------- | ---------------------------------------------- |
| `yarn test`       | Run the Mocha rule-tester suite                |
| `yarn lint`       | Lint the plugin source itself                  |
| `yarn lint:fix`   | Lint and auto-fix                              |
| `yarn format`     | Check Prettier formatting                      |
| `yarn format:fix` | Apply Prettier formatting                      |
| `yarn build:docs` | Regenerate `docs/rules/*.md` from `docs/src/*` |

## Layout

- `lib/index.js` — plugin entry point (registers rules and flat configs)
- `lib/rules/` — one file per rule
- `lib/util/` — shared helpers (`metadata`, `modules`, `script-types`, `globals`, …)
- `tests/rules/` — one Mocha test file per rule, using ESLint `RuleTester`
- `docs/src/` — doc templates (with `<TOKEN>` placeholders consumed by `scripts/generate_docs.js`)
- `docs/rules/` — generated rule docs (output of `yarn build:docs`)

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
5. Run `yarn build:docs` to regenerate `docs/rules/<rule>.md`.
6. Add the rule to the list in `README.md`.

## Commit conventions

- English, imperative mood (`Add rule for X`, `Fix off-by-one in Y`).
- One logical change per commit.

## Out of scope without explicit instruction

- Bumping the `peerDependencies` floor.
- Introducing TypeScript or a build step.
- Changing the public `configs` shape.
- Adding runtime dependencies.
