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
    type: 'problem',
    messages: {
      noModuleName: 'No AMD module name should be provided'
    }
  },

  create: function(context) {
    return {
      'CallExpression[callee.name=define]': function(node) {
        if (
          node.arguments[0].type === 'Literal' &&
          typeof node.arguments[0].value === 'string'
        ) {
          context.report({
            node: node.arguments[0],
            messageId: 'noModuleName'
          });
        }
      }
    };
  }
};