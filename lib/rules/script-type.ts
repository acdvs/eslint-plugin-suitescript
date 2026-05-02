import type { Rule } from 'eslint';
import { getScriptType } from '../util/metadata';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce valid @NScriptType tag values',
      url: 'https://github.com/acdvs/eslint-plugin-suitescript/blob/master/docs/rules/script-type.md',
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
