import LayerType from '../../../../utils/const/layer-type';
import LocationUtils from '../location/utils';
import { updateSizeExpression } from '../size/definition';

module DataUtils {
  export function updateAttributeExpressions(properties: LayerProperties) {
    switch (properties.type) {
      case LayerType.POINT:
        updateSizeExpression(properties);
        break;
    }
    LocationUtils.updateLocationAttributeExpressions(properties);
  }
}

export default DataUtils;
