import { getValue } from 'qlik-chart-modules';
import getColorDefinition from '../common/color/definition';
import getDataDefinition from '../common/data/definition';
import getLocationDefinition from '../common/location/definition';
import getSizeDefinition from '../common/size/definition';
import Util from '../../utils/layers';
import LayerType from '../../../utils/const/layer-type';

export default function lineLayerDefinition({ translator }: EnvironmentType) {
  return {
    schemaIgnore: true,
    translation: 'geo.LineLayer',
    component: 'accordion',
    cacheKey: LayerType.LINE,
    title: function (properties: LineLayerProperties, handler: Object) {
      const qDimensions = getValue(properties, 'qHyperCubeDef.qDimensions');
      return Util.getLayerTitle(qDimensions, handler) || translator.get('geo.dropmenu.noName');
    },
    type: 'items',
    items: {
      general: { show: false },
      metadata: { show: false },
      data: getDataDefinition(2, 0, { translator }),
      location: getLocationDefinition(translator, LayerType.LINE),
      size: getSizeDefinition(LayerType.LINE, { translator }),
      color: getColorDefinition(),
    },
  };
}
