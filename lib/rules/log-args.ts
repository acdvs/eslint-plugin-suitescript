import type { Rule } from 'eslint';
import type { CallExpression } from 'estree';
import { getModuleNodePair, type ModuleNodes } from '../utils/modules';
import { getPropByKey } from '../utils/objects';

type Options = {
  requireTitle: boolean;
  requireDetails: boolean;
};

const LOG_MEMBERS = ['debug', 'audit', 'error', 'emergency'];

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce correct log arguments',
      url: 'https://github.com/acdvs/eslint-plugin-suitescript/blob/master/docs/rules/log-args.md',
    },
    messages: {
      titleRequired: "A log title is required with 'Log.{{ prop }}'",
      detailsRequired: "Log details are required with 'Log.{{ prop }}'",
    },
    schema: [
      {
        type: 'object',
        properties: {
          requireTitle: {
            type: 'boolean',
          },
          requireDetails: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create: (context) => {
    const { requireTitle, requireDetails } = (context.options[0] ??
      {}) as Options;

    let logModule: ModuleNodes | undefined;

    return {
      'CallExpression[callee.name=define]': (node: CallExpression) => {
        logModule = getModuleNodePair(node, 'N/log');
      },
      'CallExpression[callee.object.type=Identifier]': (
        node: CallExpression,
      ) => {
        const args = node.arguments;
        const noArgsRequired = !requireTitle && !requireDetails;

        if (args.length === 0 || noArgsRequired) {
          return;
        }

        const callee = node.callee;

        if (
          callee.type !== 'MemberExpression' ||
          callee.object.type !== 'Identifier' ||
          callee.property.type !== 'Identifier'
        ) {
          return;
        }

        const logVar = logModule?.variable?.name ?? 'log';
        const isValidLogType = LOG_MEMBERS.includes(callee.property.name);

        if (callee.object.name !== logVar || !isValidLogType) {
          return;
        }

        const firstArg = args[0];
        const firstArgIsObj = firstArg.type === 'ObjectExpression';
        const objMissingTitle =
          firstArgIsObj && !getPropByKey(firstArg, 'title');

        if (requireTitle && objMissingTitle) {
          context.report({
            node,
            messageId: 'titleRequired',
            data: {
              prop: callee.property.name,
            },
          });
        }

        const onlyOneNonObjArg = !firstArgIsObj && args.length === 1;
        const objMissingDetails =
          firstArgIsObj && !getPropByKey(firstArg, 'details');

        if (requireDetails && (onlyOneNonObjArg || objMissingDetails)) {
          context.report({
            node,
            messageId: 'detailsRequired',
            data: {
              prop: callee.property.name,
            },
          });
        }
      },
    };
  },
};

export default rule;
