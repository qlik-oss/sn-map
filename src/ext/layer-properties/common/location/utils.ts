import { getValue } from 'qlik-chart-modules';
import ExpressionFields from '../../../utils/expression-fields';

module LocationUtils {
  export function updateLocationAttributeExpressions(ref: string, props: LayerProperties, dimIndex: number = 0) {
    const hqDef = props.qHyperCubeDef;
    clearExpressions(ref, hqDef, dimIndex);
    setLocationAttributeExpression(ref, props, dimIndex);
    if (getValue(props, `${ref}isLatLong`)) {
      const value = getValue(props, `${ref}longitude`);
      ExpressionFields.addExpression(`${ref}longitude`, value, hqDef, false, dimIndex);
    } else if (getValue(props, `${ref}locationNamesAuto`) === false) {
      updateNamesAttributeExpressions(ref, props, dimIndex);
    }
  }

  export function updateNamesAttributeExpressions(ref: string, props: LayerProperties, dimIndex: number = 0) {
    const hqDef = props.qHyperCubeDef;
    let value = getValue(props, `${ref}locationCountry`);
    ExpressionFields.addExpression(`${ref}locationCountry`, value, hqDef, false, dimIndex);
    if (getValue(props, `${ref}locationCountry.key`, '').trim().length > 0) {
      value = getValue(props, `${ref}locationAdmin1`);
      ExpressionFields.addExpression(`${ref}locationAdmin1`, value, hqDef, false, dimIndex);
      if (getValue(props, `${ref}locationAdmin1.key`, '').trim().length > 0) {
        value = getValue(props, `${ref}locationAdmin2`);
        ExpressionFields.addExpression(`${ref}locationAdmin2`, value, hqDef, false, dimIndex);
      }
    }
  }

  export function setLocationAttributeExpression(ref: string, props: LayerProperties, dimIndex: number = 0) {
    const hqDef = props.qHyperCubeDef;
    const value = getValue(props, `${ref}locationOrLatitude`);
    const libDef = getValue(hqDef, `qDimensions.${dimIndex}.qLibraryId`);
    const fieldDef = getValue(hqDef, `qDimensions.${dimIndex}.qDef.qFieldDefs.0`);
    // Only set the location if it's different from the dimension
    if (value.key !== libDef && !ExpressionFields.expressionAndFieldEquals(value.key, fieldDef)) {
      ExpressionFields.addExpression(`${ref}locationOrLatitude`, value, hqDef, false, dimIndex);
    }
  }

  export function clearExpressions(ref: string, hqDef: NxHyperCubeDef, dimIndex: number = 0) {
    ExpressionFields.removeExpression(`${ref}locationOrLatitude`, hqDef, dimIndex);
    ExpressionFields.removeExpression(`${ref}longitude`, hqDef, dimIndex);
    ExpressionFields.removeExpression(`${ref}locationCountry`, hqDef, dimIndex);
    ExpressionFields.removeExpression(`${ref}locationAdmin1`, hqDef, dimIndex);
    ExpressionFields.removeExpression(`${ref}locationAdmin2`, hqDef, dimIndex);
  }
}

export default LocationUtils;
