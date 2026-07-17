import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import suitescript from 'eslint-plugin-suitescript';

const here = dirname(fileURLToPath(import.meta.url));

// Resolve the real ESLint CLI entry via this package's own dependency, then
// run it against the fixtures exactly as a consuming project's `lint` script
// would: a spawned process, reading eslint.config.js, formatting to JSON.
const require = createRequire(import.meta.url);
const eslintBin = join(
  dirname(require.resolve('eslint/package.json')),
  'bin',
  'eslint.js',
);

const cli = spawnSync(
  process.execPath,
  [eslintBin, '--format', 'json', 'fixtures'],
  { cwd: here, encoding: 'utf8' },
);

if (!cli.stdout) {
  throw new Error(`ESLint produced no output.\n${cli.stderr}`);
}

// basename -> sorted rule IDs ESLint reported for that fixture.
const byFile = new Map(
  JSON.parse(cli.stdout).map((result) => [
    result.filePath.split(/[\\/]/).pop(),
    result.messages.map((m) => m.ruleId).sort(),
  ]),
);

// The exact set of rule violations each fixture is expected to produce.
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
  'map-reduce.js': [],
};

describe('fixtures trigger expected rules', () => {
  for (const [file, ruleIds] of Object.entries(expected)) {
    test(file, () => {
      assert.deepEqual(byFile.get(file), ruleIds.slice().sort());
    });
  }
});

test('eslint lints expected fixtures', () => {
  assert.deepEqual([...byFile.keys()].sort(), Object.keys(expected).sort());
});

test('fixtures collectively exercise every plugin rule', () => {
  const triggered = new Set(Object.values(expected).flat());
  const declared = Object.keys(suitescript.rules).map(
    (r) => `suitescript/${r}`,
  );
  assert.deepEqual([...triggered].sort(), declared.sort());
});
