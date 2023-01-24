import LayerType from '../../../utils/const/layer-type';
import Util from '../../../utils/util';
import getColorProperties from '../common/color/initial-properties';
import getDataProperties from '../common/data/initial-properties';
import getLocationProperties from '../common/location/initial-properties';

export default function getInitialProperties() {
  return {
    type: LayerType.AREA,
    cId: Util.generateId(),
    ...getDataProperties(1, 1000),
    ...getLocationProperties(LayerType.AREA),
    ...getColorProperties(),
  };
}
