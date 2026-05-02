import type { Rule } from 'eslint';
import type { CallExpression } from 'estree';
import { getModules } from '../util/modules';

const INVALID_MODULE_REGEX = /\.js/;

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Restrict filename extensions on module dependencies',
      url: 'https://github.com/acdvs/eslint-plugin-suitescript/blob/master/docs/rules/no-module-extensions.md',
    },
    schema: [],
    messages: {
      invalidModuleExtension: 'Module name should not include file extension',
    },
    fixable: 'code',
  },
  create: (context) => {
    let invalidModuleNodes = [];

    return {
      'CallExpression[callee.name=define]': (node: CallExpression) => {
        const modules = getModules(node).list;

        invalidModuleNodes = modules
          .filter((m) => INVALID_MODULE_REGEX.test(m.name))
          .map((m) => m.nodes.name);

        for (const invalidModuleNode of invalidModuleNodes) {
          context.report({
            node: invalidModuleNode,
            messageId: 'invalidModuleExtension',
            fix: (fixer) => {
              const fixedModuleName = invalidModuleNode.raw.replace(
                INVALID_MODULE_REGEX,
                '',
              );
              return fixer.replaceText(invalidModuleNode, fixedModuleName);
            },
          });
        }
      },
    };
  },
};

export default rule;
