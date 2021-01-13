/**
 * @fileoverview Enforce "@NScriptType" values
 * @author Adam Davies
 */

'use strict';

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

const metadataUtil = require('../util/metadata');
const scriptTypeMap = require('../util/scriptTypes');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    messages: {
      invalidValue: 'Invalid @NScriptType value: {{ value }}',
      noValue: 'No @NScriptType value provided'
    }
  },

  create: function(context) {
    return {
      Program: function() {
        const scriptType = metadataUtil.getScriptType(context);
        const scriptTypes = Object.keys(scriptTypeMap);

        if (!scriptType) return;

        if (!scriptType.value) {
          context.report({
            messageId: 'noValue',
            loc: scriptType.locs.tag
          });
        } else if (scriptType.locs.value && !scriptTypes.includes(scriptType.value)) {
          context.report({
            messageId: 'invalidValue',
            data: {
              value: scriptType.value
            },
            loc: scriptType.locs.value
          });
        }
      }
    };
  }
};