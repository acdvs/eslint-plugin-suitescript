'use strict';

const moduleUtil = require('../util/modules');
const metadataUtil = require('../util/metadata');

module.exports = {
  meta: {
    type: 'suggestion',
    messages: {
      useGlobalLog: 'Use global log instead of the N/log module',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowInClientScripts: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create: (context) => ({
    'CallExpression[callee.name=define]': (node) => {
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
          messageId: 'useGlobalLog',
        });
      }
    },
  }),
};
