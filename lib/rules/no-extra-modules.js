/**
 * @fileoverview Enforce equal number of module literals and variables
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
      excessName: 'Excess module name \'{{ name }}\'',
      excessVar: 'Excess module identifier \'{{ var }}\''
    }
  },

  create: function(context) {
    return {
      'CallExpression[callee.name=define]': function(node) {
        const modules = moduleUtil.getModules(node);
        const nameCount = modules.nameCount;
        const varCount = modules.varCount;

        if (nameCount === varCount) return;

        const excessCount = nameCount > varCount ? nameCount - varCount : varCount - nameCount;
        const excessModules = modules.list.slice(-excessCount);

        for (const excessModule of excessModules) {
          if (nameCount > varCount) {
            context.report({
              node: excessModule.nodes.name,
              messageId: 'excessName',
              data: {
                name: excessModule.name
              }
            });
          } else {
            context.report({
              node: excessModule.nodes.variable,
              messageId: 'excessVar',
              data: {
                var: excessModule.variable
              }
            });
          }
        }
      }
    };
  }
};