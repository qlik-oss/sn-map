import LocationUtils from '../location/utils';

module DataUtils {
  export function updateAttributeExpressions(props: LayerProperties) {
    LocationUtils.updateLocationAttributeExpressions(props);
  }
}

export default DataUtils;
