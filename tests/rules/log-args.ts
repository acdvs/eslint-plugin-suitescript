import path from 'node:path';
import rule from '../../lib/rules/log-args';
import ruleTester, { createTests } from '../rule-tester';

const RULE_NAME = path.basename(import.meta.filename, '.test.ts');

const valid = createTests([
  {
    name: 'title and details as args',
    code: `
      define([], () => {
        log.debug("title", "details");
      });
    `,
  },
  {
    name: 'title and details in obj',
    code: `
      define([], () => {
        log.debug({ title: "title", details: "details" });
      });
    `,
  },
  {
    name: 'null title and details as args',
    code: `
      define([], () => {
        log.debug(null, "details");
      });
    `,
  },
  {
    name: 'title and null details as args',
    code: `
      define([], () => {
        log.debug("title", null);
      });
    `,
  },
  {
    name: 'details off, only title as arg',
    code: `
      define([], () => {
        log.debug("title");
      });
    `,
    options: [{ requireDetails: false }],
  },
  {
    name: 'title off, only details in obj',
    code: `
      define([], () => {
        log.debug({ details: "details" });
      });
    `,
    options: [{ requireTitle: false }],
  },
  {
    name: 'details off, only title in obj',
    code: `
      define([], () => {
        log.debug({ title: "title" });
      });
    `,
    options: [{ requireDetails: false }],
  },
]);

const invalid = createTests([
  {
    name: 'only title as arg',
    code: `
      define([], () => {
        log.debug("title");
      });
    `,
    errors: [{ messageId: 'detailsRequired', data: { prop: 'debug' } }],
  },
  {
    name: 'only title in obj',
    code: `
      define([], () => {
        log.debug({ title: "title" });
      });
    `,
    errors: [{ messageId: 'detailsRequired', data: { prop: 'debug' } }],
  },
  {
    name: 'only details in obj',
    code: `
      define([], () => {
        log.debug({ details: "details" });
      });
    `,
    errors: [{ messageId: 'titleRequired', data: { prop: 'debug' } }],
  },
]);

ruleTester.run(RULE_NAME, rule, { valid, invalid });
