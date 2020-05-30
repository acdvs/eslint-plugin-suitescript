# suitescript/no-log-module

Restricts loading of the N/log module in favor of global `Log`.

## Rule Details

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

## Version

This rule was introduced in version 1.0.0.

## Source

- [Rule source](../../lib/rules/no-log-module.js)