/**
 * @fileoverview Enforce inclusion of at least one entry point based on "@NScriptType"
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
      returnEntryPoint: 'Return at least one valid {{ type }} entry point'
    }
  },

  create: function(context) {
    return {
      'CallExpression[callee.name=define]': function(node) {
        let hasValidEntryPoint = false;
        let scriptType = metadataUtil.getScriptType(context);
        const scriptTypes = Object.keys(scriptTypeMap);

        scriptType = scriptType && scriptType.value;

        if (!scriptType || !scriptTypes.includes(scriptType)) {
          return;
        }

        const argsCount = node.arguments.length;
        const callback = node.arguments[argsCount - 1];

        if (!callback || callback.type !== 'FunctionExpression') {
          return;
        }

        const callbackBody = callback.body.body;
        const returnStatement = callbackBody.length > 0 && callbackBody.find(n => n.type === 'ReturnStatement');
        const returnArgument = returnStatement && returnStatement.argument;

        if (returnArgument && returnArgument.type === 'ObjectExpression') {
          for (const property of returnArgument.properties) {
            if (
              scriptTypeMap[scriptType].entryPoints.includes(property.key.name) &&
              (property.value.type === 'Identifier' ||
              property.value.type === 'FunctionExpression')
            ) {
              hasValidEntryPoint = true;
              break;
            }
          }
        }

        if (returnArgument && returnArgument.type === 'Identifier') {
          const returnAssignments = callbackBody.filter(n =>
            n.type === 'ExpressionStatement' &&
            n.expression.left.type === 'MemberExpression' &&
            n.expression.left.object.name === returnArgument.name &&
            scriptTypeMap[scriptType].entryPoints.includes(n.expression.left.property.name)
          );
          if (returnAssignments.length > 0) {
            hasValidEntryPoint = true;
          }
        }

        if (!hasValidEntryPoint) {
          context.report({
            node: returnStatement || callback,
            messageId: 'returnEntryPoint',
            data: {
              type: scriptType
            }
          });
        }
      }
    };
  }
};