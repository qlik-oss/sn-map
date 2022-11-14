import { getValue } from 'qlik-chart-modules';
import ExpressionFields from './expression-fields';

export function setAttributeExpression(
  props: LayerProperties,
  sourcePath: string,
  id: string = '',
  isMeasure: boolean = false,
  dimIndex: number = 0
) {
  const attrExprId = id !== '' ? id : sourcePath;
  const value = getValue(props, sourcePath);
  const hqDef = props.qHyperCubeDef;
  const libDef = getValue(hqDef, `qDimensions.${dimIndex}.qLibraryId`);
  const fieldDef = getValue(hqDef, `qDimensions.${dimIndex}.qDef.qFieldDefs.0`);
  ExpressionFields.removeExpression(attrExprId, hqDef);
  if (value.key !== libDef && !ExpressionFields.expressionAndFieldEquals(value.key, fieldDef)) {
    ExpressionFields.addExpression(attrExprId, value, hqDef, isMeasure);
  }
}
