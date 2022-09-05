import { getValue } from 'qlik-chart-modules';
import ExpressionFields from '../../../utils/expression-fields';

module LocationUtils {
  export function updateLocationAttributeExpressions(props: LayerProperties) {
    setLocationAttributeExpression(props);
    const hqDef = props.qHyperCubeDef;
    clearExpressions(hqDef);
    if (props.isLatLong) {
      const value = props.longitude;
      ExpressionFields.addExpression('longitude', value, hqDef);
    } else if (props.locationNamesAuto === false) {
      updateNamesAttributeExpressions(props);
    }
  }

  export function updateNamesAttributeExpressions(props: LayerProperties) {
    let value = props.locationCountry;
    const hqDef = props.qHyperCubeDef;
    ExpressionFields.addExpression('locationCountry', value, hqDef);
    if (getValue(props, 'locationCountry.key', '').trim().length > 0) {
      value = props.locationAdmin1;
      ExpressionFields.addExpression('locationAdmin1', value, hqDef);
      if (getValue(props, 'locationAdmin1.key', '').trim().length > 0) {
        value = props.locationAdmin2;
        ExpressionFields.addExpression('locationAdmin2', value, hqDef);
      }
    }
  }

  export function setLocationAttributeExpression(props: LayerProperties, dimIndex: number = 0) {
    const value = props.locationOrLatitude;
    const hqDef = props.qHyperCubeDef;
    const libDef = getValue(hqDef, `qDimensions.${dimIndex}.qLibraryId`);
    const fieldDef = getValue(hqDef, `qDimensions.${dimIndex}.qDef.qFieldDefs.0`);
    ExpressionFields.removeExpression('locationOrLatitude', hqDef);
    if (value.key !== libDef && !ExpressionFields.expressionAndFieldEquals(value.key, fieldDef)) {
      ExpressionFields.addExpression('locationOrLatitude', value, hqDef);
    }
  }

  export function clearExpressions(hqDef: NxHyperCubeDef) {
    ExpressionFields.removeExpression('longitude', hqDef);
    ExpressionFields.removeExpression('locationCountry', hqDef);
    ExpressionFields.removeExpression('locationAdmin1', hqDef);
    ExpressionFields.removeExpression('locationAdmin2', hqDef);
  }
}

export default LocationUtils;
