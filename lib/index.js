'use strict';

module.exports = {
  environments: require('./environments'),
  rules: {
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
  }
};
