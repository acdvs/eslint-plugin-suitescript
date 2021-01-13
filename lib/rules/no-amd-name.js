/**
 * @fileoverview Enforce no naming of AMD modules
 * @author Adam Davies
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      noModuleName: 'No AMD module name should be provided'
    },
    fixable: 'code'
  },

  create: function(context) {
    return {
      'CallExpression[callee.name=define]': function(node) {
        if (node.arguments.length !== 3) {
          return;
        }

        const arg1 = node.arguments[0];
        const arg2 = node.arguments[1];

        if (
          arg1 &&
          arg1.type === 'Literal' &&
          typeof arg1.value === 'string'
        ) {
          context.report({
            node: arg1,
            messageId: 'noModuleName',
            fix: function(fixer) {
              return fixer.replaceTextRange([arg1.start, arg2.start], '');
            }
          });
        }
      }
    };
  }
};