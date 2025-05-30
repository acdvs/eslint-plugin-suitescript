'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      noModuleName: 'No AMD module name should be provided',
    },
    fixable: 'code',
  },

  create: (context) => ({
    'CallExpression[callee.name=define]': (node) => {
      if (node.arguments.length !== 3) {
        return;
      }

      const arg1 = node.arguments[0];
      const arg2 = node.arguments[1];

      if (arg1 && arg1.type === 'Literal' && typeof arg1.value === 'string') {
        context.report({
          node: arg1,
          messageId: 'noModuleName',
          fix: function (fixer) {
            return fixer.replaceTextRange([arg1.range[0], arg2.range[0]], '');
          },
        });
      }
    },
  }),
};
