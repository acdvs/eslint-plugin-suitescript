# suitescript/entry-points

Enforces the inclusion of at least one entry point based on the value provided in the `@NScriptType` tag. If no tag is provided, no entry point will be enforced.

## Rule Details

:white_check_mark: The following patterns are **correct**:

```js
/* eslint suitescript/entry-points: "error" */

/**
 * @NScriptType UserEventScript
 */

define([], function() {
  return {
    beforeLoad: function() {}
  }
});
```
```js
/* eslint suitescript/entry-points: "error" */

/**
 * @NScriptType ClientScript
 */

define([], function() {
  return {
    pageInit: function() {},
    somethingElse: function() {}
  }
});
```
```js
/* eslint suitescript/entry-points: "error" */

// No @NScriptType tag

define([], function() {
  return {
    somethingElse: function() {}
  }
});
```

:x: The following patterns are **incorrect**:

```js
/* eslint suitescript/entry-points: "error" */

/**
 * @NScriptType UserEventScript
 */

define([], function() {});
```
```js
/* eslint suitescript/entry-points: "error" */

/**
 * @NScriptType ClientScript
 */

define([], function() {
  return {
    somethingElse: function() {}
  }
});
```

### Script Types and Their Respective Entry Points

- BundleInstallationScript
  - afterInstall
  - afterUpdate
  - beforeInstall
  - beforeUninstall
  - beforeUpdate
- ClientScript
	- fieldChanged
	- lineInit
	- pageInit
	- postSourcing
	- saveRecord
	- sublistChanged
	- validateDelete
	- validateField
	- validateInsert
	- validateLine
	- localizationContextEnter
	- localizationContextExit
- MapReduceScript
	- getInputData
	- map
	- reduce
	- summarize
- MassUpdateScript
  - each
- Portlet
  - render
- Restlet
	- delete
	- get
	- post
	- put
- ScheduledScript
  - execute
- SDFInstallationScript
  - run
- Suitelet
  - onRequest
- UserEventScript
	- afterSubmit
	- beforeLoad
	- beforeSubmit
- WorkflowActionScript
  - onAction

## Version

This rule was introduced in version 1.0.0.

## Source

- [Rule source](../../lib/rules/entry-points.js)