/**
 * @fileoverview Enforce "@NApiVersion" values
 * @author Adam Davies
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/api-version');

const parserOptions = {
  ecmaVersion: 2015,
  sourceType: 'module',
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('api-version', rule, {
  valid: [
    {
      code: ['/**', ' * @NApiVersion 1.0', ' */'].join('\n'),
    },
    {
      code: ['/**', ' * @NApiVersion 2.x', ' */'].join('\n'),
    },
    {
      code: ['/**', ' * @NApiVersion 2.0', ' */'].join('\n'),
    },
    {
      code: ['/**', ' * @NApiVersion 2.1', ' */'].join('\n'),
    },
  ],

  invalid: [
    {
      code: ['/**', ' * @NApiVersion', ' */'].join('\n'),
      errors: [{ messageId: 'noValue' }],
    },
    {
      code: ['/**', ' * @NApiVersion ', ' */'].join('\n'),
      errors: [{ messageId: 'noValue' }],
    },
    {
      code: ['/**', ' * @NApiVersion 1', ' */'].join('\n'),
      errors: [{ messageId: 'invalidValue', data: { value: 1 } }],
    },
    {
      code: ['/**', ' * @NApiVersion 2', ' */'].join('\n'),
      errors: [{ messageId: 'invalidValue', data: { value: 2 } }],
    },
    {
      code: ['/**', ' * @NApiVersion 3', ' */'].join('\n'),
      errors: [{ messageId: 'invalidValue', data: { value: 3 } }],
    },
    {
      code: ['/**', ' * @NApiVersion 2.2', ' */'].join('\n'),
      errors: [{ messageId: 'invalidValue', data: { value: 2.2 } }],
    },
    {
      code: ['/**', ' * @NApiVersion test', ' */'].join('\n'),
      errors: [{ messageId: 'invalidValue', data: { value: 'test' } }],
    },
  ],
});
