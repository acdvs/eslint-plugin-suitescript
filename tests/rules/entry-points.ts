import path from 'node:path';
import rule from '../../lib/rules/entry-points';
import ruleTester, { createTests } from '../rule-tester';

const RULE_NAME = path.basename(import.meta.filename, '.test.ts');

const valid = createTests([
  {
    name: 'script type w/ entry point',
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
    name: 'script type w/ no entry points',
    code: `
      /**
       * @NScriptType PluginTypeImpl
       */
      define([], function() {
        return {};
      });
    `,
  },
  {
    name: 'script type w/ no entry points, misc entry point',
    code: `
      /**
       * @NScriptType PluginTypeImpl
       */
      define([], function() {
        return { customFn: function() {} };
      });
    `,
  },
  {
    name: 'entry point as ident',
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
    name: 'entry point as fn',
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
    name: 'entry point as arrow fn',
    code: `
      /**
       * @NScriptType ClientScript
       */
      define([], function() {
        return { pageInit: () => {} };
      });
    `,
  },
  {
    name: 'entry point as obj prop',
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
    name: 'arrow fn as factory',
    code: `
      /**
       * @NScriptType ClientScript
       */
      define([], () => {
        return { pageInit: x };
      });
    `,
  },
  {
    name: 'no script type comment, no entry point',
    code: `
      define([], () => {});
    `,
  },
  {
    name: 'no script type comment, misc entry point',
    code: `
      define([], () => {
        return { foo: 'bar' };
      });
    `,
  },
  {
    name: 'no script type value, no entry point',
    code: `
      /**
       * @NScriptType
       */
      define([], () => {});
    `,
  },
  {
    name: 'no script type value, misc entry point',
    code: `
      /**
       * @NScriptType
       */
      define([], () => {
        return { somethingElse: x };
      });
    `,
  },
]);

const invalid = createTests([
  {
    name: 'no entry point',
    code: `
      /**
       * @NScriptType Restlet
       */
      define([], () => {});
    `,
    errors: [{ messageId: 'returnEntryPoint', data: { type: 'Restlet' } }],
  },
  {
    name: 'invalid entry point',
    code: `
      /**
       * @NScriptType Restlet
       */
      define([], () => {
        return { notAnEntryPoint };
      });
    `,
    errors: [{ messageId: 'returnEntryPoint', data: { type: 'Restlet' } }],
  },
  {
    name: 'missing entry point obj as ident',
    code: `
      /**
       * @NScriptType Restlet
       */
      define([], () => {
        return x;
      });
    `,
    errors: [{ messageId: 'returnEntryPoint', data: { type: 'Restlet' } }],
  },
  {
    name: 'invalid entry point as obj prop',
    code: `
      /**
       * @NScriptType ClientScript
       */
      define([], () => {
        var exports = {};
        exports.notAnEntryPoint = x;
        return exports;
      });
    `,
    errors: [{ messageId: 'returnEntryPoint', data: { type: 'ClientScript' } }],
  },
  {
    name: 'valid entry point on non-returned obj',
    code: `
      /**
       * @NScriptType ClientScript
       */
      define([], () => {
        var exports = {};
        var notTheReturnObject = {};
        notTheReturnObject.pageInit = x;
        return exports;
      });
    `,
    errors: [{ messageId: 'returnEntryPoint', data: { type: 'ClientScript' } }],
  },
  {
    name: 'valid entry points of different script type',
    code: `
      /**
       * @NScriptType ClientScript
       */
      define([], (record) => {
        return { getInputData, map, reduce, summarize };
      });
    `,
    errors: [{ messageId: 'returnEntryPoint', data: { type: 'ClientScript' } }],
  },
]);

ruleTester.run(RULE_NAME, rule, { valid, invalid });
