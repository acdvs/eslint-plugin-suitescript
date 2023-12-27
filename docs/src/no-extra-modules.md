# suitescript/no-extra-modules

Enforces an equal number of module literals and identifiers in the `define` call arguments.

## Rule Details

:white_check_mark: The following patterns are **correct**:

```js
/* eslint suitescript/no-extra-modules: "error" */

define([], function() {});
```
```js
/* eslint suitescript/no-extra-modules: "error" */

define(['N/search'], function(search) {});
```

:x: The following patterns are **incorrect**:

```js
/* eslint suitescript/no-extra-modules: "error" */

define(['N/file'], function(file, record) {});
```
```js
/* eslint suitescript/no-extra-modules: "error" */

define(['N/file', 'N/record'], function(file) {});
```

## Version

This rule was introduced in version 1.0.0.

## Source

- [Rule source](../../lib/rules/no-extra-modules.js)