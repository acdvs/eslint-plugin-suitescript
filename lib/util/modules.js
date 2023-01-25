/**
 * @fileoverview Utilities for defined modules
 * @author Adam Davies
 */

'use strict';

const N_MODULE_REGEX = /^N\//;
const MODULE_NAMES = require('./moduleNames');

/**
 * Maps the define callback params to the module array
 * Includes module names that don't have assigned callback params
 * @param {ASTNode} defineCallNode Root define call node
 * @returns {Object}
 */
function getModules(defineCallNode) {
  let modules = {
    list: [],
    nameCount: 0,
    varCount: 0
  };

  if (
    defineCallNode &&
    defineCallNode.type === 'CallExpression' &&
    defineCallNode.callee.name === 'define'
  ) {
    const argCount = defineCallNode.arguments.length;

    if (argCount < 2 || argCount > 3) {
      return modules;
    }

    const moduleListArg = defineCallNode.arguments[argCount - 2];
    const callbackArg = defineCallNode.arguments[argCount - 1];

    if (
      moduleListArg.type !== 'ArrayExpression' ||
      (callbackArg.type !== 'FunctionExpression' && callbackArg.type !== 'ArrowFunctionExpression' && callbackArg.type !== 'Identifier')
    ) {
      return modules;
    }

    let moduleList = moduleListArg;
    let callback = callbackArg;

    // If the callback is defined elsewhere, attempt to find it. This behaviour is not (yet) supported for the module list.
    if (callbackArg.type === 'Identifier') {
      callback = defineCallNode.parent.parent.body.filter(
        node => node.type === 'FunctionDeclaration' && node.id.name === callbackArg.name
      )?.[0];

      if (!callback) {
          return modules;
      }
    }

    modules.nameCount = moduleList.elements.length;
    modules.varCount = callback.params.length;

    const longerList = modules.nameCount > modules.varCount ? moduleList.elements : callback.params;

    for (let i = 0; i < longerList.length; i++) {
      const nameNode = moduleList.elements[i];
      const varNode = callback.params[i];

      modules.list.push({
        name: nameNode ? nameNode.value : null,
        variable: varNode ? varNode.name : null,
        nodes: {
          name: nameNode,
          variable: varNode
        },
        isValid: !!nameNode && (MODULE_NAMES.includes(nameNode.value) || !N_MODULE_REGEX.test(nameNode.value))
      });
    }
  }

  return modules;
}

/**
 * Gets the literal string names of all modules
 * @param {ASTNode} defineCallNode Root define call node
 * @returns {Array}
 */
function getModuleNames(defineCallNode) {
  const modules = getModules(defineCallNode).list;
  const moduleNames = modules.map(module => module.name);

  return moduleNames;
}

/**
 * Gets the variable names of all modules
 * @param {ASTNode} defineCallNode Root define call node
 * @returns {Array}
 */
function getModuleVars(defineCallNode) {
  const modules = getModules(defineCallNode).list;
  const moduleVars = modules.map(module => module.variable);

  return moduleVars;
}

/**
 * Gets the name and variable nodes of a module by name
 * @param {ASTNode} defineCallNode Root define call node
 * @param {string} moduleName Module name in N/ format
 * @returns {(Object|boolean)}
 */
function getModuleNodePair(defineCallNode, moduleName) {
  const modules = getModules(defineCallNode).list;
  const targetModule = modules.find(m => m.name === moduleName);

  return targetModule && targetModule.nodes;
}

module.exports = {
  getModules,
  getModuleNames,
  getModuleVars,
  getModuleNodePair
};
