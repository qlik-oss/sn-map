import LayerType from '../../../utils/const/layer-type';
import Util from '../../../utils/util';
import getColorProperties from '../common/color/initial-properties';
import getDataProperties from '../common/data/initial-properties';
import getLocationProperties from '../common/location/initial-properties';
import getSizeProperties from '../common/size/initial-properties';

export default function getInitialProperties() {
  return {
    type: LayerType.POINT,
    cId: Util.generateId(),
    ...getDataProperties(1, 10000),
    ...getLocationProperties(LayerType.POINT),
    ...getSizeProperties(LayerType.POINT),
    ...getColorProperties(),
  };
}
