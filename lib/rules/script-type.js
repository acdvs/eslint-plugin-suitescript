'use strict';

const { getScriptType } = require('../util/metadata');
const { scriptTypes } = require('../util/scriptTypes');

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
      } else if (scriptType.locs.value && !scriptTypes.includes(scriptType.value)) {
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
