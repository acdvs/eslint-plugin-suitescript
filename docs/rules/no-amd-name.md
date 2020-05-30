# suitescript/no-amd-name

Restricts naming of AMD modules.

## Rule Details

:white_check_mark: The following pattern is **correct**:

```js
/* eslint suitescript/no-amd-name: "error" */

define([], function() {});
```

:x: The following pattern is **incorrect**:

```js
/* eslint suitescript/no-amd-name: "error" */

define('myModule', [], function() {});
```

## Version

This rule was introduced in version 1.0.0.

## Source

- [Rule source](../../lib/rules/no-amd-name.js)