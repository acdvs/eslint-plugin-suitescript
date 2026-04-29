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
  recommended: [{ ...baseConfig }],
  all: [{ ...baseConfig }],
  suitescript1: [{ languageOptions: { globals: globals.suitescript1 } }],
  suitescript2: [{ languageOptions: { globals: globals.suitescript2 } }],
};

module.exports = plugin;
