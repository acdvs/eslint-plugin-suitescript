/**
 * @fileoverview Enforce no naming of AMD modules
 * @author Adam Davies
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/no-amd-name');

const parserOptions = {
  ecmaVersion: 2015,
  sourceType: 'module'
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-amd-name', rule, {
  valid: [
    {
      code: 'define([], function() {});'
    },
    {
      code: 'define(["N/search"], function(search) {});'
    }
  ],

  invalid: [
    {
      code: 'define("moduleName", [], function() {});',
      errors: [{ messageId: 'noModuleName' }]
    },
    {
      code: 'define("moduleName", ["N/search"], function(search) {});',
      errors: [{ messageId: 'noModuleName' }]
    },
    {
      code: 'define("moduleName");',
      errors: [{ messageId: 'noModuleName' }]
    },
    {
      code: 'define("moduleName", ["N/search"]);',
      errors: [{ messageId: 'noModuleName' }]
    }
  ]
});