'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/no-log-module');

const parserOptions = {
  ecmaVersion: 2015,
  sourceType: 'module',
};

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-log-module', rule, {
  valid: [
    {
      code: 'define(["N/record"], function(record) {});',
    },
    {
      code: 'define(["N/search", "N/file"], function(search, file) {});',
    },
    {
      code: 'define(["N/record", "N/file", "N/search"], function(record, file, search) {});',
    },
    {
      code: 'define([], function() {});',
    },
    {
      code: `
/**
 * @NScriptType
 */
define([], function() {});
      `,
    },
    {
      code: `
/**
 * @NScriptType Suitelet
 */
define([], function() {});
      `,
    },
    {
      code: `
/**
 * @NScriptType Suitelet
 */
define([], function() {});
      `,
      options: [{ allowInClientScripts: false }],
    },
    {
      code: `
/**
 * @NScriptType ClientScript
 */
define([], function() {});
      `,
    },
    {
      code: `
/**
 * @NScriptType ClientScript
 */
define(["N/log"], function(log) {});
      `,
    },
    {
      code: `
/**
 * @NScriptType ClientScript
 */
define(["N/log"], function(log) {});
      `,
      options: [{ allowInClientScripts: true }],
    },
  ],

  invalid: [
    {
      code: 'define(["N/log"], function(log) {});',
      errors: [{ messageId: 'useGlobalLog' }],
    },
    {
      code: 'define(["N/record", "N/log"], function(record, log) {});',
      errors: [{ messageId: 'useGlobalLog' }],
    },
    {
      code: `
/**
 * @NScriptType Suitelet
 */
define(["N/log"], function(log) {});
      `,
      errors: [{ messageId: 'useGlobalLog' }],
    },
    {
      code: `
/**
 * @NScriptType Suitelet
 */
define(["N/log"], function(log) {});
      `,
      options: [{ allowInClientScripts: true }],
      errors: [{ messageId: 'useGlobalLog' }],
    },
    {
      code: `
/**
 * @NScriptType Suitelet
 */
define(["N/log"], function(log) {});
      `,
      options: [{ allowInClientScripts: false }],
      errors: [{ messageId: 'useGlobalLog' }],
    },
    {
      code: `
/**
 * @NScriptType ClientScript
 */
define(["N/log"], function(log) {});
      `,
      options: [{ allowInClientScripts: false }],
      errors: [{ messageId: 'useGlobalLog' }],
    },
  ],
});
