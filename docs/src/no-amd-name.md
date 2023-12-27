# suitescript/no-amd-name

:wrench: _The `--fix` option on the command line can automatically fix some of the problems reported by this rule._

Restricts naming of AMD modules.

Naming AMD modules [should generally be avoided](https://requirejs.org/docs/whyamd.html#namedmodules) because compilers will handle the ID-ing of modules internally where necessary.

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