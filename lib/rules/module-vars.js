'use strict';

const moduleUtil = require('../util/modules');
const { moduleNames } = require('../util/modules');

module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      useCorrectName: "Identifier for {{ module }} should be '{{ id }}'",
    },
    schema: [
      {
        type: 'object',
        properties: getSchemaProperties(),
        additionalProperties: false,
      },
    ],
  },

  create: (context) => ({
    'CallExpression[callee.name=define]': (node) => {
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
              id: configVar,
            },
          });
        }
      }
    },
  }),
};

/**
 * Get schema properties from module names
 * @returns {Object}
 */
function getSchemaProperties() {
  let properties = moduleNames.map((name) => {
    return {
      [name]: {
        type: 'string',
      },
    };
  });

  return Object.assign({}, ...properties);
}
