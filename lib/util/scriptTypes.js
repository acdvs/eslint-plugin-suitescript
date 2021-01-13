/**
 * @fileoverview List of SuiteScript script types and their respective entry points
 * @author Adam Davies
 */

'use strict';

module.exports = {
  BundleInstallationScript: {
    entryPoints: [
      'afterInstall',
      'afterUpdate',
      'beforeInstall',
      'beforeUninstall',
      'beforeUpdate'
    ]
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
      'localizationContextExit'
    ]
  },
  MapReduceScript: {
    entryPoints: [
      'getInputData',
      'map',
      'reduce',
      'summarize'
    ]
  },
  MassUpdateScript: {
    entryPoints: ['each']
  },
  Portlet: {
    entryPoints: ['render']
  },
  Restlet: {
    entryPoints: [
      'delete',
      'get',
      'post',
      'put'
    ]
  },
  ScheduledScript: {
    entryPoints: ['execute']
  },
  SDFInstallationScript: {
    entryPoints: ['run']
  },
  Suitelet: {
    entryPoints: ['onRequest']
  },
  UserEventScript: {
    entryPoints: [
      'afterSubmit',
      'beforeLoad',
      'beforeSubmit'
    ]
  },
  WorkflowActionScript: {
    entryPoints: ['onAction']
  }
};

