import path from 'node:path';
import rule from '../../lib/rules/script-type';
import ruleTester, { createTests } from '../rule-tester';

const RULE_NAME = path.basename(import.meta.filename, '.test.ts');

const valid = createTests([
  {
    name: 'single script type tag',
    code: `
      /**
       * @NScriptType Suitelet
       */
    `,
  },
  {
    name: 'two script type tags',
    code: `
      /**
       * @NScriptType Suitelet
       */
      /**
       * @NScriptType SuiteletScript
       */
    `,
  },
]);

const invalid = createTests([
  {
    name: 'missing script type value',
    code: `
      /**
       * @NScriptType
       */
    `,
    errors: [{ messageId: 'noValue' }],
  },
  {
    name: 'invalid script type',
    code: `
      /**
       * @NScriptType Invalid
       */
    `,
    errors: [{ messageId: 'invalidValue', data: { value: 'Invalid' } }],
  },
]);

ruleTester.run(RULE_NAME, rule, { valid, invalid });
