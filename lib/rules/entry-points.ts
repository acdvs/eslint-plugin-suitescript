import type { Rule } from 'eslint';
import type { CallExpression, ReturnStatement, Statement } from 'estree';
import { getScriptType } from '../utils/metadata';

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

      if (!scriptType?.value) return;
      if (!scriptType.def) return;
      const def = scriptType.def;

      const argsCount = node.arguments.length;
      const callback = node.arguments[argsCount - 1];

      if (
        !callback ||
        (callback.type !== 'FunctionExpression' &&
          callback.type !== 'ArrowFunctionExpression')
      ) {
        return;
      }

      const callbackBody =
        callback.body.type === 'BlockStatement' ? callback.body.body : [];
      const returnStatement = callbackBody.find(
        (n): n is ReturnStatement => n.type === 'ReturnStatement',
      );
      const returnArgument =
        callback.body.type !== 'BlockStatement'
          ? callback.body
          : returnStatement?.argument;

      if (returnArgument?.type === 'ObjectExpression') {
        for (const property of returnArgument.properties) {
          if (
            property.type === 'Property' &&
            property.key.type === 'Identifier' &&
            def.entryPoints.includes(property.key.name) &&
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
          (n: Statement) =>
            n.type === 'ExpressionStatement' &&
            n.expression.type === 'AssignmentExpression' &&
            n.expression.left.type === 'MemberExpression' &&
            n.expression.left.object.type === 'Identifier' &&
            n.expression.left.object.name === returnArgument.name &&
            n.expression.left.property.type === 'Identifier' &&
            def.entryPoints.includes(n.expression.left.property.name),
        );

        if (returnAssignments.length > 0) {
          hasValidEntryPoint = true;
        }
      }

      if (def.entryPoints.length === 0) {
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
