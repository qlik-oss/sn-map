import { getValue } from 'qlik-chart-modules';
import { FieldsModel } from '../../models/fields-model';
import DefaultProperties from '../../utils/const/default-properties';
import Utils from '../../utils/util';

module DefaultFields {
  export function setLocation(dimension: NxDimension, layerProps: LayerProperties) {
    let dimField = getValue(dimension, 'qDef.qFieldDefs.0');
    const isRegularField = !!dimField;
    dimField = isRegularField ? dimField : FieldsModel.fieldNameFromLibraryDimension(dimension.qLibraryId);

    const setProps = (key: string, label: string, type: string) => {
      layerProps.locationOrLatitude.key = key;
      layerProps.locationOrLatitude.label = label;
      layerProps.locationOrLatitude.type = type;
      layerProps.locationDefault = key;
    };

    // the idea is that we do not change the location if it was set by the user, locationDefault tracks what has been set as default
    if (
      getValue(layerProps, 'locationOrLatitude.key', '').trim().length === 0 ||
      layerProps.locationOrLatitude.key === layerProps.locationDefault
    ) {
      if (dimField) {
        const relatedField = FieldsModel.relatedFieldName(dimField, layerProps.type);
        if (relatedField) {
          const key = Utils.bracketStringIfNeeded(relatedField);
          setProps(key, relatedField, 'expression');
          return;
        }
        if (isRegularField) {
          const key = Utils.bracketStringIfNeeded(dimField);
          setProps(key, dimField, 'expression');
          return;
        }
      }
      setProps(dimension.qLibraryId, '', 'libraryItem');
    }
  }

  /**
   * Sets a good default color so that new layers get different colors. Sets an indexed color in layerProps that is not used in
   * other layers (layers) if possible.
   */
  export function setColor(layerProps: LayerProperties, layers: LayerProperties[]) {
    const defaultColorValues = DefaultProperties.COLOR;

    if (!layerProps.color) return;
    // first attemt is to set to first unused
    let index = -1;
    for (let c = 0; c < defaultColorValues.length; c++) {
      let ok = true;
      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        if (layer.color && layer.color.mode === 'primary') {
          if (layer.color.paletteColor.index === defaultColorValues[c].index) {
            ok = false;
            break;
          }
        }
      }
      if (ok) {
        index = c;
        break;
      }
    }

    // second is to set to based on number of layers
    if (index === -1) {
      index = layers.length % defaultColorValues.length;
    }
    const defaultColor = defaultColorValues[index];
    layerProps.color.mode = 'primary';
    layerProps.color.paletteColor = defaultColor;
  }
}

export default DefaultFields;
