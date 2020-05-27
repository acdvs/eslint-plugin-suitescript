/**
 * @fileoverview Enforce valid SuiteScript modules in define array
 * @author Adam Davies
 */

'use strict';

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

const moduleUtil = require('../util/modules');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    messages: {
      invalidModule: 'Invalid NetSuite module \'{{ module }}\''
    }
  },

  create: function(context) {
    let invalidModuleNodes = [];

    return {
      'CallExpression[callee.name=define]': function(node) {
        const modules = moduleUtil.getModules(node).list;
        invalidModuleNodes = modules.filter(m => !m.isValid && m.nodes.name).map(m => m.nodes.name);

        for (const invalidModuleNode of invalidModuleNodes) {
          context.report({
            node: invalidModuleNode,
            messageId: 'invalidModule',
            data: {
              module: invalidModuleNode.value
            }
          });
        }
      }
    };
  }
};