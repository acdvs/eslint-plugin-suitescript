import path from 'node:path';
import rule from '../../lib/rules/no-invalid-modules';
import ruleTester, { createTests } from '../rule-tester';

const RULE_NAME = path.basename(import.meta.filename, '.test.ts');

const valid = createTests([
  {
    code: 'define(["N/record"], function(record) {});',
  },
  {
    code: 'define(["N/search"], function(search) {});',
  },
  {
    code: 'define(["customModule"], function(customModule) {});',
  },
  {
    code: 'define(["customModule", "N/file"], function(customModule, file) {});',
  },
  {
    code: 'define([], function() {});',
  },
]);

const invalid = createTests([
  {
    code: 'define(["N/invalid"], function(invalid) {});',
    errors: [{ messageId: 'invalidModule', data: { module: 'N/invalid' } }],
  },
  {
    code: 'define(["N/file", "N/invalid"], function(file, invalid) {});',
    errors: [{ messageId: 'invalidModule', data: { module: 'N/invalid' } }],
  },
  {
    code: 'define(["customModule", "N/invalid"], function(customModule, invalid) {});',
    errors: [{ messageId: 'invalidModule', data: { module: 'N/invalid' } }],
  },
]);

ruleTester.run(RULE_NAME, rule, { valid, invalid });
