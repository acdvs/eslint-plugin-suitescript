# suitescript/api-version

Enforces valid `@NApiVersion` tag values in the header block comment of every SuiteScript file.

Does not report missing `@NApiVersion` tags.

## Rule Details

Valid tag values are `1.0`, `2.x`, `2.0`, and `2.1`.

:white_check_mark: Using one of these values, the following pattern is **correct**:

```js
/* eslint suitescript/api-version: "error" */

/**
 * @NApiVersion [value]
 */
```

:x: The following patterns are **incorrect**:

```js
/* eslint suitescript/api-version: "error" */

/**
 * @NApiVersion
 */
```
```js
/* eslint suitescript/api-version: "error" */

/**
 * @NApiVersion2
 */
```
```js
/* eslint suitescript/api-version: "error" */

/**
 * @NApiVersion 2
 */
```

## Version

This rule was introduced in version 1.0.0.

## Source

- [Rule source](../../lib/rules/api-version.js)