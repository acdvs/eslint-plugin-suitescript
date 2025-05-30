'use strict';

const moduleUtil = require('../util/modules');

module.exports = {
  meta: {
    type: 'problem',
    messages: {
      excessName: "Excess module name '{{ name }}'",
      excessVar: "Excess module identifier '{{ var }}'",
    },
  },

  create: (context) => ({
    'CallExpression[callee.name=define]': (node) => {
      const modules = moduleUtil.getModules(node);
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
