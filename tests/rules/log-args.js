'use strict';

const RuleTester = require('eslint').RuleTester;
const rule = require('../../lib/rules/log-args');

const parserOptions = {
  ecmaVersion: 2015,
  sourceType: 'module',
};

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('log-args', rule, {
  valid: [
    {
      code: `
define([], function() {
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
  ],

  invalid: [
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
  ],
});
