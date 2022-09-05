import { setValue, getValue } from 'qlik-chart-modules';
import Utils from './util';

module ExpressionFields {
  /**
   * Add expression to hypercube if it is defined and not empty.
   * @param id Id of this expression
   * @param expression Expression property with values to set.
   * @param hqDef Hyper cube definition to add in
   * @param isMeasure Set to true if library items are measure library items
   */
  export function addExpression(
    id: string,
    expression: ExpressionProp | undefined,
    hqDef: NxHyperCubeDef,
    isMeasure: boolean = false,
    dimIndex: number = 0
  ) {
    if (!hqDef.qDimensions[0] || getValue(expression, 'key', '').trim().length === 0) return;

    const index = dimIndex;
    const isLibItem = expression?.type === 'libraryItem';
    const isDimension = isLibItem && !isMeasure; // use dim expression in all cases except for library items for dimension expressions
    const exprItem: NxAttrDimDef | NxAttrExprDef = { id: id, qNumFormat: expression?.qNumFormat };
    exprItem[isLibItem ? 'qLibraryId' : 'qExpression'] = expression?.key;

    if (isDimension) {
      hqDef.qDimensions[index].qAttributeDimensions.push(exprItem);
    } else {
      hqDef.qDimensions[index].qAttributeExpressions.push(exprItem);
    }
  }

  /**
   * Remove all instances of an expression from the hypercube.
   * @param id Id of this expression
   * @param hqDef Hyper cube definition to add in
   */
  export function removeExpression(id: string, hqDef: NxHyperCubeDef, dimIndex: number = 0) {
    if (!hqDef.qDimensions[0]) return;

    const pathAttributeDimensions = `qDimensions.${dimIndex}.qAttributeDimensions`;
    const pathAttributeExpressions = `qDimensions.${dimIndex}.qAttributeExpressions`;

    let attributeDimensions = getValue(hqDef, pathAttributeDimensions, []);
    let attributeExpressions = getValue(hqDef, pathAttributeExpressions, []);

    attributeDimensions = attributeDimensions.filter((item: NxAttrDimDef) => item.id !== id);
    attributeExpressions = attributeExpressions.filter((item: NxAttrExprDef) => item.id !== id);

    setValue(hqDef, pathAttributeDimensions, attributeDimensions);
    setValue(hqDef, pathAttributeExpressions, attributeExpressions);
  }

  /**
   * Returns true if the first string equals the second, ignoring initial = and surrounding [] in first string.
   */
  export function expressionAndFieldEquals(expression: string, field: string) {
    if (expression === field) return true;
    if (expression.length > 1 && expression.charAt(0) === '=') {
      expression = expression.substring(1);
      if (expression === field) return true;
    }
    if (
      expression.length > 2 &&
      expression.charAt(0) === '[' &&
      expression.charAt(expression.length - 1) === ']' &&
      expression.substring(1, expression.length - 1) === field
    )
      return true;
    return false;
  }

  /**
   * Workaround for the case when, in a color-by-dropdown, the generated item "Dimension 1" is selected and the dimension
   * is a master item, the properties are added like it was a field. This workaround replaces it with a proper library id.
   */
  export function setLibraryDimensionWorkaround(props: LayerProperties, expr: ExpressionProp) {
    const idx = expr.activeDimensionIndex;
    if (idx !== undefined) {
      // user has chosen "Dimension 1",
      // workaround for library dimensions which are not set properly
      // set to actual library item
      const libraryId = getValue(props, `qHyperCubeDef.qDimensions.${idx}.qLibraryId`);
      if (libraryId) {
        // its a library item, must change to a libraryId
        expr.key = libraryId;
        expr.label = '';
        expr.type = 'libraryItem';
        expr.activeDimensionIndex = undefined;
      } else {
        expr.key = Utils.bracketStringIfNeeded(expr.key);
      }
    }
  }
}

export default ExpressionFields;
