import type { Rule } from 'eslint';
import { getScriptTypeDef } from './script-types';

const SCRIPT_TAG = '@NScriptType';
const SCRIPT_TAG_REGEX = /@NScriptType(?: (\S+))?/;

function getScriptType(context: Rule.RuleContext) {
  const sourceCode = context.sourceCode;
  const comment = sourceCode
    .getAllComments()
    .find((node) => SCRIPT_TAG_REGEX.test(node.value));

  if (!comment?.loc || comment.type !== 'Block') {
    return;
  }

  const scriptType = comment.value.match(SCRIPT_TAG_REGEX)?.[1];

  if (!scriptType) {
    return;
  }

  const commentIndex = sourceCode.getIndexFromLoc(comment.loc.start) + 1;
  const tagIndex = commentIndex + comment.value.indexOf(SCRIPT_TAG) + 1;
  const typeIndex = tagIndex + SCRIPT_TAG.length + 1;

  return {
    value: scriptType,
    def: getScriptTypeDef(scriptType),
    locs: {
      tag: {
        start: sourceCode.getLocFromIndex(tagIndex),
        end: sourceCode.getLocFromIndex(tagIndex + SCRIPT_TAG.length),
      },
      value: scriptType && {
        start: sourceCode.getLocFromIndex(typeIndex),
        end: sourceCode.getLocFromIndex(typeIndex + scriptType.length),
      },
    },
  };
}

export { getScriptType };
