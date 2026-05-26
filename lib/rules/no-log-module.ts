import type { Rule } from 'eslint';
import type { CallExpression } from 'estree';
import { getScriptType } from '../utils/metadata';
import { getModuleNodePair } from '../utils/modules';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Restrict loading of the N/log module in favor of global log',
      url: 'https://github.com/acdvs/eslint-plugin-suitescript/blob/master/docs/rules/no-log-module.md',
    },
    messages: {
      useGlobalLog: 'Use global log instead of the N/log module',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowInClientScripts: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create: (context) => ({
    'CallExpression[callee.name=define]': (node: CallExpression) => {
      const config = context.options[0] || { allowInClientScripts: true };

      const logModule = getModuleNodePair(node, 'N/log');
      const scriptType = getScriptType(context);
      const isClientScript = scriptType && scriptType.value === 'ClientScript';

      if (isClientScript && config.allowInClientScripts) {
        return;
      }

      if (logModule) {
        context.report({
          node: logModule.name,
          messageId: 'useGlobalLog',
        });
      }
    },
  }),
};

export default rule;
