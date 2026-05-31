import path from 'node:path';
import rule from '../../lib/rules/module-vars';
import ruleTester, { createTests } from '../rule-tester';

const RULE_NAME = path.basename(import.meta.filename, '.test.ts');

const valid = createTests([
  {
    code: 'define(["N/record"], function(record) {});',
    options: [{ 'N/record': 'record' }],
  },
  {
    code: 'define(["N/https"], function(https) {});',
    options: [{ 'N/https': 'https' }],
  },
  {
    code: 'define(["N/ui/serverWidget"], function(ui) {});',
    options: [{ 'N/ui/serverWidget': 'ui' }],
  },
  {
    code: 'define(["N/file", "N/runtime"], function(file, runtime) {});',
    options: [{ 'N/file': 'file', 'N/runtime': 'runtime' }],
  },
  {
    code: 'define(["N/file", "N/runtime"], function(f, r) {});',
    options: [{ 'N/file': 'f', 'N/runtime': 'r' }],
  },
  {
    code: 'define(["N/record", "N/search"], function(record) {});',
    options: [{ 'N/record': 'record', 'N/search': 'search' }],
  },
]);

const invalid = createTests([
  {
    code: 'define(["N/record"], function(test) {});',
    options: [{ 'N/record': 'record' }],
    errors: [
      {
        messageId: 'useCorrectName',
        data: { module: 'N/record', id: 'record' },
      },
    ],
  },
  {
    code: 'define(["N/record", "N/search"], function(wrongName) {});',
    options: [{ 'N/record': 'record', 'N/search': 'search' }],
    errors: [
      {
        messageId: 'useCorrectName',
        data: { module: 'N/record', id: 'record' },
      },
    ],
  },
]);

ruleTester.run(RULE_NAME, rule, { valid, invalid });
