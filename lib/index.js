'use strict';

const envGlobals = require('globals');
const { MODULES } = require('./util/modules');
const globals = require('./util/globals');
const pkg = require('../package.json');

const plugin = {
  meta: { name: pkg.name, version: pkg.version },
  rules: {
    'api-version': require('./rules/api-version'),
    'entry-points': require('./rules/entry-points'),
    'log-args': require('./rules/log-args'),
    'module-vars': require('./rules/module-vars'),
    'no-amd-name': require('./rules/no-amd-name'),
    'no-extra-modules': require('./rules/no-extra-modules'),
    'no-invalid-modules': require('./rules/no-invalid-modules'),
    'no-log-module': require('./rules/no-log-module'),
    'no-module-extensions': require('./rules/no-module-extensions'),
    'script-type': require('./rules/script-type'),
  },
};

plugin.configs = {
  recommended: [
    {
      plugins: { suitescript: plugin },
      languageOptions: {
        sourceType: 'module',
        globals: {
          ...envGlobals.amd,
          ...envGlobals.browser,
          log: 'readonly',
        },
      },
      rules: {
        'suitescript/api-version': 'error',
        'suitescript/entry-points': 'error',
        'suitescript/log-args': 'error',
        'suitescript/module-vars': ['error', MODULES],
        'suitescript/no-amd-name': 'error',
        'suitescript/no-extra-modules': 'error',
        'suitescript/no-invalid-modules': 'error',
        'suitescript/no-log-module': 'error',
        'suitescript/no-module-extensions': 'error',
        'suitescript/script-type': 'error',
      },
    },
  ],
  suitescript1: [{ languageOptions: { globals: globals.suitescript1 } }],
  suitescript2: [{ languageOptions: { globals: globals.suitescript2 } }],
};

plugin.configs.all = plugin.configs.recommended;

module.exports = plugin;
