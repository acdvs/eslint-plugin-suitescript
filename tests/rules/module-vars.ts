import path from 'node:path';
import rule from '../../lib/rules/module-vars';
import ruleTester, { createTests } from '../rule-tester';

const RULE_NAME = path.basename(import.meta.filename, '.test.ts');

const valid = createTests([
  {
    name: 'one module, default name',
    code: 'define(["N/record"], (record) => {});',
  },
  {
    name: 'one module, custom name',
    code: 'define(["N/ui/serverWidget"], (ui) => {});',
    options: [{ 'N/ui/serverWidget': 'ui' }],
  },
  {
    name: 'two modules, default names',
    code: 'define(["N/file", "N/runtime"], (file, runtime) => {});',
  },
  {
    name: 'two modules, custom names',
    code: 'define(["N/file", "N/runtime"], (f, r) => {});',
    options: [{ 'N/file': 'f', 'N/runtime': 'r' }],
  },
]);

const invalid = createTests([
  {
    name: 'one module, incorrect default name',
    code: 'define(["N/record"], (test) => {});',
    errors: [
      {
        messageId: 'useCorrectName',
        data: { module: 'N/record', id: 'record' },
      },
    ],
  },
  {
    name: 'two modules, switched default names',
    code: 'define(["N/record", "N/search"], (search, record) => {});',
    errors: [
      {
        messageId: 'useCorrectName',
        data: { module: 'N/record', id: 'record' },
      },
      {
        messageId: 'useCorrectName',
        data: { module: 'N/search', id: 'search' },
      },
    ],
  },
]);

ruleTester.run(RULE_NAME, rule, { valid, invalid });
