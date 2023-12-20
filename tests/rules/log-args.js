/**
 * @fileoverview Enforce correct log arguments
 * @author Adam Davies
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/log-args');

const parserOptions = {
  ecmaVersion: 2015,
  sourceType: 'module',
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('log-args', rule, {
  valid: [
    {
      code: [
        'define([], function() {',
        '  log.debug("title", "description");',
        '});',
      ].join('\n'),
    },
    {
      code: [
        'define([], function() {',
        '  log.debug({ title: "Title", details: "Message" });',
        '});',
      ].join('\n'),
    },
    {
      code: ['define([], function() {', '  log.debug({ title: "Title" });', '});'].join(
        '\n',
      ),
      options: [{ requireTitle: true }],
    },
    {
      code: [
        'define([], function() {',
        '  log.debug({ details: "Message" });',
        '});',
      ].join('\n'),
      options: [{ requireDetails: true }],
    },
    {
      code: [
        'define([], function() {',
        '  log.error({ details: "Error message" });',
        '});',
      ].join('\n'),
      options: [{ requireDetails: true }],
    },
    {
      code: [
        'define([], function() {',
        '  log.custom({ details: "Message" });',
        '});',
      ].join('\n'),
      options: [{ requireDetails: true }],
    },
    {
      code: [
        'define(["N/log"], function(log) {',
        '  log.debug({ details: "Message" });',
        '});',
      ].join('\n'),
      options: [{ requireDetails: true }],
    },
    {
      code: [
        'define(["N/record"], function(record) {',
        '  log.debug({ title: "Message" });',
        '});',
      ].join('\n'),
      options: [{ requireTitle: true }],
    },
  ],

  invalid: [
    {
      code: ['define([], function() {', '  log.debug("title");', '});'].join('\n'),
      options: [{ requireDetails: true }],
      errors: [{ messageId: 'detailsRequired', data: { prop: 'debug' } }],
    },
    {
      code: ['define([], function() {', '  log.audit("title");', '});'].join('\n'),
      options: [{ requireDetails: true }],
      errors: [{ messageId: 'detailsRequired', data: { prop: 'audit' } }],
    },
    {
      code: [
        'define([], function() {',
        '  log.error({ details: "Message" }, "title");',
        '});',
      ].join('\n'),
      options: [{ requireTitle: true }],
      errors: [{ messageId: 'titleRequired', data: { prop: 'error' } }],
    },
    {
      code: [
        'define(["N/record", "N/log"], function(record, log) {',
        '  log.debug("test");',
        '});',
      ].join('\n'),
      options: [{ requireDetails: true }],
      errors: [{ messageId: 'detailsRequired', data: { prop: 'debug' } }],
    },
  ],
});
