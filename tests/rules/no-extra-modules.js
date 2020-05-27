/**
 * @fileoverview Enforce equal number of module literals and variables
 * @author Adam Davies
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/no-extra-modules');

const parserOptions = {
  ecmaVersion: 2015,
  sourceType: 'module'
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-extra-modules', rule, {
  valid: [
    {
      code: 'define(["N/record"], function(record) {});'
    },
    {
      code: 'define(["N/record", "N/file"], function(record, file) {});'
    },
    {
      code: 'define(["N/record", "N/file", "N/search"], function(record, file, search) {});'
    },
    {
      code: 'define([], function() {});'
    }
  ],

  invalid: [
    {
      code: 'define(["N/runtime"], function() {});',
      errors: [{ messageId: 'excessName', data: { name: 'N/runtime' }}]
    },
    {
      code: 'define(["N/record", "N/file"], function(record) {});',
      errors: [{ messageId: 'excessName', data: { name: 'N/file' }}]
    },
    {
      code: 'define(["N/record", "N/file", "N/https"], function(record) {});',
      errors: [
        { messageId: 'excessName', data: { name: 'N/file' }},
        { messageId: 'excessName', data: { name: 'N/https' }}
      ]
    },
    {
      code: 'define([], function(sftp) {});',
      errors: [{ messageId: 'excessVar', data: { var: 'sftp' }}]
    },
    {
      code: 'define(["N/record"], function(record, file) {});',
      errors: [{ messageId: 'excessVar', data: { var: 'file' }}]
    },
    {
      code: 'define(["N/record"], function(record, file, https) {});',
      errors: [
        { messageId: 'excessVar', data: { var: 'file' }},
        { messageId: 'excessVar', data: { var: 'https' }}
      ]
    }
  ]
});