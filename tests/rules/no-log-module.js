/**
 * @fileoverview Restrict loading of the N/log module to favor global Log
 * @author Adam Davies
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/no-log-module');

const parserOptions = {
  ecmaVersion: 2015,
  sourceType: 'module'
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-log-module', rule, {
  valid: [
    {
      code: 'define(["N/record"], function(record) {});'
    },
    {
      code: 'define(["N/search", "N/file"], function(search, file) {});'
    },
    {
      code: 'define(["N/record", "N/file", "N/search"], function(record, file, search) {});'
    },
    {
      code: 'define([], function() {});'
    },
    {
      code: [
        '/**',
        ' * @NScriptType',
        ' */',
        'define([], function() {});'
      ].join('\n')
    },
    {
      code: [
        '/**',
        ' * @NScriptType Suitelet',
        ' */',
        'define([], function() {});'
      ].join('\n')
    },
    {
      code: [
        '/**',
        ' * @NScriptType Suitelet',
        ' */',
        'define([], function() {});'
      ].join('\n'),
      options: [{ allowInClientScripts: false }]
    },
    {
      code: [
        '/**',
        ' * @NScriptType ClientScript',
        ' */',
        'define([], function() {});'
      ].join('\n')
    },
    {
      code: [
        '/**',
        ' * @NScriptType ClientScript',
        ' */',
        'define(["N/log"], function(log) {});'
      ].join('\n')
    },
    {
      code: [
        '/**',
        ' * @NScriptType ClientScript',
        ' */',
        'define(["N/log"], function(log) {});'
      ].join('\n'),
      options: [{ allowInClientScripts: true }]
    }
  ],

  invalid: [
    {
      code: 'define(["N/log"], function(log) {});',
      errors: [{ messageId: 'useGlobalLog' }]
    },
    {
      code: 'define(["N/record", "N/log"], function(record, log) {});',
      errors: [{ messageId: 'useGlobalLog' }]
    },
    {
      code: [
        '/**',
        ' * @NScriptType Suitelet',
        ' */',
        'define(["N/log"], function(log) {});'
      ].join('\n'),
      errors: [{ messageId: 'useGlobalLog' }]
    },
    {
      code: [
        '/**',
        ' * @NScriptType Suitelet',
        ' */',
        'define(["N/log"], function(log) {});'
      ].join('\n'),
      options: [{ allowInClientScripts: true }],
      errors: [{ messageId: 'useGlobalLog' }]
    },
    {
      code: [
        '/**',
        ' * @NScriptType Suitelet',
        ' */',
        'define(["N/log"], function(log) {});'
      ].join('\n'),
      options: [{ allowInClientScripts: false }],
      errors: [{ messageId: 'useGlobalLog' }]
    },
    {
      code: [
        '/**',
        ' * @NScriptType ClientScript',
        ' */',
        'define(["N/log"], function(log) {});'
      ].join('\n'),
      options: [{ allowInClientScripts: false }],
      errors: [{ messageId: 'useGlobalLog' }]
    }
  ]
});