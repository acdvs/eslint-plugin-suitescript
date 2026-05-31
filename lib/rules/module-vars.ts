import path from 'node:path';
import type { Rule } from 'eslint';
import type { CallExpression } from 'estree';
import pkg from '../../package.json';
import { getModules, moduleNames } from '../utils/modules';

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
  },
  create: (context) => ({
    'CallExpression[callee.name=define]': (node: CallExpression) => {
      if (!context.options[0]) return;

      const config = context.options[0];
      const modules = getModules(node);

      if (modules.varCount === 0) return;

      for (const module of modules.list) {
        if (!module.nodes.variable || !module.name) continue;

        const configVar = config[module.name];

        if (configVar && configVar !== module.variable) {
          context.report({
            node: module.nodes.variable,
            messageId: 'useCorrectName',
            data: {
              module: module.name,
              id: configVar,
            },
          });
        }
      }
    },
  }),
};

function getSchemaProperties() {
  const properties = moduleNames.map((name) => {
    return {
      [name]: {
        type: 'string',
      },
    };
  });

  return Object.assign({}, ...properties);
}

export default rule;
