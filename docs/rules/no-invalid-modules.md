# suitescript/no-invalid-modules

Enforces valid SuiteScript module names in the `define` array.

## Rule Details

:white_check_mark: The following patters are **correct**:

```js
/* eslint suitescript/no-invalid-modules: "error" */

define(['N/record'], function(record) {});
```
```js
/* eslint suitescript/no-invalid-modules: "error" */

define(['N/https', 'N/search'], function(https, search) {});
```
```js
/* eslint suitescript/no-invalid-modules: "error" */

define(['customModule'], function(customModule) {});
```

:x: The following pattern is **incorrect**:

```js
/* eslint suitescript/no-invalid-modules: "error" */

define(['N/somethingElse'], function(somethingElse) {});
```

## Version

This rule was introduced in version 1.0.0.

## Source

- [Rule source](../../lib/rules/no-invalid-modules.js)