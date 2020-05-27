/**
 * @fileoverview Restrict loading of the N/log module to favor global Log
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
    type: 'suggestion',
    messages: {
      useGlobalLog: 'Use global log instead of the N/log module'
    }
  },

  create: function(context) {
    return {
      'CallExpression[callee.name=define]': function(node) {
        const logModule = moduleUtil.getModuleNodePair(node, 'N/log');

        if (logModule) {
          context.report({
            node: logModule.name,
            messageId: 'useGlobalLog'
          });
        }
      }
    };
  }
};