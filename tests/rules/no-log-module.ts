import path from 'node:path';
import rule from '../../lib/rules/no-log-module';
import ruleTester, { createTests } from '../rule-tester';

const RULE_NAME = path.basename(import.meta.filename, '.test.ts');

const valid = createTests([
  {
    code: 'define(["N/record"], function(record) {});',
  },
  {
    code: 'define(["N/search", "N/file"], function(search, file) {});',
  },
  {
    code: 'define(["N/record", "N/file", "N/search"], function(record, file, search) {});',
  },
  {
    code: 'define([], function() {});',
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
       * @NScriptType Suitelet
       */
      define([], function() {});
    `,
  },
  {
    code: `
      /**
       * @NScriptType Suitelet
       */
      define([], function() {});
    `,
    options: [{ allowInClientScripts: false }],
  },
  {
    code: `
      /**
       * @NScriptType ClientScript
       */
      define([], function() {});
    `,
  },
  {
    code: `
      /**
       * @NScriptType ClientScript
       */
      define(["N/log"], function(log) {});
    `,
  },
  {
    code: `
      /**
       * @NScriptType ClientScript
       */
      define(["N/log"], function(log) {});
    `,
    options: [{ allowInClientScripts: true }],
  },
]);

const invalid = createTests([
  {
    code: 'define(["N/log"], function(log) {});',
    errors: [{ messageId: 'useGlobalLog' }],
  },
  {
    code: 'define(["N/record", "N/log"], function(record, log) {});',
    errors: [{ messageId: 'useGlobalLog' }],
  },
  {
    code: `
      /**
       * @NScriptType Suitelet
       */
      define(["N/log"], function(log) {});
    `,
    errors: [{ messageId: 'useGlobalLog' }],
  },
  {
    code: `
      /**
       * @NScriptType Suitelet
       */
      define(["N/log"], function(log) {});
    `,
    options: [{ allowInClientScripts: true }],
    errors: [{ messageId: 'useGlobalLog' }],
  },
  {
    code: `
      /**
       * @NScriptType Suitelet
       */
      define(["N/log"], function(log) {});
    `,
    options: [{ allowInClientScripts: false }],
    errors: [{ messageId: 'useGlobalLog' }],
  },
  {
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
