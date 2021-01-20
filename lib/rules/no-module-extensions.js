/**
 * @fileoverview Restrict filename extensions on module dependencies
 * @author Michoel Chaikin
 */

'use strict';

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

const moduleUtil = require('../util/modules');

const INVALID_MODULE_REGEX = /\.js/;

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    messages: {
      invalidModuleExtension: 'Module name should not include file extension'
    },
    fixable: 'code'
  },

  create: function(context) {
    let invalidModuleNodes = [];

    return {
      'CallExpression[callee.name=define]': function(node) {
        const modules = moduleUtil.getModules(node).list;

        invalidModuleNodes = modules.filter(m => INVALID_MODULE_REGEX.test(m.name)).map(m => m.nodes.name);

        for (const invalidModuleNode of invalidModuleNodes) {
          context.report({
            node: invalidModuleNode,
            messageId: 'invalidModuleExtension',
            fix: function(fixer) {
              const fixedModuleName = invalidModuleNode.raw.replace(INVALID_MODULE_REGEX, '');
              return fixer.replaceText(invalidModuleNode, fixedModuleName);
            }
          });
        }
      }
    };
  }
};