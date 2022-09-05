import LayerType from '../../../utils/const/layer-type';
import Util from '../../utils/util';
import getOptionsProperties from '../common/options/initial-properties';
import getFormatProperties from './formats/initial-properties';

export default function getInitialProperties() {
  return {
    type: 'GeodataLayer',
    cId: Util.generateId(),
    ...getFormatProperties(),
    ...getOptionsProperties(LayerType.GEODATA),
  };
}
