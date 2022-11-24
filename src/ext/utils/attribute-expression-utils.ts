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
  ExpressionFields.removeExpression(attrExprId, hqDef, dimIndex);
  ExpressionFields.addExpression(attrExprId, value, hqDef, isMeasure, dimIndex);
}
