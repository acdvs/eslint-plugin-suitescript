/**
 * @fileoverview Utilities for AST ObjectExpression nodes
 * @author Adam Davies
 */

'use strict';

/**
 * Finds a property in list by its key
 * @param {ASTNode} obj Target object
 * @param {string} key Key to search for in properties list
 * @returns {(Object|null)}
 */
function getPropByKey(obj, key) {
  if (obj.type !== 'ObjectExpression') return null;

  for (let prop of obj.properties) {
    if (prop.key.name === key) return prop;
  }

  return null;
}

/**
 * Gets a list of all properties in an AST object node
 * @param {ASTNode} obj Target object
 * @returns {Array}
 */
function getPropList(obj) {
  return obj.properties.map(prop => prop.key.name);
}

module.exports = {
  getPropByKey,
  getPropList
};