import type { Rule } from 'eslint';
import apiVersion from './api-version';
import entryPoints from './entry-points';
import logArgs from './log-args';
import moduleVars from './module-vars';
import noInvalidModules from './no-invalid-modules';
import noLogModule from './no-log-module';
import scriptType from './script-type';

const rules = {
  'api-version': apiVersion,
  'entry-points': entryPoints,
  'log-args': logArgs,
  'module-vars': moduleVars,
  'no-invalid-modules': noInvalidModules,
  'no-log-module': noLogModule,
  'script-type': scriptType,
} satisfies Record<string, Rule.RuleModule>;

export default rules;
