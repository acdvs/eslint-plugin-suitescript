/**
 * @fileoverview Utilities for arrays of AST nodes
 * @author Adam Davies
 */

'use strict';

/**
 * Finds a property in list by its key
 * @param {ASTNode[]} arr Array of AST nodes
 * @param {number} count Required count
 * @param {string} type Element type
 * @param {boolean} exact If result count should be exact
 * @returns {boolean}
 */
function hasManyOfType(arr, count, type, exact) {
  let currCount = 0;

  for (let node of arr) {
    switch (node.type) {
      case 'Literal':
        if (typeof node.value === type) currCount++;
        break;
      case 'ObjectExpression':
        if (type === 'object') currCount++;
    }
  }

  return exact ? currCount === count : currCount >= count;
}

module.exports = {
  hasManyOfType
};