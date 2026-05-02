import type { Rule } from 'eslint';
import type { CallExpression } from 'estree';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Restrict naming of AMD modules',
      url: 'https://github.com/acdvs/eslint-plugin-suitescript/blob/master/docs/rules/no-amd-name.md',
    },
    schema: [],
    messages: {
      noModuleName: 'No AMD module name should be provided',
    },
    fixable: 'code',
  },
  create: (context) => ({
    'CallExpression[callee.name=define]': (node: CallExpression) => {
      if (node.arguments.length !== 3) {
        return;
      }

      const arg1 = node.arguments[0];
      const arg2 = node.arguments[1];

      if (arg1 && arg1.type === 'Literal' && typeof arg1.value === 'string') {
        context.report({
          node: arg1,
          messageId: 'noModuleName',
          fix: (fixer) =>
            fixer.replaceTextRange([arg1.range[0], arg2.range[0]], ''),
        });
      }
    },
  }),
};

export default rule;
