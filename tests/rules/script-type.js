'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/script-type');

const parserOptions = {
  ecmaVersion: 2015,
  sourceType: 'module',
};

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('script-type', rule, {
  valid: [
    {
      code: `
/**
 * @NScriptType BundleInstallationScript
 */
      `,
    },
    {
      code: `
/**
 * @NScriptType bundleinstallationscript
 */
      `,
    },
    {
      code: `
/**
 * @NScriptType ClientScript
 */
      `,
    },
    {
      code: `
/**
 * @NScriptType FiParserPlugin
 */
      `,
    },
    {
      code: `
/**
 * @NScriptType MapReduceScript
 */
      `,
    },
    {
      code: `
/**
 * @NScriptType MassUpdateScript
 */
      `,
    },
    {
      code: `
/**
 * @NScriptType Portlet
 */
      `,
    },
    {
      code: `
/**
 * @NScriptType Restlet
 */
      `,
    },
    {
      code: `
/**
 * @NScriptType ScheduledScript
 */
      `,
    },
    {
      code: `
/**
 * @NScriptType SDFInstallationScript
 */
      `,
    },
    {
      code: `
/**
 * @NScriptType Suitelet
 */
      `,
    },
    {
      code: `
/**
 * @NScriptType UserEventScript
 */
      `,
    },
    {
      code: `
/**
 * @NScriptType WorkflowActionScript
 */
      `,
    },
    {
      code: `
/**
 * @NScriptType Suitelet
 */
/**
 * @NScriptType SuiteletScript
 */
      `,
    },
    {
      code: `
/**
 * Not a script type tag
 */
      `,
    },
    {
      code: '// @NScriptType SuiteletScript',
    },
  ],

  invalid: [
    {
      code: `
/**
 * @NScriptType
 */
      `,
      errors: [{ messageId: 'noValue' }],
    },
    {
      code: `
/**
 * @NScriptType PortletScript
 */
      `,
      errors: [{ messageId: 'invalidValue', data: { value: 'PortletScript' } }],
    },
    {
      code: `
/**
 * @NScriptType RestletScript
 */
      `,
      errors: [{ messageId: 'invalidValue', data: { value: 'RestletScript' } }],
    },
    {
      code: `
/**
 * @NScriptType SuiteletScript
 */
      `,
      errors: [{ messageId: 'invalidValue', data: { value: 'SuiteletScript' } }],
    },
    {
      code: `
/**
 * @NScriptType SuiteletScript
 */
/**
 * @NScriptType Suitelet
 */
      `,
      errors: [{ messageId: 'invalidValue', data: { value: 'SuiteletScript' } }],
    },
  ],
});
