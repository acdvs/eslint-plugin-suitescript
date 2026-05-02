import type { Rule } from 'eslint';
import type { CallExpression } from 'estree';
import { getScriptType } from '../util/metadata';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce inclusion of at least one entry point based on @NScriptType',
      url: 'https://github.com/acdvs/eslint-plugin-suitescript/blob/master/docs/rules/entry-points.md',
    },
    schema: [],
    messages: {
      returnEntryPoint: 'Return at least one valid {{ type }} entry point',
    },
  },
  create: (context) => ({
    'CallExpression[callee.name=define]': (node: CallExpression) => {
      let hasValidEntryPoint = false;
      const scriptType = getScriptType(context);

      if (!scriptType?.value || !scriptType.def) {
        return;
      }

      const argsCount = node.arguments.length;
      const callback = node.arguments[argsCount - 1];

      if (
        !callback ||
        (callback.type !== 'FunctionExpression' &&
          callback.type !== 'ArrowFunctionExpression')
      ) {
        return;
      }

      const hasBlockBody = callback.body.type === 'BlockStatement';
      const callbackBody = hasBlockBody ? callback.body.body : [];
      const returnStatement =
        hasBlockBody && callbackBody.find((n) => n.type === 'ReturnStatement');
      const returnArgument = hasBlockBody
        ? returnStatement?.argument
        : callback.body;

      if (returnArgument?.type === 'ObjectExpression') {
        for (const property of returnArgument.properties) {
          if (
            scriptType.def.entryPoints.includes(property.key.name) &&
            (property.value.type === 'Identifier' ||
              property.value.type === 'FunctionExpression' ||
              property.value.type === 'ArrowFunctionExpression')
          ) {
            hasValidEntryPoint = true;
            break;
          }
        }
      }

      if (returnArgument && returnArgument.type === 'Identifier') {
        const returnAssignments = callbackBody.filter(
          (n) =>
            n.type === 'ExpressionStatement' &&
            n.expression.type === 'AssignmentExpression' &&
            n.expression.left.type === 'MemberExpression' &&
            n.expression.left.object.name === returnArgument.name &&
            scriptType.def.entryPoints.includes(
              n.expression.left.property.name,
            ),
        );

        if (returnAssignments.length > 0) {
          hasValidEntryPoint = true;
        }
      }

      if (scriptType.def.entryPoints.length === 0) {
        hasValidEntryPoint = true;
      }

      if (!hasValidEntryPoint) {
        context.report({
          node: returnStatement || callback,
          messageId: 'returnEntryPoint',
          data: {
            type: scriptType.value,
          },
        });
      }
    },
  }),
};

export default rule;
