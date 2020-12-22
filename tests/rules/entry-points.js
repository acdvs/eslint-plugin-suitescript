/**
 * @fileoverview Enforce inclusion of at least one entry point based on "@NScriptType"
 * @author Adam Davies
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/entry-points');

const parserOptions = {
  ecmaVersion: 2015,
  sourceType: 'module'
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('entry-points', rule, {
  valid: [
    {
      code: [
        '/**',
        ' * @NScriptType UserEventScript',
        ' */',
        'define([], function() {',
        '  return { beforeSubmit: x };',
        '});'
      ].join('\n')
    },
    {
      code: [
        '/**',
        ' * @NScriptType ClientScript',
        ' */',
        'define([], function() {',
        '  return { pageInit: x };',
        '});'
      ].join('\n')
    },
    {
      code: [
        '/**',
        ' * @NScriptType ClientScript',
        ' */',
        'define([], function() {',
        '  return { pageInit: function() {} };',
        '});'
      ].join('\n')
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
        ' * @NScriptType',
        ' */',
        'define([], function() {',
        '  return;',
        '});'
      ].join('\n')
    },
    {
      code: [
        '/**',
        ' * @NScriptType',
        ' */',
        'define([], function() {',
        '  return { somethingElse: x };',
        '});'
      ].join('\n')
    },
    {
      code: [
        '/**',
        ' * @NScriptType ClientScript',
        ' */',
        'define([], function() {',
        '  var exports = {};',
        '  exports.pageInit = x;',
        '  return exports;',
        '});'
      ].join('\n')
    }
  ],

  invalid: [
    {
      code: [
        '/**',
        ' * @NScriptType Restlet',
        ' */',
        'define([], function() {});'
      ].join('\n'),
      errors: [{ messageId: 'returnEntryPoint', data: { type: 'Restlet' }}]
    },
    {
      code: [
        '/**',
        ' * @NScriptType Restlet',
        ' */',
        'define([], function() {',
        '  return;',
        '});'
      ].join('\n'),
      errors: [{ messageId: 'returnEntryPoint', data: { type: 'Restlet' }}]
    },
    {
      code: [
        '/**',
        ' * @NScriptType Restlet',
        ' */',
        'define([], function() {',
        '  return x;',
        '});'
      ].join('\n'),
      errors: [{ messageId: 'returnEntryPoint', data: { type: 'Restlet' }}]
    },
    {
      code: [
        '/**',
        ' * @NScriptType Restlet',
        ' */',
        'define([], function() {',
        '  return { notAnEntryPoint };',
        '});'
      ].join('\n'),
      errors: [{ messageId: 'returnEntryPoint', data: { type: 'Restlet' }}]
    },
    {
      code: [
        '/**',
        ' * @NScriptType Restlet',
        ' */',
        'define([], function() {',
        '  return { notAnEntryPoint: x };',
        '});'
      ].join('\n'),
      errors: [{ messageId: 'returnEntryPoint', data: { type: 'Restlet' }}]
    },
    {
      code: [
        '/**',
        ' * @NScriptType ClientScript',
        ' */',
        'define([], function() {',
        '  var exports = {};',
        '  exports.notAnEntryPoint = x;',
        '  return exports;',
        '});'
      ].join('\n'),
      errors: [{ messageId: 'returnEntryPoint', data: { type: 'ClientScript' }}]
    }
  ]
});