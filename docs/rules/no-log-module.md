# suitescript/no-log-module

Restricts loading of the N/log module in favor of global `log`.

In most cases, global `log` can be used instead of the N/log module.

## Rule Details

By default, the N/log module is allowed in client scripts because there it is used to log to NetSuite where it would otherwise be impossible. See the rule options below to modify this.

:white_check_mark: The following pattern is **correct**:

```js
/* eslint suitescript/no-log-module: "error" */

define([], function() {
  log.debug('Title', 'Details');
});
```

:x: The following pattern is **incorrect**:

```js
/* eslint suitescript/no-log-module: "error" */

define(['N/log'], function(log) {
  log.debug('Title', 'Details');
});
```

## Rule Options

```js
'suitescript/no-log-module': [<enabled>, {
  allowInClientScripts: <boolean>
}]
```

### `allowInClientScripts`

_default: true_

Allows the N/log module to be loaded in client scripts.

```js
/* eslint suitescript/no-log-module: ["error", { allowInClientScripts: false }] */

/**
 * @NScriptType ClientScript',
 */
define([], function() {
  console.log("can't use N\log");
});
```

## Version

This rule was introduced in version 1.0.0.

## Source

- [Rule source](../../lib/rules/no-log-module.js)