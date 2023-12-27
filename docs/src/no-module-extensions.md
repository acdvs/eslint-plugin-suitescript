# suitescript/no-module-extensions

:wrench: _The `--fix` option on the command line can automatically fix some of the problems reported by this rule._

Restricts filename extensions on module dependencies.

> **Note:** As of January 2021, there appears to be a NetSuite bug that intermittently causes an error (`SuiteScript 2.1 entry point scripts must implement one script type function..`) when attempting to upload script files that include dependencies with file extensions.

## Rule Details

:white_check_mark: The following pattern is **correct**:

```js
/* eslint suitescript/no-module-extensions: "error" */

define(['./lib'], function(lib) {});
```

:x: The following pattern is **incorrect**:

```js
/* eslint suitescript/no-module-extensions: "error" */

define(['./lib.js'], function(lib) {});
```

## Version

This rule was introduced in version 1.0.3

- [Rule source](../../lib/rules/no-module-extensions.js)
