import path from 'node:path';
import rule from '../../lib/rules/api-version';
import ruleTester, { createTests } from '../rule-tester';

const RULE_NAME = path.basename(import.meta.filename, '.test.ts');

const valid = createTests([
  {
    name: '1.0',
    code: `
      /**
       * @NApiVersion 1.0
       */
    `,
  },
  {
    name: '2.x',
    code: `
      /**
       * @NApiVersion 2.x
       */
    `,
  },
  {
    name: '2.0',
    code: `
      /**
       * @NApiVersion 2.0
       */
    `,
  },
  {
    name: '2.1',
    code: `
      /**
       * @NApiVersion 2.1
       */
    `,
  },
]);

const invalid = createTests([
  {
    name: 'no value',
    code: `
      /**
       * @NApiVersion
       */
      `,
    errors: [{ messageId: 'noValue' }],
  },
  {
    name: 'invalid integer',
    code: `
      /**
       * @NApiVersion 1
       */
      `,
    errors: [{ messageId: 'invalidValue', data: { value: 1 } }],
  },
  {
    name: 'invalid float',
    code: `
      /**
       * @NApiVersion 2.2
       */
      `,
    errors: [{ messageId: 'invalidValue', data: { value: 2.2 } }],
  },
  {
    name: 'invalid string',
    code: `
      /**
       * @NApiVersion test
       */
      `,
    errors: [{ messageId: 'invalidValue', data: { value: 'test' } }],
  },
]);

ruleTester.run(RULE_NAME, rule, { valid, invalid });
