# suitescript/script-type

Enforces valid `@NScriptType` tag values in the header block comment of every SuiteScript file.

Does not report missing `@NScriptType` tags.

## Rule Details

Valid tag values are found below.

:white_check_mark: Using one of these values, the following pattern is **correct**:

```js
/* eslint suitescript/script-type: "error" */

/**
 * @NScriptType [value]
 */
```

:x: The following patterns are **incorrect**:

```js
/* eslint suitescript/script-type: "error" */

/**
 * @NScriptType
 */
```
```js
/* eslint suitescript/script-type: "error" */

/**
 * @NScriptTypeSuitelet
 */
```
```js
/* eslint suitescript/script-type: "error" */

/**
 * @NScriptType Client
 */
```

## Script Types

- BundleInstallationScript
- ClientScript
- MapReduceScript
- MassUpdateScript
- Portlet
- Restlet
- ScheduledScript
- SDFInstallationScript
- Suitelet
- UserEventScript
- WorkflowActionScript

## Version

This rule was introduced in version 1.0.0.

## Source

- [Rule source](../../lib/rules/script-type.js)