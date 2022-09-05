import { getValue } from 'qlik-chart-modules';
import LayerType from '../../utils/const/layer-type';

module LayerUtil {
  const LAYER_ORDER_PRIORITY: string[] = [
    LayerType.POINT,
    LayerType.CHART,
    LayerType.LINE,
    LayerType.DENSITY,
    LayerType.AREA,
    LayerType.GEODATA,
  ];

  /**
   * Gets layer order priority based on layer type.
   * A lower number means higher priority.
   * Unknown layer types get a very low priority.
   */
  function getOrderPriority(layerType: string) {
    const idx = LAYER_ORDER_PRIORITY.indexOf(layerType);
    return idx === -1 ? 9999 : idx;
  }

  /**
   * Inserts the given layer into the layer list, depending on layer type and list composition and also sets a default color based on used colors if color is auto.
   * @param layerProps The properties of the layer to insert.
   * @param layers Layer list to insert into.
   * @returns The index of the inserted layer.
   */
  export function insertLayer(layerProps: LayerProperties, layers: LayerProperties[]) {
    const priority = getOrderPriority(layerProps.type);
    for (let i = 0; i < layers.length; i++) {
      if (getOrderPriority(layers[i].type) >= priority) {
        layers.splice(i, 0, layerProps);
        return i;
      }
    }
    layers.push(layerProps);
    return layers.length - 1;
  }

  export function extractTitle(dimensionProperty: NxDimension, dimensionLayout: NxDimensionInfo) {
    if (dimensionLayout.qError) {
      // TODO: get error code and show translation
      return 'Error';
    }

    const libraryId = dimensionProperty.qLibraryId;
    const isDrilldown = dimensionLayout.qGrouping === 'H';

    if (isDrilldown || libraryId) {
      return dimensionLayout.title || '';
    }

    return getValue(dimensionProperty, 'qDef.qLabelExpression') || dimensionLayout.qFallbackTitle || '';
  }

  export function getLayerTitle(qDimensions: NxDimension[], handler: any) {
    if (!qDimensions.length) {
      return '';
    }

    const dimensionProperty = qDimensions[0];
    const dimensionLayout = handler.getDimensionLayout(dimensionProperty.qDef.cId);

    if (!dimensionLayout) {
      return '';
    }

    return extractTitle(dimensionProperty, dimensionLayout);
  }
}

export default LayerUtil;
