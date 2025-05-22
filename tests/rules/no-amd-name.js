'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/no-amd-name');

const parserOptions = {
  ecmaVersion: 2015,
  sourceType: 'module',
};

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-amd-name', rule, {
  valid: [
    {
      code: 'define([], function() {});',
    },
    {
      code: 'define(["N/search"], function(search) {});',
    },
    {
      code: 'define("moduleName");',
    },
    {
      code: 'define("moduleName", ["N/search"]);',
    },
  ],

  invalid: [
    {
      code: 'define("moduleName", [], function() {});',
      errors: [{ messageId: 'noModuleName' }],
      output: 'define([], function() {});',
    },
    {
      code: 'define("moduleName", ["N/search"], function(search) {});',
      errors: [{ messageId: 'noModuleName' }],
      output: 'define(["N/search"], function(search) {});',
    },
  ],
});
