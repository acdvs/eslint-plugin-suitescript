'use strict';

const scriptTypes = [
  {
    name: 'BankConnectivityPlugin',
    entryPoints: [
      'getRequiredConfigurationFields',
      'downloadPreviousDayBankStatementFile',
    ],
  },
  {
    name: 'BundleInstallationScript',
    entryPoints: [
      'afterInstall',
      'afterUpdate',
      'beforeInstall',
      'beforeUninstall',
      'beforeUpdate',
    ],
  },
  {
    name: 'ClientScript',
    entryPoints: [
      'fieldChanged',
      'lineInit',
      'pageInit',
      'postSourcing',
      'saveRecord',
      'sublistChanged',
      'validateDelete',
      'validateField',
      'validateInsert',
      'validateLine',
      'localizationContextEnter',
      'localizationContextExit',
    ],
  },
  { name: 'CustomGLPlugin', entryPoints: ['customizeGlImpact'] },
  { name: 'DatasetBuilderPlugin', entryPoints: ['createDataset'] },
  {
    name: 'FiConnectivityPlugin',
    entryPoints: ['getConfigurationIFrameUrl', 'getAccounts', 'getTransactionData'],
  },
  {
    name: 'FiParserPlugin',
    entryPoints: [
      'parseData',
      'getStandardTransactionCodes',
      'getExpenseCodes',
      'getConfigurationPageUrl',
    ],
  },
  {
    name: 'MapReduceScript',
    entryPoints: ['getInputData', 'map', 'reduce', 'summarize'],
  },
  { name: 'MassUpdateScript', entryPoints: ['each'] },
  { name: 'PluginTypeImpl', entryPoints: [] },
  { name: 'Portlet', entryPoints: ['render'] },
  { name: 'Restlet', entryPoints: ['delete', 'get', 'post', 'put'] },
  { name: 'ScheduledScript', entryPoints: ['execute'] },
  { name: 'SDFInstallationScript', entryPoints: ['run'] },
  {
    name: 'Suitelet',
    entryPoints: ['onRequest'],
  },
  {
    name: 'UserEventScript',
    entryPoints: ['afterSubmit', 'beforeLoad', 'beforeSubmit'],
  },
  {
    name: 'WorkbookBbuilderPlugin',
    entryPoints: ['createWorkbook'],
  },
  {
    name: 'WorkflowActionScript',
    entryPoints: ['onAction'],
  },
];

function getScriptTypeDef(scriptType) {
  return (
    !!scriptType &&
    scriptTypes.find((x) => x.name.toLowerCase() === scriptType.toLowerCase())
  );
}

module.exports = {
  scriptTypes,
  getScriptTypeDef,
};
