'use strict';

const moduleUtil = require('../util/modules');

module.exports = {
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
      'CallExpression[callee.name=define]': (node) => {
        const modules = moduleUtil.getModules(node).list;
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
