/**
 * A Suitelet with mistakes.
 *
 * No version value.
 * @NApiVersion
 * Misspelled script type.
 * @NScriptType Suitlet
 */
define(['N/ui/serverWidget'], (serverWidget) => {
  // biome-ignore lint/correctness/noUnusedFunctionParameters: entry-point context intentionally unused
  function onRequest(context) {
    serverWidget.createForm({ title: 'Hello' });
  }

  return {
    onRequest: onRequest,
  };
});
