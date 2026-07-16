import type { ObjectExpression, Property, SpreadElement } from 'estree';

function getPropByKey(obj: ObjectExpression, key: string) {
  for (const _prop of obj.properties) {
    const prop = propAsIdentProp(_prop);

    if (prop?.key.name === key) {
      return prop;
    }
  }

  return null;
}

function getPropList(obj: ObjectExpression) {
  return obj.properties
    .map((prop) => propAsIdentProp(prop)?.key.name)
    .filter(Boolean) as string[];
}

function propAsIdentProp(prop: Property | SpreadElement) {
  return prop.type === 'Property' && prop.key.type === 'Identifier'
    ? {
        ...prop,
        key: prop.key,
      }
    : null;
}

export { getPropByKey, getPropList };
