'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/api-version');

const parserOptions = {
  ecmaVersion: 2015,
  sourceType: 'module',
};

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('api-version', rule, {
  valid: [
    {
      code: `
/**
 * @NApiVersion 1.0
 */
      `,
    },
    {
      code: `
/**
 * @NApiVersion 2.x
 */
      `,
    },
    {
      code: `
/**
 * @NApiVersion 2.0
 */
      `,
    },
    {
      code: `
/**
 * @NApiVersion 2.1
 */
      `,
    },
  ],

  invalid: [
    {
      code: `
/**
 * @NApiVersion
 */
      `,
      errors: [{ messageId: 'noValue' }],
    },
    {
      code: `
/**
 * @NApiVersion 
 */
      `,
      errors: [{ messageId: 'noValue' }],
    },
    {
      code: `
/**
 * @NApiVersion 1
 */
      `,
      errors: [{ messageId: 'invalidValue', data: { value: 1 } }],
    },
    {
      code: `
/**
 * @NApiVersion 2
 */
      `,
      errors: [{ messageId: 'invalidValue', data: { value: 2 } }],
    },
    {
      code: `
/**
 * @NApiVersion 3
 */
      `,
      errors: [{ messageId: 'invalidValue', data: { value: 3 } }],
    },
    {
      code: `
/**
 * @NApiVersion 2.2
 */
      `,
      errors: [{ messageId: 'invalidValue', data: { value: 2.2 } }],
    },
    {
      code: `
/**
 * @NApiVersion test
 */
      `,
      errors: [{ messageId: 'invalidValue', data: { value: 'test' } }],
    },
  ],
});
