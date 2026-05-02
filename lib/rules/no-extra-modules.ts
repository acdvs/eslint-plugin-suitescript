import type { Rule } from 'eslint';
import type { CallExpression } from 'estree';
import { getModules } from '../util/modules';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce equal number of module literals and identifiers',
      url: 'https://github.com/acdvs/eslint-plugin-suitescript/blob/master/docs/rules/no-extra-modules.md',
    },
    schema: [],
    messages: {
      excessName: "Excess module name '{{ name }}'",
      excessVar: "Excess module identifier '{{ var }}'",
    },
  },
  create: (context) => ({
    'CallExpression[callee.name=define]': (node: CallExpression) => {
      const modules = getModules(node);
      const nameCount = modules.nameCount;
      const varCount = modules.varCount;

      if (nameCount === varCount) return;

      const excessCount =
        nameCount > varCount ? nameCount - varCount : varCount - nameCount;
      const excessModules = modules.list.slice(-excessCount);

      for (const excessModule of excessModules) {
        if (nameCount > varCount) {
          context.report({
            node: excessModule.nodes.name,
            messageId: 'excessName',
            data: {
              name: excessModule.name,
            },
          });
        } else {
          context.report({
            node: excessModule.nodes.variable,
            messageId: 'excessVar',
            data: {
              var: excessModule.variable,
            },
          });
        }
      }
    },
  }),
};

export default rule;
