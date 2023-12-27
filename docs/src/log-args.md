# suitescript/log-args

Enforces correct log arguments (title and details) in all `Log` methods.

## Rule Details

If no options are provided, the rule will require both title and details.

:white_check_mark: The following patterns are **correct**:

```js
/* eslint suitescript/log-args: "error" */

log.debug({ title: 'Title', details: 'Details' });
```
```js
/* eslint suitescript/log-args: "error" */

log.audit('Title', 'Details');
```
```js
/* eslint suitescript/log-args: "error" */

log.error('', 'Details');
```

:x: The following patterns are **incorrect**:

```js
/* eslint suitescript/log-args: "error" */

log.debug('Title');
```
```js
/* eslint suitescript/log-args: "error" */

log.audit({ details: 'Details' });
```

## Rule Options

```js
'suitescript/log-args': [<enabled>, {
  requireTitle: <boolean>,
  requireDetails: <boolean>
}]
```

> **Note**: Setting both options to `false` is the same as not using the rule at all. Setting both options to `true` is the same as not providing options.

### `requireTitle`

_default: true_

Explicitly requires a `title` argument no matter what.

```js
/* eslint suitescript/log-args: ["error", { requireTitle: true }] */

log.debug({ title: 'Title' });
```

### `requireDetails`

_default: true_

Explicitly requires a `details` argument no matter what.

```js
/* eslint suitescript/log-args: ["error", { requireDetails: true }] */

log.debug({ details: 'Details' });
```

## Version

This rule was introduced in version 1.0.0.

## Source

- [Rule source](../../lib/rules/log-args.js)