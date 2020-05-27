/**
 * @fileoverview Enforce correct log arguments
 * @author Adam Davies
 */

'use strict';

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

const moduleUtil = require('../util/modules');
const objectUtil = require('../util/objects');

const LOG_MEMBERS = ['debug', 'audit', 'error', 'emergency'];

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      titleRequired: 'A log title is required with \'Log.{{ prop }}\'',
      detailsRequired: 'Log details are required with \'Log.{{ prop }}\''
    },
    schema: [
      {
        type: 'object',
        properties: {
          requireTitle: {
            type: 'boolean'
          },
          requireDetails: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ]
  },

  create: function(context) {
    let logModule;

    return {
      'CallExpression[callee.name=define]': function(node) {
        logModule = moduleUtil.getModuleNodePair(node, 'N/log');
      },
      'CallExpression[callee.object.type=Identifier]': function(node) {
        let config = context.options[0] || { requireTitle: true, requireDetails: true };
        const args = node.arguments;

        if (args.length === 0 || (!config.requireTitle && !config.requireDetails)) {
          return;
        }

        const callee = node.callee;
        const logVar = logModule ? logModule.variable.name : 'log';

        if (callee.object.name !== logVar || !LOG_MEMBERS.includes(callee.property.name)) {
          return;
        }

        if (
          config.requireTitle &&
          (args[0].type === 'ObjectExpression' && !objectUtil.getPropByKey(args[0], 'title'))
        ) {
          context.report({
            node,
            messageId: 'titleRequired',
            data: {
              prop: callee.property.name
            }
          });
        }

        if (
          config.requireDetails &&
          (
            (args[0].type !== 'ObjectExpression' && !args[1]) ||
            (args[0].type === 'ObjectExpression' && !objectUtil.getPropByKey(args[0], 'details'))
          )
        ) {
          context.report({
            node,
            messageId: 'detailsRequired',
            data: {
              prop: callee.property.name
            }
          });
        }
      }
    };
  }
};