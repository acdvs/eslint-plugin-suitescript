import type { CallExpression, Identifier, Literal } from 'estree';

export type ModuleName = keyof typeof modules;

export interface ModuleNodes {
  name: Literal | null;
  variable: Identifier | null;
}

interface Module {
  name: string | null;
  variable: string | null;
  nodes: ModuleNodes;
  isValid: boolean;
}

const N_MODULE_REGEX = /^N\//;

export const modules = {
  'N/action': 'action',
  'N/auth': 'auth',
  'N/cache': 'cache',
  'N/certificateControl': 'certificateControl',
  'N/commerce/recordView': 'recordView',
  'N/compress': 'compress',
  'N/config': 'config',
  'N/crypto': 'crypto',
  'N/crypto/certificate': 'certificate',
  'N/crypto/random': 'random',
  'N/currency': 'currency',
  'N/currentRecord': 'currentRecord',
  'N/dataset': 'dataset',
  'N/datasetLink': 'datasetLink',
  'N/email': 'email',
  'N/encode': 'encode',
  'N/error': 'error',
  'N/file': 'file',
  'N/format': 'format',
  'N/format/i18n': 'i18n',
  'N/http': 'http',
  'N/https': 'https',
  'N/https/clientCertificate': 'clientCertificate',
  'N/keyControl': 'keyControl',
  'N/llm': 'llm',
  'N/log': 'log',
  'N/pgp': 'pgp',
  'N/piremoval': 'piremoval',
  'N/plugin': 'plugin',
  'N/portlet': 'portlet',
  'N/query': 'query',
  'N/record': 'record',
  'N/recordContext': 'recordContext',
  'N/redirect': 'redirect',
  'N/render': 'render',
  'N/runtime': 'runtime',
  'N/scriptTypes/restlet': 'restlet',
  'N/search': 'search',
  'N/sftp': 'sftp',
  'N/sso': 'sso',
  'N/suiteAppInfo': 'suiteAppInfo',
  'N/task': 'task',
  'N/task/accounting/recognition': 'recognition',
  'N/transaction': 'transaction',
  'N/translation': 'translation',
  'N/ui/dialog': 'dialog',
  'N/ui/message': 'message',
  'N/ui/serverWidget': 'serverWidget',
  'N/url': 'url',
  'N/util': 'util',
  'N/workbook': 'workbook',
  'N/workflow': 'workflow',
  'N/xml': 'xml',
};

export const moduleNames = Object.keys(modules);

export function getModules(defineCallNode: CallExpression): {
  list: Module[];
  varCount: number;
} {
  const list: Module[] = [];

  let varCount = 0;

  if (
    defineCallNode?.type === 'CallExpression' &&
    defineCallNode.callee.type === 'Identifier' &&
    defineCallNode.callee.name === 'define'
  ) {
    const argCount = defineCallNode.arguments.length;

    if (argCount < 2 || argCount > 3) {
      return { list, varCount };
    }

    const moduleList = defineCallNode.arguments[argCount - 2];
    const callback = defineCallNode.arguments[argCount - 1];

    if (
      moduleList.type !== 'ArrayExpression' ||
      (callback.type !== 'FunctionExpression' &&
        callback.type !== 'ArrowFunctionExpression')
    ) {
      return { list, varCount };
    }

    const nameCount = moduleList.elements.length;
    varCount = callback.params.length;

    const longerList =
      nameCount > varCount ? moduleList.elements : callback.params;

    for (let i = 0; i < longerList.length; i++) {
      const nameNode = moduleList.elements[i];
      const varNode = callback.params[i];

      const literalNameNode = nameNode?.type === 'Literal' ? nameNode : null;
      const identVarNode = varNode?.type === 'Identifier' ? varNode : null;

      list.push({
        name: literalNameNode ? (literalNameNode.value as string) : null,
        variable: identVarNode ? identVarNode.name : null,
        nodes: {
          name: literalNameNode,
          variable: identVarNode,
        },
        isValid:
          !!literalNameNode &&
          (moduleNames.includes(literalNameNode.value as string) ||
            !N_MODULE_REGEX.test(literalNameNode.value as string)),
      });
    }
  }

  return { list, varCount };
}

export function getModuleNames(defineCallNode: CallExpression) {
  const modules = getModules(defineCallNode);
  return modules.list.map((module) => module.name);
}

export function getModuleVars(defineCallNode: CallExpression) {
  const modules = getModules(defineCallNode);
  return modules.list.map((module) => module.variable);
}

export function getModuleNodePair(
  defineCallNode: CallExpression,
  moduleName: string,
) {
  const modules = getModules(defineCallNode);
  const targetModule = modules.list.find((m) => m.name === moduleName);

  return targetModule?.nodes;
}
