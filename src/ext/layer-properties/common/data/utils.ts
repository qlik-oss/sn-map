import LocationUtils from '../location/utils';
import { updateSizeExpression } from '../size/definition';

module DataUtils {
  export function updateAttributeExpressions(props: LayerProperties) {
    LocationUtils.updateLocationAttributeExpressions(props);
    updateSizeExpression(props);
  }
}

export default DataUtils;
