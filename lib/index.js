'use strict';

const allRules = {
  'script-type': require('./rules/script-type'),
  'api-version': require('./rules/api-version'),
  'no-invalid-modules': require('./rules/no-invalid-modules'),
  'no-extra-modules': require('./rules/no-extra-modules'),
  'no-log-module': require('./rules/no-log-module'),
  'log-args': require('./rules/log-args'),
  'module-vars': require('./rules/module-vars'),
  'no-amd-name': require('./rules/no-amd-name'),
  'entry-points': require('./rules/entry-points'),
  'no-module-extensions': require('./rules/no-module-extensions')
};

const moduleVarsConfig = {
  'N/action': 'action',
  'N/auth': 'auth',
  'N/cache': 'cache',
  'N/certificateControl': 'certificateControl',
  'N/commerce/recordView': 'recordView',
  'N/config': 'config',
  'N/crypto': 'crypto',
  'N/crypto/certificate': 'certificate',
  'N/currency': 'currency',
  'N/currentRecord': 'currentRecord',
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
  'N/log': 'log',
  'N/piremoval': 'piremoval',
  'N/plugin': 'plugin',
  'N/portlet': 'portlet',
  'N/query': 'query',
  'N/record': 'record',
  'N/redirect': 'redirect',
  'N/render': 'render',
  'N/runtime': 'runtime',
  'N/search': 'search',
  'N/sftp': 'sftp',
  'N/sso': 'sso',
  'N/task': 'task',
  'N/task/accounting/recognition': 'recognition',
  'N/transaction': 'transaction',
  'N/translation': 'translation',
  'N/ui/dialog': 'dialog',
  'N/ui/message': 'message',
  'N/ui/serverWidget': 'serverWidget',
  'N/url': 'url',
  'N/util': 'util',
  'N/workflow': 'workflow',
  'N/xml': 'xml'
};

const configBase = {
  plugins: ['suitescript'],
  env: {
    browser: true,
    amd: true,
    es2020: true
  },
  globals: {
    log: 'readonly'
  }
};

module.exports = {
  environments: require('./environments'),
  rules: allRules,
  configs: {
    all: {
      ...configBase,
      rules: {
        'suitescript/api-version': 'error',
        'suitescript/entry-points': 'error',
        'suitescript/log-args': 'error',
        'suitescript/module-vars': ['error', moduleVarsConfig],
        'suitescript/no-amd-name': 'error',
        'suitescript/no-extra-modules': 'error',
        'suitescript/no-invalid-modules': 'error',
        'suitescript/no-log-module': 'error',
        'suitescript/no-module-extensions': 'error',
        'suitescript/script-type': 'error'
      }
    },
    recommended: {
      ...configBase,
      rules: {
        'suitescript/api-version': 'error',
        'suitescript/entry-points': 'error',
        'suitescript/log-args': 'error',
        'suitescript/module-vars': ['error', moduleVarsConfig],
        'suitescript/no-amd-name': 'error',
        'suitescript/no-extra-modules': 'error',
        'suitescript/no-invalid-modules': 'error',
        'suitescript/no-log-module': 'error',
        'suitescript/no-module-extensions': 'error',
        'suitescript/script-type': 'error'
      }
    }
  }
};
