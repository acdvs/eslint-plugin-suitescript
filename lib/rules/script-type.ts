import path from 'node:path';
import type { Rule } from 'eslint';
import pkg from '../../package.json';
import { getScriptType } from '../utils/metadata';

const RULE_NAME = path.basename(import.meta.filename, '.ts');

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce valid @NScriptType tag values',
      url: `${pkg.homepage}/blob/master/docs/rules/${RULE_NAME}.md`,
    },
    schema: [],
    messages: {
      invalidValue: 'Invalid @NScriptType value: {{ value }}',
      noValue: 'No @NScriptType value provided',
    },
  },
  create: (context) => ({
    Program: () => {
      const scriptType = getScriptType(context);

      if (!scriptType) return;

      if (!scriptType.value) {
        context.report({
          messageId: 'noValue',
          loc: scriptType.locs.tag,
        });
      } else if (scriptType.locs.value && !scriptType.def) {
        context.report({
          messageId: 'invalidValue',
          data: {
            value: scriptType.value,
          },
          loc: scriptType.locs.value,
        });
      }
    },
  }),
};

export default rule;
