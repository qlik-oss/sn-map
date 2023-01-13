import { getValue } from 'qlik-chart-modules';
import LayerType from '../../../../utils/const/layer-type';
import LocationUtils from '../location/utils';
import { updateSizeExpression } from '../size/definition';

module DataUtils {
  export function updateAttributeExpressions(properties: LayerProperties) {
    switch (properties.type) {
      case LayerType.AREA:
        LocationUtils.updateLocationAttributeExpressions('', properties);
        break;
      case LayerType.POINT:
        updateSizeExpression(properties);
        LocationUtils.updateLocationAttributeExpressions('', properties);
        break;
      case LayerType.LINE:
        const dimensions = getValue(properties, 'qHyperCubeDef.qDimensions', []);
        LocationUtils.updateLocationAttributeExpressions('', properties, 0);
        if (dimensions.length > 1) {
          // Two dimensions: clear endPoint on the first dimension and set it on the second dimension
          LocationUtils.clearExpressions('endPoint.', properties.qHyperCubeDef, 0);
          LocationUtils.updateLocationAttributeExpressions('endPoint.', properties, 1);
        } else {
          // One dimension: set endPoint location on the first dimension
          LocationUtils.updateLocationAttributeExpressions('endPoint.', properties, 0);
        }
        break;
    }
  }
}

export default DataUtils;
