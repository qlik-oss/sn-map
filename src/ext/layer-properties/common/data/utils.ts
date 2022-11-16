import LocationUtils from '../location/utils';
import { setAttributeExpression } from '../../../utils/attribute-expression-utils';

module DataUtils {
  export function updateAttributeExpressions(props: LayerProperties) {
    LocationUtils.updateLocationAttributeExpressions(props);
    setAttributeExpression(props, 'size.expression', 'size', true, 0);
  }
}

export default DataUtils;
