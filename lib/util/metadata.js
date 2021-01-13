/**
 * @fileoverview Utilities for script metadata
 * @author Adam Davies
 */

'use strict';

const SCRIPT_TAG = '@NScriptType';
const SCRIPT_TAG_REGEX = /@NScriptType(?: (\S+))?/;

/**
 * Gets "@NScriptType" value and metadata
 * @param {Object} context Execution context
 * @returns {(Object|null)}
 */
function getScriptType(context) {
  const sourceCode = context.getSourceCode();
  const comment = sourceCode.getAllComments().find(node => SCRIPT_TAG_REGEX.test(node.value));

  if (!comment || comment.type !== 'Block') {
    return null;
  }

  const scriptType = comment.value.match(SCRIPT_TAG_REGEX)[1];

  const commentIndex = sourceCode.getIndexFromLoc(comment.loc.start) + 1;
  const tagIndex = commentIndex + comment.value.indexOf(SCRIPT_TAG) + 1;
  const typeIndex = tagIndex + SCRIPT_TAG.length + 1;

  return {
    value: scriptType,
    locs: {
      tag: {
        start: sourceCode.getLocFromIndex(tagIndex),
        end: sourceCode.getLocFromIndex(tagIndex + SCRIPT_TAG.length)
      },
      value: scriptType && {
        start: sourceCode.getLocFromIndex(typeIndex),
        end: sourceCode.getLocFromIndex(typeIndex + scriptType.length)
      }
    }
  };
}

module.exports = {
  getScriptType
};