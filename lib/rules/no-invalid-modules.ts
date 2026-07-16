import path from 'node:path';
import type { Rule } from 'eslint';
import type { CallExpression, Literal } from 'estree';
import pkg from '../../package.json';
import { getModules } from '../utils/modules';

const RULE_NAME = path.basename(import.meta.filename, '.ts');

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce valid SuiteScript modules in define array',
      url: `${pkg.homepage}/blob/master/docs/rules/${RULE_NAME}.md`,
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
