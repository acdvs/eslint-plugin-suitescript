/**
 * @fileoverview Enforce "@NApiVersion" values
 * @author Adam Davies
 */

'use strict';

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

const VERSION_TAG = '@NApiVersion';
const VERSION_TAG_REGEX = /@NApiVersion(?: (\S+))?/;
const VERSIONS = ['1.0', '2.x', '2.0', '2.1'];

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    messages: {
      invalidValue: 'Invalid @NApiVersion value \'{{ value }}\'',
      noValue: 'No @NApiVersion value provided'
    }
  },

  create: function(context) {
    return {
      Program: function() {
        const sourceCode = context.getSourceCode();
        const comment = sourceCode.getAllComments().find(node => VERSION_TAG_REGEX.test(node.value));

        if (!comment || comment.type !== 'Block') {
          return;
        }

        const version = comment.value.match(VERSION_TAG_REGEX)[1];
        const commentIndex = sourceCode.getIndexFromLoc(comment.loc.start) + 1;
        const tagIndex = commentIndex + comment.value.indexOf(VERSION_TAG) + 1;

        if (!version) {
          context.report({
            messageId: 'noValue',
            loc: {
              start: sourceCode.getLocFromIndex(tagIndex),
              end: sourceCode.getLocFromIndex(tagIndex + VERSION_TAG.length)
            }
          });
        } else if (!VERSIONS.includes(version)) {
          const typeIndex = tagIndex + VERSION_TAG.length + 1;

          context.report({
            messageId: 'invalidValue',
            data: {
              value: version
            },
            loc: {
              start: sourceCode.getLocFromIndex(typeIndex),
              end: sourceCode.getLocFromIndex(typeIndex + version.length)
            }
          });
        }
      }
    };
  }
};