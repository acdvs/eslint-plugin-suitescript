'use strict';

const { getScriptType } = require('../util/metadata');

module.exports = {
  meta: {
    type: 'problem',
    messages: {
      invalidValue: 'Invalid @NScriptType value: {{ value }}',
      noValue: 'No @NScriptType value provided',
    },
  },

  create: (context) => ({
    Program: () => {
      const scriptType = getScriptType(context);

      if (!scriptType) return;

      if (!scriptType.value) {
        context.report({
          messageId: 'noValue',
          loc: scriptType.locs.tag,
        });
      } else if (scriptType.locs.value && !scriptType.def) {
        context.report({
          messageId: 'invalidValue',
          data: {
            value: scriptType.value,
          },
          loc: scriptType.locs.value,
        });
      }
    },
  }),
};
