import path from 'node:path';
import rule from '../../lib/rules/log-args';
import ruleTester, { createTests } from '../rule-tester';

const RULE_NAME = path.basename(import.meta.filename, '.test.ts');

const valid = createTests([
  {
    code: `
      define([], function() {
        log.debug("title", "description");
      });
    `,
  },
  {
    code: `
      define(["N/log", "N/extra"], function(logModule) {
        log.debug("title", "description");
      });
    `,
  },
  {
    code: `
      define([], function() {
        log.debug({ title: "Title", details: "Message" });
      });
    `,
  },
  {
    code: `
      define([], function() {
        log.debug({ title: "Title" });
      });
    `,
    options: [{ requireTitle: true }],
  },
  {
    code: `
      define([], function() {
        log.debug({ details: "Message" });
      });
    `,
    options: [{ requireDetails: true }],
  },
  {
    code: `
      define([], function() {
        log.error({ details: "Error message" });
      });
    `,
    options: [{ requireDetails: true }],
  },
  {
    code: `
      define([], function() {
        log.custom({ details: "Message" });
      });
    `,
    options: [{ requireDetails: true }],
  },
  {
    code: `
      define(["N/log"], function(log) {
        log.debug({ details: "Message" });
      });
    `,
    options: [{ requireDetails: true }],
  },
  {
    code: `
      define(["N/record"], function(record) {
        log.debug({ title: "Message" });
      });
    `,
    options: [{ requireTitle: true }],
  },
]);

const invalid = createTests([
  {
    code: `
      define([], function() {
        log.debug("title");
      });
    `,
    options: [{ requireDetails: true }],
    errors: [{ messageId: 'detailsRequired', data: { prop: 'debug' } }],
  },
  {
    code: `
      define([], function() {
        log.audit("title");
      });
    `,
    options: [{ requireDetails: true }],
    errors: [{ messageId: 'detailsRequired', data: { prop: 'audit' } }],
  },
  {
    code: `
      define([], function() {
        log.error({ details: "Message" }, "title");
      });
    `,
    options: [{ requireTitle: true }],
    errors: [{ messageId: 'titleRequired', data: { prop: 'error' } }],
  },
  {
    code: `
      define(["N/record", "N/log"], function(record, log) {
        log.debug("test");
      });
    `,
    options: [{ requireDetails: true }],
    errors: [{ messageId: 'detailsRequired', data: { prop: 'debug' } }],
  },
]);

ruleTester.run(RULE_NAME, rule, { valid, invalid });
