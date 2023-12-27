# suitescript/module-vars

Enforces correct module identifiers for each configured module name.

Requires at least one module name to be specified to take effect.

## Rule Details

:white_check_mark: The following patterns are **correct**:

```js
/* eslint suitescript/module-vars: ["error", { "N/record": "record" }] */

define(['N/record'], function (record) {});
```

```js
/* eslint suitescript/module-vars: ["error", { "N/ui/message": "message" }] */

define(['N/ui/message'], function (message) {});
```

:x: The following patterns are **incorrect**:

```js
/* eslint suitescript/module-vars: ["error", { "N/record": "record" }] */

define(['N/record'], function (rec) {});
```

```js
/* eslint suitescript/module-vars: ["error", { "N/ui/serverWidget": "serverWidget" }] */

define(['N/ui/serverWidget'], function (ui) {});
```

## Rule Options

Specify at least one module name with a corresponding variable name.

```js
'suitescript/module-vars': [<enabled>, {
  moduleName: <string>
  ...
}]
```

## Module Names

<MODULE_NAMES>

## Version

This rule was introduced in version 1.0.0.

## Source

- [Rule source](../../lib/rules/module-vars.js)
