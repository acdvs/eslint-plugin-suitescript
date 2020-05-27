'use strict';

module.exports = {
  environments: require('./lib/environments'),
  rules: {
    'script-type': require('./lib/rules/script-type'),
    'api-version': require('./lib/rules/api-version'),
    'no-invalid-modules': require('./lib/rules/no-invalid-modules'),
    'no-extra-modules': require('./lib/rules/no-extra-modules'),
    'no-log-module': require('./lib/rules/no-log-module'),
    'log-args': require('./lib/rules/log-args'),
    'module-vars': require('./lib/rules/module-vars'),
    'no-amd-name': require('./lib/rules/no-amd-name'),
    'entry-points': require('./lib/rules/entry-points')
  }
};
