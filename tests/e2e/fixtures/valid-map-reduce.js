/**
 * A MapReduceScript with no errors.
 *
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
// biome-ignore lint/correctness/noUnusedFunctionParameters: record dep intentionally unused
define(['N/search', 'N/record'], (search, record) => {
  function getInputData() {
    return search.create({ type: 'salesorder' });
  }

  function map(context) {
    log.debug({ title: 'map', details: context.value });
  }

  function summarize(summary) {
    log.audit({ title: 'summarize', details: summary.usage });
  }

  return {
    getInputData: getInputData,
    map: map,
    summarize: summarize,
  };
});
