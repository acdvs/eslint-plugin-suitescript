/**
 * @fileoverview Enforce "@NScriptType" values
 * @author Adam Davies
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/script-type');

const parserOptions = {
  ecmaVersion: 2015,
  sourceType: 'module',
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('script-type', rule, {
  valid: [
    {
      code: ['/**', ' * @NScriptType BundleInstallationScript', ' */'].join('\n'),
    },
    {
      code: ['/**', ' * @NScriptType ClientScript', ' */'].join('\n'),
    },
    {
      code: ['/**', ' * @NScriptType MapReduceScript', ' */'].join('\n'),
    },
    {
      code: ['/**', ' * @NScriptType MassUpdateScript', ' */'].join('\n'),
    },
    {
      code: ['/**', ' * @NScriptType Portlet', ' */'].join('\n'),
    },
    {
      code: ['/**', ' * @NScriptType Restlet', ' */'].join('\n'),
    },
    {
      code: ['/**', ' * @NScriptType ScheduledScript', ' */'].join('\n'),
    },
    {
      code: ['/**', ' * @NScriptType SDFInstallationScript', ' */'].join('\n'),
    },
    {
      code: ['/**', ' * @NScriptType Suitelet', ' */'].join('\n'),
    },
    {
      code: ['/**', ' * @NScriptType UserEventScript', ' */'].join('\n'),
    },
    {
      code: ['/**', ' * @NScriptType WorkflowActionScript', ' */'].join('\n'),
    },
    {
      code: [
        '/**',
        ' * @NScriptType Suitelet',
        ' */',
        '/**',
        ' * @NScriptType SuiteletScript',
        ' */',
      ].join('\n'),
    },
    {
      code: ['/**', ' * Not a script type tag', ' */'].join('\n'),
    },
    {
      code: '// @NScriptType SuiteletScript',
    },
    {
      code: ['/**', ' * @NScriptType fiParserPlugin', ' */'].join('\n'),
    },
  ],

  invalid: [
    {
      code: ['/**', ' * @NScriptType', ' */'].join('\n'),
      errors: [{ messageId: 'noValue' }],
    },
    {
      code: ['/**', ' * @NScriptType PortletScript', ' */'].join('\n'),
      errors: [{ messageId: 'invalidValue', data: { value: 'PortletScript' } }],
    },
    {
      code: ['/**', ' * @NScriptType RestletScript', ' */'].join('\n'),
      errors: [{ messageId: 'invalidValue', data: { value: 'RestletScript' } }],
    },
    {
      code: ['/**', ' * @NScriptType SuiteletScript', ' */'].join('\n'),
      errors: [{ messageId: 'invalidValue', data: { value: 'SuiteletScript' } }],
    },
    {
      code: [
        '/**',
        ' * @NScriptType SuiteletScript',
        ' */',
        '/**',
        ' * @NScriptType Suitelet',
        ' */',
      ].join('\n'),
      errors: [{ messageId: 'invalidValue', data: { value: 'SuiteletScript' } }],
    },
  ],
});
