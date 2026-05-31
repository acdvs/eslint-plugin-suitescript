import path from 'node:path';
import rule from '../../lib/rules/entry-points';
import ruleTester, { createTests } from '../rule-tester';

const RULE_NAME = path.basename(import.meta.filename, '.test.ts');

const valid = createTests([
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
    // Should not error, since scriptType is null and rule should exit early
    code: `
      // no @NScriptType comment

      define([], function() {
        return { foo: 'bar' };
      });
    `,
  },
  {
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
    code: `
      /**
       * @NScriptType ClientScript
       */
      define([], () => {
        return { pageInit: () => {} };
      });
    `,
  },
  {
    code: `
      /**
       * @NScriptType ClientScript
       */
      define([], () => ({ pageInit: x }));
    `,
  },
  {
    code: `
      /**
       * @NScriptType ClientScript
       */
      define([], () => ({ pageInit: () => {} }));
    `,
  },
  {
    code: `
      /**
       * @NScriptType ClientScript
       */
      define([], function() {
        var exports = {};
        log.debug('init');
        exports.pageInit = x;
        return exports;
      });
    `,
  },
]);

const invalid = createTests([
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
  {
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
  {
    code: `
      /**
       * @NScriptType ClientScript
       */
      define([], () => ({ notAnEntryPoint: x }));
    `,
    errors: [{ messageId: 'returnEntryPoint', data: { type: 'ClientScript' } }],
  },
]);

ruleTester.run(RULE_NAME, rule, { valid, invalid });
