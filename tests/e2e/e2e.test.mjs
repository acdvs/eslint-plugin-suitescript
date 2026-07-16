import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { Linter } from 'eslint';
import suitescript from 'eslint-plugin-suitescript';

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), 'fixtures');
const linter = new Linter();

/** Lint a fixture with the plugin's recommended config and return its rule IDs. */
function lintFixture(file) {
  const code = readFileSync(join(FIXTURES, file), 'utf8');
  const messages = linter.verify(code, suitescript.configs.recommended, file);
  return messages.map((m) => m.ruleId).sort();
}

/** The exact set of rule violations each fixture is expected to produce. */
const expected = {
  'suitelet.js': ['suitescript/api-version', 'suitescript/script-type'],
  'user-event-script.js': [
    'suitescript/api-version',
    'suitescript/entry-points',
    'suitescript/log-args',
    'suitescript/module-vars',
    'suitescript/module-vars',
    'suitescript/no-invalid-modules',
    'suitescript/no-log-module',
  ],
  'valid-map-reduce.js': [],
};

for (const [file, ruleIds] of Object.entries(expected)) {
  test(`${file} triggers the expected rules`, () => {
    assert.deepEqual(lintFixture(file), ruleIds.slice().sort());
  });
}

test('every fixture is covered by an expectation', () => {
  const fixtures = readdirSync(FIXTURES).filter((f) => f.endsWith('.js'));
  assert.deepEqual(fixtures.sort(), Object.keys(expected).sort());
});

test('fixtures collectively exercise every plugin rule', () => {
  const triggered = new Set(Object.values(expected).flat());
  const declared = Object.keys(suitescript.rules).map(
    (r) => `suitescript/${r}`,
  );
  assert.deepEqual([...triggered].sort(), declared.sort());
});
