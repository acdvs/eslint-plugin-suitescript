import type {
  Identifier,
  ObjectExpression,
  Property,
  SpreadElement,
} from 'estree';

function getPropByKey(obj: ObjectExpression, key: string) {
  for (const _prop of obj.properties) {
    const prop = propAsIdentProp(_prop);

    if (prop?.key.name === key) {
      return prop;
    }
  }

  return null;
}

/**
 * Gets a list of all properties in an AST object node
 * @param {ASTNode} obj Target object
 * @returns {Array}
 */
function getPropList(obj: ObjectExpression) {
  return obj.properties
    .map((prop) => propAsIdentProp(prop)?.key.name)
    .filter(Boolean) as string[];
}

function propAsIdentProp(prop: Property | SpreadElement) {
  return prop.type === 'Property' && prop.key.type === 'Identifier'
    ? {
        ...prop,
        key: prop.key as Identifier,
      }
    : null;
}

export { getPropByKey, getPropList };
