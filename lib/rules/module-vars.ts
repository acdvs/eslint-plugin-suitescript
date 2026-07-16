import path from 'node:path';
import { getDefineCall } from '@acdvs/eslint-plugin-amd/utils';
import type { Rule } from 'eslint';
import type { CallExpression, Identifier } from 'estree';
import pkg from '../../package.json';
import { type ModuleName, moduleNames, modules } from '../utils/modules';

type Options = Partial<Record<ModuleName, string>>;

const RULE_NAME = path.basename(import.meta.filename, '.ts');

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce correct module identifiers for each configured module',
      url: `${pkg.homepage}/blob/master/docs/rules/${RULE_NAME}.md`,
    },
    messages: {
      useCorrectName: "Identifier for {{ module }} should be '{{ id }}'",
    },
    schema: [
      {
        type: 'object',
        properties: getSchemaProperties(),
        additionalProperties: false,
      },
    ],
    defaultOptions: [modules],
  },
  create: (context) => {
    const config = (context.options[0] ?? {}) as Options;

    return {
      'CallExpression[callee.name=define]': (node: CallExpression) => {
        if (!context.options[0]) return;

        const defineCall = getDefineCall(node);
        const pairs = defineCall?.depAnalysis?.pairs;

        if (!pairs) return;

        for (const pair of pairs) {
          const moduleName = pair.name?.value as ModuleName;
          const param = pair.param as Identifier;
          const paramName = param.name as ModuleName;
          const configParamName = config[moduleName];

          if (configParamName && paramName !== configParamName) {
            context.report({
              node: param,
              messageId: 'useCorrectName',
              data: {
                module: moduleName,
                id: configParamName,
              },
            });
          }
        }
      },
    };
  },
};

function getSchemaProperties() {
  const properties = moduleNames.map((name) => ({
    [name]: {
      type: 'string',
    },
  }));

  return Object.assign({}, ...properties);
}

export default rule;
