import path from 'node:path';
import rule from '../../lib/rules/no-log-module';
import ruleTester, { createTests } from '../rule-tester';

const RULE_NAME = path.basename(import.meta.filename, '.test.ts');

const valid = createTests([
  {
    name: 'no modules',
    code: 'define([], () => {});',
  },
  {
    name: 'non-log module',
    code: 'define(["N/record"], (record) => {});',
  },
  {
    name: 'client script with log - default',
    code: `
      /**
       * @NScriptType ClientScript
       */
      define(["N/log"], (log) => {});
    `,
  },
  {
    name: 'client script with log - on',
    code: `
      /**
       * @NScriptType ClientScript
       */
      define(["N/log"], (log) => {});
    `,
    options: [{ allowInClientScripts: true }],
  },
]);

const invalid = createTests([
  {
    name: 'log module',
    code: 'define(["N/log"], (log) => {});',
    errors: [{ messageId: 'useGlobalLog' }],
  },
  {
    name: 'client script with log - false',
    code: `
      /**
       * @NScriptType ClientScript
       */
      define(["N/log"], function(log) {});
    `,
    options: [{ allowInClientScripts: false }],
    errors: [{ messageId: 'useGlobalLog' }],
  },
]);

ruleTester.run(RULE_NAME, rule, { valid, invalid });
