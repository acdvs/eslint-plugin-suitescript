/**
 * @fileoverview Restrict loading of the N/log module to favor global Log
 * @author Adam Davies
 */

'use strict';

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

const moduleUtil = require('../util/modules');
const metadataUtil = require('../util/metadata');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      useGlobalLog: 'Use global log instead of the N/log module'
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowInClientScripts: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ]
  },

  create: function(context) {
    return {
      'CallExpression[callee.name=define]': function(node) {
        const config = context.options[0] || { allowInClientScripts: true };

        const logModule = moduleUtil.getModuleNodePair(node, 'N/log');
        const scriptType = metadataUtil.getScriptType(context);
        const isClientScript = scriptType && scriptType.value === 'ClientScript';

        if (isClientScript && config.allowInClientScripts) {
          return;
        }

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