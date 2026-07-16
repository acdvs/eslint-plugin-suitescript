/**
 * A UserEventscript with mistakes.
 *
 * Invalid version.
 * @NApiVersion 3.x
 * @NScriptType UserEventScript
 */
// biome-ignore lint/correctness/noUnusedFunctionParameters: rec and foo intentionally unused to trigger module-vars and no-invalid-modules
define(['N/record', 'N/log', 'N/fooBar'], (rec, logModule, foo) => {
  // biome-ignore lint/correctness/noUnusedFunctionParameters: entry-point context intentionally unused
  function onLoad(context) {
    logModule.debug('missing details');
  }

  // Wrong entry point name for UserEventScript.
  return {
    onLoad: onLoad,
  };
});
