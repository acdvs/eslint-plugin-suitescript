import type { ESLint } from 'eslint';
import envGlobals from 'globals';
import pkg from '../package.json';
import rules from './rules';
import globals from './utils/globals';
import { modules } from './utils/modules';

const plugin: ESLint.Plugin = {
  meta: { name: pkg.name, version: pkg.version },
  rules,
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
        'suitescript/module-vars': ['error', modules],
        'suitescript/no-invalid-modules': 'error',
        'suitescript/no-log-module': 'error',
        'suitescript/script-type': 'error',
      },
    },
  ],
  suitescript1: [{ languageOptions: { globals: globals.suitescript1 } }],
  suitescript2: [{ languageOptions: { globals: globals.suitescript2 } }],
};

plugin.configs.all = plugin.configs.recommended;

export default plugin;
