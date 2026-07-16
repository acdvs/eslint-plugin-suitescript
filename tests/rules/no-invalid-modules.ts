import path from 'node:path';
import rule from '../../lib/rules/no-invalid-modules';
import ruleTester, { createTests } from '../rule-tester';

const RULE_NAME = path.basename(import.meta.filename, '.test.ts');

const valid = createTests([
  {
    name: 'N module',
    code: 'define(["N/record"], (record) => {});',
  },
  {
    name: 'custom module',
    code: 'define(["customModule"], (customModule) => {});',
  },
  {
    name: 'N and custom modules',
    code: 'define(["customModule", "N/file"], (customModule, file) => {});',
  },
  {
    name: 'no modules',
    code: 'define([], () => {});',
  },
]);

const invalid = createTests([
  {
    name: 'invalid N module',
    code: 'define(["N/invalid"], (invalid) => {});',
    errors: [{ messageId: 'invalidModule', data: { module: 'N/invalid' } }],
  },
  {
    name: 'invalid and valid N modules',
    code: 'define(["N/file", "N/invalid"], (file, invalid) => {});',
    errors: [{ messageId: 'invalidModule', data: { module: 'N/invalid' } }],
  },
  {
    name: 'invalid N module and custom module',
    code: 'define(["customModule", "N/invalid"], (customModule, invalid) => {});',
    errors: [{ messageId: 'invalidModule', data: { module: 'N/invalid' } }],
  },
]);

ruleTester.run(RULE_NAME, rule, { valid, invalid });
