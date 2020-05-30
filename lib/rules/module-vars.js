/**
 * @fileoverview Enforce configured module identifiers
 * @author Adam Davies
 */

'use strict';

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

const moduleUtil = require('../util/modules');

const MODULE_NAMES = require('../util/moduleNames');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      useCorrectName: 'Identifier for {{ module }} should be \'{{ id }}\''
    },
    schema: [
      {
        type: 'object',
        properties: getSchemaProperties(),
        additionalProperties: false
      }
    ]
  },

  create: function(context) {
    return {
      'CallExpression[callee.name=define]': function(node) {
        if (!context.options[0]) return;

        const config = context.options[0];
        const modules = moduleUtil.getModules(node);

        if (modules.varCount === 0) return;

        for (const module of modules.list) {
          const configVar = config[module.name];

          if (configVar && configVar !== module.variable) {
            context.report({
              node: module.nodes.variable,
              messageId: 'useCorrectName',
              data: {
                module: module.name,
                id: configVar
              }
            });
          }
        }
      }
    };
  }
};

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Get schema properties from module names
 * @returns {Object}
 */
function getSchemaProperties() {
  let properties = MODULE_NAMES.map((name) => {
    return {
      [name]: {
        type: 'string'
      }
    };
  });

  return Object.assign({}, ...properties);
}