import type { Rule } from 'eslint';
import type { CallExpression } from 'estree';
import { getModules } from '../util/modules';

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
    let invalidModuleNodes = [];

    return {
      'CallExpression[callee.name=define]': (node: CallExpression) => {
        const modules = getModules(node).list;
        invalidModuleNodes = modules
          .filter((m) => !m.isValid && m.nodes.name)
          .map((m) => m.nodes.name);

        for (const invalidModuleNode of invalidModuleNodes) {
          context.report({
            node: invalidModuleNode,
            messageId: 'invalidModule',
            data: {
              module: invalidModuleNode.value,
            },
          });
        }
      },
    };
  },
};

export default rule;
