import rule from '../../lib/rules/no-invalid-modules';
import ruleTester from '../rule-tester';

ruleTester.run('no-invalid-modules', rule, {
  valid: [
    {
      code: 'define(["N/record"], function(record) {});',
    },
    {
      code: 'define(["N/search"], function(search) {});',
    },
    {
      code: 'define(["customModule"], function(customModule) {});',
    },
    {
      code: 'define(["customModule", "N/file"], function(customModule, file) {});',
    },
    {
      code: 'define([], function() {});',
    },
  ],

  invalid: [
    {
      code: 'define(["N/invalid"], function(invalid) {});',
      errors: [{ messageId: 'invalidModule', data: { module: 'N/invalid' } }],
    },
    {
      code: 'define(["N/file", "N/invalid"], function(file, invalid) {});',
      errors: [{ messageId: 'invalidModule', data: { module: 'N/invalid' } }],
    },
    {
      code: 'define(["customModule", "N/invalid"], function(customModule, invalid) {});',
      errors: [{ messageId: 'invalidModule', data: { module: 'N/invalid' } }],
    },
  ],
});
