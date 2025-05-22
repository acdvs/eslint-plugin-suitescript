'use strict';

module.exports = {
  BundleInstallationScript: {
    entryPoints: [
      'afterInstall',
      'afterUpdate',
      'beforeInstall',
      'beforeUninstall',
      'beforeUpdate',
    ],
  },
  ClientScript: {
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
  MapReduceScript: {
    entryPoints: ['getInputData', 'map', 'reduce', 'summarize'],
  },
  MassUpdateScript: {
    entryPoints: ['each'],
  },
  Portlet: {
    entryPoints: ['render'],
  },
  Restlet: {
    entryPoints: ['delete', 'get', 'post', 'put'],
  },
  ScheduledScript: {
    entryPoints: ['execute'],
  },
  SDFInstallationScript: {
    entryPoints: ['run'],
  },
  Suitelet: {
    entryPoints: ['onRequest'],
  },
  UserEventScript: {
    entryPoints: ['afterSubmit', 'beforeLoad', 'beforeSubmit'],
  },
  WorkflowActionScript: {
    entryPoints: ['onAction'],
  },
  bankConnectivityPlugin: {
    entryPoints: [
      'getRequiredConfigurationFields',
      'downloadPreviousDayBankStatementFile',
    ],
  },
  datasetbuilderplugin: {
    entryPoints: ['createDataset'],
  },
  fiConnectivityPlugin: {
    entryPoints: ['getConfigurationIFrameUrl', 'getAccounts', 'getTransactionData'],
  },
  fiParserPlugin: {
    entryPoints: [
      'parseData',
      'getStandardTransactionCodes',
      'getExpenseCodes',
      'getConfigurationPageUrl',
    ],
  },
  workbookbuilderplugin: {
    entryPoints: ['createWorkbook'],
  },
  plugintypeimpl: {
    entryPoints: [],
  },
};
