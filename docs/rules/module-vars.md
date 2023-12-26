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

- N/action
- N/auth
- N/cache
- N/certificateControl
- N/commerce/recordView
- N/compress
- N/config
- N/crypto
- N/crypto/certificate
- N/crypto/random
- N/currency
- N/currentRecord
- N/dataset
- N/datasetLink
- N/email
- N/encode
- N/error
- N/file
- N/format
- N/format/i18n
- N/http
- N/https
- N/https/clientCertificate
- N/keyControl
- N/log
- N/piremoval
- N/plugin
- N/portlet
- N/query
- N/record
- N/recordContext
- N/redirect
- N/render
- N/runtime
- N/search
- N/sftp
- N/sso
- N/suiteAppInfo
- N/task
- N/task/accounting/recognition
- N/transaction
- N/translation
- N/ui/dialog
- N/ui/message
- N/ui/serverWidget
- N/url
- N/util
- N/workbook
- N/workflow
- N/xml

## Version

This rule was introduced in version 1.0.0.

## Source

- [Rule source](../../lib/rules/module-vars.js)
