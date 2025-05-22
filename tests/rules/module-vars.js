'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/module-vars');

const parserOptions = {
  ecmaVersion: 2015,
  sourceType: 'module',
};

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('module-vars', rule, {
  valid: [
    {
      code: 'define(["N/record"], function(record) {});',
      options: [{ 'N/record': 'record' }],
    },
    {
      code: 'define(["N/https"], function(https) {});',
      options: [{ 'N/https': 'https' }],
    },
    {
      code: 'define(["N/ui/serverWidget"], function(ui) {});',
      options: [{ 'N/ui/serverWidget': 'ui' }],
    },
    {
      code: 'define(["N/file", "N/runtime"], function(file, runtime) {});',
      options: [{ 'N/file': 'file', 'N/runtime': 'runtime' }],
    },
    {
      code: 'define(["N/file", "N/runtime"], function(f, r) {});',
      options: [{ 'N/file': 'f', 'N/runtime': 'r' }],
    },
  ],

  invalid: [
    {
      code: 'define(["N/record"], function(test) {});',
      options: [{ 'N/record': 'record' }],
      errors: [
        { messageId: 'useCorrectName', data: { module: 'N/record', id: 'record' } },
      ],
    },
  ],
});
