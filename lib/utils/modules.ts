import type { JSSyntaxElement } from 'eslint';
import type { CallExpression } from 'estree';

type Module = {
  name: string;
  variable: string;
  nodes: {
    name: JSSyntaxElement | null;
    variable: JSSyntaxElement | null;
  };
  isValid: boolean;
};

const N_MODULE_REGEX = /^N\//;
const MODULES = {
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

const moduleNames = Object.keys(MODULES);

function getModules(defineCallNode: CallExpression) {
  const modules: Module[] = [];

  let nameCount = 0;
  let varCount = 0;

  if (
    defineCallNode?.type === 'CallExpression' &&
    defineCallNode.callee.name === 'define'
  ) {
    const argCount = defineCallNode.arguments.length;

    if (argCount < 2 || argCount > 3) {
      return modules;
    }

    const moduleList = defineCallNode.arguments[argCount - 2];
    const callback = defineCallNode.arguments[argCount - 1];

    if (
      moduleList.type !== 'ArrayExpression' ||
      (callback.type !== 'FunctionExpression' &&
        callback.type !== 'ArrowFunctionExpression')
    ) {
      return modules;
    }

    nameCount = moduleList.elements.length;
    varCount = callback.params.length;

    const longerList =
      nameCount > varCount ? moduleList.elements : callback.params;

    for (let i = 0; i < longerList.length; i++) {
      const nameNode = moduleList.elements[i];
      const varNode = callback.params[i];

      modules.push({
        name: nameNode ? nameNode.value : null,
        variable: varNode ? varNode.name : null,
        nodes: {
          name: nameNode,
          variable: varNode,
        },
        isValid:
          !!nameNode &&
          (moduleNames.includes(nameNode.value) ||
            !N_MODULE_REGEX.test(nameNode.value)),
      });
    }
  }

  return modules;
}

function getModuleNames(defineCallNode: CallExpression) {
  const modules = getModules(defineCallNode);
  const moduleNames = modules.map((module) => module.name);

  return moduleNames;
}

function getModuleVars(defineCallNode: CallExpression) {
  const modules = getModules(defineCallNode);
  const moduleVars = modules.map((module) => module.variable);

  return moduleVars;
}

function getModuleNodePair(defineCallNode: CallExpression, moduleName: string) {
  const modules = getModules(defineCallNode);
  const targetModule = modules.find((m) => m.name === moduleName);

  return targetModule?.nodes;
}

export {
  getModuleNames,
  getModuleNodePair,
  getModules,
  getModuleVars,
  MODULES,
  moduleNames,
};
