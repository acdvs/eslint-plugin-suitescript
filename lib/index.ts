import type { ESLint } from 'eslint';
import envGlobals from 'globals';
import pkg from '../package.json';
import globals from './utils/globals';
import { MODULES } from './utils/modules';

const plugin: ESLint.Plugin = {
  meta: { name: pkg.name, version: pkg.version },
  rules: {
    'api-version': require('./rules/api-version'),
    'entry-points': require('./rules/entry-points'),
    'log-args': require('./rules/log-args'),
    'module-vars': require('./rules/module-vars'),
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

export default plugin;
