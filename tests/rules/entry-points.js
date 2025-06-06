'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/entry-points');

const parserOptions = {
  ecmaVersion: 2015,
  sourceType: 'module',
};

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('entry-points', rule, {
  valid: [
    {
      code: `
/**
 * @NScriptType UserEventScript
 */
define([], function() {
  return { beforeSubmit: x };
});
      `,
    },
    {
      code: `
/**
 * @NScriptType ClientScript
 */
define([], function() {
  return { pageInit: x };
});
      `,
    },
    {
      code: `
/**
 * @NScriptType ClientScript
 */
define([], function() {
  return { pageInit: function() {} };
});
      `,
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
 * @NScriptType
 */
define([], function() {
  return;
});
      `,
    },
    {
      code: `
/**
 * @NScriptType
 */
define([], function() {
  return { somethingElse: x };
});
      `,
    },
    {
      code: `
/**
 * @NScriptType ClientScript
 */
define([], function() {
  var exports = {};
  exports.pageInit = x;
  return exports;
});
      `,
    },
    {
      code: `
/**
 * @NScriptType plugintypeimpl
 */
define([], function() {
  return {};
});
      `,
    },
    {
      code: `
/**
 * @NScriptType plugintypeimpl
 */
define([], function() {
  return { customFn: function() {} };
});
      `,
    },
    {
      code: `
// no @NScriptType comment

define([], function() {
  return { foo: 'bar' };
});
      `,
      // Should not error, since scriptType is null and rule should exit early
    },
  ],

  invalid: [
    {
      code: `
/**
 * @NScriptType Restlet
 */
define([], function() {});
      `,
      errors: [{ messageId: 'returnEntryPoint', data: { type: 'Restlet' } }],
    },
    {
      code: `
/**
 * @NScriptType Restlet
 */
define([], function() {
  return;
});
      `,
      errors: [{ messageId: 'returnEntryPoint', data: { type: 'Restlet' } }],
    },
    {
      code: `
/**
 * @NScriptType Restlet
 */
define([], function() {
  return x;
});
      `,
      errors: [{ messageId: 'returnEntryPoint', data: { type: 'Restlet' } }],
    },
    {
      code: `
/**
 * @NScriptType Restlet
 */
define([], function() {
  return { notAnEntryPoint };
});
      `,
      errors: [{ messageId: 'returnEntryPoint', data: { type: 'Restlet' } }],
    },
    {
      code: `
/**
 * @NScriptType Restlet
 */
define([], function() {
  return { notAnEntryPoint: x };
});
      `,
      errors: [{ messageId: 'returnEntryPoint', data: { type: 'Restlet' } }],
    },
    {
      code: `
/**
 * @NScriptType ClientScript
 */
define([], function() {
  var exports = {};
  exports.notAnEntryPoint = x;
  return exports;
});
      `,
      errors: [{ messageId: 'returnEntryPoint', data: { type: 'ClientScript' } }],
    },
    {
      code: `
/**
 * @NScriptType ClientScript
 */
define([], function() {
  var exports = {};
  var notTheReturnObject = {};
  notTheReturnObject.pageInit = x;
  return exports;
});
      `,
      errors: [{ messageId: 'returnEntryPoint', data: { type: 'ClientScript' } }],
    },
  ],
});
