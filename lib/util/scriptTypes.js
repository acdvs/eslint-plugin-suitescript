'use strict';

const scriptTypeMap = {
  BankConnectivityPlugin: {
    entryPoints: [
      'getRequiredConfigurationFields',
      'downloadPreviousDayBankStatementFile',
    ],
  },
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
  CustomGLPlugin: {
    entryPoitns: ['customizeGlImpact'],
  },
  DatasetBuilderPlugin: {
    entryPoints: ['createDataset'],
  },
  FiConnectivityPlugin: {
    entryPoints: ['getConfigurationIFrameUrl', 'getAccounts', 'getTransactionData'],
  },
  FiParserPlugin: {
    entryPoints: [
      'parseData',
      'getStandardTransactionCodes',
      'getExpenseCodes',
      'getConfigurationPageUrl',
    ],
  },
  MapReduceScript: {
    entryPoints: ['getInputData', 'map', 'reduce', 'summarize'],
  },
  MassUpdateScript: {
    entryPoints: ['each'],
  },
  PluginTypeImpl: {
    entryPoints: [],
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
  WorkbookBbuilderPlugin: {
    entryPoints: ['createWorkbook'],
  },
  WorkflowActionScript: {
    entryPoints: ['onAction'],
  },
};

const scriptTypes = Object.keys(scriptTypeMap).map(function (x) {
  return x.toLowerCase();
});

module.exports = {
  scriptTypeMap,
  scriptTypes,
};
