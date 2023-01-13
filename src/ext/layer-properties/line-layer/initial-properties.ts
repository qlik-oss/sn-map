import LayerType from '../../../utils/const/layer-type';
import Util from '../../../utils/util';
import getColorProperties from '../common/color/initial-properties';
import getDataProperties from '../common/data/initial-properties';
import getLocationProperties from '../common/location/initial-properties';
import getSizeProperties from '../common/size/initial-properties';

export default function getInitialProperties() {
  return {
    type: LayerType.LINE,
    cId: Util.generateId(),
    ...getDataProperties(2, 10000),
    ...getLocationProperties(LayerType.LINE),
    ...getSizeProperties(LayerType.LINE),
    ...getColorProperties(),
  };
}
