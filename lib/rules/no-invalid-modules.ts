import type { Rule } from 'eslint';
import type { CallExpression, Literal } from 'estree';
import { getModules } from '../utils/modules';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce valid SuiteScript modules in define array',
      url: 'https://github.com/acdvs/eslint-plugin-suitescript/blob/master/docs/rules/no-invalid-modules.md',
    },
    schema: [],
    messages: {
      invalidModule: "Invalid NetSuite module '{{ module }}'",
    },
  },
  create: (context) => {
    let invalidModuleNodes: Literal[] = [];

    return {
      'CallExpression[callee.name=define]': (node: CallExpression) => {
        invalidModuleNodes = getModules(node)
          .list.filter((m) => !m.isValid)
          .map((m) => m.nodes.name)
          .filter((n): n is Literal => n !== null);

        for (const invalidModuleNode of invalidModuleNodes) {
          context.report({
            node: invalidModuleNode,
            messageId: 'invalidModule',
            data: {
              module: String(invalidModuleNode.value),
            },
          });
        }
      },
    };
  },
};

export default rule;
