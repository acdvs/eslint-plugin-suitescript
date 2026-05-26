import type { Rule } from 'eslint';
import type { CallExpression } from 'estree';
import { getModules, moduleNames } from '../utils/modules';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce correct module identifiers for each configured module',
      url: 'https://github.com/acdvs/eslint-plugin-suitescript/blob/master/docs/rules/module-vars.md',
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
        if (!module.nodes.variable) continue;

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

/**
 * Get schema properties from module names
 * @returns {Object}
 */
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
