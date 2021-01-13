/**
 * @fileoverview Enforce no filename extensions on module dependencies
 * @author Michoel Chaikin
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/no-module-extensions');

const parserOptions = {
  ecmaVersion: 2015,
  sourceType: 'module'
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-module-extensions', rule, {
  valid: [
    {
      code: 'define(["./lib"], function(lib) {});'
    },
    {
      code: 'define(["N/record", "./lib"], function(record, lib) {});'
    },
    {
      code: 'define([], function() {});'
    },
    {
      code: 'define(["N/record", "./lib"], (record, lib) => {});'
    }
  ],

  invalid: [
    {
      code: 'define(["./lib.js"], function(lib) {});',
      errors: [{ messageId: 'invalidModuleExtension' }],
      output: 'define(["./lib"], function(lib) {});'
    },
    {
      code: 'define([\'./lib.js\'], function(lib) {});',
      errors: [{ messageId: 'invalidModuleExtension' }],
      output: 'define([\'./lib\'], function(lib) {});'
    },
    {
      code: 'define(["./lib1", "./lib2.js"], function(lib1, lib2) {});',
      errors: [{ messageId: 'invalidModuleExtension' }],
      output: 'define(["./lib1", "./lib2"], function(lib1, lib2) {});'
    },
    {
      code: 'define(["./lib1", "./lib2.js"], (lib1, lib2) => {});',
      errors: [{ messageId: 'invalidModuleExtension' }],
      output: 'define(["./lib1", "./lib2"], (lib1, lib2) => {});'
    }
  ]
});